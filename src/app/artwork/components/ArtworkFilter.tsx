'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { ArtworkType } from '@/types/ArtworkType';
import { FilterTag } from '@/components/Tag';
import FilterWrapper from '@/components/FilterWrapper';
import gsap from 'gsap';

type Props = {
  artworks: ArtworkType[];
  onFilterChange: (filtered: ArtworkType[]) => void;
};

type FilterKey = 'years' | 'categories' | 'medium' | 'tags';

const ArtworkFilter = ({ artworks, onFilterChange }: Props) => {
  const [filters, setFilters] = useState<Record<FilterKey, Set<string>>>({
    years: new Set(),
    categories: new Set(),
    medium: new Set(),
    tags: new Set(),
  });

  const background = useRef<HTMLDivElement>(null!);
  const setBackground = (isActive: boolean) => {
    if (!background.current) return;
    gsap.to(background.current, { opacity: isActive ? 0.6 : 0, duration: 0.3 });
  };

  const extractYear = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    const match = dateString.match(/^\d{4}/);
    return match ? match[0] : 'Unknown';
  };

  // Precompute unique filter options
  const filterOptions = useMemo(
    () => ({
      years: Array.from(
        new Set(artworks.map((a) => extractYear(a.date)).filter((y) => y && y !== 'Unknown')),
      ).sort((a, b) => Number(b) - Number(a)),
      categories: Array.from(new Set(artworks.map((a) => a.category))),
      medium: Array.from(new Set(artworks.map((a) => a.medium))),
      tags: Array.from(new Set(artworks.flatMap((a) => a.tags))),
    }),
    [artworks],
  );

  // Toggle filter
  const toggleFilter = (key: FilterKey, value: string) => {
    setFilters((prev) => {
      const newSet = new Set(prev[key]);
      if (newSet.has(value)) newSet.delete(value);
      else newSet.add(value);
      return { ...prev, [key]: newSet };
    });
  };

  // Clear all filters
  const handleClearAll = () => {
    setFilters({
      years: new Set(),
      categories: new Set(),
      medium: new Set(),
      tags: new Set(),
    });
  };

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((set) => set.size > 0),
    [filters],
  );

  // Apply filters
  useEffect(() => {
    const filtered = artworks.filter((artwork) => {
      const { years, categories, medium, tags } = filters;
      const year = extractYear(artwork.date);

      return (
        (years.size === 0 || years.has(year)) &&
        (categories.size === 0 || categories.has(artwork.category)) &&
        (medium.size === 0 || medium.has(artwork.medium)) &&
        (tags.size === 0 || artwork.tags.some((t) => tags.has(t)))
      );
    });

    onFilterChange(filtered);
  }, [filters, artworks, onFilterChange]);

  // Render filter group
  const renderFilterGroup = (key: FilterKey, options: string[], colClasses: string) => (
    <div className={`flex flex-col gap-2 ${colClasses}`}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt, i) => (
          <FilterTag
            key={opt}
            i={i}
            tag={opt}
            handleOnChange={() => toggleFilter(key, opt)}
            setRef={setBackground}
            active={filters[key].has(opt)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <FilterWrapper onClearAll={handleClearAll} showClear={hasActiveFilters} background={background}>
      <div className="flex flex-wrap sm:flex-nowrap w-full gap-4 py-8">
        {/* Left half: Years + Categories + Medium */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/4">
          {renderFilterGroup('years', filterOptions.years, 'w-full md:w-1/4')}
          {renderFilterGroup('categories', filterOptions.categories, 'w-full md:w-1/4')}
          {renderFilterGroup('medium', filterOptions.medium, 'w-full md:w-2/4')}
        </div>

        {/* Right half: Tags */}
        {renderFilterGroup('tags', filterOptions.tags, 'w-full md:w-2/4 min-w-[50%]')}
      </div>
    </FilterWrapper>
  );
};

export default ArtworkFilter;
