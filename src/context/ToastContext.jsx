/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  useEffect(() => {
    const activeTimers = timers.current;
    return () => activeTimers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const dismissToast = useCallback((id) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((items) => items.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {
      const id = crypto.randomUUID();
      setToasts((items) => [...items, { id, message, type }]);
      timers.current.set(
        id,
        window.setTimeout(() => dismissToast(id), 3500),
      );
    },
    [dismissToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed inset-x-4 top-4 z-[100] flex max-w-sm flex-col gap-3 sm:left-auto sm:right-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ message, type, onDismiss }) {
  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle2 : CircleAlert;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <Icon
        className={
          isSuccess
            ? "h-5 w-5 shrink-0 text-emerald-500"
            : "h-5 w-5 shrink-0 text-red-500"
        }
      />
      <p className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-100">
        {message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
