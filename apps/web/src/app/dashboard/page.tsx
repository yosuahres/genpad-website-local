// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "../../utils/supabase/client";
// import { Users, MapPin, FileText, ArrowUpRight } from "lucide-react";
// import Link from "next/link";
// import Sidebar from "../../components/Layouts/sidebar/Sidebar";
// import Header from "../../components/Layouts/header/header";

// export default function DashboardPage() {
//   const supabase = createClient();
//   const [stats, setStats] = useState({
//     totalReports: 0,
//     totalStudents: 0,
//     uniqueRegions: 0,
//     latestReports: [] as any[],
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
        
//         const { data: allData, count: reportCount } = await supabase
//           .from("reports")
//           .select("child_name, region", { count: "exact" });

//         const uniqueStudents = new Set(allData?.map(r => r.child_name)).size;
//         const uniqueRegions = new Set(allData?.map(r => r.region)).size;

//         const { data: recent } = await supabase
//           .from("reports")
//           .select("*")
//           .order("uploaded_at", { ascending: false })
//           .limit(5);

//         setStats({
//           totalReports: reportCount || 0,
//           totalStudents: uniqueStudents,
//           uniqueRegions: uniqueRegions,
//           latestReports: recent || [],
//         });
//       } catch (err) {
//         console.error("Dashboard load error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [supabase]);

//   const statCards = [
//     { label: "Total Reports", value: stats.totalReports, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
//     { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
//     { label: "Active Regions", value: stats.uniqueRegions, icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50" },
//   ];

//   return (
//     <div className="flex h-screen bg-slate-50 overflow-hidden">
//       <Sidebar />
//       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <Header />
//         <div className="p-8 flex-1 overflow-y-auto">
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold text-slate-900">Summary</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             {statCards.map((card) => (
//               <div key={card.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-5">
//                 <div className={`${card.bg} ${card.color} p-3 rounded-lg`}>
//                   <card.icon size={24} />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-slate-500">{card.label}</p>
//                   <p className="text-2xl font-bold text-slate-900">{loading ? "..." : card.value}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
//             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
//               <h3 className="font-bold text-slate-900 text-lg">Recently Uploaded Reports</h3>
//               <Link href="/dashboard/reports" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
//                 View All <ArrowUpRight size={16} />
//               </Link>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Student</th>
//                     <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Year</th>
//                     <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {loading ? (
//                     <tr><td colSpan={3} className="p-6 text-center text-slate-400 text-sm">Loading activity...</td></tr>
//                   ) : stats.latestReports.map((report) => (
//                     <tr key={report.id} className="hover:bg-slate-50 transition-colors">
//                       <td className="px-6 py-4 font-medium text-slate-900 text-sm">{report.child_name}</td>
//                       <td className="px-6 py-4 text-slate-600 text-sm">{report.academic_year}</td>
//                       <td className="px-6 py-4 text-right">
//                         <Link href={`/dashboard/reports/${report.id}`} className="text-blue-600 hover:underline text-sm">
//                           Details
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }