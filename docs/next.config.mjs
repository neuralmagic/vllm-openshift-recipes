/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/vllm-openshift-recipes',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
