'use client';

import React, { useState, useEffect } from 'react';
import { useDentis } from '@/context/DentisContext';
import { ShiftSession, Patient, PaymentMethod, Appointment } from '@/types/dentis';
import {
  Calendar,
  X,
  Search,
  UserCheck,
  Receipt,
  QrCode,
  CreditCard,
  Building,
  CheckCircle2,
  Check,
  ArrowUpRight,
  Stethoscope,
  MapPin,
  Clock,
  Printer,
  MessageCircle,
} from 'lucide-react';

function CelebrationConfetti() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const colors = [
      '#0D5966', // Dentis Deep Teal
      '#0F766E', // Forest Teal
      '#10B981', // Mint Emerald
      '#14B8A6', // Cyan Teal
      '#F59E0B', // Amber Gold
      '#38BDF8', // Soft Sky
      '#FB7185', // Rose Coral
    ];

    const particleCount = 70;
    // Launch particles from center-screen outward
    const particles = Array.from({ length: particleCount }).map(() => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.7);
      const velocity = Math.random() * 11 + 6;
      return {
        x: width / 2 + (Math.random() - 0.5) * 120,
        y: height * 0.42 + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * velocity + (Math.random() - 0.5) * 3,
        vy: Math.sin(angle) * velocity - Math.random() * 3,
        w: Math.random() * 8 + 6,
        h: Math.random() * 11 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.12 + 0.05,
        gravity: 0.22,
        drag: 0.965,
        opacity: 1,
        isRound: Math.random() > 0.7,
      };
    });

    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.wobble += p.wobbleSpeed;

        if (elapsed > 2.0) {
          p.opacity = Math.max(0, 1 - (elapsed - 2.0) / 1.2);
        }

        if (p.opacity > 0 && p.y < height + 40) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.scale(Math.cos(p.wobble), 1);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;

          if (p.isRound) {
            ctx.beginPath();
            ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          }
          ctx.restore();
        }
      });

      if (elapsed < 3.4) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[60]"
      style={{ pointerEvents: 'none' }}
    />
  );
}

function formatFullIndonesianDate(dateStr: string) {
  try {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return `${days[d.getDay()]}, ${day} ${months[month]} ${year}`;
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
}

export default function NewBookingModal() {
  const {
    isNewBookingModalOpen,
    setIsNewBookingModalOpen,
    bookingInitialPatient,
    setBookingInitialPatient,
    patients,
    doctors,
    services,
    addAppointment,
    addPatient,
    addToast,
    generateWhatsAppLink,
  } = useDentis();

  // Form States
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [date, setDate] = useState('2026-10-20');
  const [sessionTime, setSessionTime] = useState('11.00 WIB');
  const [shiftSession, setShiftSession] = useState<ShiftSession>('Pagi (10.00-13.00)');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Kasir');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdApt, setCreatedApt] = useState<Appointment | null>(null);

  // Handle prefilled patient from context (e.g. clicked from Patient Records)
  useEffect(() => {
    if (bookingInitialPatient) {
      setPatientName(bookingInitialPatient.name);
      setPhone(bookingInitialPatient.phone);
      setPatientAddress(bookingInitialPatient.address || '');
      setSelectedPatient(bookingInitialPatient);
    } else {
      setPatientName('');
      setPhone('');
      setPatientAddress('');
      setSelectedPatient(null);
    }
    setPaymentMethod('Kasir');
  }, [bookingInitialPatient, isNewBookingModalOpen]);

  const handleClose = () => {
    setIsNewBookingModalOpen(false);
    setBookingInitialPatient(null);
    setSelectedPatient(null);
    setPatientName('');
    setPhone('');
    setPatientAddress('');
    setNotes('');
    setIsSuccess(false);
    setCreatedApt(null);
  };

  if (!isNewBookingModalOpen) return null;

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
  const servicePrice = selectedService?.price || 450000;

  // Search existing patients for autocomplete
  const matchingPatients =
    patientName.trim().length >= 2 && !selectedPatient
      ? patients
          .filter(
            (p) =>
              p.name.toLowerCase().includes(patientName.toLowerCase()) ||
              p.phone.includes(patientName) ||
              p.id.toLowerCase().includes(patientName.toLowerCase())
          )
          .slice(0, 4)
      : [];

  const handleSelectExistingPatient = (p: Patient) => {
    setSelectedPatient(p);
    setPatientName(p.name);
    setPhone(p.phone);
    setPatientAddress(p.address || '');
    setShowSuggestions(false);
  };

  const handleClearSelectedPatient = () => {
    setSelectedPatient(null);
    setPatientName('');
    setPhone('');
    setPatientAddress('');
    setBookingInitialPatient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim()) return;

    let targetPatientId = selectedPatient?.id;
    let isNew = !selectedPatient;

    // Check if patient already exists by phone or name
    const existing =
      selectedPatient ||
      patients.find(
        (p) => p.phone === phone || p.name.toLowerCase() === patientName.toLowerCase()
      );

    if (existing) {
      targetPatientId = existing.id;
      isNew = false;
    } else {
      // Auto-register new patient silently
      targetPatientId = addPatient(
        {
          name: patientName.trim(),
          phone: phone.trim(),
          address: patientAddress.trim() || 'Jakarta Selatan',
          gender: 'Perempuan',
          isNewPatient: true,
          totalVisits: 1,
          lastVisitDate: date,
          allergies: 'Tidak ada',
        },
        true
      );
      isNew = true;
    }

    const newApt = addAppointment(
      {
        patientId: targetPatientId,
        patientName: patientName.trim(),
        phone: phone.trim(),
        isNewPatient: isNew,
        treatment: selectedService?.name || 'Konsultasi Gigi',
        date,
        sessionTime,
        shiftSession,
        doctorId: selectedDoctor?.id || 'DOC-01',
        doctorName: selectedDoctor?.name || 'drg. Dimas Wicaksono, Sp.KG',
        status: 'Confirmed',
        source: 'Manual Booking',
        notes: notes || 'Reservasi walk-in resepsionis klinik.',
        estimatedCost: servicePrice,
        paymentMethod,
        paymentStatus: 'Lunas',
        paidAmount: servicePrice,
      },
      true // silent so only the ticket modal appears
    );

    setCreatedApt(newApt);
    setIsSuccess(true);
  };

  // SUCCESS POPUP: Professional Clinic Receptionist Confirmation Dialog with Viewport Celebration Confetti
  if (isSuccess && createdApt) {
    const formattedDate = formatFullIndonesianDate(createdApt.date);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
        {/* Fullscreen Celebration Confetti */}
        <CelebrationConfetti />

        <div className="relative w-full max-w-[500px] rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 sm:p-7 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10">
          {/* Clinic Header Bar */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Resepsionis • Registrasi Walk-In
              </span>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Hero Badge & Announcement */}
          <div className="flex flex-col items-center pt-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shadow-xs mb-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#0D5966] text-white flex items-center justify-center shadow-xs">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-800 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Antrean Terdaftar • {createdApt.paymentMethod} ({createdApt.paymentStatus || 'Lunas'})</span>
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Reservasi Berhasil Disimpan
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mt-1">
              Jadwal kunjungan <strong className="text-slate-800 font-semibold">{createdApt.patientName}</strong> telah masuk ke antrean dokter hari ini.
            </p>
          </div>

          {/* Clinic Dashboard Appointment Details Card */}
          <div className="mt-5 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
              <div className="flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#0D5966]" />
                <span className="text-xs font-semibold text-slate-600">ID Reservasi</span>
              </div>
              <span className="font-mono text-xs font-extrabold text-[#0D5966] bg-white border border-teal-100 px-2.5 py-0.5 rounded-md shadow-2xs">
                #{createdApt.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pasien</p>
                <p className="font-bold text-slate-900 mt-0.5">{createdApt.patientName}</p>
                <p className="text-[11px] text-slate-500">{createdApt.phone || '-'}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dokter Praktik</p>
                <p className="font-bold text-slate-900 mt-0.5 line-clamp-1">{createdApt.doctorName}</p>
                <span className="inline-block text-[10px] font-semibold text-teal-800 bg-teal-100/80 px-1.5 py-0.2 rounded mt-0.5">
                  Jadwal Terkonfirmasi
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tindakan Perawatan</p>
                <p className="font-bold text-slate-900 mt-0.5">{createdApt.treatment}</p>
                <p className="text-[11px] text-slate-500 font-medium">Rp {createdApt.estimatedCost?.toLocaleString('id-ID') || '-'}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waktu & Sesi</p>
                <p className="font-bold text-[#0D5966] mt-0.5">{createdApt.sessionTime}</p>
                <p className="text-[11px] text-slate-500">{formattedDate}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Sesi: {createdApt.shiftSession}</span>
              </span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {createdApt.paymentMethod} • Lunas
              </span>
            </div>
          </div>

          {/* Staff Action Buttons */}
          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={() => {
                const waLink = generateWhatsAppLink(createdApt);
                window.open(waLink, '_blank');
              }}
              className="w-full py-3 rounded-xl bg-[#0D5966] hover:bg-[#09414B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Kirim Notifikasi WhatsApp ke Pasien</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Cetak Slip</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl border border-slate-200/80 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0D5966] text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Tambah Reservasi (Walk-In)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Input jadwal kunjungan & kanal pembayaran pasien di klinik
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="flex-1 overflow-y-auto p-5 text-xs space-y-4">
          <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Patient Selection / Autocomplete */}
            <div className="space-y-2">
              {selectedPatient ? (
                /* Selected Existing Patient Card */
                <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0D5966] text-white flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs">{selectedPatient.name}</span>
                        <span className="font-mono text-[10px] font-semibold text-[#0D5966] bg-white px-1.5 py-0.5 rounded border border-teal-200">
                          {selectedPatient.id}
                        </span>
                        <span className="text-[10px] font-semibold text-teal-800 bg-teal-100/80 px-1.5 py-0.2 rounded">
                          Pasien Lama
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {selectedPatient.phone} • {selectedPatient.address || 'Jakarta Selatan'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearSelectedPatient}
                    className="text-xs text-teal-700 hover:text-teal-900 font-semibold px-2 py-1 rounded hover:bg-teal-100/60 transition-colors cursor-pointer"
                  >
                    Ganti
                  </button>
                </div>
              ) : (
                /* Patient Name Input with Autocomplete Dropdown */
                <div className="space-y-3">
                  <div className="relative">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nama Pasien <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => {
                          setPatientName(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Ketik nama atau no. telepon pasien..."
                        className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0D5966] focus:bg-white text-xs"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Autocomplete Suggestions */}
                    {showSuggestions && matchingPatients.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-200 z-20 py-1 overflow-hidden">
                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                          Pasien Terdaftar
                        </div>
                        {matchingPatients.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectExistingPatient(p)}
                            className="w-full px-3 py-2 text-left hover:bg-teal-50/60 flex items-center justify-between border-b border-slate-50 last:border-0 transition-colors cursor-pointer"
                          >
                            <div>
                              <span className="font-semibold text-slate-800">{p.name}</span>
                              <span className="text-slate-400 text-[11px] block">{p.phone} • {p.address || 'Jakarta Selatan'}</span>
                            </div>
                            <span className="font-mono text-[10px] text-[#0D5966] font-semibold bg-teal-50 px-1.5 py-0.5 rounded">
                              {p.id}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        No. WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08123456789"
                        className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0D5966] focus:bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Alamat Domisili <span className="text-slate-400 font-normal">(opsional)</span>
                      </label>
                      <input
                        type="text"
                        value={patientAddress}
                        onChange={(e) => setPatientAddress(e.target.value)}
                        placeholder="e.g. Kebayoran Baru, Jaksel"
                        className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0D5966] focus:bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Service & Doctor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tindakan Perawatan
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0D5966] cursor-pointer"
                >
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name} (Rp {srv.price.toLocaleString('id-ID')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dokter Penanggung Jawab
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0D5966] cursor-pointer"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} {d.isAvailableToday ? '(On-Duty)' : '(Off)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date, Session, and Shift */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0D5966]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sesi Shift</label>
                <select
                  value={shiftSession}
                  onChange={(e) => setShiftSession(e.target.value as ShiftSession)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0D5966] cursor-pointer"
                >
                  <option value="Pagi (10.00-13.00)">Pagi (10.00-13.00)</option>
                  <option value="Siang (14.00-17.00)">Siang (14.00-17.00)</option>
                  <option value="Malam (17.00-20.00)">Malam (17.00-20.00)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jam Kunjungan</label>
                <input
                  type="text"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  placeholder="11.00 WIB"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0D5966]"
                />
              </div>
            </div>

            {/* Kanal Pembayaran Walk-In */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="font-semibold text-slate-700 block">
                Metode Pembayaran
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Kasir')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'Kasir'
                      ? 'bg-[#0D5966]/5 border-[#0D5966] ring-1 ring-[#0D5966]'
                      : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Receipt className="w-4 h-4 text-[#0D5966]" />
                    {paymentMethod === 'Kasir' && <Check className="w-3.5 h-3.5 text-[#0D5966]" />}
                  </div>
                  <div className="mt-2 font-bold text-slate-900">Kasir Klinik</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('QRIS')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'QRIS'
                      ? 'bg-[#0D5966]/5 border-[#0D5966] ring-1 ring-[#0D5966]'
                      : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <QrCode className="w-4 h-4 text-purple-600" />
                    {paymentMethod === 'QRIS' && <Check className="w-3.5 h-3.5 text-[#0D5966]" />}
                  </div>
                  <div className="mt-2 font-bold text-slate-900">QRIS Dinamis</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Virtual Account')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'Virtual Account'
                      ? 'bg-[#0D5966]/5 border-[#0D5966] ring-1 ring-[#0D5966]'
                      : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    {paymentMethod === 'Virtual Account' && <Check className="w-3.5 h-3.5 text-[#0D5966]" />}
                  </div>
                  <div className="mt-2 font-bold text-slate-900">Virtual Account</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Transfer Bank')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'Transfer Bank'
                      ? 'bg-[#0D5966]/5 border-[#0D5966] ring-1 ring-[#0D5966]'
                      : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building className="w-4 h-4 text-emerald-600" />
                    {paymentMethod === 'Transfer Bank' && <Check className="w-3.5 h-3.5 text-[#0D5966]" />}
                  </div>
                  <div className="mt-2 font-bold text-slate-900">Transfer Bank</div>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Keluhan singkat atau catatan resepsionis..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0D5966]"
              />
            </div>

            {/* Price Footer */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-slate-500 font-medium block text-xs">Biaya Tindakan:</span>
                <span className="text-[11px] text-slate-600 font-semibold">
                  Metode: {paymentMethod} (Lunas)
                </span>
              </div>
              <span className="font-extrabold text-[#0D5966] text-base">
                Rp {servicePrice.toLocaleString('id-ID')}
              </span>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/70 font-semibold transition-colors cursor-pointer text-xs"
          >
            Batal
          </button>
          <button
            type="submit"
            form="booking-form"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0D5966] text-white hover:bg-[#094550] font-semibold transition-all shadow-xs cursor-pointer text-xs"
          >
            <span>Simpan Reservasi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
