import React, { useRef } from 'react';
import { useScroll, motion, useTransform, useMotionTemplate } from 'framer-motion';
import styles from '@/app/components/interest-section/style.module.scss';
import { DataType } from '@/app/components/interest-section/InterestSection';

type TitlesProps = {
  data: DataType[];
  setSelectedArtwork: (index: number | null) => void;
};

const Titles: React.FC<TitlesProps> = ({ data, setSelectedArtwork }) => {
  return (
    <div className={styles.titles}>
      {data.map((artwork, i) => (
        <Title key={i} data={artwork} index={i} setSelectedArtwork={setSelectedArtwork} />
      ))}
    </div>
  );
};

type TitleProps = {
  data: DataType;
  index: number;
  setSelectedArtwork: (index: number | null) => void;
};

const Title: React.FC<TitleProps> = ({ data, index, setSelectedArtwork }) => {
  const { title, speed } = data;
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', `${25 / speed}vw end`],
  });

  const clipProgress = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clip = useMotionTemplate`inset(0 ${clipProgress}% 0 0)`;

  return (
    <div ref={container} className={styles.title}>
      <div
        className={styles.wrapper}
        onMouseOver={() => setSelectedArtwork(index)}
        onMouseLeave={() => setSelectedArtwork(null)}
      >
        <motion.p style={{ clipPath: clip }}>{title}</motion.p>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default Titles;
