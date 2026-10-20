'use client';

import React, { useState, useMemo } from 'react';
import { useDentis } from '@/context/DentisContext';
import {
  Download,
  DollarSign,
  CheckCircle2,
  Activity,
  Layers,
  TrendingUp,
  Calendar,
  QrCode,
  CreditCard,
  Building,
  Receipt,
  BarChart3,
} from 'lucide-react';

// Monthly historical trend data (12 Months 2026)
const MONTHLY_TREND_DATA = [
  { month: 'Jan', label: 'Januari 2026', revenue: 68500000, patients: 32, change: '+5.2%' },
  { month: 'Feb', label: 'Februari 2026', revenue: 74200000, patients: 36, change: '+8.3%' },
  { month: 'Mar', label: 'Maret 2026', revenue: 82000000, patients: 41, change: '+10.5%' },
  { month: 'Apr', label: 'April 2026', revenue: 61800000, patients: 28, change: '-24.6%' }, // Dip
  { month: 'Mei', label: 'Mei 2026', revenue: 79400000, patients: 39, change: '+28.5%' }, // Rebound
  { month: 'Jun', label: 'Juni 2026', revenue: 95600000, patients: 48, change: '+20.4%' }, // Summer aligners
  { month: 'Jul', label: 'Juli 2026', revenue: 88200000, patients: 44, change: '-7.7%' },
  { month: 'Agu', label: 'Agustus 2026', revenue: 92500000, patients: 46, change: '+4.9%' },
  { month: 'Sep', label: 'September 2026', revenue: 86400000, patients: 43, change: '-6.6%' },
  { month: 'Okt', label: 'Oktober 2026 (Aktif)', revenue: 104800000, patients: 52, change: '+21.3%' }, // Peak
  { month: 'Nov', label: 'November 2026 (Est)', revenue: 98000000, patients: 47, change: '-6.5%', isEstimate: true },
  { month: 'Des', label: 'Desember 2026 (Est)', revenue: 115000000, patients: 56, change: '+17.3%', isEstimate: true },
];

// Multi-Year trend comparison data
const YEARLY_TREND_DATA = [
  { year: '2024', month: '2024', label: 'Tahun 2024', revenue: 720000000, patients: 380, change: '+18.4%' },
  { year: '2025', month: '2025', label: 'Tahun 2025', revenue: 910000000, patients: 460, change: '+26.3%' },
  { year: '2026', month: '2026', label: 'Tahun 2026 (YTD + Est)', revenue: 1048400000, patients: 510, change: '+15.2%', isCurrent: true },
];

export default function AnalyticsView() {
  const { appointments, services, addToast } = useDentis();

  // Period Filter: Bulanan vs Tahunan
  const [viewPeriod, setViewPeriod] = useState<'bulanan' | 'tahunan'>('bulanan');

  // Chart Metric Toggle: Omset vs Pasien
  const [chartMode, setChartMode] = useState<'revenue' | 'patients'>('revenue');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Focus on current active month (Oktober 2026) for the 4 summary cards & breakdowns
  const currentMonthAppointments = useMemo(() => {
    return appointments.filter((apt) => apt.date.startsWith('2026-10'));
  }, [appointments]);

  // Financial Metrics Calculation for Current Month
  const totalRevenue = useMemo(() => {
    return currentMonthAppointments
      .filter((a) => a.status === 'Selesai' || a.status === 'Confirmed')
      .reduce((sum, a) => sum + (a.estimatedCost || 0), 0);
  }, [currentMonthAppointments]);

  const completedCount = useMemo(() => {
    return currentMonthAppointments.filter((a) => a.status === 'Selesai').length;
  }, [currentMonthAppointments]);

  const avgPerPatient = completedCount > 0 ? Math.round(totalRevenue / completedCount) : 0;

  // Breakdown by Service Category (Current Month)
  const serviceBreakdown = useMemo(() => {
    const map: Record<string, { count: number; totalRev: number; name: string }> = {};

    currentMonthAppointments.forEach((apt) => {
      const srv = services.find((s) => s.name === apt.treatment);
      const categoryName = srv ? srv.category : 'Perawatan Gigi Umum';

      if (!map[categoryName]) {
        map[categoryName] = { count: 0, totalRev: 0, name: categoryName };
      }
      map[categoryName].count += 1;
      map[categoryName].totalRev += apt.estimatedCost || 0;
    });

    return Object.values(map).sort((a, b) => b.totalRev - a.totalRev);
  }, [currentMonthAppointments, services]);

  // Breakdown by Payment Method (Current Month)
  const paymentBreakdown = useMemo(() => {
    const map: Record<string, { count: number; totalRev: number; name: string }> = {
      'QRIS': { count: 0, totalRev: 0, name: 'QRIS Dinamis' },
      'Kasir': { count: 0, totalRev: 0, name: 'Kasir Klinik (Tunai/EDC)' },
      'Virtual Account': { count: 0, totalRev: 0, name: 'Virtual Account' },
      'Transfer Bank': { count: 0, totalRev: 0, name: 'Transfer Bank Manual' },
    };

    currentMonthAppointments.forEach((apt) => {
      const m = apt.paymentMethod || 'Kasir';
      if (!map[m]) {
        map[m] = { count: 0, totalRev: 0, name: m };
      }
      map[m].count += 1;
      if (apt.status === 'Selesai' || apt.status === 'Confirmed') {
        map[m].totalRev += apt.estimatedCost || 0;
      }
    });

    return Object.values(map).sort((a, b) => b.totalRev - a.totalRev);
  }, [currentMonthAppointments]);

  // Export to CSV for Current Month
  const exportCSV = () => {
    const headers = ['ID Janji Temu', 'Nama Pasien', 'No HP', 'Perawatan', 'Tanggal', 'Dokter', 'Status', 'Biaya'];
    const rows = currentMonthAppointments.map((a) => [
      a.id,
      `"${a.patientName}"`,
      `"${a.phone}"`,
      `"${a.treatment}"`,
      a.date,
      `"${a.doctorName}"`,
      a.status,
      a.estimatedCost,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan-keuangan-dentis-oktober-2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Ekspor CSV Berhasil', 'File laporan keuangan bulan Oktober 2026 telah diunduh.');
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000000) return `Rp\u00A0${(amount / 1000000000).toFixed(1)}M`;
    if (amount >= 1000000) return `Rp\u00A0${(amount / 1000000).toFixed(1)}Jt`;
    return `Rp\u00A0${amount.toLocaleString('id-ID')}`;
  };

  // 4 Top Cards representing the current active month
  const metricCards = [
    {
      label: 'TOTAL PENDAPATAN',
      value: formatCompactCurrency(totalRevenue),
      icon: DollarSign,
      trend: '+18.4% MoM',
      subtext: `Rp\u00A0${totalRevenue.toLocaleString('id-ID')}`,
    },
    {
      label: 'TINDAKAN SELESAI',
      value: `${completedCount}\u00A0Pasien`,
      icon: CheckCircle2,
      trend: 'Optimal',
      subtext: `dari ${currentMonthAppointments.length} reservasi`,
    },
    {
      label: 'RATA-RATA TIKET',
      value: formatCompactCurrency(avgPerPatient),
      icon: Activity,
      trend: 'Estetika',
      subtext: 'Rata-rata per pasien',
    },
    {
      label: 'UTILISASI KURSI',
      value: '88%\u00A0Occupancy',
      icon: Layers,
      trend: 'Penuh',
      subtext: '4 dental unit aktif',
    },
  ];

  // Chart Calculations based on 2026 Monthly Trend
  const maxRevenueVal = Math.max(...MONTHLY_TREND_DATA.map((d) => d.revenue));
  const maxPatientsVal = Math.max(...MONTHLY_TREND_DATA.map((d) => d.patients));

  return (
    <div className="space-y-5 pb-14">
      {/* ============================================================== */}
      {/* HEADER BAR: INFORMASI PERIODE BULAN INI & EKSPOR CSV           */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0D5966]/10 text-[#0D5966] border border-[#0D5966]/20">
            <Calendar className="w-3.5 h-3.5 text-[#0D5966]" />
            <span>Hasil Bulan Berjalan: Oktober 2026</span>
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">•</span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Ringkasan omset & performa klinis terkini
          </span>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 transition-colors cursor-pointer shadow-2xs self-start sm:self-auto shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>Ekspor Laporan (CSV)</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 4 METRIC CARDS: DENTIS CARD DNA CONTAINER (TEAL CONTAINER)     */}
      {/* ============================================================== */}
      <div className="p-2.5 sm:p-3.5 rounded-[22px] sm:rounded-[28px] bg-[#0D5966] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {metricCards.map((item, idx) => {
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

      {/* ============================================================== */}
      {/* DIAGRAM TREN: FLUKTUASI OMSET & PASIEN BULANAN 2026             */}
      {/* ============================================================== */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-xs space-y-4">
        {/* Header of Chart with Metric Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0D5966]" />
              <h3 className="text-sm font-bold text-slate-900">
                Diagram Tren Keuangan & Kunjungan 2026
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualisasi fluktuasi omset dan volume pasien klinik per bulan sepanjang tahun 2026.
            </p>
          </div>

          {/* Toggle Revenue vs Patients */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl text-xs font-medium border border-slate-200/70 shadow-2xs self-start sm:self-auto">
            <button
              onClick={() => setChartMode('revenue')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                chartMode === 'revenue'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Tren Omset (Rp)
            </button>
            <button
              onClick={() => setChartMode('patients')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                chartMode === 'patients'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Volume Pasien
            </button>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Bulan Tertinggi (Peak)</span>
            <span className="text-xs font-bold text-slate-900 block mt-0.5">Oktober 2026</span>
            <span className="text-[10px] text-emerald-700 font-semibold">Rp 104,8 Juta (52 Pasien)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Bulan Terendah (Dip)</span>
            <span className="text-xs font-bold text-slate-900 block mt-0.5">April 2026</span>
            <span className="text-[10px] text-slate-500 font-medium">Rp 61,8 Juta (Pasca Libur)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Rata-Rata Bulanan</span>
            <span className="text-xs font-bold text-[#0D5966] block mt-0.5">Rp 83,3 Juta / Bln</span>
            <span className="text-[10px] text-slate-400">41 tindakan / bulan</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Pertumbuhan YTD</span>
            <span className="text-xs font-bold text-emerald-700 block mt-0.5">+28.5% YoY</span>
            <span className="text-[10px] text-slate-400">Target klinik tercapai</span>
          </div>
        </div>

        {/* Clean Interactive SVG Bar Chart */}
        <div className="pt-4">
          <div className="h-56 w-full flex items-end px-2 gap-2 sm:gap-3.5">
            {MONTHLY_TREND_DATA.map((item, idx) => {
              const value = chartMode === 'revenue' ? item.revenue : item.patients;
              const maxVal = chartMode === 'revenue' ? maxRevenueVal : maxPatientsVal;
              const heightPercent = Math.max(Math.round((value / maxVal) * 85), 12);
              const isPeak = idx === 9; // Oktober
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={item.month}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                      <div className="font-bold">{item.label}</div>
                      <div>
                        {chartMode === 'revenue'
                          ? `Rp ${(item.revenue / 1000000).toFixed(1)} Juta`
                          : `${item.patients} Pasien`}
                        <span className="text-teal-300 ml-1">({item.change})</span>
                      </div>
                    </div>
                  )}

                  {/* Top value indicator for peaks */}
                  {isPeak && !isHovered && (
                    <span className="text-[9px] font-bold text-[#0D5966] mb-1">
                      {chartMode === 'revenue' ? '104.8M' : '52p'}
                    </span>
                  )}

                  {/* Bar column */}
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-200 ${
                        isPeak
                          ? 'bg-[#0D5966]'
                          : isHovered
                          ? 'bg-teal-700'
                          : item.isEstimate
                          ? 'bg-teal-600/30 border-t-2 border-dashed border-[#0D5966]'
                          : 'bg-[#0D5966]/80 hover:bg-[#0D5966]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Month Label */}
                  <span
                    className={`mt-2 text-[10px] font-medium transition-colors ${
                      isPeak
                        ? 'font-bold text-[#0D5966]'
                        : isHovered
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0D5966]" />
                <span>Bulan Berjalan / Realisasi</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-teal-600/30 border border-dashed border-[#0D5966]" />
                <span>Estimasi Proyeksi</span>
              </span>
            </div>
            <span>
              Mode: <strong className="text-slate-700">12 Bulan Kalender (2026)</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BREAKDOWN SECTION: LAYANAN & METODE PEMBAYARAN                 */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Breakdown by Service Category Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Breakdown Kategori Layanan (Bulan Ini)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Proporsi omset berdasarkan kategori tindakan klinik.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {serviceBreakdown.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  Tidak ada data tindakan untuk bulan ini.
                </div>
              ) : (
                serviceBreakdown.map((item, idx) => {
                  const percent = totalRevenue > 0 ? Math.round((item.totalRev / totalRevenue) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{item.name}</span>
                          <span className="text-slate-400 text-[11px]">({item.count}x)</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">
                            Rp {item.totalRev.toLocaleString('id-ID')}
                          </span>
                          <span className="text-slate-400 text-[11px] ml-1.5 font-medium">
                            ({percent}%)
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0D5966] transition-all duration-300"
                          style={{ width: `${Math.max(percent, 3)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Breakdown by Payment Method Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Komposisi Kanal Pembayaran Pasien (Bulan Ini)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Distribusi penerimaan kasir, QRIS dinamis, VA, dan transfer bank.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {paymentBreakdown.map((item, idx) => {
                const percent = totalRevenue > 0 ? Math.round((item.totalRev / totalRevenue) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {item.name.includes('QRIS') && <QrCode className="w-3.5 h-3.5 text-purple-600" />}
                        {item.name.includes('Virtual') && <CreditCard className="w-3.5 h-3.5 text-blue-600" />}
                        {item.name.includes('Transfer') && <Building className="w-3.5 h-3.5 text-emerald-600" />}
                        {item.name.includes('Kasir') && <Receipt className="w-3.5 h-3.5 text-slate-600" />}
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="text-slate-400 text-[11px]">({item.count}x)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">
                          Rp {item.totalRev.toLocaleString('id-ID')}
                        </span>
                        <span className="text-slate-400 text-[11px] ml-1.5 font-medium">
                          ({percent}%)
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal-600 transition-all duration-300"
                        style={{ width: `${Math.max(percent, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
