'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDentis } from '@/context/DentisContext';
import { DayOfWeek, ShiftSession } from '@/types/dentis';
import {
  X,
  ArrowLeftRight,
  UserCheck,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const DAYS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const SESSIONS: ShiftSession[] = [
  'Pagi (10.00-13.00)',
  'Siang (14.00-17.00)',
  'Malam (17.00-20.00)',
];

const PRESET_REASONS = [
  'Menghadiri Seminar / Simposium Medis',
  'Cuti Libur / Urusan Pribadi Mendesak',
  'Jadwal Operasi Bedah Mulut Khusus',
  'Tukar Jadwal Antar Rekan Sejawat',
  'Izin Delegasi Klinis & Baksos',
];

export default function SwapShiftModal() {
  const {
    doctors,
    isSwapShiftModalOpen,
    setIsSwapShiftModalOpen,
    swapShiftInitialDoctorId,
    setSwapShiftInitialDoctorId,
    swapShift,
  } = useDentis();

  const [day, setDay] = useState<DayOfWeek>('Senin');
  const [session, setSession] = useState<ShiftSession>('Pagi (10.00-13.00)');
  const [fromDoctorId, setFromDoctorId] = useState<string>('');
  const [toDoctorId, setToDoctorId] = useState<string>('');
  const [swapType, setSwapType] = useState<'Ganti Shift' | 'Tukar Sesi'>('Ganti Shift');
  const [swapBackSession, setSwapBackSession] = useState<ShiftSession>('Siang (14.00-17.00)');
  const [reason, setReason] = useState<string>(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');

  // Pre-fill doctor if triggered from a specific doctor card or slot
  useEffect(() => {
    if (swapShiftInitialDoctorId) {
      setFromDoctorId(swapShiftInitialDoctorId);
      // Find a different doctor for toDoctorId
      const other = doctors.find((d) => d.id !== swapShiftInitialDoctorId);
      if (other) setToDoctorId(other.id);
    } else if (doctors.length >= 2) {
      if (!fromDoctorId) setFromDoctorId(doctors[0].id);
      if (!toDoctorId) setToDoctorId(doctors[1].id);
    }
  }, [swapShiftInitialDoctorId, doctors]);

  if (!isSwapShiftModalOpen) return null;

  const fromDoc = doctors.find((d) => d.id === fromDoctorId);
  const toDoc = doctors.find((d) => d.id === toDoctorId);

  // Doctors who are currently scheduled on the selected day & session
  const scheduledDoctors = doctors.filter((doc) =>
    doc.weeklyShifts?.[day]?.includes(session)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDoctorId || !toDoctorId || fromDoctorId === toDoctorId) return;

    const finalReason = customReason.trim() || reason;

    swapShift({
      day,
      session,
      fromDoctorId,
      toDoctorId,
      type: swapType,
      swapBackSession: swapType === 'Tukar Sesi' ? swapBackSession : undefined,
      reason: finalReason,
    });

    setIsSwapShiftModalOpen(false);
    setSwapShiftInitialDoctorId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => {
          setIsSwapShiftModalOpen(false);
          setSwapShiftInitialDoctorId(null);
        }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0D5966]/10 flex items-center justify-center text-[#0D5966]">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Tukar Shift / Ganti Jadwal Dokter</h2>
              <p className="text-xs text-slate-500">
                Pindahkan atau saling bertukar sesi shift praktik antar dokter klinik Dentis.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSwapShiftModalOpen(false);
              setSwapShiftInitialDoctorId(null);
            }}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Step 1: Pilih Hari & Sesi */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0D5966]" />
              1. Waktu Shift Yang Ditukar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Hari Praktik
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value as DayOfWeek)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5966]/20 focus:border-[#0D5966] bg-white"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Sesi Jam Shift
                </label>
                <select
                  value={session}
                  onChange={(e) => setSession(e.target.value as ShiftSession)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5966]/20 focus:border-[#0D5966] bg-white"
                >
                  {SESSIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {scheduledDoctors.length > 0 ? (
              <div className="flex items-center gap-2 p-2.5 bg-teal-50/70 border border-teal-100 rounded-xl text-xs text-teal-800">
                <span className="font-semibold">Dokter terjadwal di slot ini:</span>
                <span className="text-teal-900">
                  {scheduledDoctors.map((d) => d.name.split(',')[0]).join(', ')}
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200/60">
                Belum ada dokter yang terjadwal di {day} ({session.split(' ')[0]}). Anda tetap dapat menetapkan dokter pengganti.
              </p>
            )}
          </div>

          {/* Step 2: Pilih Dokter Yang Ditukar & Dokter Pengganti */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#0D5966]" />
              2. Pihak Dokter Yang Terlibat
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Dokter Asal */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-xs font-bold text-slate-600 block">
                  Dokter Yang Berhalangan / Ditukar
                </span>
                <select
                  value={fromDoctorId}
                  onChange={(e) => setFromDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0D5966] bg-white"
                >
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.title})
                    </option>
                  ))}
                </select>
                {fromDoc && (
                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                      <Image src={fromDoc.avatarUrl} alt={fromDoc.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{fromDoc.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{fromDoc.specialty}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Dokter Pengganti */}
              <div className="p-3.5 rounded-2xl border border-teal-200 bg-teal-50/30 space-y-2">
                <span className="text-xs font-bold text-[#0D5966] block">
                  Dokter Rekan Pengganti
                </span>
                <select
                  value={toDoctorId}
                  onChange={(e) => setToDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-teal-200 text-xs font-medium focus:outline-none focus:border-[#0D5966] bg-white"
                >
                  {doctors
                    .filter((doc) => doc.id !== fromDoctorId)
                    .map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.title})
                      </option>
                    ))}
                </select>
                {toDoc && (
                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                      <Image src={toDoc.avatarUrl} alt={toDoc.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{toDoc.name}</p>
                      <p className="text-[10px] text-[#0D5966] font-medium truncate">{toDoc.title}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Tipe Pertukaran */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0D5966]" />
              3. Tipe Pertukaran Shift
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSwapType('Ganti Shift')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  swapType === 'Ganti Shift'
                    ? 'border-[#0D5966] bg-teal-50/50 ring-2 ring-[#0D5966]/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Ganti Shift (Substitusi)</span>
                  {swapType === 'Ganti Shift' && (
                    <CheckCircle2 className="w-4 h-4 text-[#0D5966]" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Dokter Pengganti mengisi dan menjalankan shift ini tanpa tukar jadwal di sesi lain.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSwapType('Tukar Sesi')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  swapType === 'Tukar Sesi'
                    ? 'border-[#0D5966] bg-teal-50/50 ring-2 ring-[#0D5966]/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Tukar Sesi (Saling Tukar)</span>
                  {swapType === 'Tukar Sesi' && (
                    <CheckCircle2 className="w-4 h-4 text-[#0D5966]" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Kedua dokter saling bertukar jam kerja di hari ini.
                </p>
              </button>
            </div>

            {swapType === 'Tukar Sesi' && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Sesi balasan yang diambil alih oleh {fromDoc?.name.split(',')[0] || 'Dokter Asal'}:
                </label>
                <select
                  value={swapBackSession}
                  onChange={(e) => setSwapBackSession(e.target.value as ShiftSession)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#0D5966]"
                >
                  {SESSIONS.filter((s) => s !== session).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Step 4: Alasan Pertukaran */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0D5966]" />
              4. Alasan Pertukaran Shift
            </h3>

            <div className="flex flex-wrap gap-2">
              {PRESET_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setReason(preset);
                    setCustomReason('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    reason === preset && !customReason
                      ? 'bg-[#0D5966] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Atau tulis keterangan alasan pertukaran lain..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5966]/20 focus:border-[#0D5966]"
            />
          </div>

          {/* Visual Summary Card */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center justify-between gap-3">
            <div className="text-center flex-1">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Semula</p>
              <p className="text-xs font-bold text-slate-900 truncate">{fromDoc?.name.split(',')[0] || 'Dokter A'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0D5966] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div className="text-center flex-1">
              <p className="text-[10px] text-[#0D5966] uppercase font-semibold">Pengganti</p>
              <p className="text-xs font-bold text-[#0D5966] truncate">{toDoc?.name.split(',')[0] || 'Dokter B'}</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsSwapShiftModalOpen(false);
                setSwapShiftInitialDoctorId(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!fromDoctorId || !toDoctorId || fromDoctorId === toDoctorId}
              className="px-6 py-2.5 rounded-xl bg-[#0D5966] text-white text-xs font-bold hover:bg-[#09414B] shadow-md shadow-[#0D5966]/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Konfirmasi Tukar Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
