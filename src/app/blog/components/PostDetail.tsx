'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SectionWrapper from '@/components/SectionWrapper';
import { TableOfContents } from '@/app/blog/components/TableOfContents';
import PopularPosts from '@/app/blog/components/PopularPosts';
import { DisplayTag } from '@/components/Tag';
import LikeButton from '@/components/LikeButton';
import { updateLike } from '@/lib/blogAction';
import { PostDetailType, PostType } from '@/types/PostType';

type Props = {
  post: PostDetailType;
  posts: PostType[];
};

const PostDetail = ({ post, posts }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [postItem, setPostItem] = useState<PostDetailType>(null!);
  const currentPostId = post.id;

  const getLikesPerUser = (id: number) => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem(`${id}`)) || 0;
    }
    return 0;
  };

  useEffect(() => {
    setPostItem({ ...post, likesPerUser: getLikesPerUser(post.id) });
    setMounted(true);
  }, [post]);

  if (!mounted) return null;

  return (
    <SectionWrapper className="max-w-6xl mx-auto px-4 pb-[700px] mt-48 sm:mt-36 lg:mt-24">
      {/* === Layout Grid === */}
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-12 relative">
        {/* === TOC (Desktop) === */}
        <aside className="hidden lg:block sticky top-36 h-fit self-start">
          <TableOfContents
            headings={postItem.headings}
            postItem={postItem}
            setPostItem={setPostItem}
          />
        </aside>

        {/* === Main Content === */}
        <main className="flex flex-col items-center gap-8">
          {/* Title */}
          <h1 className="text-5xl font-bodyBold text-center">{postItem.title}</h1>

          {/* Description */}
          <p className="text-lg font-bodyBold text-center max-w-[75ch]">{postItem.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {[...postItem.category, ...postItem.tags].map((item) => (
              <DisplayTag key={item} tag={item} />
            ))}
          </div>

          {/* Like Button (Mobile only) */}
          <div className="flex w-[80%] justify-end lg:hidden">
            <LikeButton
              likeItem={postItem}
              setLikeItem={setPostItem}
              updateLike={updateLike}
              activate
              size={28}
              hideBackground
            />
          </div>

          {/* Main Image */}
          <div className="w-full max-w-[80%] rounded-lg overflow-hidden my-8">
            <Image
              src={postItem.image}
              alt="Post Main Image"
              width={1000}
              height={1000}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* TOC (Mobile only) */}
          <div className="lg:hidden my-12 w-full">
            <TableOfContents
              headings={postItem.headings}
              postItem={postItem}
              setPostItem={setPostItem}
            />
          </div>

          {/* Article Content */}
          <article className="w-full max-w-[80%] prose">{postItem.content}</article>
        </main>
      </div>

      {/* === Popular Posts === */}
      <div className="w-full mt-24">
        <PopularPosts posts={posts} currentPostId={currentPostId} />
      </div>
    </SectionWrapper>
  );
};

export default PostDetail;
