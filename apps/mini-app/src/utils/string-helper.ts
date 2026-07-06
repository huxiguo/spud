/**
 * 判断字符串是否为空
 * @param s 字符串
 * @returns 是否为空 类型谓词 告诉编译器 当返回true时，s的类型为null或undefined
 */
export const isNullOrEmptyString = (s: string | null | undefined): s is null | undefined => {
  if (s == null || s == undefined) {
    return true
  }

  if (s.trim().length === 0) {
    return true
  }

  return false
}

export const isRealNumber = (value: any): value is number => {
  if (value == null) {
    return false
  }

  if (typeof value != 'number') {
    return false
  }

  if (isNaN(value)) {
    return false
  }

  return true
}

export const formatEmptyValueForString = (value: string | null): string | null => {
  if (isNullOrEmptyString(value)) {
    return null
  }
  return value
}

export const isRealBool = (value: any) => {
  if (value == null) {
    return false
  }

  if (typeof value != 'boolean') {
    return false
  }

  return value === true || value === false
}

export const isNotHaveSpace = (value: string) => {
  return value.indexOf(' ') == -1
}

// 格式化数字：整数原样返回，小数最多保留2位且去掉末尾的0
export const beautifyNumber = (num: number): number => {
  return parseFloat(num.toFixed(2))
}
