import { useMemo } from "react";
import { useTransactions } from "../../hooks/transactions/useTransactions";
import { formatRupiah } from "../../helpers/Format";
import EChartsReact from "echarts-for-react";
import type { EChartsOption } from "echarts";

export default function ExpensesChart() {
  const { transactions } = useTransactions();

  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};

    transactions
      .filter((trx) => trx.type === "expenses")
      .forEach((trx) => {
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
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const value = (params as { value: number }[])[0].value;
        return formatRupiah(value);
      },
    },

    xAxis: {
      type: "category",
      data: chartData.categories,
      axisLabel: {
        rotate: 0,
      },
    },

    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (val: number) => formatRupiah(val),
      },
    },

    series: [
      {
        name: "Expenses",
        type: "bar",
        data: chartData.data,
        barWidth: "60%",
        showBackground: true,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
        },

        label: {
          show: true,
          position: "inside",
          rotate: 90,
          formatter: (params) =>
            formatRupiah((params as { value: number }).value),
          fontSize: 11,
          color: "#FFFFFF",
        },
      },
    ],
  };

  return <EChartsReact option={option} style={{ height: 350 }} />;
}
