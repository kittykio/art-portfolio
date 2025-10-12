'use client';
import { useMemo } from 'react';
import Image from 'next/image';
import type { PostType } from '@/types/PostType';
import { DisplayTag } from '@/components/Tag';

type PopularPostsProps = {
  posts: PostType[];
  currentPostId?: number;
};

const PopularPosts = ({ posts, currentPostId }: PopularPostsProps) => {
  const mostPopular = useMemo(() => {
    // 1️⃣ Filter out the current post
    const filtered = posts.filter((post) => post.id !== currentPostId);

    // 2️⃣ Sort by likes (descending)
    const sorted = filtered.sort((a, b) => {
      const likeA = Number(a.like) || 0;
      const likeB = Number(b.like) || 0;
      return likeB - likeA;
    });

    // 3️⃣ Return top 3
    return sorted.slice(0, 3);
  }, [posts, currentPostId]);

  return (
    <main className="flex flex-col justify-center items-center w-full">
      <div className="w-full max-w-6xl flex flex-col justify-center items-center">
        {mostPopular.map((post, index) => (
          <div
            key={post.id ?? index}
            className={`
              flex flex-col md:flex-row w-full gap-4 lg:gap-12
              border-t border-dglg-700 p-4
              ${index === mostPopular.length - 1 ? 'border-b' : ''}
            `}
          >
            {/* Text Content */}
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="text-2xl font-bodyBold">{post.title}</h2>
              <p className="text-sm">{post.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {[...post.category, ...post.tags].map((item, i) => (
                  <DisplayTag key={i} tag={item} />
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="flex-shrink-0 w-full md:w-[240px] self-center">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 300px"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default PopularPosts;
