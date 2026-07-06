import type { EChartsOption } from 'echarts'
import type { Ref } from 'vue'

import { ref } from 'vue'

// 小程序中引入 echarts（与 lime-echart 插件内一致）
const echarts = require('../uni_modules/lime-echart/static/echarts.min')

type ChartOptionRef = Ref<EChartsOption | Record<string, unknown>>

/**
 * ECharts composable（微信小程序）：组件 finished 后 init 一次，之后仅用合并 setOption 更新。
 *
 * @returns [chartRef, optionRef, onFinished, setChartOption]
 * - `onFinished`: 传给 `<l-echart @finished>`，负责首次 init + 应用 `optionRef`
 * - `setChartOption(partial)`：已 init 则用合并策略更新；未完成则排队，init 后补打
 */
export function useEcharts(options: ChartOptionRef) {
  const chartRef = ref<any>(null)
  let chartInstance: { setOption: (opt: unknown, opts?: unknown) => void } | null = null
  let pendingPatch: EChartsOption | Record<string, unknown> | null = null

  const flushPending = () => {
    if (chartInstance && pendingPatch) {
      chartInstance.setOption(pendingPatch)
      pendingPatch = null
    }
  }

  const setChartOption = (patch: EChartsOption | Record<string, unknown>) => {
    if (chartInstance) {
      chartInstance.setOption(patch)
    } else {
      pendingPatch = patch
    }
  }

  const onFinished = () => {
    setTimeout(async () => {
      if (!chartRef.value) return

      const cmp = chartRef.value as {
        init?: (lib: unknown, ...args: unknown[]) => Promise<unknown>
      }
      if (!cmp.init) return

      if (!chartInstance) {
        const chart = await cmp.init(echarts)
        chartInstance = chart as { setOption: (o: unknown, o2?: unknown) => void }
        if (!chartInstance) return
        chartInstance.setOption(options.value)
        flushPending()
      } else {
        chartInstance.setOption(options.value)
        flushPending()
      }
    }, 300)
  }

  return [chartRef, options, onFinished, setChartOption] as const
}
