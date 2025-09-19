import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl shadow-black/20 ring-1 ring-white/5 text-center max-w-md mx-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/50">
        <AlertTriangle className="h-6 w-6 text-red-500" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-red-500">
        An Error Occurred
      </h2>
      <p className="text-slate-400 mt-2 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
      >
        Try Again
      </button>
    </div>
  </div>
);