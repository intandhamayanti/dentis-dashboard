'use client';

import React from 'react';
import { useDentis } from '@/context/DentisContext';
import {
  Menu,
  Plus,
  Calendar,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const { activeMenu, setIsNewBookingModalOpen } = useDentis();

  const getMenuTitle = () => {
    switch (activeMenu) {
      case 'overview':
        return {
          title: 'Overview & Operasional',
          mobileTitle: 'Overview',
          desc: 'Antrean pasien hari ini, ketersediaan dokter, dan overview operasional klinik.',
        };
      case 'reservasi':
        return {
          title: 'Manajemen Reservasi & Leads',
          mobileTitle: 'Reservasi & Leads',
          desc: 'Kelola jadwal kunjungan pasien, web leads online, dan konfirmasi WhatsApp.',
        };
      case 'rekam-medis':
        return {
          title: 'Database Pasien & Rekam Medis',
          mobileTitle: 'Rekam Medis',
          desc: 'Catatan kunjungan, riwayat tindakan klinis, dan profil pasien.',
        };
      case 'dokter':
        return {
          title: 'Tim Dokter Spesialis & Shift',
          mobileTitle: 'Jadwal & Dokter',
          desc: 'Jadwal shift praktik mingguan dan status kehadiran on-duty.',
        };
      case 'keuangan':
        return {
          title: 'Laporan & Keuangan',
          mobileTitle: 'Laporan Keuangan',
          desc: 'Analitik pendapatan harian & bulanan serta volume tindakan.',
        };
      case 'pengaturan':
        return {
          title: 'Pengaturan Web & Master Layanan',
          mobileTitle: 'Pengaturan',
          desc: 'Kelola master tarif layanan, info operasional, dan konten web.',
        };
      default:
        return { title: 'Dashboard', mobileTitle: 'Dashboard', desc: 'Portal Admin Dentis' };
    }
  };

  const menuInfo = getMenuTitle();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 border-b border-slate-200/80 shadow-2xs flex items-center justify-between gap-2.5 sm:gap-4">
      {/* Mobile Toggle & Title */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 hover:text-[#0D5966] flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-2xs cursor-pointer"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider uppercase">
            <span>Dentis</span>
            <span className="text-slate-300">/</span>
            <span className="text-[#0D5966] font-bold capitalize">{activeMenu}</span>
          </div>
          <h1 className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight truncate leading-tight mt-0.5">
            <span className="sm:hidden">{menuInfo.mobileTitle}</span>
            <span className="hidden sm:inline">{menuInfo.title}</span>
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-[#0D5966]" />
          <span>Selasa, 20 Oktober 2026</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">10:00 - 20:00 WIB</span>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => setIsNewBookingModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold bg-[#0D5966] text-white shadow-xs hover:bg-[#094550] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Tambah </span>
          <span>Reservasi</span>
        </button>
      </div>
    </header>
  );
}
