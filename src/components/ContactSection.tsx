import type { JSX } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Box from '@cloudscape-design/components/box';

export default function ContactSection(): JSX.Element {
  return (
    <Container
        header={
          <Header variant="h2" description="Get in touch">
            Let's build something together
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box color="text-body-secondary" variant="p">
            Available for consulting engagements, architecture reviews, fractional CTO work,
            workshops, and speaking. Based in Buenos Aires, working globally.
          </Box>
          <SpaceBetween direction="horizontal" size="s">
            <Button href="mailto:sercasti@gmail.com" iconName="envelope">Email</Button>
            <Button href="https://linkedin.com/in/sercasti" target="_blank" iconName="external">LinkedIn</Button>
            <Button href="https://github.com/sercasti" target="_blank" iconName="external">GitHub</Button>
          </SpaceBetween>
        </SpaceBetween>
    </Container>
  );
}
