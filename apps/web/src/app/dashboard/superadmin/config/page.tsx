import DashboardLayout from "../../../../components/Layouts/DashboardLayout";
import { ROLE_IDS } from "../../../../constants/navigation";

export default function SystemConfigPage() {
  return (
    <DashboardLayout roleId={ROLE_IDS.SUPERADMIN}>
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <p className="text-gray-600 mt-1">
          Adjust how the Genpad platform looks and functions for all users.
        </p>
      </div>

      <div className="max-w-4xl space-y-8">
        
        {/* Section 1: Identity */}
        <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-800">Website Identity</h3>
            <p className="text-sm text-gray-500">Update the name and contact details for the platform.</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
              <input
                type="text"
                defaultValue="Genpad Admin"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 border"
              />
              <p className="mt-1 text-xs text-gray-400">This name appears in the browser tab and email footers.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email Address</label>
              <input
                type="email"
                defaultValue="support@genpad.id"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 border"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Upload Rules */}
        <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-800">Report Upload Rules</h3>
            <p className="text-sm text-gray-500">Control what files users are allowed to upload to the system.</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum File Size (MB)</label>
              <div className="flex items-center">
                <input
                  type="number"
                  defaultValue={10}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 border"
                />
                <span className="ml-3 text-gray-500 font-medium">MB</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">Standard is 10MB per file.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allowed File Types</label>
              <input
                type="text"
                defaultValue="PDF, JPG, PNG"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-4 border"
              />
              <p className="mt-1 text-xs text-gray-400">Separate types with commas.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Maintenance Status */}
        <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Public Maintenance Mode</h3>
            <p className="text-sm text-gray-500">Temporarily disable access for maintenance updates.</p>
          </div>
          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 cursor-pointer">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
          </div>
        </section>

        {/* Footer Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200">
          <button className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Discard Changes
          </button>
          <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm">
            Save All Settings
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}