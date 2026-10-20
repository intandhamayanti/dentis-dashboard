'use client';

import React from 'react';
import { useDentis } from '@/context/DentisContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useDentis();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end pointer-events-none">
      {toasts.slice(-1).map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/40 text-xs transition-all"
          >
            <div className="flex items-center gap-2">
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-[#0D5966] shrink-0" />
              ) : isWarning ? (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <span className="font-semibold text-slate-800">{toast.title}</span>
              {toast.message && (
                <span className="text-slate-500 text-[11px] hidden sm:inline">
                  • {toast.message}
                </span>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
