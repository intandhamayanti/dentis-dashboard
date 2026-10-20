'use client';

import React from 'react';
import { useDentis } from '@/context/DentisContext';
import { LogOut, X, AlertTriangle } from 'lucide-react';

export default function LogoutConfirmModal() {
  const {
    isLogoutConfirmOpen,
    setIsLogoutConfirmOpen,
    currentUser,
    currentBranch,
    logout,
  } = useDentis();

  if (!isLogoutConfirmOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-100 text-center">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
          <LogOut className="w-6 h-6" />
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900">
            Keluar dari Sesi Kerja?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Anda login sebagai <strong className="text-slate-800 font-semibold">{currentUser.role}</strong> di{' '}
            <strong className="text-[#0D5966] font-semibold">{currentBranch.fullName}</strong>.
            Anda dapat masuk kembali kapan saja melalui layar login.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setIsLogoutConfirmOpen(false)}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={logout}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Ya, Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
