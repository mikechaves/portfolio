// Probe graphics off the main thread: software-driver startup can itself be slow.
let supported = false
try {
  const context = new OffscreenCanvas(1, 1).getContext('webgl2', { failIfMajorPerformanceCaveat:true, powerPreference:'low-power' })
  if (context) {
    const graphics = context.getExtension('WEBGL_debug_renderer_info')
    const driver = graphics ? context.getParameter(graphics.UNMASKED_RENDERER_WEBGL) : ''
    supported = !/SwiftShader|llvmpipe|softpipe|software renderer|software rasterizer/i.test(driver)
    context.getExtension('WEBGL_lose_context')?.loseContext()
  }
} catch { /* The HTML carousel is the fallback when graphics cannot be probed. */ }
self.postMessage(supported)
self.close()
