import { getAllPosts, getPaginatedPostList, getPaginatedPostListByFilter } from '@/lib/blogApi';
import { PostType } from '@/types/PostType';
import { postCategory } from '@/constants/postCategory';
import BlogPageClient from '../components/BlogPageClient';

export const dynamic = 'force-dynamic';

export const runtime = 'nodejs';

interface Props {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

function getCombinations(valuesArray: string[]) {
  const combi: string[][] = [];
  const slent = Math.pow(2, valuesArray.length);

  for (let i = 0; i < slent; i++) {
    const temp: string[] = [];
    for (let j = 0; j < valuesArray.length; j++) {
      if (i & Math.pow(2, j)) temp.push(valuesArray[j]);
    }
    if (temp.length > 0) combi.push(temp);
  }

  combi.sort((a, b) => a.length - b.length);
  return combi;
}

export const generateStaticParams = (): { slug: string[] }[] => {
  return getCombinations(postCategory.sort()).map((slug) => ({ slug: slug }));
};

const BlogPage = async ({ params, searchParams }: Props) => {
  const pageParam = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const activePage = Number(pageParam ?? 1);

  const { slug } = params;

  const limit = 6;
  const tags = slug ?? [];

  const { posts, total }: { posts: PostType[]; total: number } = tags.length
    ? await getPaginatedPostListByFilter({ activePage, limit, tags })
    : await getPaginatedPostList({ activePage, limit });

  const allPosts = await getAllPosts();

  return (
    <BlogPageClient
      allPosts={allPosts}
      posts={posts}
      activePage={activePage}
      limit={limit}
      total={total}
    />
  );
};

export default BlogPage;
