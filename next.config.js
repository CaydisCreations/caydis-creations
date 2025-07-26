/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'caydiscreations.s3.us-east-2.amazonaws.com',
    ],
  },
  trailingSlash: false,
}

module.exports = nextConfig 