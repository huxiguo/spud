import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(isBetween)

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
  return dayjs().tz(dayjs.tz.guess())
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
  return dayjs.utc(d).tz(dayjs.tz.guess())
}

export function convertUTCToChina(d: Date | string) {
  return dayjs.utc(d).tz('Asia/Shanghai')
}

export function convertChinaToUTC(d: Date | string) {
  return dayjs.tz(d, 'Asia/Shanghai').utc()
}

export function parseUnixTimeMs(unixTimeMs: number) {
  return dayjs(unixTimeMs)
}
