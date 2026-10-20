'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useDentis } from '@/context/DentisContext';
import { DayOfWeek, ShiftSession, Doctor, DoctorWorkStatus } from '@/types/dentis';
import {
  Users,
  Stethoscope,
  Clock,
  ArrowLeftRight,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  CheckCircle2,
  Edit3,
  CalendarClock,
  Search,
  History,
  Trash2,
  MapPin,
  X,
  Check,
  Sun,
  Sunset,
  Moon,
  GripVertical,
  CalendarPlus,
  Sparkles,
  Info,
} from 'lucide-react';

type CalendarViewMode = 'day' | 'week' | 'month';
type MainNavTab = 'calendar' | 'roster' | 'swaps';

interface ScheduleEvent {
  id: string;
  title: string;
  doctorId?: string;
  doctorName: string;
  doctorTitle: string;
  doctorAvatar: string;
  dayIndex: number; // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  dayName: DayOfWeek;
  dateStr: string; // e.g. '2026-10-20'
  startHour: number; // e.g. 9 for 09:00, 10.5 for 10:30
  endHour: number; // e.g. 11.5 for 11:30
  timeLabel: string; // e.g. '09:30 - 10:45 WIB'
  accentColor: string;
  unit: string;
  sessionCategory: 'Pagi' | 'Siang' | 'Malam';
}

interface DayInfo {
  day: string;
  date: string;
  fullDay: DayOfWeek;
  fullDate: string;
  isToday?: boolean;
}

interface WeekData {
  label: string;
  isCurrent?: boolean;
  days: DayInfo[];
}

const WEEKS_DATA: WeekData[] = [
  {
    label: '11 - 17 Oktober 2026',
    days: [
      { day: 'Min', date: '11', fullDay: 'Minggu', fullDate: '2026-10-11' },
      { day: 'Sen', date: '12', fullDay: 'Senin', fullDate: '2026-10-12' },
      { day: 'Sel', date: '13', fullDay: 'Selasa', fullDate: '2026-10-13' },
      { day: 'Rab', date: '14', fullDay: 'Rabu', fullDate: '2026-10-14' },
      { day: 'Kam', date: '15', fullDay: 'Kamis', fullDate: '2026-10-15' },
      { day: 'Jum', date: '16', fullDay: 'Jumat', fullDate: '2026-10-16' },
      { day: 'Sab', date: '17', fullDay: 'Sabtu', fullDate: '2026-10-17' },
    ],
  },
  {
    label: '18 - 24 Oktober 2026',
    isCurrent: true,
    days: [
      { day: 'Min', date: '18', fullDay: 'Minggu', fullDate: '2026-10-18' },
      { day: 'Sen', date: '19', fullDay: 'Senin', fullDate: '2026-10-19' },
      { day: 'Sel', date: '20', fullDay: 'Selasa', fullDate: '2026-10-20', isToday: true },
      { day: 'Rab', date: '21', fullDay: 'Rabu', fullDate: '2026-10-21' },
      { day: 'Kam', date: '22', fullDay: 'Kamis', fullDate: '2026-10-22' },
      { day: 'Jum', date: '23', fullDay: 'Jumat', fullDate: '2026-10-23' },
      { day: 'Sab', date: '24', fullDay: 'Sabtu', fullDate: '2026-10-24' },
    ],
  },
  {
    label: '25 - 31 Oktober 2026',
    days: [
      { day: 'Min', date: '25', fullDay: 'Minggu', fullDate: '2026-10-25' },
      { day: 'Sen', date: '26', fullDay: 'Senin', fullDate: '2026-10-26' },
      { day: 'Sel', date: '27', fullDay: 'Selasa', fullDate: '2026-10-27' },
      { day: 'Rab', date: '28', fullDay: 'Rabu', fullDate: '2026-10-28' },
      { day: 'Kam', date: '29', fullDay: 'Kamis', fullDate: '2026-10-29' },
      { day: 'Jum', date: '30', fullDay: 'Jumat', fullDate: '2026-10-30' },
      { day: 'Sab', date: '31', fullDay: 'Sabtu', fullDate: '2026-10-31' },
    ],
  },
];

const TIME_SLOTS = [
  { hour: 8, label: '08:00 WIB' },
  { hour: 9, label: '09:00 WIB' },
  { hour: 10, label: '10:00 WIB' },
  { hour: 11, label: '11:00 WIB' },
  { hour: 12, label: '12:00 WIB' },
  { hour: 13, label: '13:00 WIB' },
  { hour: 14, label: '14:00 WIB' },
  { hour: 15, label: '15:00 WIB' },
  { hour: 16, label: '16:00 WIB' },
  { hour: 17, label: '17:00 WIB' },
  { hour: 18, label: '18:00 WIB' },
  { hour: 19, label: '19:00 WIB' },
  { hour: 20, label: '20:00 WIB' },
];

const MONTHS_CONFIG = [
  { name: 'September 2026', daysCount: 30, startBlank: 2, offset: -1 },
  { name: 'Oktober 2026', daysCount: 31, startBlank: 4, offset: 0 },
  { name: 'November 2026', daysCount: 30, startBlank: 0, offset: 1 },
];

const INITIAL_SCHEDULE_EVENTS: ScheduleEvent[] = [
  // Sunday 18
  {
    id: 'SCH-001',
    title: 'Pemeriksaan Periodonsia & Gusi',
    doctorName: 'drg. Amanda Lestari, Sp.Perio',
    doctorTitle: 'Spesialis Periodonsia & Gusi',
    doctorAvatar: '/doctors/drg-amanda.jpg',
    dayIndex: 0,
    dayName: 'Minggu',
    dateStr: '2026-10-18',
    startHour: 10,
    endHour: 11.5,
    timeLabel: '10:00 - 11:30 WIB',
    accentColor: '#10B981',
    unit: 'Dental Unit 03',
    sessionCategory: 'Pagi',
  },
  {
    id: 'SCH-002',
    title: 'Kontrol Pasang Behel Ortodonti',
    doctorName: 'drg. Arya Pratama, Sp.Ort',
    doctorTitle: 'Spesialis Ortodonsia',
    doctorAvatar: '/doctors/drg-arya.jpg',
    dayIndex: 0,
    dayName: 'Minggu',
    dateStr: '2026-10-18',
    startHour: 14,
    endHour: 15.5,
    timeLabel: '14:00 - 15:30 WIB',
    accentColor: '#EC4899',
    unit: 'Dental Unit 01',
    sessionCategory: 'Siang',
  },

  // Monday 19
  {
    id: 'SCH-101',
    title: 'Fluoridasi & Perawatan Gigi Anak',
    doctorName: 'drg. Clarissa Maharani, Sp.KGA',
    doctorTitle: 'Spesialis Gigi Anak',
    doctorAvatar: '/doctors/drg-clarissa.jpg',
    dayIndex: 1,
    dayName: 'Senin',
    dateStr: '2026-10-19',
    startHour: 9.5,
    endHour: 10.75,
    timeLabel: '09:30 - 10:45 WIB',
    accentColor: '#0284C7',
    unit: 'Dental Unit 04',
    sessionCategory: 'Pagi',
  },
  {
    id: 'SCH-102',
    title: 'Bedah Implan & Odontektomi',
    doctorName: 'drg. Dimas Wicaksono, Sp.BMM',
    doctorTitle: 'Spesialis Bedah Mulut',
    doctorAvatar: '/doctors/drg-dimas.jpg',
    dayIndex: 1,
    dayName: 'Senin',
    dateStr: '2026-10-19',
    startHour: 13,
    endHour: 14.5,
    timeLabel: '13:00 - 14:30 WIB',
    accentColor: '#0D5966',
    unit: 'Kamar Bedah Minor',
    sessionCategory: 'Siang',
  },
  {
    id: 'SCH-103',
    title: 'Endodonsia Perawatan Saluran Gigi',
    doctorName: 'drg. Rizky Fauzi, Sp.KG',
    doctorTitle: 'Spesialis Endodonsia',
    doctorAvatar: '/doctors/drg-rizky.jpg',
    dayIndex: 1,
    dayName: 'Senin',
    dateStr: '2026-10-19',
    startHour: 18,
    endHour: 19.5,
    timeLabel: '18:00 - 19:30 WIB',
    accentColor: '#16A34A',
    unit: 'Dental Unit 02',
    sessionCategory: 'Malam',
  },

  // Tuesday 20 (Hari Ini)
  {
    id: 'SCH-201',
    title: 'In-Office Laser Teeth Whitening',
    doctorName: 'drg. Nabila Putri, Sp.KG',
    doctorTitle: 'Konservasi & Estetika',
    doctorAvatar: '/doctors/drg-nabila.jpg',
    dayIndex: 2,
    dayName: 'Selasa',
    dateStr: '2026-10-20',
    startHour: 10,
    endHour: 11.5,
    timeLabel: '10:00 - 11:30 WIB',
    accentColor: '#A855F7',
    unit: 'Dental Unit 02',
    sessionCategory: 'Pagi',
  },
  {
    id: 'SCH-202',
    title: 'Konsultasi Aligner & Cetak Digital',
    doctorName: 'drg. Arya Pratama, Sp.Ort',
    doctorTitle: 'Spesialis Ortodonsia',
    doctorAvatar: '/doctors/drg-arya.jpg',
    dayIndex: 2,
    dayName: 'Selasa',
    dateStr: '2026-10-20',
    startHour: 14,
    endHour: 15.5,
    timeLabel: '14:00 - 15:30 WIB',
    accentColor: '#EC4899',
    unit: 'Dental Unit 01',
    sessionCategory: 'Siang',
  },
  {
    id: 'SCH-203',
    title: 'Evaluasi Pasca Odontektomi',
    doctorName: 'drg. Dimas Wicaksono, Sp.BMM',
    doctorTitle: 'Spesialis Bedah Mulut',
    doctorAvatar: '/doctors/drg-dimas.jpg',
    dayIndex: 2,
    dayName: 'Selasa',
    dateStr: '2026-10-20',
    startHour: 17.5,
    endHour: 19,
    timeLabel: '17:30 - 19:00 WIB',
    accentColor: '#0D5966',
    unit: 'Kamar Bedah Minor',
    sessionCategory: 'Malam',
  },

  // Wednesday 21
  {
    id: 'SCH-301',
    title: 'Prostodonsia Crown & Veneer E-Max',
    doctorName: 'drg. Kevin Sanjaya, Sp.Pros',
    doctorTitle: 'Spesialis Prostodonsia',
    doctorAvatar: '/doctors/drg-kevin.jpg',
    dayIndex: 3,
    dayName: 'Rabu',
    dateStr: '2026-10-21',
    startHour: 9,
    endHour: 10.75,
    timeLabel: '09:00 - 10:45 WIB',
    accentColor: '#0EA5E9',
    unit: 'Dental Unit 03',
    sessionCategory: 'Pagi',
  },
  {
    id: 'SCH-302',
    title: 'Space Maintainer Pediatrik',
    doctorName: 'drg. Siti Rahmawati, Sp.KGA',
    doctorTitle: 'Spesialis Gigi Anak',
    doctorAvatar: '/doctors/drg-siti.jpg',
    dayIndex: 3,
    dayName: 'Rabu',
    dateStr: '2026-10-21',
    startHour: 14,
    endHour: 15.5,
    timeLabel: '14:00 - 15:30 WIB',
    accentColor: '#F59E0B',
    unit: 'Dental Unit 04',
    sessionCategory: 'Siang',
  },
  {
    id: 'SCH-303',
    title: 'Restorasi Estetik Nanokomposit',
    doctorName: 'drg. Nabila Putri, Sp.KG',
    doctorTitle: 'Konservasi & Estetika',
    doctorAvatar: '/doctors/drg-nabila.jpg',
    dayIndex: 3,
    dayName: 'Rabu',
    dateStr: '2026-10-21',
    startHour: 18,
    endHour: 19.5,
    timeLabel: '18:00 - 19:30 WIB',
    accentColor: '#A855F7',
    unit: 'Dental Unit 02',
    sessionCategory: 'Malam',
  },

  // Thursday 22
  {
    id: 'SCH-401',
    title: 'Operasi Minor Flap Periodontal',
    doctorName: 'drg. Amanda Lestari, Sp.Perio',
    doctorTitle: 'Spesialis Periodonsia',
    doctorAvatar: '/doctors/drg-amanda.jpg',
    dayIndex: 4,
    dayName: 'Kamis',
    dateStr: '2026-10-22',
    startHour: 8.5,
    endHour: 10,
    timeLabel: '08:30 - 10:00 WIB',
    accentColor: '#22C55E',
    unit: 'Dental Unit 02',
    sessionCategory: 'Pagi',
  },
  {
    id: 'SCH-402',
    title: 'Restorasi Gigi Kosmetik Anterior',
    doctorName: 'drg. Nabila Putri, Sp.KG',
    doctorTitle: 'Konservasi & Estetika',
    doctorAvatar: '/doctors/drg-nabila.jpg',
    dayIndex: 4,
    dayName: 'Kamis',
    dateStr: '2026-10-22',
    startHour: 14,
    endHour: 15.5,
    timeLabel: '14:00 - 15:30 WIB',
    accentColor: '#A855F7',
    unit: 'Dental Unit 02',
    sessionCategory: 'Siang',
  },
  {
    id: 'SCH-403',
    title: 'Pemasangan Denture Fleksibel',
    doctorName: 'drg. Kevin Sanjaya, Sp.Pros',
    doctorTitle: 'Spesialis Prostodonsia',
    doctorAvatar: '/doctors/drg-kevin.jpg',
    dayIndex: 4,
    dayName: 'Kamis',
    dateStr: '2026-10-22',
    startHour: 18,
    endHour: 19.5,
    timeLabel: '18:00 - 19:30 WIB',
    accentColor: '#0EA5E9',
    unit: 'Dental Unit 03',
    sessionCategory: 'Malam',
  },

  // Friday 23
  {
    id: 'SCH-501',
    title: 'Perawatan Saluran Akar Endodonsia',
    doctorName: 'drg. Rizky Fauzi, Sp.KG',
    doctorTitle: 'Spesialis Endodonsia',
    doctorAvatar: '/doctors/drg-rizky.jpg',
    dayIndex: 5,
    dayName: 'Jumat',
    dateStr: '2026-10-23',
    startHour: 10.5,
    endHour: 12.25,
    timeLabel: '10:30 - 12:15 WIB',
    accentColor: '#16A34A',
    unit: 'Dental Unit 04',
    sessionCategory: 'Pagi',
  },
  {
    id: 'SCH-502',
    title: 'Pencabutan Gigi Bungsu M3 Impaksi',
    doctorName: 'drg. Dimas Wicaksono, Sp.BMM',
    doctorTitle: 'Spesialis Bedah Mulut',
    doctorAvatar: '/doctors/drg-dimas.jpg',
    dayIndex: 5,
    dayName: 'Jumat',
    dateStr: '2026-10-23',
    startHour: 14,
    endHour: 15.5,
    timeLabel: '14:00 - 15:30 WIB',
    accentColor: '#0D5966',
    unit: 'Kamar Bedah Minor',
    sessionCategory: 'Siang',
  },
  {
    id: 'SCH-503',
    title: 'Aktivasi Self-Ligating Braces',
    doctorName: 'drg. Arya Pratama, Sp.Ort',
    doctorTitle: 'Spesialis Ortodonsia',
    doctorAvatar: '/doctors/drg-arya.jpg',
    dayIndex: 5,
    dayName: 'Jumat',
    dateStr: '2026-10-23',
    startHour: 18,
    endHour: 19.5,
    timeLabel: '18:00 - 19:30 WIB',
    accentColor: '#EC4899',
    unit: 'Dental Unit 01',
    sessionCategory: 'Malam',
  },

  // Saturday 24
  {
    id: 'SCH-601',
    title: 'Klinik Gigi Anak Akhir Pekan',
    doctorName: 'drg. Clarissa Maharani, Sp.KGA',
    doctorTitle: 'Spesialis Kedokteran Gigi Anak',
    doctorAvatar: '/doctors/drg-clarissa.jpg',
    dayIndex: 6,
    dayName: 'Sabtu',
    dateStr: '2026-10-24',
    startHour: 10,
    endHour: 12,
    timeLabel: '10:00 - 12:00 WIB',
    accentColor: '#F59E0B',
    unit: 'Dental Unit 04',
    sessionCategory: 'Pagi',
  },
  {
    id: 'SCH-602',
    title: 'Pulpotomi & Restorasi Gigi Susu',
    doctorName: 'drg. Siti Rahmawati, Sp.KGA',
    doctorTitle: 'Spesialis Gigi Anak',
    doctorAvatar: '/doctors/drg-siti.jpg',
    dayIndex: 6,
    dayName: 'Sabtu',
    dateStr: '2026-10-24',
    startHour: 13.5,
    endHour: 15,
    timeLabel: '13:30 - 15:00 WIB',
    accentColor: '#F59E0B',
    unit: 'Dental Unit 04',
    sessionCategory: 'Siang',
  },
  {
    id: 'SCH-603',
    title: 'Ultrasonic Scaling & Polishing',
    doctorName: 'drg. Amanda Lestari, Sp.Perio',
    doctorTitle: 'Spesialis Periodonsia & Gusi',
    doctorAvatar: '/doctors/drg-amanda.jpg',
    dayIndex: 6,
    dayName: 'Sabtu',
    dateStr: '2026-10-24',
    startHour: 17.5,
    endHour: 19,
    timeLabel: '17:30 - 19:00 WIB',
    accentColor: '#10B981',
    unit: 'Dental Unit 03',
    sessionCategory: 'Malam',
  },
];

const PROCEDURE_PRESETS = [
  { title: 'Pembersihan Karang Gigi (Scalling)', color: '#10B981', unit: 'Dental Unit 03' },
  { title: 'Konsultasi Aligner & Cetak Digital', color: '#EC4899', unit: 'Dental Unit 01' },
  { title: 'Bedah Implan & Odontektomi', color: '#0D5966', unit: 'Kamar Bedah Minor' },
  { title: 'In-Office Laser Teeth Whitening', color: '#A855F7', unit: 'Dental Unit 02' },
  { title: 'Perawatan Saluran Akar Endodonsia', color: '#16A34A', unit: 'Dental Unit 04' },
  { title: 'Fluoridasi & Perawatan Gigi Anak', color: '#0284C7', unit: 'Dental Unit 04' },
  { title: 'Prostodonsia Crown & Veneer E-Max', color: '#0EA5E9', unit: 'Dental Unit 03' },
  { title: 'Restorasi Estetik Nanokomposit', color: '#F59E0B', unit: 'Dental Unit 02' },
];

export default function DoctorsShiftsView() {
  const {
    doctors,
    toggleDoctorAvailability,
    setDoctorWorkStatus,
    shiftSwapLogs,
    deleteShiftSwapLog,
    setIsAddDoctorModalOpen,
    setIsSwapShiftModalOpen,
    setSwapShiftInitialDoctorId,
    setEditingDoctorForSchedule,
    setEditingDoctorForProfile,
    activeDoctorTab,
    setActiveDoctorTab,
    addToast,
  } = useDentis();

  // Navigation & View Mode State (Synchronized with Sidebar)
  const activeNavTab = activeDoctorTab;
  const setActiveNavTab = setActiveDoctorTab;
  const [calendarView, setCalendarView] = useState<CalendarViewMode>('week');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('all');
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(INITIAL_SCHEDULE_EVENTS);

  // Dynamic Date Navigation State (Day, Week, Month)
  const [activeWeekIndex, setActiveWeekIndex] = useState(1); // 18 - 24 Okt (current)
  const [activeDayColIndex, setActiveDayColIndex] = useState(2); // Selasa (today)
  const [monthOffset, setMonthOffset] = useState(0); // -1: Sep, 0: Okt, 1: Nov

  // Drag and Drop state for Kanban
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [dragOverSession, setDragOverSession] = useState<'Pagi' | 'Siang' | 'Malam' | null>(null);

  // Selected event for detail popup
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  // Add Schedule Modal state
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);
  const [scheduleFormData, setScheduleFormData] = useState({
    doctorId: doctors[0]?.id || '',
    dayIndex: 2,
    sessionCategory: 'Pagi' as 'Pagi' | 'Siang' | 'Malam',
    startHour: 9,
    endHour: 10.5,
    title: 'Pembersihan Karang Gigi (Scalling)',
    unit: 'Dental Unit 01',
    accentColor: '#10B981',
  });

  // Search & Filter in Roster tab (all, onduty, offduty / tidak ada shift, cuti)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'onduty' | 'offduty' | 'cuti'>('all');

  const currentWeek = WEEKS_DATA[activeWeekIndex] || WEEKS_DATA[1];
  const activeDayObj = currentWeek.days[activeDayColIndex] || currentWeek.days[2];
  const currentMonthData =
    MONTHS_CONFIG.find((m) => m.offset === monthOffset) || MONTHS_CONFIG[1];

  // Helper to determine accurate doctor status
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

  // Calculate Metrics
  const onDutyCount = onDutyDoctors.length;
  const totalWeeklySessions = doctors.reduce((total, doc) => {
    return (
      total +
      Object.values(doc.weeklyShifts || {}).reduce((sub, arr) => sub + arr.length, 0)
    );
  }, 0);

  // 4 Metric cards matching OverviewView design exactly
  const metrics = [
    {
      label: 'TOTAL TIM DOKTER',
      value: `${doctors.length}\u00A0Spesialis`,
      subtext: 'Terdaftar & berlisensi SIP',
      icon: Users,
      trend: `${doctors.length} Dokter`,
    },
    {
      label: 'PRAKTIK HARI INI',
      value: `${onDutyDoctors.length} On-Duty`,
      subtext: `${offDutyDoctors.length} Off Day • ${cutiDoctors.length} Cuti`,
      icon: Stethoscope,
      trend: `${onDutyDoctors.length} Aktif`,
    },
    {
      label: 'SESI SHIFT PEKAN INI',
      value: `${totalWeeklySessions}\u00A0Sesi`,
      subtext: `~${totalWeeklySessions * 3} jam operasional klinik`,
      icon: Clock,
      trend: 'Pagi/Siang/Malam',
    },
    {
      label: 'LOG TUKAR SHIFT',
      value: `${shiftSwapLogs.length}\u00A0Tercatat`,
      subtext: 'Audit trail pertukaran dokter',
      icon: ArrowLeftRight,
      trend: 'Audit Trail',
    },
  ];

  // Filter events based on selected doctor
  const filteredEvents = useMemo(() => {
    if (selectedDoctorFilter === 'all') return scheduleEvents;
    const targetDoc = doctors.find((d) => d.id === selectedDoctorFilter);
    if (!targetDoc) return scheduleEvents;
    return scheduleEvents.filter((ev) => ev.doctorName.includes(targetDoc.name.split(',')[0]));
  }, [scheduleEvents, selectedDoctorFilter, doctors]);

  // Navigate dates handler
  const handlePrevDate = () => {
    if (calendarView === 'week') {
      setActiveWeekIndex((prev) => Math.max(0, prev - 1));
    } else if (calendarView === 'day') {
      if (activeDayColIndex > 0) {
        setActiveDayColIndex((prev) => prev - 1);
      } else if (activeWeekIndex > 0) {
        setActiveWeekIndex((prev) => prev - 1);
        setActiveDayColIndex(6);
      }
    } else if (calendarView === 'month') {
      setMonthOffset((prev) => Math.max(-1, prev - 1));
    }
  };

  const handleNextDate = () => {
    if (calendarView === 'week') {
      setActiveWeekIndex((prev) => Math.min(WEEKS_DATA.length - 1, prev + 1));
    } else if (calendarView === 'day') {
      if (activeDayColIndex < 6) {
        setActiveDayColIndex((prev) => prev + 1);
      } else if (activeWeekIndex < WEEKS_DATA.length - 1) {
        setActiveWeekIndex((prev) => prev + 1);
        setActiveDayColIndex(0);
      }
    } else if (calendarView === 'month') {
      setMonthOffset((prev) => Math.min(1, prev + 1));
    }
  };

  const getCalendarTitle = () => {
    if (calendarView === 'day') {
      return `${activeDayObj.fullDay}, ${activeDayObj.date} Oktober 2026`;
    }
    if (calendarView === 'week') {
      return currentWeek.label;
    }
    return currentMonthData.name;
  };

  // Delete event handler
  const handleDeleteEvent = (eventId: string) => {
    setScheduleEvents((prev) => prev.filter((ev) => ev.id !== eventId));
    setSelectedEvent(null);
    addToast('info', 'Jadwal Dihapus', 'Sesi praktik telah dihapus dari kalender.');
  };

  // Kanban Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData('text/plain', eventId);
    setDraggedEventId(eventId);
  };

  const handleDragOver = (e: React.DragEvent, session: 'Pagi' | 'Siang' | 'Malam') => {
    e.preventDefault();
    if (dragOverSession !== session) {
      setDragOverSession(session);
    }
  };

  const handleDragLeave = () => {
    setDragOverSession(null);
  };

  const handleDrop = (e: React.DragEvent, targetSession: 'Pagi' | 'Siang' | 'Malam') => {
    e.preventDefault();
    setDragOverSession(null);
    const eventId = e.dataTransfer.getData('text/plain') || draggedEventId;
    if (eventId) {
      moveEventToSession(eventId, targetSession);
    }
    setDraggedEventId(null);
  };

  const moveEventToSession = (eventId: string, targetSession: 'Pagi' | 'Siang' | 'Malam') => {
    const sessionTimes = {
      Pagi: { startHour: 9.5, endHour: 11, timeLabel: '09:30 - 11:00 WIB' },
      Siang: { startHour: 14, endHour: 15.5, timeLabel: '14:00 - 15:30 WIB' },
      Malam: { startHour: 18, endHour: 19.5, timeLabel: '18:00 - 19:30 WIB' },
    };

    setScheduleEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            sessionCategory: targetSession,
            startHour: sessionTimes[targetSession].startHour,
            endHour: sessionTimes[targetSession].endHour,
            timeLabel: sessionTimes[targetSession].timeLabel,
          };
        }
        return ev;
      })
    );

    const ev = scheduleEvents.find((x) => x.id === eventId);
    addToast(
      'success',
      'Shift Berhasil Dipindahkan',
      `Jadwal ${ev ? ev.doctorName.split(',')[0] : 'Dokter'} dipindahkan ke Sesi ${targetSession}.`
    );
  };

  // Open Add Schedule Modal with pre-fills
  const openAddScheduleModal = (opts?: {
    dayIndex?: number;
    session?: 'Pagi' | 'Siang' | 'Malam';
    hour?: number;
  }) => {
    const defaultDoc = doctors[0];
    const dayIdx = opts?.dayIndex !== undefined ? opts.dayIndex : activeDayColIndex;
    const session =
      opts?.session ||
      (opts?.hour && opts.hour >= 17 ? 'Malam' : opts?.hour && opts.hour >= 13 ? 'Siang' : 'Pagi');

    const startH = opts?.hour || (session === 'Pagi' ? 9 : session === 'Siang' ? 14 : 18);
    const endH = startH + 1.5;

    setScheduleFormData({
      doctorId: defaultDoc?.id || '',
      dayIndex: dayIdx,
      sessionCategory: session,
      startHour: startH,
      endHour: endH,
      title: 'Pembersihan Karang Gigi (Scalling)',
      unit: 'Dental Unit 01',
      accentColor: '#10B981',
    });
    setIsAddScheduleModalOpen(true);
  };

  const handleSaveNewSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find((d) => d.id === scheduleFormData.doctorId) || doctors[0];
    if (!doc) return;

    const dayNames: DayOfWeek[] = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const chosenDayName = dayNames[scheduleFormData.dayIndex] || 'Selasa';
    const chosenDateStr = currentWeek.days[scheduleFormData.dayIndex]?.fullDate || '2026-10-20';

    const formatHour = (h: number) => {
      const whole = Math.floor(h);
      const minutes = Math.round((h - whole) * 60);
      return `${String(whole).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const newEvent: ScheduleEvent = {
      id: `SCH-${Date.now()}`,
      title: scheduleFormData.title || 'Pemeriksaan Rutin & Konsultasi',
      doctorId: doc.id,
      doctorName: doc.name,
      doctorTitle: doc.title,
      doctorAvatar: doc.avatarUrl,
      dayIndex: scheduleFormData.dayIndex,
      dayName: chosenDayName,
      dateStr: chosenDateStr,
      startHour: scheduleFormData.startHour,
      endHour: scheduleFormData.endHour,
      timeLabel: `${formatHour(scheduleFormData.startHour)} - ${formatHour(scheduleFormData.endHour)} WIB`,
      accentColor: scheduleFormData.accentColor,
      unit: scheduleFormData.unit,
      sessionCategory: scheduleFormData.sessionCategory,
    };

    setScheduleEvents((prev) => [...prev, newEvent]);
    setIsAddScheduleModalOpen(false);
    addToast(
      'success',
      'Jadwal Ditambahkan',
      `Jadwal praktik ${doc.name.split(',')[0]} pada ${chosenDayName} berhasil didaftarkan.`
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER: Action Buttons & Overview (Contextual to activeNavTab)     */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {activeNavTab === 'calendar'
              ? 'Kalender Praktik Dokter'
              : activeNavTab === 'roster'
              ? 'Daftar Tim Dokter Spesialis'
              : 'Riwayat Pertukaran Shift'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {activeNavTab === 'calendar'
              ? 'Kalender jadwal praktik harian (kanban), mingguan, & bulanan tim medis Dentis Senopati.'
              : activeNavTab === 'roster'
              ? 'Profil lengkap tim dokter, keahlian spesialisasi, status kehadiran on-duty, dan lisensi SIP.'
              : 'Audit trail dan log riwayat transaksi pertukaran shift antar dokter spesialis klinik Dentis.'}
          </p>
        </div>

        {/* Contextual Action Buttons: Unified Colors & Clear UX Hierarchy */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {activeNavTab === 'calendar' && (
            <>
              {/* Secondary Action: Tukar Shift Dokter */}
              <button
                onClick={() => {
                  setSwapShiftInitialDoctorId(null);
                  setIsSwapShiftModalOpen(true);
                }}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:text-[#0D5966] hover:border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <ArrowLeftRight className="w-4 h-4 text-slate-500" />
                <span>Tukar Shift Dokter</span>
              </button>

              {/* Primary Action: Tambah Jadwal Sesi */}
              <button
                onClick={() => openAddScheduleModal()}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#0D5966] text-white text-xs font-bold hover:bg-[#09414B] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Tambah Jadwal Sesi</span>
              </button>
            </>
          )}

          {activeNavTab === 'roster' && (
            /* Primary Action: Tambah Dokter Baru */
            <button
              onClick={() => setIsAddDoctorModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0D5966] text-white text-xs font-bold hover:bg-[#09414B] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Dokter Baru</span>
            </button>
          )}

          {activeNavTab === 'swaps' && (
            /* Primary Action: Ajukan Tukar Shift */
            <button
              onClick={() => {
                setSwapShiftInitialDoctorId(null);
                setIsSwapShiftModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0D5966] text-white text-xs font-bold hover:bg-[#09414B] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Ajukan Tukar Shift</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CONTAINER IJO (DEEP TEAL #0D5966) WITH 4 METRIC CARDS (OVERVIEW DNA) */}
      {/* ========================================================================= */}
      <div className="p-2.5 sm:p-3.5 rounded-[22px] sm:rounded-[28px] bg-[#0D5966] shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-[16px] sm:rounded-[20px] bg-white flex flex-col justify-between min-h-[115px] sm:min-h-[140px] cursor-default shadow-2xs"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>

                {/* Middle Row: Big Bold Metric Value */}
                <div className="my-1.5 sm:my-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight block">
                    {item.value}
                  </span>
                </div>

                {/* Bottom Row: Context Description & Trend Badge */}
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

      {/* ========================================================================= */}
      {/* 3. TAB 1: CALENDAR VIEW (DAY / WEEK / MONTH)                              */}
      {/* ========================================================================= */}
      {activeNavTab === 'calendar' && (
        <div className="space-y-4">
          {/* Calendar Top Toolbar: Left = Harian | Mingguan | Bulanan, Right = Date Navigator */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
            {/* Left: Segmented Day | Week | Month Button */}
            <div className="grid grid-cols-3 sm:flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/70 w-full sm:w-auto">
              <button
                onClick={() => setCalendarView('day')}
                className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                  calendarView === 'day'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="sm:hidden">Harian</span>
                <span className="hidden sm:inline">Harian (Kanban)</span>
              </button>
              <button
                onClick={() => setCalendarView('week')}
                className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                  calendarView === 'week'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mingguan
              </button>
              <button
                onClick={() => setCalendarView('month')}
                className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                  calendarView === 'month'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bulanan
              </button>
            </div>

            {/* Right: Date Navigation */}
            <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto">
              <button
                onClick={handlePrevDate}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs shrink-0"
                title="Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 sm:px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-bold text-slate-800 text-center flex-1 sm:flex-initial sm:min-w-[210px] truncate">
                {getCalendarTitle()}
              </span>
              <button
                onClick={handleNextDate}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs shrink-0"
                title="Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SUB-VIEW A: WEEK CALENDAR GRID (MINGGUAN)                                */}
          {/* ========================================================================= */}
          {calendarView === 'week' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[950px]">
                  {/* Grid Header Row: WIB and 7 Days */}
                  <div className="grid grid-cols-8 border-b border-slate-200 text-center font-semibold text-xs text-slate-600 bg-slate-50/50">
                    <div className="py-4 px-3 border-r border-slate-200 text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center">
                      WIB
                    </div>
                    {currentWeek.days.map((d, colIdx) => (
                      <div
                        key={d.day}
                        onClick={() => {
                          setActiveDayColIndex(colIdx);
                          setCalendarView('day');
                        }}
                        className={`py-3.5 px-2 border-r border-slate-200 last:border-r-0 flex items-center justify-center cursor-pointer hover:bg-slate-100/60 transition-colors ${
                          d.isToday ? 'bg-amber-50/40' : ''
                        }`}
                        title="Klik untuk membuka tampilan Kanban Harian"
                      >
                        {d.isToday ? (
                          <span className="inline-flex items-center px-4 py-1.5 rounded-xl bg-[#FBBF24] text-slate-900 font-extrabold text-xs shadow-2xs">
                            {d.day} {d.date}
                          </span>
                        ) : (
                          <span className="text-slate-800 font-bold">
                            {d.day} {d.date}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Grid Hourly Rows with Event Cards Placement */}
                  <div className="relative divide-y divide-slate-100">
                    {TIME_SLOTS.map((slot) => (
                      <div key={slot.hour} className="grid grid-cols-8 min-h-[96px] group">
                        {/* Time Label Column on the Left */}
                        <div className="p-3 border-r border-slate-200 text-xs font-semibold text-slate-500 flex items-start justify-center bg-white select-none">
                          {slot.label}
                        </div>

                        {/* 7 Day Slot Cells */}
                        {currentWeek.days.map((d, colIdx) => {
                          const matchingEvents = filteredEvents.filter(
                            (ev) =>
                              ev.dayIndex === colIdx &&
                              Math.floor(ev.startHour) === slot.hour
                          );

                          return (
                            <div
                              key={`${slot.hour}-${colIdx}`}
                              onClick={() => {
                                if (matchingEvents.length === 0) {
                                  openAddScheduleModal({ dayIndex: colIdx, hour: slot.hour });
                                }
                              }}
                              className={`p-1.5 border-r border-slate-200 last:border-r-0 relative hover:bg-slate-50/60 transition-colors cursor-pointer ${
                                d.isToday ? 'bg-amber-50/10' : ''
                              }`}
                              title={
                                matchingEvents.length === 0
                                  ? `Klik slot kosong untuk tambah jadwal ${d.fullDay} ${slot.label}`
                                  : undefined
                              }
                            >
                              {/* Event Cards rendering (ONLY 1 DOCTOR PHOTO!) */}
                              {matchingEvents.map((event) => (
                                <div
                                  key={event.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(event);
                                  }}
                                  className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-3 space-y-2 cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all relative overflow-hidden"
                                  style={{
                                    borderLeftWidth: '4px',
                                    borderLeftColor: event.accentColor,
                                  }}
                                >
                                  {/* Title & Time */}
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                                      {event.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                                      {event.timeLabel}
                                    </p>
                                  </div>

                                  {/* ONLY 1 PHOTO: The Doctor's Photo + Clean Name & Specialty */}
                                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="relative w-7 h-7 rounded-full overflow-hidden border border-slate-200 shadow-2xs bg-slate-100 shrink-0"
                                        title={event.doctorName}
                                      >
                                        <Image
                                          src={event.doctorAvatar}
                                          alt={event.doctorName}
                                          fill
                                          sizes="28px"
                                          className="object-cover object-top"
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-slate-800 truncate max-w-[80px]">
                                          {event.doctorName.split(',')[0]}
                                        </p>
                                        <p className="text-[9px] text-[#0D5966] font-semibold truncate max-w-[80px]">
                                          {event.doctorTitle.replace('Spesialis ', 'Sp. ')}
                                        </p>
                                      </div>
                                    </div>

                                    <span className="text-[9px] font-semibold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                      {event.unit.replace('Dental Unit ', 'U')}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-VIEW B: DAY VIEW (KANBAN BOARD WITH FULL DRAG & DROP)                 */}
          {/* ========================================================================= */}
          {calendarView === 'day' && (
            <div className="space-y-4">
              {/* 3 True Kanban Columns for Day View (Pagi, Siang, Malam) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['Pagi', 'Siang', 'Malam'] as const).map((sessionCat) => {
                  const sessionIcons = {
                    Pagi: Sun,
                    Siang: Sunset,
                    Malam: Moon,
                  };
                  const SessionIcon = sessionIcons[sessionCat];
                  const sessionTimes = {
                    Pagi: '08:00 - 13:00 WIB',
                    Siang: '13:00 - 17:00 WIB',
                    Malam: '17:00 - 21:00 WIB',
                  };

                  const sessionEvents = filteredEvents.filter(
                    (ev) =>
                      ev.dayIndex === activeDayColIndex &&
                      ev.sessionCategory === sessionCat
                  );

                  const isDropTarget = dragOverSession === sessionCat;

                  return (
                    <div
                      key={sessionCat}
                      onDragOver={(e) => handleDragOver(e, sessionCat)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, sessionCat)}
                      className={`rounded-3xl border transition-all p-4 space-y-3 flex flex-col justify-between min-h-[420px] ${
                        isDropTarget
                          ? 'border-2 border-dashed border-[#0D5966] bg-teal-50/60 ring-2 ring-[#0D5966]/20'
                          : 'bg-slate-50/80 border-slate-200/90'
                      }`}
                    >
                      {/* Column Header */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-[#0D5966] shadow-2xs">
                              <SessionIcon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-900">
                              Sesi {sessionCat}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {sessionEvents.length} Jadwal
                            </span>
                            <button
                              onClick={() =>
                                openAddScheduleModal({
                                  dayIndex: activeDayColIndex,
                                  session: sessionCat,
                                })
                              }
                              className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-[#0D5966] hover:text-white text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                              title={`Tambah jadwal ke Sesi ${sessionCat}`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium pt-0.5">
                          {sessionTimes[sessionCat]}
                        </p>
                      </div>

                      {/* Kanban Event Cards in this session */}
                      <div className="space-y-2.5 flex-1 py-1">
                        {sessionEvents.length === 0 ? (
                          <div
                            onClick={() =>
                              openAddScheduleModal({
                                dayIndex: activeDayColIndex,
                                session: sessionCat,
                              })
                            }
                            className="p-6 text-center rounded-2xl bg-white/70 border border-dashed border-slate-200 hover:border-[#0D5966] text-slate-400 text-xs flex flex-col items-center justify-center min-h-[160px] space-y-1.5 cursor-pointer transition-all group"
                          >
                            <Clock className="w-5 h-5 text-slate-300 group-hover:text-[#0D5966]" />
                            <p className="font-semibold text-slate-600 group-hover:text-[#0D5966]">
                              Slot Shift Kosong
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Drop kartu ke sini atau klik untuk tambah jadwal dokter.
                            </p>
                          </div>
                        ) : (
                          sessionEvents.map((ev) => (
                            <div
                              key={ev.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, ev.id)}
                              onClick={() => setSelectedEvent(ev)}
                              className="rounded-2xl bg-white border border-slate-200 shadow-sm p-3.5 space-y-3 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-[#0D5966]/50 transition-all group"
                              style={{
                                borderLeftWidth: '4px',
                                borderLeftColor: ev.accentColor,
                              }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5 flex-1">
                                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                                    {ev.title}
                                  </h4>
                                  <p className="text-[11px] text-[#0D5966] font-semibold">
                                    {ev.timeLabel}
                                  </p>
                                </div>
                                <div
                                  className="text-slate-300 group-hover:text-slate-500 cursor-grab p-0.5"
                                  title="Tarik kartu untuk drag & drop antar sesi"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>
                              </div>

                              {/* Only 1 Doctor Photo & info */}
                              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <div className="flex items-center gap-2.5">
                                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                    <Image
                                      src={ev.doctorAvatar}
                                      alt={ev.doctorName}
                                      fill
                                      sizes="32px"
                                      className="object-cover object-top"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                      {ev.doctorName}
                                    </p>
                                    <p className="text-[10px] text-[#0D5966] font-semibold truncate">
                                      {ev.doctorTitle}
                                    </p>
                                  </div>
                                </div>

                                <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                                  {ev.unit}
                                </span>
                              </div>

                              {/* Quick Move Buttons (1-Click Move without dragging) */}
                              <div className="flex items-center justify-between pt-1.5 border-t border-dashed border-slate-100 text-[10px]">
                                <span className="text-slate-400 font-semibold">Pindah Sesi:</span>
                                <div className="flex items-center gap-1">
                                  {(['Pagi', 'Siang', 'Malam'] as const)
                                    .filter((s) => s !== sessionCat)
                                    .map((targetS) => (
                                      <button
                                        key={targetS}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          moveEventToSession(ev.id, targetS);
                                        }}
                                        className="px-2 py-0.5 rounded-md font-bold bg-slate-100 hover:bg-[#0D5966] hover:text-white text-slate-600 transition-colors cursor-pointer"
                                        title={`Pindahkan ke Sesi ${targetS}`}
                                      >
                                        Ke {targetS}
                                      </button>
                                    ))}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer Quick Action */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() =>
                            openAddScheduleModal({
                              dayIndex: activeDayColIndex,
                              session: sessionCat,
                            })
                          }
                          className="flex-1 py-2 rounded-xl bg-white border border-slate-200 text-[#0D5966] hover:bg-teal-50 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Jadwal</span>
                        </button>
                        <button
                          onClick={() => {
                            setSwapShiftInitialDoctorId(null);
                            setIsSwapShiftModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0D5966] hover:bg-teal-50 transition-colors cursor-pointer shadow-2xs"
                          title="Tukar shift pada sesi ini"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SUB-VIEW C: MONTH VIEW (BULANAN INTERAKTIF)                               */}
          {/* ========================================================================= */}
          {calendarView === 'month' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-3.5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Kalender Praktik Bulanan: {getCalendarTitle()}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Klik pada tanggal mana pun untuk membuka tampilan Kanban Harian.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0D5966] bg-teal-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-teal-200">
                    {doctors.length} Dokter Terdaftar
                  </span>
                  <button
                    onClick={() => openAddScheduleModal()}
                    className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#0D5966] text-white text-xs font-bold hover:bg-[#09414B] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Jadwal
                  </button>
                </div>
              </div>

              {/* Month Calendar Grid - Fits 100% width on all screen sizes */}
              <div className="w-full">
                {/* Day header: Min s/d Sab */}
                <div className="grid grid-cols-7 border-b border-slate-200 pb-2 text-center text-[10px] sm:text-xs font-bold text-slate-500">
                  <span>Min</span>
                  <span>Sen</span>
                  <span>Sel</span>
                  <span>Rab</span>
                  <span>Kam</span>
                  <span>Jum</span>
                  <span>Sab</span>
                </div>

                {/* Dynamic Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2">
                  {/* Blank cells for offset days */}
                  {Array.from({ length: currentMonthData.startBlank }).map((_, i) => (
                    <div
                      key={`blank-${i}`}
                      className="min-h-[50px] sm:min-h-[88px] p-1 sm:p-2 rounded-xl sm:rounded-2xl bg-slate-50/50 border border-transparent opacity-40 select-none"
                    />
                  ))}

                  {/* Days of the month */}
                  {Array.from({ length: currentMonthData.daysCount }, (_, i) => {
                    const dayNum = i + 1;
                    const isToday = monthOffset === 0 && dayNum === 20;
                    const colIdx = (dayNum + currentMonthData.startBlank - 1) % 7;
                    const dayEvents = scheduleEvents.filter((ev) => ev.dayIndex === colIdx);

                    return (
                      <div
                        key={dayNum}
                        onClick={() => {
                          setActiveDayColIndex(colIdx);
                          setCalendarView('day');
                        }}
                        className={`min-h-[56px] sm:min-h-[92px] p-1 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                          isToday
                            ? 'border-[#0D5966] bg-teal-50/40 ring-1.5 sm:ring-2 ring-[#0D5966]/20 shadow-xs'
                            : 'border-slate-200/80 bg-white hover:border-[#0D5966]/60 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-bold ${
                              isToday
                                ? 'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0D5966] text-white flex items-center justify-center shadow-xs text-[10px] sm:text-xs'
                                : 'text-slate-800 text-[10px] sm:text-xs'
                            }`}
                          >
                            {dayNum}
                          </span>
                          {isToday && (
                            <span className="hidden sm:inline text-[9px] font-extrabold text-[#0D5966] bg-teal-100/60 px-1.5 py-0.5 rounded-md">
                              Hari Ini
                            </span>
                          )}
                        </div>

                        {/* Doctor on duty mini avatars */}
                        <div className="space-y-0.5 sm:space-y-1 pt-1">
                          <div className="flex items-center -space-x-1 sm:-space-x-1.5">
                            {dayEvents.slice(0, 2).map((ev) => (
                              <div
                                key={ev.id}
                                className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden border border-white shrink-0 shadow-2xs"
                                title={`${ev.doctorName} (${ev.timeLabel})`}
                              >
                                <Image
                                  src={ev.doctorAvatar}
                                  alt={ev.doctorName}
                                  fill
                                  sizes="20px"
                                  className="object-cover object-top"
                                />
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-100 border border-white text-[7.5px] sm:text-[9px] font-bold text-slate-600 flex items-center justify-center">
                                +{dayEvents.length - 2}
                              </span>
                            )}
                          </div>
                          <p className="text-[7.5px] sm:text-[9px] text-slate-500 font-semibold truncate leading-tight">
                            {dayEvents.length > 0 ? (
                              <>
                                <span className="sm:hidden">{dayEvents.length} sesi</span>
                                <span className="hidden sm:inline">{dayEvents.length} Sesi Dokter</span>
                              </>
                            ) : (
                              'Libur'
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 2: DAFTAR DOKTER SPESIALIS                                         */}
      {/* ========================================================================= */}
      {activeNavTab === 'roster' && (
        <div className="space-y-4">
          {/* Top Search & 3 Status Filter Pills */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama dokter atau spesialis..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0D5966]"
              />
            </div>

            {/* Status Filter Tabs (Semua, On-Duty, Tidak Ada Shift, Cuti) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterMode === 'all'
                    ? 'bg-[#0D5966] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>Semua Status</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    filterMode === 'all' ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                  }`}
                >
                  {doctors.length}
                </span>
              </button>

              <button
                onClick={() => setFilterMode('onduty')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterMode === 'onduty'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/70'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>On-Duty</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    filterMode === 'onduty' ? 'bg-white/20 text-white' : 'bg-emerald-200/80 text-emerald-900'
                  }`}
                >
                  {onDutyDoctors.length}
                </span>
              </button>

              <button
                onClick={() => setFilterMode('offduty')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterMode === 'offduty'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Off Day</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    filterMode === 'offduty' ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                  }`}
                >
                  {offDutyDoctors.length}
                </span>
              </button>

              <button
                onClick={() => setFilterMode('cuti')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterMode === 'cuti'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/70'
                }`}
              >
                <span>Sedang Cuti</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    filterMode === 'cuti' ? 'bg-white/20 text-white' : 'bg-amber-200/80 text-amber-900'
                  }`}
                >
                  {cutiDoctors.length}
                </span>
              </button>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {doctors
              .filter((doc) => {
                const docStatus = getDoctorWorkStatus(doc);
                const matchesFilter =
                  filterMode === 'all'
                    ? true
                    : filterMode === 'onduty'
                    ? docStatus === 'On-Duty'
                    : filterMode === 'offduty'
                    ? (docStatus === 'Off Day' || docStatus === 'Tidak Ada Shift')
                    : docStatus === 'Cuti';

                const matchesSearch =
                  doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());

                return matchesFilter && matchesSearch;
              })
              .map((doc) => {
                const docStatus = getDoctorWorkStatus(doc);
                const docSessions = Object.values(doc.weeklyShifts || {}).reduce(
                  (sum, arr) => sum + arr.length,
                  0
                );

                const statusStyles = {
                  'On-Duty': {
                    badgeBg: 'bg-emerald-600 text-white',
                    cardBorder: 'bg-white border-slate-200/90 shadow-2xs hover:shadow-md',
                    noteBox: 'bg-emerald-50/80 border-emerald-200/70 text-emerald-900',
                    dotColor: 'bg-emerald-500',
                  },
                  'Off Day': {
                    badgeBg: 'bg-slate-700 text-white',
                    cardBorder: 'bg-slate-50/70 border-slate-200/70 shadow-2xs hover:shadow-md',
                    noteBox: 'bg-slate-100/90 border-slate-200 text-slate-700',
                    dotColor: 'bg-slate-400',
                  },
                  'Tidak Ada Shift': {
                    badgeBg: 'bg-slate-700 text-white',
                    cardBorder: 'bg-slate-50/70 border-slate-200/70 shadow-2xs hover:shadow-md',
                    noteBox: 'bg-slate-100/90 border-slate-200 text-slate-700',
                    dotColor: 'bg-slate-400',
                  },
                  'Cuti': {
                    badgeBg: 'bg-amber-500 text-white',
                    cardBorder: 'bg-amber-50/20 border-amber-200/60 shadow-2xs hover:shadow-md',
                    noteBox: 'bg-amber-50 border-amber-200/80 text-amber-900',
                    dotColor: 'bg-amber-500',
                  },
                };

                const currentStyle = statusStyles[docStatus] || statusStyles['On-Duty'];

                return (
                  <div
                    key={doc.id}
                    className={`rounded-3xl border transition-all flex flex-col justify-between overflow-hidden ${currentStyle.cardBorder}`}
                  >
                    <div className="p-4 space-y-3">
                      {/* Doctor Avatar with Status Badge Overlay */}
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-xs">
                        <Image
                          src={doc.avatarUrl}
                          alt={doc.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover object-top"
                        />

                        {/* Interactive Status Selector on the Doctor's Photo */}
                        <div className="absolute top-2.5 right-2.5">
                          <select
                            value={docStatus === 'Tidak Ada Shift' ? 'Off Day' : docStatus}
                            onChange={(e) =>
                              setDoctorWorkStatus(doc.id, e.target.value as DoctorWorkStatus)
                            }
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-md cursor-pointer border border-white/30 focus:outline-none transition-all ${currentStyle.badgeBg}`}
                            title="Ubah status dokter: On-Duty, Off Day, atau Cuti"
                          >
                            <option value="On-Duty" className="bg-white text-emerald-800 font-bold">
                              ● On-Duty
                            </option>
                            <option
                              value="Off Day"
                              className="bg-white text-slate-800 font-bold"
                            >
                              ○ Off Day
                            </option>
                            <option value="Cuti" className="bg-white text-amber-800 font-bold">
                              ⚠️ Sedang Cuti
                            </option>
                          </select>
                        </div>

                        <div className="absolute bottom-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/75 backdrop-blur-xs text-white">
                            {docSessions} Sesi / Pekan
                          </span>
                        </div>
                      </div>

                      {/* Doctor Name & Specialty */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight line-clamp-1">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-[#0D5966] font-semibold line-clamp-1 mt-0.5">
                          {doc.title}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                          {doc.specialty}
                        </p>
                      </div>

                      {/* Status Note Banner: e.g. Shift Siang & Malam, Tidak Ada Jadwal, or Cuti Tahunan */}
                      <div
                        className={`p-2.5 rounded-xl border text-[11px] font-medium flex items-center gap-2 ${currentStyle.noteBox}`}
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${currentStyle.dotColor}`} />
                        <span className="truncate leading-tight">
                          {doc.statusNote || docStatus}
                        </span>
                      </div>

                      {/* Weekly shifts pills */}
                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Hari Praktik:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(
                            (day) => {
                              const hasShift =
                                (doc.weeklyShifts?.[day as DayOfWeek] || []).length > 0;
                              return (
                                <span
                                  key={day}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                    hasShift
                                      ? 'bg-[#0D5966]/10 text-[#0D5966]'
                                      : 'bg-slate-100 text-slate-300'
                                  }`}
                                >
                                  {day.slice(0, 3)}
                                </span>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => setEditingDoctorForSchedule(doc)}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-white border border-slate-200 text-[#0D5966] hover:bg-[#0D5966] hover:text-white hover:border-[#0D5966] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Atur hari & jam shift dokter ini"
                      >
                        <CalendarClock className="w-3.5 h-3.5" />
                        <span>Atur Shift</span>
                      </button>

                      <button
                        onClick={() => {
                          setSwapShiftInitialDoctorId(doc.id);
                          setIsSwapShiftModalOpen(true);
                        }}
                        className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0D5966] hover:border-teal-200 hover:bg-teal-50 transition-all cursor-pointer shadow-2xs"
                        title="Tukar shift dokter ini"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setEditingDoctorForProfile(doc)}
                        className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
                        title="Edit biodata & foto dokter"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* ========================================================================= */}
      {/* 6. TAB 3: RIWAYAT TUKAR SHIFT                                             */}
      {/* ========================================================================= */}
      {activeNavTab === 'swaps' && (
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Riwayat Pertukaran Shift Dokter
                </h3>
                <p className="text-xs text-slate-400">
                  Daftar transaksi swap shift antar dokter spesialis klinik Dentis Senopati.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSwapShiftInitialDoctorId(null);
                setIsSwapShiftModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#0D5966] text-white text-xs font-bold hover:bg-[#09414B] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Tukar Shift Baru
            </button>
          </div>

          {shiftSwapLogs.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <History className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Belum ada riwayat tukar shift</p>
              <p className="text-xs text-slate-400">
                Pertukaran shift antar dokter yang dilakukan akan tercatat secara otomatis di sini.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {shiftSwapLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0D5966]/10 text-[#0D5966]">
                        {log.type}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {log.day} • {log.session}
                      </span>
                      <span className="text-[11px] text-slate-400">({log.date})</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <span className="text-slate-400 font-normal">Dari:</span>
                        <span className="line-through text-slate-400">{log.fromDoctorName}</span>
                      </div>
                      <ArrowLeftRight className="w-3.5 h-3.5 text-[#0D5966]" />
                      <div className="flex items-center gap-1.5 font-bold text-[#0D5966]">
                        <span className="text-slate-400 font-normal">Digantikan:</span>
                        <span>{log.toDoctorName}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                      &quot;{log.reason}&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <span className="text-[11px] text-slate-400">Dicatat: {log.createdAt}</span>
                    <button
                      onClick={() => deleteShiftSwapLog(log.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus catatan ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. POPUP MODAL: ADD NEW SCHEDULE MODAL                                    */}
      {/* ========================================================================= */}
      {isAddScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            onClick={() => setIsAddScheduleModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0D5966] flex items-center justify-center">
                  <CalendarPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tambah Jadwal Praktik Dokter
                  </h3>
                  <p className="text-xs text-slate-400">
                    Daftarkan sesi tindakan medis & dokter bertugas ke kalender klinik.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddScheduleModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewSchedule} className="space-y-4">
              {/* Doctor selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Pilih Dokter Spesialis:</label>
                <select
                  value={scheduleFormData.doctorId}
                  onChange={(e) =>
                    setScheduleFormData((prev) => ({ ...prev, doctorId: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#0D5966]"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day & Session */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Hari Praktik:</label>
                  <select
                    value={scheduleFormData.dayIndex}
                    onChange={(e) =>
                      setScheduleFormData((prev) => ({
                        ...prev,
                        dayIndex: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#0D5966]"
                  >
                    <option value={0}>Minggu (18 Okt)</option>
                    <option value={1}>Senin (19 Okt)</option>
                    <option value={2}>Selasa (20 Okt - Hari Ini)</option>
                    <option value={3}>Rabu (21 Okt)</option>
                    <option value={4}>Kamis (22 Okt)</option>
                    <option value={5}>Jumat (23 Okt)</option>
                    <option value={6}>Sabtu (24 Okt)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Sesi Shift:</label>
                  <select
                    value={scheduleFormData.sessionCategory}
                    onChange={(e) => {
                      const session = e.target.value as 'Pagi' | 'Siang' | 'Malam';
                      const startH = session === 'Pagi' ? 9 : session === 'Siang' ? 14 : 18;
                      setScheduleFormData((prev) => ({
                        ...prev,
                        sessionCategory: session,
                        startHour: startH,
                        endHour: startH + 1.5,
                      }));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#0D5966]"
                  >
                    <option value="Pagi">Sesi Pagi (08:00 - 13:00)</option>
                    <option value="Siang">Sesi Siang (13:00 - 17:00)</option>
                    <option value="Malam">Sesi Malam (17:00 - 21:00)</option>
                  </select>
                </div>
              </div>

              {/* Start hour & End hour */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Jam Mulai (WIB):</label>
                  <select
                    value={scheduleFormData.startHour}
                    onChange={(e) =>
                      setScheduleFormData((prev) => ({
                        ...prev,
                        startHour: Number(e.target.value),
                        endHour: Math.max(Number(e.target.value) + 1, prev.endHour),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#0D5966]"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.hour} value={slot.hour}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Jam Selesai (WIB):</label>
                  <select
                    value={scheduleFormData.endHour}
                    onChange={(e) =>
                      setScheduleFormData((prev) => ({
                        ...prev,
                        endHour: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#0D5966]"
                  >
                    {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((h) => (
                      <option key={h} value={h}>
                        {String(h).padStart(2, '0')}:00 WIB
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Procedure preset chips */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Pilih Preset Tindakan Medis:</label>
                <div className="flex flex-wrap gap-1.5">
                  {PROCEDURE_PRESETS.map((p) => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() =>
                        setScheduleFormData((prev) => ({
                          ...prev,
                          title: p.title,
                          accentColor: p.color,
                          unit: p.unit,
                        }))
                      }
                      className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        scheduleFormData.title === p.title
                          ? 'bg-[#0D5966] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Title & Dental Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nama Tindakan:</label>
                  <input
                    type="text"
                    required
                    value={scheduleFormData.title}
                    onChange={(e) =>
                      setScheduleFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Contoh: Bleaching Gigi Laser"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0D5966]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Ruangan / Dental Unit:</label>
                  <select
                    value={scheduleFormData.unit}
                    onChange={(e) =>
                      setScheduleFormData((prev) => ({ ...prev, unit: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#0D5966]"
                  >
                    <option value="Dental Unit 01">Dental Unit 01 (Ortodonsia)</option>
                    <option value="Dental Unit 02">Dental Unit 02 (Konservasi Estetika)</option>
                    <option value="Dental Unit 03">Dental Unit 03 (Periodonsia & Prostodonsia)</option>
                    <option value="Dental Unit 04">Dental Unit 04 (Pediatrik Gigi Anak)</option>
                    <option value="Kamar Bedah Minor">Kamar Bedah Minor (Bedah Mulut)</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0D5966] text-white text-xs font-bold hover:bg-[#09414B] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#0D5966]/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Jadwal Praktik</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. POPUP: EVENT DETAIL MODAL (HANYA 1 FOTO DOKTER)                         */}
      {/* ========================================================================= */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white uppercase tracking-wider"
                  style={{ backgroundColor: selectedEvent.accentColor }}
                >
                  Sesi {selectedEvent.sessionCategory}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">{selectedEvent.title}</h3>
                <p className="text-xs text-slate-500">
                  {selectedEvent.dayName}, {selectedEvent.timeLabel}
                </p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Doctor info card with ONLY 1 DOCTOR PHOTO */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 shrink-0 shadow-xs">
                  <Image
                    src={selectedEvent.doctorAvatar}
                    alt={selectedEvent.doctorName}
                    fill
                    sizes="48px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{selectedEvent.doctorName}</p>
                  <p className="text-[11px] text-[#0D5966] font-medium">
                    {selectedEvent.doctorTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/70 text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedEvent.unit}
                </span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Aktif Bertugas
                </span>
              </div>
            </div>

            {/* Quick Session Switch Buttons in Modal */}
            <div className="pt-1">
              <p className="text-[11px] font-bold text-slate-500 mb-1.5">Pindahkan Sesi Shift:</p>
              <div className="grid grid-cols-3 gap-2">
                {(['Pagi', 'Siang', 'Malam'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      moveEventToSession(selectedEvent.id, s);
                      setSelectedEvent((prev) =>
                        prev ? { ...prev, sessionCategory: s } : null
                      );
                    }}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedEvent.sessionCategory === s
                        ? 'bg-[#0D5966] text-white border-[#0D5966]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  const doc = doctors.find((d) =>
                    d.name.includes(selectedEvent.doctorName.split(',')[0])
                  );
                  if (doc) setSwapShiftInitialDoctorId(doc.id);
                  setSelectedEvent(null);
                  setIsSwapShiftModalOpen(true);
                }}
                className="flex-1 py-2.5 rounded-xl border border-teal-200 bg-teal-50 text-[#0D5966] text-xs font-bold hover:bg-teal-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Tukar Shift
              </button>

              <button
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Hapus jadwal ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
