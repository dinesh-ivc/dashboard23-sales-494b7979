'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart3, MapPin, Package, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Website Visits', href: '/dashboard/website-visits', icon: BarChart3 },
  { name: 'Store Visits', href: '/dashboard/store-visits', icon: MapPin },
  { name: 'Products', href: '/dashboard/products', icon: Package },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Clear authentication tokens
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64 fixed left-0 top-0 bottom-0">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Sales Dashboard</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${isActive ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700"}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-700 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}