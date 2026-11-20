
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/Support-page" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  images: {
    unoptimized: true,
  },

  reactStrictMode: true,
  poweredByHeader: false,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

};

export default nextConfig;
