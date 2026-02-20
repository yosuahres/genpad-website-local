
import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string) => {
  
  const worksheetData = data.map((item) => ({
    'Full Name': item.name,
    'Email Address': item.email,
    'Status': 'Active', 
    'Joined Date': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  
  
  const maxWidths = [
    { wch: 25 }, 
    { wch: 35 }, 
    { wch: 15 }, 
    { wch: 20 }, 
  ];
  worksheet['!cols'] = maxWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Admins');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};