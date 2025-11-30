
'use client';

import { useState, useEffect } from "react";
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
import { Edit, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Profile = {
  id: string;
  name: string;
  mobileNo: string;
  aadhaarId: string;
  skills: string[];
  jobsCompleted: number;
  benefitedAmount: number;
};

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem('selectedPanchayatProfile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      // If no profile is found, redirect back to the profiles list
      router.push('/dashboard/panchayat/profiles');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (profile) {
      setProfile(prev => prev ? {
        ...prev,
        [id]: id === 'skills' ? value.split(',').map(s => s.trim()) : value
      } : null);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const allProfiles: Profile[] = JSON.parse(localStorage.getItem('panchayatProfiles') || '[]');
      const updatedProfiles = allProfiles.map(p => p.id === profile.id ? profile : p);
      localStorage.setItem('panchayatProfiles', JSON.stringify(updatedProfiles));
      
      toast({
        title: 'Profile Updated!',
        description: `${profile.name}'s details have been updated.`,
      });

      localStorage.removeItem('selectedPanchayatProfile');
      router.push('/dashboard/panchayat/profiles');

    } catch (error) {
       toast({
        title: 'Error Saving Profile',
        description: 'There was an issue saving the profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!profile) {
    return (
        <div className="p-4 sm:p-6 lg:p-8 text-center">
            <p>Loading profile...</p>
        </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-8">
         <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <Edit className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{profile.name}</CardTitle>
          <CardDescription>
            Update the details for this job seeker.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveChanges} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Job Seeker Name</Label>
                <Input id="name" value={profile.name || ''} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNo">Mobile No</Label>
                <Input id="mobileNo" type="tel" value={profile.mobileNo || ''} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="aadhaarId">Aadhaar ID</Label>
                <Input id="aadhaarId" value={profile.aadhaarId || ''} onChange={handleInputChange} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea id="skills" value={Array.isArray(profile.skills) ? profile.skills.join(', ') : ''} onChange={handleInputChange} required />
              <p className="text-xs text-muted-foreground">Enter skills separated by commas.</p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" className="bg-gradient-to-r from-[#E0BBE4] to-[#957DAD] hover:opacity-90 text-primary-foreground">
                <Save className="mr-2 h-4 w-4"/>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
