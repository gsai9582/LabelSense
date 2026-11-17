import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  toast: (options: { title: string; description?: string; variant?: ToastVariant }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
  removeToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'info' }: { title: string; description?: string; variant?: ToastVariant }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts(prev => [...prev, { id, title, description, variant }]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />,
    error: <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />,
    info: <Info className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 dark:border-emerald-800/80',
    warning: 'border-amber-200 dark:border-amber-800/80',
    error: 'border-red-200 dark:border-red-800/80',
    info: 'border-slate-200 dark:border-slate-800',
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border bg-white dark:bg-slate-900 shadow-lg text-slate-900 dark:text-slate-100 ${borders[t.variant || 'info']}`}
            >
              {icons[t.variant || 'info']}
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-semibold leading-tight">{t.title}</p>
                {t.description && (
                  <p className="text-2xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
