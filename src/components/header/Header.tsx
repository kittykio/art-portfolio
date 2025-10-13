'use client';

import Link from 'next/link';
import { RiGalleryLine, RiGalleryFill } from 'react-icons/ri';
import { useThemeContext } from '@/components/ThemeContext';
import { useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import ThemeToggle from '@/components/header/ThemeToggle';
import { PiNotePencilBold, PiNotePencilFill } from 'react-icons/pi';
import { LogoCircle, LogoFill, LogoOutline } from '../Logo';

// The main Header component, providing site navigation and theme toggling.
const Header = () => {
  // Retrieves the current theme state (light/dark) to select appropriate icons.
  const { resolvedTheme } = useThemeContext();
  // State to control the open/closed status of the mobile navigation menu.
  const [menuOpen, setMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // This runs only on the client after initial render/hydration
    setMounted(true);
  }, []);

  const themeForIcon = mounted ? resolvedTheme : 'light';

  // Defines the structure for a navigation item.
  type Navigation = {
    label: string;
    href: string;
    icon: IconType;
  };

  // The array of navigation links, using theme-dependent icons.
  const navigation: Navigation[] = [
    {
      label: 'artwork',
      href: '/artwork',
      // Selects the filled or outlined icon based on the current theme for contrast.
      icon: themeForIcon === 'light' ? RiGalleryLine : RiGalleryFill,
    },
    {
      label: 'blog',
      href: '/blog',
      // Selects the filled or outlined icon based on the current theme for contrast.
      icon: themeForIcon === 'light' ? PiNotePencilBold : PiNotePencilFill,
    },
  ];

  if (!mounted) return null;

  return (
    // The fixed header container with blur effect and consistent height.
    <header className="z-30 fixed top-0 left-0 w-full bg-wb-blur-50 backdrop-blur-sm px-8 flex justify-between items-center h-[72px]">
      {/* Logo link, navigates to the homepage. */}
      <Link href="/" className="flex gap-4 items-center">
        <div className="w-[36px] h-[36px]">
          <LogoFill />
        </div>
        <p className="text-[30px] font-flashy text-dglg-900">kitty kio</p>
      </Link>

      {/* Desktop Navigation - Hidden on mobile screens. */}
      <nav className="hidden md:flex text-2xl font-heading gap-6 items-center">
        {navigation.map((nav) => {
          const Icon = nav.icon;
          return (
            <Link
              key={nav.label}
              href={nav.href}
              className="flex items-center justify-center gap-2 uppercase hover:text-flame-500 transition"
            >
              <Icon size={28} />
              <span>{nav.label}</span>
            </Link>
          );
        })}
        {/* Theme toggle for desktop view. */}
        <div className="flex items-center justify-center">
          <ThemeToggle size={40} />
        </div>
      </nav>

      {/* Mobile Header Right Section - Contains theme toggle and menu button. */}
      <div className="flex items-center justify-center gap-3 md:hidden">
        {/* Theme toggle for mobile view. */}
        <div className="flex items-center justify-center scale-90">
          <ThemeToggle size={40} />
        </div>

        {/* Mobile menu toggle button. */}
        <button
          className=" text-[30px]"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {/* Displays the hamburger or close icon based on menu state. */}
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Menu Content - Uses AnimatePresence for smooth entry/exit animations. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            // Defines the initial state for the animation.
            initial={{ opacity: 0, y: -10 }}
            // Defines the animated state.
            animate={{ opacity: 1, y: 0 }}
            // Defines the exit state for the animation.
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            // Styling for the full-width dropdown menu.
            className="absolute top-full left-0 w-full bg-bg flex flex-col items-center gap-6 py-8 px-4 border-t border-dglg-700 md:hidden z-30"
          >
            {navigation.map((nav) => {
              const Icon = nav.icon;
              return (
                // Individual mobile navigation link.
                <Link
                  key={nav.label}
                  href={nav.href}
                  // Closes the menu when a link is clicked.
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-3 text-xl uppercase hover:text-flame-500 transition"
                >
                  <Icon size={28} />
                  <span>{nav.label}</span>
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
