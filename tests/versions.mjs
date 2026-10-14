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
 for (const [route,v,report,count] of [['','v3','technical.html',2],['v2/','v2','technical_v2.html',2],['v1/','v1','technical_v1.html',1]]) {
  await page.goto(url+route);await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=2));
  assert.equal(await page.locator('video').count(),count);assert.equal(await page.locator('.version-button').count(),3);
  assert((await page.locator('.version-button[aria-current]').textContent()).startsWith(v));
  assert.equal(await page.locator('.method-entry').count(),1);assert.equal(await page.locator('.method-entry a').getAttribute('href'),report);
  assert(!(await page.locator('body').textContent()).includes('↓'));
  const boxes=await page.evaluate(()=>['.version-switch','.method-entry','.showcase'].map(s=>document.querySelector(s).getBoundingClientRect().toJSON()));
  assert(boxes[0].bottom<=boxes[1].top && boxes[1].bottom<=boxes[2].top);
  const center=await page.locator('.method-entry a').boundingBox();assert(Math.abs(center.x+center.width/2-720)<2);
  if(count===2){
   await page.locator('#start').click();await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>!v.paused&&v.currentTime>.3));
   await page.locator('#first-person').evaluate(v=>v.pause());await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.paused));
   await page.locator('[data-speed="2"]').click();await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.playbackRate===2));
   await page.locator('.action-button').filter({hasText:'曲臂向下'}).click();await page.waitForFunction(()=>Math.abs(document.querySelector('#performance').currentTime-document.querySelector('#first-person').currentTime)<.1);
   const time=await page.locator('#performance').evaluate(v=>v.currentTime);assert(Math.abs(time-(v==='v3'?129.630:121.59))<.1);
   await page.locator('[data-view="fixed"]').click();await page.waitForFunction(()=>{const a=document.querySelector('#performance'),b=document.querySelector('#first-person');return a.readyState>=2&&a.src.includes('fixed.mp4')&&Math.abs(a.currentTime-b.currentTime)<.1});
  }
  await page.screenshot({path:path.join(output,v+'-desktop.png'),fullPage:true});
  for(const width of [390,320]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(output,v+'-'+width+'.png'),fullPage:true});}
  await page.setViewportSize({width:1440,height:1100});await page.locator('.method-entry a').click();assert(page.url().endsWith(report));
  if(v==='v3'){assert.equal(await page.locator('.decision-example').count(),9);for(const a of await page.locator('a[href^="assets/"]').all()){const href=await a.getAttribute('href');assert(fs.existsSync(path.join(root,href)),href);}}
  for(const width of [1440,390,320]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await page.setViewportSize({width:1440,height:1100});
  console.log(v+' playback, report, placement and responsive checks passed');
 }
 assert.deepEqual(errors,[]);console.log('No missing resources or JavaScript errors');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
