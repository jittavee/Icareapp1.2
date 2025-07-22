'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { type JobPostSummary, type JobCategory } from '@/types';
import router from 'next/router';
import Image from 'next/image';
// Component ย่อยสำหรับแสดงการ์ดงาน
function JobCard({ job, onEdit }: { job: JobPostSummary, onEdit: (jobId: string) => void }) {
  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');
  const imageUrl = job.imageUrl ? `${API_BASE_URL}${job.imageUrl}` : `https://placehold.co/600x400/EEE/31343C&text=${encodeURIComponent(job.category.name)}`;
  

const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    onEdit(job.id);
     // <--- **ใส่บรรทัดนี้เพื่อดีบัก**
   // **ตรวจสอบว่ามีการเรียกใช้ onEdit ที่นี่**
  }

// ใน JobBoardPage Component:
const handleEdit = (jobId: string) => {
  router.push(`/jobs/${jobId}/edit`); // สั่งให้ router พาไปหน้า edit
};

// และส่ง props onEdit ไปให้ JobCard
<JobCard key={job.id} job={job} onEdit={handleEdit} />

  // เช็คว่าเป็นเจ้าของโพสต์หรือไม่ (สมมติว่ามีข้อมูล user ใน localStorage)
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const isOwner = user.id === job.author.id;


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
      <Link href={`/jobs/${job.id}`} className="block">
        <Image src={imageUrl} alt={job.title} className="w-full h-48 object-cover"/>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full self-start">{job.category.name}</span>
            {isOwner && (
                <button onClick={handleEditClick} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                    Edit
                </button>
            )}
        </div>
        <h3 className="font-bold text-lg mt-2 truncate">
          <Link href={`/jobs/${job.id}`} className="hover:underline">{job.title}</Link>
        </h3>
        <div className="text-sm text-gray-600 mt-2 space-y-1">
            {job.location && <p className="truncate">📍 {job.location}</p>}
            {job.budget && <p>💰 {job.budget.toLocaleString()} THB</p>}
        </div>
        <div className="mt-auto pt-4 flex justify-between text-xs sm:text-sm text-gray-600 border-t">
          <span>{job._count.applications} Applicants</span>
          <span>{job._count.comments} Comments</span>
        </div>
      </div>
    </div>
  );
}



// --- JobBoardPage Component (Responsive) ---
export default function JobBoardPage() {
  const [jobs, setJobs] = useState<JobPostSummary[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();


    useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [jobsRes, categoriesRes] = await Promise.all([
          api.get('/jobs', { params: { categoryId: selectedCategory || undefined } }),
          api.get('/jobs/categories')
        ]);
        setJobs(jobsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [selectedCategory]);

  const handleEdit = (jobId: string) => {
    console.log(`Navigating to edit page for job ID: ${jobId}`); // <--- **ใส่บรรทัดนี้เพื่อดีบัก**
    router.push(`/jobs/${jobId}/edit`);
  };

   return (
    <div className="container mx-auto p-4 md:p-6">
      {/* --- Header Section (Responsive) --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold self-start sm:self-center">Job Board</h1>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-md w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <Link href="/jobs/new" className="text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 whitespace-nowrap">Post a Job</Link>
        </div>
      </div>

      {/* --- Grid Section (Responsive) --- */}
      {isLoading ? <p>Loading...</p> : (
        jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {jobs.map(job => <JobCard key={job.id} job={job} onEdit={handleEdit} />)}
            </div>
        ) : (
            <p className="text-center text-gray-500 mt-10">No jobs found for this category.</p>
        )
      )}
    </div>
  );
}

// client/app/jobs/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/api';
// import { type JobPostSummary, type JobCategory } from '@/types';

// // ===================================
// //      CHILD COMPONENT: JobCard
// // ===================================
// function JobCard({ job, onEdit }: { job: JobPostSummary, onEdit: (jobId: string) => void }) {
//   const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');
//   const imageUrl = job.imageUrl ? `${API_BASE_URL}${job.imageUrl}` : `https://placehold.co/600x400/EEE/31343C&text=${encodeURIComponent(job.category.name)}`;

//   // ตรวจสอบว่าเป็นเจ้าของโพสต์หรือไม่
//   const [isOwner, setIsOwner] = useState(false);
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     if (user && user.id === job.author.id) {
//       setIsOwner(true);
//     }
//   }, [job.author.id]);


//   const handleEditClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     console.log(`JobCard: Edit button clicked for job ID: ${job.id}`);
//     onEdit(job.id); // เรียกฟังก์ชันจาก Parent
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
//       <Link href={`/jobs/${job.id}`} className="block">
//         <img src={imageUrl} alt={job.title} className="w-full h-48 object-cover"/>
//       </Link>
//       <div className="p-4 flex flex-col flex-grow">
//         <div className="flex justify-between items-start">
//           <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full self-start">{job.category.name}</span>
//           {isOwner && (
//             <button
//               onClick={handleEditClick}
//               className="text-sm text-blue-600 hover:text-blue-800 font-semibold p-1"
//               aria-label={`Edit ${job.title}`}
//             >
//               Edit
//             </button>
//           )}
//         </div>
//         <h3 className="font-bold text-lg mt-2 truncate">
//           <Link href={`/jobs/${job.id}`} className="hover:underline">{job.title}</Link>
//         </h3>
//         <div className="text-sm text-gray-600 mt-2 space-y-1">
//           {job.location && <p className="truncate">📍 {job.location}</p>}
//           {job.budget && <p>💰 {job.budget.toLocaleString()} THB</p>}
//         </div>
//         <div className="mt-auto pt-4 flex justify-between text-xs sm:text-sm text-gray-600 border-t">
//           <span>{job._count.applications} Applicants</span>
//           <span>{job._count.comments} Comments</span>
//         </div>
//       </div>
//     </div>
//   );
// }


// // ===================================
// //      PARENT COMPONENT: JobBoardPage
// // ===================================
// export default function JobBoardPage() {
//   const [jobs, setJobs] = useState<JobPostSummary[]>([]);
//   const [categories, setCategories] = useState<JobCategory[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter(); // <--- ประกาศ useRouter

//   // ฟังก์ชันสำหรับจัดการการกดปุ่ม Edit
//   const handleEdit = (jobId: string) => {
//     console.log(`JobBoardPage: Navigating to edit page for job ID: ${jobId}`);
//     // แทนที่ Alert ด้วยการนำทางจริงๆ
//     // alert('Edit page not implemented yet!');
//     router.push(`/jobs/${jobId}/edit`);
//   };

//   useEffect(() => {
//     async function fetchData() {
//       setIsLoading(true);
//       try {
//         const [jobsRes, categoriesRes] = await Promise.all([
//           api.get('/jobs', { params: { categoryId: selectedCategory || undefined } }),
//           api.get('/jobs/categories')
//         ]);
//         setJobs(jobsRes.data);
//         setCategories(categoriesRes.data);
//       } catch (error) {
//         console.error("Failed to fetch data", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchData();
//   }, [selectedCategory]);

//   return (
//     <div className="container mx-auto p-4 md:p-6">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//         <h1 className="text-2xl sm:text-3xl font-bold self-start sm:self-center">Job Board</h1>
//         <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="p-2 border rounded-md w-full sm:w-auto"
//           >
//             <option value="">All Categories</option>
//             {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//           </select>
//           <Link href="/jobs/new" className="text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 whitespace-nowrap">Post a Job</Link>
//         </div>
//       </div>

//       {/* Grid Section */}
//       {isLoading ? <p>Loading...</p> : (
//         jobs.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {jobs.map(job => (
//                 <JobCard
//                   key={job.id}
//                   job={job}
//                   onEdit={handleEdit} // <--- ส่งฟังก์ชัน handleEdit ไปเป็น prop ชื่อ onEdit
//                 />
//               ))}
//             </div>
//         ) : (
//             <p className="text-center text-gray-500 mt-10">No jobs found for this category.</p>
//         )
//       )}
//     </div>
//   );
// }