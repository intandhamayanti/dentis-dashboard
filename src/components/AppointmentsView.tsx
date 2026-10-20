'use client';

import React, { useState, useMemo } from 'react';
import { useDentis } from '@/context/DentisContext';
import { PaymentMethod, PaymentStatus } from '@/types/dentis';
import {
  Search,
  MessageCircle,
  Calendar,
  Globe,
  Clock,
  Trash2,
  ChevronDown,
  Receipt,
  QrCode,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';

export default function AppointmentsView() {
  const {
    appointments,
    patients,
    doctors,
    updateAppointmentStatus,
    updateAppointmentPayment,
    deleteAppointment,
    generateWhatsAppLink,
    setSelectedPatientForDetail,
    addToast,
  } = useDentis();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Search
      const matchSearch =
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.phone.includes(searchQuery) ||
        apt.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.id.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      // Pure Status Filter
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;

      // Doctor filter
      if (doctorFilter !== 'all' && apt.doctorId !== doctorFilter) return false;

      return true;
    });
  }, [appointments, searchQuery, statusFilter, doctorFilter]);

  return (
    <div className="space-y-4 pb-14">
      {/* ======================================================== */}
      {/* TOOLBAR: SEARCH, STATUS & DOKTER FILTER                  */}
      {/* ======================================================== */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID, nama pasien, WhatsApp, atau dokter..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0D5966] focus:bg-white transition-colors"
          />
        </div>

        {/* Status Filter & Doctor Filter & Count */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 w-full md:w-auto">
          {/* Status Jadwal Filter (Murni Status: Confirmed, Pending, Selesai, Dibatalkan) */}
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto h-10 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0D5966] focus:bg-white transition-colors appearance-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Selesai">Selesai</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Doctor Filter */}
          <div className="relative w-full sm:w-auto">
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full sm:w-auto h-10 pl-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0D5966] focus:bg-white transition-colors appearance-none cursor-pointer"
            >
              <option value="all">Semua Dokter ({doctors.length})</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="text-xs text-slate-400 font-medium whitespace-nowrap hidden lg:inline pl-1">
            <strong className="text-slate-700 font-bold">{filteredAppointments.length}</strong> reservasi
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN CONTENT: RESPONSIVE CARDS (MOBILE) + TABLE (DESKTOP) */}
      {/* ======================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p>Tidak ada reservasi yang cocok dengan filter saat ini.</p>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW: Card List */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredAppointments.map((apt) => {
                const patient = patients.find((p) => p.name === apt.patientName || p.id === apt.patientId);
                const method = apt.paymentMethod || 'Kasir';
                const payStatus = apt.paymentStatus || (apt.status === 'Selesai' ? 'Lunas' : 'Belum Bayar');

                return (
                  <div key={apt.id} className="p-4 space-y-3">
                    {/* Header: Date, Time & Status Dropdown */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {apt.date}
                        </span>
                        <span className="text-[11px] font-semibold text-[#0D5966] bg-teal-50 px-2 py-0.5 rounded-lg">
                          {apt.sessionTime}
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

                    {/* Patient & Actions */}
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
                          {apt.phone} • {apt.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={generateWhatsAppLink(apt)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            addToast(
                              'info',
                              'WhatsApp Dibuka',
                              `Konfirmasi jadwal dibuka untuk ${apt.patientName}`
                            )
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WA</span>
                        </a>

                        <button
                          onClick={() => {
                            if (confirm(`Hapus reservasi untuk ${apt.patientName}?`)) {
                              deleteAppointment(apt.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus Reservasi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Service & Payment Box */}
                    <div className="bg-slate-50/80 p-3 rounded-xl space-y-2 border border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 truncate mr-2">{apt.treatment}</span>
                        <span className="font-bold text-[#0D5966] whitespace-nowrap">
                          Rp {apt.estimatedCost.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 text-[11px]">
                        <span className="text-slate-500 truncate mr-2">{apt.doctorName}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-medium text-slate-600">{method}</span>
                          <select
                            value={payStatus === 'DP' ? 'Belum Bayar' : payStatus}
                            onChange={(e) =>
                              updateAppointmentPayment(
                                apt.id,
                                method,
                                e.target.value as PaymentStatus
                              )
                            }
                            aria-label={`Ubah status bayar ${apt.patientName}`}
                            className={`px-2 py-0.5 rounded-lg font-bold text-[9px] border transition-colors cursor-pointer ${
                              payStatus === 'Lunas'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            <option value="Belum Bayar">Belum Bayar</option>
                            <option value="Lunas">Lunas</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP VIEW: Full Data Table (Clean, Spacious & Non-Redundant) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[780px]">
                <thead>
                  <tr className="bg-[#F3F5F4] border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold whitespace-nowrap">PASIEN</th>
                    <th className="py-3.5 px-4 font-bold whitespace-nowrap">LAYANAN & BIAYA</th>
                    <th className="py-3.5 px-4 font-bold whitespace-nowrap">JADWAL</th>
                    <th className="py-3.5 px-4 font-bold whitespace-nowrap">DOKTER SPESIALIS</th>
                    <th className="py-3.5 px-4 font-bold whitespace-nowrap">STATUS JADWAL</th>
                    <th className="py-3.5 px-4 text-right font-bold whitespace-nowrap">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAppointments.map((apt) => {
                    const patient = patients.find((p) => p.name === apt.patientName || p.id === apt.patientId);
                    const method = apt.paymentMethod || 'Kasir';
                    const payStatus = apt.paymentStatus || (apt.status === 'Selesai' ? 'Lunas' : 'Belum Bayar');

                    return (
                      <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Pasien & Kontak */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (patient) setSelectedPatientForDetail(patient);
                              }}
                              className="font-bold text-[#0D5966] hover:underline text-left cursor-pointer"
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
                          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                            {apt.phone} • {apt.id}
                          </span>
                        </td>

                        {/* Layanan & Biaya + Status Bayar */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block line-clamp-1">{apt.treatment}</span>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[11px] text-[#0D5966] font-bold whitespace-nowrap">
                              Rp {apt.estimatedCost.toLocaleString('id-ID')}
                            </span>
                            <span className="text-slate-300 text-[10px]">•</span>
                            <button
                              onClick={() =>
                                updateAppointmentPayment(
                                  apt.id,
                                  method,
                                  payStatus === 'Lunas' ? 'Belum Bayar' : 'Lunas'
                                )
                              }
                              title="Klik untuk ubah status pembayaran"
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded border transition-colors cursor-pointer whitespace-nowrap ${
                                payStatus === 'Lunas'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                              }`}
                            >
                              {payStatus} ({method})
                            </button>
                          </div>
                        </td>

                        {/* Jadwal */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-medium text-slate-800 block">{apt.date}</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {apt.sessionTime} ({apt.shiftSession.split(' ')[0]})
                          </span>
                        </td>

                        {/* Dokter Spesialis */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-medium text-slate-800 block">{apt.doctorName}</span>
                          {apt.source === 'Web Leads' && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-teal-700 font-semibold mt-0.5">
                              <Globe className="w-3 h-3" /> Web Leads
                            </span>
                          )}
                        </td>

                        {/* Status Jadwal Dropdown */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={apt.status}
                            onChange={(e) =>
                              updateAppointmentStatus(
                                apt.id,
                                e.target.value as 'Pending' | 'Confirmed' | 'Selesai' | 'Dibatalkan'
                              )
                            }
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${
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

                        {/* Aksi WA & Delete */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={generateWhatsAppLink(apt)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() =>
                                addToast(
                                  'info',
                                  'WhatsApp Dibuka',
                                  `Konfirmasi jadwal & pembayaran dibuka untuk ${apt.patientName}`
                                )
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 transition-colors shadow-2xs"
                              title="Kirim Konfirmasi WA"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WA</span>
                            </a>

                            <button
                              onClick={() => {
                                if (confirm(`Hapus reservasi untuk ${apt.patientName}?`)) {
                                  deleteAppointment(apt.id);
                                }
                              }}
                              className="p-1.5 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Reservasi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
  );
}
