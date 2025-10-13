'use client';

import { useRef } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import General from './General';
import Connect from '@/components/footer/Connect';
import { SiBuymeacoffee } from 'react-icons/si';
import { Magnetic } from '../Magnetic';
import Link from 'next/link';
import DisperseText from '../DisperseText';
import { LogoCircle } from '../Logo';

const Footer = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-500, 0], { clamp: false });

  return (
    <section className="relative w-full -mt-20">
      <motion.div
        ref={container}
        style={{ y }}
        className="relative flex flex-col items-center justify-center w-full text-base bg-lgdg-300 [clip-path:ellipse(100%_100%_at_50%_100%)] px-4"
        transition={{ type: 'spring', stiffness: 50 }}
      >
        <div className="w-full max-w-7xl flex items-center justify-center lg:items-start lg:justify-between flex-wrap gap-8 lg:gap-24 mt-48 mb-24">
          {/* Brand logo and motto section */}
          <div className="flex flex-col gap-8 items-center text-center">
            <p className="text-6xl font-flashy text-dglg-900">
              <DisperseText>kitty kio</DisperseText>
            </p>

            <p className="max-w-[40ch]">
              Anyone with an inner artist deserves a chance to follow the creative path.
            </p>

            <div className="w-[128px] h-[128px]">
              <LogoCircle />
            </div>

            {/* Buy Me a Coffee button */}
            <Magnetic>
              <Link
                href="https://buymeacoffee.com/kittykio"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-dglg-700 font-playful text-2xl text-lgdg-300 hover:text-gray-100 font-bodyBold hover:bg-flame-500 transition-all shadow-md"
              >
                <SiBuymeacoffee size={32} />
                Buy Kiki a Coffee
              </Link>
            </Magnetic>
          </div>

          {/* Footer links */}
          <div className="flex flew-row justify-center flex-wrap gap-16 lg:gap-32 flex-wrap">
            <General />
            <Connect />
          </div>
        </div>

        <p className="mb-8 flex-none">©2025-present Kitty Kio. All rights reserved.</p>
      </motion.div>
    </section>
  );
};

export default Footer;
