
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Search, UserPlus, Star, CheckSquare, Square, MapPin, Briefcase, DollarSign, CalendarIcon } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import type { Job } from '@/lib/types';
import { sampleJobs } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { VerificationGate } from '@/components/verification-gate';


const allProfiles = [
  { id: '1', name: 'Lakshmi Priya', skills: ['Cooking', 'Tailoring'], rating: 4.5, jobsCompleted: 2, job: 'Catering Project', location: 'Chennai' },
  { id: '2', name: 'Kavita Devi', skills: ['Farming'], rating: 4.2, jobsCompleted: 2, job: 'Harvesting', location: 'Coimbatore' },
  { id: '3', name: 'Meena Kumari', skills: ['Herding', 'Farming'], rating: 4.8, jobsCompleted: 3, job: 'Livestock Management', location: 'Madurai' },
  { id: '4', name: 'Anjali Sharma', skills: ['Cleaning'], rating: 3.9, jobsCompleted: 1, job: 'Office Cleaning', location: 'Tiruchirappalli' },
  { id: '5', name: 'Sita Rai', skills: ['Child Care', 'Cooking'], rating: 4.0, jobsCompleted: 0, job: 'Nanny Position', location: 'Salem' },
  { id: '6', name: 'Rina Das', skills: ['Handicrafts', 'Painting'], rating: 4.9, jobsCompleted: 5, job: 'Artisan Fair', location: 'Erode' },
  { id: '7', name: 'Sunita Devi', skills: ['Tailoring', 'Embroidery'], rating: 4.1, jobsCompleted: 0, job: 'Boutique Assistant', location: 'Tirunelveli' },
  { id: '8', name: 'Pooja Singh', skills: ['Driving'], rating: 4.3, jobsCompleted: 0, job: 'Delivery Driver', location: 'Vellore' },
  { id: '9', name: 'Asha Patil', skills: ['Data Entry', 'MS Office'], rating: 4.6, jobsCompleted: 4, job: 'Office Assistant', location: 'Bangalore' },
  { id: '10', name: 'Divya Gowda', skills: ['Farming', 'Gardening'], rating: 4.4, jobsCompleted: 3, job: 'Urban Gardener', location: 'Mysuru' },
  { id: '11', name: 'Priya Chavan', skills: ['Cooking', 'Baking'], rating: 4.7, jobsCompleted: 6, job: 'Home Baker', location: 'Mumbai' },
  { id: '12', name: 'Neha Reddy', skills: ['Graphic Design'], rating: 4.5, jobsCompleted: 2, job: 'Freelance Designer', location: 'Bangalore' },
];

type WorkerProfile = typeof allProfiles[0];

const initialNewJobState = {
  title: '',
  companyName: '',
  location: '',
  jobType: '' as Job['jobType'] | '',
  salary: '',
  industry: '',
  description: '',
  skillsRequired: '',
};

export default function AssignWorkerPage() {
  const [allWorkers] = useState<WorkerProfile[]>(allProfiles);
  const [availableWorkers, setAvailableWorkers] = useState<WorkerProfile[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedExistingJob, setSelectedExistingJob] = useState<string>('');
  const [newJobDetails, setNewJobDetails] = useState(initialNewJobState);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [fromTime, setFromTime] = useState<string>('');
  const [toTime, setToTime] = useState<string>('');
  
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setAvailableWorkers(allWorkers);
    try {
        const storedJobs = localStorage.getItem('postedJobs');
        const parsedJobs = storedJobs ? JSON.parse(storedJobs) : [];
        const combinedJobs = [...sampleJobs, ...parsedJobs].filter(
            (job, index, self) => index === self.findIndex((j) => j.id === job.id || j.title === job.title)
        );
        setJobs(combinedJobs);
    } catch (error) {
        console.error("Failed to load jobs from local storage, using sample jobs.", error);
        setJobs(sampleJobs);
    }
  }, [allWorkers]);
  
  const handleSearch = () => {
    let filtered = allWorkers;

    if (searchQuery) {
        filtered = filtered.filter(worker => 
            worker.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (selectedSkill !== 'all') {
        filtered = filtered.filter(worker => 
            worker.skills.some(skill => skill.toLowerCase() === selectedSkill.toLowerCase())
        );
    }
     if (selectedLocation !== 'all') {
        filtered = filtered.filter(worker => 
            worker.location.toLowerCase() === selectedLocation.toLowerCase()
        );
    }

    setAvailableWorkers(filtered);
};


  const handleSelectWorker = (workerId: string) => {
    setSelectedWorkers(prev => 
      prev.includes(workerId) 
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  const handleOpenAssignmentModal = () => {
    if (selectedWorkers.length === 0) {
      toast({
        title: 'No Workers Selected',
        description: 'Please select at least one worker to assign.',
        variant: 'destructive',
      });
      return;
    }
    setIsAssignmentModalOpen(true);
  };

  const updateLocalStorageJobs = (updatedJobs: Job[]) => {
    try {
      localStorage.setItem('postedJobs', JSON.stringify(updatedJobs));
    } catch (error) {
      console.error("Failed to save jobs to local storage", error);
      toast({
        title: 'Storage Error',
        description: 'Could not save job to your browser storage.',
        variant: 'destructive'
      });
    }
  };
  
  const handleAssignToExisting = () => {
      if (!selectedExistingJob) {
          toast({ title: 'Error', description: 'Please select a job.', variant: 'destructive' });
          return;
      }
      // Logic to assign worker
      toast({
          title: 'Assignment Confirmed!',
          description: `${selectedWorkers.length} worker(s) assigned to "${jobs.find(j => j.id === selectedExistingJob)?.title}".`,
      });
      resetAndClose();
  };

  const handlePostAndAssign = () => {
      const { title, jobType, location, description, skillsRequired } = newJobDetails;
      if (!title || !jobType || !location || !description || !skillsRequired) {
          toast({ title: 'Missing Information', description: 'Please fill out all required fields for the new job.', variant: 'destructive' });
          return;
      }
      
      const newJob: Job = {
        id: `job-${Date.now()}`,
        title: title,
        companyName: newJobDetails.companyName || 'Private Employer',
        companyLogoUrl: 'https://picsum.photos/seed/newlogo/100/100',
        location: location,
        jobType: jobType as Job['jobType'],
        salary: newJobDetails.salary,
        description: description,
        skillsRequired: skillsRequired.split(',').map(s => s.trim()),
        industry: newJobDetails.industry || 'General',
        status: 'Worker Assigned',
        date: fromDate ? format(fromDate, 'PPP') : 'Not Specified',
      };

      const updatedJobs = [newJob, ...jobs];
      setJobs(updatedJobs);
      updateLocalStorageJobs(updatedJobs);

      toast({
          title: 'Job Posted & Assigned!',
          description: `${selectedWorkers.length} worker(s) have been assigned to the new job: "${newJob.title}".`,
      });
      resetAndClose();
  };

  const resetAndClose = () => {
      setIsAssignmentModalOpen(false);
      setSelectedWorkers([]);
      setSelectedExistingJob('');
      setNewJobDetails(initialNewJobState);
      setFromDate(undefined);
      setToDate(undefined);
      setFromTime('');
      setToTime('');
  };

  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} className={`h-4 w-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      );
    }
    return stars;
  };

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

  const WorkerCard = ({ profile, isSelected, onSelect }: { profile: WorkerProfile, isSelected: boolean, onSelect: (id: string) => void }) => (
      <Card 
        key={profile.id}
        className={`cursor-pointer transition-all ${isSelected ? 'border-primary ring-2 ring-primary' : 'hover:shadow-md'}`}
        onClick={() => onSelect(profile.id)}
      >
          <CardHeader>
              <div className="flex justify-between items-start">
                  <CardTitle>{profile.name}</CardTitle>
                  {isSelected ? <CheckSquare className="h-6 w-6 text-primary" /> : <Square className="h-6 w-6 text-muted-foreground" />}
              </div>
          </CardHeader>
          <CardContent className="space-y-4">
              <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                      {profile.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                  </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                </div>
              <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-muted-foreground">Rating:</span>
                  <div className="flex items-center gap-1">
                    {renderStars(profile.rating)}
                    <span className="font-semibold">{profile.rating.toFixed(1)}</span>
                  </div>
              </div>
          </CardContent>
      </Card>
  );

  const assignableJobs = jobs.filter(job => !job.status || job.status === 'Yet To Assign');

  return (
    <VerificationGate>
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
                <div className="flex items-center gap-4">
                    <UserPlus className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">Hire Talent</h1>
                </div>
                <p className="text-muted-foreground mt-2">search and select the profiles for your job needs</p>
            </div>
        </div>

        <Card>
            <CardContent className="p-4 flex justify-center">
                <div className="w-full max-w-4xl grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end">
                    <div className="lg:col-span-1 space-y-2">
                        <Label htmlFor="search-input">Search by Name</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input 
                            id="search-input" 
                            placeholder="Name..." 
                            className="pl-10" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Skill</Label>
                        <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by skill" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Skills</SelectItem>
                            <SelectItem value="cooking">Cooking</SelectItem>
                            <SelectItem value="farming">Farming</SelectItem>
                            <SelectItem value="tailoring">Tailoring</SelectItem>
                            <SelectItem value="cleaning">Cleaning</SelectItem>
                            <SelectItem value="herding">Herding</SelectItem>
                            <SelectItem value="child-care">Child Care</SelectItem>
                            <SelectItem value="handicrafts">Handicrafts</SelectItem>
                            <SelectItem value="painting">Painting</SelectItem>
                            <SelectItem value="embroidery">Embroidery</SelectItem>
                            <SelectItem value="driving">Driving</SelectItem>
                            <SelectItem value="data-entry">Data Entry</SelectItem>
                            <SelectItem value="gardening">Gardening</SelectItem>
                            <SelectItem value="baking">Baking</SelectItem>
                            <SelectItem value="graphic-design">Graphic Design</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            <SelectGroup>
                                <SelectLabel>Tamil Nadu</SelectLabel>
                                <SelectItem value="Chennai">Chennai</SelectItem>
                                <SelectItem value="Coimbatore">Coimbatore</SelectItem>
                                <SelectItem value="Madurai">Madurai</SelectItem>
                                <SelectItem value="Tiruchirappalli">Tiruchirappalli</SelectItem>
                                <SelectItem value="Salem">Salem</SelectItem>
                                <SelectItem value="Erode">Erode</SelectItem>
                                <SelectItem value="Tirunelveli">Tirunelveli</SelectItem>
                                <SelectItem value="Vellore">Vellore</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectLabel>Karnataka</SelectLabel>
                                <SelectItem value="Bangalore">Bangalore</SelectItem>
                                <SelectItem value="Mysuru">Mysuru</SelectItem>
                                <SelectItem value="Mangalore">Mangalore</SelectItem>
                                <SelectItem value="Hubli">Hubli</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectLabel>Maharashtra</SelectLabel>
                                <SelectItem value="Mumbai">Mumbai</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-center">
                        <Button onClick={handleSearch}>
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Available Workers ({availableWorkers.length})</h2>
            {availableWorkers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableWorkers.map((profile) => (
                <WorkerCard 
                    key={profile.id}
                    profile={profile}
                    isSelected={selectedWorkers.includes(profile.id)}
                    onSelect={handleSelectWorker}
                />
                ))}
            </div>
            ) : (
            <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
                <h3 className="text-xl font-semibold">No Available Workers</h3>
                <p className="mt-2">Try adjusting your search filters or check back later.</p>
            </div>
            )}
        </div>

        {selectedWorkers.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
            <div className="container mx-auto flex justify-between items-center">
                <p className="font-semibold">{selectedWorkers.length} worker(s) selected.</p>
                <Button size="lg" onClick={handleOpenAssignmentModal}>Confirm Assignment</Button>
            </div>
            </div>
        )}

        <Dialog open={isAssignmentModalOpen} onOpenChange={setIsAssignmentModalOpen}>
            <DialogContent className="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle>Assign Workers</DialogTitle>
                <DialogDescription>
                Assign the {selectedWorkers.length} selected worker(s) to an existing job or create a new one.
                </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="existing-job" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing-job">Assign to Existing Job</TabsTrigger>
                <TabsTrigger value="new-job">Post a New Job</TabsTrigger>
                </TabsList>
                <TabsContent value="existing-job">
                <div className="space-y-4 py-4">
                    <Label htmlFor="existing-job-select">Select a Job</Label>
                    <Select value={selectedExistingJob} onValueChange={setSelectedExistingJob}>
                        <SelectTrigger id="existing-job-select">
                            <SelectValue placeholder="Choose a job..." />
                        </SelectTrigger>
                        <SelectContent>
                            {assignableJobs.length > 0 ? (
                                assignableJobs.map(job => (
                                    <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-jobs" disabled>No unassigned jobs available</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
                    <Button onClick={handleAssignToExisting} disabled={!selectedExistingJob}>Assign to this Job</Button>
                </DialogFooter>
                </TabsContent>
                <TabsContent value="new-job">
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="space-y-2">
                        <Label htmlFor="new-job-title">Job Title</Label>
                        <Input id="new-job-title" value={newJobDetails.title} onChange={(e) => setNewJobDetails({...newJobDetails, title: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-job-company">Company (Optional)</Label>
                            <Input id="new-job-company" value={newJobDetails.companyName} onChange={(e) => setNewJobDetails({...newJobDetails, companyName: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-job-location">Location</Label>
                            <Input id="new-job-location" value={newJobDetails.location} onChange={(e) => setNewJobDetails({...newJobDetails, location: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-job-type">Job Type</Label>
                            <Select value={newJobDetails.jobType} onValueChange={(value) => setNewJobDetails({...newJobDetails, jobType: value as Job['jobType']})}>
                                <SelectTrigger id="new-job-type"><SelectValue placeholder="Select..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-job-salary">Salary (Optional)</Label>
                            <Input id="new-job-salary" value={newJobDetails.salary} onChange={(e) => setNewJobDetails({...newJobDetails, salary: e.target.value})} />
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
                    <div className="space-y-2">
                        <Label htmlFor="new-job-description">Job Description</Label>
                        <Textarea id="new-job-description" value={newJobDetails.description} onChange={(e) => setNewJobDetails({...newJobDetails, description: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-job-skills">Skills Required (comma-separated)</Label>
                        <Input id="new-job-skills" value={newJobDetails.skillsRequired} onChange={(e) => setNewJobDetails({...newJobDetails, skillsRequired: e.target.value})} />
                    </div>
                </div>
                <DialogFooter className="pt-4 border-t">
                    <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
                    <Button onClick={handlePostAndAssign}>Post and Assign</Button>
                </DialogFooter>
                </TabsContent>
            </Tabs>
            </DialogContent>
        </Dialog>
        </div>
    </VerificationGate>
  );
}
