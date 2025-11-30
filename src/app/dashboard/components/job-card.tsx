
'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Job } from "@/lib/types";
import { MapPin, Briefcase, DollarSign, ArrowRight, Send, Check } from "lucide-react";

type JobCardProps = {
  job: Job;
  relevanceScore?: number;
  onViewDetails?: (job: Job) => void;
  onApplyClick?: (job: Job) => void;
  isApplied?: boolean;
};

export function JobCard({ job, relevanceScore, onViewDetails, onApplyClick, isApplied }: JobCardProps) {
  
  const handleViewDetailsClick = () => {
    if (onViewDetails) {
      onViewDetails(job);
    }
  };

  const handleApplyClick = () => {
    if (onApplyClick) {
      onApplyClick(job);
    }
  };
  
  return (
    <Card className="transition-all hover:shadow-lg flex flex-col">
      <CardHeader className="flex-row gap-4 items-start">
        <Avatar className="h-14 w-14 rounded-sm">
          <AvatarImage src={job.companyLogoUrl} alt={job.companyName} data-ai-hint="company logo" />
          <AvatarFallback>{job.companyName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{job.title}</CardTitle>
          <CardDescription className="font-medium text-primary/80">
            {job.companyName}
          </CardDescription>
        </div>
        {relevanceScore && (
          <Badge variant="outline" className="ml-auto whitespace-nowrap border-green-500 bg-green-50 text-green-700">
            {Math.round(relevanceScore * 100)}% Match
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" />
            <span>{job.jobType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          {job.salary && (
             <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
        </p>
         <div className="flex flex-wrap gap-2">
            {job.skillsRequired.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <Button 
          className="w-full bg-gradient-to-r from-[#E0BBE4] to-[#957DAD] hover:opacity-90 text-primary-foreground"
          onClick={handleViewDetailsClick}
        >
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
         <Button 
          variant="secondary"
          className="w-full"
          onClick={handleApplyClick}
          disabled={isApplied}
        >
          {isApplied ? <><Check className="mr-2 h-4 w-4" />Applied</> : <><Send className="mr-2 h-4 w-4" />Apply Now</>}
        </Button>
      </CardFooter>
    </Card>
  );
}
