import { getAllPosts, getSlugs, getPostDetail } from '@/lib/blogApi';
import PostDetail from '@/app/blog/components/PostDetail';
import type { PostDetailType, PostType } from '@/types/PostType';

// export const runtime = 'nodejs';
// export const dynamic = 'force-static';
// export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string[] };
}

export const generateStaticParams = async () => {
  const slugs = await getSlugs();

  return slugs.map((slug) => ({
    slug: slug,
  }));
};

const PostPage = async ({ params }: Props) => {
  const slug = params.slug;
  const post: PostDetailType = await getPostDetail(slug);
  const posts: PostType[] = await getAllPosts();

  return <PostDetail post={post} posts={posts} />;
};

export default PostPage;
