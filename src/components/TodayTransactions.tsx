'use client';

import { Transaction } from '@/types/database';
import { formatRupiah, formatShortDate } from '@/lib/utils';
import { Trash2, Clock, User, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface TodayTransactionsProps {
  transactions: Transaction[];
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export default function TodayTransactions({
  transactions,
  onDelete,
}: TodayTransactionsProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-600" />
          Transaksi Hari Ini
        </h3>
        <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
          {transactions.length} kunjungan
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-600">Belum ada transaksi hari ini</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Catat transaksi pertama lewat formulir di atas</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="py-3 flex items-center justify-between gap-3 transition-opacity"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {tx.customer_name || 'Pelanggan'}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      tx.payment_method === 'Cash'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {tx.payment_method}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span className="text-slate-700 font-medium">{tx.service?.name || 'Layanan'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {tx.barber?.name || 'Kapster'}
                  </span>
                  <span>•</span>
                  <span className="text-slate-400">{formatShortDate(tx.created_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-900">
                  {formatRupiah(Number(tx.total_price))}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(tx.id)}
                  disabled={deletingId === tx.id}
                  className="p-1.5 text-slate-400 hover:text-rose-600 active:scale-90 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Hapus Transaksi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
