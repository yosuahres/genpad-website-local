import Link from 'next/link';
import { FileQuestion, ChevronLeft } from 'lucide-react';
import { Button } from 'ui';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="text-center max-w-md">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
          <FileQuestion size={48} className="text-slate-400" />
        </div>

        <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Page Not Found
        </h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4b545c] text-white rounded-xl font-semibold hover:bg-slate-700 transition-all shadow-md">
              <ChevronLeft size={18} />
              Return to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
            Genpad Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}