'use client';

import React from 'react';
import Image from 'next/image';
import { useDentis } from '@/context/DentisContext';
import { NavMenu } from '@/types/dentis';
import {
  LayoutDashboard,
  CalendarCheck,
  Users2,
  Stethoscope,
  BarChart3,
  Sliders,
  Globe,
  LayoutTemplate,
  Layers,
  ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  Building2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  TriangleAlert,
  ExternalLink,
  LogOut,
  ChevronsUpDown,
  Calendar,
  Users,
  ArrowLeftRight,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  const [isDoctorExpanded, setIsDoctorExpanded] = React.useState(true);
  const [isContentExpanded, setIsContentExpanded] = React.useState(true);
  const {
    activeMenu,
    setActiveMenu,
    activeDoctorTab,
    setActiveDoctorTab,
    activeCmsTab,
    setActiveCmsTab,
    appointments,
    doctors,
    shiftSwapLogs,
    webCMS,
    resetDemoData,
    currentBranch,
    currentUser,
    setIsBranchModalOpen,
    setIsLogoutConfirmOpen,
  } = useDentis();

  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;

  const topMenuItems: { id: NavMenu; label: string; icon: React.ElementType; badge?: number }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'reservasi',
      label: 'Reservasi & Leads',
      icon: CalendarCheck,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: 'rekam-medis',
      label: 'Database Pasien',
      icon: Users2,
    },
  ];

  const cmsSubMenuItems = [
    {
      id: 'hero',
      label: 'Hero & Intro',
      icon: LayoutTemplate,
    },
    {
      id: 'layanan',
      label: 'Layanan Web',
      icon: Layers,
      badge: `${webCMS.services.length}`,
    },
    {
      id: 'before-after',
      label: 'Hasil Perawatan',
      icon: ImageIcon,
      badge: `${webCMS.beforeAfter.length}`,
    },
    {
      id: 'dokter',
      label: 'Dokter Spesialis',
      icon: Stethoscope,
      badge: `${webCMS.doctors.length}`,
    },
    {
      id: 'testimoni',
      label: 'Testimoni Pasien',
      icon: MessageSquareQuote,
      badge: `${webCMS.testimonials.length}`,
    },
    {
      id: 'faq',
      label: 'FAQ Website',
      icon: HelpCircle,
      badge: `${webCMS.faqs.length}`,
    },
    {
      id: 'promo-kontak',
      label: 'Banner & Kontak',
      icon: Building2,
    },
  ];

  const handleNavClick = (id: NavMenu) => {
    setActiveMenu(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleSubMenuClick = (tabId: string) => {
    setActiveMenu('pengaturan');
    setActiveCmsTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const isContentActive = activeMenu === 'pengaturan';

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen max-h-screen w-64 shrink-0 flex flex-col border-r border-slate-200/70 bg-white transition-transform duration-200 overflow-hidden ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Top Brand & Menu with independent smooth scroll */}
      <div className="flex flex-col flex-1 min-h-0 px-4 py-5 overflow-y-auto overscroll-contain">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 pb-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-[#0D5966] flex items-center justify-center p-2 shrink-0">
            <Image
              src="/tooth-white.png"
              alt="Dentis logo"
              width={22}
              height={22}
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-[#0D5966]">
                Dentis
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#0D5966]/10 text-[#0D5966]">
                PORTAL
              </span>
            </div>
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="text-[11px] font-medium text-slate-400 hover:text-[#0D5966] transition-colors flex items-center gap-1 group text-left cursor-pointer"
              title="Klik untuk beralih cabang klinik"
            >
              <span className="truncate">Klinik {currentBranch.name} • Internal</span>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#0D5966] shrink-0" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="mt-5 space-y-1">
          <p className="px-2.5 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama
          </p>

          {/* Top Menu Items (Overview, Reservasi, Rekam Medis) */}
          {topMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#0D5966] text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Collapsible Submenu Section: JADWAL & TIM DOKTER */}
          <div className="pt-0.5">
            <button
              onClick={() => {
                if (activeMenu !== 'dokter') {
                  setActiveMenu('dokter');
                }
                setIsDoctorExpanded(!isDoctorExpanded);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                activeMenu === 'dokter'
                  ? 'bg-slate-100/90 text-slate-900 font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Stethoscope
                  className={`w-4 h-4 shrink-0 ${
                    activeMenu === 'dokter' ? 'text-[#0D5966]' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">Jadwal Dokter</span>
              </div>
              <div className="text-slate-400 p-0.5 hover:text-slate-600">
                {isDoctorExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </div>
            </button>

            {/* Tree Branch Submenu Items for Dokter */}
            {isDoctorExpanded && (
              <div className="relative mt-1 ml-5 pl-3 border-l-[1.5px] border-slate-200/90 space-y-1">
                {/* 1. Kalender Praktik */}
                <div className="relative group">
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2.5 h-[1.5px] bg-slate-200/90" />
                  <button
                    onClick={() => {
                      setActiveMenu('dokter');
                      setActiveDoctorTab('calendar');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      activeMenu === 'dokter' && activeDoctorTab === 'calendar'
                        ? 'text-[#0D5966] font-bold bg-[#0D5966]/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Calendar
                        className={`w-3.5 h-3.5 shrink-0 ${
                          activeMenu === 'dokter' && activeDoctorTab === 'calendar'
                            ? 'text-[#0D5966]'
                            : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">Kalender Praktik</span>
                    </div>
                  </button>
                </div>

                {/* 2. Daftar Dokter */}
                <div className="relative group">
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2.5 h-[1.5px] bg-slate-200/90" />
                  <button
                    onClick={() => {
                      setActiveMenu('dokter');
                      setActiveDoctorTab('roster');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      activeMenu === 'dokter' && activeDoctorTab === 'roster'
                        ? 'text-[#0D5966] font-bold bg-[#0D5966]/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Users
                        className={`w-3.5 h-3.5 shrink-0 ${
                          activeMenu === 'dokter' && activeDoctorTab === 'roster'
                            ? 'text-[#0D5966]'
                            : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">Daftar Dokter</span>
                    </div>
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-bold rounded-md shrink-0 ${
                        activeMenu === 'dokter' && activeDoctorTab === 'roster'
                          ? 'bg-[#0D5966] text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {doctors.length}
                    </span>
                  </button>
                </div>

                {/* 3. Riwayat Tukar Shift */}
                <div className="relative group">
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2.5 h-[1.5px] bg-slate-200/90" />
                  <button
                    onClick={() => {
                      setActiveMenu('dokter');
                      setActiveDoctorTab('swaps');
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      activeMenu === 'dokter' && activeDoctorTab === 'swaps'
                        ? 'text-[#0D5966] font-bold bg-[#0D5966]/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ArrowLeftRight
                        className={`w-3.5 h-3.5 shrink-0 ${
                          activeMenu === 'dokter' && activeDoctorTab === 'swaps'
                            ? 'text-[#0D5966]'
                            : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">Riwayat Tukar</span>
                    </div>
                    {shiftSwapLogs.length > 0 && (
                      <span
                        className={`px-1.5 py-0.2 text-[10px] font-bold rounded-md shrink-0 ${
                          activeMenu === 'dokter' && activeDoctorTab === 'swaps'
                            ? 'bg-[#0D5966] text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {shiftSwapLogs.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Laporan Keuangan */}
          <button
            onClick={() => handleNavClick('keuangan')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 cursor-pointer ${
              activeMenu === 'keuangan'
                ? 'bg-[#0D5966] text-white font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <BarChart3
                className={`w-4 h-4 shrink-0 ${
                  activeMenu === 'keuangan' ? 'text-white' : 'text-slate-400'
                }`}
              />
              <span className="truncate">Laporan Keuangan</span>
            </div>
          </button>

          {/* Collapsible Submenu Section: CMS WEBSITE */}
          <div className="pt-2">
            {/* Parent CMS Website Toggle Button */}
            <button
              onClick={() => {
                if (!isContentActive) {
                  setActiveMenu('pengaturan');
                }
                setIsContentExpanded(!isContentExpanded);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                isContentActive
                  ? 'bg-slate-100/90 text-slate-900 font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Globe
                  className={`w-4 h-4 shrink-0 ${
                    isContentActive ? 'text-[#0D5966]' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">CMS Website</span>
              </div>
              <div className="text-slate-400 p-0.5 hover:text-slate-600">
                {isContentExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </div>
            </button>

            {/* Tree Branch Submenu Items */}
            {isContentExpanded && (
              <div className="relative mt-1 ml-5 pl-3 border-l-[1.5px] border-slate-200/90 space-y-1">
                {cmsSubMenuItems.map((sub) => {
                  const Icon = sub.icon;
                  const isSubActive =
                    isContentActive && (activeCmsTab === sub.id || (!activeCmsTab && sub.id === 'hero'));

                  return (
                    <div key={sub.id} className="relative group">
                      {/* Curved tree branch connector */}
                      <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-2.5 h-[1.5px] bg-slate-200/90" />

                      <button
                        onClick={() => handleSubMenuClick(sub.id)}
                        className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                          isSubActive
                            ? 'text-[#0D5966] font-bold bg-[#0D5966]/10'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSubActive ? 'text-[#0D5966]' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{sub.label}</span>
                        </div>
                        {sub.badge && (
                          <span
                            className={`px-1.5 py-0.2 text-[10px] font-bold rounded-md shrink-0 ${
                              isSubActive
                                ? 'bg-[#0D5966] text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Profile & Actions pinned at bottom */}
      <div className="p-4 border-t border-slate-100 bg-white space-y-3 shrink-0">
        {/* User Card with Interactive Branch Switcher & Log Out */}
        <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between gap-2 shadow-2xs">
          <button
            onClick={() => setIsBranchModalOpen(true)}
            className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer group"
            title="Klik untuk beralih cabang klinik"
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#0D5966] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.initials}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#0D5966] transition-colors">
                  {currentUser.role}
                </p>
                <ChevronsUpDown className="w-3 h-3 text-slate-400 group-hover:text-[#0D5966] shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Klinik {currentBranch.name}
              </p>
            </div>
          </button>

          <button
            onClick={() => setIsLogoutConfirmOpen(true)}
            title="Log Out / Keluar Sesi"
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Utility Links */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-1">
          <a
            href="https://dentis.growhaley.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-[#0D5966] transition-colors"
          >
            <span>Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
