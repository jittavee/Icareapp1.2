import Hero from "@/components/Hero";
// import Hero1 from "@/components/Hero1";
import About from "@/components/About";
import Resume from "@/components/Resume";
import HeroSlider from '@/components/HeroSlider'; // Import component


export default function HomePage() {
  return (
    <>
      {/* <Hero /> */}
      
      {/* สามารถเพิ่ม Section อื่นๆ ของหน้า Home ได้ที่นี่ */}
      <HeroSlider />
      <Hero />
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            ฟีเจอร์เด่นของเรา
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* ตัวอย่าง Card เนื้อหา */}
            <div className="p-6 border rounded-lg text-center">
              <h3 className="text-xl font-semibold">ค้นหาง่าย</h3>
              <p className="mt-2 text-gray-600">
                ระบุความต้องการและค้นหาเพื่อนที่ใช่สำหรับคุณ
              </p>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <h3 className="text-xl font-semibold">ปลอดภัย</h3>
              <p className="mt-2 text-gray-600">
                เรามีระบบยืนยันตัวตนเพื่อความน่าเชื่อถือ
              </p>
            </div>
            <div className="p-6 border rounded-lg text-center">
              <h3 className="text-xl font-semibold">คอมมูนิตี้ดีๆ</h3>
              <p className="mt-2 text-gray-600">
                พบปะผู้คนใหม่ๆ ที่มีความสนใจเหมือนกัน
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="py-5 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                วิธีใช้งาน?
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">1</div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">สร้างโปรไฟล์  {"👤"}</h3>
                    <p className="mt-2 text-base text-gray-500">ลงทะเบียนและบอกเราว่าคุณสนใจทำกิจกรรมอะไร</p>
                </div>
                {/* Step 2 */}
                <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">2</div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">ค้นหาเพื่อน {"💬"}</h3>
                    <p className="mt-2 text-base text-gray-500">ดูประกาศจากเพื่อนๆ หรือสร้างประกาศของคุณเอง</p>
                </div>
                {/* Step 3 */}
                <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">3</div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">นัดเจอกัน! {"🤝"}</h3>
                    <p className="mt-2 text-base text-gray-500">เริ่มต้นมิตรภาพใหม่ๆ และสนุกกับกิจกรรมของคุณ</p>
                </div>
            </div>
        </div>
      </div>
      <hr/>

      <Resume />
      <About />
      


    </>
  );
}

