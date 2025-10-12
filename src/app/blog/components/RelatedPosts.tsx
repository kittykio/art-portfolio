'use client';
import { useMemo } from 'react';
import { PostType } from '@/types/PostType';
import Image from 'next/image';
import { DisplayTag } from '@/components/Tag';

const PopularPosts = ({ posts }: { posts: PostType[] }) => {
  const mostPopular = useMemo(() => {
    const sorted = [...posts].sort((a, b) => {
      const likeA = Number(a.like) || 0;
      const likeB = Number(b.like) || 0;
      return likeB - likeA;
    });
    // Debug
    // console.table(sorted.map(p => ({ title: p.title, like: p.like })));

    return sorted.slice(0, 3);
  }, [posts]);

  return (
    <main className="flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col items-center justify-between">
        {mostPopular.map((post, index) => (
          <div
            key={post.id ?? index}
            className={`
              flex w-full justify-between items-center
              py-4 px-12 gap-12
              border-t border-dglg-700
              ${index === mostPopular.length - 1 ? 'border-b' : ''}
            `}
          >
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
              <p className="mb-8">{post.description}</p>
              <div className="flex gap-2">
                {[...post.category, ...post.tags].map((item, i) => (
                  <DisplayTag key={i} tag={item} />
                ))}
              </div>
            </div>

            <Image
              src={post.image}
              width={1000}
              height={1000}
              alt="Post Image"
              className="w-[300px]"
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default PopularPosts;
