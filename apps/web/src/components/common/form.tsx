// apps/web/src/components/Dashboard/UserForm.tsx
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface UserFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEdit: boolean;
  submitLabel: string;
}

export const UserForm = ({ formData, setFormData, onSubmit, isEdit, submitLabel }: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-black ml-1">Full Name</label>
        <div className="relative text-black">
          <User className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            required 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-black placeholder:text-slate-400" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>
      </div>

      {!isEdit && (
        <>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black ml-1">Email</label>
            <div className="relative text-black">
              <Mail className="absolute left-4 top-3 text-slate-400" size={18} />
              <input 
                type="email" required 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-black placeholder:text-slate-400" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-black ml-1">Password</label>
            <div className="relative text-black">
              <Lock className="absolute left-4 top-3 text-slate-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required minLength={6}
                className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-black placeholder:text-slate-400" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-slate-400 hover:text-black">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </>
      )}

      <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg mt-2 transition-all">
        {submitLabel}
      </button>
    </form>
  );
};