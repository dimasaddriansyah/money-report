import { useMemo } from "react";
import EChartsReact from "echarts-for-react";
import type { EChartsOption } from "echarts";
import EmptyState from "../utils/EmptyState";
import { formatRupiah } from "../../helpers/Format";

interface Props {
  data: { name: string; value: number }[];
  colors: string[]; 
  hideBalance: boolean;
}

export default function CategoriesChart({ data, colors, hideBalance }: Props) {
  const totalExpenses = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const isEmpty = totalExpenses === 0;

  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
    },

    legend: {
      show: false,
    },

    color: colors,

    graphic: [
      {
        type: "text",
        left: "center",
        top: "40%",
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
        top: "50%",
        style: {
          text: hideBalance ? "Rp ••••••" : formatRupiah(totalExpenses),
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
        radius: ["60%", "100%"],
        center: ["50%", "60%"],
        startAngle: 180,
        endAngle: 360,

        data: data,

        label: {
          show: true,
          position: "inside",
          formatter: (params) => {
            const p = Math.round(params.percent ?? 0);
            return p > 5 ? p + "%" : "";
          },
          fontSize: 12,
          fontWeight: "bold",
          color: "#FFF",
        },

        labelLine: {
          show: false,
        },
      },
    ],
  };

  if (isEmpty) {
    return <EmptyState />;
  }

  return <EChartsReact option={option} style={{ height: 250 }} />;
}
