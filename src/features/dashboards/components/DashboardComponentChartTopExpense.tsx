/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { useBalance } from "../../../shared/context/BalanceContext";
import EmptyState from "../../../shared/ui/EmptyState";

type Props = {
  data: {
    remarks: string[];
    amounts: number[];
  };
};

export default function DashboardComponentChartTopExpense({ data }: Props) {
  const { hideBalance } = useBalance();
  const [ready, setReady] = useState(false);

  const isEmpty = data.amounts.length === 0;

  const maxValue = Math.max(...data.amounts, 0);
  const insideData = data.amounts.map((v) =>
    v > maxValue * 0.65 ? v : null
  );
  const outsideData = data.amounts.map((v) =>
    v <= maxValue * 0.65 ? v : null
  );

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
      formatter: (params: any) => {
        const item = params.find((p: any) => p.value != null);
        const index = item.dataIndex;
        const remark = data.remarks[index];
        const value = item.value;

        return `
          <div style="padding:4px 4px">
            <div>Expenses</div>
            <div style="margin-top:4px">
              <span style=" display:inline-block; width:8px; height:8px; border-radius:50%; background:#FF0000; "></span>
                ${remark}
              <span style="float:right;font-weight:600;margin-left:20px">
               ${formatBalance(formatCurrency(value), hideBalance)}
              </span>
            </div>
          </div>
        `;
      },
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
      axisLine: { show: false },
    },

    series: [
      {
        name: "bar",
        type: "bar",
        data: data.amounts,
        barWidth: 40,
        itemStyle: {
          color: "rgba(255,70,131,0.05)",
          borderRadius: [0, 8, 8, 0],
          borderColor: "#EF4444",
          borderWidth: 2
        },
      },
      {
        type: "bar",
        data: insideData,
        barGap: "-100%",
        barWidth: 40,
        label: {
          show: true,
          position: "insideRight",
          distance: 12,
          formatter: (p: any) => formatBalance(formatCurrency(p.value), hideBalance),
          color: "#1E1E1E",
          fontWeight: 600,
        },
        itemStyle: { color: "transparent" },
      },
      {
        type: "bar",
        data: outsideData,
        barGap: "-100%",
        barWidth: 40,
        label: {
          show: true,
          position: "right",
          distance: 12,
          formatter: (p: any) => formatBalance(formatCurrency(p.value), hideBalance),
          color: "#1E1E1E",
          fontWeight: 600,
        },
        itemStyle: { color: "transparent" },
      },
    ]
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
            style={{ height: 507, width: "100%" }}
            autoResize
          />
        </div >
      )}
    </>
  );
}