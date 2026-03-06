import { useMemo } from "react";
import EChartsReact from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { Transactions } from "../../types/Transactions";

interface Props {
  transactions: Transactions[];
}

export default function CategoriesChart({ transactions }: Props) {
  // Semua kategori
  const allData = useMemo(() => {
    const grouped: Record<string, number> = {};

    transactions
      .filter((trx) => trx.type === "expenses")
      .forEach((trx) => {
        const category = trx.category;

        if (!grouped[category]) grouped[category] = 0;

        grouped[category] += Number(trx.nominal);
      });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Top 4 + Others
  const pieData = useMemo(() => {
    const top4 = allData.slice(0, 4);
    const rest = allData.slice(4);

    const othersValue = rest.reduce((sum, item) => sum + item.value, 0);

    if (othersValue > 0) {
      top4.push({
        name: "Others",
        value: othersValue,
      });
    }

    return top4;
  }, [allData]);

  // Total expenses
  const totalExpenses = useMemo(() => {
    return allData.reduce((sum, item) => sum + item.value, 0);
  }, [allData]);

  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
    },

    legend: {
      top: "5%",
    },

    // Text di tengah donut
    graphic: [
      {
        type: "text",
        left: "center",
        top: "59%",
        style: {
          text: "Total",
          align: "center",
          fill: "#64748b",
          fontSize: 14,
        },
      },
      {
        type: "text",
        left: "center",
        top: "65%",
        style: {
          text: "Rp " + totalExpenses.toLocaleString("id-ID"),
          align: "center",
          fill: "#0f172a",
          fontSize: 20,
          fontWeight: "bold",
        },
      },
    ],

    series: [
      {
        name: "Expenses",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "70%"],
        startAngle: 180,
        endAngle: 360,

        data: pieData,

        label: {
          show: true,
          position: "inside",
          formatter: (params) => {
            const p = Math.round(params.percent ?? 0);
            return p > 5 ? p + "%" : "";
          },
          fontSize: 12,
          fontWeight: "bold",
        },

        labelLine: {
          show: false,
        },
      },
    ],
  };

  return <EChartsReact option={option} style={{ height: 350 }} />;
}
