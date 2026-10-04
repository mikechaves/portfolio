// Probe graphics off the main thread: software-driver startup can itself be slow.
// null means this worker cannot decide; it does not rule out a normal canvas.
let supported = null
try {
  const canvas = new OffscreenCanvas(1, 1)
  const context = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat:true, powerPreference:'low-power' })
    // Identify software drivers here even when the strict context was refused.
    // This keeps their potentially slow startup off the main thread.
    || canvas.getContext('webgl2', { powerPreference:'low-power' })
  if (context) {
    const graphics = context.getExtension('WEBGL_debug_renderer_info')
    const driver = graphics ? context.getParameter(graphics.UNMASKED_RENDERER_WEBGL) : ''
    supported = !/SwiftShader|llvmpipe|softpipe|software renderer|software rasterizer/i.test(driver)
    context.getExtension('WEBGL_lose_context')?.loseContext()
  }
} catch { /* Worker WebGL support can differ from normal canvas support. */ }
self.postMessage(supported)
self.close()
