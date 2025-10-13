'use client';

import { useState, useCallback, useMemo } from 'react';
import ArtworkList from '@/app/artwork/components/ArtworkList';
import ArtworkFilter from '@/app/artwork/components/ArtworkFilter';
import { ArtworkType } from '@/types/ArtworkType';
import SectionWrapper from '@/components/SectionWrapper';
import Pagination from '@/components/Pagination';
import SortTabs, { SortOption } from '@/components/SortTabs';

type ArtworkPageClientProps = {
  initialArtworks: ArtworkType[];
};

const ArtworkPageClient = ({ initialArtworks }: ArtworkPageClientProps) => {
  const [filteredArtworks, setFilteredArtworks] = useState<ArtworkType[]>(initialArtworks);
  const [activePage, setActivePage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>(null);
  const limit = 8;

  const handleFilterChange = useCallback((newFiltered: ArtworkType[]) => {
    setFilteredArtworks(newFiltered);
    setActivePage(1);
  }, []);

  // 🔥 Sort the *entire* filtered artwork list before pagination
  const sortedArtworks = useMemo(() => {
    if (!sortBy) return filteredArtworks;

    const sorted = [...filteredArtworks];
    switch (sortBy) {
      case 'mostPopular':
        sorted.sort((a, b) => b.like - a.like);
        break;

      case 'newest':
        sorted.sort(
          (a, b) =>
            new Date(b.date || '1970/01/01').getTime() - new Date(a.date || '1970/01/01').getTime(),
        );
        break;

      case 'oldest':
        sorted.sort(
          (a, b) =>
            new Date(a.date || '1970/01/01').getTime() - new Date(b.date || '1970/01/01').getTime(),
        );
        break;
    }
    return sorted;
  }, [filteredArtworks, sortBy]);

  // ⚙️ Apply pagination *after* sorting
  const start = (activePage - 1) * limit;
  const end = start + limit;
  const paginatedArtworks = sortedArtworks.slice(start, end);

  return (
    <SectionWrapper title="Artwork" className="px-4 max-w-7xl mx-auto pb-[700px] mt-[100px]">
      <ArtworkFilter artworks={initialArtworks} onFilterChange={handleFilterChange} />

      {/* Sorting Tabs */}
      <SortTabs sortBy={sortBy} onChange={setSortBy} />

      {/* Display paginated & sorted artworks */}
      <ArtworkList artworks={paginatedArtworks} />

      <Pagination
        activePage={activePage}
        limit={limit}
        total={sortedArtworks.length}
        mode="client"
        onPageChange={setActivePage}
      />
    </SectionWrapper>
  );
};

export default ArtworkPageClient;
