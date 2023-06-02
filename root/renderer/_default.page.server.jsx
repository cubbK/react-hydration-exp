export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ["pageProps", "urlPathname"];

import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";

async function fetchMicro(url, microName) {
  const res = await fetch(url);

  const pageHtml = await res.text();
  const pageHtmlPrefixed = pageHtml
    .replaceAll(`href="`, `href="/reverse-proxy/${microName}`)
    .replaceAll(`src="`, `src="/reverse-proxy/${microName}`);

  return pageHtmlPrefixed;
}

async function render(pageContext) {
  const { config } = pageContext;

  const html1 = await fetchMicro(`http://localhost:3001`, "micro-react");
  const html2 = await fetchMicro(`http://localhost:3002`, "micro-react1");

  const documentHtml = escapeInject`
  <DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>ROOT</title>
        </head>
        <body>

        <div id="micro-react">${dangerouslySkipEscape(html1)}</div>
        <div id="micro-react1">${dangerouslySkipEscape(html2)}</div>
        </body>
    </html>
        `;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}
