
'use client';

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Users, Briefcase } from 'lucide-react';
import { workerMonetizationData, recruiterMonetizationData } from '@/lib/data';

type TimeFrame = 'weekly' | 'monthly' | 'last_10_days';

const chartConfig = {
  amount: {
    label: 'Amount (₹)',
    color: 'hsl(var(--primary))',
  },
  commission: {
    label: 'Commission (₹)',
    color: 'hsl(var(--accent))',
  },
};

export default function MonetizationPage() {
  const [workerTimeFrame, setWorkerTimeFrame] = useState<TimeFrame>('monthly');
  const [recruiterTimeFrame, setRecruiterTimeFrame] = useState<TimeFrame>('monthly');

  const workerData = workerMonetizationData[workerTimeFrame];
  const recruiterData = recruiterMonetizationData[recruiterTimeFrame];

  const totalWorkerBenefit = workerData.reduce((acc, item) => acc + item.amount, 0);
  const totalJobsCompleted = workerData.reduce((acc, item) => acc + item.jobs, 0);

  const totalRecruiterPaid = recruiterData.reduce((acc, item) => acc + item.amount, 0);
  const totalWorkersRecruited = recruiterData.reduce((acc, item) => acc + item.workers, 0);
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <DollarSign className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Monetization</h1>
      </div>
      <p className="text-muted-foreground max-w-2xl">
        Track your earnings, payments, and contributions on the VaSa platform.
      </p>

      <Tabs defaultValue="worker" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="worker">
            <Briefcase className="mr-2 h-4 w-4" />
            As a Worker
          </TabsTrigger>
          <TabsTrigger value="recruiter">
            <Users className="mr-2 h-4 w-4" />
            As a Recruiter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="worker" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Total Amount Benefited</CardTitle>
                <CardDescription>
                  The total amount you have earned from completed jobs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  ₹{totalWorkerBenefit.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Jobs Completed</CardTitle>
                <CardDescription>
                  The total number of jobs you have successfully completed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalJobsCompleted}</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Your Earnings</CardTitle>
                <CardDescription>
                  A summary of your earnings over time.
                </CardDescription>
              </div>
              <Select
                value={workerTimeFrame}
                onValueChange={(value) => setWorkerTimeFrame(value as TimeFrame)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_10_days">Last 10 Days</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart accessibilityLayer data={workerData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                   <YAxis tickFormatter={(value) => `₹${value}`} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruiter" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
             <Card>
              <CardHeader>
                <CardTitle>Total Amount Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  ₹{totalRecruiterPaid.toLocaleString()}
                </p>
                 <p className="text-xs text-muted-foreground">Paid to workers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Workers Recruited</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalWorkersRecruited}</p>
                 <p className="text-xs text-muted-foreground">Total assignments filled</p>
              </CardContent>
            </Card>
          </div>
           <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Your Payments</CardTitle>
                <CardDescription>
                  A summary of payments to workers over time.
                </CardDescription>
              </div>
              <Select
                value={recruiterTimeFrame}
                onValueChange={(value) => setRecruiterTimeFrame(value as TimeFrame)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_10_days">Last 10 Days</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart accessibilityLayer data={recruiterData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                   <YAxis tickFormatter={(value) => `₹${value}`} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
