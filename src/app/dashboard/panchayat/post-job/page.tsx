
'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Briefcase, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PostJobAndMatchPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [jobName, setJobName] = React.useState('');
  const [workersNeeded, setWorkersNeeded] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [payScale, setPayScale] = React.useState('');
  const [fromDate, setFromDate] = React.useState<Date>();
  const [toDate, setToDate] = React.useState<Date>();
  const [fromTime, setFromTime] = React.useState<string>('');
  const [toTime, setToTime] = React.useState<string>('');

  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    const formattedHours = hours.toString().padStart(2, '0');
    return `${formattedHours}:${minutes}`;
  });

  const getToTimeOptions = () => {
    if (!fromTime) return timeOptions;
    const fromIndex = timeOptions.indexOf(fromTime);
    return timeOptions.slice(fromIndex + 1);
  };

  const toTimeOptions = getToTimeOptions();

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobName || !workersNeeded || !location || !payScale) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newJob = {
      id: `job-${Date.now()}`,
      name: jobName,
      workerNames: [],
      status: 'Yet To Assign',
    };

    try {
      const existingJobs = JSON.parse(localStorage.getItem('panchayatJobs') || '[]');
      localStorage.setItem('panchayatJobs', JSON.stringify([newJob, ...existingJobs]));
      
      toast({
        title: 'Job Posted!',
        description: `"${jobName}" has been posted and is ready for worker assignment.`,
      });

      router.push('/dashboard/panchayat/job-status');
    } catch (error) {
       toast({
        title: 'Error Posting Job',
        description: 'There was an issue posting the job. Please try again.',
        variant: 'destructive',
      });
    }
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Briefcase className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">
          Post a Job
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Job Details</CardTitle>
          <CardDescription>
            Post a job to find suitable candidates from your panchayat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePostJob} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="job-name">Job Name</Label>
              <Input id="job-name" placeholder="e.g., Farm Harvesting" value={jobName} onChange={(e) => setJobName(e.target.value)} required />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="from-date">From Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !fromDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fromDate ? format(fromDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={fromDate}
                          onSelect={setFromDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="from-time">From Time</Label>
                    <Select value={fromTime} onValueChange={setFromTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
              </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="to-date">To Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !toDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {toDate ? format(toDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={toDate}
                          onSelect={setToDate}
                          disabled={fromDate ? { before: fromDate } : undefined}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to-time">To Time</Label>
                     <Select value={toTime} onValueChange={setToTime} disabled={!fromTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {toTimeOptions.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="workers-needed">No. of Workers Needed</Label>
                <Input id="workers-needed" type="number" placeholder="e.g., 10" value={workersNeeded} onChange={(e) => setWorkersNeeded(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., Village Center" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pay-scale">Pay Scale</Label>
                <Input id="pay-scale" placeholder="e.g., ₹400 per day" value={payScale} onChange={(e) => setPayScale(e.target.value)} required />
              </div>
            </div>

            <div className="flex justify-end items-center">
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-[#E0BBE4] to-[#957DAD] hover:opacity-90 text-primary-foreground"
              >
                Post Job
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
