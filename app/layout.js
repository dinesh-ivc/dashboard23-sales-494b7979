import './globals.css';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sales Dashboard',
  description: 'A comprehensive sales dashboard with CRUD operations for website visits, store visits, and product data',
};

export default async function RootLayout({ children }) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar session={session} />
          <main className="flex-1 bg-gray-50 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}