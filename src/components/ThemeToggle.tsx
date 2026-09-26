'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch (e) {}
    }
  };

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-lg border border-[#E7E7EE] dark:border-[#232326] bg-transparent ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-lg border border-[#E7E7EE] dark:border-[#232326] bg-[#FFFFFF] dark:bg-[#18181B] text-[#525252] dark:text-[#A1A1AA] hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#EDF0F4] dark:hover:bg-[#222226] transition-all duration-200 cursor-pointer flex items-center justify-center ${className}`}
      aria-label={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      title={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#E0511F] transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#525252] transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
};
