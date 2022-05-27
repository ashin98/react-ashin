// 封装图表bar组件
import React, { useRef, useEffect } from 'react'
import * as echarts from 'echarts'

export default function Bar ({ title, xData, yData, style }) {
  const domRef = useRef()
  const chartInit = () => {
    const myChart = echarts.init(domRef.current)
    myChart.setOption({
      title: {
        text: title
      },
      tooltip: {},
      xAxis: {
        data: xData
      },
      yAxis: {},
      series: [
        {
          name: '满意度',
          type: 'bar',
          data: yData
        }
      ]
    })
  }
  useEffect(() => {
    chartInit()
  }, [])
  return (
    <div>
      <div ref={domRef} style={style}></div>
    </div>
  )
}
