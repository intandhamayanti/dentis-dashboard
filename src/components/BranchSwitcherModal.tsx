'use client';

import React from 'react';
import { useDentis } from '@/context/DentisContext';
import {
  Building2,
  X,
  CheckCircle2,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';

export default function BranchSwitcherModal() {
  const {
    isBranchModalOpen,
    setIsBranchModalOpen,
    branches,
    currentBranch,
    switchBranch,
  } = useDentis();

  if (!isBranchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0D5966]/10 text-[#0D5966] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Pilih Cabang Klinik Dentis
                </h3>
                <span className="text-[10px] font-bold bg-[#0D5966]/10 text-[#0D5966] px-2 py-0.5 rounded-full">
                  Multi-Branch
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih cabang klinik untuk beralih antrean pasien, dokter on-duty, dan operasional.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBranchModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Branch Cards Grid */}
        <div className="space-y-3">
          {branches.map((b) => {
            const isActive = currentBranch.id === b.id;
            return (
              <div
                key={b.id}
                onClick={() => switchBranch(b.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                  isActive
                    ? 'border-[#0D5966] bg-[#0D5966]/5 ring-2 ring-[#0D5966]/15 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-[#0D5966]/40 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                        {b.fullName}
                      </h4>

                      {isActive && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Cabang Aktif Saat Ini</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{b.address}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-[#0D5966]">{b.phone}</span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1">
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                        isActive
                          ? 'bg-[#0D5966] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-[#0D5966] hover:text-white'
                      }`}
                    >
                      <span>{isActive ? 'Aktif' : 'Beralih'}</span>
                      {!isActive && <ArrowRight className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-2 text-center text-xs text-slate-400">
          Setiap cabang memiliki data jadwal shift dokter dan antrean pasien terpisah.
        </div>
      </div>
    </div>
  );
}
