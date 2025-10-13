'use server';

import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import remarkBreaks from 'remark-breaks';
import { dateToTimestampString, getCreatedDate, getModifiedDate } from '../utils/getDate';
import * as mdxComponents from '@/components/MdxComponents';
import SVGBezier from '@/components/SVGBezier';
import rehypeExtractHeadings from '@/utils/rehypeExtractHeadings';
import type { PostDetailType, PostType } from '@/types/PostType';
import type { Heading } from '@/types/HeadingType';
import 'highlight.js/styles/monokai.css';
import '@/styles/monokai.scss';
import langDockerfile from 'highlight.js/lib/languages/dockerfile';
import langTypeScript from 'highlight.js/lib/languages/typescript';
import langPlainText from 'highlight.js/lib/languages/plaintext';
import { searchLikeById, buildLike } from '@/lib/blogAction';
import { IBlogLikeDocument } from '@/models/blogLikeModel';
import Sparkly from '@/components/Sparkly';
import { PostCategoryType } from '@/types/PostCategoryType';

const contentSource = 'blog';

const languages = {
  dockerfile: langDockerfile,
  ts: langTypeScript,
  plaintext: langPlainText,
};

const aliases = { dockerfile: 'docker' };

// --- Frontmatter Type ---
type MDXFrontmatter = {
  id: number;
  date: string;
  title: string;
  description: string;
  tags: string[];
  category: PostCategoryType[];
  image: string;
};

// --- Get all MDX slugs ---
export const getSlugs = async (): Promise<string[][]> => {
  const directoryPath = path.join(process.cwd(), contentSource);

  try {
    const targets = await fs.promises.readdir(directoryPath);
    const files: string[] = [];

    for (const target of targets) {
      const targetPath = path.join(directoryPath, target);
      const stats = await fs.promises.lstat(targetPath);
      if (!stats.isDirectory()) {
        files.push(target);
      }
    }

    return files.map((file) => file.replace('.mdx', '').split(path.sep));
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
};

// --- Get single post detail (with content) ---
export const getPostDetail = async (slug: string[]): Promise<PostDetailType> => {
  const file = path.join(process.cwd(), contentSource, slug.join('/') + '.mdx');
  const source = await fs.promises.readFile(file, 'utf8');

  const headings: Heading[] = [];

  const { content, frontmatter } = await compileMDX<MDXFrontmatter>({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkToc, remarkBreaks],
        rehypePlugins: [
          [rehypeHighlight, { ignoreMissing: true, languages, aliases }],
          rehypeSlug,
          [rehypeExtractHeadings, { rank: 6, headings }],
        ],
      },
      parseFrontmatter: true,
    },
    components: {
      ...mdxComponents,
      SVGBezier,
      Sparkly,
    },
  });

  const idRaw = frontmatter.id;
  const date = frontmatter.date;
  const title = frontmatter.title;
  const description = frontmatter.description;
  const category = Array.isArray(frontmatter.category)
    ? frontmatter.category
    : [frontmatter.category];
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags];
  const image = frontmatter.image;

  const createdDate = getCreatedDate(file);
  const createdLocaleDate = createdDate.toLocaleDateString();
  const modifiedDate = getModifiedDate(file);

  // const id = Number(dateToTimestampString(createdDate));
  const id = Number(`1${idRaw.toString().padStart(9, '0')}`);

  const doc = (await searchLikeById({ _id: id })) as IBlogLikeDocument;
  const like = doc?.like || 0;

  const post: PostDetailType = {
    id,
    date,
    slug,
    like,
    title,
    description,
    category,
    tags,
    image,
    headings,
    content,
    createdDate,
    createdLocaleDate,
    modifiedDate,
  };

  return post;
};

// --- Get all posts ---
export async function getAllPosts(): Promise<PostType[]> {
  const slugs = await getSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { ...post } = await getPostDetail(slug);
      return post;
    }),
  );

  await buildLike(posts);

  posts.sort((a, b) => +new Date(b.createdDate) - +new Date(a.createdDate));
  return posts;
}

// --- Get posts by tags OR categories ---
export async function getAllPostsByFilter(tags: PostCategoryType[]): Promise<PostType[]> {
  const allPosts = await getAllPosts();

  return allPosts.filter((post) => {
    const inCategories =
      Array.isArray(post.category) && post.category.some((c) => tags.includes(c));
    const inTags = Array.isArray(post.tags) && post.tags.some((t) => tags.includes(t));

    return inCategories || inTags;
  });
}

// --- Paginated posts (no content) ---
export async function getPaginatedPostList({
  activePage,
  limit,
}: {
  activePage: number;
  limit: number;
}): Promise<{ posts: PostType[]; total: number }> {
  const allPosts = await getAllPosts();
  const paginatedPosts = allPosts.slice((activePage - 1) * limit, activePage * limit);
  return { posts: paginatedPosts, total: allPosts.length };
}

// --- Paginated posts by filter (no content) ---
export async function getPaginatedPostListByFilter({
  activePage,
  limit,
  tags,
}: {
  activePage: number;
  limit: number;
  tags: PostCategoryType[];
}): Promise<{ posts: PostType[]; total: number }> {
  const posts = await getAllPostsByFilter(tags);
  const paginatedPosts = posts.slice((activePage - 1) * limit, activePage * limit);
  return { posts: paginatedPosts, total: posts.length };
}

// --- Get most popular posts (no content) ---
export async function getMostPopular(limit?: number): Promise<PostType[]> {
  const allPosts = await getAllPosts();
  const sorted = [...allPosts].sort((a, b) => b.like - a.like);
  return limit ? sorted.slice(0, limit) : sorted;
}
