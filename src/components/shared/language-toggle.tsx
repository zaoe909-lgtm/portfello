'use client';

import * as React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/context/language-provider';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageToggle() {
  const { setLanguage, dictionary } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('en')}>
          {dictionary.english}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('ar')}>
          {dictionary.arabic}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
