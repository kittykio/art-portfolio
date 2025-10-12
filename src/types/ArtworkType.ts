import type { ArtworkCategoryType } from '@/types/ArtworkCategoryType';

export type ArtworkType = {
  id: number;
  like: number;
  title: string;
  description?: string;
  src: string;
  medium: string;
  year: string;
  category: ArtworkCategoryType;
  tags: string[];
  createdDate: Date;
  createdLocaleDate: string;
  modifiedDate: Date;
  likesPerUser?: number;
};
