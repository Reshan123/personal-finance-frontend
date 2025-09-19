import { useState, useEffect } from "react";
import axios from "axios";
import { FinancialCard, FinancialCardSkeleton } from "./components/FinancialCard";
import { CseHoldingsCard, CseHoldingsSkeleton } from "./components/CseHoldingsCard";
import { NetWorthCard, NetWorthSkeleton } from "./components/NetWorthCard";
import { Header } from "./components/Header";
import { ErrorMessage } from "./components/ErrorMessage";
import type { FinancialData, CseData } from "./types/types"; // Assuming types are moved to types.ts

const App = () => {
  // --- State Management ---
  const [basicData, setBasicData] = useState<FinancialData>({});
  const [cseData, setCseData] = useState<CseData>({ companies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://mockapi.io/api/v1";

  // --- Data Fetching ---
  const fetchData = () => {
    setLoading(true);
    setError("");

    const basicInfoPromise = axios.get("/get_basic_info");
    const cseInfoPromise = axios.get("/get_cse_info");

    Promise.all([basicInfoPromise, cseInfoPromise])
      .then(([basicResponse, cseResponse]) => {
        setBasicData(basicResponse.data);
        setCseData(cseResponse.data);
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
    // Simulate a slightly longer load time to see the skeleton effect
    const timer = setTimeout(() => {
      fetchData();
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  const netWorth = basicData?.Other?.find((item) => item.name === "Net Worth");

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header lastUpdated={lastUpdated} onRefresh={fetchData} isLoading={loading} />
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {loading ? (
            <>
              {/* --- Skeleton UI --- */}
              <div className="lg:col-span-2 space-y-8">
                <FinancialCardSkeleton />
                <FinancialCardSkeleton />
                <FinancialCardSkeleton />
              </div>
              <div className="space-y-8">
                <NetWorthSkeleton />
                <CseHoldingsSkeleton />
              </div>
            </>
          ) : (
            <>
              {/* --- Main Content --- */}
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
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;