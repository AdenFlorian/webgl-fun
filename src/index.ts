import {loadShaderFromServer} from './utils.js'
import * as webgl from './webgl.js'

main()

async function main() {
  const mainHeaderElement = document.createElement('h1')
  document.body.appendChild(mainHeaderElement)
  mainHeaderElement.id = 'mainHeader'
  mainHeaderElement.textContent = 'Hello2, world! Goodbye!'

  const mainCanvasElement = getMainCanvasElement()

  mainCanvasElement.width = window.innerWidth
  mainCanvasElement.height = window.innerHeight

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
      time: gl.getUniformLocation(shaderProgram, 'uTime'),
      mouse: gl.getUniformLocation(shaderProgram, 'uMouse'),
    },
  }

  const buffers = webgl.initBuffers(gl)

  webgl.initScene(gl, programInfo, buffers, mainCanvasElement)

  renderLoop()

  function renderLoop() {
    webgl.drawScene(gl, programInfo, buffers, mainCanvasElement)
    requestAnimationFrame(renderLoop)
  }
}

function getMainCanvasElement() {
  const element = document.createElement('canvas')
  document.body.appendChild(element)
  element.id = 'mainCanvas'
  return element
}
