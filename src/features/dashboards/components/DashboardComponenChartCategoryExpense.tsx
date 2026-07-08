import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import type { CallbackDataParams } from "echarts/types/dist/shared";
import { useEffect, useMemo, useState } from "react";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { useBalance } from "../../../shared/context/BalanceContext";

type Props = {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  full?: boolean;
};

export default function DashboardComponenChartCategoryExpense({
  data,
  full = false,
}: Props) {
  const { hideBalance } = useBalance();
  const [ready, setReady] = useState(false);

  const totalExpenses = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);


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

      position: function (point) {
        return full
          ? [point[0] + 20, point[1] - 20]
          : [point[0] - 270, point[1] - 20];
      },

      formatter: (params: any) => {
        const name = params.name;
        const value = params.value;
        const percent = Math.round(params.percent ?? 0);

        return `
          <div style="padding:4px">
            <div style="font-weight:500">
              ${name}
            </div>

            <div style="margin-top:6px;display:flex;align-items:center;">
              <span style="
                width:8px;
                height:8px;
                border-radius:50%;
                background:${params.color};
                display:inline-block;
                margin-right:6px;">
              </span>

              <span>
                Expenses
              </span>

              <span style="
                margin-left:auto;
                padding-left:20px;
                font-weight:600;">
                ${formatBalance(formatCurrency(value), hideBalance)}
                (${percent}%)
              </span>
            </div>
          </div>
        `;
      },
    },


    graphic: [
      {
        type: "text",
        left: "center",
        top: full ? "41%" : "30%",
        style: {
          text: "Total",
          fill: "#64748B",
          fontSize: 14,
        },
      },

      {
        type: "text",
        left: "center",
        top: full ? "50%" : "40%",
        style: {
          text: formatBalance(
            formatCurrency(totalExpenses),
            hideBalance
          ),
          fill: "#1E1E1E",
          fontSize: 20,
          fontWeight: "bold",
        },
      },
    ],


    series: [
      {
        type: "pie",

        radius: ["65%", "100%"],

        center: ["50%", "50%"],

        ...(full
          ? {}
          : {
              startAngle: 180,
              endAngle: 360,
            }),


        padAngle: full ? 2 : 0,


        itemStyle: {
          borderRadius: full ? 8 : 0,
        },


        // IMPORTANT:
        // inject custom color ke ECharts
        data: data.map((item) => ({
          value: item.value,
          name: item.name,

          itemStyle: {
            color: item.color,
          },
        })),


        label: {
          show: true,
          position: "inside",

          formatter: (params: CallbackDataParams) => {
            const percent = Math.round(params.percent ?? 0);

            if (percent <= 5) {
              return "";
            }

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
        style={{
          height: 250,
          width: "100%",
        }}
        autoResize
      />
    </div>
  );
}