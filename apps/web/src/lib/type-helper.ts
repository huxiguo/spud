// 判断值是否未某个类型
export function is(val: unknown, type: string) {
  return Object.prototype.toString.call(val) === `[object ${type}]`
}
// 是否已定义
export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}

// 是否未定义
export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

// 是否为数值
export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

// 是否为数组
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

// 是否为 null
export function isNull(val: unknown): val is null {
  return val === null
}

// 是否为 null || undefined
export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

// 判断是否为空字符串或者null 或者 undefined
export function isNullOrEmptyString(val: unknown): val is null | undefined | '' {
  return isNullOrUnDef(val) || (is(val, 'String') && val === '')
}
