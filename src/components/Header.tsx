import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Header = ({ lastUpdated, onRefresh, isLoading }: HeaderProps) => (
  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-800">
    <div>
      <h1 className="text-3xl font-bold text-slate-100">Financial Overview</h1>
      {lastUpdated && (
        <p className="text-sm text-slate-500 mt-1">
          Last updated:{' '}
          {lastUpdated.toLocaleString('en-LK', {
            dateStyle: 'long',
            timeStyle: 'short',
          })}
        </p>
      )}
    </div>
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className="mt-4 sm:mt-0 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-wait text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
    >
      <RefreshCw
        className={`w-4 h-4 ${
          isLoading ? 'animate-spin' : ''
        }`}
      />
      {isLoading ? 'Refreshing...' : 'Refresh'}
    </button>
  </header>
);