'use client';

import React, { useState } from 'react';
import { useDentis } from '@/context/DentisContext';
import {
  Users,
  Search,
  ChevronRight,
  MessageCircle,
  Calendar,
  Sparkles,
  UserCheck,
} from 'lucide-react';

export const RekamMedisSection: React.FC = () => {
  const { patients, setSelectedPatientForDetail } = useDentis();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'NEW' | 'RETURNING'>('ALL');

  const filteredPatients = patients.filter((patient) => {
    // Type filter
    if (filterType === 'NEW' && !patient.isNewPatient) return false;
    if (filterType === 'RETURNING' && patient.isNewPatient) return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = patient.name.toLowerCase().includes(q);
      const matchId = patient.id.toLowerCase().includes(q);
      const matchPhone = patient.phone.includes(q);
      if (!matchName && !matchId && !matchPhone) return false;
    }

    return true;
  });

  const newPatientsCount = patients.filter((p) => p.isNewPatient).length;
  const returningCount = patients.filter((p) => !p.isNewPatient).length;

  const getCleanPhone = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.substring(1);
    return clean;
  };

  const metrics = [
    {
      label: 'TOTAL PASIEN TERDATA',
      value: `${patients.length}\u00A0Pasien`,
      subtext: 'Nomor RM unik aktif',
      icon: Users,
      trend: '100% Terdata',
    },
    {
      label: 'PASIEN BARU (FIRST VISIT)',
      value: `${newPatientsCount}\u00A0Pasien`,
      subtext: 'Kunjungan pertama / baru',
      icon: Sparkles,
      trend: `${Math.round((newPatientsCount / (patients.length || 1)) * 100)}% Rasio`,
    },
    {
      label: 'PASIEN LAMA / RUTIN',
      value: `${returningCount}\u00A0Pasien`,
      subtext: 'Perawatan berkala (≥2x)',
      icon: Calendar,
      trend: `${Math.round((returningCount / (patients.length || 1)) * 100)}% Retensi`,
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in pb-14">
      {/* ============================================================== */}
      {/* Metric Cards Summary */}
      {/* ============================================================== */}
      <div className="p-2.5 sm:p-3.5 rounded-[22px] sm:rounded-[28px] bg-[#0D5966] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-5 rounded-[16px] sm:rounded-[20px] bg-white flex flex-col justify-between min-h-[100px] sm:min-h-[130px] cursor-default shadow-2xs"
              >
                {/* 1. Header Row */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0D5966]" />
                  </div>
                </div>

                {/* 2. Middle Row: Metric Value */}
                <div className="my-1.5 sm:my-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight block">
                    {item.value}
                  </span>
                </div>

                {/* 3. Bottom Row: Context Description & Distinct Trend Badge */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] sm:text-xs text-slate-500 truncate" title={item.subtext}>
                    {item.subtext}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center border border-emerald-100/80 shrink-0">
                    {item.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TIER 1: SEGMENTED FILTER PILLS (UNIFIED DESIGN) */}
      {/* ======================================================== */}
      <div className="p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Semua Pasien ({patients.length})
          </button>
          <button
            onClick={() => setFilterType('NEW')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterType === 'NEW'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Pasien Baru ({newPatientsCount})
          </button>
          <button
            onClick={() => setFilterType('RETURNING')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterType === 'RETURNING'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Pasien Lama ({returningCount})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TIER 2: SEARCH & FILTER BAR (UNIFIED DESIGN) */}
      {/* ======================================================== */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID Pasien (DNT-MR-00xx), nama, atau no. WA..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0D5966] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>
            Menampilkan <strong className="text-slate-800 font-bold">{filteredPatients.length}</strong> dari{' '}
            {patients.length} pasien terdaftar
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PATIENT LIST: DESKTOP TABLE & MOBILE CARDS               */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* MOBILE CARDS VIEW (md:hidden) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredPatients.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tidak ada pasien yang sesuai dengan filter.
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatientForDetail(patient)}
                className="p-4 hover:bg-slate-50/70 transition-colors space-y-3 cursor-pointer"
              >
                {/* Header: Name, Status & WhatsApp */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0D5966]">{patient.name}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                          patient.isNewPatient
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-teal-50 text-teal-800 border border-teal-200'
                        }`}
                      >
                        {patient.isNewPatient ? 'Baru' : 'Lama'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      {patient.gender} • Gol. {patient.bloodType || 'N/A'}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${getCleanPhone(patient.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WA</span>
                  </a>
                </div>

                {/* Patient Metadata Box */}
                <div className="bg-slate-50/80 p-3 rounded-xl space-y-1.5 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {patient.id}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Total: <strong className="text-slate-800 font-bold">{patient.totalVisits}x</strong> kunjungan
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60">
                    <span className="text-slate-400">Kunjungan Terakhir:</span>
                    <span className="font-medium text-slate-700">{patient.lastVisitDate}</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-end pt-1">
                  <span className="text-xs font-bold text-[#0D5966] inline-flex items-center gap-1">
                    <span>Lihat Rekam Medis</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP TABLE VIEW (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[760px]">
            <thead className="bg-[#F3F5F4] text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200/70">
              <tr>
                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">ID Rekam Medis</th>
                <th className="py-3.5 px-4 sm:px-5">Nama Pasien</th>
                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">WhatsApp</th>
                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 sm:px-5 whitespace-nowrap">Riwayat Kunjungan</th>
                <th className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada pasien yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedPatientForDetail(patient)}
                  >
                    {/* Patient ID */}
                    <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                      <span className="font-mono text-xs font-extrabold text-[#0D5966] bg-[#0D5966]/10 px-2.5 py-1 rounded-md whitespace-nowrap inline-block">
                        {patient.id}
                      </span>
                    </td>

                    {/* Name & Gender */}
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="font-bold text-slate-800 text-sm group-hover:text-[#0D5966] transition-colors flex items-center gap-1.5 whitespace-nowrap">
                        <span>{patient.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#0D5966] transition-opacity" />
                      </div>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {patient.gender} • Gol. {patient.bloodType || 'N/A'}
                      </span>
                    </td>

                    {/* WhatsApp */}
                    <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`https://wa.me/${getCleanPhone(patient.phone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-all text-xs font-semibold whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="font-mono">{patient.phone}</span>
                      </a>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase whitespace-nowrap inline-flex items-center ${
                          patient.isNewPatient
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-teal-50 text-teal-800 border border-teal-200'
                        }`}
                      >
                        {patient.isNewPatient ? 'Pasien Baru' : 'Pasien Lama'}
                      </span>
                    </td>

                    {/* Riwayat Kunjungan (Combined Total & Last Visit) */}
                    <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                      <div className="font-extrabold text-slate-800 text-sm">
                        {patient.totalVisits}{' '}
                        <span className="text-xs font-normal text-slate-400">kali</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Terakhir: {patient.lastVisitDate}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientForDetail(patient);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#F3F5F4] hover:bg-[#0D5966] hover:text-white text-xs font-bold text-slate-600 transition-all inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                      >
                        <span>Lihat Riwayat</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
