export function onBeforeRender() {
  return {
    pageContext: {
      // just one idea, how it was in stitcher. Would prefer templating tho. This file is like a page in next and we can add jsx
      config: [
        { url: "localhost:3001", name: "micro-react" },
        { url: "localhost:3001", name: "micro-react" },
      ],
    },
  };
}
