/** Exercise actual media playback and chapter timing under the Pages subpath. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (!process.env.PLAYWRIGHT_MODULE || !process.env.CHROMIUM_PATH) {
  throw new Error('Set PLAYWRIGHT_MODULE and CHROMIUM_PATH to local Playwright and Chromium paths.');
}
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const prefix = '/g1-robot-burpee/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (!url.pathname.startsWith(prefix)) { res.writeHead(404).end(); return; }
  const relative = decodeURIComponent(url.pathname.slice(prefix.length)) || 'index.html';
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  const size = fs.statSync(file).size;
  const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  let begin = 0, end = size - 1;
  if (range) {
    begin = Number(range[1]);
    end = range[2] ? Math.min(Number(range[2]), end) : end;
    if (begin > end) { res.writeHead(416).end(); return; }
    headers['Content-Range'] = `bytes ${begin}-${end}/${size}`;
  }
  headers['Content-Length'] = end - begin + 1;
  res.writeHead(range ? 206 : 200, headers);
  const stream = fs.createReadStream(file, { start: begin, end });
  res.on('close', () => stream.destroy());
  stream.pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const output = path.join(root, 'test-results');
fs.mkdirSync(output, { recursive: true });
let browser;
const checks = [];
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(`http://127.0.0.1:${server.address().port}${prefix}`);
  await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
  assert.equal(await page.title(), 'G1 Robot Performance created by GPT-6-Astra');
  assert.equal(await page.locator('[data-view="transition"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('[data-speed="1"]').getAttribute('aria-pressed'), 'true');
  const media = await page.locator('video').evaluate(v => ({ duration: v.duration, width: v.videoWidth, height: v.videoHeight, paused: v.paused }));
  assert(Math.abs(media.duration - 156.35) < 0.05);
  assert(media.paused);
  checks.push('Pages subpath, media metadata and defaults');
  await page.screenshot({ path: path.join(output, 'desktop.png'), fullPage: true });
  await page.locator('#start').click();
  await page.waitForFunction(() => document.querySelector('video').currentTime > .5);
  await page.locator('video').evaluate(v => v.pause());
  for (const speed of [0.5, 1, 1.5, 2]) {
    await page.locator(`[data-speed="${speed}"]`).click();
    assert.equal(await page.locator('video').evaluate(v => v.playbackRate), speed);
  }
  checks.push('Real playback and all four playback rates');
  await page.locator('video').evaluate(v => { v.currentTime = 123; });
  await page.waitForFunction(() => !document.querySelector('video').seeking);
  await page.locator('[data-view="fixed"]').click();
  await page.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 2 && Math.abs(v.currentTime - 123) < .1; });
  assert.equal(await page.locator('video').evaluate(v => v.paused), true);
  assert.equal(await page.locator('video').evaluate(v => v.playbackRate), 2);
  checks.push('Paused camera switch preserves time and 2× rate');
  await page.locator('video').evaluate(v => v.play());
  await page.locator('[data-view="transition"]').click();
  await page.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 2 && !v.paused && v.currentTime > 123.2; });
  assert.equal(await page.locator('video').evaluate(v => v.playbackRate), 2);
  await page.locator('video').evaluate(v => v.pause());
  checks.push('Playing camera switch resumes playback with the selected rate');
  await page.evaluate(() => {
    document.querySelector('video').currentTime = 110;
    for (const view of ['fixed', 'transition', 'fixed', 'transition']) document.querySelector(`[data-view="${view}"]`).click();
    document.querySelector('[data-speed="1.5"]').click();
  });
  await page.waitForFunction(() => { const v = document.querySelector('video'); return v.readyState >= 2 && Math.abs(v.currentTime - 110) < .1; });
  assert.equal(await page.locator('video').evaluate(v => v.paused), true);
  assert.equal(await page.locator('video').evaluate(v => v.playbackRate), 1.5);
  checks.push('Rapid camera switching and rate changes during loading');
  const actions = await page.evaluate(() => window.G1_TIMELINE.phases.flatMap(phase => phase.actions));
  for (const [index, action] of actions.entries()) {
    await page.locator('.action-button').nth(index).click();
    await page.waitForFunction(time => { const v = document.querySelector('video'); return !v.seeking && Math.abs(v.currentTime - time) < .02; }, action.start);
    assert.equal(await page.locator('.action-button[aria-current="step"] span').textContent(), action.label);
    assert.equal(await page.locator('.phase.active').count(), 1);
  }
  checks.push(`All ${actions.length} action buttons seek and highlight correctly`);
  // Advance across a boundary through playback, not through a chapter button.
  await page.locator('[data-speed="1"]').click();
  await page.locator('video').evaluate(async v => { v.currentTime = 121.8; await v.play(); });
  await page.waitForFunction(() => document.querySelector('#current-action').textContent === '曲臂向下');
  await page.locator('video').evaluate(v => v.pause());
  checks.push('Highlight follows playback across an action boundary');
  await page.locator('video').evaluate(async v => { v.currentTime = v.duration - .2; await v.play(); });
  await page.waitForFunction(() => document.querySelector('video').ended);
  assert.equal(await page.locator('#playback-state').textContent(), '表演结束');
  assert.equal(await page.locator('#current-action').textContent(), '再次秀肌肉');
  await page.locator('.action-button').first().click();
  assert.equal(await page.locator('#current-action').textContent(), '自然站立');
  checks.push('Video completion and backward seeking');
  await page.locator('.action-button').filter({ hasText: '曲臂向下' }).click();
  await page.waitForFunction(() => !document.querySelector('video').seeking);
  await page.screenshot({ path: path.join(output, 'desktop-playing.png'), fullPage: true });
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
    for (const selector of ['[data-view="fixed"]', '[data-speed="0.5"]', '.action-button']) {
      const box = await page.locator(selector).first().boundingBox();
      assert(box.x >= 0 && box.x + box.width <= width);
    }
    if (width === 390) await page.screenshot({ path: path.join(output, 'mobile.png'), fullPage: true });
  }
  checks.push('390px, 320px and tablet layouts without horizontal overflow');
  assert.deepEqual(errors, []);
  await page.route('**/fixed.mp4', route => route.abort('failed'));
  await page.locator('[data-view="fixed"]').click();
  await page.waitForFunction(() => !document.querySelector('#player-error').hidden);
  assert.match(await page.locator('#player-error').textContent(), /视频加载失败/);
  await page.unroute('**/fixed.mp4');
  await page.locator('[data-view="fixed"]').click();
  await page.waitForFunction(() => document.querySelector('video').readyState >= 2 && !document.querySelector('video').error);
  assert.equal(await page.locator('#player-error').isVisible(), false);
  checks.push('Media failure is visible and retry succeeds');
  fs.writeFileSync(path.join(output, 'validation.json'), JSON.stringify({ success: true, media, checks }, null, 2) + '\n');
  console.log(JSON.stringify({ success: true, media, checks }, null, 2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
