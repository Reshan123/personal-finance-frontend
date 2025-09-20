import { useMemo } from "react";
import { Card } from "./Card"; // Assuming Card component is in a shared location
import type { MonthlyBudgetItem } from "../types/types";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
  Circle,
} from "lucide-react";

const HIDDEN_PLACEHOLDER = "∗∗∗∗∗∗";

// --- Helper to format currency ---
const formatToLKR = (amount: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(amount);

// --- Individual Data Item for the list ---
const BudgetItemRow = ({
  item,
  areValuesHidden,
}: {
  item: MonthlyBudgetItem;
  areValuesHidden: boolean;
}) => {
  const isExpense = parseFloat(item.amount.replace(/,/g, "")) < 0;

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-slate-800 last:border-b-0 hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center gap-4">
        {item.isCompleted ? (
          <CheckCircle size={20} className="text-emerald-500" />
        ) : (
          <Circle size={20} className="text-slate-600" />
        )}
        <div>
          <p className="font-medium text-slate-200">{item.category}</p>
          <p className="text-xs text-slate-500">{item.account || "N/A"}</p>
        </div>
      </div>
      <p
        className={`font-mono text-right ${
          isExpense ? "text-red-400" : "text-green-400"
        }`}
      >
        {areValuesHidden
          ? HIDDEN_PLACEHOLDER
          : formatToLKR(parseFloat(item.amount.replace(/,/g, "")))}
      </p>
    </div>
  );
};

const MonthlyBudget = ({
  data,
  areValuesHidden,
}: {
  data: MonthlyBudgetItem[];
  areValuesHidden: boolean;
}) => {
  const {
    totalIncome,
    totalExpenses,
    netBalance,
    budgetTotal,
    spentPercentage,
  } = useMemo(() => {
    const parseCurrency = (value: string): number => {
      if (!value || typeof value !== "string") return 0;
      const num = parseFloat(value.replace(/,/g, ""));
      return isNaN(num) ? 0 : num;
    };

    let income = 0;
    let expenses = 0;
    let budget = 0;

    data.forEach((item) => {
      const amount = parseCurrency(item.amount);
      if (item.category.toLowerCase() === "budget") {
        budget += amount;
        income += amount; // Budget is considered income for the month
      } else if (amount > 0) {
        income += amount;
      } else {
        expenses += amount;
      }
    });

    const net = income + expenses;
    const percentage = budget > 0 ? (Math.abs(expenses) / budget) * 100 : 0;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: net,
      budgetTotal: budget,
      spentPercentage: Math.min(percentage, 100), // Cap at 100%
    };
  }, [data]);

  return (
    <div className="space-y-8">
      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 uppercase">Total Income</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {areValuesHidden
                  ? HIDDEN_PLACEHOLDER
                  : formatToLKR(totalIncome)}
              </p>
            </div>
            <ArrowUpCircle className="text-green-500/50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 uppercase">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400 mt-1">
                {areValuesHidden
                  ? HIDDEN_PLACEHOLDER
                  : formatToLKR(totalExpenses)}
              </p>
            </div>
            <ArrowDownCircle className="text-red-500/50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 uppercase">Net Balance</p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  netBalance >= 0 ? "text-sky-400" : "text-orange-400"
                }`}
              >
                {areValuesHidden ? HIDDEN_PLACEHOLDER : formatToLKR(netBalance)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* --- Budget Progress --- */}
      <Card>
        <h3 className="font-semibold text-slate-200 mb-2">Budget Progress</h3>
        <div className="w-full bg-slate-800 rounded-full h-4">
          <div
            className="bg-sky-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${areValuesHidden ? 0 : spentPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-slate-400 mt-2">
          <span>
            Spent:{" "}
            {areValuesHidden
              ? HIDDEN_PLACEHOLDER
              : formatToLKR(Math.abs(totalExpenses))}
          </span>
          <span>
            Budget:{" "}
            {areValuesHidden ? HIDDEN_PLACEHOLDER : formatToLKR(budgetTotal)}
          </span>
        </div>
      </Card>

      {/* --- Transaction List --- */}
      <Card title="Transactions" padding={false}>
        <div>
          {data.map((item, index) => (
            <BudgetItemRow
              key={index}
              item={item}
              areValuesHidden={areValuesHidden}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

// --- Skeleton Loader ---
const MonthlyBudgetSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-slate-900 rounded-2xl p-4 h-24 ring-1 ring-white/5"
        ></div>
      ))}
    </div>
    <div className="bg-slate-900 rounded-2xl p-4 h-28 ring-1 ring-white/5"></div>
    <div className="bg-slate-900 rounded-2xl p-4 h-96 ring-1 ring-white/5"></div>
  </div>
);

export { MonthlyBudget, MonthlyBudgetSkeleton };
