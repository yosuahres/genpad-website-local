"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../constants/navigation";
import { fetchFromBackend } from "../../../../utils/api";

export default function SystemConfigPage() {
  const [settings, setSettings] = useState({
    platform_name: "Genpad Admin",
    support_email: "support@genpad.id",
    upload_max_size: 10,
    log_retention_days: 30,
    maintenance_mode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // const data = await fetchFromBackend("/system-settings");
        // setSettings((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update each setting in the database
      const updates = Object.entries(settings).map(([key, value]) =>
        fetchFromBackend(`/system-settings/${key}`, {
          method: "PATCH",
          body: JSON.stringify({ value }),
        })
      );
      await Promise.all(updates);
      alert("All settings saved successfully!");
    } catch (err) {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <DashboardLayout roleId={ROLE_IDS.SUPERADMIN}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-gray-600 mt-1">Adjust how the platform looks and functions.</p>
      </div>

      <div className="max-w-4xl space-y-8">
        <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-semibold">Website Identity</div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Platform Name</label>
              <input
                type="text"
                value={settings.platform_name}
                onChange={(e) => handleChange("platform_name", e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2.5 px-4 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Support Email</label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => handleChange("support_email", e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2.5 px-4 mt-1"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-semibold">Report Upload Rules</div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum File Size (MB)</label>
              <div className="flex items-center mt-1">
                <input
                  type="number"
                  value={settings.upload_max_size}
                  onChange={(e) => handleChange("upload_max_size", Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 py-2.5 px-4"
                />
                <span className="ml-3 text-gray-500">MB</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Data Management */}
        <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-semibold">Data Management</div>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700">Activity Log Retention (Days)</label>
            <p className="text-xs text-gray-400 mb-2">Logs older than this will be automatically cleared.</p>
            <input
              type="number"
              value={settings.log_retention_days}
              onChange={(e) => handleChange("log_retention_days", Number(e.target.value))}
              className="w-32 rounded-md border border-gray-300 py-2.5 px-4"
            />
          </div>
        </section>

        {/* Footer Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}