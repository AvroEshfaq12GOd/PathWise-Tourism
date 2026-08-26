import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
export function AdminLayout({ children }: {children: React.ReactNode;}) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <AdminTopbar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>);

}