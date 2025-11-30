
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserPlus, Users, Briefcase, BarChart, TrendingUp, BriefcaseBusiness, UsersRound } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const panchayatId = 'GP-STYM-001';

const dashboardItems = [
  {
    title: 'Add Profiles',
    description: 'Register new job seekers in your panchayat.',
    href: '/dashboard/panchayat/add-profile',
    icon: UserPlus,
    count: null,
    countLabel: 'Add a new person to the registry',
  },
  {
    title: 'Profiles Already Added',
    description: 'View and manage all registered profiles.',
    href: '/dashboard/panchayat/profiles',
    icon: Users,
    count: 120,
    countLabel: 'Total Profiles',
  },
  {
    title: 'Job Post & Match',
    description: 'Create new job opportunities and match them to profiles.',
    href: '/dashboard/panchayat/post-job',
    icon: Briefcase,
    count: null,
    countLabel: 'Create a new job and find candidates',
  },
  {
    title: 'Job Current Status',
    description: 'Track the status of all posted jobs.',
    href: '/dashboard/panchayat/job-status',
    icon: BarChart,
    count: 45,
    countLabel: 'Jobs Assigned',
  },
];

export default function PanchayatDashboard() {
  const [panchayatName, setPanchayatName] = useState('Sathyamangalam Panchayat');

  useEffect(() => {
    const storedPanchayatName = localStorage.getItem('panchayatName');
    if (storedPanchayatName) {
      setPanchayatName(storedPanchayatName);
    }
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            {panchayatName}
          </h1>
          <p className="text-muted-foreground">Panchayat ID: {panchayatId}</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workers Assigned</CardTitle>
                <UsersRound className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">132</div>
                <p className="text-xs text-muted-foreground">in active jobs</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs Assigned</CardTitle>
                <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Panchayat Working Percentage</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <Progress value={78} className="h-2 mt-2" />
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {dashboardItems.map((item) => (
          <Card
            key={item.href}
            className="flex flex-col transition-all hover:shadow-lg"
          >
            <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
              <item.icon className="h-8 w-8 text-accent" />
              <div className='flex-1'>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="pt-1">{item.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
                <div className="mt-4">
                     {item.count !== null ? (
                        <>
                            <div className="text-3xl font-bold">{item.count}</div>
                            <p className="text-xs text-muted-foreground">{item.countLabel}</p>
                        </>
                     ) : (
                        <p className="text-sm text-muted-foreground">{item.countLabel}</p>
                     )}
                </div>
              <Button asChild className="w-full mt-4 bg-gradient-to-r from-[#E0BBE4] to-[#957DAD] hover:opacity-90 text-primary-foreground">
                <Link href={item.href}>
                  Go to {item.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
