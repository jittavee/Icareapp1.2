// api/prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // ข้อมูลหมวดหมู่งาน
  const jobCategories = [
    { name: 'หาเพื่อนไปเที่ยว/เล่นกีฬา' },
    { name: 'หาเพื่อนดูแลเด็ก/ผู้สูงอายุ/ไปหาหมอ' },
    { name: 'หาเพื่อนไปทานข้าว' },
    { name: 'หาเพื่อนไปทำธุระ/งานเอกสาร' },
    { name: 'หาเพื่อนไปซื้อของ/มือถือ/คอมพิวเตอร์/แท็บเล็ต/สินค้าอื่นๆ' },
    { name: 'อื่นๆ' },
  ];

  // วนลูปเพื่อสร้างหรืออัปเดตข้อมูล
  for (const category of jobCategories) {
    await prisma.jobCategory.upsert({
      where: { name: category.name }, // หาจากชื่อที่ไม่ซ้ำกัน
      update: {}, // ถ้าเจอแล้ว ไม่ต้องทำอะไร
      create: { name: category.name }, // ถ้าไม่เจอ ให้สร้างใหม่
    });
  }
  
  console.log('Job categories seeded successfully.');
  console.log(`Seeding finished.`);
}

// เรียกใช้ฟังก์ชัน main และจัดการ error
main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  });