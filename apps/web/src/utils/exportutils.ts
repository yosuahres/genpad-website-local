// utils/exportUtils.ts
import * as XLSX from 'xlsx';

/**
 * Transforms JSON data and triggers an Excel file download.
 * Best Practice: Explicitly define headers to avoid leaking internal DB fields.
 */
export const exportToExcel = (data: any[], fileName: string) => {
  // Map raw data to user-friendly column headers
  const worksheetData = data.map((item) => ({
    'Full Name': item.name,
    'Email Address': item.email,
    'Status': 'Active', // Example of adding custom logic/strings
    'Joined Date': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  
  // Column Widths (Optional: makes the Excel look professional immediately)
  const maxWidths = [
    { wch: 25 }, // Name
    { wch: 35 }, // Email
    { wch: 15 }, // Status
    { wch: 20 }, // Date
  ];
  worksheet['!cols'] = maxWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Admins');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};