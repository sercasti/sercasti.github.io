import type { APIRoute } from 'astro';

const body = `# Privacy Policy

This site is a personal portfolio for Sergio Castiñeyras. It collects very little data.
Last updated August 21, 2026.

## What this site is

sercasti.github.io is a static personal portfolio and blog. It has no login, no user accounts, no
comment system, and no forms that collect personal information. There is nothing to sign up for
and nothing stored about you on this site's servers beyond standard hosting logs described below.

## Analytics

This site uses [GoatCounter](https://www.goatcounter.com/), a privacy-respecting analytics tool,
to count page views. GoatCounter does not use cookies and does not track visitors across sites.
It records aggregate information such as page path, referrer, browser, and country derived from a
truncated IP address, which is discarded rather than stored. No individual visitor profile is
created and the data is not sold or shared with third parties for advertising.

This site does not run advertising, does not use tracking pixels, and does not use any other
third-party analytics or marketing tools beyond GoatCounter.

## Hosting

This site is hosted on GitHub Pages, served via GitHub's and Fastly's infrastructure. Like any web
server, GitHub Pages' edge network may log standard technical information for security and
performance purposes (such as IP address, requested URL, and timestamp) according to
[GitHub's Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).
That logging happens at the infrastructure level and is not something this site's owner configures
or has direct access to.

## Third-party links

This site links out to third-party services such as LinkedIn, GitHub, and Sessionize. Those
services have their own privacy policies, and this site is not responsible for how they handle
your data once you leave sercasti.github.io.

## Contact

If you contact me by email, I keep that correspondence like any personal email — I don't add you
to a mailing list or share it with third parties. If you have questions about this policy or want
any information about you removed, email sercasti@gmail.com.

This policy may be updated occasionally to reflect changes to the site; the "last updated" date
above will always reflect the most recent revision.
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
