import { RefreshCw, Eye, EyeOff } from "lucide-react";

interface HeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
  isCalLoading: boolean;
  calOnClick: () => void;
  areValuesHidden: boolean;
  onToggleVisibility: () => void;
}

export const Header = ({
  lastUpdated,
  onRefresh,
  isLoading,
  isCalLoading,
  calOnClick,
  areValuesHidden,
  onToggleVisibility,
}: HeaderProps) => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-800">
    <div>
      <h1 className="text-3xl font-bold text-slate-100">Financial Overview</h1>
      {lastUpdated && (
        <p className="text-sm text-slate-500 mt-1">
          Last updated:{" "}
          {lastUpdated.toLocaleString("en-LK", {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </p>
      )}
    </div>
    {/* MODIFIED: This container now stacks buttons vertically on mobile */}
    <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
      {/* Update CAL button */}
      <button
        onClick={calOnClick}
        disabled={isCalLoading}
        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-wait text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ring-1 ring-slate-700"
      >
        <RefreshCw
          className={`w-4 h-4 ${isCalLoading ? "animate-spin" : ""}`}
        />
        {isCalLoading ? "Updating..." : "Update CAL Values"}
      </button>
      {/* Hide/Show Values Button */}
      <button
        onClick={onToggleVisibility}
        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ring-1 ring-slate-700"
      >
        {areValuesHidden ? <Eye size={16} /> : <EyeOff size={16} />}
        {areValuesHidden ? "Show" : "Hide"} Values
      </button>

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-wait text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ring-1 ring-slate-700"
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  </header>
);
