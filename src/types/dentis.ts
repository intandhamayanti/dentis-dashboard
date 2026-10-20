export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Selesai' | 'Dibatalkan';

export type NavMenu = 
  | 'overview' 
  | 'reservasi' 
  | 'rekam-medis' 
  | 'dokter' 
  | 'keuangan' 
  | 'pengaturan';

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';

export type ShiftSession = 'Pagi (10.00-13.00)' | 'Siang (14.00-17.00)' | 'Malam (17.00-20.00)';

export interface MedicalRecord {
  id: string;
  date: string;
  doctorName: string;
  treatment: string;
  complaint: string;
  notes: string;
  cost: number;
}

export interface Patient {
  id: string; // e.g. DNT-MR-0021
  name: string;
  phone: string; // 0812...
  email?: string;
  gender: 'Laki-laki' | 'Perempuan';
  isNewPatient: boolean;
  totalVisits: number;
  lastVisitDate: string;
  bloodType?: string;
  address?: string;
  allergies?: string;
  records: MedicalRecord[];
}

export type DoctorWorkStatus = 'On-Duty' | 'Off Day' | 'Tidak Ada Shift' | 'Cuti';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatarUrl: string;
  isAvailableToday: boolean;
  workStatus?: DoctorWorkStatus;
  statusNote?: string;
  activePatientsToday: number;
  weeklyShifts: Record<DayOfWeek, ShiftSession[]>;
  phone?: string;
  sipNumber?: string;
  experience?: string;
  bio?: string;
}

export interface ShiftSwapRecord {
  id: string;
  day: DayOfWeek;
  session: ShiftSession;
  fromDoctorId: string;
  fromDoctorName: string;
  toDoctorId: string;
  toDoctorName: string;
  type: 'Ganti Shift' | 'Tukar Sesi';
  swapBackSession?: ShiftSession;
  reason: string;
  date: string;
  createdAt: string;
}


export type PaymentMethod = 'Kasir' | 'QRIS' | 'Virtual Account' | 'Transfer Bank';
export type PaymentStatus = 'Lunas' | 'DP' | 'Belum Bayar';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  isNewPatient: boolean;
  treatment: string;
  date: string; // YYYY-MM-DD
  sessionTime: string; // e.g. "10.30 WIB"
  shiftSession: ShiftSession;
  doctorId: string;
  doctorName: string;
  status: AppointmentStatus;
  source: 'Web Leads' | 'Manual Booking';
  notes?: string;
  estimatedCost: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paidAmount?: number;
}

export interface ClinicService {
  id: string;
  name: string;
  category: 'Perawatan Gigi Umum' | 'Kedokteran Gigi Estetika' | 'Restorasi & Bedah Mulut' | 'Gigi Anak & Keluarga';
  durationMin: number;
  price: number;
  description: string;
}

export interface ClinicSettings {
  clinicName: string;
  hotlineWhatsapp: string;
  email: string;
  address: string;
  operatingHoursWeekday: string;
  operatingHoursWeekend: string;
  promoBannerActive: boolean;
  promoBannerText: string;
  promoDiscountPercent: number;
  heroHeadline: string;
  heroSubheadline: string;
  socialProofPatients: string;
  socialProofRating: string;
}

// ==========================================
// DENTIS LANDING PAGE CMS TYPES
// ==========================================

export interface WebHeroCMS {
  headline: string;
  subheadline: string;
  ratingScore: string;
  ratingLabel: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  heroImageLeft: string;
  heroImageRight: string;
}

export interface WebAboutStatCMS {
  id: string;
  value: string;
  label: string;
  sublabel: string;
}

export interface WebAboutCMS {
  badge: string;
  statement: string;
  stats: WebAboutStatCMS[];
}

export interface WebFeaturedServiceCMS {
  id: string;
  category: string;
  title: string;
  description: string;
  features: string[];
  imageUrl: string;
  ctaText: string;
  isActive: boolean;
  order: number;
}

export interface WebBeforeAfterCMS {
  id: string;
  title: string;
  treatment: string;
  doctorName: string;
  description: string;
  imageUrl: string;
  duration: string;
  isActive: boolean;
}

export interface WebDoctorCardCMS {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experience: string;
  avatarUrl: string;
  isActive: boolean;
  order: number;
}

export interface WebTestimonialCMS {
  id: string;
  patientName: string;
  treatment: string;
  rating: number; // 1-5
  reviewText: string;
  patientPhotoUrl: string;
  date: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface WebFaqCMS {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface WebCtaBannerCMS {
  headline: string;
  subheadline: string;
  buttonText: string;
  whatsappText: string;
  imageLeft: string;
  imageRight: string;
}

export interface WebCMSState {
  hero: WebHeroCMS;
  about: WebAboutCMS;
  services: WebFeaturedServiceCMS[];
  beforeAfter: WebBeforeAfterCMS[];
  doctors: WebDoctorCardCMS[];
  testimonials: WebTestimonialCMS[];
  faqs: WebFaqCMS[];
  ctaBanner: WebCtaBannerCMS;
}
export interface ClinicBranch {
  id: string;
  name: string;
  fullName: string;
  location: string;
  address: string;
  phone: string;
  isFlagship?: boolean;
}

export interface UserSession {
  name: string;
  role: string;
  initials: string;
  email: string;
}
