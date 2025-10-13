'use client';

import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { fadeIn, staggerContainer } from '@/utils/motion';
import SectionWrapper from '@/components/SectionWrapper';
import { Card, CardFloatWrapper } from '@/components/CardFloatWrapper';
import { motion, AnimatePresence } from 'framer-motion';

type CardType = { front: string; back: string[] | ReactNode };

const cards: CardType[] = [
  {
    front: 'Facts',
    back: ['Dreamer', 'INTJ', 'Pisces', 'Go-getter', 'Organized', 'Minimalist'],
  },
  { front: 'Languages', back: ['Burmese', 'English', 'Japanese'] },
  {
    front: 'Hobbies',
    back: ['Sketching', 'Travel', 'Cooking', 'Music', 'Fitness', 'Fashion', 'Reading'],
  },
  {
    front: 'Dislikes',
    back: ['Heights', 'Unfinished Business', 'Untidiness', 'Procrastination', 'Losing'],
  },
  {
    front: 'Favorites',
    back: ['Coffee', 'Chocolate', 'Noodles', 'Cats', 'Nuts', 'Sushi'],
  },
  {
    front: 'TV Series',
    back: [
      'Wednesday',
      'Harry Potter',
      'Fantastic Beasts',
      'The Maze Runner',
      'The Hunger Games',
      'Detective Conan',
      'Kakegurui',
      'Demon Slayer',
    ],
  },
  {
    front: 'Games',
    back: ['Mobile Legends', 'PUBG', 'Pokemon Unite', 'Wild Rift'],
  },
  {
    front: 'Motto',
    back: [
      'Create Daily',
      'Stay Curious',
      'Less is More',
      'Make your own rules',
      'Today is the youngest you will ever be',
    ],
  },
  {
    front: 'Art Skills',
    back: [
      'Character Design',
      'Storyboarding & Storytelling',
      'Digital Painting',
      'Comics & Panels',
      'Sketching & Doodling',
      'Concept Art',
      'Procreate',
      'Clip Studio Paint',
      'Blender (3D)',
      'Figma',
    ],
  },
];

const AnimatedText = ({ text }: { text: string }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {text}
      </motion.div>
    </AnimatePresence>
  );
};

const FlipCard = ({
  front,
  back,
  size,
}: {
  front: string;
  back: string[] | ReactNode;
  size: CSSProperties;
}) => {
  const [index, setIndex] = useState(0);
  const isArray = Array.isArray(back);

  useEffect(() => {
    if (!isArray) return;
    const interval = setInterval(() => setIndex((i) => i + 1), 1500);
    return () => clearInterval(interval);
  }, [isArray]);

  return (
    <div className="relative w-full h-full [perspective:1200px] group" style={size}>
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] text-dglg-900">
        {/* Front side */}
        <Card rounded>{front}</Card>

        {/* Back side */}
        <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-flame-500 text-gray-100 p-4 text-center [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-lg">
          {isArray ? <AnimatedText text={back[index % back.length]} /> : <>{back}</>}
        </div>
      </div>
    </div>
  );
};

const GetToKnowMeSection = () => {
  const cardSize = { width: 180, height: 180 };

  return (
    <SectionWrapper
      title="Get to know me"
      subtitle="A messy, colorful mix of ideas, sketches, quirks, and fleeting thoughts—come peek behind the scenes of my creative chaos, where experiments, inspirations, mistakes, and little joys collide, revealing the hidden layers, playful impulses, and untamed energy that shape who I am and how I create."
    >
      <motion.section
        variants={staggerContainer(0.5, 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className="flex justify-center items-center flex-wrap gap-16 p-8 mx-auto max-w-3xl overflow-hidden "
      >
        {/* Grid of cards */}
        {cards.map((c, i) => (
          // Outer motion handles the entrance variant
          <motion.div
            key={i}
            variants={fadeIn('right', 'spring', i * 0.12, 0.85)}
            className="group"
          >
            {/* Inner motion handles the floating loop and in-view detection */}
            <CardFloatWrapper index={i}>
              <FlipCard front={c.front} back={c.back} size={cardSize} />
            </CardFloatWrapper>
          </motion.div>
        ))}
      </motion.section>
    </SectionWrapper>
  );
};

export default GetToKnowMeSection;
