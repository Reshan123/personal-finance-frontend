export interface FinancialItem {
  name: string;
  type: string;
  value: string;
  notes: string;
  sub_notes: string;
  row: number;
}

export type FinancialCategory =
  | "Assets"
  | "Non Current Assets"
  | "Liability"
  | "Other";

export type FinancialData = {
  [K in FinancialCategory]?: FinancialItem[];
};

export interface CompanyStock {
  row: number;
  stock_symbol: string;
  actual_cost: string;
  number_of_shares: string;
  per_share_value: string;
  current_value: string;
  gain_loss: string;
}

export interface LiveCompanyStock {
  row: number;
  stock_symbol: string;
  actual_cost: string;
  number_of_shares: string;
  per_share_value: string;
  current_value: string;
  gain_loss: string;
  company_name: string;
  day_range: string;
  previous_close: string;
  current_price: string;
  change: string;
  volume_today: string;
  current_price_value: number;
  gain_loss_value: number;
}

// Add the new data to the CseData type
export interface CseData {
  companies: CseDataCombined;
}

export interface CseDataCombined {
  personal: CompanyStock[],
  dads: CompanyStock[]
}

export interface LiveCseData {
  companies: LiveCseDataCombined;
}

export interface LiveCseDataCombined {
  personal: LiveCompanyStock[];
  dads: LiveCompanyStock[];
}