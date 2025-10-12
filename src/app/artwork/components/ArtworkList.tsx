'use client';

import { FC, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/motion';
import type { ArtworkType } from '@/types/ArtworkType';
import ArtworkModal from './ArtworkModal';
import ArtworkItem from '@/components/ArtworkItem';
import SortTabs, { SortOption } from '@/components/SortTabs';

type ArtworkListProps = {
  artworks: ArtworkType[];
};

const ArtworkList: FC<ArtworkListProps> = ({ artworks }) => {
  const [mounted, setMounted] = useState(false);
  const [likeItemList, setLikeItemList] = useState<ArtworkType[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkType>(null!);
  const [sortBy, setSortBy] = useState<SortOption>(null);

  const getLikesPerUser = (id: number): number =>
    typeof window !== 'undefined' ? Number(localStorage.getItem(`${id}`)) || 0 : 0;

  useMemo(() => {
    const enriched = artworks.map((artwork) => ({
      ...artwork,
      likesPerUser: getLikesPerUser(artwork.id),
    }));
    setLikeItemList(enriched);
    setMounted(true);
  }, [artworks]);

  const sortedArtworks = useMemo(() => {
    if (!sortBy) return likeItemList;

    const sorted = [...likeItemList];
    switch (sortBy) {
      case 'mostPopular':
        sorted.sort((a, b) => b.like - a.like);
        break;
      case 'newest':
        sorted.sort((a, b) => Number(b.year) - Number(a.year));
        break;
      case 'oldest':
        sorted.sort((a, b) => Number(a.year) - Number(b.year));
        break;
    }
    return sorted;
  }, [likeItemList, sortBy]);

  if (!mounted || artworks.length === 0) return null;

  return (
    <>
      {/* Sorting Tabs */}
      <SortTabs sortBy={sortBy} onChange={setSortBy} />

      {/* Artwork Grid */}
      <motion.div
        className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 px-52 gap-24 md:px-8"
        variants={staggerContainer(0.5, 0.5)}
        initial="hidden"
        animate="show"
      >
        {sortedArtworks.map((artwork, i) => (
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

      {/* Artwork Modal */}
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
