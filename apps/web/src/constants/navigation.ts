// apps/web/src/constants/navigation.ts
import { 
  LayoutDashboard, Baby, FileText, Users, Map, 
  Settings, History, UserPlus, List, LucideIcon, 
  Calendar,
  UserRoundSearch
} from 'lucide-react';

export interface NavItem {
  name: string;
  path?: string;
  icon: LucideIcon;
  subItems?: { name: string; path: string; icon: LucideIcon }[];
}

export const ROLE_IDS = { 
  SUPERADMIN: 1, 
  ADMIN: 2,
  PENGURUS_LOKAL: 3
} as const;

export const ADMIN_MENU: NavItem[] = [
  { name: 'Pengurus Lokal Management', path: '/dashboard/admin/users', icon: UserRoundSearch },
  { 
    name: 'Data Control', 
    icon: List,
    subItems: [
      { name: 'Regions', path: '/dashboard/admin/data/regions', icon: Map },
      { name: 'Tahun Ajaran', path: '/dashboard/admin/data/academic-years', icon: Calendar },
      { name: 'Template Card', path: '/dashboard/admin/data/template-cards', icon: FileText },
      { name: 'Anak Asuh', path: '/dashboard/admin/data/children', icon: Baby },
    ]
  },
  { name: 'Rapor Anak', path: '/dashboard/admin/reports', icon: FileText },
];

export const SUPERADMIN_MENU: NavItem[] = [ 
  { name: 'Admin Management', path: '/dashboard/superadmin/users', icon: UserPlus },
  { name: 'System Config', path: '/dashboard/superadmin/config', icon: Settings },
  { name: 'Audit Logs', path: '/dashboard/superadmin/logs', icon: History },
];