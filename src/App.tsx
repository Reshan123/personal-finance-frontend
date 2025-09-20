import { useState, useEffect } from "react";
import axios from "axios";
// Components
import {
  FinancialCard,
  FinancialCardSkeleton,
} from "./components/FinancialCard";
import {
  CseHoldingsCard,
  CseHoldingsSkeleton,
} from "./components/CseHoldingsCard";
import { NetWorthCard, NetWorthSkeleton } from "./components/NetWorthCard";
import { LiveCseTable, LiveCseTableSkeleton } from "./components/LiveCseTable";
import { Header } from "./components/Header";
import { ErrorMessage } from "./components/ErrorMessage";
import { Tabs } from "./components/Tabs";
// Types
import type {
  FinancialData,
  CseData,
  LiveCseData,
  MonthlyBudgetItem,
} from "./types/types";
import {
  MonthlyBudget,
  MonthlyBudgetSkeleton,
} from "./components/MonthlyBudgetTable";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "live_cse", label: "Live CSE Holdings" },
  { id: "monthly_budget", label: "Monthly Budget" },
];

const App = () => {
  // --- State Management ---
  const [basicData, setBasicData] = useState<FinancialData>({});
  const [cseData, setCseData] = useState<CseData>({
    companies: { dads: [], personal: [] },
  });
  const [liveCseData, setLiveCseData] = useState<LiveCseData>({
    companies: { dads: [], personal: [] },
  });
  const [loading, setLoading] = useState(true);
  const [calLoading, setCalLoading] = useState(false);
  const [monthlyBudgetData, setMonthlyBudgetData] = useState<
    MonthlyBudgetItem[]
  >([]);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isUpdating, setIsUpdating] = useState(false);
  const [areValuesHidden, setAreValuesHidden] = useState(true); // State for hiding values

  axios.defaults.baseURL =
    import.meta.env.VITE_API_URL || "https://mockapi.io/api/v1";
  axios.defaults.headers.common["X_API_KEY"] =
    import.meta.env.VITE_API_KEY || "";

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const basicInfoPromise = axios.get("/get_basic_info");
      const cseInfoPromise = axios.get("/get_cse_info");
      const liveCsePromise = axios.get("/get_cse_live_data");
      const monthlyBudgetDataPromise = axios.get("/monthly_budget_data");

      const [basicResponse, cseResponse, liveCseResponse, monthlyBudgetData] =
        await Promise.all([
          basicInfoPromise,
          cseInfoPromise,
          liveCsePromise,
          monthlyBudgetDataPromise,
        ]);

      setBasicData(basicResponse.data);
      setCseData(cseResponse.data);
      setLiveCseData(liveCseResponse.data);
      setMonthlyBudgetData(monthlyBudgetData.data.monthly_budget_data);
      setLastUpdated(new Date());
    } catch (error) {
      setError("Failed to fetch financial data. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calUpdateValues = async () => {
    setCalLoading(true);
    try {
      await axios.get("/update_cal_data");
      await fetchData();
    } catch (err) {
      console.error("Failed to update CAL values:", err);
      setError("Could not update CAL values. Please try again later.");
    } finally {
      setCalLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStockPrices = async () => {
    setIsUpdating(true);
    try {
      await axios.get("/update_stock_prices");
      await fetchData();
    } catch (err) {
      console.error("Failed to update stock prices:", err);
      setError("Could not update stock prices. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleValueVisibility = () => {
    setAreValuesHidden((prevState) => !prevState);
  };

  const netWorth = basicData?.Other?.find((item) => item.name === "Net Worth");

  const renderTabContent = () => {
    if (loading) {
      if (activeTab === "overview") {
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              <FinancialCardSkeleton />
              <FinancialCardSkeleton />
            </div>
            <div className="space-y-8">
              <NetWorthSkeleton />
              <CseHoldingsSkeleton />
            </div>
          </div>
        );
      }
      if (activeTab === "monthly_budget") {
        return (
          <div className="mt-8">
            <MonthlyBudgetSkeleton />
          </div>
        );
      }

      if (activeTab === "live_cse") {
        return (
          <div className="mt-8">
            <LiveCseTableSkeleton />
          </div>
        );
      }

      return null; // Should not happen
    }

    if (activeTab === "overview") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* This is now the second item on mobile, but the first on large screens */}
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            <FinancialCard
              title="Assets"
              data={basicData.Assets ?? []}
              icon="wallet"
              areValuesHidden={areValuesHidden}
            />
            <FinancialCard
              title="Non Current Assets"
              data={basicData["Non Current Assets"] ?? []}
              icon="building"
              areValuesHidden={areValuesHidden}
            />
            <FinancialCard
              title="Liabilities"
              data={basicData.Liability ?? []}
              icon="trendingDown"
              areValuesHidden={areValuesHidden}
            />
          </div>

          {/* This is now the first item on mobile, but the second on large screens */}
          <div className="space-y-8 order-1 lg:order-2">
            {netWorth && (
              <NetWorthCard
                netWorth={netWorth.value}
                areValuesHidden={areValuesHidden}
              />
            )}
            <CseHoldingsCard
              data={cseData.companies.personal}
              areValuesHidden={areValuesHidden}
            />
            <CseHoldingsCard
              data={cseData.companies.dads}
              areValuesHidden={areValuesHidden}
            />
          </div>
        </div>
      );
    }

    if (activeTab === "monthly_budget") {
      return (
        <div className="mt-8">
          <MonthlyBudget
            areValuesHidden={areValuesHidden}
            data={monthlyBudgetData}
          />
        </div>
      );
    }

    if (activeTab === "live_cse") {
      return (
        <>
          <div className="mt-8">
            <LiveCseTable
              data={liveCseData.companies.personal}
              onUpdate={updateStockPrices}
              isUpdating={isUpdating}
              areValuesHidden={areValuesHidden}
            />
          </div>
          <div className="mt-8">
            <LiveCseTable
              data={liveCseData.companies.dads}
              onUpdate={updateStockPrices}
              isUpdating={isUpdating}
              areValuesHidden={areValuesHidden}
            />
          </div>
        </>
      );
    }
    return null; // Should not happen
  };

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-300 p-4 sm:p-6 lg:p-9">
      <div className="max-w-8xl mx-auto">
        <Header
          lastUpdated={lastUpdated}
          onRefresh={fetchData}
          isLoading={loading}
          calOnClick={calUpdateValues}
          isCalLoading={calLoading}
          areValuesHidden={areValuesHidden}
          onToggleVisibility={toggleValueVisibility}
        />

        <main className="mt-8">
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          {error ? (
            <div className="mt-8">
              <ErrorMessage message={error} onRetry={fetchData} />
            </div>
          ) : (
            renderTabContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
