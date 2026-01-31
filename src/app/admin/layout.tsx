"use client";

import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { LanguageToggle } from '@/components/shared/language-toggle';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card p-4 border-b flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold font-headline text-primary">
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-4">
          {isMounted ? (
            <>
              <ThemeToggle />
              <LanguageToggle />
            </>
          ) : (
            <>
              <div className="w-10 h-10" />
              <div className="w-10 h-10" />
            </>
          )}
          <Button asChild variant="outline" size="icon">
            <Link href="/" aria-label="Go to homepage">
              <Home className="h-4 w-4" />
            </Link>
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </header>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
