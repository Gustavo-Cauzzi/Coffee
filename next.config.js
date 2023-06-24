/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "freesvg.org",
                port: "",
                pathname: "/img/coffee-cup.png",
            },
            {
                protocol: "https",
                hostname: "cdn.pixabay.com",
                port: "",
                pathname: "/photo/2016/06/24/10/46/drinks-1477040_1280.png",
            },
        ],
    },
};

module.exports = nextConfig;
