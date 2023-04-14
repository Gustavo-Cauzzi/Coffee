/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
        pathname: "/photo/2018/03/11/17/36/coffee-3217471_1280.png",
      },
      {
        protocol: "https",
        hostname: "pixy.org",
        port: "",
        pathname: "/src/12/128443.png",
      },
    ],
  },
};

module.exports = nextConfig;
