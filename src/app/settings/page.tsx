'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Barber, Service } from '@/types/database';
import { formatRupiah } from '@/lib/utils';
import { Scissors, Users, Plus, Trash2, Edit2, Check, X, ShieldAlert } from 'lucide-react';

export default function SettingsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form states - Service
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Form states - Barber
  const [barberName, setBarberName] = useState('');
  const [editingBarberId, setEditingBarberId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      setServices([
        { id: '1', name: 'Potong Rambut Basic', price: 35000, created_at: '' },
        { id: '2', name: 'Potong + Cuci + Styling', price: 50000, created_at: '' },
      ]);
      setBarbers([
        { id: '1', name: 'Budi Santoso', created_at: '' },
        { id: '2', name: 'Rian Pratama', created_at: '' },
      ]);
      setLoading(false);
      return;
    }

    try {
      const [svcRes, barRes] = await Promise.all([
        supabase.from('services').select('*').order('name'),
        supabase.from('barbers').select('*').order('name'),
      ]);

      if (!svcRes.error && svcRes.data) setServices(svcRes.data);
      if (!barRes.error && barRes.data) setBarbers(barRes.data);
    } catch (err) {
      console.error('Error fetching settings data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- SERVICE ACTIONS ---
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !servicePrice) return;
    const priceNum = parseFloat(servicePrice);

    if (editingServiceId) {
      if (isSupabaseConfigured()) {
        await supabase
          .from('services')
          .update({ name: serviceName.trim(), price: priceNum })
          .eq('id', editingServiceId);
      }
      setServices((prev) =>
        prev.map((s) => (s.id === editingServiceId ? { ...s, name: serviceName.trim(), price: priceNum } : s))
      );
      setEditingServiceId(null);
    } else {
      if (isSupabaseConfigured()) {
        const { data } = await supabase
          .from('services')
          .insert([{ name: serviceName.trim(), price: priceNum }])
          .select()
          .single();
        if (data) setServices((prev) => [...prev, data]);
      } else {
        setServices((prev) => [
          ...prev,
          { id: 'svc-' + Date.now(), name: serviceName.trim(), price: priceNum, created_at: '' },
        ]);
      }
    }
    setServiceName('');
    setServicePrice('');
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Hapus layanan ini?')) return;
    if (isSupabaseConfigured()) {
      await supabase.from('services').delete().eq('id', id);
    }
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEditServiceClick = (s: Service) => {
    setEditingServiceId(s.id);
    setServiceName(s.name);
    setServicePrice(s.price.toString());
  };

  // --- BARBER ACTIONS ---
  const handleSaveBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barberName.trim()) return;

    if (editingBarberId) {
      if (isSupabaseConfigured()) {
        await supabase.from('barbers').update({ name: barberName.trim() }).eq('id', editingBarberId);
      }
      setBarbers((prev) =>
        prev.map((b) => (b.id === editingBarberId ? { ...b, name: barberName.trim() } : b))
      );
      setEditingBarberId(null);
    } else {
      if (isSupabaseConfigured()) {
        const { data } = await supabase
          .from('barbers')
          .insert([{ name: barberName.trim() }])
          .select()
          .single();
        if (data) setBarbers((prev) => [...prev, data]);
      } else {
        setBarbers((prev) => [
          ...prev,
          { id: 'bar-' + Date.now(), name: barberName.trim(), created_at: '' },
        ]);
      }
    }
    setBarberName('');
  };

  const handleDeleteBarber = async (id: string) => {
    if (!confirm('Hapus kapster ini?')) return;
    if (isSupabaseConfigured()) {
      await supabase.from('barbers').delete().eq('id', id);
    }
    setBarbers((prev) => prev.filter((b) => b.id !== id));
  };

  const handleEditBarberClick = (b: Barber) => {
    setEditingBarberId(b.id);
    setBarberName(b.name);
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: MASTER LAYANAN */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-sm">Kelola Layanan</h2>
            <p className="text-[11px] text-slate-500">Tambah & edit daftar paket cukur</p>
          </div>
        </div>

        <form onSubmit={handleSaveService} className="space-y-2">
          <input
            type="text"
            placeholder="Nama Layanan (misal: Potong + Cuci)"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Harga (Rp)"
              value={servicePrice}
              onChange={(e) => setServicePrice(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 text-xs rounded-xl shadow-sm shrink-0 flex items-center gap-1 active:scale-95"
            >
              {editingServiceId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {editingServiceId ? 'Update' : 'Tambah'}
            </button>
            {editingServiceId && (
              <button
                type="button"
                onClick={() => {
                  setEditingServiceId(null);
                  setServiceName('');
                  setServicePrice('');
                }}
                className="px-2 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        <div className="divide-y divide-slate-100 pt-1">
          {services.map((svc) => (
            <div key={svc.id} className="py-2.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{svc.name}</p>
                <p className="text-[11px] font-semibold text-amber-700">{formatRupiah(Number(svc.price))}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleEditServiceClick(svc)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteService(svc.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: MASTER KAPSTER */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-900 text-amber-400 rounded-xl">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-sm">Kelola Kapster / Barber</h2>
            <p className="text-[11px] text-slate-500">Tambah & edit nama tukang cukur</p>
          </div>
        </div>

        <form onSubmit={handleSaveBarber} className="flex gap-2">
          <input
            type="text"
            placeholder="Nama Kapster (misal: Budi)"
            value={barberName}
            onChange={(e) => setBarberName(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 font-bold text-white text-xs rounded-xl shadow-sm shrink-0 flex items-center gap-1 active:scale-95"
          >
            {editingBarberId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {editingBarberId ? 'Update' : 'Tambah'}
          </button>
          {editingBarberId && (
            <button
              type="button"
              onClick={() => {
                setEditingBarberId(null);
                setBarberName('');
              }}
              className="px-2 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        <div className="divide-y divide-slate-100 pt-1">
          {barbers.map((bar) => (
            <div key={bar.id} className="py-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{bar.name}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleEditBarberClick(bar)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteBarber(bar.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
