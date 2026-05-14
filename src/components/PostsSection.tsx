import type { JSX } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
}

interface Props {
  posts: Post[];
}

export default function PostsSection({ posts }: Props): JSX.Element {
  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Writing"
          actions={<Link href="/posts/">View all posts →</Link>}
        >
          Recent posts
        </Header>
      }
    >
      <SpaceBetween size="m">
        {posts.map((post) => (
          <div key={post.slug} style={{
            borderBottom: '1px solid #E9EBED',
            paddingBottom: '1rem',
          }}>
            <Link href={`/posts/${post.slug}/`} fontSize="heading-s">
              {post.title}
            </Link>
            <Box color="text-body-secondary" fontSize="body-s" variant="p" padding={{ top: 'xxs' }}>
              {post.date}
            </Box>
            <Box color="text-body-secondary" fontSize="body-s" variant="p">
              {post.description}
            </Box>
          </div>
        ))}
      </SpaceBetween>
    </Container>
  );
}
