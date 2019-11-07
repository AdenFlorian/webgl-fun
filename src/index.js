import {hslToRgb} from "./modules/color.js"

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
