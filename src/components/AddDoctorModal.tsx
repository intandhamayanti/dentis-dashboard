'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useDentis } from '@/context/DentisContext';
import { DayOfWeek, ShiftSession } from '@/types/dentis';
import {
  X,
  UserPlus,
  Stethoscope,
  Phone,
  FileBadge,
  Calendar,
  Check,
  Sparkles,
  Camera,
} from 'lucide-react';
import ImageUploadField from './ImageUploadField';

const DAYS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const SESSIONS: ShiftSession[] = [
  'Pagi (10.00-13.00)',
  'Siang (14.00-17.00)',
  'Malam (17.00-20.00)',
];

const AVATAR_PRESETS = [
  { url: '/doctors/drg-clarissa.jpg', label: 'drg. Clarissa (Hijab & Kacamata)' },
  { url: '/doctors/drg-dimas.jpg', label: 'drg. Dimas (Pria Kemeja Gelap)' },
  { url: '/doctors/drg-nabila.jpg', label: 'drg. Nabila (Wanita Rambut Panjang)' },
  { url: '/doctors/drg-arya.jpg', label: 'drg. Arya (Pria Kacamata & Jenggot)' },
  { url: '/doctors/drg-siti.jpg', label: 'drg. Siti (Wanita Hijab Muda)' },
  { url: '/doctors/drg-kevin.jpg', label: 'drg. Kevin (Pria Rambut Rapi)' },
  { url: '/doctors/drg-amanda.jpg', label: 'drg. Amanda (Wanita Rambut Lurus)' },
  { url: '/doctors/drg-rizky.jpg', label: 'drg. Rizky (Pria Kemeja Terang)' },
];

export default function AddDoctorModal() {
  const { isAddDoctorModalOpen, setIsAddDoctorModalOpen, addDoctor } = useDentis();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [sipNumber, setSipNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('5+ Tahun');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0].url);
  const [customAvatar, setCustomAvatar] = useState('');
  const [isAvailableToday, setIsAvailableToday] = useState(true);

  // Weekly shifts schedule state
  const [weeklyShifts, setWeeklyShifts] = useState<Record<DayOfWeek, ShiftSession[]>>({
    Senin: ['Pagi (10.00-13.00)'],
    Selasa: ['Pagi (10.00-13.00)', 'Siang (14.00-17.00)'],
    Rabu: ['Pagi (10.00-13.00)'],
    Kamis: ['Siang (14.00-17.00)', 'Malam (17.00-20.00)'],
    Jumat: ['Pagi (10.00-13.00)'],
    Sabtu: ['Pagi (10.00-13.00)'],
    Minggu: [],
  });

  if (!isAddDoctorModalOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalAvatar = customAvatar.trim() || avatarUrl;

    addDoctor({
      name: name.trim(),
      title: title.trim() || 'Dokter Gigi Spesialis',
      specialty: specialty.trim() || 'Perawatan Gigi Umum & Estetika',
      avatarUrl: finalAvatar,
      isAvailableToday,
      weeklyShifts,
      sipNumber: sipNumber.trim(),
      phone: phone.trim(),
      experience: experience.trim(),
    });

    // Reset form
    setName('');
    setTitle('');
    setSpecialty('');
    setSipNumber('');
    setPhone('');
    setCustomAvatar('');
    setIsAddDoctorModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsAddDoctorModalOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0D5966]/10 flex items-center justify-center text-[#0D5966]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Tambah Profil Dokter Baru</h2>
              <p className="text-xs text-slate-500">
                Lengkapi profil dokter spesialis & atur jadwal shift praktiknya di Dentis Senopati.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddDoctorModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Section 1: Informasi Dasar */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#0D5966]" />
              Data Pribadi & Spesialisasi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: drg. Sarah Amanda, Sp.Ort"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5966]/20 focus:border-[#0D5966] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gelar / Bidang Spesialis <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Spesialis Ortodonsia & Aligner"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5966]/20 focus:border-[#0D5966] transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fokus Perawatan / Keahlian Klinis
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Contoh: Dentis Clear Aligners, Behel Sapphire & Estetika Oklusi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5966]/20 focus:border-[#0D5966] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileBadge className="w-3.5 h-3.5 text-slate-400" />
                  Nomor SIP (Surat Izin Praktik)
                </label>
                <input
                  type="text"
                  value={sipNumber}
                  onChange={(e) => setSipNumber(e.target.value)}
                  placeholder="Contoh: SIP.503/442/DS/DKS/2024"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5966]/20 focus:border-[#0D5966] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  No. Telepon / WhatsApp Dokter
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5966]/20 focus:border-[#0D5966] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pilihan Foto Avatar */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#0D5966]" />
                Foto Profil Dokter
              </h3>
              <span className="text-[11px] text-slate-400">Pilih dari koleksi foto atau masukkan URL</span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = avatarUrl === preset.url && !customAvatar;
                return (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(preset.url);
                      setCustomAvatar('');
                    }}
                    className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                      isSelected
                        ? 'border-[#0D5966] ring-2 ring-[#0D5966]/20 scale-102 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    title={preset.label}
                  >
                    <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-slate-100">
                      <Image
                        src={preset.url}
                        alt={preset.label}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0D5966] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-1">
              <ImageUploadField
                label="Atau Upload Foto Dokter dari PC (Dummy File Upload)"
                value={customAvatar}
                onChange={(newUrl) => setCustomAvatar(newUrl)}
                aspectRatio="square"
                helperText="Upload foto jas putih dokter dari file lokal PC atau drag & drop."
              />
            </div>
          </div>

          {/* Section 3: Jadwal Shift Mingguan */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0D5966]" />
                Jadwal Praktik Mingguan
              </h3>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-2 cursor-pointer">
                  <span>Aktif Praktik Hari Ini:</span>
                  <input
                    type="checkbox"
                    checked={isAvailableToday}
                    onChange={(e) => setIsAvailableToday(e.target.checked)}
                    className="w-4 h-4 accent-[#0D5966] rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Pilih sesi shift yang akan dijalankan oleh dokter ini setiap pekannya:
            </p>

            <div className="space-y-2 border border-slate-200/80 rounded-2xl p-3 bg-slate-50/50">
              {DAYS.map((day) => {
                const dayShifts = weeklyShifts[day] || [];
                return (
                  <div
                    key={day}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-100"
                  >
                    <span className="text-xs font-bold text-slate-800 w-20">{day}</span>
                    <div className="flex flex-wrap items-center gap-1.5 flex-1">
                      {SESSIONS.map((session) => {
                        const isChecked = dayShifts.includes(session);
                        const label = session.split(' ')[0];
                        const time = session.match(/\((.*?)\)/)?.[1] || '';
                        return (
                          <button
                            key={session}
                            type="button"
                            onClick={() => toggleShift(day, session)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                              isChecked
                                ? 'bg-[#0D5966] text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <span>{label}</span>
                            <span className="text-[10px] opacity-75">{time}</span>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsAddDoctorModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0D5966] text-white text-xs font-bold hover:bg-[#09414B] shadow-md shadow-[#0D5966]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Simpan Profil Dokter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
