"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Code, Menu, User } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useLanguage } from "@/context/language-provider";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { dictionary } = useLanguage();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAdminClick = () => {
    if (user) {
      router.push('/admin');
    } else {
      router.push('/login');
    }
  };

  const navItems = [
    { name: dictionary.nav.projects, href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: dictionary.nav.experience, href: "#experience" },
    { name: dictionary.nav.education, href: "#education" },
    { name: dictionary.nav.blog, href: "#blog" },
    { name: dictionary.nav.contact, href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-headline">FlutterFolio Pro</span>
        </Link>
        <nav className="hidden md:flex gap-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
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
          <div className="md:hidden">
            {isMounted ? (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-6 pt-10">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    ))}
                    {/* Removed admin button as requested */}
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <div className="w-10 h-10" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
