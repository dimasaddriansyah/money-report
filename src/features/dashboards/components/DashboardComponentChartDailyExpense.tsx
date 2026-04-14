import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { graphic, type EChartsOption } from "echarts";
import { useBalance } from "../../../shared/context/BalanceContext";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import EmptyState from "../../../shared/ui/EmptyState";

type Props = {
  data: {
    dates: string[];
    amounts: number[];
  };
};

export default function DashboardComponentChartDailyExpense({ data }: Props) {
  const { hideBalance } = useBalance();
  const [ready, setReady] = useState(false);

  const isEmpty = data.amounts.length === 0;

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
      formatter: (params: any) => {
        const item = params[0];
        const value = item.value;

        return `
          <div style="padding:4px 4px">
            <div>${item.axisValue}</div>
            <div style="margin-top:4px">
              <span style=" display:inline-block; width:8px; height:8px; border-radius:50%; background:#FF0000; "></span>
              <span>Expenses</span>
              <span style="float:right;font-weight:600;margin-left:20px">
               ${formatBalance(formatCurrency(value), hideBalance)}
              </span>
            </div>
          </div>
        `;
      },
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

    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,

        zoomLock: true, // 🔥 disable zoom → cuma bisa geser
        moveOnMouseMove: true, // drag mouse
        moveOnMouseWheel: true, // scroll = geser (bukan zoom)

        start: 10,
        end: 100, // window yang ditampilkan (misal 30%)
      },
    ],

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
    <>
      {isEmpty ? (
        <EmptyState
          title="No transactions yet"
          subtitle="Create your first transaction to start tracking"
        />
      ) : (
        <div className="w-full">
          <ReactECharts
            option={option}
            style={{ height: 400, width: "100%" }}
            autoResize
          />
        </div>
      )}
    </>
  );
}