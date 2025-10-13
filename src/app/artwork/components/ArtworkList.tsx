'use client';

import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/motion';
import type { ArtworkType } from '@/types/ArtworkType';
import ArtworkModal from './ArtworkModal';
import ArtworkItem from '@/components/ArtworkItem';

type ArtworkListProps = {
  artworks: ArtworkType[];
};

const ArtworkList: FC<ArtworkListProps> = ({ artworks }) => {
  const [mounted, setMounted] = useState(false);
  const [likeItemList, setLikeItemList] = useState<ArtworkType[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkType>(null!);

  const getLikesPerUser = (id: number): number =>
    typeof window !== 'undefined' ? Number(localStorage.getItem(`${id}`)) || 0 : 0;

  useEffect(() => {
    const enriched = artworks.map((artwork) => ({
      ...artwork,
      likesPerUser: getLikesPerUser(artwork.id),
    }));
    setLikeItemList(enriched);
    setMounted(true);
  }, [artworks]);

  if (!mounted || artworks.length === 0) return null;

  return (
    <>
      <motion.div
        className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 px-52 gap-24 md:px-8"
        variants={staggerContainer(0.5, 0.5)}
        initial="hidden"
        animate="show"
      >
        {likeItemList.map((artwork, i) => (
          <motion.div
            key={artwork.id}
            className="break-inside-avoid w-full relative group pb-52 md:pb-36"
            variants={fadeIn('up', 'spring', i * 0.1, 1)}
          >
            <ArtworkItem
              key={i}
              artwork={artwork}
              likeItemList={likeItemList}
              setLikeItemList={setLikeItemList}
              onSelect={setSelectedArtwork}
            />
          </motion.div>
        ))}
      </motion.div>

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

export default ArtworkList;
