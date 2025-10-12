'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionWrapper from '@/components/SectionWrapper';

const para = `My interests are woven into the way I create and see the world. I find inspiration in music that shifts my mood, in films that tell stories beyond words, and in traveling to places that feel both unfamiliar and strangely familiar. I love exploring design not only as a craft but as a way of experiencing life—whether through architecture, photography, or even the smallest details of everyday surroundings. These influences seep into my art and projects, giving them depth, warmth, and a sense of lived experience. They remind me that creativity is not only about what we make, but also about how we live and what we notice along the way.`;

const IntroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    gsap.to(lettersRef.current, {
      opacity: 1,
      ease: 'power1.out',
      stagger: 0.01,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
        end: 'bottom 30%',
        scrub: true,
      },
    });
  }, []);

  const addRef = (el: HTMLSpanElement | null) => {
    if (el && !lettersRef.current.includes(el)) {
      lettersRef.current.push(el);
    }
  };

  const splitLetters = (text: string) =>
    text.split('').map((char, i) => (
      <span key={`${char}_${i}`} ref={addRef} className="opacity-20">
        {char}
      </span>
    ));

  const firstLetter = para[0];
  const rest = para.slice(1);

  return (
    <SectionWrapper className="w-full flex justify-center my-24 py-24 md:my-48 md:py-48 text-gray-500 text-lg md:text-3xl leading-[1.5] font-bodyBold px-4">
      <div ref={containerRef} className="max-w-3xl">
        <p className="relative">
          <span className="float-left text-7xl md:text-9xl leading-[1.5] mr-8 font-heading text-dglg-900 font-bodyBold">
            {firstLetter}
          </span>
          {splitLetters(rest)}
        </p>
      </div>
    </SectionWrapper>
  );
};

export default IntroSection;
