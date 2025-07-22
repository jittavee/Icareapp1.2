// client/app/jobs/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
// แก้ไข #1: ลบ JobCategory ที่ไม่ได้ใช้ออก
import { type JobPostDetails } from '@/types';
import Link from 'next/link';

type JobEditFormData = {
  title: string;
  description: string;
  categoryId: string;
};

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<JobEditFormData>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchJobPost = async () => {
      try {
        const response = await api.get<JobPostDetails>(`/jobs/${id}`);
        const job = response.data;
        reset({
          title: job.title,
          description: job.description,
          categoryId: job.category.id,
        });
      } catch (err) {
        console.error("Failed to fetch job data for editing:", err);
        setError('Failed to load job post data.');
      }
    };

    fetchJobPost();
  }, [id, reset]);
  
  const onSubmit = async (data: JobEditFormData) => {
    try {
      await api.put(`/jobs/${id}`, data);
      alert('Job post updated successfully!');
      router.push(`/jobs/${id}`);
      router.refresh();
    } catch (err) { // แก้ไข #2: ใช้งานตัวแปร err
      alert('Failed to update job post. You might not be the owner.');
      console.error("Update failed:", err); 
    }
  };

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Job Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="title" className="block font-medium">Title</label>
          <input 
            id="title"
            {...register('title', { required: true })}
            className="w-full p-2 border rounded-md mt-1"
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium">Description</label>
          <textarea 
            id="description"
            rows={5}
            {...register('description', { required: true })}
            className="w-full p-2 border rounded-md mt-1"
          />
        </div>
        <div>
          <label htmlFor="categoryId" className="block font-medium">Category ID (Temporary)</label>
          <input 
            id="categoryId"
            {...register('categoryId', { required: true })}
            className="w-full p-2 border rounded-md mt-1"
            // ในอนาคตควรเปลี่ยนเป็น dropdown
          />
        </div>
        <div className="flex gap-4 pt-4 border-t">
          <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-7-00 disabled:bg-gray-400">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href={`/jobs/${id}`} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}