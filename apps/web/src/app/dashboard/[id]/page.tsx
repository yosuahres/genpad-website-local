"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  FileText,
  Clock,
  Hash
} from "lucide-react";

interface Report {
  id: string | number;
  file_name: string;
  uploaded_at: string;
  child_name: string;
  region: string;
  education_level: string;
  academic_year: string;
  image_urls: string;
}

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Fetch Data
  useEffect(() => {
    const fetchReport = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setReport(data);
      setLoading(false);
    };
    fetchReport();
  }, [id, supabase]);

  // 2. Parse Image URLs
  const parseImages = (data: string): string[] => {
    try {
      if (!data) return [];
      if (data.startsWith("[")) return JSON.parse(data);
      return [data];
    } catch { return []; }
  };

  const images = report ? parseImages(report.image_urls) : [];
  const totalPages = images.length;

  // 3. Navigation Logic
  const nextImage = useCallback(() => {
    if (currentIndex < totalPages - 1) setCurrentIndex(prev => prev + 1);
  }, [currentIndex, totalPages]);

  const prevImage = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  }, [currentIndex]);

  // 4. Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, prevImage]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  );

  if (!report) return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
      Report not found.
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden">
      
      {/* --- HEADER --- */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-30 shadow-xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="font-bold text-slate-100 text-sm md:text-base leading-tight">
              {report.child_name}
            </h1>
            <p className="text-[10px] md:text-xs text-slate-500 font-mono">
              {report.file_name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-xs font-medium bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
            Page {currentIndex + 1} of {totalPages}
          </div>
          <a 
            href={images[currentIndex]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-all shadow-lg active:scale-95"
            title="Open original image"
          >
            <Download size={20} />
          </a>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* --- IMAGE VIEWER (CAROUSEL) --- */}
        <main className="flex-1 relative flex items-center justify-center bg-black/30 p-4">
          
          {/* Left Arrow */}
          {totalPages > 1 && currentIndex > 0 && (
            <button 
              onClick={prevImage}
              className="absolute left-6 z-20 p-4 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-white/5 backdrop-blur-md transition-all group"
            >
              <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}
          
          {/* Right Arrow */}
          {totalPages > 1 && currentIndex < totalPages - 1 && (
            <button 
              onClick={nextImage}
              className="absolute right-6 z-20 p-4 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-white/5 backdrop-blur-md transition-all group"
            >
              <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Document Display */}
          <div className="relative max-w-full max-h-full flex justify-center p-2">
            {images.length > 0 ? (
              <img 
                key={currentIndex}
                src={images[currentIndex]} 
                alt={`Document page ${currentIndex + 1}`} 
                className="max-h-[82vh] w-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm object-contain border border-slate-800 animate-in fade-in zoom-in-95 duration-300"
              />
            ) : (
              <div className="text-slate-600 flex flex-col items-center">
                <FileText size={64} className="mb-4 opacity-10" />
                <p>No document preview available.</p>
              </div>
            )}
          </div>

          {/* Page Progress Bar (Bottom) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-2 bg-slate-900/50 backdrop-blur-sm rounded-full border border-white/5">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-blue-500 w-4' : 'bg-slate-700'}`}
              />
            ))}
          </div>
        </main>

        {/* --- SIDEBAR --- */}
        <aside className="w-full lg:w-80 bg-white text-slate-900 p-8 overflow-y-auto z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <FileText size={32} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Report Details</h2>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Metadata</p>
          </div>

          <div className="space-y-8">
            <InfoBlock icon={<MapPin size={18} />} label="Region" value={report.region} />
            <InfoBlock icon={<GraduationCap size={18} />} label="Education" value={report.education_level} />
            <InfoBlock icon={<Calendar size={18} />} label="Year" value={report.academic_year} />
            
            <div className="pt-8 border-t border-slate-100">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock size={12} /> Uploaded
                  </span>
                  <span className="font-semibold text-slate-700">
                    {new Date(report.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Hash size={12} /> Record ID
                  </span>
                  <span className="font-mono font-semibold text-slate-700">
                    #{String(report.id).slice(0, 8)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2.5 bg-slate-50 text-blue-600 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-800 leading-tight">{value}</p>
      </div>
    </div>
  );
}