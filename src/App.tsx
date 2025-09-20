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
import { LiveCseTable, LiveCseTableSkeleton } from "./components/LiveCseTable"; // NEW
import { Header } from "./components/Header";
import { ErrorMessage } from "./components/ErrorMessage";
import { Tabs } from "./components/Tabs"; // NEW
// Types
import type { FinancialData, CseData, LiveCompanyStock } from "./types/types";

// Define tabs configuration
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "live_cse", label: "Live CSE Holdings" },
];

const App = () => {
  // --- State Management ---
  const [basicData, setBasicData] = useState<FinancialData>({});
  const [cseData, setCseData] = useState<CseData>({ companies: [] });
  const [liveCseData, setLiveCseData] = useState<LiveCompanyStock[]>([]); // NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("overview"); // NEW
  const [isUpdating, setIsUpdating] = useState(false);

  axios.defaults.baseURL =
    import.meta.env.VITE_API_URL || "https://mockapi.io/api/v1";
  axios.defaults.headers.common["X_API_KEY"] =
    import.meta.env.VITE_API_KEY || "";

  // --- Data Fetching ---
  const fetchData = () => {
    setLoading(true);
    setError("");

    const basicInfoPromise = axios.get("/get_basic_info");
    const cseInfoPromise = axios.get("/get_cse_info");
    const liveCsePromise = axios.get("/get_cse_live_data");

    Promise.all([basicInfoPromise, cseInfoPromise, liveCsePromise]) // UPDATED
      .then(([basicResponse, cseResponse, liveCseResponse]) => {
        // UPDATED
        setBasicData(basicResponse.data);
        setCseData(cseResponse.data);
        setLiveCseData(liveCseResponse.data); // NEW
        setLastUpdated(new Date());
      })
      .catch((error) => {
        setError("Failed to fetch financial data. Please try again.");
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // NEW: Function to handle the stock price update
  const updateStockPrices = async () => {
    setIsUpdating(true);
    try {
      // Call the update endpoint. A POST request is common for triggering actions.
      await axios.get("/update_stock_prices");
      fetchData();
    } catch (err) {
      // An error toast notification could be added here.
      console.error("Failed to update stock prices:", err);
      setError("Could not update stock prices. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };

  const netWorth = basicData?.Other?.find((item) => item.name === "Net Worth");

  // Renders the content for the currently active tab
  const renderTabContent = () => {
    if (loading) {
      // Show skeleton based on the tab that will be shown
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
      return (
        <div className="mt-8">
          <LiveCseTableSkeleton />
        </div>
      );
    }

    if (activeTab === "overview") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <FinancialCard
              title="Assets"
              data={basicData.Assets ?? []}
              icon="wallet"
            />
            <FinancialCard
              title="Non Current Assets"
              data={basicData["Non Current Assets"] ?? []}
              icon="building"
            />
            <FinancialCard
              title="Liabilities"
              data={basicData.Liability ?? []}
              icon="trendingDown"
            />
          </div>
          <div className="space-y-8">
            {netWorth && <NetWorthCard netWorth={netWorth.value} />}
            <CseHoldingsCard data={cseData.companies} />
          </div>
        </div>
      );
    }

    if (activeTab === "live_cse") {
      return (
        <div className="mt-8">
          <LiveCseTable
            data={liveCseData}
            onUpdate={updateStockPrices}
            isUpdating={isUpdating}
          />
        </div>
      );
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header
          lastUpdated={lastUpdated}
          onRefresh={fetchData}
          isLoading={loading}
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
