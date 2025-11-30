"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { mockJobs, mockUser } from "@/lib/data";
import { matchJobsToUsers, type MatchJobsToUsersOutput } from "@/ai/flows/ai-match-jobs-to-users";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { JobCard } from "../../components/job-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Job } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Briefcase, MapPin, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";


export function JobSearchClient() {
    const [isLoading, setIsLoading] = useState(false);
    const [matchedJobs, setMatchedJobs] = useState<MatchJobsToUsersOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const handleMatchJobs = async () => {
        setIsLoading(true);
        setError(null);
        setMatchedJobs(null);

        const userProfileForAI = {
            skills: mockUser.skills,
            experience: mockUser.experience,
            desiredJobType: mockUser.desiredJobType,
            locationPreferences: mockUser.locationPreferences,
            industryPreferences: mockUser.industryPreferences,
        };

        const jobPostingsForAI = mockJobs.map(job => ({
            title: job.title,
            description: job.description,
            skillsRequired: job.skillsRequired,
            jobType: job.jobType,
            location: job.location,
            industry: job.industry,
        }));
        
        try {
            const result = await matchJobsToUsers({ userProfile: userProfileForAI, jobPostings: jobPostingsForAI });
            // Sort by relevance score descending
            result.sort((a, b) => b.relevanceScore - a.relevanceScore);
            setMatchedJobs(result);
        } catch (e) {
            console.error(e);
            setError("An error occurred while matching jobs. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = (job: Job) => {
        setSelectedJob(job);
    };
    
    return (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">AI-Powered Job Matching</h2>
                        <p className="text-muted-foreground mt-1">Let our AI find the best job opportunities for you based on your profile.</p>
                    </div>
                    <Button onClick={handleMatchJobs} disabled={isLoading} size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#D291BC] to-[#957DAD] hover:opacity-90 text-white">
                        <Sparkles className="mr-2 h-5 w-5" />
                        {isLoading ? "Finding Matches..." : "Find Best Matches for Me"}
                    </Button>
                </div>
            </Card>

            {isLoading && (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <div className="p-6 space-y-4">
                                <div className="flex gap-4">
                                    <Skeleton className="h-14 w-14 rounded-sm" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <div className="flex gap-2">
                                     <Skeleton className="h-6 w-20" />
                                     <Skeleton className="h-6 w-24" />
                                </div>
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </Card>
                    ))}
                 </div>
            )}
            
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {matchedJobs && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold tracking-tight">Your Top Matches</h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {matchedJobs.map(matchedJob => {
                            const originalJob = mockJobs.find(j => j.title === matchedJob.jobTitle);
                            if (!originalJob) return null;
                            return <JobCard key={originalJob.id} job={originalJob} relevanceScore={matchedJob.relevanceScore} onViewDetails={() => handleViewDetails(originalJob)} />;
                        })}
                    </div>
                </div>
            )}

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
    );
}
