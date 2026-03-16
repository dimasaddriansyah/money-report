import { useMemo } from "react";
import type { Transactions } from "../../types/Transactions";
import { formatRupiah } from "../../helpers/Format";
import EChartsReact from "echarts-for-react";
import { graphic, type EChartsOption } from "echarts";

interface Props {
  transactions: Transactions[];
}

export default function ExpensesChart({ transactions }: Props) {
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

  const option: EChartsOption = {
    grid: {
      left: 100,
      right: 20,
      top: 20,
      bottom: 30,
    },

    tooltip: {
      trigger: "axis",
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

  return <EChartsReact option={option} style={{ height: 350 }} />;
}
