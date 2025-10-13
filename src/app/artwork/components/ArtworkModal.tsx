'use client';

import { Fragment, FC } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import type { ArtworkType } from '@/types/ArtworkType';
import Image from 'next/image';
import LikeButton from '@/components/LikeButton';
import { updateLike } from '@/lib/artworkAction';
import { RiCloseCircleFill } from 'react-icons/ri';
import { DisplayTag } from '@/components/Tag';

type ArtworkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  artwork: ArtworkType;
  likeItemList: ArtworkType[];
  setLikeItemList: React.Dispatch<React.SetStateAction<ArtworkType[]>>;
};

// Small decorative quote SVG
const QuoteSVG = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M7.17 6C5.2 6 4 7.43 4 9.5S5.2 13 7.17 13c1.12 0 2.03-.92 2.03-2.04 0-.66-.27-1.28-.71-1.71C8.93 9.3 9 9.1 9 8.83 9 7.36 8 6 7.17 6zm10 0c-1.97 0-3.17 1.43-3.17 3.5S15.2 13 17.17 13c1.12 0 2.03-.92 2.03-2.04 0-.66-.27-1.28-.71-1.71.61.37.68.57.68.84 0-1.47-1-2.83-1.83-2.83z" />
  </svg>
);

const ArtworkModal: FC<ArtworkModalProps> = ({
  isOpen,
  onClose,
  artwork,
  likeItemList,
  setLikeItemList,
}) => {
  if (!artwork) return null;
  const currentArtwork = likeItemList?.find((item) => item.id === artwork.id) ?? artwork;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={onClose}>
        {/* BACKDROP */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-wb-blur-50 backdrop-blur-sm" />
        </TransitionChild>

        {/* PANEL */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl isolate
  bg-wb-blur-10 backdrop-blur-md border border-wb-blur-10
  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),inset_-1px_-1px_2px_rgba(0,0,0,0.2)]
  drop-shadow-[0_8px_24px_rgba(0,0,0,0.3)]
  text-dglg-700 flex flex-col overflow-hidden"
            >
              {/* Title */}
              <DialogTitle className="text-3xl font-bodyBold text-center p-4">
                {artwork.title}
              </DialogTitle>

              {/* Image - fixed section */}
              <div className="w-full flex justify-center px-4">
                <div className="max-h-[50vh] overflow-hidden rounded-2xl">
                  <Image
                    src={artwork.src}
                    alt={artwork.title}
                    width={1000}
                    height={1000}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-6 text-dglg-700 hover:text-flame-500 transition-colors"
              >
                <RiCloseCircleFill size={28} />
              </button>

              {/* Scrollable content */}
              <div
                className="flex flex-col flex-1 overflow-y-auto gap-4 p-4
    scrollbar-thin scrollbar-thumb-dglg-400/30 scrollbar-track-transparent"
              >
                {/* Like button aligned right */}
                <div className="flex justify-end w-full items-start">
                  <LikeButton
                    likeItem={currentArtwork}
                    likeItemList={likeItemList}
                    setLikeItemList={setLikeItemList}
                    updateLike={updateLike}
                    activate
                    size={28}
                    onClick={(e) => e.stopPropagation()}
                    hideBackground
                  />
                </div>

                {/* Two-column layout */}
                <div className="relative flex flex-row flex-wrap md:flex-nowrap gap-4 justify-between">
                  {/* Left: Description */}
                  {artwork.description && (
                    <blockquote
                      className="flex-1 min-w-[240px] rounded-2xl p-6 bg-wb-blur-10 backdrop-blur-sm border border-wb-blur-10 
        shadow-[inset_2px_2px_6px_rgba(255,255,255,0.3),inset_-2px_-2px_6px_rgba(0,0,0,0.2)] italic relative"
                    >
                      <QuoteSVG className="absolute top-2 left-2 w-6 h-6 text-dglg-700" />
                      <QuoteSVG className="absolute bottom-2 right-2 w-6 h-6 text-dglg-700 rotate-180" />
                      <p className="relative text-sm md:text-xl">{artwork.description}</p>
                    </blockquote>
                  )}

                  {/* Right: Info & Tags */}
                  <div className="w-auto flex flex-col gap-4 items-end text-sm md:text-xl">
                    <ul
                      className="flex flex-col gap-1 md:gap-2 rounded-2xl p-4 bg-wb-blur-10 backdrop-blur-sm border border-wb-blur-10 
        shadow-[inset_2px_2px_6px_rgba(255,255,255,0.3),inset_-2px_-2px_6px_rgba(0,0,0,0.2)]"
                    >
                      <li>
                        <strong>Date:</strong> {artwork.date}
                      </li>
                      <li>
                        <strong>Medium:</strong> {artwork.medium}
                      </li>
                      <li className="flex gap-1 flex-wrap">
                        {[artwork.category, ...artwork.tags].map((tag) => (
                          <DisplayTag key={tag} tag={tag} />
                        ))}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ArtworkModal;
