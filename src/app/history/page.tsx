'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Transaction } from '@/types/database';
import { formatRupiah, formatShortDate, getTodayDateString } from '@/lib/utils';
import { Calendar, UserCheck, TrendingUp, Users, ArrowUpDown, ChevronDown } from 'lucide-react';

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHistory = useCallback(async (date: string) => {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      const startOfDay = `${date}T00:00:00.000Z`;
      const endOfDay = `${date}T23:59:59.999Z`;

      const { data, error } = await supabase
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

      if (!error && data) {
        const normalized = data.map((t) => ({
          ...t,
          barber: Array.isArray(t.barber) ? t.barber[0] : t.barber,
          service: Array.isArray(t.service) ? t.service[0] : t.service,
        })) as Transaction[];
        setTransactions(normalized);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(selectedDate);
  }, [selectedDate, fetchHistory]);

  // Aggregate stats
  const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.total_price || 0), 0);
  const totalCount = transactions.length;

  // Breakdown per barber for commission / revenue share
  const barberBreakdown: Record<string, { name: string; count: number; revenue: number }> = {};
  transactions.forEach((tx) => {
    const barberName = tx.barber?.name || 'Unknown Barber';
    if (!barberBreakdown[barberName]) {
      barberBreakdown[barberName] = { name: barberName, count: 0, revenue: 0 };
    }
    barberBreakdown[barberName].count += 1;
    barberBreakdown[barberName].revenue += Number(tx.total_price || 0);
  });

  const barberList = Object.values(barberBreakdown).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-4">
      {/* Date Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Calendar className="w-4 h-4 text-amber-600" />
          Pilih Tanggal:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Total Omzet
          </span>
          <span className="text-xl font-black">{formatRupiah(totalRevenue)}</span>
        </div>
        <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Total Customer
          </span>
          <span className="text-xl font-black">{totalCount} orang</span>
        </div>
      </div>

      {/* Revenue per Barber Breakdown (Komisi / Bagi Hasil) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-amber-600" />
          Omzet Per Kapster (Bagi Hasil)
        </h3>

        {barberList.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">Belum ada data pada tanggal ini.</p>
        ) : (
          <div className="space-y-2">
            {barberList.map((item) => {
              const percentage = totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 100) : 0;
              return (
                <div key={item.name} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="font-bold text-slate-900">{formatRupiah(item.revenue)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span>{item.count} pelanggan</span>
                    <span>{percentage}% kontribusi</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historical Transaction Table/List */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            Rincian Transaksi
          </h3>
          <span className="text-[11px] text-slate-500">{transactions.length} baris</span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Memuat riwayat transaksi...</div>
        ) : transactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">Tidak ada transaksi ditemukan pada tanggal ini.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <span>{tx.customer_name}</span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded ${
                        tx.payment_method === 'Cash'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {tx.payment_method}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {tx.service?.name} • <span className="text-slate-700">{tx.barber?.name}</span> • {formatShortDate(tx.created_at)}
                  </div>
                </div>
                <div className="font-bold text-slate-900 text-right">
                  {formatRupiah(Number(tx.total_price))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
