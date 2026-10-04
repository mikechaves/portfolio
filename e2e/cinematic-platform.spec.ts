import { expect, test } from "@playwright/test"
import { createHash } from "node:crypto"
import { ADAPTIVE_FOCUS_PRESETS } from "../features/adaptive-focus/config/presets"

test("all eight lenses switch, reorder, reset, and preserve the custom role path", async ({page}) => {
  await page.goto("/")
  const allWork = page.locator("[data-featured-project]")
  const original = await allWork.evaluateAll(nodes => nodes.map(n => n.getAttribute("data-featured-project")))
  for(const preset of ADAPTIVE_FOCUS_PRESETS) {
    const button = page.locator(`[data-adaptive-focus-preset="${preset.id}"]`)
    if(!await button.isVisible()) await page.locator("[data-adaptive-focus-more] summary").click()
    await button.click()
    await expect(button).toHaveAttribute("aria-pressed","true")
    await expect(page.locator('[data-adaptive-focus-preset][aria-pressed="true"]')).toHaveCount(1)
    await expect(page.locator("[data-focus-explore]")).toHaveAttribute("href",`/projects?focusPreset=${preset.id}`)
    await expect(allWork).toHaveCount(3)
  }
  await page.getByRole("button",{name:"Reset focus"}).click()
  expect(await allWork.evaluateAll(nodes=>nodes.map(n=>n.getAttribute("data-featured-project")))).toEqual(original)
  await expect(page.locator('[data-adaptive-focus-preset][aria-pressed="true"]')).toHaveCount(0)
  await expect(page.locator("[data-focus-explore]")).toHaveAttribute("href","/projects")
  await page.locator("[data-focus-custom] summary").click()
  await page.getByLabel("Role or job description").fill("Creative director leading brand identity and interactive stories")
  await expect(page.getByRole("button",{name:"Analyze role"})).toBeEnabled()
  await page.route("**/api/adaptive-focus/analyze",route=>route.fulfill({status:503,contentType:"application/json",body:'{"error":"test fallback"}'}))
  await page.getByRole("button",{name:"Analyze role"}).click()
  await expect(page.getByRole("heading",{name:"Role Fit Brief",exact:true})).toBeVisible()
  expect(page.url()).not.toContain("Creative")
  expect(await page.evaluate(()=>sessionStorage.getItem("adaptive-focus:pending:v2"))).toBeNull()
  await page.getByRole("button",{name:"Reset",exact:true}).click()
  await expect(page.locator("#role-fit-brief-heading")).toHaveCount(0)
})

test("reduced motion keeps art and navigation without WebGL",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"})
  const webgl:string[]=[]
  page.on("request",request=>{if(request.url().includes("three.module")||request.url().includes("project-theater-scene"))webgl.push(request.url())})
  await page.goto("/")
  await expect(page.locator("[data-theater-work] img")).toHaveCount(3)
  await expect(page.getByRole("button",{name:"Pause carousel"})).not.toBeVisible()
  await page.getByRole("button",{name:"Next project"}).click()
  await expect(page.locator('[data-theater-work="speakeasy"]')).toHaveAttribute("data-theater-slot","center")
  expect(await page.locator('[data-theater-work="speakeasy"]').evaluate(element=>parseFloat(getComputedStyle(element).transitionDuration))).toBeLessThan(.001)
  await page.locator("#adaptive-focus").scrollIntoViewIfNeeded()
  await expect(page.locator("[data-theater-canvas] canvas")).toHaveCount(0)
  expect(webgl).toEqual([])
  await page.locator('[data-adaptive-focus-preset="xr-accessibility"]').press("Enter")
  await expect(page.locator('[data-adaptive-focus-preset="xr-accessibility"]')).toHaveAttribute("aria-pressed","true")
})

test("every cover can take the center position using arrows and keyboard",async({page},testInfo)=>{
  await page.goto("/")
  const scene=page.getByRole("region",{name:"Selected work",exact:true})
  await expect(scene).toHaveAttribute("data-theater-active","wizzo")
  for(const id of ["speakeasy","x-games","wizzo"]){
    await page.getByRole("button",{name:"Next project"}).click()
    await expect(scene).toHaveAttribute("data-theater-active",id)
    await expect(page.locator("[data-theater-slide-status]")).toContainText("of 3")
    await expect.poll(async()=>{
      const box=await page.locator(`[data-theater-work="${id}"]`).boundingBox()
      const width=page.viewportSize()!.width
      return Boolean(box&&box.width>width*(testInfo.project.name.includes("mobile")?.8:.45)&&box.x>0&&box.x+box.width<width)
    }).toBe(true)
    await expect(page.locator(`[data-theater-work="${id}"]`)).toHaveAttribute("href",`/projects/${id}`)
  }
  await page.getByRole("button",{name:"Previous project"}).click()
  await expect(scene).toHaveAttribute("data-theater-active","x-games")
  await page.getByRole("button",{name:"Previous project"}).press("Home")
  await expect(scene).toHaveAttribute("data-theater-active","wizzo")
  await page.getByRole("button",{name:"Previous project"}).press("End")
  await expect(scene).toHaveAttribute("data-theater-active","x-games")
  await page.getByRole("button",{name:"Previous project"}).press("Home")
  await expect(scene).toHaveAttribute("data-theater-active","wizzo")
  await page.locator('[data-theater-work="wizzo"]').focus()
  await page.keyboard.press("ArrowRight")
  await expect(page.locator('[data-theater-work="speakeasy"]')).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/projects\/speakeasy$/)
})

test("automatic rotation stops offscreen and after manual navigation",async({page})=>{
  test.setTimeout(45000)
  await page.goto("/")
  const scene=page.locator("[data-project-theater]")
  await expect(scene).toHaveAttribute("data-carousel-ready","true")
  // The wait observes a complete live seven-second interval, including timer and CSS behavior.
  await expect(scene).toHaveAttribute("data-theater-active","speakeasy",{timeout:10000})
  await page.locator("#music").scrollIntoViewIfNeeded()
  await page.waitForTimeout(7400)
  await expect(scene).toHaveAttribute("data-theater-active","speakeasy")
  await page.getByRole("button",{name:"Next project"}).click()
  await expect(scene).toHaveAttribute("data-theater-active","x-games")
  await page.waitForTimeout(7400)
  await expect(scene).toHaveAttribute("data-theater-active","x-games")
  await page.getByRole("button",{name:"Resume carousel"}).click()
  await page.mouse.move(5,5)
  await expect(scene).toHaveAttribute("data-theater-active","wizzo",{timeout:10000})
})

test("touch swipe changes the center project without opening a case study",async({page},testInfo)=>{
  test.skip(!testInfo.project.name.includes("mobile"),"Touch gesture is exercised in the mobile project")
  await page.goto("/")
  await expect(page.locator("[data-project-theater]")).toHaveAttribute("data-carousel-ready","true")
  const box=(await page.locator('[data-theater-work="wizzo"] .theater-picture').boundingBox())!
  const cdp=await page.context().newCDPSession(page)
  const y=box.y+box.height*.5,start=box.x+box.width*.85,end=box.x+box.width*.15
  await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:start,y}]})
  for(let i=1;i<=8;i++) await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:start+(end-start)*i/8,y}]})
  await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]})
  await expect(page.locator("[data-project-theater]")).toHaveAttribute("data-theater-active","speakeasy")
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole("button",{name:"Resume carousel"})).toBeVisible()
  await cdp.detach()
})

test("failed artwork and unavailable WebGL retain usable project links",async({page})=>{
  await page.route(/\/visuals\/premiere\/wizzo-\d+\.webp$/,route=>route.abort())
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:string,...args:unknown[]){
      if(type.includes("webgl"))return null
      return original.apply(this,[type,...args] as Parameters<typeof original>)
    } as typeof original
  })
  await page.goto("/")
  await expect(page.locator('[data-theater-work="wizzo"] .theater-picture')).toHaveAttribute("data-media-failed","true")
  await expect(page.locator('[data-theater-work="wizzo"] .art-fallback')).toBeVisible()
  await page.getByRole("button",{name:"Next project"}).click()
  await expect(page.locator("[data-project-theater]")).toHaveAttribute("data-theater-active","speakeasy")
  await page.getByRole("button",{name:"Previous project"}).click()
  await page.locator('[data-theater-work="wizzo"]').click()
  await expect(page).toHaveURL(/\/projects\/wizzo$/)
  await expect(page.getByRole("heading",{name:"Wizzo",exact:true,level:1})).toBeVisible()
})

test("approved resume bytes and legacy download redirect remain intact",async({request})=>{
  const response=await request.get("/Michael_Chaves_Resume.pdf")
  expect(response.status()).toBe(200)
  expect(createHash("sha256").update(await response.body()).digest("hex")).toBe("5e8ee9b0ed28531e98bddc3f0afaa81c6c6bfbad59b70604e2fc3b2329d81fed")
  const legacy=await request.get("/Michael_Chaves_Resume_min.pdf",{maxRedirects:0})
  expect(legacy.status()).toBe(308)
  expect(legacy.headers().location).toBe("/Michael_Chaves_Resume.pdf")
})

test("tablet layout keeps direct access to work, focus, and menu",async({page})=>{
  await page.setViewportSize({width:820,height:1180})
  await page.goto("/")
  await expect(page.getByRole("heading",{name:"Mike Chaves",level:1})).toBeVisible()
  await page.getByRole("button",{name:"Open menu"}).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.getByRole("button",{name:"Close menu"}).press("Escape")
  await expect(page.getByRole("dialog")).not.toBeVisible()
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  await page.screenshot({path:"docs/cinematic/evidence/tablet.png",fullPage:false})
})

test("scene motion, pause, offscreen lifecycle, and context-loss fallback",async({page},testInfo)=>{
  test.skip(testInfo.project.name.includes("mobile"),"Mobile uses the HTML carousel without WebGL")
  const accelerated = await page.evaluate(() => {
    const context = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat:true, powerPreference:"low-power" })
    context?.getExtension("WEBGL_lose_context")?.loseContext()
    return Boolean(context)
  })
  await page.goto("/")
  const scene=page.locator("[data-project-theater]")
  if (!accelerated) {
    await expect(scene).toHaveAttribute("data-theater-ready","false")
    await expect(page.locator("[data-theater-canvas] canvas")).toHaveCount(0)
    await expect(page.locator('[data-theater-work="wizzo"] img')).toHaveCSS("opacity","1")
    await page.getByRole("button",{name:"Next project"}).click()
    await expect(scene).toHaveAttribute("data-theater-active","speakeasy")
    return
  }
  await expect(scene).toHaveAttribute("data-theater-ready","true")
  await page.mouse.move(300,550)
  await page.mouse.move(1120,620,{steps:25})
  await page.getByRole("button",{name:"Pause carousel"}).click()
  await expect(page.getByRole("button",{name:"Resume carousel"})).toHaveAttribute("aria-pressed","true")
  await page.getByRole("button",{name:"Resume carousel"}).click()
  await page.locator("#music").scrollIntoViewIfNeeded()
  await page.locator("#home-title").scrollIntoViewIfNeeded()
  await expect(page.locator("[data-theater-canvas] canvas")).toHaveCount(1)
  await page.setViewportSize({width:390,height:844})
  await expect(page.locator("[data-theater-canvas] canvas")).toHaveCount(0)
  await page.setViewportSize({width:1440,height:1000})
  await expect(scene).toHaveAttribute("data-theater-ready","true")
  await expect(page.locator("[data-theater-canvas] canvas")).toHaveCount(1)
  await page.locator("[data-theater-canvas] canvas").evaluate(canvas=>canvas.dispatchEvent(new Event("webglcontextlost",{cancelable:true})))
  await expect(scene).toHaveAttribute("data-theater-ready","false")
  await expect(page.locator('[data-theater-work="wizzo"] img')).toHaveCSS("opacity","1")
  await expect(page.locator("[data-theater-canvas] canvas")).toHaveCount(0)
})

test("a major graphics performance caveat retains the HTML carousel",async({page},testInfo)=>{
  test.skip(testInfo.project.name.includes("mobile"),"Mobile never requests the optional graphics context")
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:string,...args:unknown[]){
      if(type==="webgl2" && (args[0] as WebGLContextAttributes)?.failIfMajorPerformanceCaveat) return null
      return original.apply(this,[type,...args] as Parameters<typeof original>)
    } as typeof original
  })
  await page.goto("/")
  const scene=page.locator("[data-project-theater]")
  await expect(scene).toHaveAttribute("data-theater-ready","false")
  await expect(page.locator("[data-theater-canvas] canvas")).toHaveCount(0)
  await expect(page.locator('[data-theater-work="wizzo"] img')).toHaveCSS("opacity","1")
  await page.getByRole("button",{name:"Next project"}).click()
  await expect(scene).toHaveAttribute("data-theater-active","speakeasy")
  await page.locator('[data-theater-work="speakeasy"]').click()
  await expect(page).toHaveURL(/\/projects\/speakeasy$/)
})
