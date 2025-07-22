'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { type JobPostDetails, type JobApplication, type User } from '@/types';
import Image from 'next/image';
// Import Component ที่เราเพิ่งสร้าง
import CommentSection from '@/components/CommentSection';
import axios from 'axios';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string; // ดึง id จาก URL
  
  const [job, setJob] = useState<JobPostDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  
  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get<JobPostDetails>(`/jobs/${id}`);
        setJob(res.data);

        // ตรวจสอบสถานะการสมัครและเจ้าของโพสต์
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
          const currentUser: User = JSON.parse(userDataString);
          // เช็คว่าเป็นเจ้าของโพสต์หรือไม่
          if (currentUser.id === res.data.author.id) {
            setIsOwner(true);
          }
          // เช็คว่าเคยสมัครงานนี้ไปแล้วหรือยัง
          if (res.data.applications.some((app: JobApplication) => app.applicant.id === currentUser.id)) {
            setIsApplied(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch job details:", err);
        setError("Job not found or an error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      await api.post(`/jobs/${id}/apply`);
      setIsApplied(true);
      alert("Successfully applied for the job!");
      // อัปเดตจำนวนผู้สมัครใน UI ทันที (ทางเลือก)
      setJob(prev => prev ? { ...prev, applications: [...prev.applications, { id: 'temp', applicant: JSON.parse(localStorage.getItem('user') || '{}') }] } : null);
    } catch(error) {
    if (axios.isAxiosError(error)) { // ใช้ Type Guard ของ Axios
      alert(error.response?.data?.message || "An error occurred.");
    } else {
      alert("An unexpected error occurred.");
    }
}
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job post? This action cannot be undone.")) {
      try {
        await api.delete(`/jobs/${id}`);
        alert("Job post deleted successfully.");
        router.push('/jobs');
      } catch  {
        alert("Failed to delete job post. You may not have permission.");
      }
    }
  };

  // --- ส่วนแสดงผล ---
  if (isLoading) return <div className="text-center p-10">Loading job details...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!job) return null;

  const imageUrl = job.imageUrl
    ? `${API_BASE_URL}${job.imageUrl}`
    : `https://placehold.co/1200x600/EFEFEF/31343C&text=No+Image`;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <Image src={imageUrl} alt={job.title} className="mx-auto  h-100 rounded-lg object-cover"/>
        
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">{job.category.name}</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">{job.title}</h1>
              <p className="text-gray-500 mt-1">
                Posted by <Link href={`/users/${job.author.id}`} className="font-semibold text-blue-600 hover:underline">{job.author.username}</Link> on {new Date(job.createdAt).toLocaleDateString()}
              </p>

 {/* --- ส่วนที่เพิ่มเข้ามา --- */}
            <div className="flex flex-wrap gap-4 my-4 p-4 bg-gray-50 rounded-lg">
                {job.duration && (
                    <div>
                        <p className="text-sm font-bold text-gray-500">Duration</p>
                        <p className="text-lg">{job.duration}</p>
                    </div>
                )}
                {job.budget && (
                    <div>
                        <p className="text-sm font-bold text-gray-500">Budget</p>
                        <p className="text-2xl font-bold text-green-600">฿{new Intl.NumberFormat('th-TH').format(job.budget)}</p>
                    </div>
                )}

                {job.location && (
                    <div>
                        <p className="text-sm font-bold text-gray-500">Location</p>
                        <p className="text-lg">{job.location}</p>
                    </div>
                )}
            </div>
            {/* --- สิ้นสุดส่วนที่เพิ่ม --- */}

            </div>
            {isOwner && (
              <div className="flex gap-2">
                <button onClick={() => alert('Edit page not implemented yet!')} className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm">Edit</button>
                <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">Delete</button>
              </div>
            )}
          </div>
          
          <div className="prose max-w-none mt-6 text-gray-800">
            <p className="whitespace-pre-wrap">{job.description}</p>
          </div>
          
          <div className="mt-8">
            <button 
              onClick={handleApply} 
              disabled={isApplied || isOwner}
              className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isOwner ? "You are the owner" : isApplied ? "✓ Applied" : "Apply for this Job-สนใจรับงาน"}
            </button>
          </div>

          {/* เรียกใช้ Component ที่แยกออกมา */}
          <CommentSection jobPostId={job.id} />
        </div>
      </div>
    </div>
  );
}