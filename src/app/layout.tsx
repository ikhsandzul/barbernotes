import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'BarberNotes - Kasir & Pencatatan Barbershop',
  description: 'Pencatatan transaksi barbershop super cepat di layar HP',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-100 min-h-screen text-slate-900 antialiased">
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative pb-safe shadow-xl border-x border-slate-200 flex flex-col">
          <Header />
          <main className="flex-1 p-4">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
