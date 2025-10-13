'use client';

import PostList from '@/app/blog/components/PostList';
import Pagination from '@/components/Pagination';
import { PostType } from '@/types/PostType';
import SectionWrapper from '@/components/SectionWrapper';
import BlogFitler from '@/app/blog/components/BlogFitler';
import { usePathname } from 'next/navigation';

type BlogPageClientProps = {
  allPosts: PostType[];
  posts: PostType[];
  activePage: number;
  limit: number;
  total: number;
};

const BlogPageClient = ({ allPosts, posts, activePage, limit, total }: BlogPageClientProps) => {
  const pathname = usePathname();

  return (
    <SectionWrapper
      title="Blog"
      subtitle=""
      className="px-4 max-w-7xl mx-auto pb-[700px] mt-[100px]"
    >
      <BlogFitler posts={allPosts} />
      <PostList posts={posts} />
      <Pagination
        activePage={activePage}
        limit={limit}
        total={total}
        mode="url"
        pathname={pathname}
      />
    </SectionWrapper>
  );
};

export default BlogPageClient;
