import { useMemo } from "react";
import { Card } from "./Card";
import type { LiveCompanyStock } from "../types/types";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

const HIDDEN_PLACEHOLDER = "∗∗∗∗∗∗";

interface LiveCseTableProps {
  data: LiveCompanyStock[];
  onUpdate: () => void;
  isUpdating: boolean;
  areValuesHidden: boolean;
}

const LiveCseTable = ({
  data,
  onUpdate,
  isUpdating,
  areValuesHidden,
}: LiveCseTableProps) => {
  const { totalValueFormatted, totalGainLossFormatted, totalGainLoss } =
    useMemo(() => {
      const parseCurrency = (value: string): number => {
        if (!value || typeof value !== "string") return 0;
        const num = parseFloat(value.replace(/LKR|,|\s|Rs/g, ""));
        return isNaN(num) ? 0 : num;
      };
      const totalValue = data.reduce(
        (acc, stock) => acc + parseCurrency(stock.current_value),
        0
      );
      const totalGainLoss = data.reduce(
        (acc, stock) => acc + parseCurrency(stock.gain_loss),
        0
      );
      const formatToLKR = (amount: number) =>
        new Intl.NumberFormat("en-LK", {
          style: "currency",
          currency: "LKR",
        }).format(amount);

      return {
        totalValueFormatted: formatToLKR(totalValue),
        totalGainLossFormatted: formatToLKR(totalGainLoss),
        totalGainLoss,
      };
    }, [data]);

  const updateButton = (
    <button
      onClick={onUpdate}
      disabled={isUpdating}
      className="flex items-center gap-2 bg-sky-600/50 hover:bg-sky-600/80 disabled:opacity-50 disabled:cursor-wait text-sky-100 font-semibold py-1 px-3 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
    >
      <RefreshCw className={`w-3 h-3 ${isUpdating ? "animate-spin" : ""}`} />
      {isUpdating ? "Updating..." : "Update Prices"}
    </button>
  );

  if (!data || data.length === 0) {
    return (
      <Card title="Live Market Data" icon="barChart" actions={updateButton}>
        <p className="p-4 text-slate-500">No live CSE data available.</p>
      </Card>
    );
  }

  return (
    <Card
      padding={false}
      title="Live Market Data"
      icon="barChart"
      actions={updateButton}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-4 py-3">
                Symbol
              </th>
              <th scope="col" className="px-4 py-3">
                Company
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Price
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Change
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Volume
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Value
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Gain/Loss
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((stock, index) => {
              const changeValue = parseFloat(
                stock.change.replace(/Rs|\s/g, "")
              );
              const isGain = changeValue > 0;
              const isLoss = changeValue < 0;

              return (
                <tr
                  key={stock.row}
                  className={`border-t border-slate-800 ${
                    index % 2 === 0 ? "bg-slate-900" : "bg-slate-800/50"
                  } hover:bg-sky-950/50 transition-colors`}
                >
                  <td className="px-4 py-4 font-bold text-sky-400 whitespace-nowrap">
                    {stock.stock_symbol.split(".")[0]}
                  </td>
                  <td className="px-4 py-4 text-slate-300 whitespace-nowrap max-w-xs truncate">
                    {stock.company_name}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-slate-200">
                    {areValuesHidden ? HIDDEN_PLACEHOLDER : stock.current_price}
                  </td>
                  <td
                    className={`px-4 py-4 text-right font-mono flex items-center justify-end gap-1 ${
                      isGain
                        ? "text-green-500"
                        : isLoss
                        ? "text-red-500"
                        : "text-slate-400"
                    }`}
                  >
                    {areValuesHidden ? (
                      HIDDEN_PLACEHOLDER
                    ) : (
                      <>
                        {isGain && <TrendingUp size={14} />}
                        {isLoss && <TrendingDown size={14} />}
                        {stock.change}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-slate-400">
                    {areValuesHidden ? HIDDEN_PLACEHOLDER : stock.volume_today}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-slate-300">
                    {areValuesHidden ? HIDDEN_PLACEHOLDER : stock.current_value}
                  </td>
                  <td
                    className={`px-4 py-4 text-right font-mono ${
                      stock.gain_loss_value >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {areValuesHidden ? HIDDEN_PLACEHOLDER : stock.gain_loss}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-800/50 font-bold text-slate-200">
            <tr>
              <td colSpan={5} className="px-4 py-4 text-left">
                Total
              </td>
              <td className="px-4 py-4 text-right font-mono">
                {areValuesHidden ? HIDDEN_PLACEHOLDER : totalValueFormatted}
              </td>
              <td
                className={`px-4 py-4 text-right font-mono ${
                  totalGainLoss >= 0 ? "text-green-400" : "text-red-400"
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

const LiveCseTableSkeleton = () => (
  <Card padding={false}>
    <div className="animate-pulse">
      <div className="flex justify-between items-center p-3 bg-slate-800/50">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-4 bg-slate-700 rounded-md w-12"></div>
        ))}
      </div>
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-5 w-16 bg-slate-800 rounded-md"></div>
            <div className="h-5 w-24 bg-slate-800 rounded-md"></div>
            <div className="h-5 w-12 bg-slate-800 rounded-md"></div>
            <div className="h-5 w-10 bg-slate-800 rounded-md"></div>
            <div className="h-5 w-12 bg-slate-800 rounded-md"></div>
            <div className="h-5 w-16 bg-slate-800 rounded-md"></div>
            <div className="h-5 w-16 bg-slate-800 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

export { LiveCseTable, LiveCseTableSkeleton };
