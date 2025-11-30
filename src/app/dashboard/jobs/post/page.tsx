
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserSearch, Upload, Users, CalendarIcon, Briefcase, MapPin, DollarSign, CheckCircle, Star, Banknote, FilePen } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Job } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { VerificationGate } from '@/components/verification-gate';
import { sampleJobs as defaultSampleJobs } from '@/lib/data';

export default function PostJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [postedJobs, setPostedJobs] = React.useState<Job[]>([]);
  const [jobTitle, setJobTitle] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [jobType, setJobType] = React.useState<'Full-time' | 'Part-time' | 'Contract' | 'Internship' | ''>('');
  const [salary, setSalary] = React.useState('');
  const [industry, setIndustry] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [skills, setSkills] = React.useState('');
  
  const [fromDate, setFromDate] = React.useState<Date>();
  const [toDate, setToDate] = React.useState<Date>();
  const [fromTime, setFromTime] = React.useState<string>('');
  const [toTime, setToTime] = React.useState<string>('');
  
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [reviewJob, setReviewJob] = React.useState<Job | null>(null);
  const [rating, setRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState('');


  React.useEffect(() => {
    try {
      const storedJobs = localStorage.getItem('postedJobs');
      if (storedJobs) {
        const parsedJobs = JSON.parse(storedJobs);
        if (parsedJobs.length === 0) {
            setPostedJobs(defaultSampleJobs);
            updateLocalStorage(defaultSampleJobs);
        } else {
            setPostedJobs(parsedJobs);
        }
      } else {
        setPostedJobs(defaultSampleJobs);
        updateLocalStorage(defaultSampleJobs);
      }
    } catch (error) {
      console.error("Failed to load jobs from local storage, using samples.", error);
      setPostedJobs(defaultSampleJobs);
    }
  }, []);

  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    const formattedHours = hours.toString().padStart(2, '0');
    return `${formattedHours}:${minutes}`;
  });

  const updateLocalStorage = (updatedJobs: Job[]) => {
    try {
      localStorage.setItem('postedJobs', JSON.stringify(updatedJobs));
    } catch (error) {
      console.error("Failed to save jobs to local storage", error);
      toast({
        title: 'Storage Error',
        description: 'Could not save job to your browser storage.',
        variant: 'destructive'
      })
    }
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobType || !location || !description || !skills) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all required fields to post a job.',
        variant: 'destructive',
      });
      return;
    }

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: jobTitle,
      companyName: companyName || 'Private Employer',
      companyLogoUrl: 'https://picsum.photos/seed/newlogo/100/100',
      location: location,
      jobType: jobType as Job['jobType'],
      salary: salary,
      description: description,
      skillsRequired: skills.split(',').map(s => s.trim()),
      industry: industry || 'General',
      status: 'Yet To Assign'
    };

    const updatedJobs = [newJob, ...postedJobs];
    setPostedJobs(updatedJobs);
    updateLocalStorage(updatedJobs);

    // Reset form fields
    setJobTitle(''); setCompanyName(''); setLocation(''); setJobType('');
    setSalary(''); setIndustry(''); setDescription(''); setSkills('');
    setFromDate(undefined); setToDate(undefined); setFromTime(''); setToTime('');

    toast({
        title: 'Job Posted!',
        description: `${newJob.title} has been successfully posted.`,
    });
  };

  const handleMakePayment = (jobId: string) => {
    router.push(`/dashboard/vasa-wallet?jobId=${jobId}`);
  };

  const handleOpenReviewModal = (job: Job) => {
    setReviewJob(job);
    setIsReviewModalOpen(true);
  };
  
  const handleReviewSubmit = () => {
    if (!reviewJob) return;

    if (rating === 0) {
        toast({ title: 'Rating Required', description: 'Please provide a star rating.', variant: 'destructive' });
        return;
    }
    
    // In a real app, you would save this review to your backend.
    console.log({
        jobId: reviewJob.id,
        rating,
        feedback,
    });
    
    const updatedJobs = postedJobs.map(j => 
        j.id === reviewJob.id ? { ...j, status: 'Completed' as const } : j
    );
    setPostedJobs(updatedJobs);
    updateLocalStorage(updatedJobs);

    toast({
      title: 'Job Completed!',
      description: `Thank you for your feedback on "${reviewJob.title}".`,
    });
    
    setIsReviewModalOpen(false);
    setRating(0);
    setFeedback('');
    setReviewJob(null);
  };

  const renderStars = (currentRating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'h-8 w-8',
              star <= currentRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300',
              interactive && 'cursor-pointer transition-transform hover:scale-110'
            )}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    );
  };
  
  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
  };

  const getToTimeOptions = () => {
    if (!fromTime) return timeOptions;
    const fromIndex = timeOptions.indexOf(fromTime);
    return timeOptions.slice(fromIndex + 1);
  };

  const toTimeOptions = getToTimeOptions();

  return (
    <VerificationGate>
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <FilePen className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Job Post & Status</h1>
            </div>
            <Card>
                <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                    Fill out the form below to post a new job opportunity.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handlePostJob} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="job-title">Job Title</Label>
                        <Input id="job-title" placeholder="e.g., Senior Frontend Developer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name (Optional)</Label>
                        <Input id="company-name" placeholder="e.g., Innovate Inc." value={companyName} onChange={e => setCompanyName(e.target.value)} />
                    </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo">Company Logo (Optional)</Label>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" asChild>
                            <label htmlFor="logo-upload" className="cursor-pointer">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Logo
                            </label>
                            </Button>
                            <Input id="logo-upload" type="file" className="hidden" />
                            <span className="text-sm text-muted-foreground">PNG, JPG up to 5MB</span>
                        </div>
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

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" placeholder="e.g., New York, NY or Remote" value={location} onChange={e => setLocation(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job-type">Job Type</Label>
                            <Select value={jobType} onValueChange={(value) => setJobType(value as any)} required>
                                <SelectTrigger id="job-type">
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary">Salary Range (Optional)</Label>
                            <Input id="salary" placeholder="e.g., $120,000 - $150,000" value={salary} onChange={e => setSalary(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Input id="industry" placeholder="e.g., Technology" value={industry} onChange={e => setIndustry(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="num-workers">Number of Workers Needed</Label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="num-workers" type="number" placeholder="e.g., 5" className="pl-10" />
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Provide a detailed description of the job role, responsibilities, and qualifications."
                        className="min-h-[150px]"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                    </div>
                    
                    <div className="space-y-2">
                    <Label htmlFor="skills">Skills Required</Label>
                    <Input id="skills" placeholder="e.g., React, TypeScript, Figma (comma-separated)" value={skills} onChange={e => setSkills(e.target.value)} required />
                    </div>

                    <div className="flex justify-end">
                    <Button type="submit" size="lg" className="bg-gradient-to-r from-[#E0BBE4] to-[#957DAD] hover:opacity-90 text-primary-foreground">
                        Post Job
                    </Button>
                    </div>
                </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Jobs Posted</CardTitle>
                <CardDescription>
                    A list of your recently posted jobs. Pay workers and complete jobs here.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                {postedJobs.filter(job => job.status !== 'Completed').length > 0 ? (
                    postedJobs.filter(job => job.status !== 'Completed').map((job) => (
                    <div key={job.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                        <div className="bg-muted p-3 rounded-full">
                            <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">{job.companyName} &middot; {job.location}</p>
                             <Badge variant={
                                job.status === 'Paid' ? 'default' :
                                job.status === 'Worker Assigned' ? 'secondary' : 'outline'
                            } className="mt-1">
                                {job.status}
                            </Badge>
                        </div>
                        </div>
                        <div className="flex items-center flex-wrap gap-2">
                            <Button variant="secondary" size="sm" onClick={() => handleViewDetails(job)}>View Details</Button>
                            {job.status === 'Worker Assigned' && (
                                <Button size="sm" onClick={() => handleMakePayment(job.id)}>
                                    <Banknote className="mr-2 h-4 w-4" />
                                    Make Payment
                                </Button>
                            )}
                            {job.status === 'Paid' && (
                                 <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleOpenReviewModal(job)}>
                                    <FilePen className="mr-2 h-4 w-4" />
                                    Rate & Complete
                                </Button>
                            )}
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <p>No active jobs. Post one using the form above!</p>
                    </div>
                )}
                </CardContent>
            </Card>

             <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rate & Complete Job</DialogTitle>
                        <DialogDescription>
                           Provide feedback for the work done on "{reviewJob?.title}".
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-6">
                        <div className="space-y-2">
                             <Label>Overall Rating</Label>
                             <div className="flex justify-center p-2">
                                {renderStars(rating, true)}
                             </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="feedback-textarea">Feedback (Optional)</Label>
                            <Textarea
                                id="feedback-textarea"
                                placeholder="Share your experience with the worker(s)..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleReviewSubmit}>Submit Review & Complete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {selectedJob && (
                <Dialog open={!!selectedJob} onOpenChange={(isOpen) => !isOpen && setSelectedJob(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                    <DialogTitle className="text-2xl">{selectedJob.title}</DialogTitle>
                    <DialogDescription>
                        {selectedJob.companyName}
                    </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-2">
                            <div className="flex items-center gap-1.5">
                                <Briefcase className="h-4 w-4" />
                                <span>{selectedJob.jobType}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                <span>{selectedJob.location}</span>
                            </div>
                            {selectedJob.salary && (
                                <div className="flex items-center gap-1.5">
                                <DollarSign className="h-4 w-4" />
                                <span>{selectedJob.salary}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Job Description</h4>
                            <p className="text-sm text-muted-foreground">{selectedJob.description}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Skills Required</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedJob.skillsRequired.map((skill) => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Industry</h4>
                            <p className="text-sm text-muted-foreground">{selectedJob.industry}</p>
                        </div>
                    </div>
                    <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
                </Dialog>
            )}
        </div>
    </VerificationGate>
  );
}
