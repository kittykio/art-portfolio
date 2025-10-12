'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Magnetic } from '@/components/Magnetic';
import { Card, CardFloatWrapper } from '@/components/CardFloatWrapper';
import { ArtworkType } from '@/types/ArtworkType';
import LikeButton from '@/components/LikeButton';
import { updateLike } from '@/lib/artworkAction';
import { BiSolidZoomIn } from 'react-icons/bi';

// Defines the properties for the ArtworkItem component.
interface ArtworkItemProps {
  // The specific artwork object to be displayed, including like status.
  artwork: ArtworkType;
  // The current list of liked artwork items.
  likeItemList: ArtworkType[];
  // Function to update the list of liked artwork items.
  setLikeItemList: React.Dispatch<React.SetStateAction<ArtworkType[]>>;
  // Callback function to select the artwork, typically to open a detailed view.
  onSelect: (artwork: ArtworkType) => void;
  // Optional custom class names for the wrapper element.
  className?: string;
}

// A component that displays an individual artwork item within a card, featuring hover effects and interaction buttons.
const ArtworkItem = ({
  artwork,
  likeItemList,
  setLikeItemList,
  onSelect,
  className,
}: ArtworkItemProps) => {
  // State to store the natural dimensions of the loaded image for proper Next.js Image sizing.
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  return (
    // Wrapper component providing a floating or parallax effect to the card.
    <CardFloatWrapper className={className ? className : ''}>
      <Card>
        {/* Placeholder div that displays a pulsating animation while the image is loading. */}
        {!dimensions && <div className="w-full h-48 bg-lgdg animate-pulse" />}
        <Image
          src={artwork.src}
          alt={artwork.title}
          priority
          // Uses determined dimensions or large defaults to maintain aspect ratio and prevent layout shift.
          width={dimensions?.width ?? 1000}
          height={dimensions?.height ?? 1000}
          className="object-cover w-full h-auto"
          // Handler to capture the natural image dimensions once the image is loaded.
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            setDimensions({
              width: target.naturalWidth,
              height: target.naturalHeight,
            });
          }}
        />

        {/* Interaction controls overlay, hidden on mobile by default and appears on group hover. */}
        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 md:opacity-0 md:scale-0 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-transform transition-opacity duration-300 ease-out flex flex-col items-center">
          {/* Like button component for toggling the artwork's like status. */}
          <LikeButton
            likeItem={artwork}
            likeItemList={likeItemList}
            setLikeItemList={setLikeItemList}
            updateLike={updateLike}
            activate
            size={28}
            // Prevents the click event from propagating to the parent card selection.
            onClick={(e) => e.stopPropagation()}
          />
          {/* Wrapper component applying a magnetic hover effect to the title/zoom button. */}
          <Magnetic>
            <div
              className="expanding_underline"
              // Handler to open the detailed view of the artwork.
              onClick={() => onSelect(artwork)}
              role="button"
              tabIndex={0}
              // Allows activation with the Enter key for keyboard accessibility.
              onKeyDown={(e) => e.key === 'Enter' && onSelect(artwork)}
            >
              <p className="flex flex-nowrap text-nowrap items-center gap-2 mt-2 font-bodyBold text-dglg-900">
                {artwork.title}
                {/* Zoom-in icon indicating the item is clickable for a larger view. */}
                <BiSolidZoomIn />
              </p>
            </div>
          </Magnetic>
        </div>
      </Card>
    </CardFloatWrapper>
  );
};

export default ArtworkItem;
