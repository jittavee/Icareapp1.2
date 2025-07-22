// // client/app/(auth)/login/page.tsx
// 'use client';

// import { useForm } from 'react-hook-form';
// import api from '@/lib/api';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react'; // 1. Import useState

// export default function LoginPage() {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const router = useRouter();
//   const [loginError, setLoginError] = useState<string | null>(null); // 2. สร้าง state สำหรับเก็บข้อความ Error
//   const [isSubmitting, setIsSubmitting] = useState(false); // (Optional) State สำหรับปิดปุ่มตอนกำลังโหลด

//   const onSubmit = async (data: any) => {
//     setLoginError(null); // 3. เคลียร์ Error เก่าทุกครั้งที่กด Submit
//     setIsSubmitting(true); // (Optional) เริ่มการโหลด

//     try {
//       const response = await api.post('/auth/login', data);
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
      
//       // router.push('/profile'); // ไม่ใช้ push ทันที
//       // ใช้ window.location.href เพื่อบังคับให้โหลดหน้าใหม่ทั้งหมด
//       // จะทำให้ Navbar และส่วนอื่นๆ ที่ใช้ localStorage อัปเดตตัวเอง 100%
//       window.location.href = '/profile';
      
//     } catch (error: any) {
//       // 4. ดักจับ Error และตั้งค่าข้อความใน state
//       // error.response.data.message คือข้อความที่เราส่งมาจาก Backend
//       const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
//       setLoginError(errorMessage);
      
//     } finally {
//         setIsSubmitting(false); // (Optional) สิ้นสุดการโหลด
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-5 text-center">Login</h1>
      
//       {/* 5. แสดงกล่องข้อความ Error ถ้ามี */}
//       {loginError && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
//           <span className="block sm:inline">{loginError}</span>
//         </div>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div>
//           <label className="block text-gray-700">Email</label>
//           <input 
//             type="email" 
//             {...register('email', { required: 'Email is required' })} 
//             className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//           />
//           {errors.email && <p className="text-red-500 text-sm mt-1">{String(errors.email.message)}</p>}
//         </div>
//         <div>
//           <label className="block text-gray-700">Password</label>
//           <input 
//             type="password" 
//             {...register('password', { required: 'Password is required' })} 
//             className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//           />
//            {errors.password && <p className="text-red-500 text-sm mt-1">{String(errors.password.message)}</p>}
//         </div>
//         <button 
//           type="submit"
//           disabled={isSubmitting} // (Optional) ปิดปุ่ม
//           className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
//         >
//           {isSubmitting ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// }

// app/(auth)/login/page.tsx (โค้ดใหม่ที่แก้ไขแล้ว)
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isAxiosError } from 'axios'; // 👈 1. import เครื่องมือสำหรับเช็ค Error

// 👈 2. สร้าง Type เพื่อกำหนดว่าฟอร์มของเรามีหน้าตาอย่างไร
type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  // 👈 3. บอก useForm ให้รู้ว่าเราจะใช้ Type ไหน
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const router = useRouter();

  // 👈 4. กำหนด Type ของ 'data' ให้ชัดเจนด้วย SubmitHandler
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await api.post('/auth/login', data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // 👈 5. เรียกใช้ router เพื่อแก้ Error 'no-unused-vars'
      router.push('/profile');
      
    } catch (error) {
      // 👈 6. จัดการ Error อย่างปลอดภัย
      if (isAxiosError(error)) {
        // ตอนนี้ TypeScript รู้แล้วว่า 'error' เป็น AxiosError
        // เราสามารถเข้าถึง error.response ได้อย่างปลอดภัย
        alert(error.response?.data?.message || 'Login failed. Please check your credentials.');
      } else {
        // Error ที่ไม่เกี่ยวกับ Network หรือ API
        console.error('An unexpected error occurred:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-5 text-center">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password"  className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          Login
        </button>
      </form>
    </div>
  );
}