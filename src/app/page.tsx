'use client';

import React, { useState } from 'react';
import { DentisProvider, useDentis } from '@/context/DentisContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import OverviewView from '@/components/OverviewView';
import AppointmentsView from '@/components/AppointmentsView';
import { RekamMedisSection } from '@/components/sections/RekamMedisSection';
import DoctorsShiftsView from '@/components/DoctorsShiftsView';
import AnalyticsView from '@/components/AnalyticsView';
import SettingsView from '@/components/SettingsView';
import NewBookingModal from '@/components/NewBookingModal';
import PatientDetailModal from '@/components/PatientDetailModal';
import AddDoctorModal from '@/components/AddDoctorModal';
import EditDoctorModal from '@/components/EditDoctorModal';
import EditDoctorScheduleModal from '@/components/EditDoctorScheduleModal';
import SwapShiftModal from '@/components/SwapShiftModal';
import BranchSwitcherModal from '@/components/BranchSwitcherModal';
import LogoutConfirmModal from '@/components/LogoutConfirmModal';
import LockScreen from '@/components/LockScreen';
import ToastContainer from '@/components/ToastContainer';

function DashboardContent() {
  const { activeMenu, isLoggedOut } = useDentis();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F3F5F4] text-slate-800 antialiased font-sans">
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full lg:pl-64 overflow-x-hidden">
        <Header onOpenMobileMenu={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
          {activeMenu === 'overview' && <OverviewView />}
          {activeMenu === 'reservasi' && <AppointmentsView />}
          {activeMenu === 'rekam-medis' && <RekamMedisSection />}
          {activeMenu === 'dokter' && <DoctorsShiftsView />}
          {activeMenu === 'keuangan' && <AnalyticsView />}
          {activeMenu === 'pengaturan' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <NewBookingModal />
      <PatientDetailModal />
      <AddDoctorModal />
      <EditDoctorModal />
      <EditDoctorScheduleModal />
      <SwapShiftModal />
      <BranchSwitcherModal />
      <LogoutConfirmModal />
      <ToastContainer />

      {/* Logged Out / Lock Screen Overlay */}
      {isLoggedOut && <LockScreen />}
    </div>
  );
}

export default function Home() {
  return (
    <DentisProvider>
      <DashboardContent />
    </DentisProvider>
  );
}
