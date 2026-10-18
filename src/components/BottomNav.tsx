'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scissors, History, Settings } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Kasir',
      href: '/',
      icon: Scissors,
      active: pathname === '/',
    },
    {
      name: 'Riwayat',
      href: '/history',
      icon: History,
      active: pathname === '/history',
    },
    {
      name: 'Master Data',
      href: '/settings',
      icon: Settings,
      active: pathname === '/settings',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg max-w-md mx-auto">
      <div className="grid grid-cols-3 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-colors active:scale-95 ${
                item.active
                  ? 'text-amber-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1.5 rounded-full ${
                  item.active ? 'bg-amber-100' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
