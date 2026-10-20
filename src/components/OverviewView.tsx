'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useDentis } from '@/context/DentisContext';
import { Doctor, DoctorWorkStatus } from '@/types/dentis';
import {
  Users,
  CalendarCheck2,
  Stethoscope,
  Activity,
  ArrowUpRight,
  MessageCircle,
  Clock,
} from 'lucide-react';

export default function OverviewView() {
  const {
    appointments,
    doctors,
    patients,
    setActiveMenu,
    updateAppointmentStatus,
    generateWhatsAppLink,
    toggleDoctorAvailability,
    setDoctorWorkStatus,
    addToast,
    setSelectedPatientForDetail,
    currentBranch,
  } = useDentis();

  const [doctorFilter, setDoctorFilter] = useState<'all' | 'onduty' | 'offduty' | 'cuti'>('all');

  const todayDateStr = '2026-10-20';
  const todayAppointments = appointments.filter((a) => a.date === todayDateStr);

  const getDoctorWorkStatus = (doc: Doctor): DoctorWorkStatus => {
    if (doc.workStatus === 'Tidak Ada Shift') return 'Off Day';
    if (doc.workStatus) return doc.workStatus;
    return doc.isAvailableToday ? 'On-Duty' : 'Cuti';
  };

  const onDutyDoctors = doctors.filter((d) => getDoctorWorkStatus(d) === 'On-Duty');
  const offDutyDoctors = doctors.filter(
    (d) => getDoctorWorkStatus(d) === 'Off Day' || getDoctorWorkStatus(d) === 'Tidak Ada Shift'
  );
  const cutiDoctors = doctors.filter((d) => getDoctorWorkStatus(d) === 'Cuti');

  const metrics = [
    {
      label: 'PASIEN HARI INI',
      value: `${todayAppointments.length}\u00A0Pasien`,
      subtext: 'Antrean aktif terjadwal',
      icon: Users,
      trend: '+15%',
    },
    {
      label: 'TOTAL RESERVASI',
      value: `${appointments.length}\u00A0Janji Temu`,
      subtext: 'Bulan Oktober 2026',
      icon: CalendarCheck2,
      trend: '+24%',
    },
    {
      label: 'DOKTER ON-DUTY',
      value: `${onDutyDoctors.length}\u00A0Dokter`,
      subtext: `${offDutyDoctors.length} Off Day • ${cutiDoctors.length} Cuti`,
      icon: Stethoscope,
      trend: `${onDutyDoctors.length}/${doctors.length} Aktif`,
    },
    {
      label: 'UTILISASI KURSI',
      value: '88%\u00A0Occupancy',
      subtext: '4 dental unit beroperasi',
      icon: Activity,
      trend: 'Penuh',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 4 Metric Cards: 1-col scrollable on mobile, 2-col tablet, 4-col desktop */}
      <div className="p-2.5 sm:p-3.5 rounded-[22px] sm:rounded-[28px] bg-[#0D5966] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-[16px] sm:rounded-[20px] bg-white flex flex-col justify-between min-h-[115px] sm:min-h-[140px] cursor-default shadow-2xs"
              >
                {/* 1. Header Row */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>

                {/* 2. Middle Row: Big Bold Metric Value */}
                <div className="my-1.5 sm:my-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight block">
                    {item.value}
                  </span>
                </div>

                {/* 3. Bottom Row: Context Description & Distinct Trend Badge */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500" title={item.subtext}>
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

      {/* Main Card: Jadwal Pasien Hari Ini (Responsive Mobile Cards + Desktop Table) */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Card Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
              Jadwal Pasien Hari Ini
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
              Selasa, 20 Oktober 2026 • Antrean aktif klinik Dentis {currentBranch.name}
            </p>
          </div>

          <button
            onClick={() => setActiveMenu('reservasi')}
            className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            Lihat Semua
          </button>
        </div>

        {/* Content Container */}
        <div>
          {todayAppointments.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Belum ada antrean janji temu untuk hari ini.
            </div>
          ) : (
            <>
              {/* MOBILE VIEW: Ultra-clean, native-feeling appointment cards */}
              <div className="md:hidden divide-y divide-slate-100">
                {todayAppointments.map((apt) => {
                  const patient = patients.find((p) => p.name === apt.patientName);
                  return (
                    <div key={apt.id} className="p-3.5 space-y-2.5">
                      {/* Top Row: Time & Status selector */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {apt.sessionTime}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {apt.shiftSession}
                          </span>
                        </div>

                        <select
                          value={apt.status}
                          onChange={(e) =>
                            updateAppointmentStatus(
                              apt.id,
                              e.target.value as 'Pending' | 'Confirmed' | 'Selesai' | 'Dibatalkan'
                            )
                          }
                          aria-label={`Ubah status ${apt.patientName}`}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                            apt.status === 'Selesai'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : apt.status === 'Confirmed'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : apt.status === 'Pending'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Selesai">Selesai</option>
                          <option value="Dibatalkan">Dibatalkan</option>
                        </select>
                      </div>

                      {/* Middle Row: Patient Info & WA action */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                if (patient) setSelectedPatientForDetail(patient);
                              }}
                              className="font-bold text-sm text-[#0D5966] hover:underline text-left cursor-pointer truncate"
                            >
                              {apt.patientName}
                            </button>
                            {apt.isNewPatient ? (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                Baru
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60 shrink-0">
                                Lama
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                            {apt.phone}
                          </span>
                        </div>

                        <a
                          href={generateWhatsAppLink(apt)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            addToast(
                              'info',
                              'WhatsApp Dibuka',
                              `Membuka template konfirmasi WA untuk ${apt.patientName}`
                            )
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shrink-0"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat WA</span>
                        </a>
                      </div>

                      {/* Bottom Box: Treatment, Doctor & Estimated Cost */}
                      <div className="bg-slate-50/80 p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs border border-slate-100">
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-700 truncate block">
                            {apt.treatment}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                            {apt.doctorName}
                          </span>
                        </div>
                        <span className="font-bold text-[#0D5966] text-xs shrink-0 whitespace-nowrap">
                          Rp {apt.estimatedCost.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP VIEW: Full Editorial Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                      <th className="py-3 px-4 font-medium">JAM</th>
                      <th className="py-3 px-4 font-medium">PASIEN</th>
                      <th className="py-3 px-4 font-medium">PERAWATAN</th>
                      <th className="py-3 px-4 font-medium">DOKTER</th>
                      <th className="py-3 px-4 font-medium">STATUS</th>
                      <th className="py-3 px-4 text-right font-medium">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {todayAppointments.map((apt) => {
                      const patient = patients.find((p) => p.name === apt.patientName);
                      return (
                        <tr
                          key={apt.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          {/* Jam */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{apt.sessionTime}</div>
                            <div className="text-[10px] text-slate-400">{apt.shiftSession}</div>
                          </td>

                          {/* Pasien */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  if (patient) setSelectedPatientForDetail(patient);
                                }}
                                className="font-semibold text-[#0D5966] hover:underline text-left cursor-pointer"
                              >
                                {apt.patientName}
                              </button>
                              {apt.isNewPatient ? (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Baru
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                                  Lama
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">{apt.phone}</span>
                          </td>

                          {/* Perawatan */}
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-700 block max-w-xs truncate">
                              {apt.treatment}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Rp {apt.estimatedCost.toLocaleString('id-ID')}
                            </span>
                          </td>

                          {/* Dokter */}
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-800 block">
                              {apt.doctorName}
                            </span>
                            <span className="text-[10px] text-slate-400">{apt.source}</span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <select
                              value={apt.status}
                              onChange={(e) =>
                                updateAppointmentStatus(
                                  apt.id,
                                  e.target.value as 'Pending' | 'Confirmed' | 'Selesai' | 'Dibatalkan'
                                )
                              }
                              className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                                apt.status === 'Selesai'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : apt.status === 'Confirmed'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : apt.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Selesai">Selesai</option>
                              <option value="Dibatalkan">Dibatalkan</option>
                            </select>
                          </td>

                          {/* Aksi WA */}
                          <td className="py-3.5 px-4 text-right">
                            <a
                              href={generateWhatsAppLink(apt)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() =>
                                addToast(
                                  'info',
                                  'WhatsApp Dibuka',
                                  `Membuka template konfirmasi WA untuk ${apt.patientName}`
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Chat WA</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Full Width Section: Doctor Availability & Duty Status */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900">
                Tim Dokter Praktik Hari Ini
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {onDutyDoctors.length} On-Duty
                </span>
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/80 inline-flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-slate-400" />
                  {offDutyDoctors.length} Off Day
                </span>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 inline-flex items-center gap-1">
                  {cutiDoctors.length} Cuti
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Selasa, 20 Oktober 2026 • Status shift aktif, bebas tugas (off day), dan cuti klinik Dentis {currentBranch.name}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap w-full sm:w-auto justify-between sm:justify-start">
            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/70 text-xs overflow-x-auto scrollbar-none max-w-full">
              <button
                type="button"
                onClick={() => setDoctorFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer text-[11px] ${
                  doctorFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Semua ({doctors.length})
              </button>
              <button
                type="button"
                onClick={() => setDoctorFilter('onduty')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer text-[11px] flex items-center gap-1 ${
                  doctorFilter === 'onduty'
                    ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-emerald-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                On-Duty ({onDutyDoctors.length})
              </button>
              <button
                type="button"
                onClick={() => setDoctorFilter('offduty')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer text-[11px] ${
                  doctorFilter === 'offduty'
                    ? 'bg-slate-700 text-white shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Off Day ({offDutyDoctors.length})
              </button>
              <button
                type="button"
                onClick={() => setDoctorFilter('cuti')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer text-[11px] ${
                  doctorFilter === 'cuti'
                    ? 'bg-amber-600 text-white shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-amber-700'
                }`}
              >
                Cuti ({cutiDoctors.length})
              </button>
            </div>

            <button
              onClick={() => setActiveMenu('dokter')}
              className="text-xs font-semibold text-[#0D5966] hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-1"
            >
              <span>Roster & Shift</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {doctors
            .filter((doc) => {
              const status = getDoctorWorkStatus(doc);
              if (doctorFilter === 'onduty') return status === 'On-Duty';
              if (doctorFilter === 'offduty') return status === 'Off Day' || status === 'Tidak Ada Shift';
              if (doctorFilter === 'cuti') return status === 'Cuti';
              return true;
            })
            .map((doc) => {
              const status = getDoctorWorkStatus(doc);
              const tuesdayShifts = doc.weeklyShifts?.['Selasa'] || [];
              const shiftLabel =
                tuesdayShifts.length > 0 ? tuesdayShifts.join(', ') : 'Tidak ada sesi Selasa';

              const statusConfigs = {
                'On-Duty': {
                  badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  dotClass: 'bg-emerald-500 animate-pulse',
                  cardClass:
                    'bg-white border-slate-200 hover:border-[#0D5966]/40 hover:shadow-2xs',
                  noteText: `${doc.activePatientsToday} antrean pasien hari ini`,
                  shiftText: shiftLabel,
                },
                'Off Day': {
                  badgeClass: 'bg-slate-100 text-slate-700 border-slate-200/90',
                  dotClass: 'bg-slate-400',
                  cardClass:
                    'bg-slate-50/70 border-slate-200/80 hover:border-slate-300',
                  noteText: 'Jadwal Off Day • Libur hari ini',
                  shiftText: 'Off Day',
                },
                'Tidak Ada Shift': {
                  badgeClass: 'bg-slate-100 text-slate-700 border-slate-200/90',
                  dotClass: 'bg-slate-400',
                  cardClass:
                    'bg-slate-50/70 border-slate-200/80 hover:border-slate-300',
                  noteText: 'Jadwal Off Day • Libur hari ini',
                  shiftText: 'Off Day',
                },
                Cuti: {
                  badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
                  dotClass: 'bg-amber-500',
                  cardClass:
                    'bg-amber-50/20 border-amber-200/70 hover:border-amber-300',
                  noteText: doc.statusNote || 'Sedang cuti / izin klinis resmi',
                  shiftText: 'Izin / Cuti',
                },
              };

              const cfg = statusConfigs[status] || statusConfigs['On-Duty'];

              return (
                <div
                  key={doc.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${cfg.cardClass}`}
                >
                  <div>
                    {/* Top Doctor Avatar & Status Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80 shadow-2xs">
                        <Image
                          src={doc.avatarUrl}
                          alt={doc.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${cfg.dotClass}`}
                        />
                      </div>

                      {/* Dropdown / Status selector */}
                      <select
                        value={status === 'Tidak Ada Shift' ? 'Off Day' : status}
                        onChange={(e) =>
                          setDoctorWorkStatus(doc.id, e.target.value as DoctorWorkStatus)
                        }
                        aria-label={`Ubah status kerja ${doc.name}`}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none transition-all ${cfg.badgeClass}`}
                      >
                        <option value="On-Duty">● On-Duty</option>
                        <option value="Off Day">○ Off Day</option>
                        <option value="Cuti">◐ Cuti</option>
                      </select>
                    </div>

                    {/* Name & Specialty */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 truncate" title={doc.name}>
                        {doc.name}
                      </h4>
                      <p className="text-[11px] text-[#0D5966] font-semibold truncate mt-0.5">
                        {doc.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{doc.specialty}</p>
                    </div>

                    {/* Shift & Session Context */}
                    <div className="mt-2.5 px-2.5 py-1.5 rounded-xl bg-white/80 border border-slate-100 text-[10px]">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-medium">Shift Selasa:</span>
                        <span
                          className="font-bold text-slate-700 truncate max-w-[110px]"
                          title={cfg.shiftText}
                        >
                          {cfg.shiftText}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Note & Quick Toggle */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[10px]">
                    <span
                      className="text-slate-500 font-medium truncate pr-1"
                      title={cfg.noteText}
                    >
                      {cfg.noteText}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleDoctorAvailability(doc.id)}
                      title="Klik untuk putar status (On-Duty -> Off Day -> Cuti)"
                      className="text-[9px] font-semibold text-slate-400 hover:text-[#0D5966] transition-colors cursor-pointer shrink-0 underline decoration-slate-300 underline-offset-2"
                    >
                      Ganti
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
