'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDentis } from '@/context/DentisContext';
import { DayOfWeek, ShiftSession } from '@/types/dentis';
import {
  X,
  Calendar,
  Clock,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

const DAYS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const SESSIONS: ShiftSession[] = [
  'Pagi (10.00-13.00)',
  'Siang (14.00-17.00)',
  'Malam (17.00-20.00)',
];

export default function EditDoctorScheduleModal() {
  const {
    editingDoctorForSchedule,
    setEditingDoctorForSchedule,
    updateDoctorShifts,
  } = useDentis();

  const [weeklyShifts, setWeeklyShifts] = useState<Record<DayOfWeek, ShiftSession[]>>({
    Senin: [],
    Selasa: [],
    Rabu: [],
    Kamis: [],
    Jumat: [],
    Sabtu: [],
    Minggu: [],
  });

  useEffect(() => {
    if (editingDoctorForSchedule) {
      setWeeklyShifts({
        Senin: editingDoctorForSchedule.weeklyShifts?.Senin || [],
        Selasa: editingDoctorForSchedule.weeklyShifts?.Selasa || [],
        Rabu: editingDoctorForSchedule.weeklyShifts?.Rabu || [],
        Kamis: editingDoctorForSchedule.weeklyShifts?.Kamis || [],
        Jumat: editingDoctorForSchedule.weeklyShifts?.Jumat || [],
        Sabtu: editingDoctorForSchedule.weeklyShifts?.Sabtu || [],
        Minggu: editingDoctorForSchedule.weeklyShifts?.Minggu || [],
      });
    }
  }, [editingDoctorForSchedule]);

  if (!editingDoctorForSchedule) return null;

  const toggleShift = (day: DayOfWeek, session: ShiftSession) => {
    setWeeklyShifts((prev) => {
      const current = prev[day] || [];
      if (current.includes(session)) {
        return { ...prev, [day]: current.filter((s) => s !== session) };
      } else {
        return { ...prev, [day]: [...current, session] };
      }
    });
  };

  // Quick Presets
  const applyPreset = (preset: 'all-morning' | 'weekday-regular' | 'night-only' | 'clear') => {
    if (preset === 'clear') {
      setWeeklyShifts({
        Senin: [],
        Selasa: [],
        Rabu: [],
        Kamis: [],
        Jumat: [],
        Sabtu: [],
        Minggu: [],
      });
    } else if (preset === 'all-morning') {
      setWeeklyShifts({
        Senin: ['Pagi (10.00-13.00)'],
        Selasa: ['Pagi (10.00-13.00)'],
        Rabu: ['Pagi (10.00-13.00)'],
        Kamis: ['Pagi (10.00-13.00)'],
        Jumat: ['Pagi (10.00-13.00)'],
        Sabtu: ['Pagi (10.00-13.00)'],
        Minggu: [],
      });
    } else if (preset === 'weekday-regular') {
      setWeeklyShifts({
        Senin: ['Pagi (10.00-13.00)', 'Siang (14.00-17.00)'],
        Selasa: ['Pagi (10.00-13.00)', 'Siang (14.00-17.00)'],
        Rabu: ['Pagi (10.00-13.00)', 'Siang (14.00-17.00)'],
        Kamis: ['Pagi (10.00-13.00)', 'Siang (14.00-17.00)'],
        Jumat: ['Pagi (10.00-13.00)', 'Siang (14.00-17.00)'],
        Sabtu: [],
        Minggu: [],
      });
    } else if (preset === 'night-only') {
      setWeeklyShifts({
        Senin: ['Malam (17.00-20.00)'],
        Selasa: ['Malam (17.00-20.00)'],
        Rabu: ['Malam (17.00-20.00)'],
        Kamis: ['Malam (17.00-20.00)'],
        Jumat: ['Malam (17.00-20.00)'],
        Sabtu: [],
        Minggu: [],
      });
    }
  };

  const handleSave = () => {
    updateDoctorShifts(editingDoctorForSchedule.id, weeklyShifts);
    setEditingDoctorForSchedule(null);
  };

  // Compute total weekly sessions
  const totalSessions = Object.values(weeklyShifts).reduce((acc, curr) => acc + curr.length, 0);
  const totalEstimatedHours = totalSessions * 3; // each session is ~3 hours

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setEditingDoctorForSchedule(null)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <Image
                src={editingDoctorForSchedule.avatarUrl}
                alt={editingDoctorForSchedule.name}
                fill
                className="object-cover object-top"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{editingDoctorForSchedule.name}</h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0D5966]/10 text-[#0D5966]">
                  {editingDoctorForSchedule.title}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Atur hari & jam shift praktik dokter ini di Dentis Senopati.
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditingDoctorForSchedule(null)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Sparkles className="w-4 h-4 text-[#0D5966]" />
              <span>Template Cepat:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('weekday-regular')}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-[#0D5966] hover:text-[#0D5966] transition-colors cursor-pointer"
              >
                Senin-Jumat Pagi & Siang
              </button>
              <button
                type="button"
                onClick={() => applyPreset('all-morning')}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-[#0D5966] hover:text-[#0D5966] transition-colors cursor-pointer"
              >
                Shift Pagi Saja
              </button>
              <button
                type="button"
                onClick={() => applyPreset('night-only')}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-[#0D5966] hover:text-[#0D5966] transition-colors cursor-pointer"
              >
                Shift Malam Saja
              </button>
              <button
                type="button"
                onClick={() => applyPreset('clear')}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Kosongkan
              </button>
            </div>
          </div>

          {/* Schedule 7 Days Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0D5966]" />
                Pilih Sesi Praktik Mingguan
              </h3>
              <span className="text-xs font-semibold text-[#0D5966] bg-teal-50 px-3 py-1 rounded-xl border border-teal-200/60">
                Total {totalSessions} Sesi / Pekan (~{totalEstimatedHours} Jam)
              </span>
            </div>

            <div className="space-y-2 border border-slate-200/80 rounded-2xl p-4 bg-slate-50/40">
              {DAYS.map((day) => {
                const dayShifts = weeklyShifts[day] || [];
                const isDayActive = dayShifts.length > 0;

                return (
                  <div
                    key={day}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border transition-all ${
                      isDayActive
                        ? 'bg-white border-teal-200/60 shadow-xs'
                        : 'bg-white/60 border-slate-200/60 opacity-80'
                    }`}
                  >
                    <div className="w-24 shrink-0 flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isDayActive ? 'bg-[#0D5966]' : 'bg-slate-300'
                        }`}
                      />
                      <span className="text-xs font-bold text-slate-900">{day}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      {SESSIONS.map((session) => {
                        const isChecked = dayShifts.includes(session);
                        const label = session.split(' ')[0];
                        const time = session.match(/\((.*?)\)/)?.[1] || '';

                        return (
                          <button
                            key={session}
                            type="button"
                            onClick={() => toggleShift(day, session)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                              isChecked
                                ? 'bg-[#0D5966] text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                            }`}
                          >
                            <Clock className={`w-3.5 h-3.5 ${isChecked ? 'text-teal-200' : 'text-slate-400'}`} />
                            <span>{label}</span>
                            <span className="text-[11px] opacity-80">({time})</span>
                            {isChecked && (
                              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-start gap-2.5 text-xs text-teal-900">
            <Info className="w-4 h-4 text-[#0D5966] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Jadwal yang Anda simpan di sini akan langsung menjadi acuan kalender reservasi pasien, modul rekam medis, dan tabel giliran jaga dokter klinik Dentis.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white shrink-0">
          <button
            type="button"
            onClick={() => setEditingDoctorForSchedule(null)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#0D5966] text-white text-xs font-bold hover:bg-[#09414B] shadow-md shadow-[#0D5966]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Simpan Jadwal Praktik
          </button>
        </div>
      </div>
    </div>
  );
}
