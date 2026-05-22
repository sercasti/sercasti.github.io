import '@cloudscape-design/global-styles/index.css';
import TopNavigation from '@cloudscape-design/components/top-navigation';

export default function AppHeader() {
  return (
    <TopNavigation
        identity={{
          href: '/',
          title: 'Sergio Castiñeyras',
          logo: {
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='4' fill='%23FF9900'/%3E%3Ctext x='20' y='27' font-family='monospace' font-size='18' font-weight='bold' fill='%23232F3E' text-anchor='middle'%3ESC%3C/text%3E%3C/svg%3E",
            alt: 'SC',
          },
        }}
        utilities={[
          {
            type: 'button',
            text: 'Milestones',
            href: '/#milestones',
          },
          {
            type: 'button',
            text: 'Experience',
            href: '/#experience',
          },
          {
            type: 'button',
            text: 'Work',
            href: '/work/',
          },
          {
            type: 'button',
            text: 'Posts',
            href: '/posts/',
          },
          {
            type: 'button',
            text: 'Contact',
            href: '/#contact',
          },
          {
            type: 'button',
            iconName: 'external',
            text: 'LinkedIn',
            href: 'https://linkedin.com/in/sercasti',
            external: true,
            externalIconAriaLabel: 'Opens in a new tab',
          },
        ]}
        i18nStrings={{ overflowMenuTriggerText: 'More', overflowMenuTitleText: 'Navigation' }}
      />
  );
}
