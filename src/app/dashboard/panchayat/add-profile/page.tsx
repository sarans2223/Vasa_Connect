
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AddProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [aadhaarId, setAadhaarId] = useState('');
  const [skills, setSkills] = useState('');

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobileNo || !aadhaarId || !skills) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all fields.',
        variant: 'destructive',
      });
      return;
    }

    const newProfile = {
      id: `profile-${Date.now()}`,
      name,
      mobileNo,
      aadhaarId,
      skills: skills.split(',').map(s => s.trim()),
      jobsCompleted: 0,
      benefitedAmount: 0,
    };

    try {
      const existingProfiles = JSON.parse(localStorage.getItem('panchayatProfiles') || '[]');
      localStorage.setItem('panchayatProfiles', JSON.stringify([newProfile, ...existingProfiles]));
      
      toast({
        title: 'Profile Created!',
        description: `${name} has been added to the panchayat registry.`,
      });

      router.push('/dashboard/panchayat/profiles');
    } catch (error) {
       toast({
        title: 'Error Saving Profile',
        description: 'There was an issue saving the profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-8">
        <UserPlus className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Add Profile</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>New Job Seeker Details</CardTitle>
          <CardDescription>
            Fill out the form to register a new person from your panchayat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateProfile} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Job Seeker Name</Label>
                <Input id="name" placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile-no">Mobile No</Label>
                <Input id="mobile-no" type="tel" placeholder="Enter mobile number" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="aadhaar-id">Aadhaar ID</Label>
                <Input id="aadhaar-id" placeholder="Enter 12-digit Aadhaar ID" value={aadhaarId} onChange={(e) => setAadhaarId(e.target.value)} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea id="skills" placeholder="e.g., Tailoring, Driving, Cooking (comma-separated)" value={skills} onChange={(e) => setSkills(e.target.value)} required />
              <p className="text-xs text-muted-foreground">Enter skills separated by commas.</p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" className="bg-gradient-to-r from-[#E0BBE4] to-[#957DAD] hover:opacity-90 text-primary-foreground">
                Create Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
