
main()

function main() {
  const mainHeaderId = 'mainHeader'
  const mainHeaderElement = document.getElementById(mainHeaderId)
  if (mainHeaderElement === null) {
    console.error(`could not find mainHeaderElement using id: ${mainHeaderId}`)
    return
  }
  mainHeaderElement.textContent += ' Goodbye!'

  const mainCanvasId = 'mainCanvas'
  const mainCanvasElement = document.getElementById(mainCanvasId)
  if (mainCanvasElement === null) {
    console.error(`could not find mainCanvasElement using id: ${mainCanvasId}`)
    return
  }
  if (!(mainCanvasElement instanceof HTMLCanvasElement)) {
    console.error(`!(mainCanvasElement instanceof HTMLCanvasElement)`, {mainCanvasElement})
    return
  }

  const gl = getGl(mainCanvasElement)

  renderLoop()

  function renderLoop() {
    gl.clearColor(...getColorForTime(Date.now() / 1000))
    draw(gl)
    requestAnimationFrame(renderLoop)
  }
}

/**
 * @param {number} timeSeconds
 * @return {[number, number, number, number]} */
function getColorForTime(timeSeconds) {
  const result = hslToRgb(sineNormalized(timeSeconds), 1, 0.5)
  return [result[0], result[1], result[2], 1.0]
}

/**  @param {number} x */
function sineNormalized(x) {
  return (Math.sin(x) * 0.5) + 0.5
}

/** @param {HTMLCanvasElement} mainCanvasElement */
function getGl(mainCanvasElement) {
  const gl = mainCanvasElement.getContext("webgl2")

  if (gl === null) {
    throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.")
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  return gl
}

/** @param {WebGL2RenderingContext} gl */
function draw(gl) {
  gl.clear(gl.COLOR_BUFFER_BIT)
}

/**
 * https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * @param   {number}  h
 * @param   {number}  s
 * @param   {number}  l
 * @return  {[number, number, number]}
 */
function hslToRgb(h, s, l) {
  let r, g, b

  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    /**
     * @param {number} p
     * @param {number} q
     * @param {number} t
     */
    const hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [r, g, b]
}
