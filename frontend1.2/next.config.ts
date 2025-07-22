import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   // เพิ่มส่วนนี้เข้าไป
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // สำหรับรูป Placeholder
      },
      {
        protocol: 'http',
        hostname: 'localhost', // สำหรับตอนพัฒนาที่รัน API ในเครื่อง
        port: '5000',
      },
      // *** เพิ่ม hostname ของ API ที่ deploy แล้วที่นี่ ***
      // เช่น ถ้า API ของคุณอยู่บน Render
      {
         protocol: 'https',
         hostname: 'my-friend-finder-api.onrender.com', 
      }
    ],
  },
};


export default nextConfig;
