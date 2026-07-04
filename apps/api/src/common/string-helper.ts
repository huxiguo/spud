/**
 * 判断值是否为空（null、undefined 或空字符串）
 * @param value 待检查的值
 * @returns 若值为 null/undefined/'' 则返回 true，同时收窄类型
 */
export function isNullOrEmptyString(value: unknown): value is null | undefined | '' {
    return value === null || value === undefined || value === ''
}

/**
 * 判断值是否为有效数字
 * @param value 待检查的值
 * @returns 若值为有效有限数字则返回 true，同时收窄类型为 number
 */
export function isRealNumber(value: unknown): value is number {
    return typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)
}
