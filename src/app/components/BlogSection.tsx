'use client';

import { useRef, useState, useLayoutEffect, useEffect, useMemo } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { PostType } from '@/types/PostType';
import SectionWrapper from '@/components/SectionWrapper';
import PostItem from '../../components/PostItem';

type ColumnProps = {
  posts: PostType[];
  reverse?: boolean;
  duration: number;
  colKey: string;
  extraClasses?: string;
  postItemList: PostType[];
  setPostItemList: React.Dispatch<React.SetStateAction<PostType[]>>;
};

const Column = ({
  posts,
  reverse = false,
  duration,
  colKey,
  extraClasses = '',
  postItemList,
  setPostItemList,
}: ColumnProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const y = useMotionValue(0);
  const [height, setHeight] = useState(0);

  const mod = (n: number, m: number) => ((n % m) + m) % m;

  useLayoutEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight / 2);
    }
  }, [posts]);

  const startMarquee = async (fromY = 0) => {
    if (!height || height <= 0) return;

    const target = reverse ? 0 : -height;
    y.set(fromY);

    await controls.start({
      y: [fromY, target],
      transition: {
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
        duration,
      },
    });
  };

  useEffect(() => {
    if (height > 0) {
      void startMarquee(reverse ? -height : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, reverse]);

  const handlePause = () => controls.stop();

  const handleResume = () => {
    if (!height || height <= 0) {
      void startMarquee(0);
      return;
    }

    const currentY = y.get();
    let fromY: number;

    if (!reverse) {
      const p = mod(-currentY, height);
      fromY = -p;
    } else {
      const p = mod(currentY, height);
      fromY = -height + p;
    }

    void startMarquee(fromY);
  };

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col gap-16 ${extraClasses}`}
      animate={controls}
      style={{ y }}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      {posts.map((post, i) => (
        <PostItem
          key={`${colKey}-${i}`}
          index={i}
          post={post}
          postItemList={postItemList}
          setPostItemList={setPostItemList}
        />
      ))}
    </motion.div>
  );
};

const BlogSection = ({ posts }: { posts: PostType[] }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [postItemList, setPostItemList] = useState<PostType[]>([]);

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

  const makeItems = (slice: PostType[], reverse = false): PostType[] =>
    reverse ? [...slice.slice().reverse(), ...slice.slice().reverse()] : [...slice, ...slice];

  const columnItems1 = makeItems(postItemList.slice(0, 3));
  const columnItems2 = makeItems(postItemList.slice(3, 6), true);
  const columnItems3 = makeItems(postItemList.slice(6, 9));
  const columnItems4 = makeItems(postItemList.slice(9, 12), true);

  if (!mounted || posts.length === 0) return null;

  return (
    <SectionWrapper
      title="Blog"
      subtitle="Endless currents of thought, meandering reflections, and evolving experiments, born from curiosity, nurtured by passion, and propelled forward by the inexhaustible stream of wonder, inspiration, and the relentless pursuit of new perspectives."
    >
      <section className="relative overflow-hidden py-4 px-8 sm:px-16 lg:px-32 flex flex-row gap-12 justify-center max-h-[60vh]">
        <Column
          posts={columnItems1}
          duration={20}
          colKey="col1"
          postItemList={postItemList}
          setPostItemList={setPostItemList}
          extraClasses="flex-1"
        />
        <Column
          posts={columnItems2}
          reverse
          duration={25}
          colKey="col2"
          extraClasses="hidden md:flex flex-1"
          postItemList={postItemList}
          setPostItemList={setPostItemList}
        />
        <Column
          posts={columnItems3}
          duration={30}
          colKey="col3"
          extraClasses="hidden lg:flex flex-1"
          postItemList={postItemList}
          setPostItemList={setPostItemList}
        />
        <Column
          posts={columnItems4}
          reverse
          duration={35}
          colKey="col4"
          extraClasses="hidden xl:flex flex-1"
          postItemList={postItemList}
          setPostItemList={setPostItemList}
        />
      </section>
    </SectionWrapper>
  );
};

export default BlogSection;
