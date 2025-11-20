'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  BarChart3, 
  Store, 
  Package, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Website Visits', href: '/dashboard/website-visits', icon: BarChart3 },
    { name: 'Store Visits', href: '/dashboard/store-visits', icon: Store },
    { name: 'Products', href: '/dashboard/products', icon: Package },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`flex items-center ${
                      isActive 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Logo for mobile */}
          <div className="md:hidden flex-1 flex justify-center">
            <span className="text-lg font-semibold text-gray-900">
              {process.env.NEXT_PUBLIC_APP_NAME || 'Sales Dashboard'}
            </span>
          </div>

          {/* Logout button */}
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start mb-1 ${
                      isActive 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}