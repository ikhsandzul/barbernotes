'use client';

import { Scissors } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function Header() {
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    setConfigured(isSupabaseConfigured());
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white px-4 py-3 shadow-md flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-amber-500 text-slate-950 p-2 rounded-xl shadow-sm">
          <Scissors className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight">BarberNotes</h1>
          <p className="text-[11px] text-slate-400">Pencatatan Cepat Barbershop</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${
            configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`}
        />
        <span className="text-[11px] font-medium text-slate-300">
          {configured ? 'Online' : 'Demo / Local'}
        </span>
      </div>
    </header>
  );
}
