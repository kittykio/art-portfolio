'use client';

import { FC, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/motion';
import { PostType } from '@/types/PostType';
import PostItem from '../../../components/PostItem';
import SortTabs, { SortOption } from '@/components/SortTabs';

type PostListProps = {
  posts: PostType[];
};

const PostList: FC<PostListProps> = ({ posts }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [postItemList, setPostItemList] = useState<PostType[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>(null);

  const getLikesPerUser = (id: number): number =>
    typeof window !== 'undefined' ? Number(localStorage.getItem(`${id}`)) || 0 : 0;

  useMemo(() => {
    const enriched: PostType[] = posts.map((post) => ({
      ...post,
      likesPerUser: getLikesPerUser(post.id),
    }));
    setPostItemList(enriched);
    setMounted(true);
  }, [posts]);

  const sortedPosts = useMemo(() => {
    if (!sortBy) return postItemList;

    const sorted = [...postItemList];
    switch (sortBy) {
      case 'mostPopular':
        sorted.sort((a, b) => b.like - a.like);
        break;
      case 'newest':
        sorted.sort(
          (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
        );
        break;
      case 'oldest':
        sorted.sort(
          (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
        );
        break;
    }
    return sorted;
  }, [postItemList, sortBy]);

  if (!mounted || posts.length === 0) return null;

  return (
    <>
      {/* Sorting Tabs */}
      <SortTabs sortBy={sortBy} onChange={setSortBy} />

      {/* Posts Grid */}
      <motion.div
        className="columns-1 sm:columns-2 lg:columns-3 gap-24"
        variants={staggerContainer(0.5, 0.5)}
        initial="hidden"
        animate="show"
      >
        {sortedPosts.map((post, i) => (
          <motion.div
            key={post.id}
            className="break-inside-avoid w-full relative group pb-36"
            variants={fadeIn('up', 'spring', i * 0.1, 1)}
          >
            <PostItem
              index={i}
              post={post}
              postItemList={postItemList}
              setPostItemList={setPostItemList}
            />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default PostList;
