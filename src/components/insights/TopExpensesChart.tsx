/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import type { Transactions } from "../../types/Transactions";
import { formatNumber } from "../../helpers/Format";
import EChartsReact from "echarts-for-react";
import type { EChartsOption } from "echarts";

interface Props {
  transactions: Transactions[];
}

export default function TopExpensesChart({ transactions }: Props) {
  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};

    transactions.forEach((trx) => {
      const remark = trx.remark || "Lainnya";

      if (!grouped[remark]) grouped[remark] = 0;
      grouped[remark] += Number(trx.nominal);
    });

    const sorted = Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .reverse();

    return {
      categories: sorted.map(([remark]) => remark),
      data: sorted.map(([, total]) => total),
      remarks: sorted.map(([remark]) => remark),
    };
  }, [transactions]);

  const maxValue = Math.max(...chartData.data, 0);

  const insideData = chartData.data.map((v) =>
    v > maxValue * 0.65 ? v : null,
  );

  const outsideData = chartData.data.map((v) =>
    v <= maxValue * 0.65 ? v : null,
  );

  const option: EChartsOption = {
    grid: {
      left: 100,
      right: 20,
      top: 20,
      bottom: 30,
    },

    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const item = params.find((p: any) => p.value != null);
        const index = item.dataIndex;

        const remark = chartData.remarks[index];
        const value = item.value;

        return `
          <div style="padding:4px 4px">
            <div>Expenses</div>
            <div style="margin-top:4px">
              <span style=" display:inline-block; width:8px; height:8px; border-radius:50%; background:#FF0000; "></span>
                ${remark}
              <span style="float:right;font-weight:600;margin-left:20px">
                ${formatNumber(value)}
              </span>
            </div>
          </div>
        `;
      },
    },

    xAxis: {
      type: "value",
      splitNumber: 4,

      axisLine: {
        show: false, // hilangkan garis hitam
      },

      splitLine: {
        lineStyle: {
          color: "#F1F5F9 ", // abu-abu soft
          width: 1,
        },
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
      data: chartData.categories.map((r) =>
        r.length > 10 ? r.substring(0, 10) + "..." : r,
      ),

      axisLine: {
        show: false, // ini yang hilangkan garis hitam di kiri
      },

      axisTick: {
        show: false,
      },
    },

    series: [
      {
        name: "bar",
        type: "bar",
        data: chartData.data,
        barWidth: 40,
        showBackground: true,
        backgroundStyle: {
          color: "#F8FAFC",
        },
        itemStyle: {
          borderRadius: [0, 10, 10, 0],
          color: "#EF4444 ",
        },
        emphasis: {
          itemStyle: {
            color: "#FF9A9A",
          },
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
          formatter: (p: any) => formatNumber(p.value),
          color: "#fff",
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
          distance: 8,
          formatter: (p: any) => formatNumber(p.value),
          color: "#333",
          fontWeight: 600,
        },
        itemStyle: { color: "transparent" },
      },
    ],
  };

  return <EChartsReact option={option} style={{ height: 350 }} />;
}
