import { useMemo } from "react";
import type { Transactions } from "../../types/Transactions";
import { formatRupiah } from "../../helpers/Format";
import EChartsReact from "echarts-for-react";
import { graphic, type EChartsOption } from "echarts";
import EmptyState from "../utils/EmptyState";

interface Props {
  transactions: Transactions[];
  hideBalance: boolean;
}

export default function ExpensesChart({ transactions, hideBalance }: Props) {
  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};

    transactions.forEach((trx) => {
      const date = trx.date;

      if (!grouped[date]) grouped[date] = 0;

      grouped[date] += Number(trx.nominal);
    });

    const dates = Object.keys(grouped).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    return {
      categories: dates.map((d) => {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, "0");
        const monthName = date.toLocaleString("id-ID", { month: "short" });
        return `${day} ${monthName}`;
      }),
      data: dates.map((d) => grouped[d]),
    };
  }, [transactions]);

  const isEmpty = chartData.data.length === 0;

  const option: EChartsOption = {
    grid: {
      left: 100,
      right: 20,
      top: 20,
      bottom: 30,
    },

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
                ${hideBalance ? "Rp ••••••" : formatRupiah(value)}
              </span>
            </div>
          </div>
        `;
      },
    },

    xAxis: {
      type: "category",
      data: chartData.categories,
      axisLine: {
        show: false, // hilangkan garis hitam
      },
    },

    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          opacity: 0.15,
        },
      },
      axisLabel: {
        formatter: (val: number) => formatRupiah(val),
      },
    },

    series: [
      {
        name: "Expenses",
        type: "line",
        smooth: true,
        data: chartData.data,
        color: "#EF4444",
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(255,158,68,0.4)" },
            { offset: 1, color: "rgba(255,70,131,0.05)" },
          ]),
        },
      },
    ],
  };

  if (isEmpty) {
    return <EmptyState />;
  }

  return <EChartsReact option={option} style={{ height: 350 }} />
}
