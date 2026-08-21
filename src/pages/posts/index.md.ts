import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const lines = posts
    .map((p) => `- [${p.data.title}](https://sercasti.github.io/posts/${p.slug}/) — ${p.data.description}`)
    .join('\n');

  const body = `# Posts — Sergio Castiñeyras

Writing on cloud architecture, AWS, observability, CI/CD, cost optimization, and engineering
leadership.

${lines}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
