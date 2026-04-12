import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../../shared/utils/format.helper";

type Props = {
  data: {
    remarks: string[];
    amounts: number[];
  };
};

export default function DashboardComponentTopExpense({ data }: Props) {
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
      axisPointer: { type: "shadow" },
    },

    grid: {
      left: 30,
      right: 30,
      top: 10,
      bottom: 0,
      containLabel: true,
    },

    xAxis: {
      type: "value",
      splitLine: {
        lineStyle: { type: "dashed" },
      },
      axisLabel: {
        formatter: (value: number) => {
          if (value >= 1000000) return `${value / 1000000}jt`;
          if (value >= 1000) return `${value / 1000}k`;
          return `${value}`;
        },
      },
    },

    yAxis: {
      type: "category",
      data: data.remarks,
      axisTick: { show: false },
    },

    series: [
      {
        type: "bar",
        data: data.amounts,
        barWidth: 25,
        itemStyle: {
          color: "#0f172a",
          borderRadius: [0, 6, 6, 0],
        },
        label: {
          show: true,
          position: "right",
          formatter: (params: any) => {
            return `{value|${formatCurrency(params.value)}}`;
          },
          rich: {
            value: {
              fontWeight: 600,
              color: "#1e1e1e",
              fontSize: 12,
            },
          },
        },
      },
    ]
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