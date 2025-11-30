
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Briefcase,
  LayoutDashboard,
  LogOut,
  UserPlus,
  Users,
  BookOpen,
  UserCircle,
  Gem,
  Shield,
  UserSearch,
  Menu,
  Bell,
  Wallet,
  DollarSign,
  FilePen,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { signOut } from "@/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase/auth/use-user";


const panchayatMenuItems = [
  { href: "/dashboard/panchayat", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/panchayat/add-profile", label: "Add Profiles", icon: UserPlus },
  { href: "/dashboard/panchayat/profiles", label: "Profiles Already Added", icon: Users },
  { href: "/dashboard/panchayat/post-job", label: "Job Post & Match", icon: Briefcase },
  { href: "/dashboard/panchayat/job-status", label: "Job Current Status", icon: BarChart },
  { href: "/dashboard/panchayat/assign-worker", label: "Assign Worker", icon: UserPlus },
];

const regularMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/jobs", label: "Job Search", icon: Briefcase },
    { href: "/dashboard/jobs/post", label: "Job Post & Status", icon: FilePen },
    { href: "/dashboard/assign-worker", label: "Hire Talent", icon: UserPlus },
    { href: "/dashboard/rebook", label: "VaSa Rebook", icon: Repeat },
    { href: "/dashboard/learning", label: "Learning Hub", icon: BookOpen },
    { href: "/dashboard/teams", label: "My Team", icon: Users },
    { href: "/dashboard/vasa-wallet", label: "Vasa Wallet", icon: Wallet },
    { href: "/dashboard/membership", label: "Membership", icon: Gem },
    { href: "/dashboard/monetization", label: "Monetization", icon: DollarSign },
    { href: "/dashboard/safety", label: "Safety Settings", icon: Shield },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [userName, setUserName] = useState('');
  const [panchayatName, setPanchayatName] = useState('SARAN');


  const isPanchayatPath = pathname.startsWith('/dashboard/panchayat');
  const menuItems = isPanchayatPath ? panchayatMenuItems : regularMenuItems;

  useEffect(() => {
    if (user) {
      setUserName(user.displayName || 'User');
    } else {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
      }
    }
    const storedPanchayatName = localStorage.getItem('panchayatName');
    if (storedPanchayatName) {
        setPanchayatName(storedPanchayatName);
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      router.push('/login');
    } catch (error) {
      console.error("Sign Out Error:", error);
      toast({
        title: "Sign Out Failed",
        description: "Could not sign out. Please try again.",
        variant: "destructive",
      });
    }
  };


  const UserNameDisplay = React.memo(function UserNameDisplay({ inSheet }: { inSheet?: boolean }) {
    if (isPanchayatPath) {
      return (
        <Button asChild variant={'ghost'} size="sm">
            <Link href="/dashboard/panchayat" className="font-semibold text-sm flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                {panchayatName}
            </Link>
        </Button>
      );
    }

    const isProfilePage = pathname === '/dashboard/profile';
    const displayName = (userName || 'User').split(' ')[0];

    if (inSheet) {
      return (
         <SheetClose asChild>
            <Link
              href="/dashboard/profile"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              )}
            >
              <UserCircle className="h-4 w-4" />
              {displayName}
            </Link>
          </SheetClose>
      )
    }

    return (
      <Button asChild variant={'ghost'} size="sm">
        <Link href="/dashboard/profile" className={cn(
          "flex items-center gap-2"
        )}>
            <UserCircle className="h-5 w-5" />
            {displayName}
        </Link>
      </Button>
    );
  });
  UserNameDisplay.displayName = 'UserNameDisplay';


  const NavLink = React.memo(function NavLink({ item, inSheet }: { item: typeof menuItems[0], inSheet?: boolean}) {
    const isActive = pathname === item.href;
    const Component = inSheet ? SheetClose : 'div';
    const props = inSheet ? { asChild: true } : {};
    return (
       <Component {...props}>
          <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive ? "bg-primary/10 text-primary font-semibold" : ""
            )}
          >
          <item.icon className="h-4 w-4" />
          {item.label}
          </Link>
      </Component>
    );
  });
  NavLink.displayName = 'NavLink';


  return (
    <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 z-30">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
             <div className="p-4 border-b">
                <Link href={isPanchayatPath ? "/dashboard/panchayat" : "/dashboard"} className="flex items-center gap-2 font-bold">
                  <span className="font-bold">VaSa</span>
                </Link>
             </div>
            <nav className="flex-1 grid gap-2 p-2 text-sm font-medium lg:p-4">
              {menuItems.map((item) => <NavLink key={item.href} item={item} inSheet />)}
            </nav>
              <div className="mt-auto p-4 border-t">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex flex-col truncate">
                        <UserNameDisplay inSheet />
                    </div>
                    </div>
                    <Button onClick={handleSignOut} variant="ghost" size="icon">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
           </div>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="w-full flex-1">
                <Link href={isPanchayatPath ? "/dashboard/panchayat" : "/dashboard"} className="flex items-center gap-2 font-bold">
                  <span className="font-bold">VaSa</span>
                </Link>
            </div>
            <div className="ml-auto flex items-center gap-2 overflow-hidden">
                <Button asChild variant="ghost" size="icon">
                  <Link href="/dashboard/notifications">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </Link>
                </Button>
                <div className="flex items-center gap-2">
                    <UserNameDisplay />
                </div>
                 <Button onClick={handleSignOut} variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </header>
  );
}
