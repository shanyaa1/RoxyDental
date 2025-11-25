import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "POLADC - Dental Clinic | Klinik Gigi Profesional",
  description: "POLADC Dental Clinic menyediakan layanan perawatan gigi profesional dengan teknologi modern dan tim dokter berpengalaman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
