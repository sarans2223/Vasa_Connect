
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { mockUser as defaultUser, mockWorkerHistory, mockRecruiterHistory } from "@/lib/data";
import { User as UserIcon, Edit, Upload, Star, Leaf, Gem, Crown, History, Briefcase, Users, FileText, Phone, Mail, Home } from "lucide-react";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useVerification } from "@/hooks/use-verification";

const membershipBadges = {
  Rise: {
    label: "Vasa Rise Member",
    icon: Leaf,
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  },
  Bloom: {
    label: "Vasa Bloom Member",
    icon: Gem,
    className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  },
  Empower: {
    label: "Vasa Empower Member",
    icon: Crown,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  },
};


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const { isPanVerified, isAadhaarVerified, setPanVerified, setAadhaarVerified } = useVerification();
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
                ...(prevUser || defaultUser),
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

  const handleFileUpload = (fileType: 'pan' | 'aadhaar') => (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const fileName = event.target.files[0].name;
      const docName = fileType === 'pan' ? 'PAN Card' : 'Aadhaar Card';

      if (fileType === 'pan') {
        setPanVerified(true);
      } else {
        setAadhaarVerified(true);
      }

      toast({
        title: `${docName} Uploaded`,
        description: `${fileName} has been selected for verification.`,
      });
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-200" />);
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-gray-300" />);
      }
    }
    return stars;
  };

  const MembershipBadge = () => {
    if (!user) return null;
    const badge = membershipBadges[user.membership];
    if (!badge) return null;
    const Icon = badge.icon;
    return (
      <Badge variant="outline" className={`mt-2 ${badge.className}`}>
        <Icon className="mr-2 h-4 w-4" />
        {badge.label}
      </Badge>
    );
  };

  if (!user) {
    return <div>Loading...</div>; // Or a skeleton loader
  }


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
       <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <UserIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        </div>
        <Button asChild>
            <Link href="/dashboard/profile/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
            </Link>
        </Button>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <MembershipBadge />
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Rating</span>
                  <div className="flex items-center gap-1">
                    {renderStars(user.rating)}
                    <span className="font-bold ml-1">{user.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 border-t pt-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">PAN Verification</span>
                    {isPanVerified ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>
                    ) : (
                        <Badge variant="destructive">Not Verified</Badge>
                    )}
                 </div>
                 <Button variant="outline" className="w-full" asChild>
                    <Label htmlFor="pan-upload" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload PAN Card
                    </Label>
                 </Button>
                 <Input id="pan-upload" type="file" className="hidden" onChange={handleFileUpload('pan')} accept="image/*,.pdf" />

                 <div className="flex justify-between items-center text-sm pt-2">
                    <span className="font-medium">Aadhaar Verification</span>
                     {isAadhaarVerified ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>
                    ) : (
                        <Badge variant="destructive">Not Verified</Badge>
                    )}
                 </div>
                 <Button variant="outline" className="w-full" asChild>
                    <Label htmlFor="aadhaar-upload" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Aadhaar Card
                    </Label>
                 </Button>
                 <Input id="aadhaar-upload" type="file" className="hidden" onChange={handleFileUpload('aadhaar')} accept="image/*,.pdf" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>My Skills</CardTitle>
              <CardDescription>
                Your skills help us match you with the right opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your professional summary and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <span>{user.email}</span>
                </div>
                 <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Phone className="h-5 w-5" />
                  <span>{user.mobileNumber || 'Not provided'}</span>
                </div>
                 <div className="flex items-start gap-4 text-sm text-muted-foreground">
                  <Home className="h-5 w-5 mt-1" />
                  <span>{user.address || 'Not provided'}</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Experience Summary</Label>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md min-h-[120px]">
                    {user.experience}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Desired Job Type</Label>
                  <p className="text-sm font-medium p-3 bg-muted rounded-md">{user.desiredJobType}</p>
                </div>
                 <div className="space-y-2">
                  <Label>Location Preferences</Label>
                  <p className="text-sm font-medium p-3 bg-muted rounded-md">{user.locationPreferences}</p>
                </div>
              </div>
               <div className="space-y-2">
                  <Label>Industry Preferences</Label>
                  <div className="flex flex-wrap gap-2">
                    {user.industryPreferences.map((industry) => (
                        <Badge key={industry} variant="secondary" className="text-sm">
                            {industry}
                        </Badge>
                    ))}
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Separator className="my-8" />
       <Card>
        <CardHeader>
            <div className="flex items-center gap-4">
                <History className="h-6 w-6 text-primary" />
                <CardTitle>My History</CardTitle>
            </div>
            <CardDescription>Review your past activities as a worker and a recruiter.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="worker-history">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="worker-history"><Briefcase className="mr-2 h-4 w-4" />As a Worker</TabsTrigger>
                    <TabsTrigger value="recruiter-history"><Users className="mr-2 h-4 w-4" />As a Recruiter</TabsTrigger>
                </TabsList>
                <TabsContent value="worker-history" className="pt-6">
                    {mockWorkerHistory.length > 0 ? (
                        <div className="space-y-4">
                            {mockWorkerHistory.map(job => (
                                <div key={job.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                    <div>
                                        <h4 className="font-semibold">{job.title}</h4>
                                        <p className="text-sm text-muted-foreground">Completed on: {job.dateCompleted}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">₹{job.amountEarned.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">Amount Earned</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>You haven't completed any jobs as a worker yet.</p>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="recruiter-history" className="pt-6">
                     {mockRecruiterHistory.length > 0 ? (
                        <div className="space-y-4">
                            {mockRecruiterHistory.map(job => (
                                <div key={job.id} className="p-4 border rounded-lg">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                        <div>
                                            <h4 className="font-semibold">{job.title}</h4>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {job.workersHired.map(worker => <Badge key={worker} variant="secondary">{worker}</Badge>)}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-right">
                                            <div>
                                                <p className="font-bold text-destructive">-₹{job.amountPaid.toLocaleString()}</p>
                                                <p className="text-xs text-muted-foreground">Paid</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-green-600">+{job.pointsEarned} Tokens</p>
                                                <p className="text-xs text-muted-foreground">Tokens Earned</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                             <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No recruiter history</h3>
                            <p className="mt-1 text-sm text-gray-500">You haven't hired any workers yet.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
