/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["arweave.net", "assets.manifold.xyz"],
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  },
};

module.exports = nextConfig;
