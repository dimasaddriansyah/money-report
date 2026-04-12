import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { graphic, type EChartsOption } from "echarts";

type Props = {
  data: {
    dates: string[];
    amounts: number[];
  };
};

export default function DashboardComponentDailyExpense({ data }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return (
      <div className="w-full h-75 flex items-center justify-center text-sm text-slate-400">
        Loading chart...
      </div>
    );
  }

  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
    },

    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 10,
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: data.dates,
      axisLine: { show: false },
      axisTick: { show: false },
    },

    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: { type: "dashed" },
      },
    },

    areaStyle: {
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "rgba(255,70,131,0.05)" },
      ]),
    },

    series: [
      {
        type: "line",
        smooth: true,
        data: data.amounts,
        color: "#EF4444",
        areaStyle: {},
        lineStyle: {
          width: 2,
        },
        symbol: "circle",
        symbolSize: 6,
      },
    ],
  };

  return (
    <div className="w-full">
      <ReactECharts
        option={option}
        style={{ height: 400, width: "100%" }}
        autoResize
      />
    </div>
  );
}