import React from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.scss';
import '@/styles/_variables.scss';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';

import {
  heading,
  body,
  bodyBold,
  flashy,
  drool,
  awkward,
  spacey,
  playful,
  saucy,
  loud,
} from '@/constants/fonts';

import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import ScrollSlider from '@/components/scroll-slider/ScrollSlider';
import ThemeContextProvider from '@/components/ThemeContext';
import { ThemeProvider } from 'next-themes';
import connectToMongoDB from '@/lib/db';

const GA_TAG_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export const metadata: Metadata = {
  title: 'Kitty Kio',
  description: 'A personal blog and portfolio site.',
  keywords: [
    'Artwork',
    'Sketch',
    'Doodle',
    'Illustration',
    'Next.js',
    'Blog',
    'Portfolio',
    'React',
    'Web Development',
  ],
  authors: [{ name: 'Kitty Kio', url: 'https://kittykio.com' }],
  creator: 'Kitty Kio',
  publisher: 'Kitty Kio',
  icons: {
    icon: [
      { url: '/favicon_io/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/favicon_io/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon_io/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Kitty Kio',
    description: 'A personal artwork portfolio and blog site.',
    type: 'website',
    url: 'https://kittykio.com',
    images: [
      {
        url: 'https://kittykio.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kitty Kio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kitty Kio',
    description: 'A personal blog and portfolio site.',
    images: ['https://kittykio.com/og-image.png'],
  },
};

export const viewport = 'width=device-width, initial-scale=1';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  await connectToMongoDB();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${heading.variable} ${body.variable} ${bodyBold.variable} ${flashy.variable} ${drool.variable} ${awkward.variable} ${spacey.variable} ${playful.variable} ${saucy.variable} ${loud.variable} font-body bg-bg min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          <ThemeContextProvider>
            {/* Header */}
            <Header />

            {/* Main content fills remaining space */}
            <main className="flex-1 w-full flex flex-col items-center justify-start mt-16">
              <ScrollSlider>{children}</ScrollSlider>
            </main>

            {/* Footer always at bottom */}
            <Footer />
          </ThemeContextProvider>

          {GA_TAG_ID && <GoogleAnalytics gaId={GA_TAG_ID} />}
          <VercelAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
