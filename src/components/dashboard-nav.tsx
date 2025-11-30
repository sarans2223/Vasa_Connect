'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Repeat,
  BookOpen,
  Wallet,
  Award,
  DollarSign,
  Shield,
  UserCircle,
  Search,
  PlusCircle,
} from 'lucide-react';

const sidebarNavItems = [
    { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
    { title: 'Job Search', href: '/dashboard/jobs', icon: <Search /> },
    { title: 'Job Post & Status', href: '/dashboard/jobs/status', icon: <Briefcase /> },
    { title: 'Hire Talent', href: '/dashboard/teams/hire', icon: <PlusCircle /> },
    { title: 'VaSa Rebook', href: '/dashboard/rebook', icon: <Repeat /> },
    { title: 'Learning Hub', href: '/dashboard/learning', icon: <BookOpen /> },
    { title: 'My Team', href: '/dashboard/teams', icon: <Users /> },
    { title: 'Vasa Wallet', href: '/dashboard/vasa-wallet', icon: <Wallet /> },
    { title: 'Membership', href: '/dashboard/membership', icon: <Award /> },
    { title: 'Monetization', href: '/dashboard/monetization', icon: <DollarSign /> },
    { title: 'Safety Settings', href: '/dashboard/settings/safety', icon: <Shield /> },
    { title: 'User', href: '/dashboard/profile', icon: <UserCircle /> },
];

export function DashboardNav() {
  const pathname = usePathname();
  
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {sidebarNavItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary text-base',
            pathname === item.href && 'text-primary bg-muted'
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
