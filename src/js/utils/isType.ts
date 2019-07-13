/**
 * Test whether an object is of a given type
 * @param {String} type
 * @param {Object} obj
 */
export default function isType(type: string, obj: any): boolean {
  const test = Object.prototype.toString.call(obj).slice(8, -1)
  return obj !== null && obj !== undefined && test === type
}
