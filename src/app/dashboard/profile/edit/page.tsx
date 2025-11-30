
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { mockUser as defaultUser } from "@/lib/data";
import { User as UserIcon, Save, ArrowLeft } from "lucide-react";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function EditProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
          const storedName = localStorage.getItem('userName');
          const storedEmail = localStorage.getItem('userEmail');
          if (storedName || storedEmail) {
              setUser(prevUser => ({ 
                  ...defaultUser,
                  ...prevUser,
                  name: storedName || defaultUser.name,
                  email: storedEmail || defaultUser.email,
              }));
          } else {
            setUser(defaultUser);
          }
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      setUser(defaultUser);
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setUser(prevUser => ({
      ...(prevUser || defaultUser),
      [id]: id === 'skills' || id === 'industryPreferences' ? value.split(',').map(s => s.trim()) : value,
    }));
  };

  const handleSaveChanges = () => {
    if (!user) return;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userName', user.name);

    // Dispatch a custom event to notify other components of the change
    window.dispatchEvent(new Event('local-storage'));

    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
    router.push('/dashboard/profile');
  };

  if (!user) {
    return <div>Loading...</div>; // Or a skeleton loader
  }


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <UserIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile Information</CardTitle>
          <CardDescription>
            Keep your information up-to-date.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={user.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} disabled />
            </div>
          </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input id="mobileNumber" type="tel" value={user.mobileNumber || ''} onChange={handleInputChange} placeholder="e.g., 9876543210" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={user.address || ''} onChange={handleInputChange} placeholder="Enter your full address" />
            </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Experience Summary</Label>
            <Textarea
              id="experience"
              value={user.experience}
              onChange={handleInputChange}
              className="min-h-[120px]"
              placeholder="Tell us about your professional experience..."
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="desiredJobType">Desired Job Type</Label>
              <Input id="desiredJobType" value={user.desiredJobType} onChange={handleInputChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="locationPreferences">Location Preferences</Label>
              <Input id="locationPreferences" value={user.locationPreferences} onChange={handleInputChange} />
            </div>
          </div>
           <div className="space-y-2">
              <Label htmlFor="industryPreferences">Industry Preferences (comma-separated)</Label>
              <Input id="industryPreferences" value={user.industryPreferences.join(', ')} onChange={handleInputChange} placeholder="e.g., Technology, Healthcare, Education" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="skills">My Skills (comma-separated)</Label>
              <Input id="skills" value={user.skills.join(', ')} onChange={handleInputChange} placeholder="e.g., Cooking, Event Planning" />
            </div>
            <div className="flex justify-end">
                <Button onClick={handleSaveChanges} className="bg-gradient-to-r from-[#E0BBE4] to-[#957DAD] hover:opacity-90 text-primary-foreground">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
