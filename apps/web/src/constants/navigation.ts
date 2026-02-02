import { 
  LayoutDashboard, 
  Baby, 
  FileText, 
  Contact2, 
  Users, 
  GraduationCap, 
  Map, 
  Settings, 
  ShieldCheck, 
  History, 
  Download,
  CalendarDays,
  UserPlus,
  LucideIcon
} from 'lucide-react';

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  color?: string;
}

export const ROLE_IDS = {
  SUPERADMIN: 1,
  ADMIN: 2,
} as const;

// Admin: Operational Control
export const ADMIN_MENU: NavItem[] = [
  { name: 'Dashboard Regions', path: '/dashboard/admin', icon: LayoutDashboard },
  { name: 'Child Management', path: '/dashboard/data/anak-asuh', icon: Baby },
  { name: 'Document Review', path: '/dashboard/reports', icon: FileText },
  { name: 'Card Generation', path: '/dashboard/admin/cards', icon: Contact2 },
  { name: 'Pengurus Lokal', path: '/dashboard/admin/staff', icon: Users },
  { name: 'Academic Reports', path: '/dashboard/admin/academic', icon: GraduationCap },
  { name: 'Region Management', path: '/dashboard/data/regions', icon: Map },
];

// Superadmin: Governance & Oversight
export const SUPERADMIN_MENU: NavItem[] = [
  { name: 'Admin Management', path: '/dashboard/users', icon: UserPlus },
  { name: 'Region Management', path: '/dashboard/data/regions', icon: Map },
  { name: 'Academic Year Setup', path: '/dashboard/superadmin/years', icon: CalendarDays },
  { name: 'System Config', path: '/dashboard/superadmin/config', icon: Settings },
  { name: 'Global Audit Logs', path: '/dashboard/superadmin/logs', icon: History },
  { name: 'Global Export', path: '/dashboard/superadmin/export', icon: Download },
];