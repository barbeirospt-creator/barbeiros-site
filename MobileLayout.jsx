
import React from 'react';
import { Outlet } from 'react-router-dom';
import MobileNav from '@/components/layout/MobileNav';

export default function MobileLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-1 w-full overflow-x-hidden pb-24">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
