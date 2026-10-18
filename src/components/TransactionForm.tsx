'use client';

import { useState } from 'react';
import { Barber, Service, PaymentMethod } from '@/types/database';
import { formatRupiah } from '@/lib/utils';
import { User, Scissors, CreditCard, Banknote, CheckCircle, Loader2 } from 'lucide-react';

interface TransactionFormProps {
  barbers: Barber[];
  services: Service[];
  onSubmit: (data: {
    barber_id: string;
    service_id: string;
    customer_name: string;
    total_price: number;
    payment_method: PaymentMethod;
  }) => Promise<{ success: boolean; error?: string }>;
}

export default function TransactionForm({
  barbers,
  services,
  onSubmit,
}: TransactionFormProps) {
  const [selectedBarber, setSelectedBarber] = useState<string>(barbers[0]?.id || '');
  const [selectedService, setSelectedService] = useState<string>(services[0]?.id || '');
  const [customerName, setCustomerName] = useState<string>('Pelanggan');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const currentService = services.find((s) => s.id === selectedService);
  const totalPrice = currentService ? Number(currentService.price) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarber) {
      setNotification({ type: 'error', message: 'Silakan pilih kapster terlebih dahulu!' });
      return;
    }
    if (!selectedService) {
      setNotification({ type: 'error', message: 'Silakan pilih layanan terlebih dahulu!' });
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      const result = await onSubmit({
        barber_id: selectedBarber,
        service_id: selectedService,
        customer_name: customerName.trim() || 'Pelanggan',
        total_price: totalPrice,
        payment_method: paymentMethod,
      });

      if (result.success) {
        setNotification({ type: 'success', message: 'Transaksi berhasil disimpan!' });
        setCustomerName('Pelanggan');
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: result.error || 'Gagal menyimpan transaksi.' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
      {notification && (
        <div
          className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {notification.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* 1. Barber Selection Cards */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <User className="w-3.5 h-3.5 text-amber-600" />
          Pilih Kapster
        </label>
        <div className="grid grid-cols-3 gap-2">
          {barbers.length === 0 ? (
            <p className="text-xs text-slate-400 col-span-3 py-2 text-center">Belum ada kapster terdaftar.</p>
          ) : (
            barbers.map((barber) => {
              const isSelected = selectedBarber === barber.id;
              return (
                <button
                  key={barber.id}
                  type="button"
                  onClick={() => setSelectedBarber(barber.id)}
                  className={`p-3 rounded-xl border text-center font-medium transition-all active:scale-95 text-xs flex flex-col items-center justify-center min-h-[58px] ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm ring-2 ring-amber-500/30'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate w-full">{barber.name}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Service Selection Cards */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Scissors className="w-3.5 h-3.5 text-amber-600" />
          Pilih Layanan
        </label>
        <div className="space-y-2">
          {services.length === 0 ? (
            <p className="text-xs text-slate-400 py-2 text-center">Belum ada layanan tersedia.</p>
          ) : (
            services.map((service) => {
              const isSelected = selectedService === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedService(service.id)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all active:scale-[0.98] text-left ${
                    isSelected
                      ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-sm ring-1 ring-amber-500'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex-1 pr-2">
                    <p className={`text-xs font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                      {service.name}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-white rounded-lg border border-slate-200 text-amber-700 shrink-0">
                    {formatRupiah(Number(service.price))}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Customer Name (Optional) */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
          Nama Pelanggan (Opsional)
        </label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Pelanggan"
          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
        />
      </div>

      {/* 4. Payment Method Radios / Cards */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Metode Pembayaran
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('Cash')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
              paymentMethod === 'Cash'
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>Tunai / Cash</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('QRIS')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
              paymentMethod === 'QRIS'
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>QRIS</span>
          </button>
        </div>
      </div>

      {/* 5. Big Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !selectedBarber || !selectedService}
        className="w-full mt-2 py-3.5 px-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] disabled:opacity-50 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Menyimpan Transaksi...</span>
          </>
        ) : (
          <>
            <span>Simpan Transaksi • {formatRupiah(totalPrice)}</span>
          </>
        )}
      </button>
    </form>
  );
}
