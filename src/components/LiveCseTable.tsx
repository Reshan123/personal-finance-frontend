import React, { useMemo, useState } from "react";
// Removed: import { Card } from "./Card"; -> Defined Card component in this file to fix resolution error.
import type { LiveCompanyStock } from "../types/types";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronDown,
  BarChart2,
} from "lucide-react";

const HIDDEN_PLACEHOLDER = "∗∗∗∗∗∗";

// --- Card Component Definition ---
// NOTE: The Card component has been defined here to resolve the import error.
const Card = ({
  children,
  title,
  icon,
  actions,
  padding = true,
}: {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  padding?: boolean;
}) => (
  <div className="bg-slate-900 shadow-2xl shadow-black/20 rounded-2xl ring-1 ring-white/5">
    {title && (
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {icon && <span className="text-slate-500">{icon}</span>}
          <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
        </div>
        {actions && <div>{actions}</div>}
      </div>
    )}
    <div className={padding ? "p-4" : ""}>{children}</div>
  </div>
);
// --- End Card Component ---

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
  // MODIFIED: State now holds an array of expanded row IDs
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

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

  // MODIFIED: Click handler now adds/removes row IDs from the array
  const handleRowClick = (rowId: number) => {
    setExpandedRows(
      (prevExpandedRows) =>
        prevExpandedRows.includes(rowId)
          ? prevExpandedRows.filter((id) => id !== rowId) // Remove ID if it exists
          : [...prevExpandedRows, rowId] // Add ID if it doesn't exist
    );
  };

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
      <Card
        title="Live Market Data"
        icon={<BarChart2 size={20} />}
        actions={updateButton}
      >
        <p className="p-4 text-slate-500">No live CSE data available.</p>
      </Card>
    );
  }

  return (
    <Card
      padding={false}
      title="Live Market Data"
      icon={<BarChart2 size={20} />}
      actions={updateButton}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-2 py-3 w-12 text-center"></th>
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
              // MODIFIED: Check if the row ID is in the expandedRows array
              const isExpanded = expandedRows.includes(stock.row);
              const changeValue = parseFloat(
                stock.change.replace(/Rs|\s/g, "")
              );
              const isGain = changeValue > 0;
              const isLoss = changeValue < 0;

              return (
                <React.Fragment key={stock.row}>
                  <tr
                    className={`border-t border-slate-800 ${
                      index % 2 === 0 ? "bg-slate-900" : "bg-slate-800/50"
                    } hover:bg-sky-950/50 transition-colors cursor-pointer`}
                    onClick={() => handleRowClick(stock.row)}
                  >
                    <td className="px-2 py-4 text-center">
                      <ChevronDown
                        size={16}
                        className={`text-slate-500 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </td>
                    <td className="px-4 py-4 font-bold text-sky-400 whitespace-nowrap">
                      {stock.stock_symbol.split(".")[0]}
                    </td>
                    <td className="px-4 py-4 text-slate-300 whitespace-nowrap max-w-xs truncate">
                      {stock.company_name}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-slate-200">
                      {areValuesHidden
                        ? HIDDEN_PLACEHOLDER
                        : stock.current_price}
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
                      {areValuesHidden
                        ? HIDDEN_PLACEHOLDER
                        : stock.volume_today}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-slate-300">
                      {areValuesHidden
                        ? HIDDEN_PLACEHOLDER
                        : stock.current_value}
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

                  {isExpanded && (
                    <tr className="bg-slate-900/70">
                      <td colSpan={8} className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">
                              Actual Cost
                            </p>
                            <p className="font-mono text-slate-300">
                              {areValuesHidden
                                ? HIDDEN_PLACEHOLDER
                                : stock.actual_cost}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">
                              Shares
                            </p>
                            <p className="font-mono text-slate-300">
                              {areValuesHidden
                                ? HIDDEN_PLACEHOLDER
                                : stock.number_of_shares}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">
                              Cost Per Share
                            </p>
                            <p className="font-mono text-slate-300">
                              {areValuesHidden
                                ? HIDDEN_PLACEHOLDER
                                : (
                                    Number(
                                      stock.actual_cost
                                        .replace("LKR", "")
                                        .replace(",", "")
                                    ) / Number(stock.number_of_shares)
                                  ).toLocaleString("en-LK", {
                                    style: "currency",
                                    currency: "LKR",
                                  })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">
                              Day's Range
                            </p>
                            <p className="font-mono text-slate-300">
                              {areValuesHidden
                                ? HIDDEN_PLACEHOLDER
                                : stock.day_range}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">
                              Previous Close
                            </p>
                            <p className="font-mono text-slate-300">
                              {areValuesHidden
                                ? HIDDEN_PLACEHOLDER
                                : stock.previous_close}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-800/50 font-bold text-slate-200">
            <tr>
              <td colSpan={6} className="px-4 py-4 text-left">
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
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-slate-700 rounded-md w-12"></div>
        ))}
      </div>
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-5 w-4 bg-slate-800 rounded-md"></div>
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
