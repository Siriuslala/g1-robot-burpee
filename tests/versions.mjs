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
  let file = path.resolve(root, relative);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
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
try {
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});
 const page=await browser.newPage({viewport:{width:1440,height:1100}});const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
 const url=`http://127.0.0.1:${server.address().port}${prefix}`;
 await page.goto(url);await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=2));
 assert.equal(await page.locator('video').count(),2);assert.equal(await page.locator('.version-button[aria-current]').textContent(),'v2（GPT 在线控制）');
 const bounds=await page.locator('video').evaluateAll(v=>v.map(x=>x.getBoundingClientRect().toJSON()));assert(bounds[1].x>bounds[0].x && bounds[1].y===bounds[0].y);
 await page.screenshot({path:path.join(output,'v2-desktop.png'),fullPage:true});
 await page.locator('#start').click();await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>!v.paused && v.currentTime>.4));
 await page.locator('#first-person').evaluate(v=>v.pause());await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.paused));
 await page.locator('[data-speed="2"]').click();await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.playbackRate===2));
 await page.locator('.action-button').filter({hasText:'曲臂向下'}).click();await page.waitForFunction(()=>{const a=document.querySelector('#performance'),b=document.querySelector('#first-person');return a.currentTime>121&&Math.abs(a.currentTime-b.currentTime)<.1});
 await page.locator('#first-person').evaluate(v=>{v.currentTime=40});await page.waitForFunction(()=>Math.abs(document.querySelector('#performance').currentTime-40)<.1);
 await page.locator('[data-view="fixed"]').click();await page.waitForFunction(()=>{const a=document.querySelector('#performance'),b=document.querySelector('#first-person');return a.readyState>=2&&a.src.includes('fixed.mp4')&&Math.abs(a.currentTime-40)<.1&&Math.abs(a.currentTime-b.currentTime)<.1});
 await page.locator('#first-person').evaluate(v=>v.play());await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>!v.paused));
 await page.locator('[data-view="transition"]').click();await page.waitForFunction(()=>{const a=document.querySelector('#performance'),b=document.querySelector('#first-person');return a.readyState>=2&&!a.paused&&!b.paused&&a.src.includes('transition.mp4')&&Math.abs(a.currentTime-b.currentTime)<.3});
 await page.locator('#performance').evaluate(v=>v.pause());assert(await page.locator('#player-error').isHidden());
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(output,'v2-mobile.png'),fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('.version-button').filter({hasText:'v1（'}).click();await page.waitForFunction(()=>document.querySelector('video').readyState>=2);assert(page.url().endsWith('/v1/'));assert.equal(await page.locator('video').count(),1);assert.equal(await page.locator('.method-entry a').getAttribute('href'),'https://siriuslala.github.io/g1-robot-burpee/technical_v1.html');
 assert(Math.abs(await page.locator('video').evaluate(v=>v.duration)-156.35)<.1);await page.locator('[data-view="fixed"]').click();await page.waitForFunction(()=>document.querySelector('video').readyState>=2&&document.querySelector('video').src.endsWith('/assets/media/fixed.mp4'));
 await page.setViewportSize({width:1440,height:1100});await page.screenshot({path:path.join(output,'v1-desktop.png'),fullPage:true});
 await page.goto(url+'technical.html');assert(await page.locator('h1').textContent()==='GPT 在线混合控制');assert(await page.locator('body').textContent().then(t=>t.includes('53 次')));await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(output,'technical-v2-mobile.png'),fullPage:true});
 await page.goto(url+'technical_v1.html');assert(await page.locator('body').textContent().then(t=>t.includes('状态机')));assert.equal(await page.locator('.back-link').getAttribute('href'),'v1/');
 assert.deepEqual(errors,[]);console.log('PASS: v2 default, paired playback/pause/seek/rate/camera switch, mobile layout, v1 preservation, technical routes, no browser errors');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
