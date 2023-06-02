export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ["pageProps", "urlPathname"];

import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";

async function render(pageContext) {
  const { config } = pageContext;

  //   console.log(config[0].url);

  const res = await fetch("http://localhost:3001");

  const pageHtml = await res.text();
  const pageHtmlPrefixed = pageHtml.replaceAll(
    `href="`,
    `href="/reverse-proxy/micro-react`
  );
  console.log({ pageHtmlPrefixed });

  const documentHtml = escapeInject`
  <DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>ROOT</title>
        </head>
        <body>

        <div id="micro-react">${dangerouslySkipEscape(pageHtmlPrefixed)}</div>
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
