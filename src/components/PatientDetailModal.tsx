'use client';

import React, { useState } from 'react';
import { useDentis } from '@/context/DentisContext';
import {
  X,
  Plus,
  HeartPulse,
  Clock,
  Calendar,
  CalendarPlus,
  MapPin,
} from 'lucide-react';

export default function PatientDetailModal() {
  const {
    selectedPatientForDetail,
    setSelectedPatientForDetail,
    addMedicalRecord,
    openBookingWithPatient,
    doctors,
    services,
  } = useDentis();

  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [recordTreatment, setRecordTreatment] = useState(services[0]?.name || 'Scaling & Polishing');
  const [recordDoctor, setRecordDoctor] = useState(doctors[0]?.name || '');
  const [recordComplaint, setRecordComplaint] = useState('');
  const [recordNotes, setRecordNotes] = useState('');
  const [recordCost, setRecordCost] = useState(services[0]?.price || 450000);

  if (!selectedPatientForDetail) return null;

  const handleAddRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordComplaint.trim() || !recordNotes.trim()) return;

    addMedicalRecord(selectedPatientForDetail.id, {
      date: '2026-10-20',
      doctorName: recordDoctor || doctors[0]?.name,
      treatment: recordTreatment,
      complaint: recordComplaint,
      notes: recordNotes,
      cost: Number(recordCost),
    });

    setIsAddingRecord(false);
    setRecordComplaint('');
    setRecordNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D5966] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {selectedPatientForDetail.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {selectedPatientForDetail.name}
                </h3>
                <span className="font-mono text-xs font-semibold text-[#0D5966] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                  {selectedPatientForDetail.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedPatientForDetail.gender} • {selectedPatientForDetail.totalVisits} Kunjungan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const p = selectedPatientForDetail;
                setSelectedPatientForDetail(null);
                openBookingWithPatient(p);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D5966] text-white hover:bg-[#094550] text-xs font-semibold transition-colors cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>+ Buat Janji Temu</span>
            </button>
            <button
              onClick={() => setSelectedPatientForDetail(null)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-medium text-slate-400 block">
              WhatsApp
            </span>
            <span className="font-semibold text-slate-800 text-xs block mt-0.5 font-mono">
              {selectedPatientForDetail.phone}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-medium text-slate-400 block">
              Alamat Domisili
            </span>
            <span
              className="font-semibold text-slate-800 text-xs block mt-0.5 truncate"
              title={selectedPatientForDetail.address || 'Jakarta Selatan'}
            >
              {selectedPatientForDetail.address || 'Jakarta Selatan'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-medium text-slate-400 block">
              Alergi
            </span>
            <span className="font-semibold text-slate-800 text-xs block mt-0.5 truncate">
              {selectedPatientForDetail.allergies || 'Tidak ada'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-medium text-slate-400 block">
              Kunjungan Terakhir
            </span>
            <span className="font-semibold text-[#0D5966] text-xs block mt-0.5">
              {selectedPatientForDetail.lastVisitDate || '-'}
            </span>
          </div>
        </div>

        {/* Medical Records Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-[#0D5966]" />
              <h4 className="text-xs font-bold text-slate-900">
                Riwayat Tindakan Klinis ({selectedPatientForDetail.records.length})
              </h4>
            </div>

            <button
              onClick={() => setIsAddingRecord(!isAddingRecord)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0D5966] text-white hover:bg-[#094550] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingRecord ? 'Batal' : 'Tambah Catatan Medis'}</span>
            </button>
          </div>

          {/* Form to Add Medical Record */}
          {isAddingRecord && (
            <form
              onSubmit={handleAddRecordSubmit}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tindakan</label>
                  <select
                    value={recordTreatment}
                    onChange={(e) => {
                      setRecordTreatment(e.target.value);
                      const s = services.find((srv) => srv.name === e.target.value);
                      if (s) setRecordCost(s.price);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#0D5966]"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dokter Penanggung Jawab</label>
                  <select
                    value={recordDoctor}
                    onChange={(e) => setRecordDoctor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#0D5966]"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Keluhan Pasien</label>
                <input
                  type="text"
                  required
                  value={recordComplaint}
                  onChange={(e) => setRecordComplaint(e.target.value)}
                  placeholder="Misal: Gigi ngilu saat minum dingin..."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#0D5966]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catatan Diagnosa & Tindakan</label>
                <textarea
                  rows={2}
                  required
                  value={recordNotes}
                  onChange={(e) => setRecordNotes(e.target.value)}
                  placeholder="Deskripsi tindakan medis yang dilakukan dokter..."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#0D5966]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingRecord(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-[#0D5966] text-white hover:bg-[#094550] font-semibold"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          )}

          {/* Records Timeline */}
          {selectedPatientForDetail.records.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Belum ada riwayat rekam medis tercatat untuk pasien ini.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedPatientForDetail.records.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rec.treatment}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-[#0D5966] font-medium">{rec.doctorName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{rec.date}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-600">
                      <span className="font-semibold text-slate-700">Keluhan: </span>
                      {rec.complaint}
                    </p>
                    <p className="text-slate-600">
                      <span className="font-semibold text-slate-700">Tindakan: </span>
                      {rec.notes}
                    </p>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Biaya Tindakan:</span>
                    <span className="font-semibold text-slate-900">
                      Rp {rec.cost.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
