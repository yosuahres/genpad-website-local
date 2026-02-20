'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment !== '');

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
      <Link href="/" className="hover:text-slate-800 transition-colors">
        <Home size={16} />
      </Link>
      
      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

        return (
          <React.Fragment key={href}>
            <ChevronRight size={14} className="text-slate-400" />
            {isLast ? (
              <span className="font-semibold text-slate-800">{label}</span>
            ) : (
              <Link href={href} className="hover:text-slate-800 transition-colors">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}