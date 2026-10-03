// Actual browser evidence for the premiere covers and carousel, against the local production preview.
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const output = path.resolve('docs/cinematic/evidence')
await mkdir(output, {recursive:true})
const browser = await chromium.launch()
const errors = []
const context = await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,colorScheme:'dark',recordVideo:{dir:'/tmp/portfolio-premiere-video',size:{width:1440,height:1000}}})
const page = await context.newPage()
page.on('pageerror',error=>errors.push(error.message))
page.on('console',message=>{if(message.type()==='error')errors.push(message.text())})
const capture = async name => {
  await page.evaluate(()=>document.fonts.ready)
  await page.screenshot({path:path.join(output,`premiere-${name}.png`)})
}
try {
  await page.goto('http://127.0.0.1:3210/')
  await page.locator('[data-theater-ready="true"]').waitFor()
  await page.waitForTimeout(500)
  await capture('wizzo-desktop')
  // Let one real automatic interval play before demonstrating manual controls.
  await page.locator('[data-theater-active="speakeasy"]').waitFor({timeout:10000})
  await page.waitForTimeout(1200)
  await page.getByRole('button',{name:'Pause carousel',exact:true}).click()
  await capture('speakeasy-desktop')
  await page.waitForTimeout(900)
  await page.getByRole('button',{name:'Next project',exact:true}).click()
  await page.waitForTimeout(1600)
  await capture('playfold-desktop')
  await page.waitForTimeout(900)
  await page.getByRole('button',{name:'Next project',exact:true}).click()
  await page.waitForTimeout(1600)
  await page.getByRole('button',{name:'Resume carousel',exact:true}).click()
  await page.mouse.move(500,490,{steps:20})
  await page.mouse.move(1000,570,{steps:30})
  await page.waitForTimeout(800)
  await context.close()
  await page.video().saveAs(path.join(output,'premiere-carousel.webm'))

  const mobile = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,colorScheme:'dark'})
  await mobile.goto('http://127.0.0.1:3210/')
  await mobile.getByRole('button',{name:'Pause carousel',exact:true}).click()
  await mobile.evaluate(()=>document.fonts.ready)
  await mobile.screenshot({path:path.join(output,'premiere-mobile.png')})
  await mobile.getByRole('button',{name:'Next project',exact:true}).click()
  await mobile.waitForTimeout(1100)
  await mobile.screenshot({path:path.join(output,'premiere-mobile-speakeasy.png')})
  await mobile.close()

  const fallback = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce',colorScheme:'dark'})
  await fallback.goto('http://127.0.0.1:3210/')
  await fallback.getByRole('button',{name:'Next project',exact:true}).waitFor()
  await fallback.evaluate(()=>document.fonts.ready)
  await fallback.screenshot({path:path.join(output,'premiere-reduced-motion.png')})
  await fallback.close()
  console.log(JSON.stringify({consoleErrors:errors,evidence:output}))
  if(errors.length)process.exitCode=1
} finally { await browser.close() }
