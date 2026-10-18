'use client';

import { useEffect, useState, useCallback } from 'react';
import MetricCard from '@/components/MetricCard';
import TransactionForm from '@/components/TransactionForm';
import TodayTransactions from '@/components/TodayTransactions';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Barber, Service, Transaction, PaymentMethod } from '@/types/database';
import { formatRupiah, getTodayDateString } from '@/lib/utils';
import { Wallet, Users, AlertTriangle } from 'lucide-react';

// Fallback initial mock data for immediate preview if Supabase not yet connected
const MOCK_BARBERS: Barber[] = [
  { id: 'b1', name: 'Budi Santoso', created_at: new Date().toISOString() },
  { id: 'b2', name: 'Rian Pratama', created_at: new Date().toISOString() },
  { id: 'b3', name: 'Fajar Setiawan', created_at: new Date().toISOString() },
];

const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Potong Rambut Basic', price: 35000, created_at: new Date().toISOString() },
  { id: 's2', name: 'Potong + Cuci + Styling', price: 50000, created_at: new Date().toISOString() },
  { id: 's3', name: 'Paket Ganteng (Potong + Shaving)', price: 65000, created_at: new Date().toISOString() },
];

export default function DashboardPage() {
  const [barbers, setBarbers] = useState<Barber[]>(MOCK_BARBERS);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    if (!configured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch Barbers
      const { data: barbersData, error: barbersErr } = await supabase
        .from('barbers')
        .select('*')
        .order('name');
      if (!barbersErr && barbersData && barbersData.length > 0) {
        setBarbers(barbersData);
      }

      // Fetch Services
      const { data: servicesData, error: servicesErr } = await supabase
        .from('services')
        .select('*')
        .order('price');
      if (!servicesErr && servicesData && servicesData.length > 0) {
        setServices(servicesData);
      }

      // Fetch Today's Transactions
      const today = getTodayDateString();
      const startOfDay = `${today}T00:00:00.000Z`;
      const endOfDay = `${today}T23:59:59.999Z`;

      const { data: txData, error: txErr } = await supabase
        .from('transactions')
        .select(`
          id,
          barber_id,
          service_id,
          customer_name,
          total_price,
          payment_method,
          created_at,
          barber:barbers (id, name),
          service:services (id, name, price)
        `)
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .order('created_at', { ascending: false });

      if (!txErr && txData) {
        // Supabase foreign relations can return array or object, normalize it
        const normalized = txData.map((t) => ({
          ...t,
          barber: Array.isArray(t.barber) ? t.barber[0] : t.barber,
          service: Array.isArray(t.service) ? t.service[0] : t.service,
        })) as Transaction[];
        setTransactions(normalized);
      }
    } catch (err) {
      console.error('Failed to load Supabase data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Create Transaction
  const handleCreateTransaction = async (payload: {
    barber_id: string;
    service_id: string;
    customer_name: string;
    total_price: number;
    payment_method: PaymentMethod;
  }) => {
    if (!isConfigured) {
      // Local mock state
      const mockTx: Transaction = {
        id: 'tx-' + Date.now(),
        barber_id: payload.barber_id,
        service_id: payload.service_id,
        customer_name: payload.customer_name,
        total_price: payload.total_price,
        payment_method: payload.payment_method,
        created_at: new Date().toISOString(),
        barber: barbers.find((b) => b.id === payload.barber_id),
        service: services.find((s) => s.id === payload.service_id),
      };
      setTransactions((prev) => [mockTx, ...prev]);
      return { success: true };
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            barber_id: payload.barber_id,
            service_id: payload.service_id,
            customer_name: payload.customer_name,
            total_price: payload.total_price,
            payment_method: payload.payment_method,
          },
        ])
        .select(`
          id,
          barber_id,
          service_id,
          customer_name,
          total_price,
          payment_method,
          created_at,
          barber:barbers (id, name),
          service:services (id, name, price)
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        const normalized: Transaction = {
          ...data,
          barber: Array.isArray(data.barber) ? data.barber[0] : data.barber,
          service: Array.isArray(data.service) ? data.service[0] : data.service,
        };
        setTransactions((prev) => [normalized, ...prev]);
      }
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  };

  // Handle Delete Transaction
  const handleDeleteTransaction = async (id: string) => {
    if (!isConfigured) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      return { success: true };
    }

    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) {
        alert('Gagal menghapus: ' + error.message);
        return { success: false, error: error.message };
      }
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Gagal menghapus' };
    }
  };

  // Metrics
  const totalOmset = transactions.reduce((sum, t) => sum + Number(t.total_price || 0), 0);
  const totalCustomers = transactions.length;

  return (
    <div className="space-y-4">
      {/* Alert when Supabase not configured */}
      {!isConfigured && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl p-3 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Mode Simulasi Offline</p>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Isi <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code> dengan kredensial Supabase Anda untuk menghubungkan database permanen.
            </p>
          </div>
        </div>
      )}

      {/* Top Section: Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <MetricCard
          title="Omset Hari Ini"
          value={formatRupiah(totalOmset)}
          icon={Wallet}
          variant="primary"
        />
        <MetricCard
          title="Pelanggan"
          value={`${totalCustomers} org`}
          subtitle="Hari ini"
          icon={Users}
          variant="accent"
        />
      </div>

      {/* Core Action: Input Transaksi Form */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          Input Transaksi Baru
        </h2>
        <TransactionForm
          barbers={barbers}
          services={services}
          onSubmit={handleCreateTransaction}
        />
      </div>

      {/* Bottom Section: Today's Completed Transactions */}
      <div>
        <TodayTransactions
          transactions={transactions}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </div>
  );
}
