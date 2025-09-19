import { useMemo } from 'react';
import { Card } from './Card';
import type { IconName } from './Card';
import type { FinancialItem } from '../types/types';

const FinancialCard = ({ title, data, icon }: { title: string; data: FinancialItem[]; icon: IconName; }) => {
  if (!data || data.length === 0) return null;

  // NEW: Calculate the total value using useMemo
  const totalFormatted = useMemo(() => {
    const parseCurrency = (value: string): number => {
      if (!value || typeof value !== 'string') return 0;
      const num = parseFloat(value.replace(/LKR|,|\s/g, ''));
      return isNaN(num) ? 0 : num;
    };

    const total = data.reduce((acc, item) => acc + parseCurrency(item.value), 0);

    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
    }).format(total);
  }, [data]);

  return (
    <Card title={title} icon={icon} padding={false}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800/50 text-xs text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Notes</th>
              <th scope="col" className="px-6 py-3 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.row} className={`border-t border-slate-800 ${index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800/50'} hover:bg-sky-950/50 transition-colors`}>
                <td className="px-6 py-4 font-medium text-slate-200 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 text-slate-400 hidden md:table-cell">{item.notes} {item.sub_notes && `(${item.sub_notes})`}</td>
                <td className="px-6 py-4 text-right font-mono text-slate-300">{item.value}</td>
              </tr>
            ))}
          </tbody>
          {/* --- NEW: Totals Row --- */}
          <tfoot className="bg-slate-600 font-bold text-slate-200">
            <tr>
              <td className="px-6 py-4">Total</td>
              <td className="px-6 py-4 hidden md:table-cell"></td> {/* Empty cell for notes column */}
              <td className="px-6 py-4 text-right font-mono">{totalFormatted}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
};

// Skeleton loader remains unchanged
const FinancialCardSkeleton = () => (
  <div className="bg-slate-900 shadow-2xl shadow-black/20 rounded-2xl ring-1 ring-white/5 animate-pulse">
    <div className="p-4 border-b border-slate-800">
      <div className="h-6 w-1/3 bg-slate-800 rounded-md"></div>
    </div>
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 w-1/4 bg-slate-800 rounded-md"></div>
        <div className="h-4 w-1/3 bg-slate-800 rounded-md"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 w-1/3 bg-slate-800 rounded-md"></div>
        <div className="h-4 w-1/4 bg-slate-800 rounded-md"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 w-1/2 bg-slate-800 rounded-md"></div>
        <div className="h-4 w-1/3 bg-slate-800 rounded-md"></div>
      </div>
    </div>
  </div>
);

export { FinancialCard, FinancialCardSkeleton };