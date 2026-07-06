import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { isNullOrEmptyString } from './string-helper'

dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(isBetween)

/**
 * 小程序等环境无 Intl，dayjs.tz.guess() 会抛 ReferenceError。
 * 本包业务默认按中国时区展示（与同文件 getNowInChina 等一致）。
 */
const APP_TZ = 'Asia/Shanghai'

export function isValidTime(time: string | Date | null | undefined): boolean {
  if (time === null || time === undefined) {
    return false
  }

  if (typeof time === 'string') {
    if (isNullOrEmptyString(time)) {
      return false
    }
  }

  return parseDate(time).isValid()
}

export function isValidMsTimestamp(timestamp: number | null | undefined): boolean {
  if (timestamp === null || timestamp === undefined) {
    return false
  }

  return parseUnixTimeMs(timestamp).isValid()
}

export function getNow() {
  return dayjs.utc()
}

export function getNowInChina() {
  return dayjs().tz('Asia/Shanghai')
}

export function getNowInZone(zone: string) {
  return dayjs().tz(zone)
}

export function getNowInLocal() {
  return dayjs().tz(APP_TZ)
}

export function parseDateKeepOrigin(d: Date | string) {
  return dayjs(d)
}

export function parseDate(d: Date | string) {
  return dayjs.utc(d)
}

export function parseDateInChina(d: Date | string) {
  return dayjs.tz(d, 'Asia/Shanghai')
}

// 根据传入的时区信息，解析时间
export function parseDateInZone(time: Date | string, zone: string) {
  return dayjs.tz(time, zone)
}

export function convertUTCToLocal(d: Date | string) {
  return dayjs.utc(d).tz(APP_TZ)
}

export function convertUTCToChina(d: Date | string) {
  return dayjs.utc(d).tz('Asia/Shanghai')
}

export function convertChinaToUTC(d: Date | string) {
  return dayjs.tz(d, 'Asia/Shanghai').utc()
}

export function getNowDayInChina() {
  return getNowInChina().startOf('day')
}

export function getNowMonthInChina() {
  return getNowInChina().startOf('month')
}

export function isValidTimeFormat(time: string): boolean {
  // 正则表达式用于匹配格式 HH:mm:ss
  // 小时不超过 23 ，分，秒不会超过 59
  const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/
  return timePattern.test(time)
}

export function parseUnixTimeAsChinaZone(unixTime: number) {
  return dayjs.unix(unixTime).tz('Asia/Shanghai')
}

export function parseUnixTimeAsZone(unixTime: number, zone: string) {
  return dayjs.unix(unixTime).tz(zone)
}

export function parseUnixTimeMs(unixTimeMs: number) {
  return dayjs(unixTimeMs)
}

// 解析毫秒
export function parseUnixTimeMsAsZone(unixTimeMs: number, zone: string) {
  return dayjs(unixTimeMs).tz(zone)
}

export function parseUnixTimeMsAsLocal(unixTimeMs: number) {
  return dayjs(unixTimeMs).tz(APP_TZ)
}
