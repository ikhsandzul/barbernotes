-- ==========================================================
-- BARBERNOTES SUPABASE SCHEMA & SEED DATA
-- ==========================================================

-- 1. Create tables
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.barbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL DEFAULT 'Pelanggan',
    total_price NUMERIC NOT NULL CHECK (total_price >= 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash', 'QRIS')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for fast mobile queries
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_barber_id ON public.transactions (barber_id);
CREATE INDEX IF NOT EXISTS idx_transactions_service_id ON public.transactions (service_id);

-- 3. Row Level Security (RLS) setup
-- Barbershop staff mobile app without mandatory auth barrier (single-shop MVP)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Allow anon read/write
CREATE POLICY "Allow public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public insert services" ON public.services FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update services" ON public.services FOR UPDATE USING (true);
CREATE POLICY "Allow public delete services" ON public.services FOR DELETE USING (true);

CREATE POLICY "Allow public read barbers" ON public.barbers FOR SELECT USING (true);
CREATE POLICY "Allow public insert barbers" ON public.barbers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update barbers" ON public.barbers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete barbers" ON public.barbers FOR DELETE USING (true);

CREATE POLICY "Allow public read transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert transactions" ON public.transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update transactions" ON public.transactions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete transactions" ON public.transactions FOR DELETE USING (true);

-- 4. Dummy Seed Data
INSERT INTO public.barbers (name)
VALUES 
    ('Budi Santoso'),
    ('Rian Pratama'),
    ('Fajar Setiawan')
ON CONFLICT DO NOTHING;

INSERT INTO public.services (name, price)
VALUES 
    ('Potong Rambut Basic', 35000),
    ('Potong + Cuci + Styling', 50000),
    ('Paket Ganteng (Potong + Shaving + Pijat)', 65000)
ON CONFLICT DO NOTHING;
