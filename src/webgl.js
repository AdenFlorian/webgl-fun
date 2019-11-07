import * as mat4 from './lib/gl-matrix/mat4.js'
import {getColorForTime} from './utils.js'

const start = Date.now() / 1000
function now() {
  return Date.now() / 1000
}
function current() {
  return now() - start
}

/** @param {WebGL2RenderingContext} gl */
export function initBuffers(gl) {
  // Create a buffer for the square's positions.
  const positionBuffer = gl.createBuffer()

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // Now create an array of positions for the square.
  const positions = [
    -1.0, 1.0,
    1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0,
  ]

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW)

  return {
    position: positionBuffer,
  }
}

let mousePosition = {x: 0, y: 0}
window.addEventListener('mousemove', e => {
  mousePosition = {
    x: e.clientX,
    y: e.clientY,
  }
})

/**
 * @param {WebGL2RenderingContext} gl
 * @param {{
 *  attribLocations: { vertexPosition: any; };
 *  program: any;
 *  uniformLocations: {
 *    projectionMatrix: WebGLUniformLocation | null;
 *    modelViewMatrix: WebGLUniformLocation | null;
 *    time: WebGLUniformLocation | null;
 *    mouse: WebGLUniformLocation | null;
 *  };
 * }} programInfo
 * @param {{ position: any; }} buffers
 * @param {HTMLCanvasElement} canvasElement
 */
export function drawScene(gl, programInfo, buffers, canvasElement) {
  gl.uniform1f(
    programInfo.uniformLocations.time,
    current())
  gl.uniform2f(
    programInfo.uniformLocations.mouse,
    mousePosition.x, mousePosition.y)

  {
    const offset = 0
    const vertexCount = 4
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
  }
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {{
 *  attribLocations: { vertexPosition: any; };
 *  program: any;
 *  uniformLocations: {
 *    projectionMatrix: WebGLUniformLocation | null;
 *    modelViewMatrix: WebGLUniformLocation | null;
 *    time: WebGLUniformLocation | null;
 *    mouse: WebGLUniformLocation | null;
 *  };
 * }} programInfo
 * @param {{ position: any; }} buffers
 * @param {HTMLCanvasElement} canvasElement
 */
export function initScene(gl, programInfo, buffers, canvasElement) {
  gl.clearColor(...getColorForTime(Date.now() / 1000, 16))
  // gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0)                 // Clear everything
  gl.enable(gl.DEPTH_TEST)           // Enable depth testing
  gl.depthFunc(gl.LEQUAL)            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180   // in radians
  const aspect = canvasElement.clientWidth / canvasElement.clientHeight
  const zNear = 0.1
  const zFar = 100.0
  const projectionMatrix = mat4.create()

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar)

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create()

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
    modelViewMatrix,     // matrix to translate
    [-0.0, 0.0, -6.0])  // amount to translate

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 2  // pull out 2 values per iteration
    const type = gl.FLOAT    // the data in the buffer is 32bit floats
    const normalize = false  // don't normalize
    const stride = 0         // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0         // how many bytes inside the buffer to start from
    // already did this in initBuffers()
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset)
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexPosition)
  }

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program)

  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix)
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix)
}

/** @param {HTMLCanvasElement} mainCanvasElement */
export function getGl(mainCanvasElement) {
  const gl = mainCanvasElement.getContext("webgl2")

  if (gl === null) {
    throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.")
  }

  return gl
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {string} vsSource
 * @param {string} fsSource
 */
export function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  // Create the shader program
  const shaderProgram = gl.createProgram()
  if (shaderProgram === null) {
    throw new Error('shaderProgram null sad face: ' + JSON.stringify({vsSource, fsSource}))
  }

  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
  }

  return shaderProgram
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {number} type
 * @param {string} source
 */
export function loadShader(gl, type, source) {
  const shader = gl.createShader(type)
  if (shader === null) {
    throw new Error('shader null sad face: ' + JSON.stringify({type, source}))
  }

  // Send the source to the shader object
  gl.shaderSource(shader, source)

  // Compile the shader program
  gl.compileShader(shader)

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error('An error occurred compiling the shaders: ' + info)
  }

  return shader
}
