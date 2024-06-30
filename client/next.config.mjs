/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  optimizeFonts: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/ImageLoader.ts",
    // path: "https://res.cloudinary.com/dleilanfz/image/upload/",
    path: "https://dstilezauto.s3.af-south-1.amazonaws.com/",
    domains: ["res.cloudinary.com", "dstilezauto.s3.af-south-1.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-eu-west-1.amazonaws.com",
        port: "",
        pathname: "/vmg.images.production/870/**",
      },
      {
        protocol: "https",
        hostname: "dstilezauto.s3.af-south-1.amazonaws.com",
        port: "",
        pathname: "*",
      },
    ],
  },
};

export default nextConfig;
