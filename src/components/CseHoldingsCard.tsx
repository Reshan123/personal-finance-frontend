import { useMemo } from "react";
import { Card } from "./Card";
import type { CompanyStock } from "../types/types";

const HIDDEN_PLACEHOLDER = "∗∗∗∗∗∗";

const CseHoldingsCard = ({
  data,
  areValuesHidden,
}: {
  data: CompanyStock[];
  areValuesHidden: boolean;
}) => {
  if (!data || data.length === 0) return null;

  const { totalValueFormatted, totalGainLossFormatted, totalGainLoss } =
    useMemo(() => {
      const parseCurrency = (value: string): number => {
        if (!value || typeof value !== "string") return 0;
        const num = parseFloat(value.replace(/LKR|,|\s/g, ""));
        return isNaN(num) ? 0 : num;
      };

      const totalValue = data.reduce(
        (acc, company) => acc + parseCurrency(company.current_value),
        0
      );
      const totalGainLoss = data.reduce(
        (acc, company) => acc + parseCurrency(company.gain_loss),
        0
      );

      const formatToLKR = (amount: number) => {
        return new Intl.NumberFormat("en-LK", {
          style: "currency",
          currency: "LKR",
        }).format(amount);
      };

      return {
        totalValueFormatted: formatToLKR(totalValue),
        totalGainLossFormatted: formatToLKR(totalGainLoss),
        totalGainLoss,
      };
    }, [data]);

  return (
    <Card title="CSE Holdings" icon="barChart" padding={false}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3">
                Symbol
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Value
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right hidden sm:table-cell"
              >
                Gain/Loss
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((company, index) => (
              <tr
                key={company.row}
                className={`border-t border-slate-800 ${
                  index % 2 === 0 ? "bg-slate-900" : "bg-slate-800/50"
                } hover:bg-sky-950/50 transition-colors`}
              >
                <td className="px-6 py-4 font-medium text-slate-200 whitespace-nowrap">
                  {company.stock_symbol.split(".")[0]}
                </td>
                <td className="px-6 py-4 text-right font-mono">
                  {areValuesHidden ? HIDDEN_PLACEHOLDER : company.current_value}
                </td>
                <td
                  className={`px-6 py-4 text-right font-mono hidden sm:table-cell ${
                    company.gain_loss.startsWith("LKR-")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {areValuesHidden
                    ? HIDDEN_PLACEHOLDER
                    : company.gain_loss || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-600/50 font-bold text-slate-200">
            <tr>
              <td className="px-6 py-4">Total</td>
              <td className="px-6 py-4 text-right font-mono">
                {areValuesHidden ? HIDDEN_PLACEHOLDER : totalValueFormatted}
              </td>
              <td
                className={`px-6 py-4 text-right font-mono hidden sm:table-cell ${
                  totalGainLoss < 0 ? "text-red-400" : "text-green-400"
                }`}
              >
                {areValuesHidden ? HIDDEN_PLACEHOLDER : totalGainLossFormatted}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
};

const CseHoldingsSkeleton = () => (
  <div className="bg-slate-900 shadow-2xl shadow-black/20 rounded-2xl ring-1 ring-white/5 animate-pulse">
    <div className="p-4 border-b border-slate-800">
      <div className="h-6 w-1/2 bg-slate-800 rounded-md"></div>
    </div>
    <div className="p-4 space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <div className="h-4 w-1/4 bg-slate-800 rounded-md"></div>
          <div className="h-4 w-1/3 bg-slate-800 rounded-md"></div>
        </div>
      ))}
    </div>
  </div>
);

export { CseHoldingsCard, CseHoldingsSkeleton };
