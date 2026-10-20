'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Doctor,
  DoctorWorkStatus,
  Patient,
  Appointment,
  PaymentMethod,
  PaymentStatus,
  ClinicService,
  ClinicSettings,
  AppointmentStatus,
  NavMenu,
  MedicalRecord,
  WebCMSState,
  WebHeroCMS,
  WebAboutCMS,
  WebFeaturedServiceCMS,
  WebBeforeAfterCMS,
  WebDoctorCardCMS,
  WebTestimonialCMS,
  WebFaqCMS,
  WebCtaBannerCMS,
  DayOfWeek,
  ShiftSession,
  ShiftSwapRecord,
  ClinicBranch,
  UserSession,
} from '@/types/dentis';
import {
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_SERVICES,
  INITIAL_SETTINGS,
  INITIAL_WEB_CMS,
  INITIAL_SHIFT_SWAPS,
} from '@/data/mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface DentisContextType {
  activeMenu: NavMenu;
  setActiveMenu: (menu: NavMenu) => void;
  activeDoctorTab: 'calendar' | 'roster' | 'swaps';
  setActiveDoctorTab: (tab: 'calendar' | 'roster' | 'swaps') => void;
  activeCmsTab: string;
  setActiveCmsTab: (tab: string) => void;
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  services: ClinicService[];
  settings: ClinicSettings;
  webCMS: WebCMSState;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
  removeToast: (id: string) => void;
  toggleDoctorAvailability: (doctorId: string) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
  updateAppointmentPayment: (
    appointmentId: string,
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus,
    paidAmount?: number
  ) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>, silent?: boolean) => Appointment;
  deleteAppointment: (appointmentId: string) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'records'>, silent?: boolean) => string;
  addMedicalRecord: (patientId: string, record: Omit<MedicalRecord, 'id'>) => void;
  updateService: (service: ClinicService) => void;
  addService: (service: Omit<ClinicService, 'id'>) => void;
  updateSettings: (newSettings: Partial<ClinicSettings>) => void;
  updateWebCMS: (newCMS: Partial<WebCMSState>) => void;
  updateHeroCMS: (heroData: Partial<WebHeroCMS>) => void;
  updateAboutCMS: (aboutData: Partial<WebAboutCMS>) => void;
  updateFeaturedService: (service: WebFeaturedServiceCMS) => void;
  addFeaturedService: (serviceData: Omit<WebFeaturedServiceCMS, 'id' | 'order'>) => void;
  deleteFeaturedService: (id: string) => void;
  updateBeforeAfter: (item: WebBeforeAfterCMS) => void;
  addBeforeAfter: (itemData: Omit<WebBeforeAfterCMS, 'id'>) => void;
  deleteBeforeAfter: (id: string) => void;
  updateDoctorCard: (doc: WebDoctorCardCMS) => void;
  updateTestimonial: (testi: WebTestimonialCMS) => void;
  addTestimonial: (testiData: Omit<WebTestimonialCMS, 'id' | 'date'>) => void;
  deleteTestimonial: (id: string) => void;
  updateFaq: (faq: WebFaqCMS) => void;
  addFaq: (faqData: Omit<WebFaqCMS, 'id' | 'order'>) => void;
  deleteFaq: (id: string) => void;
  updateCtaBannerCMS: (ctaData: Partial<WebCtaBannerCMS>) => void;
  resetDemoData: () => void;
  generateWhatsAppLink: (appointment: Appointment) => string;
  isNewBookingModalOpen: boolean;
  setIsNewBookingModalOpen: (open: boolean) => void;
  bookingInitialPatient: Patient | null;
  setBookingInitialPatient: (patient: Patient | null) => void;
  openBookingWithPatient: (patient: Patient) => void;
  selectedPatientForDetail: Patient | null;
  setSelectedPatientForDetail: (patient: Patient | null) => void;
  addDoctor: (doctor: Omit<Doctor, 'id' | 'activePatientsToday'>) => Doctor;
  updateDoctor: (doctor: Doctor) => void;
  deleteDoctor: (doctorId: string) => void;
  updateDoctorShifts: (doctorId: string, weeklyShifts: Record<DayOfWeek, ShiftSession[]>) => void;
  swapShift: (params: {
    day: DayOfWeek;
    session: ShiftSession;
    fromDoctorId: string;
    toDoctorId: string;
    type?: 'Ganti Shift' | 'Tukar Sesi';
    swapBackSession?: ShiftSession;
    reason: string;
    date?: string;
  }) => void;
  shiftSwapLogs: ShiftSwapRecord[];
  deleteShiftSwapLog: (id: string) => void;
  isAddDoctorModalOpen: boolean;
  setIsAddDoctorModalOpen: (open: boolean) => void;
  isSwapShiftModalOpen: boolean;
  setIsSwapShiftModalOpen: (open: boolean) => void;
  swapShiftInitialDoctorId: string | null;
  setSwapShiftInitialDoctorId: (id: string | null) => void;
  setDoctorWorkStatus: (doctorId: string, status: DoctorWorkStatus, note?: string) => void;
  editingDoctorForSchedule: Doctor | null;
  setEditingDoctorForSchedule: (doctor: Doctor | null) => void;
  editingDoctorForProfile: Doctor | null;
  setEditingDoctorForProfile: (doctor: Doctor | null) => void;
  branches: ClinicBranch[];
  currentBranch: ClinicBranch;
  setCurrentBranch: (branch: ClinicBranch) => void;
  switchBranch: (branchId: string) => void;
  currentUser: UserSession;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserSession>>;
  isLoggedOut: boolean;
  setIsLoggedOut: (loggedOut: boolean) => void;
  logout: () => void;
  login: (userData?: Partial<UserSession>) => void;
  isBranchModalOpen: boolean;
  setIsBranchModalOpen: (open: boolean) => void;
  isLogoutConfirmOpen: boolean;
  setIsLogoutConfirmOpen: (open: boolean) => void;
}

export const CLINIC_BRANCHES: ClinicBranch[] = [
  {
    id: 'senopati',
    name: 'Senopati',
    fullName: 'Dentis Senopati',
    location: 'Kebayoran Baru, Jakarta Selatan',
    address: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan 12190',
    phone: '+62 812-8899-7788',
  },
  {
    id: 'dharmawangsa',
    name: 'Dharmawangsa',
    fullName: 'Dentis Dharmawangsa (Aesthetic)',
    location: 'Kebayoran Baru, Jakarta Selatan',
    address: 'Jl. Dharmawangsa VI No. 12, Kebayoran Baru, Jakarta Selatan',
    phone: '+62 812-8899-7799',
  },
  {
    id: 'pondok-indah',
    name: 'Pondok Indah',
    fullName: 'Dentis Pondok Indah (Family Dental)',
    location: 'Pondok Indah, Jakarta Selatan',
    address: 'Plaza Pondok Indah 2 Blok B-14, Jakarta Selatan',
    phone: '+62 812-8899-7711',
  },
  {
    id: 'kelapa-gading',
    name: 'Kelapa Gading',
    fullName: 'Dentis Kelapa Gading (Digital Ortho)',
    location: 'Kelapa Gading, Jakarta Utara',
    address: 'Jl. Boulevard Barat Raya LC-6 No. 22, Jakarta Utara',
    phone: '+62 812-8899-7722',
  },
];

export const DEFAULT_USER: UserSession = {
  name: 'Siti Rahma',
  role: 'Resepsionis',
  initials: 'RS',
  email: 'reception.senopati@dentis.co.id',
};

const DentisContext = createContext<DentisContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DOCTORS: 'dentis_doctors_v4',
  PATIENTS: 'dentis_patients_v3',
  APPOINTMENTS: 'dentis_appointments_v3',
  SERVICES: 'dentis_services_v3',
  SETTINGS: 'dentis_settings_v3',
  WEB_CMS: 'dentis_web_cms_v4',
  SHIFT_SWAPS: 'dentis_shift_swaps_v1',
};

export function DentisProvider({ children }: { children: React.ReactNode }) {
  const [activeMenu, setActiveMenu] = useState<NavMenu>('overview');
  const [activeDoctorTab, setActiveDoctorTab] = useState<'calendar' | 'roster' | 'swaps'>('calendar');
  const [activeCmsTab, setActiveCmsTab] = useState<string>('hero');
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [services, setServices] = useState<ClinicService[]>(INITIAL_SERVICES);
  const [settings, setSettings] = useState<ClinicSettings>(INITIAL_SETTINGS);
  const [webCMS, setWebCMS] = useState<WebCMSState>(INITIAL_WEB_CMS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [shiftSwapLogs, setShiftSwapLogs] = useState<ShiftSwapRecord[]>(INITIAL_SHIFT_SWAPS);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isSwapShiftModalOpen, setIsSwapShiftModalOpen] = useState(false);
  const [swapShiftInitialDoctorId, setSwapShiftInitialDoctorId] = useState<string | null>(null);
  const [editingDoctorForSchedule, setEditingDoctorForSchedule] = useState<Doctor | null>(null);
  const [editingDoctorForProfile, setEditingDoctorForProfile] = useState<Doctor | null>(null);
  const [bookingInitialPatient, setBookingInitialPatient] = useState<Patient | null>(null);
  const [selectedPatientForDetail, setSelectedPatientForDetail] = useState<Patient | null>(null);
  const [currentBranch, setCurrentBranch] = useState<ClinicBranch>(CLINIC_BRANCHES[0]);
  const [currentUser, setCurrentUser] = useState<UserSession>(DEFAULT_USER);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState<boolean>(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const switchBranch = (branchId: string) => {
    const target = CLINIC_BRANCHES.find((b) => b.id === branchId) || CLINIC_BRANCHES[0];
    setCurrentBranch(target);
    setIsBranchModalOpen(false);
    addToast(
      'success',
      'Cabang Beralih',
      `Berhasil beralih ke ${target.fullName}. Data operasional disinkronkan.`
    );
  };

  const logout = () => {
    setIsLogoutConfirmOpen(false);
    setIsLoggedOut(true);
    addToast('info', 'Sesi Berakhir', 'Anda telah berhasil log out dari portal klinik.');
  };

  const login = (userData?: Partial<UserSession>) => {
    if (userData) {
      setCurrentUser((prev) => ({ ...prev, ...userData }));
    }
    setIsLoggedOut(false);
    addToast(
      'success',
      'Selamat Datang Kembali',
      `Sesi ${userData?.role || currentUser.role} (${currentBranch.name}) aktif kembali.`
    );
  };

  const openBookingWithPatient = (patient: Patient) => {
    setBookingInitialPatient(patient);
    setIsNewBookingModalOpen(true);
  };

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedDoctors = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      const storedPatients = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      const storedAppointments = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const storedWebCMS = localStorage.getItem(STORAGE_KEYS.WEB_CMS);

      if (storedDoctors) {
        const parsed = JSON.parse(storedDoctors);
        if (Array.isArray(parsed) && parsed.length >= 8) {
          const normalized = parsed.map((doc: Doctor) => {
            const defDoc = INITIAL_DOCTORS.find((d) => d.id === doc.id);
            const rawStatus = doc.workStatus || defDoc?.workStatus || (doc.isAvailableToday ? 'On-Duty' : 'Cuti');
            const cleanStatus: DoctorWorkStatus = rawStatus === 'Tidak Ada Shift' ? 'Off Day' : rawStatus;
            return {
              ...doc,
              workStatus: cleanStatus,
              statusNote: doc.statusNote || defDoc?.statusNote || (doc.isAvailableToday ? 'Shift Aktif' : 'Jadwal Off Day / Cuti'),
            };
          });
          setDoctors(normalized);
        } else {
          setDoctors(INITIAL_DOCTORS);
        }
      }
      if (storedPatients) setPatients(JSON.parse(storedPatients));
      if (storedAppointments) {
        const parsedApts = JSON.parse(storedAppointments);
        if (Array.isArray(parsedApts)) {
          setAppointments(
            parsedApts.map((a: Appointment) => ({
              ...a,
              paymentMethod: a.paymentMethod || (a.source === 'Web Leads' ? 'QRIS' : 'Kasir'),
              paymentStatus:
                a.paymentStatus ||
                (a.status === 'Selesai' ? 'Lunas' : a.status === 'Confirmed' ? 'DP' : 'Belum Bayar'),
              paidAmount:
                a.paidAmount ??
                (a.status === 'Selesai'
                  ? a.estimatedCost
                  : a.status === 'Confirmed'
                  ? Math.round(a.estimatedCost * 0.3)
                  : 0),
            }))
          );
        }
      }
      if (storedServices) setServices(JSON.parse(storedServices));
      if (storedSettings) setSettings(JSON.parse(storedSettings));
      if (storedWebCMS) {
        const parsedCMS = JSON.parse(storedWebCMS);
        if (parsedCMS && Array.isArray(parsedCMS.doctors) && parsedCMS.doctors.length >= 8) {
          setWebCMS(parsedCMS);
        } else {
          setWebCMS({
            ...INITIAL_WEB_CMS,
            ...parsedCMS,
            doctors: INITIAL_WEB_CMS.doctors,
          });
        }
      }
      const storedSwaps = localStorage.getItem(STORAGE_KEYS.SHIFT_SWAPS);
      if (storedSwaps) {
        const parsedSwaps = JSON.parse(storedSwaps);
        if (Array.isArray(parsedSwaps)) setShiftSwapLogs(parsedSwaps);
      }
    } catch (e) {
      console.warn('Gagal membaca data dari localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    } catch (e) {
      console.error(e);
    }
  }, [doctors, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    } catch (e) {
      console.error(e);
    }
  }, [patients, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.error(e);
    }
  }, [appointments, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.error(e);
    }
  }, [services, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.WEB_CMS, JSON.stringify(webCMS));
    } catch (e) {
      console.error(e);
    }
  }, [webCMS, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SHIFT_SWAPS, JSON.stringify(shiftSwapLogs));
    } catch (e) {
      console.error(e);
    }
  }, [shiftSwapLogs, isLoaded]);

  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const addToast = (type: 'success' | 'info' | 'warning', title: string, message: string = '') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts([{ id, type, title, message }]);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToasts([]);
    }, 3200);
  };

  const removeToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToasts([]);
  };

  const setDoctorWorkStatus = (doctorId: string, status: DoctorWorkStatus, note?: string) => {
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === doctorId) {
          const isAvail = status === 'On-Duty';
          const defaultNotes: Record<DoctorWorkStatus, string> = {
            'On-Duty': 'Shift Aktif Praktik Hari Ini',
            'Off Day': 'Jadwal Off Day • Libur Hari Ini',
            'Tidak Ada Shift': 'Jadwal Off Day • Libur Hari Ini',
            'Cuti': 'Sedang Cuti / Izin Klinis Resmi',
          };
          addToast(
            status === 'On-Duty' ? 'success' : status === 'Cuti' ? 'warning' : 'info',
            'Status Dokter Diperbarui',
            `${doc.name.split(',')[0]} sekarang: ${status === 'Tidak Ada Shift' ? 'Off Day' : status}`
          );
          return {
            ...doc,
            isAvailableToday: isAvail,
            workStatus: status === 'Tidak Ada Shift' ? 'Off Day' : status,
            statusNote: note || defaultNotes[status],
          };
        }
        return doc;
      })
    );
  };

  const toggleDoctorAvailability = (doctorId: string) => {
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === doctorId) {
          const current: DoctorWorkStatus = doc.workStatus || (doc.isAvailableToday ? 'On-Duty' : 'Cuti');
          let nextStatus: DoctorWorkStatus = 'On-Duty';
          if (current === 'On-Duty') nextStatus = 'Off Day';
          else if (current === 'Off Day' || current === 'Tidak Ada Shift') nextStatus = 'Cuti';
          else nextStatus = 'On-Duty';

          const isAvail = nextStatus === 'On-Duty';
          const defaultNotes: Record<DoctorWorkStatus, string> = {
            'On-Duty': 'Shift Aktif Praktik Hari Ini',
            'Off Day': 'Jadwal Off Day • Libur Hari Ini',
            'Tidak Ada Shift': 'Jadwal Off Day • Libur Hari Ini',
            'Cuti': 'Sedang Cuti / Izin Klinis Resmi',
          };
          addToast(
            nextStatus === 'On-Duty' ? 'success' : nextStatus === 'Cuti' ? 'warning' : 'info',
            'Status Dokter Diperbarui',
            `${doc.name.split(',')[0]} sekarang: ${nextStatus}`
          );
          return {
            ...doc,
            isAvailableToday: isAvail,
            workStatus: nextStatus,
            statusNote: defaultNotes[nextStatus],
          };
        }
        return doc;
      })
    );
  };

  const addDoctor = (doctorData: Omit<Doctor, 'id' | 'activePatientsToday'>): Doctor => {
    const newId = `DOC-${Math.floor(100 + Math.random() * 900)}`;
    const newDoctor: Doctor = {
      ...doctorData,
      id: newId,
      activePatientsToday: 0,
      isAvailableToday: doctorData.isAvailableToday ?? true,
      weeklyShifts: doctorData.weeklyShifts || {
        Senin: ['Pagi (10.00-13.00)'],
        Selasa: ['Pagi (10.00-13.00)'],
        Rabu: ['Pagi (10.00-13.00)'],
        Kamis: ['Pagi (10.00-13.00)'],
        Jumat: ['Pagi (10.00-13.00)'],
        Sabtu: [],
        Minggu: [],
      },
    };

    setDoctors((prev) => [...prev, newDoctor]);

    // Sinkronisasi otomatis ke CMS Landing Page
    setWebCMS((prev) => ({
      ...prev,
      doctors: [
        ...prev.doctors,
        {
          id: newId,
          name: newDoctor.name,
          title: newDoctor.title,
          specialty: newDoctor.specialty,
          avatarUrl: newDoctor.avatarUrl,
          isAvailableToday: newDoctor.isAvailableToday,
          rating: 4.9,
          reviewCount: 35,
          experience: newDoctor.experience || '5+ Tahun',
          isActive: true,
          order: prev.doctors.length + 1,
        },
      ],
    }));

    addToast('success', 'Dokter Baru Ditambahkan', `${newDoctor.name} telah berhasil terdaftar di tim medis klinik.`);
    return newDoctor;
  };

  const updateDoctor = (updatedDoctor: Doctor) => {
    setDoctors((prev) => prev.map((d) => (d.id === updatedDoctor.id ? updatedDoctor : d)));

    setWebCMS((prev) => ({
      ...prev,
      doctors: prev.doctors.map((d) =>
        d.id === updatedDoctor.id
          ? {
              ...d,
              name: updatedDoctor.name,
              title: updatedDoctor.title,
              specialty: updatedDoctor.specialty,
              avatarUrl: updatedDoctor.avatarUrl,
              isAvailableToday: updatedDoctor.isAvailableToday,
            }
          : d
      ),
    }));

    addToast('success', 'Profil Dokter Diperbarui', `Informasi ${updatedDoctor.name} berhasil disimpan.`);
  };

  const deleteDoctor = (doctorId: string) => {
    const target = doctors.find((d) => d.id === doctorId);
    setDoctors((prev) => prev.filter((d) => d.id !== doctorId));
    setWebCMS((prev) => ({
      ...prev,
      doctors: prev.doctors.filter((d) => d.id !== doctorId),
    }));
    addToast('info', 'Dokter Dihapus', `${target?.name || 'Dokter'} telah dihapus dari sistem klinik.`);
  };

  const updateDoctorShifts = (doctorId: string, weeklyShifts: Record<DayOfWeek, ShiftSession[]>) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, weeklyShifts } : d))
    );
    const target = doctors.find((d) => d.id === doctorId);
    addToast('success', 'Jadwal Shift Diperbarui', `Jadwal praktik untuk ${target?.name || 'Dokter'} berhasil disimpan.`);
  };

  const swapShift = ({
    day,
    session,
    fromDoctorId,
    toDoctorId,
    type = 'Ganti Shift',
    swapBackSession,
    reason,
    date,
  }: {
    day: DayOfWeek;
    session: ShiftSession;
    fromDoctorId: string;
    toDoctorId: string;
    type?: 'Ganti Shift' | 'Tukar Sesi';
    swapBackSession?: ShiftSession;
    reason: string;
    date?: string;
  }) => {
    const fromDoc = doctors.find((d) => d.id === fromDoctorId);
    const toDoc = doctors.find((d) => d.id === toDoctorId);

    if (!fromDoc || !toDoc) {
      addToast('warning', 'Pertukaran Shift Gagal', 'Data dokter tidak ditemukan.');
      return;
    }

    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === fromDoctorId) {
          // Remove session from fromDoctor
          let updatedShifts = (doc.weeklyShifts[day] || []).filter((s) => s !== session);
          // If mutual swap and swapBackSession specified, add swapBackSession to fromDoctor
          if (type === 'Tukar Sesi' && swapBackSession && !updatedShifts.includes(swapBackSession)) {
            updatedShifts = [...updatedShifts, swapBackSession];
          }
          return {
            ...doc,
            weeklyShifts: {
              ...doc.weeklyShifts,
              [day]: updatedShifts,
            },
          };
        }
        if (doc.id === toDoctorId) {
          // Add session to toDoctor
          let updatedShifts = [...(doc.weeklyShifts[day] || [])];
          if (!updatedShifts.includes(session)) {
            updatedShifts.push(session);
          }
          // If mutual swap and swapBackSession specified, remove swapBackSession from toDoctor
          if (type === 'Tukar Sesi' && swapBackSession) {
            updatedShifts = updatedShifts.filter((s) => s !== swapBackSession);
          }
          return {
            ...doc,
            weeklyShifts: {
              ...doc.weeklyShifts,
              [day]: updatedShifts,
            },
          };
        }
        return doc;
      })
    );

    const newSwapRecord: ShiftSwapRecord = {
      id: `SWAP-${Date.now().toString().slice(-4)}`,
      day,
      session,
      fromDoctorId: fromDoc.id,
      fromDoctorName: fromDoc.name,
      toDoctorId: toDoc.id,
      toDoctorName: toDoc.name,
      type,
      swapBackSession,
      reason: reason || 'Penyesuaian jadwal praktik klinik',
      date: date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
    };

    setShiftSwapLogs((prev) => [newSwapRecord, ...prev]);

    addToast(
      'success',
      'Tukar Shift Berhasil Disimpan',
      `${fromDoc.name.split(',')[0]} ⇄ ${toDoc.name.split(',')[0]} (${day} - ${session.split(' ')[0]})`
    );
  };

  const deleteShiftSwapLog = (id: string) => {
    setShiftSwapLogs((prev) => prev.filter((log) => log.id !== id));
    addToast('info', 'Catatan Dihapus', 'Riwayat pertukaran shift telah dihapus.');
  };

  const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          addToast('success', 'Status Janji Temu Diperbarui', `Status ${apt.patientName} diubah menjadi "${status}"`);
          return { ...apt, status };
        }
        return apt;
      })
    );
  };

  const updateAppointmentPayment = (
    appointmentId: string,
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus,
    paidAmount?: number
  ) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          const finalAmount =
            paidAmount ??
            (paymentStatus === 'Lunas'
              ? apt.estimatedCost
              : paymentStatus === 'DP'
              ? Math.round(apt.estimatedCost * 0.3)
              : 0);

          addToast(
            'success',
            'Pembayaran Diperbarui',
            `${apt.patientName}: ${paymentMethod} (${paymentStatus})`
          );
          return {
            ...apt,
            paymentMethod,
            paymentStatus,
            paidAmount: finalAmount,
          };
        }
        return apt;
      })
    );
  };

  const addAppointment = (newAptData: Omit<Appointment, 'id'>, silent = false): Appointment => {
    const newId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalMethod: PaymentMethod = newAptData.paymentMethod || 'Kasir';
    const finalStatus: PaymentStatus = newAptData.paymentStatus || 'Belum Bayar';
    const finalPaid =
      newAptData.paidAmount ??
      (finalStatus === 'Lunas'
        ? newAptData.estimatedCost
        : finalStatus === 'DP'
        ? Math.round(newAptData.estimatedCost * 0.3)
        : 0);

    const newAppointment: Appointment = {
      ...newAptData,
      id: newId,
      paymentMethod: finalMethod,
      paymentStatus: finalStatus,
      paidAmount: finalPaid,
    };
    setAppointments((prev) => [newAppointment, ...prev]);

    // Check if patient exists, if not create or update visits
    const existingPatient = patients.find(
      (p) => p.phone === newAptData.phone || p.name.toLowerCase() === newAptData.patientName.toLowerCase()
    );

    if (!existingPatient) {
      const newPatientId = `DNT-MR-${Math.floor(1000 + Math.random() * 9000)}`;
      const newPatient: Patient = {
        id: newPatientId,
        name: newAptData.patientName,
        phone: newAptData.phone,
        gender: 'Perempuan',
        isNewPatient: true,
        totalVisits: 1,
        lastVisitDate: newAptData.date,
        records: [],
      };
      setPatients((prev) => [newPatient, ...prev]);
    } else {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === existingPatient.id
            ? { ...p, totalVisits: p.totalVisits + 1, lastVisitDate: newAptData.date }
            : p
        )
      );
    }

    if (!silent) {
      addToast('success', 'Reservasi Berhasil Disimpan', `${newAptData.patientName} (${newAptData.treatment})`);
    }
    return newAppointment;
  };

  const deleteAppointment = (appointmentId: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
    addToast('info', 'Reservasi Dihapus', 'Data reservasi telah dihapus.');
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'records'>, silent = false) => {
    const newId = `DNT-MR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      records: [],
    };
    setPatients((prev) => [newPatient, ...prev]);
    if (!silent) {
      addToast('success', 'Pasien Baru Terdaftar', `${patientData.name} (${newId})`);
    }
    return newId;
  };

  const addMedicalRecord = (patientId: string, recordData: Omit<MedicalRecord, 'id'>) => {
    const recordId = `REC-${Date.now().toString().slice(-4)}`;
    const newRecord: MedicalRecord = {
      ...recordData,
      id: recordId,
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          const updated = {
            ...p,
            totalVisits: p.totalVisits + 1,
            lastVisitDate: recordData.date,
            records: [newRecord, ...p.records],
          };
          if (selectedPatientForDetail?.id === patientId) {
            setSelectedPatientForDetail(updated);
          }
          return updated;
        }
        return p;
      })
    );
    addToast('success', 'Catatan Medis Ditambahkan', `Rekam medis baru berhasil dicatat untuk pasien.`);
  };

  const updateService = (updated: ClinicService) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    addToast('success', 'Tarif Layanan Disimpan', `Informasi layanan ${updated.name} berhasil diperbarui.`);
  };

  const addService = (newServiceData: Omit<ClinicService, 'id'>) => {
    const newId = `SRV-0${services.length + 1}`;
    const newService: ClinicService = { ...newServiceData, id: newId };
    setServices((prev) => [...prev, newService]);
    addToast('success', 'Layanan Baru Ditambahkan', `${newService.name} kini aktif di master layanan.`);
  };

  const updateSettings = (newSettings: Partial<ClinicSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('success', 'Pengaturan Berhasil Disimpan', 'Konfigurasi klinik & teks web Dentis telah diperbarui.');
  };

  const updateWebCMS = (newCMS: Partial<WebCMSState>) => {
    setWebCMS((prev) => ({ ...prev, ...newCMS }));
    addToast('success', 'CMS Web Disimpan', 'Konten website klinik Dentis berhasil diperbarui.');
  };

  const updateHeroCMS = (heroData: Partial<WebHeroCMS>) => {
    setWebCMS((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...heroData },
    }));
    addToast('success', 'Hero Section Disimpan', 'Copywriting & visual Hero berhasil diperbarui.');
  };

  const updateAboutCMS = (aboutData: Partial<WebAboutCMS>) => {
    setWebCMS((prev) => ({
      ...prev,
      about: { ...prev.about, ...aboutData },
    }));
    addToast('success', 'Tentang Kami Disimpan', 'Konten profil & statistik klinik diperbarui.');
  };

  const updateFeaturedService = (service: WebFeaturedServiceCMS) => {
    setWebCMS((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === service.id ? service : s)),
    }));
    addToast('success', 'Layanan Web Disimpan', `Kartu layanan ${service.title} berhasil diperbarui.`);
  };

  const addFeaturedService = (serviceData: Omit<WebFeaturedServiceCMS, 'id' | 'order'>) => {
    const newService: WebFeaturedServiceCMS = {
      ...serviceData,
      id: `srv-feat-${Date.now()}`,
      order: webCMS.services.length + 1,
    };
    setWebCMS((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
    addToast('success', 'Layanan Web Ditambahkan', `${newService.title} berhasil ditampilkan di web.`);
  };

  const deleteFeaturedService = (id: string) => {
    setWebCMS((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
    addToast('info', 'Layanan Dihapus', 'Layanan dihapus dari tampilan website.');
  };

  const updateBeforeAfter = (item: WebBeforeAfterCMS) => {
    setWebCMS((prev) => ({
      ...prev,
      beforeAfter: prev.beforeAfter.map((ba) => (ba.id === item.id ? item : ba)),
    }));
    addToast('success', 'Hasil Perawatan Disimpan', `Kasus klinis ${item.title} berhasil diperbarui.`);
  };

  const addBeforeAfter = (itemData: Omit<WebBeforeAfterCMS, 'id'>) => {
    const newItem: WebBeforeAfterCMS = {
      ...itemData,
      id: `ba-${Date.now()}`,
    };
    setWebCMS((prev) => ({
      ...prev,
      beforeAfter: [...prev.beforeAfter, newItem],
    }));
    addToast('success', 'Kasus Klinis Ditambahkan', `${newItem.title} kini tampil di galeri web.`);
  };

  const deleteBeforeAfter = (id: string) => {
    setWebCMS((prev) => ({
      ...prev,
      beforeAfter: prev.beforeAfter.filter((ba) => ba.id !== id),
    }));
    addToast('info', 'Kasus Klinis Dihapus', 'Dokumentasi kasus klinis dihapus dari galeri.');
  };

  const updateDoctorCard = (doc: WebDoctorCardCMS) => {
    setWebCMS((prev) => ({
      ...prev,
      doctors: prev.doctors.map((d) => (d.id === doc.id ? doc : d)),
    }));
    addToast('success', 'Profil Dokter Web Disimpan', `Kartu ${doc.name} berhasil diperbarui.`);
  };

  const updateTestimonial = (testi: WebTestimonialCMS) => {
    setWebCMS((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) => (t.id === testi.id ? testi : t)),
    }));
    addToast('success', 'Testimoni Disimpan', `Ulasan dari ${testi.patientName} berhasil diperbarui.`);
  };

  const addTestimonial = (testiData: Omit<WebTestimonialCMS, 'id' | 'date'>) => {
    const newTesti: WebTestimonialCMS = {
      ...testiData,
      id: `testi-${Date.now()}`,
      date: 'Hari ini',
    };
    setWebCMS((prev) => ({
      ...prev,
      testimonials: [newTesti, ...prev.testimonials],
    }));
    addToast('success', 'Testimoni Baru Ditambahkan', `Ulasan dari ${newTesti.patientName} berhasil ditambahkan.`);
  };

  const deleteTestimonial = (id: string) => {
    setWebCMS((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id),
    }));
    addToast('info', 'Testimoni Dihapus', 'Ulasan pasien dihapus dari landing page.');
  };

  const updateFaq = (faq: WebFaqCMS) => {
    setWebCMS((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f) => (f.id === faq.id ? faq : f)),
    }));
    addToast('success', 'FAQ Disimpan', 'Pertanyaan FAQ berhasil diperbarui.');
  };

  const addFaq = (faqData: Omit<WebFaqCMS, 'id' | 'order'>) => {
    const newFaq: WebFaqCMS = {
      ...faqData,
      id: `faq-${Date.now()}`,
      order: webCMS.faqs.length + 1,
    };
    setWebCMS((prev) => ({
      ...prev,
      faqs: [...prev.faqs, newFaq],
    }));
    addToast('success', 'FAQ Baru Ditambahkan', 'Pertanyaan baru berhasil ditambahkan ke web.');
  };

  const deleteFaq = (id: string) => {
    setWebCMS((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((f) => f.id !== id),
    }));
    addToast('info', 'FAQ Dihapus', 'Pertanyaan dihapus dari daftar FAQ website.');
  };

  const updateCtaBannerCMS = (ctaData: Partial<WebCtaBannerCMS>) => {
    setWebCMS((prev) => ({
      ...prev,
      ctaBanner: { ...prev.ctaBanner, ...ctaData },
    }));
    addToast('success', 'CTA Banner Disimpan', 'Banner penutup website berhasil diperbarui.');
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.DOCTORS);
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.WEB_CMS);

    setDoctors(INITIAL_DOCTORS);
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setServices(INITIAL_SERVICES);
    setSettings(INITIAL_SETTINGS);
    setWebCMS(INITIAL_WEB_CMS);
    setShiftSwapLogs(INITIAL_SHIFT_SWAPS);

    addToast('info', 'Demo Data Direset', 'Semua data telah dikembalikan ke kondisi awal bawaan klinik Dentis.');
  };

  const generateWhatsAppLink = (apt: Appointment): string => {
    const cleanPhone = apt.phone.startsWith('0')
      ? '62' + apt.phone.slice(1)
      : apt.phone.startsWith('+62')
      ? apt.phone.replace('+', '')
      : apt.phone;

    const paymentInfo = apt.paymentMethod
      ? `\n💳 Metode Pembayaran: *${apt.paymentMethod}* (${apt.paymentStatus || 'Belum Bayar'})`
      : '';

    const message = `Halo ${apt.patientName}, kami dari *${settings.clinicName}* ingin mengonfirmasi jadwal kunjungan perawatan *${apt.treatment}* Anda pada:\n\n📅 Tanggal: *${apt.date}*\n⏰ Jam: *${apt.sessionTime}*\n👨‍⚕️ Dokter: *${apt.doctorName}*${paymentInfo}\n📍 Lokasi: ${settings.address}\n\nMohon konfirmasi kedatangan Anda dengan membalas pesan ini ya. Jika ada pertanyaan, kami siap membantu. Terima kasih! 🙏🦷`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <DentisContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        activeDoctorTab,
        setActiveDoctorTab,
        activeCmsTab,
        setActiveCmsTab,
        doctors,
        patients,
        appointments,
        services,
        settings,
        webCMS,
        toasts,
        addToast,
        removeToast,
        toggleDoctorAvailability,
        updateAppointmentStatus,
        updateAppointmentPayment,
        addAppointment,
        deleteAppointment,
        addPatient,
        addMedicalRecord,
        updateService,
        addService,
        updateSettings,
        updateWebCMS,
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
        resetDemoData,
        generateWhatsAppLink,
        isNewBookingModalOpen,
        setIsNewBookingModalOpen,
        bookingInitialPatient,
        setBookingInitialPatient,
        openBookingWithPatient,
        selectedPatientForDetail,
        setSelectedPatientForDetail,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        updateDoctorShifts,
        swapShift,
        shiftSwapLogs,
        deleteShiftSwapLog,
        isAddDoctorModalOpen,
        setIsAddDoctorModalOpen,
        isSwapShiftModalOpen,
        setIsSwapShiftModalOpen,
        swapShiftInitialDoctorId,
        setSwapShiftInitialDoctorId,
        setDoctorWorkStatus,
        editingDoctorForSchedule,
        setEditingDoctorForSchedule,
        editingDoctorForProfile,
        setEditingDoctorForProfile,
        branches: CLINIC_BRANCHES,
        currentBranch,
        setCurrentBranch,
        switchBranch,
        currentUser,
        setCurrentUser,
        isLoggedOut,
        setIsLoggedOut,
        logout,
        login,
        isBranchModalOpen,
        setIsBranchModalOpen,
        isLogoutConfirmOpen,
        setIsLogoutConfirmOpen,
      }}
    >
      {children}
    </DentisContext.Provider>
  );
}

export function useDentis() {
  const context = useContext(DentisContext);
  if (!context) {
    throw new Error('useDentis must be used within a DentisProvider');
  }
  return context;
}
