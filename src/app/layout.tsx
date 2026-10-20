import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dentis-clinic.vercel.app"),
  title: "Dentis - Admin Portal & Clinic Management",
  description: "Dentis - Dashboard Admin internal untuk klinik gigi Dentis Senopati - Reservasi, Rekam Medis Pasien, Jadwal Praktik Dokter, dan Laporan Keuangan.",
  icons: {
    icon: [
      { url: "/tooth-white.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/tooth-white.png",
    apple: "/tooth-white.png",
  },
  openGraph: {
    title: "Dentis - Admin Portal & Clinic Management",
    description: "Dentis - Dashboard Admin internal untuk klinik gigi Dentis Senopati - Reservasi, Rekam Medis Pasien, Jadwal Praktik Dokter, dan Laporan Keuangan.",
    url: "https://dentis-clinic.vercel.app",
    siteName: "Dentis",
    images: [
      {
        url: "/og-image.jpg",
        width: 1024,
        height: 682,
        alt: "Dentis - Dental Clinic Interior",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dentis - Admin Portal & Clinic Management",
    description: "Dentis - Dashboard Admin internal untuk klinik gigi Dentis Senopati - Reservasi, Rekam Medis Pasien, Jadwal Praktik Dokter, dan Laporan Keuangan.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${bricolage.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/tooth-white.png" type="image/png" />
      </head>
      <body className="min-h-full bg-[#F3F5F4] text-slate-800 flex flex-col font-sans selection:bg-[#0D5966] selection:text-white">
        {children}
      </body>
    </html>
  );
}
