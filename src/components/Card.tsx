import React from 'react';
import { Wallet, Building, TrendingDown, ArrowRight, BarChart2 } from 'lucide-react';

// An icon map to easily call icons by name
const icons = {
  wallet: <Wallet className="w-5 h-5" />,
  building: <Building className="w-5 h-5" />,
  trendingDown: <TrendingDown className="w-5 h-5" />,
  arrowRight: <ArrowRight className="w-5 h-5" />,
  barChart: <BarChart2 className="w-5 h-5" />,
};

export type IconName = keyof typeof icons;

interface CardProps {
  title?: string;
  icon?: IconName;
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, className = '', padding = true, actions }) => (
  <div className={`bg-slate-900 shadow-2xl shadow-black/20 rounded-2xl ring-1 ring-white/5 ${className}`}>
    {title && (
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {icon && <span className="text-slate-500">{icons[icon]}</span>}
          <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
        </div>
        {actions && <div>{actions}</div>}
      </div>
    )}
    <div className={padding ? 'p-4' : ''}>
      {children}
    </div>
  </div>
);