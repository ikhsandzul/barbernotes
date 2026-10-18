# BarberNotes - Kasir & Pencatatan Barbershop (Mobile-First)

Aplikasi web mobile-first untuk pencatatan transaksi cepat barbershop (kurang dari 10 detik per pelanggan) menggantikan buku manual.

## Fitur Utama
1. **Quick Entry (Dashboard `/`)**:
   - Kartu Metrik Ringkas: Total Omzet Hari Ini & Total Pelanggan Hari Ini.
   - Pilihan Kapster (Tukang Cukur) sekali sentuh.
   - Pilihan Layanan & Harga otomatis terhitung.
   - Pilihan Pembayaran: Tunai / QRIS.
   - Tombol "Simpan Transaksi" besar & ergonomis untuk 1 tangan di layar HP.
   - Daftar riwayat transaksi hari ini + tombol hapus cepat.
2. **Riwayat & Laporan (`/history`)**:
   - Filter tanggal fleksibel.
   - Rekap omzet total & rincian omzet per kapster untuk hitung komisi/bagi hasil.
3. **Master Data (`/settings`)**:
   - Tambah/Ubah/Hapus Layanan & Tarif.
   - Tambah/Ubah/Hapus Nama Kapster.

---

## Langkah Setup Supabase
1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka menu **SQL Editor**.
3. Buka file [`supabase/schema.sql`](file:///E:/Folder%20Coding/barbernotes/supabase/schema.sql) di project ini, lalu salin isinya ke SQL Editor Supabase dan jalankan (**Run**).
4. Masuk ke **Project Settings** > **API**.
5. Salin **Project URL** dan **anon / public key**.

---

## Menjalankan di Lokal
1. Buat file `.env.local` atau edit yang sudah ada:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
2. Jalankan server dev:
   ```bash
   npm run dev
   ```
3. Buka di browser: `http://localhost:3000` (disarankan pakai Device Mode / Inspect Element ukuran HP).

---

## Deploy Gratis ke Vercel
1. Push project ini ke repository GitHub Anda.
2. Buka [vercel.com](https://vercel.com) > **Add New Project** > Import repository ini.
3. Tambahkan **Environment Variables** di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Klik **Deploy**.
