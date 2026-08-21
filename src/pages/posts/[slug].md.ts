import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props;
  const date = post.data.date.toISOString().slice(0, 10);
  const tags = post.data.tags?.length ? `\nTags: ${post.data.tags.join(', ')}` : '';

  const body = `# ${post.data.title}

${date}${tags}

${post.body}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
