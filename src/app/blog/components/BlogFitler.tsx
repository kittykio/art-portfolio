import { useMemo, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';
import { postCategory } from '@/constants/postCategory';
import type { PostType } from '@/types/PostType';
import FilterWrapper from '@/components/FilterWrapper';
import { FilterTag } from '@/components/Tag';

type FilterType = string;

const BlogFilter = ({ posts }: { posts: PostType[] }) => {
  const pathname = usePathname();
  const router = useRouter();

  const background = useRef<HTMLDivElement>(null!);
  const setBackground = (isActive: boolean) => {
    if (!background.current) return;
    gsap.to(background.current, { opacity: isActive ? 0.6 : 0, duration: 0.3 });
  };

  const uniqueTags = useMemo(() => {
    if (!posts) return [];
    return Array.from(new Set(posts.flatMap((p) => (Array.isArray(p.tags) ? p.tags : []))));
  }, [posts]);

  const filters = useMemo<FilterType[]>(() => {
    const merged = [...postCategory, ...uniqueTags];
    return Array.from(new Set(merged));
  }, [uniqueTags]);

  const [selectedState, setSelectedState] = useState<FilterType[]>([]);

  useMemo(() => {
    const pathParts = pathname.split('/').filter(Boolean);
    const blogIndex = pathParts.indexOf('blog');
    const activeFilters = blogIndex !== -1 ? pathParts.slice(blogIndex + 1) : [];
    setSelectedState(activeFilters);
  }, [pathname]);

  const handleOnChange = (filter: FilterType) => {
    const exists = selectedState.includes(filter);
    const updated = exists
      ? selectedState.filter((state) => state !== filter)
      : [...selectedState, filter];
    setSelectedState(updated);

    const path = updated.length ? `/blog/${updated.map(encodeURIComponent).join('/')}` : `/blog`;
    router.push(path);
  };

  const handleClearAll = () => {
    setSelectedState([]);
    router.push('/blog');
  };

  return (
    <FilterWrapper
      onClearAll={handleClearAll}
      showClear={selectedState.length > 0}
      background={background}
    >
      <div className="flex flex-wrap gap-2 justify-center py-8">
        {filters.map((filter, i) => (
          <FilterTag
            key={filter}
            i={i}
            tag={filter}
            handleOnChange={handleOnChange}
            setRef={setBackground}
            active={selectedState.includes(filter)}
          />
        ))}
      </div>
    </FilterWrapper>
  );
};

export default BlogFilter;
