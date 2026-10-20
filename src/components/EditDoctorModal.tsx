'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDentis } from '@/context/DentisContext';
import {
  X,
  Stethoscope,
  Phone,
  FileBadge,
  Camera,
  Check,
  Trash2,
  Save,
  AlertTriangle,
} from 'lucide-react';
import ImageUploadField from './ImageUploadField';

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

export default function EditDoctorModal() {
  const {
    editingDoctorForProfile,
    setEditingDoctorForProfile,
    updateDoctor,
    deleteDoctor,
  } = useDentis();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [sipNumber, setSipNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isAvailableToday, setIsAvailableToday] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (editingDoctorForProfile) {
      setName(editingDoctorForProfile.name);
      setTitle(editingDoctorForProfile.title);
      setSpecialty(editingDoctorForProfile.specialty);
      setSipNumber(editingDoctorForProfile.sipNumber || '');
      setPhone(editingDoctorForProfile.phone || '');
      setAvatarUrl(editingDoctorForProfile.avatarUrl);
      setIsAvailableToday(editingDoctorForProfile.isAvailableToday);
      setShowDeleteConfirm(false);
    }
  }, [editingDoctorForProfile]);

  if (!editingDoctorForProfile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateDoctor({
      ...editingDoctorForProfile,
      name: name.trim(),
      title: title.trim() || 'Dokter Gigi Spesialis',
      specialty: specialty.trim() || 'Perawatan Gigi Umum & Estetika',
      avatarUrl,
      isAvailableToday,
      sipNumber: sipNumber.trim(),
      phone: phone.trim(),
    });

    setEditingDoctorForProfile(null);
  };

  const handleDelete = () => {
    deleteDoctor(editingDoctorForProfile.id);
    setEditingDoctorForProfile(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setEditingDoctorForProfile(null)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={avatarUrl || editingDoctorForProfile.avatarUrl}
                alt={name}
                fill
                className="object-cover object-top"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Edit Profil Dokter</h2>
              <p className="text-xs text-slate-500">
                Perbarui nama, spesialisasi, atau foto dokter di roster klinik Dentis.
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditingDoctorForProfile(null)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Section 1: Informasi Dasar */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#0D5966]" />
              Data Profil
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5966]/20 focus:border-[#0D5966]"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5966]/20 focus:border-[#0D5966]"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5966]/20 focus:border-[#0D5966]"
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
                  placeholder="SIP.503/442/DS/DKS/2024"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5966]/20 focus:border-[#0D5966]"
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
                  placeholder="081234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5966]/20 focus:border-[#0D5966]"
                />
              </div>
            </div>

            {/* Toggle Status Praktik */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Status Praktik Hari Ini</p>
                <p className="text-[11px] text-slate-400">
                  {isAvailableToday
                    ? 'Dokter aktif bertugas melayani pasien'
                    : 'Dokter sedang off/cuti (tidak dijadwalkan)'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvailableToday(!isAvailableToday)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isAvailableToday
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {isAvailableToday ? '● On-Duty' : '○ Cuti'}
              </button>
            </div>
          </div>

          {/* Section 2: Foto Profil */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#0D5966]" />
              Foto Profil
            </h3>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = avatarUrl === preset.url;
                return (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setAvatarUrl(preset.url)}
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

            <ImageUploadField
              label="Atau Upload Foto Dokter dari PC (Dummy File Upload)"
              value={avatarUrl}
              onChange={(newUrl) => setAvatarUrl(newUrl)}
              aspectRatio="square"
              helperText="Upload foto jas putih dokter langsung dari PC atau drag & drop."
            />
          </div>

          {/* Delete Section */}
          <div className="pt-2 border-t border-slate-100">
            {showDeleteConfirm ? (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Hapus dokter ini dari sistem klinik dentis?</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 bg-white hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Dokter Dari Roster
              </button>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setEditingDoctorForProfile(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0D5966] text-white text-xs font-bold hover:bg-[#09414B] shadow-md shadow-[#0D5966]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
