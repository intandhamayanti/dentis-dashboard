'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useDentis } from '@/context/DentisContext';
import {
  ClinicService,
  WebFeaturedServiceCMS,
  WebBeforeAfterCMS,
  WebDoctorCardCMS,
  WebTestimonialCMS,
  WebFaqCMS,
} from '@/types/dentis';
import {
  Globe,
  Sparkles,
  Save,
  Plus,
  Clock,
  X,
  ChevronRight,
  Star,
  Trash2,
  Edit3,
  CheckCircle2,
  Users,
  Stethoscope,
  Layers,
  HelpCircle,
  MessageSquare,
  MessageSquareQuote,
  ImageIcon,
  Phone,
  MapPin,
  Check,
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  LayoutTemplate,
  Tag,
} from 'lucide-react';
import ImageUploadField from './ImageUploadField';

// Standardized form field styles across all CMS tabs
const FORM_STYLES = {
  label: 'block text-xs font-semibold text-slate-700 tracking-tight mb-1.5',
  labelOptional: 'text-[11px] font-normal text-slate-400 ml-1',
  input: 'w-full h-10 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0D5966] focus:bg-white focus:ring-2 focus:ring-[#0D5966]/15 transition-all',
  inputMono: 'w-full h-10 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0D5966] focus:bg-white focus:ring-2 focus:ring-[#0D5966]/15 transition-all',
  textarea: 'w-full px-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0D5966] focus:bg-white focus:ring-2 focus:ring-[#0D5966]/15 transition-all resize-none',
  select: 'w-full h-10 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0D5966] focus:bg-white focus:ring-2 focus:ring-[#0D5966]/15 transition-all cursor-pointer',
};

const DOCTOR_PHOTO_PRESETS = [
  { name: 'drg. Dimas', path: '/doctors/drg-dimas.jpg' },
  { name: 'drg. Nabila', path: '/doctors/drg-nabila.jpg' },
  { name: 'drg. Arya', path: '/doctors/drg-arya.jpg' },
  { name: 'drg. Siti', path: '/doctors/drg-siti.jpg' },
  { name: 'drg. Kevin', path: '/doctors/drg-kevin.jpg' },
  { name: 'drg. Amanda', path: '/doctors/drg-amanda.jpg' },
  { name: 'drg. Clarissa', path: '/doctors/drg-clarissa.jpg' },
  { name: 'drg. Rizky', path: '/doctors/drg-rizky.jpg' },
];

type CMSTab =
  | 'halaman-depan'
  | 'paket-harga'
  | 'studio'
  | 'testimoni-angka'
  | 'kebijakan'
  | 'preview'
  | 'hero'
  | 'layanan'
  | 'before-after'
  | 'dokter'
  | 'testimoni'
  | 'faq'
  | 'promo-kontak';

export default function SettingsView() {
  const {
    services,
    settings,
    webCMS,
    activeCmsTab,
    setActiveCmsTab,
    updateService,
    addService,
    updateSettings,
    updateHeroCMS,
    updateAboutCMS,
    updateFeaturedService,
    addFeaturedService,
    deleteFeaturedService,
    updateBeforeAfter,
    addBeforeAfter,
    deleteBeforeAfter,
    updateDoctorCard,
    updateTestimonial,
    addTestimonial,
    deleteTestimonial,
    updateFaq,
    addFaq,
    deleteFaq,
    updateCtaBannerCMS,
    addToast,
  } = useDentis();

  // Keep activeTab in sync with activeCmsTab from Sidebar
  const activeTab: CMSTab = (activeCmsTab as CMSTab) || 'halaman-depan';
  const setActiveTab = (tab: CMSTab) => {
    setActiveCmsTab(tab);
  };

  // Hero form state
  const [heroForm, setHeroForm] = useState(webCMS.hero);
  // About form state
  const [aboutForm, setAboutForm] = useState(webCMS.about);
  // CTA Banner form state
  const [ctaBannerForm, setCtaBannerForm] = useState(webCMS.ctaBanner);
  // Clinic contact & promo form
  const [clinicForm, setClinicForm] = useState({
    clinicName: settings.clinicName,
    hotlineWhatsapp: settings.hotlineWhatsapp,
    email: settings.email,
    address: settings.address,
    operatingHoursWeekday: settings.operatingHoursWeekday,
    operatingHoursWeekend: settings.operatingHoursWeekend,
    promoBannerActive: settings.promoBannerActive,
    promoBannerText: settings.promoBannerText,
    promoDiscountPercent: settings.promoDiscountPercent,
  });

  // Modal states
  const [editingService, setEditingService] = useState<ClinicService | null>(null);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<ClinicService['category']>('Perawatan Gigi Umum');
  const [newServiceDuration, setNewServiceDuration] = useState(45);
  const [newServicePrice, setNewServicePrice] = useState(500000);
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Featured service edit modal
  const [editingFeaturedService, setEditingFeaturedService] = useState<WebFeaturedServiceCMS | null>(null);
  const [newFeaturePoint, setNewFeaturePoint] = useState('');

  // Before-After modal
  const [editingBeforeAfter, setEditingBeforeAfter] = useState<WebBeforeAfterCMS | null>(null);
  const [isNewBeforeAfterOpen, setIsNewBeforeAfterOpen] = useState(false);
  const [newBeforeAfter, setNewBeforeAfter] = useState({
    title: '',
    treatment: 'Porcelain Veneer',
    doctorName: 'drg. Dimas Wicaksono, Sp.KG',
    description: '',
    imageUrl: '/before-after-teeth.jpg',
    duration: '2 Sesi Kunjungan',
    isActive: true,
  });

  // Testimonial modal
  const [editingTestimonial, setEditingTestimonial] = useState<WebTestimonialCMS | null>(null);
  const [isNewTestimonialOpen, setIsNewTestimonialOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    patientName: '',
    treatment: 'Porcelain Veneer E-Max',
    rating: 5,
    reviewText: '',
    patientPhotoUrl: '/hero-patient.jpg',
    isVerified: true,
    isActive: true,
  });

  // FAQ modal
  const [editingFaq, setEditingFaq] = useState<WebFaqCMS | null>(null);
  const [isNewFaqOpen, setIsNewFaqOpen] = useState(false);
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    category: 'Reservasi',
    isActive: true,
  });

  // Doctor card edit modal
  const [editingDoctor, setEditingDoctor] = useState<WebDoctorCardCMS | null>(null);

  // Save Handlers
  const handleSaveHeroAndAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroCMS(heroForm);
    updateAboutCMS(aboutForm);
    addToast('success', 'Hero & Profil Disimpan', 'Perubahan teks dan statistik berhasil disimpan.');
  };

  const handleSaveClinicContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(clinicForm);
    updateCtaBannerCMS(ctaBannerForm);
    addToast('success', 'Kontak & Banner Disimpan', 'Info kontak, promo, dan CTA banner berhasil disimpan.');
  };

  const handleSaveFeaturedServiceModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFeaturedService) {
      updateFeaturedService(editingFeaturedService);
      setEditingFeaturedService(null);
    }
  };

  const handleSaveBeforeAfterModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBeforeAfter) {
      updateBeforeAfter(editingBeforeAfter);
      setEditingBeforeAfter(null);
    }
  };

  const handleCreateBeforeAfter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBeforeAfter.title.trim()) return;
    addBeforeAfter(newBeforeAfter);
    setNewBeforeAfter({
      title: '',
      treatment: 'Porcelain Veneer',
      doctorName: 'drg. Dimas Wicaksono, Sp.KG',
      description: '',
      imageUrl: '/before-after-teeth.jpg',
      duration: '2 Sesi Kunjungan',
      isActive: true,
    });
    setIsNewBeforeAfterOpen(false);
  };

  const handleSaveDoctorModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctor) {
      updateDoctorCard(editingDoctor);
      setEditingDoctor(null);
    }
  };

  const handleSaveTestimonialModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonial) {
      updateTestimonial(editingTestimonial);
      setEditingTestimonial(null);
    }
  };

  const handleCreateTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.patientName.trim()) return;
    addTestimonial(newTestimonial);
    setNewTestimonial({
      patientName: '',
      treatment: 'Porcelain Veneer E-Max',
      rating: 5,
      reviewText: '',
      patientPhotoUrl: '/hero-patient.jpg',
      isVerified: true,
      isActive: true,
    });
    setIsNewTestimonialOpen(false);
  };

  const handleSaveFaqModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaq) {
      updateFaq(editingFaq);
      setEditingFaq(null);
    }
  };

  const handleCreateFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question.trim()) return;
    addFaq(newFaq);
    setNewFaq({
      question: '',
      answer: '',
      category: 'Reservasi',
      isActive: true,
    });
    setIsNewFaqOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* ========================================================= */}
      {/* TAB 1: HERO & TENTANG KAMI */}
      {/* ========================================================= */}
      {(activeTab === 'hero' || activeTab === 'halaman-depan') && (
        <form onSubmit={handleSaveHeroAndAbout} className="space-y-6">
          {/* Hero Section Copy */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D5966]/10 text-[#0D5966] flex items-center justify-center shrink-0">
                  <LayoutTemplate className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">1. Hero Section Copywriting</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Judul utama, deskripsi pengantar, rating Google Reviews, dan tombol aksi di bagian teratas website.
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className={FORM_STYLES.label}>
                  Headline Utama (H1)
                </label>
                <input
                  type="text"
                  value={heroForm.headline}
                  onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>

              <div>
                <label className={FORM_STYLES.label}>
                  Rating Pasien & Label
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={heroForm.ratingScore}
                    onChange={(e) => setHeroForm({ ...heroForm, ratingScore: e.target.value })}
                    className={`col-span-1 ${FORM_STYLES.input} font-bold text-[#0D5966]`}
                    placeholder="4.9 / 5.0"
                  />
                  <input
                    type="text"
                    value={heroForm.ratingLabel}
                    onChange={(e) => setHeroForm({ ...heroForm, ratingLabel: e.target.value })}
                    className={`col-span-2 ${FORM_STYLES.input}`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={FORM_STYLES.label}>
                Subheadline / Deskripsi Pengantar
              </label>
              <textarea
                rows={2}
                value={heroForm.subheadline}
                onChange={(e) => setHeroForm({ ...heroForm, subheadline: e.target.value })}
                className={FORM_STYLES.textarea}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={FORM_STYLES.label}>
                  Teks Tombol Utama (CTA 1)
                </label>
                <input
                  type="text"
                  value={heroForm.primaryCtaText}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryCtaText: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>
                  Teks Tombol Sekunder (CTA 2 WhatsApp)
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryCtaText}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaText: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
            </div>

            {/* Dual Hero Images Upload System */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className={FORM_STYLES.label}>
                Foto Dual Hero (Upload Gambar Langsung dari PC / Drag & Drop)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploadField
                  label="Foto Kiri: Ruang Klinik & Dental Chair"
                  helperText="Upload foto klinik dari PC (dummy upload) atau drag & drop"
                  value={heroForm.heroImageLeft}
                  onChange={(url) => setHeroForm({ ...heroForm, heroImageLeft: url })}
                  aspectRatio="video"
                />
                <ImageUploadField
                  label="Foto Kanan: Pasien Tersenyum Alami"
                  helperText="Upload foto pasien senyum dari PC (dummy upload) atau drag & drop"
                  value={heroForm.heroImageRight}
                  onChange={(url) => setHeroForm({ ...heroForm, heroImageRight: url })}
                  aspectRatio="video"
                />
              </div>
            </div>
          </div>

          {/* Tentang Kami / Value Proposition & Stats */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D5966]/10 text-[#0D5966] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">2. Section Tentang Kami & 3 Highlight Stats</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Statement filosofi klinik dan 3 kotak angka pencapaian (Pasien Puas, Retensi, Jam Terbang Spesialis).
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <label className={FORM_STYLES.label}>
                  Badge Label
                </label>
                <input
                  type="text"
                  value={aboutForm.badge}
                  onChange={(e) => setAboutForm({ ...aboutForm, badge: e.target.value })}
                  className={`${FORM_STYLES.input} uppercase font-bold text-[#0D5966]`}
                />
              </div>
              <div className="lg:col-span-2">
                <label className={FORM_STYLES.label}>
                  Statement Copy Klinik
                </label>
                <textarea
                  rows={2}
                  value={aboutForm.statement}
                  onChange={(e) => setAboutForm({ ...aboutForm, statement: e.target.value })}
                  className={FORM_STYLES.textarea}
                />
              </div>
            </div>

            {/* 3 Highlight Stats Cards */}
            <div>
              <label className={FORM_STYLES.label}>
                3 Kotak Highlight Metrik (Container Teal di Web)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {aboutForm.stats.map((st, idx) => (
                  <div key={st.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                      Metrik #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const updated = [...aboutForm.stats];
                        updated[idx].value = e.target.value;
                        setAboutForm({ ...aboutForm, stats: updated });
                      }}
                      className={`${FORM_STYLES.input} font-extrabold text-base text-[#0D5966] bg-white`}
                    />
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => {
                        const updated = [...aboutForm.stats];
                        updated[idx].label = e.target.value;
                        setAboutForm({ ...aboutForm, stats: updated });
                      }}
                      className={`${FORM_STYLES.input} font-semibold text-xs text-slate-800 bg-white`}
                    />
                    <input
                      type="text"
                      value={st.sublabel}
                      onChange={(e) => {
                        const updated = [...aboutForm.stats];
                        updated[idx].sublabel = e.target.value;
                        setAboutForm({ ...aboutForm, stats: updated });
                      }}
                      className={`${FORM_STYLES.input} text-[11px] text-slate-500 bg-white`}
                      placeholder="Sublabel"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 2: LAYANAN WEB (4 CARDS) & MASTER TARIF */}
      {/* ========================================================= */}
      {(activeTab === 'layanan' || activeTab === 'paket-harga') && (
        <div className="space-y-6">
          {/* 4 Featured Services on Landing Page */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D5966]/10 text-[#0D5966] flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Layanan Unggulan Website ("Perawatan Lengkap untuk Senyum Percaya Diri")
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Setiap layanan memiliki kategori, judul, deskripsi detail, poin keunggulan, foto, dan tombol aksi.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-[#0D5966] border border-teal-200">
                  {webCMS.services.length} Layanan Aktif
                </span>
                <button
                  type="button"
                  onClick={() => setIsNewServiceModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Tindakan</span>
                </button>
              </div>
            </div>

            {/* List 4 Featured Services Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {webCMS.services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0D5966]/10 text-[#0D5966]">
                        {srv.category}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Aktif di Web
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                        <Image
                          src={srv.imageUrl}
                          alt={srv.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900">{srv.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                          {srv.description}
                        </p>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Poin Keunggulan di Web:
                      </span>
                      {srv.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-[#0D5966] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      CTA: <strong className="text-slate-700">{srv.ctaText}</strong>
                    </span>
                    <button
                      onClick={() => setEditingFeaturedService(srv)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-[#0D5966] text-white hover:bg-[#094550] transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Detail Layanan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Master Tarif Layanan Klinik */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D5966]/10 text-[#0D5966] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Master Tarif & Durasi Tindakan (Internal Klinik)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Daftar seluruh tindakan klinis, durasi standar (menit), dan biaya resmi klinik.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNewServiceModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Tindakan</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                    <th className="py-3 px-4 font-medium">NAMA TINDAKAN</th>
                    <th className="py-3 px-4 font-medium">KATEGORI</th>
                    <th className="py-3 px-4 font-medium">DURASI</th>
                    <th className="py-3 px-4 font-medium">TARIF RESMI</th>
                    <th className="py-3 px-4 text-right font-medium">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {services.map((srv) => (
                    <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">{srv.name}</span>
                        <span className="text-[11px] text-slate-400 truncate max-w-sm block">
                          {srv.description}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          {srv.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{srv.durationMin} Menit</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        Rp {srv.price.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setEditingService(srv)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#0D5966] hover:bg-teal-50 transition-colors cursor-pointer"
                        >
                          Edit Tarif
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: HASIL PERAWATAN (BEFORE / AFTER) */}
      {/* ========================================================= */}
      {activeTab === 'before-after' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D5966]/10 text-[#0D5966] flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Galeri Hasil Perawatan ("Senyum Nyata, Hasil Nyata")
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Foto klinis perbandingan gigi sebelum & sesudah perawatan (Veneer, Clear Aligners, Teeth Whitening, Implan).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNewBeforeAfterOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Kasus Klinis</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {webCMS.beforeAfter.map((ba) => (
                <div
                  key={ba.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2.5">
                    {/* Image Preview with overlay badges */}
                    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-900">
                      <Image
                        src={ba.imageUrl}
                        alt={ba.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                        {ba.treatment}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0D5966] text-white">
                        {ba.duration}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{ba.title}</h4>
                      <p className="text-xs text-[#0D5966] font-medium mt-0.5">
                        Dokter: {ba.doctorName}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {ba.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Aktif di Slider Web
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingBeforeAfter(ba)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#0D5966] hover:bg-teal-50 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteBeforeAfter(ba.id)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Kasus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: DOKTER SPESIALIS (8 DOKTER) */}
      {/* ========================================================= */}
      {activeTab === 'dokter' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D5966]/10 text-[#0D5966] flex items-center justify-center shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Tim Dokter Spesialis ("Ditangani Langsung Spesialis Terbaik")
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Foto resmi jas putih, gelar subspesialis, dan pengalaman klinis seluruh 8 dokter spesialis Dentis.
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {webCMS.doctors.length} Dokter Lengkap di Website
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {webCMS.doctors.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-[#0D5966]/40 hover:shadow-sm transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-3">
                    {/* Doctor Avatar - aspect square with crisp frame */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs">
                      <Image
                        src={doc.avatarUrl}
                        alt={doc.name}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/70 text-white backdrop-blur-xs text-[10px] font-bold">
                        #{idx + 1}
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
                        {doc.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#0D5966] line-clamp-1">
                        {doc.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium line-clamp-1">
                        {doc.experience}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setEditingDoctor(doc)}
                      className="w-full h-8 rounded-xl bg-slate-50 hover:bg-[#0D5966] text-slate-700 hover:text-white border border-slate-200 hover:border-[#0D5966] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Profil & Foto</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: TESTIMONI PASIEN */}
      {/* ========================================================= */}
      {activeTab === 'testimoni' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D5966]/10 text-[#0D5966] flex items-center justify-center shrink-0">
                  <MessageSquareQuote className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Ulasan &amp; Testimoni Pasien (&ldquo;Senyum Nyaman, Cerita Nyata&rdquo;)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Testimoni asli pasien terverifikasi lengkap dengan foto tersenyum, rating 5 bintang, dan jenis perawatan.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNewTestimonialOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Ulasan Pasien</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {webCMS.testimonials.map((testi) => (
                <div
                  key={testi.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                        <Image
                          src={testi.patientPhotoUrl}
                          alt={testi.patientName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900">{testi.patientName}</h4>
                        <span className="text-[10px] text-[#0D5966] font-semibold block truncate">
                          {testi.treatment}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                          {[...Array(testi.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 italic line-clamp-3 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/60">
                      "{testi.reviewText}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{testi.date}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingTestimonial(testi)}
                        className="text-[#0D5966] font-semibold hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTestimonial(testi.id)}
                        className="text-rose-500 hover:text-rose-700 cursor-pointer"
                        title="Hapus Testimoni"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: FAQ WEBSITE */}
      {/* ========================================================= */}
      {(activeTab === 'faq' || activeTab === 'kebijakan') && (
        <div className="space-y-6">
          {/* Card 1: Standardized Form Input FAQ */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D5966]/10 text-[#0D5966] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    1. Form Kelola & Tambah Pertanyaan FAQ
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Inputan terstandar untuk memperbarui pertanyaan umum bagi calon pasien di landing page Dentis.
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-[#0D5966] border border-teal-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0D5966]" />
                {webCMS.faqs.length} FAQ Aktif di Web
              </span>
            </div>

            <form onSubmit={handleCreateFaq} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className={FORM_STYLES.label}>
                    Kategori Pertanyaan
                  </label>
                  <select
                    value={newFaq.category}
                    onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                    className={FORM_STYLES.select}
                  >
                    <option value="Reservasi & Konsultasi">Reservasi & Konsultasi</option>
                    <option value="Layanan & Spesialis">Layanan & Spesialis</option>
                    <option value="Biaya & Pembayaran">Biaya & Pembayaran</option>
                    <option value="Fasilitas & Jadwal">Fasilitas & Jadwal</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className={FORM_STYLES.label}>
                    Judul Pertanyaan (FAQ)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Berapa lama ketahanan veneer gigi porselen?"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    className={FORM_STYLES.input}
                  />
                </div>
              </div>

              <div>
                <label className={FORM_STYLES.label}>
                  Jawaban Lengkap
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan jawaban penjelasan yang ramah, jelas, dan transparan untuk calon pasien..."
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className={FORM_STYLES.textarea}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambahkan ke FAQ Website</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Daftar Pertanyaan FAQ Aktif di Website */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D5966]/10 text-[#0D5966] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Daftar FAQ Aktif di Website ({webCMS.faqs.length} Pertanyaan)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Daftar seluruh pertanyaan aktif. Klik edit untuk mengubah teks atau hapus bila sudah tidak relevan.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNewFaqOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah FAQ Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {webCMS.faqs.map((f, idx) => (
                <div
                  key={f.id}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-[#0D5966]/30 hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0D5966]/10 text-[#0D5966]">
                        {f.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Urutan #{idx + 1}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                      {f.question}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {f.answer}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => setEditingFaq(f)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0D5966] bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteFaq(f.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus Pertanyaan FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: BANNER PROMO & INFO KONTAK */}
      {/* ========================================================= */}
      {activeTab === 'promo-kontak' && (
        <form onSubmit={handleSaveClinicContact} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Promo Announcement Bar */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Banner Promo Atas (Top Bar)</h3>
                    <p className="text-xs text-slate-500">Pengumuman promo diskon di bagian paling atas web.</p>
                  </div>
                </div>
                {/* Toggle switch & Save */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setClinicForm({ ...clinicForm, promoBannerActive: !clinicForm.promoBannerActive })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      clinicForm.promoBannerActive ? 'bg-[#0D5966]' : 'bg-slate-300'
                    }`}
                    title={clinicForm.promoBannerActive ? 'Nonaktifkan Banner' : 'Aktifkan Banner'}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                        clinicForm.promoBannerActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-3.5 h-8.5 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>

              <div>
                <label className={FORM_STYLES.label}>
                  Teks Pengumuman Promo
                </label>
                <textarea
                  rows={2}
                  value={clinicForm.promoBannerText}
                  onChange={(e) => setClinicForm({ ...clinicForm, promoBannerText: e.target.value })}
                  className={FORM_STYLES.textarea}
                />
              </div>

              <div>
                <label className={FORM_STYLES.label}>
                  Diskon Promo (%)
                </label>
                <input
                  type="number"
                  value={clinicForm.promoDiscountPercent}
                  onChange={(e) =>
                    setClinicForm({ ...clinicForm, promoDiscountPercent: Number(e.target.value) })
                  }
                  className={`w-32 ${FORM_STYLES.input} font-bold text-[#0D5966]`}
                />
              </div>
            </div>

            {/* Bottom CTA Banner ("Rasakan Perawatan Gigi Modern") */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0D5966]/10 text-[#0D5966] flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">CTA Banner Bawah Website</h3>
                    <p className="text-xs text-slate-500">Card penutup berlatar Deep Teal sebelum footer.</p>
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3.5 h-8.5 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>

              <div>
                <label className={FORM_STYLES.label}>
                  Headline CTA Banner
                </label>
                <input
                  type="text"
                  value={ctaBannerForm.headline}
                  onChange={(e) => setCtaBannerForm({ ...ctaBannerForm, headline: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>

              <div>
                <label className={FORM_STYLES.label}>
                  Subheadline CTA Banner
                </label>
                <textarea
                  rows={2}
                  value={ctaBannerForm.subheadline}
                  onChange={(e) => setCtaBannerForm({ ...ctaBannerForm, subheadline: e.target.value })}
                  className={FORM_STYLES.textarea}
                />
              </div>
            </div>
          </div>

          {/* Clinic Official Contact & Hours */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D5966]/10 text-[#0D5966] flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Identitas Klinik, Alamat & Jam Buka</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Informasi resmi yang tertera pada footer dan kontak reservasi.</p>
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={FORM_STYLES.label}>Nama Klinik</label>
                <input
                  type="text"
                  value={clinicForm.clinicName}
                  onChange={(e) => setClinicForm({ ...clinicForm, clinicName: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Hotline WhatsApp Resmi</label>
                <input
                  type="text"
                  value={clinicForm.hotlineWhatsapp}
                  onChange={(e) => setClinicForm({ ...clinicForm, hotlineWhatsapp: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Email Resmi</label>
                <input
                  type="text"
                  value={clinicForm.email}
                  onChange={(e) => setClinicForm({ ...clinicForm, email: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Alamat Lengkap</label>
                <input
                  type="text"
                  value={clinicForm.address}
                  onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Jam Operasional Weekday</label>
                <input
                  type="text"
                  value={clinicForm.operatingHoursWeekday}
                  onChange={(e) => setClinicForm({ ...clinicForm, operatingHoursWeekday: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Jam Operasional Weekend</label>
                <input
                  type="text"
                  value={clinicForm.operatingHoursWeekend}
                  onChange={(e) => setClinicForm({ ...clinicForm, operatingHoursWeekend: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 8: LIVE WEB PREVIEW (MIRRORING THE REAL LANDING PAGE) */}
      {/* ========================================================= */}
      {activeTab === 'preview' && (
        <div className="space-y-8 p-6 sm:p-8 rounded-[36px] bg-slate-100/90 border border-slate-200/80 shadow-inner">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-slate-500 ml-2">
                Simulasi Live Tampilan Website Resmi (dentis-clinic.id)
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Live Preview Terhubung
            </span>
          </div>

          {/* Mini Navbar */}
          <div className="flex items-center justify-between py-3 px-6 rounded-2xl bg-white shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#0D5966]">Dentis</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
              <span>Tentang Kami</span>
              <span>Layanan</span>
              <span>Hasil Perawatan</span>
              <span>Dokter</span>
              <span>Testimoni</span>
              <span>FAQ</span>
            </div>
            <button className="px-4 py-1.5 rounded-xl bg-[#0D5966] text-white text-xs font-semibold">
              {webCMS.hero.primaryCtaText}
            </button>
          </div>

          {/* Hero Preview */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative h-56 rounded-[28px] overflow-hidden bg-slate-200 shadow-sm">
                <Image
                  src={webCMS.hero.heroImageLeft}
                  alt="Klinik"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-56 rounded-[28px] overflow-hidden bg-slate-200 shadow-sm">
                <Image
                  src={webCMS.hero.heroImageRight}
                  alt="Pasien"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="p-6 rounded-[28px] bg-white text-center space-y-3 shadow-xs">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight max-w-xl mx-auto">
                {webCMS.hero.headline}
              </h1>
              <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                {webCMS.hero.subheadline}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-500 font-bold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-slate-800 ml-1">{webCMS.hero.ratingScore}</span>
                <span className="text-slate-400 font-normal">({webCMS.hero.ratingLabel})</span>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button className="px-5 py-2.5 rounded-xl bg-[#0D5966] text-white text-xs font-semibold shadow-sm">
                  {webCMS.hero.primaryCtaText}
                </button>
                <button className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200">
                  {webCMS.hero.secondaryCtaText}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Preview in Teal Card */}
          <div className="p-6 rounded-[32px] bg-[#0D5966] text-white space-y-4 shadow-sm">
            <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
              {webCMS.about.badge}
            </span>
            <p className="text-sm sm:text-base font-semibold leading-relaxed max-w-2xl">
              "{webCMS.about.statement}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {webCMS.about.stats.map((st) => (
                <div key={st.id} className="p-4 rounded-[20px] bg-white text-slate-900 shadow-xs">
                  <span className="text-2xl font-black text-[#0D5966] block">{st.value}</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">{st.label}</span>
                  <span className="text-[10px] text-slate-400 block">{st.sublabel}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Layanan Preview */}
          <div className="space-y-4">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-teal-100 text-[#0D5966] text-[10px] font-bold uppercase">
                LAYANAN KAMI
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Perawatan Lengkap untuk Senyum Percaya Diri
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {webCMS.services.map((srv) => (
                <div key={srv.id} className="p-4 rounded-[24px] bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="relative h-40 rounded-[18px] overflow-hidden bg-slate-200">
                    <Image src={srv.imageUrl} alt={srv.title} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#0D5966] uppercase">{srv.category}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{srv.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{srv.description}</p>
                  </div>
                  <div className="space-y-1">
                    {srv.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1 text-[11px] text-slate-700">
                        <Check className="w-3 h-3 text-[#0D5966]" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8 Dokter Spesialis Preview (Mirroring Dentis Web DNA) */}
          <div className="space-y-6 pt-4">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0D5966]/10 text-[#0D5966] text-xs font-semibold">
                Tim Dokter Spesialis
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                Ditangani Langsung oleh Tim Ahli
              </h3>
            </div>

            {/* Marquee / Horizontal Scroll Track matching Web DNA exactly */}
            <div className="overflow-x-auto pb-4 scrollbar-none">
              <div className="flex items-center gap-4 px-2 min-w-max">
                {webCMS.doctors.map((doctor, idx) => (
                  <div
                    key={`${doctor.id}-${idx}`}
                    className="w-[260px] sm:w-[280px] shrink-0 bg-[#0D5966] p-2.5 sm:p-3 rounded-3xl shadow-lg border border-[#0D5966]/20 flex flex-col gap-2.5 select-none"
                  >
                    {/* Foto Portrait */}
                    <div className="relative aspect-square w-full rounded-[20px] overflow-hidden bg-[#F3F5F4] border border-white/10 shadow-xs">
                      <Image
                        src={doctor.avatarUrl}
                        alt={doctor.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Area Teks di Bawah: Putih Bersih, Bricolage Grotesque feel */}
                    <div className="bg-white rounded-[20px] px-4 py-3 h-[80px] flex flex-col justify-center border border-slate-100 shadow-xs text-left">
                      <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
                        {doctor.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium line-clamp-1">
                        {doctor.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Galeri Hasil Perawatan (Before-After) Preview */}
          <div className="space-y-6 pt-2">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-100 text-[#0D5966] text-xs font-semibold">
                Hasil Perawatan
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                Senyum Nyata, Hasil Nyata
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {webCMS.beforeAfter.map((ba) => (
                <div key={ba.id} className="p-4 rounded-[24px] bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="relative h-44 rounded-[18px] overflow-hidden bg-slate-900">
                    <Image src={ba.imageUrl} alt={ba.title} fill className="object-cover" />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/75 text-white">
                      {ba.treatment}
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0D5966] text-white">
                      {ba.duration}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{ba.title}</h4>
                    <p className="text-xs text-[#0D5966] font-medium mt-0.5">Oleh: {ba.doctorName}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ba.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimoni Pasien Preview */}
          <div className="space-y-6 pt-2">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0D5966]/10 text-[#0D5966] text-xs font-semibold">
                Ulasan Pasien
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                Senyum Nyaman, Cerita Nyata
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {webCMS.testimonials.map((testi) => (
                <div key={testi.id} className="p-4 rounded-[22px] bg-white border border-slate-200 shadow-xs flex flex-col justify-between gap-3">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                        <Image src={testi.patientPhotoUrl} alt={testi.patientName} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{testi.patientName}</h5>
                        <p className="text-[10px] text-[#0D5966] font-medium truncate">{testi.treatment}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(testi.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      "{testi.reviewText}"
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400">{testi.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Preview Container */}
          <div className="p-6 rounded-[32px] bg-[#0D5966] space-y-4 shadow-sm">
            <div className="text-center text-white space-y-1">
              <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase">
                FAQ WEBSITE
              </span>
              <h3 className="text-lg font-bold">Hal yang Sering Ditanyakan Seputar Dentis</h3>
            </div>
            <div className="space-y-2.5">
              {webCMS.faqs.map((f) => (
                <div key={f.id} className="p-4 rounded-[20px] bg-white">
                  <h4 className="text-xs font-bold text-slate-900">{f.question}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA Banner Preview */}
          <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#0D5966] to-[#093F49] text-white text-center space-y-3 shadow-md">
            <h3 className="text-2xl font-bold tracking-tight">
              {clinicForm.clinicName || 'Dentis Clinic'}
            </h3>
            <p className="text-sm text-white/80 max-w-lg mx-auto">
              {ctaBannerForm.subheadline}
            </p>
            <div className="pt-2 flex justify-center">
              <button className="px-6 py-2.5 rounded-xl bg-white text-[#0D5966] font-bold text-xs shadow-sm">
                Hubungi WhatsApp: {clinicForm.hotlineWhatsapp}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT FEATURED SERVICE (WEB CARD) */}
      {/* ========================================================= */}
      {editingFeaturedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Edit Kartu Layanan Web: {editingFeaturedService.title}
              </h3>
              <button
                onClick={() => setEditingFeaturedService(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFeaturedServiceModal} className="space-y-4">
              <div>
                <label className={FORM_STYLES.label}>Kategori Layanan</label>
                <input
                  type="text"
                  value={editingFeaturedService.category}
                  onChange={(e) =>
                    setEditingFeaturedService({ ...editingFeaturedService, category: e.target.value })
                  }
                  className={FORM_STYLES.input}
                />
              </div>

              <div>
                <label className={FORM_STYLES.label}>Judul Layanan</label>
                <input
                  type="text"
                  value={editingFeaturedService.title}
                  onChange={(e) =>
                    setEditingFeaturedService({ ...editingFeaturedService, title: e.target.value })
                  }
                  className={FORM_STYLES.input}
                />
              </div>

              <div>
                <label className={FORM_STYLES.label}>Deskripsi Lengkap</label>
                <textarea
                  rows={3}
                  value={editingFeaturedService.description}
                  onChange={(e) =>
                    setEditingFeaturedService({ ...editingFeaturedService, description: e.target.value })
                  }
                  className={FORM_STYLES.textarea}
                />
              </div>

              <ImageUploadField
                label="Foto Layanan Unggulan"
                value={editingFeaturedService.imageUrl}
                onChange={(val) =>
                  setEditingFeaturedService({ ...editingFeaturedService, imageUrl: val })
                }
                aspectRatio="video"
                helperText="Upload gambar layanan klinik (dummy offline preview)."
              />

              {/* Feature Points Editor */}
              <div>
                <label className={FORM_STYLES.label}>Poin Keunggulan (Bullet Points)</label>
                <div className="space-y-2 mb-2.5">
                  {editingFeaturedService.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const updated = [...editingFeaturedService.features];
                          updated[idx] = e.target.value;
                          setEditingFeaturedService({ ...editingFeaturedService, features: updated });
                        }}
                        className={`${FORM_STYLES.input} h-9 text-xs flex-1`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingFeaturedService.features.filter((_, i) => i !== idx);
                          setEditingFeaturedService({ ...editingFeaturedService, features: updated });
                        }}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Hapus Poin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeaturePoint}
                    onChange={(e) => setNewFeaturePoint(e.target.value)}
                    placeholder="Tambah poin keunggulan baru..."
                    className={`${FORM_STYLES.input} h-9 text-xs flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newFeaturePoint.trim()) {
                        setEditingFeaturedService({
                          ...editingFeaturedService,
                          features: [...editingFeaturedService.features, newFeaturePoint.trim()],
                        });
                        setNewFeaturePoint('');
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                  >
                    Tambah Poin
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingFeaturedService(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT DOKTER SPESIALIS */}
      {/* ========================================================= */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Edit Dokter: {editingDoctor.name}</h3>
              <button onClick={() => setEditingDoctor(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctorModal} className="space-y-4">
              <div>
                <label className={FORM_STYLES.label}>Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Gelar Spesialisasi</label>
                <input
                  type="text"
                  value={editingDoctor.title}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, title: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Fokus Tindakan / Subspesialisasi</label>
                <input
                  type="text"
                  value={editingDoctor.specialty}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Pengalaman Klinis</label>
                <input
                  type="text"
                  value={editingDoctor.experience}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, experience: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>

              <ImageUploadField
                label="Foto Resmi Dokter Spesialis (Upload Foto / Pilih Preset)"
                value={editingDoctor.avatarUrl}
                onChange={(val) => setEditingDoctor({ ...editingDoctor, avatarUrl: val })}
                aspectRatio="square"
                presets={DOCTOR_PHOTO_PRESETS}
                helperText="Upload foto jas putih dokter (dummy offline) atau pilih dari foto 8 dokter spesialis."
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] cursor-pointer shadow-xs"
                >
                  Simpan Dokter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT FAQ */}
      {/* ========================================================= */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Edit Pertanyaan FAQ</h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFaqModal} className="space-y-4">
              <div>
                <label className={FORM_STYLES.label}>Kategori Pertanyaan</label>
                <select
                  value={editingFaq.category}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className={FORM_STYLES.select}
                >
                  <option value="Reservasi & Konsultasi">Reservasi & Konsultasi</option>
                  <option value="Layanan & Spesialis">Layanan & Spesialis</option>
                  <option value="Biaya & Pembayaran">Biaya & Pembayaran</option>
                  <option value="Fasilitas & Jadwal">Fasilitas & Jadwal</option>
                </select>
              </div>
              <div>
                <label className={FORM_STYLES.label}>Pertanyaan FAQ</label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Jawaban Lengkap</label>
                <textarea
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className={FORM_STYLES.textarea}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs cursor-pointer"
                >
                  Simpan FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TAMBAH FAQ BARU */}
      {/* ========================================================= */}
      {isNewFaqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Tambah Pertanyaan FAQ Baru</h3>
              <button
                onClick={() => setIsNewFaqOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFaq} className="space-y-4">
              <div>
                <label className={FORM_STYLES.label}>Kategori Pertanyaan</label>
                <select
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                  className={FORM_STYLES.select}
                >
                  <option value="Reservasi & Konsultasi">Reservasi & Konsultasi</option>
                  <option value="Layanan & Spesialis">Layanan & Spesialis</option>
                  <option value="Biaya & Pembayaran">Biaya & Pembayaran</option>
                  <option value="Fasilitas & Jadwal">Fasilitas & Jadwal</option>
                </select>
              </div>
              <div>
                <label className={FORM_STYLES.label}>Pertanyaan FAQ</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Berapa lama ketahanan veneer gigi?"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Jawaban Lengkap</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan jawaban penjelasan untuk calon pasien..."
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className={FORM_STYLES.textarea}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewFaqOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs cursor-pointer"
                >
                  Tambahkan ke Web
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT TESTIMONI PASIEN */}
      {/* ========================================================= */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Edit Ulasan Pasien: {editingTestimonial.patientName}</h3>
              <button
                onClick={() => setEditingTestimonial(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonialModal} className="space-y-4">
              <div>
                <label className={FORM_STYLES.label}>Nama Pasien</label>
                <input
                  type="text"
                  required
                  value={editingTestimonial.patientName}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, patientName: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Jenis Perawatan Dilakukan</label>
                <input
                  type="text"
                  value={editingTestimonial.treatment}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, treatment: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <ImageUploadField
                label="Foto Pasien (Upload File)"
                value={editingTestimonial.patientPhotoUrl}
                onChange={(val) => setEditingTestimonial({ ...editingTestimonial, patientPhotoUrl: val })}
                aspectRatio="avatar"
                helperText="Upload foto pasien dari PC (dummy offline preview)."
              />
              <div>
                <label className={FORM_STYLES.label}>Rating Bintang</label>
                <select
                  value={editingTestimonial.rating}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                  className={FORM_STYLES.select}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 / 5 Sangat Puas)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 / 5 Puas)</option>
                  <option value={3}>⭐⭐⭐ (3 / 5 Cukup)</option>
                </select>
              </div>
              <div>
                <label className={FORM_STYLES.label}>Ulasan / Kutipan Cerita</label>
                <textarea
                  rows={3}
                  required
                  value={editingTestimonial.reviewText}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, reviewText: e.target.value })}
                  className={FORM_STYLES.textarea}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs cursor-pointer"
                >
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TAMBAH TESTIMONI BARU */}
      {/* ========================================================= */}
      {isNewTestimonialOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Tambah Testimoni Pasien Baru</h3>
              <button
                onClick={() => setIsNewTestimonialOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTestimonial} className="space-y-4">
              <div>
                <label className={FORM_STYLES.label}>Nama Pasien</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Clarissa Anggraini"
                  value={newTestimonial.patientName}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, patientName: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Jenis Perawatan</label>
                <input
                  type="text"
                  placeholder="Contoh: Porcelain Veneer E-Max"
                  value={newTestimonial.treatment}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, treatment: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <ImageUploadField
                label="Foto Pasien (Upload File)"
                value={newTestimonial.patientPhotoUrl}
                onChange={(val) => setNewTestimonial({ ...newTestimonial, patientPhotoUrl: val })}
                aspectRatio="avatar"
                helperText="Upload foto pasien dari PC (dummy offline preview)."
              />
              <div>
                <label className={FORM_STYLES.label}>Ulasan / Kutipan Cerita</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Pengalaman selama perawatan di Dentis..."
                  value={newTestimonial.reviewText}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, reviewText: e.target.value })}
                  className={FORM_STYLES.textarea}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewTestimonialOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs cursor-pointer"
                >
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT KASUS BEFORE-AFTER */}
      {/* ========================================================= */}
      {editingBeforeAfter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Edit Kasus: {editingBeforeAfter.title}</h3>
              <button
                onClick={() => setEditingBeforeAfter(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBeforeAfterModal} className="space-y-4">
              <div>
                <label className={FORM_STYLES.label}>Judul Kasus</label>
                <input
                  type="text"
                  required
                  value={editingBeforeAfter.title}
                  onChange={(e) => setEditingBeforeAfter({ ...editingBeforeAfter, title: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Kategori Tindakan</label>
                <input
                  type="text"
                  value={editingBeforeAfter.treatment}
                  onChange={(e) => setEditingBeforeAfter({ ...editingBeforeAfter, treatment: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Dokter Penanggung Jawab</label>
                <input
                  type="text"
                  value={editingBeforeAfter.doctorName}
                  onChange={(e) => setEditingBeforeAfter({ ...editingBeforeAfter, doctorName: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Durasi Tindakan</label>
                <input
                  type="text"
                  value={editingBeforeAfter.duration}
                  onChange={(e) => setEditingBeforeAfter({ ...editingBeforeAfter, duration: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <ImageUploadField
                label="Foto Klinis Before-After (Upload File)"
                value={editingBeforeAfter.imageUrl}
                onChange={(val) => setEditingBeforeAfter({ ...editingBeforeAfter, imageUrl: val })}
                aspectRatio="video"
                helperText="Upload foto komparasi sebelum & sesudah perawatan (dummy offline preview)."
              />
              <div>
                <label className={FORM_STYLES.label}>Deskripsi Kasus</label>
                <textarea
                  rows={2}
                  value={editingBeforeAfter.description}
                  onChange={(e) => setEditingBeforeAfter({ ...editingBeforeAfter, description: e.target.value })}
                  className={FORM_STYLES.textarea}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBeforeAfter(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TAMBAH KASUS BEFORE-AFTER */}
      {/* ========================================================= */}
      {isNewBeforeAfterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Tambah Kasus Klinis Before-After</h3>
              <button
                onClick={() => setIsNewBeforeAfterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBeforeAfter} className="space-y-4">
              <div>
                <label className={FORM_STYLES.label}>Judul Kasus</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Veneer Porselen E-Max 6 Gigi"
                  value={newBeforeAfter.title}
                  onChange={(e) => setNewBeforeAfter({ ...newBeforeAfter, title: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Dokter Penanggung Jawab</label>
                <input
                  type="text"
                  value={newBeforeAfter.doctorName}
                  onChange={(e) => setNewBeforeAfter({ ...newBeforeAfter, doctorName: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Durasi Tindakan</label>
                <input
                  type="text"
                  value={newBeforeAfter.duration}
                  onChange={(e) => setNewBeforeAfter({ ...newBeforeAfter, duration: e.target.value })}
                  className={FORM_STYLES.input}
                />
              </div>
              <ImageUploadField
                label="Foto Klinis Before-After (Upload File)"
                value={newBeforeAfter.imageUrl}
                onChange={(val) => setNewBeforeAfter({ ...newBeforeAfter, imageUrl: val })}
                aspectRatio="video"
                helperText="Upload foto komparasi sebelum & sesudah perawatan (dummy offline preview)."
              />
              <div>
                <label className={FORM_STYLES.label}>Deskripsi Kasus</label>
                <textarea
                  rows={2}
                  value={newBeforeAfter.description}
                  onChange={(e) => setNewBeforeAfter({ ...newBeforeAfter, description: e.target.value })}
                  className={FORM_STYLES.textarea}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewBeforeAfterOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs cursor-pointer"
                >
                  Tambahkan Kasus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT SERVICE TARIF */}
      {/* ========================================================= */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Edit Tarif: {editingService.name}</h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={FORM_STYLES.label}>Tarif Resmi (Rp)</label>
                <input
                  type="number"
                  value={editingService.price}
                  onChange={(e) =>
                    setEditingService({ ...editingService, price: Number(e.target.value) })
                  }
                  className={`${FORM_STYLES.input} font-bold text-slate-900`}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Estimasi Durasi (Menit)</label>
                <input
                  type="number"
                  value={editingService.durationMin}
                  onChange={(e) =>
                    setEditingService({ ...editingService, durationMin: Number(e.target.value) })
                  }
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Deskripsi Singkat Tindakan</label>
                <textarea
                  rows={2}
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  className={FORM_STYLES.textarea}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateService(editingService);
                    setEditingService(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs cursor-pointer"
                >
                  Simpan Tarif
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TAMBAH SERVICE BARU */}
      {/* ========================================================= */}
      {isNewServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Tambah Layanan Klinik Baru</h3>
              <button
                onClick={() => setIsNewServiceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={FORM_STYLES.label}>Nama Layanan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Scaling Deep Cleaning Ultrasonic"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className={FORM_STYLES.input}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label}>Kategori Layanan</label>
                <select
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value as ClinicService['category'])}
                  className={FORM_STYLES.select}
                >
                  <option value="Perawatan Gigi Umum">Perawatan Gigi Umum</option>
                  <option value="Kedokteran Gigi Estetika">Kedokteran Gigi Estetika</option>
                  <option value="Restorasi & Bedah Mulut">Restorasi & Bedah Mulut</option>
                  <option value="Gigi Anak & Keluarga">Gigi Anak & Keluarga</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={FORM_STYLES.label}>Tarif (Rp)</label>
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className={FORM_STYLES.input}
                  />
                </div>
                <div>
                  <label className={FORM_STYLES.label}>Durasi (Menit)</label>
                  <input
                    type="number"
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                    className={FORM_STYLES.input}
                  />
                </div>
              </div>
              <div>
                <label className={FORM_STYLES.label}>Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  placeholder="Penjelasan ringkas prosedur tindakan..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className={FORM_STYLES.textarea}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (newServiceName.trim()) {
                      addService({
                        name: newServiceName,
                        category: newServiceCategory,
                        durationMin: Number(newServiceDuration),
                        price: Number(newServicePrice),
                        description: newServiceDesc,
                      });
                      setNewServiceName('');
                      setNewServiceDesc('');
                      setIsNewServiceModalOpen(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0D5966] text-white text-xs font-semibold hover:bg-[#094550] shadow-xs cursor-pointer"
                >
                  Tambah Layanan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
