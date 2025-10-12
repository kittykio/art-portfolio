import React from 'react';
import styles from '@/app/components/interest-section/style.module.scss';
import { DataType } from '@/app/components/interest-section/InterestSection';

type DescriptionsProps = {
  data: DataType[];
  selectedArtwork: number | null;
};

const Descriptions: React.FC<DescriptionsProps> = ({ data, selectedArtwork }) => {
  const crop = (str: string, maxLength: number) => str.substring(0, maxLength);

  return (
    <div className={styles.descriptions}>
      {data.map((artwork: DataType, i: number) => {
        const { title, description } = artwork;

        const isSelected = selectedArtwork === i;
        const clip = isSelected ? 'inset(0 0 0 0)' : 'inset(50% 0 50% 0)';

        return (
          <div key={i} className={styles.description} style={{ clipPath: clip }}>
            <p>{crop(title, 9)}</p>
            <p>{description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Descriptions;
