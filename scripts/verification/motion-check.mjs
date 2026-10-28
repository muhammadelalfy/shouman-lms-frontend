const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.PLATFORM_BASE_URL ?? "http://localhost:3113";
const out = process.env.FRONTEND_EVIDENCE_DIR ?? ".frontend-evidence/motion";
await mkdir(out, { recursive: true });
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE ?? '/opt/google/chrome/chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(base+'/',{waitUntil:'networkidle'});
await page.waitForTimeout(1000);
const section=page.locator('[data-component="21st-blur-fade"]').filter({has:page.locator('#tracks')});
const opacity=()=>section.evaluate(e=>Number(getComputedStyle(e).opacity));
assert((await opacity())<.2,'offscreen section prepared for reveal');
const revealFrames=await section.evaluate(async e=>{
 const samples=[]; const start=performance.now();
 window.scrollTo({top:e.getBoundingClientRect().top+scrollY-180,behavior:'instant'});
 await new Promise(resolve=>{const frame=()=>{samples.push(Number(getComputedStyle(e).opacity));if(performance.now()-start<1100)requestAnimationFrame(frame);else resolve();};requestAnimationFrame(frame);});
 return samples;
});
const during=revealFrames.find(value=>value>.2&&value<.99);
assert(during,`intermediate reveal opacity: ${revealFrames}`);
assert.equal(await opacity(),1);
const carousel=page.getByRole('region',{name:'المسارات التعليمية',exact:true});
const track=carousel.locator('.academy-carousel-content');
const transform=()=>track.evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m41);
const next=carousel.getByRole('button',{name:'التالي',exact:true});
const prev=carousel.getByRole('button',{name:'السابق',exact:true});
const start=await transform();await next.click();await page.waitForTimeout(120);const moving=await transform();
await page.waitForTimeout(1700);const settled=await transform();
assert(moving>start+1&&moving<settled-1,`animated slide ${start} -> ${moving} -> ${settled}`);
await prev.click();await page.waitForTimeout(1700);
await page.mouse.move(0,0);await page.evaluate(()=>document.activeElement.blur());
await page.waitForFunction(()=>document.querySelector('#tracks .academy-slider')?.dataset.autoplayRunning==='true').catch(async error=>{
 console.error(await carousel.evaluate(e=>({autoplay:e.dataset.autoplayRunning,rect:e.getBoundingClientRect().toJSON(),focus:document.activeElement?.tagName,scrollY})));throw error;
});
const beforeAuto=await transform();await page.waitForTimeout(6300);assert((await transform())>beforeAuto+30,'visible autoplay advances');
await carousel.getByRole('button',{name:'إيقاف العرض التلقائي',exact:true}).click();
await page.mouse.move(0,0);await page.evaluate(()=>document.activeElement.blur());await page.waitForTimeout(1000);
const paused=await transform();await page.waitForTimeout(4900);assert(Math.abs((await transform())-paused)<.5,'pause retains position');
await carousel.getByRole('button',{name:'الانتقال إلى البطاقة 1',exact:true}).click();await page.waitForTimeout(1600);assert(await prev.isDisabled());
await page.locator('#home').scrollIntoViewIfNeeded();await page.waitForTimeout(900);
const button=page.locator('#home .shimmer-action').first();
await button.hover();await page.waitForTimeout(120);
const sweep=await button.locator('.shimmer-highlight').evaluate(e=>({animation:getComputedStyle(e,'::after').animationName,transform:getComputedStyle(e,'::after').transform}));
assert.equal(sweep.animation,'academy-button-sweep');assert.notEqual(sweep.transform,'none');
await page.screenshot({path:out+'/button-during.png'});
for(const width of [360,390,768,1024,1280,1440]){
 await page.setViewportSize({width,height:900});await page.waitForTimeout(300);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
 const hub=page.getByRole('region',{name:'المقالات والمبادرات والبرامج',exact:true});
 assert(await hub.getByRole('button',{name:'التالي',exact:true}).isEnabled(),`hub can slide at ${width}`);
}
await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
assert.equal(await section.getAttribute('data-in-view'),'true');assert.equal(await opacity(),1);
assert(await carousel.getByRole('button',{name:'العرض التلقائي متوقف وفق إعداد تقليل الحركة',exact:true}).isDisabled());
assert.equal(await carousel.getAttribute('data-autoplay-running'),'false');
await next.click();assert((await transform())>1,'instant reduced-motion slide');
assert.equal(await page.locator('[data-component="21st-border-beam"]').count(),0);
for(const path of ['/dashboard','/preview/admin/dashboard']){
 await page.emulateMedia({reducedMotion:'no-preference'});
 // Capture actual browser Animation keyframes for dashboard cards as they enter view.
 await page.addInitScript(()=>{
  window.__reveals=[];
  const original=Element.prototype.animate;
  Element.prototype.animate=function(frames,options){if(this.matches('.xp-card, .learner-welcome'))window.__reveals.push({className:this.className,frames,options});return original.call(this,frames,options)};
 });
 await page.goto(base+path,{waitUntil:'networkidle'});
 await page.waitForTimeout(800);
 assert((await page.evaluate(()=>window.__reveals.length))>0,`dashboard enter animations ${path}`);
 const count=await page.evaluate(()=>window.__reveals.length);
 await page.evaluate(()=>window.scrollTo({top:document.body.scrollHeight,behavior:'instant'}));await page.waitForTimeout(900);
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(900);
 assert((await page.evaluate(()=>window.__reveals.length))>count,`dashboard scroll replay ${path}`);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
 assert.equal(await page.locator('.xp-workspace-body').evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length),0,'dashboard reduced motion');
}
assert.deepEqual(errors,[]);const result={passed:true,revealOpacity:during,slider:{start,moving,settled},sweep,checks:['visible scroll reveals','actual intermediate slider transform','autoplay','pause','pagination','button sweep','6 viewport widths','live reduced motion','dashboard scroll replay','no browser errors']};
await writeFile(out+'/result.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
await nojs.goto(base+'/',{waitUntil:'networkidle'});
assert.equal(await nojs.locator('[data-component="21st-blur-fade"]').evaluateAll(elements=>elements.every(e=>Number(getComputedStyle(e).opacity)===1)),true);
assert.equal(await nojs.locator('#tracks [data-carousel-viewport]').evaluate(e=>getComputedStyle(e).overflowX),'auto');
console.log('PASS: no-JavaScript content and native carousel scrolling');
await browser.close();
