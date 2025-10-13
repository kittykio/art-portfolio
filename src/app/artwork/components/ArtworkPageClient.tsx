'use client';

import { useState, useCallback } from 'react';
import ArtworkList from '@/app/artwork/components/ArtworkList';
import ArtworkFilter from '@/app/artwork/components/ArtworkFilter';
import { ArtworkType } from '@/types/ArtworkType';
import SectionWrapper from '@/components/SectionWrapper';
import Pagination from '@/components/Pagination';

type ArtworkPageClientProps = {
  initialArtworks: ArtworkType[];
};

const ArtworkPageClient = ({ initialArtworks }: ArtworkPageClientProps) => {
  const [filteredArtworks, setFilteredArtworks] = useState<ArtworkType[]>(initialArtworks);

  const [activePage, setActivePage] = useState(1);
  const limit = 8;

  const start = (activePage - 1) * limit;
  const end = start + limit;
  const paginatedArtworks = filteredArtworks.slice(start, end);

  const handleFilterChange = useCallback((newFiltered: ArtworkType[]) => {
    setFilteredArtworks(newFiltered);
    setActivePage(1);
  }, []);

  return (
    <SectionWrapper title="Artwork" className="px-4 max-w-7xl mx-auto pb-[700px] mt-[100px]">
      <ArtworkFilter artworks={initialArtworks} onFilterChange={handleFilterChange} />

      <ArtworkList artworks={paginatedArtworks} />

      <Pagination
        activePage={activePage}
        limit={limit}
        total={filteredArtworks.length}
        mode="client"
        onPageChange={setActivePage}
      />
    </SectionWrapper>
  );
};

export default ArtworkPageClient;
