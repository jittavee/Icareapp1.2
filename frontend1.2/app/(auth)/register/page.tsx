// 'use client';

// import { useForm, FieldError } from 'react-hook-form'; // สามารถ import FieldError มาใช้ได้เพื่อความชัดเจน แต่ไม่จำเป็น
// import api from '@/lib/api';
// import { useRouter } from 'next/navigation';

// interface RegisterFormData {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   firstName: string;
//   lastName: string;
//   phone?: string;
//   address?: string;
// }

// export default function RegisterPage() {
//   const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
//   const router = useRouter();

//   const onSubmit: (data: RegisterFormData) => Promise<void> = async (data) => {
//     try {
//       // ไม่จำเป็นต้องส่ง confirmPassword ไปที่ API
//       const { confirmPassword, ...apiData } = data;
//       const response = await api.post('/auth/register', apiData);
//       alert(response.data.message);
//       router.push('/login');
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Registration failed');
//     }
//   };

//   // watch a password field to use it for validation
//   const password = watch('password');

//   return (
//     <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-5 text-center">Create an Account</h1>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div>
//           <label className="block mb-1 font-medium">Username</label>
//           <input
//             {...register('username', { required: 'Username is required.' })} // CHANGE 1: ใส่ message ที่นี่
//             className="w-full p-2 border rounded"
//           />
//           {/* CHANGE 2: แสดง .message จาก object */}
//           {errors.username && <span className="text-red-500 text-sm mt-1">{String(errors.username.message)}</span>}
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Email</label>
//           <input
//             type="email"
//             {...register('email', { required: 'Email is required.' })} // CHANGE 1
//             className="w-full p-2 border rounded"
//           />
//           {/* CHANGE 2 */}
//           {errors.email && <span className="text-red-500 text-sm mt-1">{String(errors.email.message)}</span>}
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Password</label>
//           <input
//             type="password"
//             {...register('password', {
//               required: 'Password is required.', // CHANGE 1
//               minLength: { value: 6, message: 'Password must be at least 6 characters.' } // Best practice
//             })}
//             className="w-full p-2 border rounded"
//           />
//           {/* CHANGE 2 */}
//           {errors.password && <span className="text-red-500 text-sm mt-1">{String(errors.password.message)}</span>}
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Confirm Password</label>
//           <input
//             type="password"
//             {...register('confirmPassword', {
//               required: 'Please confirm your password.', // CHANGE 1
//               validate: value => value === password || "Passwords do not match." // validate function ถูกต้องแล้ว
//             })}
//             className="w-full p-2 border rounded"
//           />
//           {/* CHANGE 2: นี่คือจุดที่แก้ปัญหาโดยตรง */}
//           {errors.confirmPassword && <span className="text-red-500 text-sm mt-1">{String(errors.confirmPassword.message)}</span>}
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">First Name</label>
//           <input
//             {...register('firstName', { required: 'First name is required.' })} // CHANGE 1
//             className="w-full p-2 border rounded"
//           />
//           {/* CHANGE 2 */}
//           {errors.firstName && <span className="text-red-500 text-sm mt-1">{String(errors.firstName.message)}</span>}
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Last Name</label>
//           <input
//             {...register('lastName', { required: 'Last name is required.' })} // CHANGE 1
//             className="w-full p-2 border rounded"
//           />
//           {/* CHANGE 2 */}
//           {errors.lastName && <span className="text-red-500 text-sm mt-1">{String(errors.lastName.message)}</span>}
//         </div>

//         {/* --- Optional Fields --- */}
//         <div>
//           <label className="block mb-1 font-medium">Phone Number (Optional)</label>
//           <input {...register('phone')} className="w-full p-2 border rounded" />
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Address (Optional)</label>
//           <textarea {...register('address')} className="w-full p-2 border rounded" />
//         </div>

//         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Register</button>
//       </form>
//     </div>
//   );
// }

// app/(auth)/register/page.tsx (โค้ดใหม่ที่แก้ไขแล้ว)
'use client';

import { useForm, SubmitHandler } from 'react-hook-form'; // 👈 1. ลบ FieldError ที่ไม่ได้ใช้ออก
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isAxiosError } from 'axios'; // 👈 2. Import isAxiosError

// 👈 3. สร้าง Type สำหรับ Register Form ให้ครบทุก field
type RegisterFormInputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string; // ต้องมี field นี้ใน Type ด้วย
  firstName: string;
  lastName: string;
  phone?: string; // field ที่ไม่บังคับใส่ '?'
  address?: string; // field ที่ไม่บังคับใส่ '?'
};

export default function RegisterPage() {
  // 👈 4. กำหนด Type ให้ useForm
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormInputs>();
  const router = useRouter();

  // 👈 5. การใช้ watch('password') ถูกต้องแล้ว เพื่อใช้ในการ validate confirmPassword
  const password = watch('password');

  // ไม่จำเป็นต้อง watch('confirmPassword') เพราะเราไม่ได้ใช้ค่าของมันไปทำอะไรต่อ
  // เราแค่ต้องการ validate มันเทียบกับ password ซึ่งทำใน register(...) ได้เลย
  // การลบบรรทัด const confirmPassword = watch('confirmPassword') จะแก้ Error 'no-unused-vars'

  // 👈 6. กำหนด Type ให้ onSubmit
  // 
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
  try {
    // สร้าง Object ที่จะส่งไป API ด้วยตัวเองเลย
    // เลือกมาเฉพาะ field ที่ API ต้องการ
    const apiData = {
      username: data.username,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
    };

    const response = await api.post('/auth/register', apiData);
    
    alert(response.data.message);
    router.push('/login');
  } catch (error) {
    if (isAxiosError(error)) {
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    } else {
      console.error('An unexpected error occurred:', error);
      alert('An unexpected error occurred.');
    }
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-5 text-center">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            {...register('username', { required: 'Username is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => value === password || "Passwords do not match"
            })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
        </div>

        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              {...register('firstName', { required: 'First name is required' })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              {...register('lastName', { required: 'Last name is required' })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
          </div>
        </div>

        {/* Optional fields: Phone & Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
          <input
            {...register('phone')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address (Optional)</label>
          <textarea
            {...register('address')}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md">
          Register
        </button>
      </form>
    </div>
  );
}