import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 text-white shadow-xl border border-zinc-800 max-w-[92vw]"
    >
      <CheckCircle2 className="w-4 h-4 text-[#E60023] shrink-0" />
      <span className="text-sm font-medium truncate">{toast.message}</span>
      {toast.actionLabel && toast.onAction && (
        <button
          onClick={toast.onAction}
          className="text-sm font-semibold text-white underline underline-offset-4 hover:text-zinc-200 whitespace-nowrap shrink-0 ml-1"
        >
          {toast.actionLabel}
        </button>
      )}
    </div>
  );
};
