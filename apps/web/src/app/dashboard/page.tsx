"use client";

import Sidebar from "../../components/Layouts/sidebar/Sidebar";
import Header from "../../components/Layouts/header/header";
import { useEffect, useState, useMemo } from "react";
import { createClient } from "../../utils/supabase/client";
import { Search, Filter, Eye, FileStack } from "lucide-react";
import Link from "next/link";

interface Report {
  id: string; // Ensure your DB includes an 'id'
  file_name: string;
  uploaded_at: string;
  child_name: string;
  region: string;
  education_level: string;
  academic_year: string;
  image_urls: string;
}

export default function DashboardPage() {
  const supabase = createClient();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("reports").select("*");
        if (error) throw error;
        setReports(data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [supabase]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch = r.child_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = regionFilter === "All" || r.region === regionFilter;
      return matchesSearch && matchesRegion;
    });
  }, [reports, searchTerm, regionFilter]);

  const uniqueRegions = ["All", ...Array.from(new Set(reports.map((r) => r.region)))];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Reports</h2>
              <p className="text-slate-500">Manage and view student academic documents</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search student..."
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 shadow-sm">
                <Filter size={16} className="text-slate-400 mr-2" />
                <select 
                  className="bg-transparent text-sm py-2 outline-none text-slate-700"
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  {uniqueRegions.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Student</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Region</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Academic Year</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={4} className="p-10 text-center text-slate-400">Loading reports...</td></tr>
                ) : filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-900">{report.child_name}</td>
                    <td className="px-6 py-4 text-slate-600">{report.region}</td>
                    <td className="px-6 py-4 text-slate-600">{report.academic_year}</td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/dashboard/${report.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm gap-1"
                      >
                        <Eye size={16} /> View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}