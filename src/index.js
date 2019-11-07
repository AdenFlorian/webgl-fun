import {loadShaderFromServer} from './utils.js'
import * as webgl from './webgl.js'

main()

async function main() {
  const mainHeaderId = 'mainHeader'
  const mainHeaderElement = document.getElementById(mainHeaderId)
  if (mainHeaderElement === null) {
    console.error(`could not find mainHeaderElement using id: ${mainHeaderId}`)
    return
  }
  mainHeaderElement.textContent += ' Goodbye!'

  const mainCanvasElement = getMainCanvasElement()

  const gl = webgl.getGl(mainCanvasElement)

  const shaderProgram = webgl.initShaderProgram(
    gl,
    await loadShaderFromServer('vs.glsl'),
    await loadShaderFromServer('fs.glsl'),
  )

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  }

  const buffers = webgl.initBuffers(gl)

  renderLoop()

  function renderLoop() {
    webgl.drawScene(gl, programInfo, buffers, mainCanvasElement)
    requestAnimationFrame(renderLoop)
  }
}

function getMainCanvasElement() {
  const mainCanvasId = 'mainCanvas'
  const mainCanvasElement = document.getElementById(mainCanvasId)
  if (mainCanvasElement === null) {
    throw new Error(`could not find mainCanvasElement using id: ${mainCanvasId}`)
  }
  if (!(mainCanvasElement instanceof HTMLCanvasElement)) {
    throw new Error(`!(mainCanvasElement instanceof HTMLCanvasElement): ` + JSON.stringify({mainCanvasElement}))
  }
  return mainCanvasElement
}
