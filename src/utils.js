import {hslToRgb} from "./modules/color.js"

/** @param {string} name */
export async function loadShaderFromServer(name) {
  const response = await fetch('/src/shaders/' + name, {
    method: 'get',
  })

  if (response.ok) {
    return response.text()
  } else {
    throw new Error('response not ok bro: ' + JSON.stringify(response))
  }
}

/**
 * @param {number} currentTimeSeconds
 * @param {number} lengthSeconds
 * @return {[number, number, number, number]}
 */
export function getColorForTime(currentTimeSeconds, lengthSeconds) {
  const result = hslToRgb(sineNormalized(currentTimeSeconds / lengthSeconds), 1, 0.5)
  return [result[0], result[1], result[2], 1.0]
}

/**  @param {number} x */
export function sineNormalized(x) {
  return (Math.sin(x) * 0.5) + 0.5
}
