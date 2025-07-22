// client/app/jobs/new/page.tsx
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { type JobCategory } from '@/types';

// สร้าง Type สำหรับข้อมูลในฟอร์ม
type JobFormInputs = {
  title: string;
  description: string;
  categoryId: string;
  duration: string;
  budget: number;
  location: string;
  jobImage?: FileList;
};

export default function NewJobPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<JobFormInputs>();
  const router = useRouter();
  const [categories, setCategories] = useState<JobCategory[]>([]);

  useEffect(() => {
    // ดึงหมวดหมู่งานมาใส่ใน dropdown
    const fetchCategories = async () => {
      try {
        const res = await api.get<JobCategory[]>('/jobs/categories');
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit: SubmitHandler<JobFormInputs> = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('categoryId', data.categoryId);
    formData.append('duration', data.duration);
    formData.append('budget', String(data.budget));
    formData.append('location',data.location) // แปลงเป็น String ก่อนส่ง

    if (data.jobImage && data.jobImage[0]) {
      formData.append('jobImage', data.jobImage[0]);
    }

    try {
      const response = await api.post('/jobs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Job posted successfully!');
      router.push(`/jobs/${response.data.id}`);
    } catch (error) {
      console.error(error);
      alert('Failed to post job. Please try again.');
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
            <input id="title" {...register('title', { required: 'Job title is required' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>




          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="categoryId" {...register('categoryId', { required: 'Please select a category' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white">
              <option value="">-- Select a Category --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Job Duration</label>
              <input id="duration" {...register('duration', { required: 'Duration is required' })} placeholder="e.g., 2-3 days, 8 hours" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>}
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (Baht)</label>
              <input id="budget" type="number" step="0.01" {...register('budget', { required: 'Budget is required', valueAsNumber: true, min: { value: 0, message: 'Budget must be positive' } })} placeholder="e.g., 1500" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
            </div>
            <div>
              <label htmlFor="location" className="block font-medium">Location</label>
              <input id="location" {...register('location')} className="w-full p-2 border rounded-md mt-1" />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" {...register('description', { required: 'Description is required' })} rows={5} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="jobImage" className="block text-sm font-medium text-gray-700">Image (Optional)</label>
            <input id="jobImage" type="file" {...register('jobImage')} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/jobs" className="text-gray-600 hover:text-gray-900">Cancel</Link>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md disabled:bg-gray-400">
              {isSubmitting ? 'Submitting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}