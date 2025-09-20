import {
  Eye,
  EyeOff,
  MoreVertical,
  DatabaseZap,
  RotateCw,
  LineChart,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
  isCalLoading: boolean;
  onConfirmCalUpdate: () => void;
  areValuesHidden: boolean;
  onToggleVisibility: () => void;
  onUpdateStockPrices: () => void; // Passed from App.tsx
}

// --- Reusable Confirmation Modal Component ---
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-lg p-6 w-full max-w-sm ring-1 ring-slate-700">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-slate-400 mt-2 text-sm">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-md text-sm font-semibold bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 disabled:cursor-wait text-white transition-colors flex items-center gap-2"
          >
            {isLoading && <RotateCw size={14} className="animate-spin" />}
            {isLoading ? "Updating..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const Header = ({
  lastUpdated,
  onRefresh,
  isLoading,
  isCalLoading,
  onConfirmCalUpdate,
  areValuesHidden,
  onToggleVisibility,
  onUpdateStockPrices,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCalModalOpen, setIsCalModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false); // New state for stock update modal
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCalUpdateClick = () => {
    setIsMenuOpen(false);
    setIsCalModalOpen(true);
  };

  const handleStockUpdateClick = () => {
    setIsMenuOpen(false);
    setIsStockModalOpen(true);
  };

  const handleCalConfirm = () => {
    onConfirmCalUpdate();
  };

  const handleStockConfirm = () => {
    onUpdateStockPrices();
  };

  // Close modals when their respective loading states are finished
  useEffect(() => {
    if (!isCalLoading) setIsCalModalOpen(false);
  }, [isCalLoading]);

  useEffect(() => {
    // Assuming the general `isLoading` is used for the stock price update
    if (!isLoading) setIsStockModalOpen(false);
  }, [isLoading]);

  // Reusable button components
  const HideShowButton = ({ isMenuItem = false }: { isMenuItem?: boolean }) => (
    <button
      onClick={() => {
        onToggleVisibility();
        if (isMenuItem) setIsMenuOpen(false);
      }}
      className={`flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ring-1 ring-slate-700 w-full text-sm`}
    >
      {areValuesHidden ? <Eye size={16} /> : <EyeOff size={16} />}
      {areValuesHidden ? "Show Values" : "Hide Values"}
    </button>
  );

  const UpdateCalButton = () => (
    <button
      onClick={handleCalUpdateClick}
      disabled={isCalLoading}
      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-wait text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ring-1 ring-slate-700 w-full text-sm"
    >
      <DatabaseZap
        className={`w-4 h-4 ${isCalLoading ? "animate-spin" : ""}`}
      />
      {isCalLoading ? "Updating..." : "Update CAL Prices"}
    </button>
  );

  const RefreshButton = () => (
    <button
      onClick={() => {
        onRefresh();
        setIsMenuOpen(false);
      }}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-wait text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ring-1 ring-slate-700 w-full text-sm"
    >
      <RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
      {isLoading ? "Refreshing..." : "Refresh All Data"}
    </button>
  );

  const UpdateStockPricesButton = () => (
    <button
      onClick={handleStockUpdateClick}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-wait text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ring-1 ring-slate-700 w-full text-sm"
    >
      <LineChart className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
      {isLoading ? "Updating..." : "Update CSE Prices"}
    </button>
  );

  return (
    <>
      <header className="flex flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Financial Overview
          </h1>
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

        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          <div className="hidden sm:block">
            <HideShowButton />
          </div>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-slate-800 rounded-lg ring-1 ring-slate-700 hover:bg-slate-700 transition-colors"
            >
              <MoreVertical size={20} className="text-slate-200" />
            </button>

            {isMenuOpen && (
              <div className="absolute top-12 right-0 bg-slate-800/90 backdrop-blur-md rounded-lg shadow-xl w-52 p-2 flex flex-col gap-2 ring-1 ring-slate-700 z-20">
                <div className="sm:hidden">
                  <HideShowButton isMenuItem={true} />
                </div>
                <UpdateCalButton />
                <UpdateStockPricesButton />
                <RefreshButton />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CAL Update Modal */}
      <ConfirmationModal
        isOpen={isCalModalOpen}
        onClose={() => setIsCalModalOpen(false)}
        onConfirm={handleCalConfirm}
        isLoading={isCalLoading}
        title="Confirm CAL Update"
        message="Are you sure you want to update the CAL values? This action might take a moment to complete."
      />

      {/* Stock Prices Update Modal */}
      <ConfirmationModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onConfirm={handleStockConfirm}
        isLoading={isLoading} // Using the general isLoading for this
        title="Confirm CSE Price Update"
        message="Are you sure you want to update live CSE stock prices? This will refresh the market data."
      />
    </>
  );
};
