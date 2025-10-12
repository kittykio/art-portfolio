import type { Heading } from '@/types/HeadingType';
import { PostCategoryType } from './PostCategoryType';

export type PostType = {
  id: number;
  slug: string[];
  like: number;
  title: string;
  description: string;
  category: PostCategoryType[];
  tags: string[];
  image: string;
  headings: Heading[];
  createdDate: Date;
  createdLocaleDate: string;
  modifiedDate: Date;
  likesPerUser?: number;
};

export type PostDetailType = PostType & {
  content: string | React.ReactNode | React.ReactElement;
};
