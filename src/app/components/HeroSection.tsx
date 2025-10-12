'use client';

import DisperseText from '@/components/DisperseText';
import SectionWrapper from '@/components/SectionWrapper';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

const PixelTrailBackground = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colorize = useCallback((el: HTMLDivElement) => {
    el.style.backgroundColor = 'var(--flame-500)';

    setTimeout(() => {
      el.style.backgroundColor = 'transparent';
    }, 300);
  }, []);

  if (windowSize.width === 0) return null;

  const colWidth = Math.floor(windowSize.width * 0.05); // ~5vw

  const numCols = Math.ceil(windowSize.width / colWidth);

  const numBlocks = Math.ceil(windowSize.height / colWidth);

  return (
    <div className="absolute inset-0 flex overflow-hidden z-0">
      {Array.from({ length: numCols }).map((_, colIdx) => (
        <div key={colIdx} style={{ width: `${colWidth}px` }} className="flex flex-col">
          {Array.from({ length: numBlocks }).map((_, blockIdx) => (
            <div
              key={blockIdx}
              style={{ height: `${colWidth}px` }}
              className="w-full"
              onMouseEnter={(e) => colorize(e.currentTarget)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
const HeroScroller = () => {
  return (
    <div className="absolute bottom-12 left-0 w-full flex justify-center">
      <a href="#interest">
        <div className="w-[35px] h-[64px] rounded-full border-4 border-lgdg-300 flex items-start p-2">
          <m.div
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
            className="w-3 h-3 bg-[var(--bw)] rounded-[30%] mb-1"
          />
        </div>
      </a>
    </div>
  );
};

const HeroSection = () => {
  return (
    <LazyMotion features={domAnimation}>
      <SectionWrapper className="relative w-full flex flex-col items-center justify-center text-center min-h-[calc(100vh-64px)] max-w-screen px-4">
        <PixelTrailBackground />

        <div className="flex flex-col items-center z-10 space-y-4">
          <m.h1 className="text-6xl lg:text-7xl font-bodyBold font-flashy text-dglg-900 tracking-widest">
            <DisperseText>kiki です、よろしくね！</DisperseText>
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="mt-4 md:text-lg max-w-[45ch] sm:max-w-[65ch] lg:max-w-full"
          >
            Come hang out here—a whimsical playground of creativity, where my doodles and dreams
            drift through time and space.
          </m.p>
        </div>

        <HeroScroller />
      </SectionWrapper>
    </LazyMotion>
  );
};

export default HeroSection;
