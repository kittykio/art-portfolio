'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import Titles from '@/app/components/interest-section/Titles';
import Descriptions from '@/app/components/interest-section/Descriptions';
import SectionWrapper from '@/components/SectionWrapper';
import styles from '@/app/components/interest-section/style.module.scss';

// ----------------------
// Data Type
// ----------------------
export type DataType = { title: string; description: string; speed: number };

export const data: DataType[] = [
  {
    title: 'Character Design',
    description:
      'Bringing unique characters to life through expressive poses, detailed linework, and imaginative design. My focus is on conveying personality and emotion, from quirky doodles to polished full-body illustrations.',
    speed: 0.5,
  },
  {
    title: 'Doodles & Sketches',
    description:
      'Spontaneous, playful drawings that capture ideas and moods quickly. These doodles often serve as the foundation for larger works and reflect my creative process in its raw, energetic form.',
    speed: 0.5,
  },
  {
    title: 'Digital Painting',
    description:
      'Crafting vibrant digital artworks with strong use of color, light, and atmosphere. This includes both stylized and semi-realistic approaches to build engaging illustrations and concept art.',
    speed: 0.67,
  },
  {
    title: 'Comics & Storytelling',
    description:
      'Visual narratives told through sequential art. From short strips to multi-panel stories, I explore humor, emotion, and world-building through expressive characters and dynamic layouts.',
    speed: 0.8,
  },
  {
    title: 'Merch & Prints',
    description:
      'Designing artwork for stickers, prints, and other merchandise. These artworks are created to be bold, eye-catching, and appealing to fans who want to take a artwork of the art into their everyday lives.',
    speed: 0.8,
  },
];

// ----------------------
// Mobile Card
// ----------------------
type MobileCardProps = { artwork: DataType };

const MobileCard: React.FC<MobileCardProps> = ({ artwork }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full border-b border-dglg-700">
      <button
        className="w-full flex items-center justify-between gap-4 p-4 bg-bg font-bodyBold uppercase text-lg"
        onClick={() => setOpen(!open)}
      >
        <span className="flex-1 truncate">{artwork.title}</span>
        <span className="shrink-0 text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <m.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="px-4 py-3 text-sm max-w-xl mx-auto"
        >
          {artwork.description}
        </m.div>
      )}
    </div>
  );
};

// ----------------------
// Desktop Card
// ----------------------
const DesktopCard: React.FC = () => {
  const [selectedInterest, setSelectedInterest] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      <Titles data={data} setSelectedArtwork={setSelectedInterest} />
      <Descriptions data={data} selectedArtwork={selectedInterest} />
    </div>
  );
};

// ----------------------
// Interest Section
// ----------------------
const InterestSection: React.FC = () => {
  return (
    <SectionWrapper
      title="Interest"
      subtitle="Journeying through the vibrant realms of creativity, imagination, and curiosity—one sketch, doodle, story, and spontaneous idea at a time, where each exploration sparks surprising discoveries, and every small creation adds color and texture to the bigger tapestry of inspiration."
    >
      <div className={styles.main}>
        {/* Desktop layout */}
        <div className={`hidden md:block max-w-7xl ${styles.expertise}`}>
          <DesktopCard />
        </div>

        {/* Mobile layout */}
        <div className="block md:hidden space-y-4 px-6 w-full">
          {data.map((artwork, i) => (
            <MobileCard key={i} artwork={artwork} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default InterestSection;
