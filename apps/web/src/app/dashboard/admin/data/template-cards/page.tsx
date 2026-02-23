// apps/web/src/app/dashboard/admin/data/template-cards/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "../../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../../constants/navigation";
import { fetchFromBackend } from "../../../../../utils/api";
import { createClient } from "../../../../../utils/supabase/client";
import { Upload, Save, MessageSquare, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';

export default function GlobalMessagingPage() {
  const [configId, setConfigId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    template_file: '', 
    default_message: '',
    name: 'Global Config',
    template_type: 'card_template' 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetchFromBackend('/template-cards');
        if (response.data?.[0]) {
          const item = response.data[0];
          setConfigId(item.id);
          setFormData({ 
            template_file: item.template_file, 
            default_message: item.default_message,
            name: item.name || 'Global Config',
            template_type: item.template_type || 'STUDENT'
          });
        }
      } catch (err) { console.error('Load Error:', err); }
      finally { setLoading(false); }
    };
    loadConfig();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `template-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('templates')
      .upload(fileName, file, { upsert: true });

    if (error) {
      alert("Upload failed: " + error.message);
    } else {
      setFormData(prev => ({ ...prev, template_file: fileName }));
      alert("Image uploaded successfully!");
    }
    setSaving(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { 
        ...formData, 
        is_active: true 
      };
      
      const url = configId ? `/template-cards/${configId}` : '/template-cards';
      const method = configId ? 'PUT' : 'POST';
      
      const result = await fetchFromBackend(url, { 
        method, 
        body: JSON.stringify(payload) 
      });

      if (result) {
        alert("Settings saved successfully!");
        if (!configId && result.id) setConfigId(result.id);
      }
    } catch (err: any) { 
      console.error('Save Error:', err);
      alert("Error: " + (err.message || "Failed to save configuration")); 
    }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="max-w-xl mx-auto py-12 px-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">WhatsApp Configuration</h1>
        <p className="text-slate-500 mb-8 text-sm">Update the image and message sent to all parents.</p>
        
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-8">
          {/* File Upload */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Card Image (Bucket)</label>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-3">
                <ImageIcon size={18} className="text-slate-400" />
                <span className="text-sm font-mono truncate text-slate-600">
                  {formData.template_file || 'No file selected'}
                </span>
              </div>
              <label className="cursor-pointer bg-slate-900 text-white p-3 rounded-lg hover:bg-black transition-colors">
                <Upload size={18} />
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
              </label>
            </div>
          </div>

          {/* Message Text */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">WhatsApp Message</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 text-slate-300" size={18} />
              <textarea 
                className="w-full pl-10 p-4 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]" 
                value={formData.default_message}
                onChange={e => setFormData({...formData, default_message: e.target.value})}
                placeholder="Write the message here..."
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={saving || !formData.template_file}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
            Save & Update All Messages
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}