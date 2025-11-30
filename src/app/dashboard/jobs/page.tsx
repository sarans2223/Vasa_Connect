
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockJobs } from "@/lib/data";
import { Briefcase, Search, MapPin, DollarSign } from "lucide-react";
import { JobCard } from "../components/job-card";
import { JobSearchClient } from "./components/job-search-client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { Job } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { VerificationGate } from '@/components/verification-gate';

export default function JobsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('all');
    const [jobType, setJobType] = useState('all');
    const [industry, setIndustry] = useState('all');
    const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
    const { toast } = useToast();

    const handleSearch = () => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const newFilteredJobs = mockJobs.filter(job => {
            const matchesQuery = lowercasedQuery ? 
                job.title.toLowerCase().includes(lowercasedQuery) ||
                job.skillsRequired.some(skill => skill.toLowerCase().includes(lowercasedQuery))
                : true;

            const matchesLocation = location !== 'all' ? job.location.toLowerCase().includes(location.split(',')[0].toLowerCase()) : true;
            const matchesJobType = jobType !== 'all' ? job.jobType.toLowerCase() === jobType.toLowerCase() : true;
            const matchesIndustry = industry !== 'all' ? job.industry.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === industry : true;
            
            return matchesQuery && matchesLocation && matchesJobType && matchesIndustry;
        });
        setFilteredJobs(newFilteredJobs);
    };

    const handleViewDetails = (job: Job) => {
        setSelectedJob(job);
    };

    const handleApply = (job: Job) => {
        if (!appliedJobs.some(applied => applied.id === job.id)) {
            setAppliedJobs(prev => [...prev, job]);
            toast({
                title: 'Application Sent!',
                description: `Your application for "${job.title}" has been submitted.`,
            });
        }
    };
    
    const isJobApplied = (jobId: string) => appliedJobs.some(job => job.id === jobId);

  return (
    <VerificationGate>
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex items-center gap-4">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Job Opportunities</h1>
        </div>

        <JobSearchClient />
        
        <Separator />
        
        <Tabs defaultValue="all-jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all-jobs">All Jobs</TabsTrigger>
                <TabsTrigger value="my-jobs">My Jobs ({appliedJobs.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all-jobs">
                <div className="mt-6">
                    <Card className="mb-6">
                    <CardContent className="p-4 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input 
                                placeholder="Search by title or skill..." 
                                className="pl-10" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                    <SelectValue placeholder="Location" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                <SelectItem value="remote">Remote</SelectItem>
                                <SelectItem value="agra">Agra, UP</SelectItem>
                                <SelectItem value="ahmedabad">Ahmedabad, GJ</SelectItem>
                                <SelectItem value="aizawl">Aizawl, MZ</SelectItem>
                                <SelectItem value="agartala">Agartala, TR</SelectItem>
                                <SelectItem value="amritsar">Amritsar, PB</SelectItem>
                                <SelectItem value="bangalore">Bangalore, KA</SelectItem>
                                <SelectItem value="bhopal">Bhopal, MP</SelectItem>
                                <SelectItem value="bhubaneswar">Bhubaneswar, OD</SelectItem>
                                <SelectItem value="bilaspur">Bilaspur, CG</SelectItem>
                                <SelectItem value="chandigarh">Chandigarh, CH</SelectItem>
                                <SelectItem value="chennai">Chennai, TN</SelectItem>
                                <SelectItem value="coimbatore">Coimbatore, TN</SelectItem>
                                <SelectItem value="cuttack">Cuttack, OD</SelectItem>
                                <SelectItem value="darjeeling">Darjeeling, WB</SelectItem>
                                <SelectItem value="dehradun">Dehradun, UK</SelectItem>
                                <SelectItem value="delhi">Delhi, NCR</SelectItem>
                                <SelectItem value="dibrugarh">Dibrugarh, AS</SelectItem>
                                <SelectItem value="dimapur">Dimapur, NL</SelectItem>
                                <SelectItem value="faridabad">Faridabad, HR</SelectItem>
                                <SelectItem value="gangtok">Gangtok, SK</SelectItem>
                                <SelectItem value="gaya">Gaya, BR</SelectItem>
                                <SelectItem value="guntur">Guntur, AP</SelectItem>
                                <SelectItem value="gurgaon">Gurgaon, HR</SelectItem>
                                <SelectItem value="guwahati">Guwahati, AS</SelectItem>
                                <SelectItem value="haridwar">Haridwar, UK</SelectItem>
                                <SelectItem value="hyderabad">Hyderabad, TG</SelectItem>
                                <SelectItem value="imphal">Imphal, MN</SelectItem>
                                <SelectItem value="indore">Indore, MP</SelectItem>
                                <SelectItem value="itanagar">Itanagar, AR</SelectItem>
                                <SelectItem value="jabalpur">Jabalpur, MP</SelectItem>
                                <SelectItem value="jaipur">Jaipur, RJ</SelectItem>
                                <SelectItem value="jamshedpur">Jamshedpur, JH</SelectItem>
                                <SelectItem value="jodhpur">Jodhpur, RJ</SelectItem>
                                <SelectItem value="kanpur">Kanpur, UP</SelectItem>
                                <SelectItem value="kochi">Kochi, KL</SelectItem>
                                <SelectItem value="kohima">Kohima, NL</SelectItem>
                                <SelectItem value="kolkata">Kolkata, WB</SelectItem>
                                <SelectItem value="kozhikode">Kozhikode, KL</SelectItem>
                                <SelectItem value="lucknow">Lucknow, UP</SelectItem>
                                <SelectItem value="ludhiana">Ludhiana, PB</SelectItem>
                                <SelectItem value="madurai">Madurai, TN</SelectItem>
                                <SelectItem value="manali">Manali, HP</SelectItem>
                                <SelectItem value="mangaluru">Mangaluru, KA</SelectItem>
                                <SelectItem value="margao">Margao, GA</SelectItem>
                                <SelectItem value="mumbai">Mumbai, MH</SelectItem>
                                <SelectItem value="muzaffarpur">Muzaffarpur, BR</SelectItem>
                                <SelectItem value="mysuru">Mysuru, KA</SelectItem>
                                <SelectItem value="nagpur">Nagpur, MH</SelectItem>
                                <SelectItem value="noida">Noida, UP</SelectItem>
                                <SelectItem value="panaji">Panaji, GA</SelectItem>
                                <SelectItem value="panipat">Panipat, HR</SelectItem>
                                <SelectItem value="patna">Patna, BR</SelectItem>
                                <SelectItem value="puducherry">Puducherry, PY</SelectItem>
                                <SelectItem value="pune">Pune, MH</SelectItem>
                                <SelectItem value="raipur">Raipur, CG</SelectItem>
                                <SelectItem value="ranchi">Ranchi, JH</SelectItem>
                                <SelectItem value="salem">Salem, TN</SelectItem>
                                <SelectItem value="shillong">Shillong, ML</SelectItem>
                                <SelectItem value="shimla">Shimla, HP</SelectItem>
                                <SelectItem value="silchar">Silchar, AS</SelectItem>
                                <SelectItem value="surat">Surat, GJ</SelectItem>
                                <SelectItem value="tawang">Tawang, AR</SelectItem>
                                <SelectItem value="thiruvananthapuram">Thiruvananthapuram, KL</SelectItem>
                                <SelectItem value="tiruchirappalli">Tiruchirappalli, TN</SelectItem>
                                <SelectItem value="udaipur">Udaipur, RJ</SelectItem>
                                <SelectItem value="vadodara">Vadodara, GJ</SelectItem>
                                <SelectItem value="vijayawada">Vijayawada, AP</SelectItem>
                                <SelectItem value="visakhapatnam">Visakhapatnam, AP</SelectItem>
                                <SelectItem value="warangal">Warangal, TG</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={jobType} onValueChange={setJobType}>
                            <SelectTrigger>
                            <SelectValue placeholder="Job Type" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">All Job Types</SelectItem>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">Internship</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={industry} onValueChange={setIndustry}>
                            <SelectTrigger>
                            <SelectValue placeholder="Industry" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">All Industries</SelectItem>
                            <SelectItem value="art-craft">Art & Craft</SelectItem>
                            <SelectItem value="catering">Catering</SelectItem>
                            <SelectItem value="child-care">Child Care</SelectItem>
                            <SelectItem value="domestic-services">Domestic Services</SelectItem>
                            <SelectItem value="events">Events</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="home-services">Home Services</SelectItem>
                            <SelectItem value="hospitality">Hospitality</SelectItem>
                            <SelectItem value="fashion">Fashion</SelectItem>
                            <SelectItem value="agriculture">Agriculture</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSearch}>
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </Button>
                        </div>
                    </CardContent>
                    </Card>

                    {filteredJobs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.map((job) => (
                        <JobCard 
                            key={job.id} 
                            job={job} 
                            onViewDetails={() => handleViewDetails(job)}
                            onApplyClick={() => handleApply(job)}
                            isApplied={isJobApplied(job.id)}
                        />
                        ))}
                    </div>
                    ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <h3 className="text-xl font-semibold">No Jobs Found</h3>
                        <p>Your search did not match any job listings. Try different filters.</p>
                    </div>
                    )}
                </div>
            </TabsContent>
            <TabsContent value="my-jobs">
            <div className="mt-6">
                    {appliedJobs.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {appliedJobs.map((job) => (
                            <JobCard 
                                    key={job.id} 
                                    job={job} 
                                    onViewDetails={() => handleViewDetails(job)}
                                    onApplyClick={() => {}}
                                    isApplied={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
                            <h3 className="text-xl font-semibold">No Applied Jobs Yet</h3>
                            <p className="mt-2">Jobs you apply for will appear here.</p>
                        </div>
                    )}
            </div>
            </TabsContent>
        </Tabs>


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
