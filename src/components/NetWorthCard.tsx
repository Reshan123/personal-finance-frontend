import { PiggyBank } from 'lucide-react';

const HIDDEN_PLACEHOLDER = '∗∗∗∗∗∗';

const NetWorthCard = ({ netWorth, areValuesHidden }: { netWorth: string, areValuesHidden: boolean }) => (
  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-2xl shadow-emerald-900/40 text-white">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-base font-semibold text-teal-100 uppercase tracking-wider">
          Total Net Worth
        </h3>
        <p className="text-4xl font-bold mt-2 text-shadow">
          {areValuesHidden ? HIDDEN_PLACEHOLDER : netWorth}
        </p>
      </div>
      <PiggyBank className="w-10 h-10 text-white/20" />
    </div>
  </div>
);

const NetWorthSkeleton = () => (
  <div className="bg-slate-900 p-6 rounded-2xl shadow-2xl shadow-black/20 ring-1 ring-white/5 animate-pulse">
     <div className="flex justify-between items-start">
        <div>
          <div className="h-4 w-24 bg-slate-800 rounded-md"></div>
          <div className="h-10 w-48 bg-slate-800 rounded-md mt-2"></div>
        </div>
        <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
     </div>
  </div>
);

export { NetWorthCard, NetWorthSkeleton };