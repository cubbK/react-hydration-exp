// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562

const express = require("express");
const compression = require("compression");
const { renderPage } = require("vite-plugin-ssr/server");
const proxy = require("express-http-proxy");

const isProduction = process.env.NODE_ENV === "production";
const root = `${__dirname}/..`;

startServer();

async function startServer() {
  const app = express();

  app.use(compression());

  if (isProduction) {
    const sirv = require("sirv");
    app.use(sirv(`${root}/dist/client`));
  } else {
    const vite = require("vite");
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
  }

  //   app.get("/reverse-proxy/:microName/*", async (req, res, next) => {
  //     const microName = req.params.microName;

  //     switch (microName) {
  //       case "micro-react":
  //         return res.send("Hello World reverse proxy micro-react");
  //       default:
  //         return res.send("No such micro found");
  //     }
  //   });

  app.use(
    "/reverse-proxy/micro-react/*",
    proxy("http://localhost:3001", {
      proxyReqPathResolver: function (req) {
        const urlToForward = req.baseUrl.replace(
          "/reverse-proxy/micro-react",
          ""
        );
        return urlToForward;
      },
    })
  );

  app.use(
    "/reverse-proxy/micro-react1/*",
    proxy("http://localhost:3002", {
      proxyReqPathResolver: function (req) {
        const urlToForward = req.baseUrl.replace(
          "/reverse-proxy/micro-react1",
          ""
        );
        return urlToForward;
      },
    })
  );

  app.get("*", async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) return next();
    const { body, statusCode, contentType, earlyHints } = httpResponse;
    if (res.writeEarlyHints)
      res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
    res.status(statusCode).type(contentType).send(body);
  });

  const port = process.env.PORT || 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}
