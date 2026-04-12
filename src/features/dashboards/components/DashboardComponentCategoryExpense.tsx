import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import type { CallbackDataParams } from "echarts/types/dist/shared";
import { useEffect, useState } from "react";

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

export default function DashboardComponentCategoryExpense({ data }: Props) {
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
      trigger: "item",
    },

    graphic: {
      type: "text",
      left: "center",
      top: "40%",
      style: {
        text: "Total\n1,000",
        fill: "#0f172a",
        fontSize: 16,
        fontWeight: 600,
      },
    },

    series: [
      {
        type: "pie",
        radius: ["60%", "100%"],
        center: ["50%", "52%"],
        startAngle: 180,
        endAngle: 360,

        data: data,

        label: {
          show: true,
          position: "inside",
          formatter: (params: CallbackDataParams) => {
            const percent = params.percent ?? 0;
            if (percent <= 5) return "";
            return `${percent}%`;
          },
          color: "#fff",
          fontWeight: 600,
          fontSize: 12,
        },

        labelLine: {
          show: false,
        },
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