'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import SectionWrapper from '@/components/SectionWrapper';
import { ArtworkType } from '@/types/ArtworkType';
import ArtworkModal from '@/app/artwork/components/ArtworkModal';
import ArtworkItem from '../../components/ArtworkItem';

interface MarqueeRowProps {
  artworks: ArtworkType[];
  likeItemList: ArtworkType[];
  setLikeItemList: React.Dispatch<React.SetStateAction<ArtworkType[]>>;
  reverse?: boolean;
  onSelect: (artwork: ArtworkType) => void;
}

const MarqueeRow = ({
  artworks,
  likeItemList,
  setLikeItemList,
  reverse = false,
  onSelect,
}: MarqueeRowProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const [rowWidth, setRowWidth] = useState(0);

  const mod = (n: number, m: number) => ((n % m) + m) % m;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => setRowWidth(el.scrollWidth / 2 || 0);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const rowItems = reverse
    ? [...artworks.slice().reverse(), ...artworks.slice().reverse()]
    : [...artworks, ...artworks];

  const startMarquee = async (fromX = 0) => {
    if (!rowWidth || rowWidth <= 0) return;
    x.set(fromX);

    await controls.start({
      x: [fromX, reverse ? 0 : -rowWidth],
      transition: {
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        duration: 100,
      },
    });
  };

  useEffect(() => {
    if (rowWidth > 0) void startMarquee(reverse ? -rowWidth : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowWidth, reverse]);

  const handlePause = () => controls.stop();
  const handleResume = () => {
    if (!rowWidth || rowWidth <= 0) {
      void startMarquee(0);
      return;
    }
    const currentX = x.get();
    const fromX = !reverse ? -mod(-currentX, rowWidth) : -rowWidth + mod(currentX, rowWidth);
    void startMarquee(fromX);
  };

  return (
    <motion.div
      ref={containerRef}
      className="flex gap-16"
      animate={controls}
      style={{ x }}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      {rowItems.map((artwork, i) => (
        <ArtworkItem
          key={i}
          artwork={artwork}
          likeItemList={likeItemList}
          setLikeItemList={setLikeItemList}
          onSelect={onSelect}
          className="flex-shrink-0 w-[clamp(220px,25vw,360px)] cursor-pointer group pb-24"
        />
      ))}
    </motion.div>
  );
};

const ArtworkSection = ({ artworks }: { artworks: ArtworkType[] }) => {
  const [likeItemList, setLikeItemList] = useState<ArtworkType[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkType>(null!);

  useEffect(() => {
    setLikeItemList(
      artworks.map((art) => ({
        ...art,
        likesPerUser: 0,
      })),
    );
  }, [artworks]);

  return (
    <>
      <SectionWrapper
        title="Artwork"
        subtitle="Unfolding ideas, fragments of inspiration, and scattered imagination through lines, colors, textures, and playful creativity—where paper and pixels become stages for stories, emotions, and worlds that emerge and shift, each stroke, shape, and digital mark expressing themselves in unexpected, delightful ways."
      >
        <section className="relative overflow-hidden py-4 md:py-16 flex flex-col gap-16 md:gap-8">
          <MarqueeRow
            artworks={likeItemList}
            likeItemList={likeItemList}
            setLikeItemList={setLikeItemList}
            reverse={false}
            onSelect={setSelectedArtwork}
          />
          <MarqueeRow
            artworks={likeItemList}
            likeItemList={likeItemList}
            setLikeItemList={setLikeItemList}
            reverse={true}
            onSelect={setSelectedArtwork}
          />
        </section>
      </SectionWrapper>

      <ArtworkModal
        isOpen={!!selectedArtwork}
        onClose={() => setSelectedArtwork(null!)}
        artwork={selectedArtwork}
        likeItemList={likeItemList}
        setLikeItemList={setLikeItemList}
      />
    </>
  );
};

export default ArtworkSection;
