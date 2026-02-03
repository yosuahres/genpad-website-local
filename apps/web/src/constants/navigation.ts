// apps/web/src/constants/navigation.ts
import { 
  LayoutDashboard, Baby, FileText, Users, Map, 
  Settings, History, UserPlus, List, LucideIcon 
} from 'lucide-react';

export interface NavItem {
  name: string;
  path?: string;
  icon: LucideIcon;
  subItems?: { name: string; path: string; icon: LucideIcon }[];
}

export const ROLE_IDS = { SUPERADMIN: 1, ADMIN: 2 } as const;

export const ADMIN_MENU: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard/admin', icon: LayoutDashboard },
  { 
    name: 'Master Data', 
    icon: List,
    subItems: [
      { name: 'Anak Asuh', path: '/dashboard/data/anak-asuh', icon: Baby },
      { name: 'Regions', path: '/dashboard/data/regions', icon: Map },
    ]
  },
  { name: 'Rapor Anak', path: '/dashboard/reports', icon: FileText },
];

export const SUPERADMIN_MENU: NavItem[] = [
  { name: 'Admin Management', path: '/dashboard/superadmin/users', icon: UserPlus },
  { name: 'System Config', path: '/dashboard/superadmin/config', icon: Settings },
  { name: 'Audit Logs', path: '/dashboard/superadmin/logs', icon: History },
];