import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { PostType } from '@/types/PostType';
import type { ArtworkType } from '@/types/ArtworkType';

// Array of paths for heart icons, used to visually indicate the number of likes per user.
const heartImages: string[] = Array.from(
  { length: 18 },
  (_, index) => `/like-icons/heart_${index}.png`,
);

// Base type that all likeable items must extend.
type BaseLikeType = PostType | ArtworkType;

// Defines the properties for the LikeButton component.
type LikeButtonProps<T extends BaseLikeType> = {
  // The specific item (post or artwork) being liked.
  likeItem: T;
  // Optional array of items, used when updating a list of liked items.
  likeItemList?: T[];
  // Optional state setter for a single item.
  setLikeItem?: React.Dispatch<React.SetStateAction<T>>;
  // Optional state setter for a list of items.
  setLikeItemList?: React.Dispatch<React.SetStateAction<T[]>>;
  // Function to call the backend API to update the like count, returning the new total like count.
  updateLike: (payload: { _id: number; seconds: number }) => Promise<number | undefined>;
  // The size (width/height) of the heart icon image.
  size: number;
  // Flag to indicate if the button is active (unused in the current component logic but kept in type definition).
  activate: boolean;
  // Optional click handler for external actions.
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  // Flag to hide the button's background and default styling for a cleaner look.
  hideBackground?: boolean;
};

// A reusable, generic component for liking content. It tracks click-hold duration to award multiple likes at once.
const LikeButton = <T extends BaseLikeType>({
  likeItem,
  likeItemList,
  setLikeItem,
  setLikeItemList,
  updateLike,
  size,
  onClick,
  hideBackground = false,
}: LikeButtonProps<T>) => {
  // State to determine which heart image to display based on the user's total likes for this item.
  const [currentHeartIndex, setCurrentHeartIndex] = useState<number>(17);
  // State to trigger a shake animation after a successful like update.
  const [isShaking, setIsShaking] = useState(false);
  // Ref to store the timestamp when the mouse button is pressed down.
  const startTime = useRef<number | null>(null);

  // Updates the heart icon index whenever the user's like count for the item changes.
  useEffect(() => {
    // Clamps the index to the maximum number of available heart images.
    setCurrentHeartIndex(Math.min(likeItem.likesPerUser ?? 0, 17));
  }, [likeItem.likesPerUser]);

  // Records the starting time when the user presses down on the button.
  const countSeconds = (): void => {
    startTime.current = Date.now();
  };

  // Calculates the duration of the click, sends the update to the server, and updates local state.
  const countLikes = async (): Promise<void> => {
    // Exits if the mouse up event occurs without a preceding mouse down event.
    if (!startTime.current) return;

    // Calculates the duration in seconds, clamped to a minimum of 1.
    const seconds = Math.max(1, Math.ceil((Date.now() - startTime.current) * 0.001));
    // Calls the external function to update the like count on the backend.
    const like = await updateLike({ _id: likeItem.id, seconds });
    // Exits if the update failed or returned no new count.
    if (like === undefined) return;

    // Creates the locally updated item object.
    const updated: T = {
      ...likeItem,
      like, // New total like count.
      likesPerUser: (likeItem.likesPerUser ?? 0) + seconds, // New user like count.
    };

    // Updates the state for a list of items if the setter is provided.
    if (likeItemList && setLikeItemList) {
      setLikeItemList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    }
    // Updates the state for a single item if the setter is provided.
    if (setLikeItem) setLikeItem(updated);

    // Persists the new user like count to local storage for persistence across sessions.
    if (likeItem.likesPerUser !== undefined)
      localStorage.setItem(String(likeItem.id), String((likeItem.likesPerUser ?? 0) + seconds));

    // Triggers the shake animation for visual feedback.
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500); // Animation duration is 500ms.
  };

  return (
    <button
      type="button"
      // Starts the time tracking when the mouse is pressed down.
      onMouseDown={countSeconds}
      // Stops the time tracking and processes the likes when the mouse is released.
      onMouseUp={() => void countLikes()}
      onClick={onClick}
      aria-label="Like button"
      className={`
        relative flex flex-row items-center gap-2
        px-4 py-2 rounded-full isolate w-fit
        ${
          // Applies background and shadow styles unless hideBackground is true.
          !hideBackground
            ? `justify-center min-w-[100px] h-[48px] bg-wb-blur-50 hover:bg-wb-blur-10 backdrop-blur-xl border border-wb-blur-10
        shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),inset_-1px_-1px_2px_rgba(0,0,0,0.2)]
        drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]`
            : `justify-end`
        }
        cursor-pointer select-none
        // Applies a CSS animation on active state (click/hold).
        active:animate-heartbeat
        // Conditionally applies the shake animation after like update.
        ${isShaking ? 'animate-shake' : ''}
      `}
    >
      {/* Renders the heart icon image based on the current like level. */}
      <Image src={heartImages[currentHeartIndex]} alt="heart-icon" width={size} height={size} />
      {/* Displays the total number of likes for the item. */}
      <span className="font-bodyBold text-dglg-900">{likeItem.like}</span>
    </button>
  );
};

export default LikeButton;
