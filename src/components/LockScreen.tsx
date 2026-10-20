'use client';

import React from 'react';
import Image from 'next/image';
import { useDentis } from '@/context/DentisContext';
import {
  LogIn,
  Building2,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  Sparkles,
  Lock,
  ChevronRight,
} from 'lucide-react';

export default function LockScreen() {
  const {
    currentBranch,
    currentUser,
    login,
    setIsBranchModalOpen,
  } = useDentis();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-[#07363E] via-[#0D5966] to-[#094550] animate-in fade-in duration-300">
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-white/20 text-center">
        {/* Brand Header */}
        <div className="space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0D5966] text-white flex items-center justify-center mx-auto shadow-md p-3">
            <Image
              src="/tooth-white.png"
              alt="Dentis logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Dentis
            </h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Portal Operasional Klinik Gigi
            </p>
          </div>
        </div>

        {/* Current Branch Pill with Switch Action */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#0D5966]/10 text-[#0D5966] flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Cabang Terpilih:
              </span>
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentBranch.fullName}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBranchModalOpen(true)}
            className="text-[11px] font-bold text-[#0D5966] hover:underline cursor-pointer shrink-0"
          >
            Ganti Cabang
          </button>
        </div>

        {/* Lock Notice & Quick Login */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Sesi kerja sebelumnya telah diakhiri</span>
          </div>

          <button
            type="button"
            onClick={() => login()}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#0D5966] hover:bg-[#094550] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Kembali sebagai {currentUser.role}</span>
          </button>
        </div>

        {/* Demo Fast Switch Role */}
        <div className="pt-4 border-t border-slate-100 text-left space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Atau Masuk dengan Role Lain (Simulasi):
          </span>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() =>
                login({
                  name: 'Siti Rahma',
                  role: 'Resepsionis',
                  initials: 'RS',
                  email: 'reception.senopati@dentis.co.id',
                })
              }
              className="p-2.5 rounded-xl border border-slate-200 hover:border-[#0D5966]/40 hover:bg-slate-50 transition-all flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Siti Rahma</p>
                  <p className="text-[10px] text-slate-400">Resepsionis Utama • Front Desk</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D5966]" />
            </button>

            <button
              onClick={() =>
                login({
                  name: 'drg. Dimas Wicaksono, Sp.KG',
                  role: 'Dokter Spesialis',
                  initials: 'DW',
                  email: 'dimas.w@dentis.co.id',
                })
              }
              className="p-2.5 rounded-xl border border-slate-200 hover:border-[#0D5966]/40 hover:bg-slate-50 transition-all flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center">
                  <Stethoscope className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">drg. Dimas Wicaksono, Sp.KG</p>
                  <p className="text-[10px] text-slate-400">Dokter Spesialis • Ruang Estetika 1</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D5966]" />
            </button>

            <button
              onClick={() =>
                login({
                  name: 'Budi Santoso',
                  role: 'Admin Operasional',
                  initials: 'AD',
                  email: 'admin@dentis.co.id',
                })
              }
              className="p-2.5 rounded-xl border border-slate-200 hover:border-[#0D5966]/40 hover:bg-slate-50 transition-all flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Budi Santoso</p>
                  <p className="text-[10px] text-slate-400">Super Admin • Hak Akses Penuh</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D5966]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
