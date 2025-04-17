import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  images: { domains: ["images.51939393.com", "c.animaapp.com"] },
};

export default withFlowbiteReact(nextConfig);