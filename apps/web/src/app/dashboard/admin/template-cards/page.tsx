// apps/web/src/app/dashboard/admin/data/template-cards/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from "../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../constants/navigation";
import { fetchFromBackend } from "../../../../utils/api";
import { createClient } from "../../../../utils/supabase/client";
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

  const templateUrl = formData.template_file
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/templates/${formData.template_file}`
    : null;

  return (
    <DashboardLayout roleId={ROLE_IDS.ADMIN}>
      <div className="h-full flex flex-col p-6 gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Message Template</h1>
            <p className="text-slate-500 text-sm mt-1">Thank Card Template and message template</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving || !formData.template_file}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
            Save Configuration
          </button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          {/* Left: Image Preview & Upload */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon size={16} className="text-slate-400" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Card Image</span>
              </div>
              <label className="cursor-pointer bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors flex items-center gap-2 text-sm font-medium">
                <Upload size={16} />
                Upload
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
              </label>
            </div>
            <div className="flex-1 p-6 flex items-center justify-center bg-slate-50 min-h-[300px]">
              {templateUrl ? (
                <img 
                  src={templateUrl} 
                  alt="Template preview" 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <ImageIcon size={48} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium">No template image uploaded</p>
                  <p className="text-xs mt-1">Upload an image to preview it here</p>
                </div>
              )}
            </div>
            {formData.template_file && (
              <div className="px-6 py-3 border-t border-slate-100 bg-white">
                <span className="text-xs font-mono text-slate-500 truncate block">{formData.template_file}</span>
              </div>
            )}
          </div>

          {/* Right: Message Editor */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <MessageSquare size={16} className="text-black" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">WhatsApp Message</span>
            </div>
            <div className="flex-1 p-6 flex flex-col min-h-[300px]">
              <textarea 
                className="w-full flex-1 p-4 border border-slate-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50 focus:bg-white transition-colors" 
                value={formData.default_message}
                onChange={e => setFormData({...formData, default_message: e.target.value})}
                placeholder="Write the message here..."
              />
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{formData.default_message.length} characters</span>
                <span>Supports WhatsApp formatting: *bold*, _italic_, ~strikethrough~</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}