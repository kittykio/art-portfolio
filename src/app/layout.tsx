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
  title: 'Momo Art',
  description: 'A personal blog and art portfolio site.',
  keywords: [
    'Artwork',
    'Sketch',
    'Doodle',
    'Illustration',
    'Blog',
    'Portfolio',
    'Creative Process',
    'Artistic Journey',
    'Art Hobbyist',
  ],
  authors: [{ name: 'Momo Art', url: 'https://momoart.vercel.app' }],
  creator: 'Momo Art',
  publisher: 'Momo Art',
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
    title: 'Momo Art',
    description: 'A personal blog and art portfolio site.',
    type: 'website',
    url: 'https://momoart.vercel.app',
    images: [
      {
        url: 'https://momoart.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Momo Art',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Momo Art',
    description: 'A personal blog and art portfolio site.',
    images: ['https://momoart.vercel.app/og-image.png'],
  },
};

export const viewport = 'width=device-width, initial-scale=1';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  await connectToMongoDB();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${heading.variable} ${body.variable} ${bodyBold.variable} ${flashy.variable} ${drool.variable} ${awkward.variable} ${spacey.variable} ${playful.variable} ${saucy.variable} ${loud.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          <ThemeContextProvider>
            <div className="font-body bg-bg min-h-screen flex flex-col">
              {/* Header */}
              <Header />

              {/* Main content fills remaining space */}
              <main className="flex-1 w-full min-h-[calc(100vh-64px)] flex flex-col items-center mt-16">
                <ScrollSlider>{children}</ScrollSlider>
              </main>
              {/* Footer always at bottom */}
              <Footer />
            </div>
          </ThemeContextProvider>
          {GA_TAG_ID && <GoogleAnalytics gaId={GA_TAG_ID} />}
          <VercelAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
