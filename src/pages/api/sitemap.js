import {buildSitemap} from '../../Sitemap';
import appConfig from '../../config';
import {subdomainFromReq} from '../../lib/subdomain';

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async (req, res) => {
  let siteHostname = appConfig.siteHostname;

  if (!siteHostname) {
    console.warn(
      'set NEXT_PUBLIC_SITE_HOSTNAME environment variable to ensure that sitemap urls are correct',
    );
    siteHostname = `https://${req.headers.host}`;
  }

  const subdomain = subdomainFromReq(req);

  const sitemap = await buildSitemap({
    siteHostname,
    subdomain,
  });

  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(sitemap);
};
