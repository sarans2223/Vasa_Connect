
'use client';

import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockTeams, mockUser } from "@/lib/data";
import { PlusCircle, Users, Send, Sparkles, Eye, UserPlus } from "lucide-react";
import type { Team } from '@/lib/types';
import { suggestTeamsForUser, type SuggestTeamsForUserOutput } from '@/ai/flows/ai-suggest-teams';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

type SuggestedTeam = SuggestTeamsForUserOutput['suggestedTeams'][0];


export default function TeamsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedTeams, setSuggestedTeams] = useState<SuggestTeamsForUserOutput['suggestedTeams'] | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<SuggestedTeam | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [myTeams, setMyTeams] = useState<Team[]>(mockTeams.slice(0, 2));
  const [newMemberEmails, setNewMemberEmails] = useState<Record<string, string>>({});
  const [showAddMember, setShowAddMember] = useState<Record<string, boolean>>({});


  const handleFindTeams = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestedTeams(null);
    try {
      const result = await suggestTeamsForUser({
        userSkills: mockUser.skills,
        allTeams: mockTeams.map(t => ({ name: t.name, description: t.description, memberCount: t.members.length })),
        numberOfSuggestions: 5,
      });
      setSuggestedTeams(result.suggestedTeams);
    } catch (e) {
      console.error(e);
      setError("An error occurred while suggesting teams. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleJoinRequest = (teamName: string) => {
    toast({
      title: 'Request Sent!',
      description: `Your request to join ${teamName} has been sent for approval.`,
    });
  };

  const handleViewDetails = (team: SuggestedTeam) => {
    setSelectedTeam(team);
  };
  
  const handleNewMemberEmailChange = (teamId: string, email: string) => {
    setNewMemberEmails(prev => ({ ...prev, [teamId]: email }));
  };

  const handleInviteMember = (teamId: string, teamName: string) => {
    const email = newMemberEmails[teamId];
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter an email address to send an invitation.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Invitation Sent!',
      description: `An invitation has been sent to ${email} to join ${teamName}.`,
    });

    // Clear the input field after sending
    setNewMemberEmails(prev => ({ ...prev, [teamId]: '' }));
    setShowAddMember(prev => ({ ...prev, [teamId]: false }));
  };

  const toggleAddMember = (teamId: string) => {
    setShowAddMember(prev => ({ ...prev, [teamId]: !prev[teamId] }));
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">My Teams</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a New Team</CardTitle>
          <CardDescription>
            Start a new collective for collaboration and support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input id="team-name" placeholder="e.g., Sakthi Women Catering" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-description">Description</Label>
              <Textarea
                id="team-description"
                placeholder="What is the purpose of your team?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-members">Add Members (Optional)</Label>
               <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="team-members" placeholder="Enter member emails, separated by commas" className="pl-10" />
              </div>
            </div>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-[#E0BBE4] to-[#957DAD] hover:opacity-90 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Separator />

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Your Teams</h2>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
           {myTeams.map(team => (
                <Card key={team.id}>
                    <CardHeader>
                        <CardTitle>{team.name}</CardTitle>
                        <CardDescription>{team.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-3">Members ({team.members.length})</h4>
                            <div className="flex items-center -space-x-2">
                                {team.members.map(member => (
                                    <Avatar key={member.id} className="h-10 w-10 border-2 border-card">
                                        <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="woman portrait" />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                ))}
                                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-muted hover:bg-secondary" onClick={() => toggleAddMember(team.id)}>
                                    <PlusCircle className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {showAddMember[team.id] && (
                          <div className="space-y-2 pt-4 border-t">
                              <h4 className="font-semibold">Add Members</h4>
                              <div className="flex gap-2">
                                  <Input 
                                      placeholder="Enter email to invite" 
                                      type="email" 
                                      value={newMemberEmails[team.id] || ''}
                                      onChange={(e) => handleNewMemberEmailChange(team.id, e.target.value)}
                                  />
                                  <Button onClick={() => handleInviteMember(team.id, team.name)}>
                                      <Send className="h-4 w-4" />
                                  </Button>
                              </div>
                          </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
      
       <Separator />

      <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Discover New Teams</h2>
                <p className="text-muted-foreground mt-1">Join a team that matches your skills and interests.</p>
            </div>
            <Button onClick={handleFindTeams} disabled={isLoading} size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#D291BC] to-[#957DAD] hover:opacity-90 text-white">
                <Sparkles className="mr-2 h-5 w-5" />
                {isLoading ? "Finding Teams..." : "Suggest Teams for Me"}
            </Button>
        </div>
        
        {isLoading && (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full mt-2" />
                            <Skeleton className="h-4 w-2/3 mt-1" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-1/4 mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                         <CardFooter className="gap-2">
                            <Skeleton className="h-10 w-28" />
                            <Skeleton className="h-10 w-32" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}

        {suggestedTeams && (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {suggestedTeams.map((team) => (
                <Card key={team.name} className="flex flex-col">
                  <CardHeader>
                      <CardTitle>{team.name}</CardTitle>
                      <CardDescription>{team.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                      <p className="text-sm font-medium text-muted-foreground">{team.memberCount} members</p>
                      <div>
                        <p className="text-sm font-semibold">Why it's a good match:</p>
                        <p className="text-sm text-muted-foreground italic">"{team.reason}"</p>
                      </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                      <Button variant="outline" onClick={() => handleViewDetails(team)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                      </Button>
                      <Button onClick={() => handleJoinRequest(team.name)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Request to Join
                      </Button>
                  </CardFooter>
                </Card>
            ))}
            </div>
        )}
      </div>

        {selectedTeam && (
            <Dialog open={!!selectedTeam} onOpenChange={(isOpen) => !isOpen && setSelectedTeam(null)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                <DialogTitle className="text-2xl">{selectedTeam.name}</DialogTitle>
                <DialogDescription>
                    {selectedTeam.description}
                </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-5 w-5" />
                        <span className="font-semibold">{selectedTeam.memberCount} Members</span>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">AI Recommendation</h4>
                        <p className="text-sm text-muted-foreground italic">"{selectedTeam.reason}"</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedTeam(null)}>Close</Button>
                    <Button onClick={() => { handleJoinRequest(selectedTeam.name); setSelectedTeam(null); }}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Request to Join
                    </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        )}

    </div>
  );
}
