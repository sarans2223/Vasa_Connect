
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Bell, User, Briefcase, Check, HelpCircle, Send, MapPin, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";

const initialWorkerNotifications = [
    { id: 1, type: 'offer' as const, job: 'Community Kitchen Chef', recruiter: 'Community Help Group', status: 'pending' as const, question: '', answer: '', location: 'Chennai', pay: '₹15,000/month', schedule: 'Mon-Fri, 9am-5pm' },
    { id: 2, type: 'offer' as const, job: 'Urgent Tailoring Work', recruiter: 'Local Boutique', status: 'confirmed' as const, question: 'What is the exact fabric type?', answer: 'It is a 60% cotton, 40% polyester blend.', location: 'Coimbatore', pay: '₹500/piece', schedule: 'Flexible' },
    { id: 3, type: 'offer' as const, job: 'Farm Hand for Harvest', recruiter: 'Green Fields Farm', status: 'pending' as const, question: '', answer: '', location: 'Salem', pay: '₹450/day', schedule: 'Seasonal' },

];

const initialRecruiterNotifications = [
    { id: 1, type: 'confirmation' as const, job: 'Event Catering Assistant', worker: 'Lakshmi Priya', status: 'confirmed' as const, question: '', answer: '' },
    { id: 2, type: 'confirmation' as const, job: 'Office Cleaning Staff', worker: 'Anjali Sharma', status: 'pending' as const, question: '', answer: '' },
    { id: 3, type: 'question' as const, job: 'Urgent Tailoring Work', worker: 'Kavita Devi', status: 'answered' as const, question: 'What is the exact fabric type?', answer: 'It is a 60% cotton, 40% polyester blend.' },
];


export default function NotificationsPage() {
  const [workerNotifs, setWorkerNotifs] = useState(initialWorkerNotifications);
  const [recruiterNotifs, setRecruiterNotifs] = useState(initialRecruiterNotifications);
  const { toast } = useToast();

  const handleWorkerConfirm = (id: number) => {
    setWorkerNotifs(prev => prev.map(n => n.id === id ? { ...n, status: 'confirmed' } : n));
    toast({ title: "Job Confirmed!", description: "The recruiter has been notified of your confirmation." });
  };
  
  const handleWorkerQuestion = (id: number, question: string) => {
      if (!question.trim()) {
          toast({ title: "Empty Question", description: "Please type a question before sending.", variant: 'destructive' });
          return;
      }
      setWorkerNotifs(prev => prev.map(n => n.id === id ? { ...n, question: question, status: 'question_asked' } : n));
      toast({ title: "Question Sent!", description: "Your question has been sent to the recruiter." });
  };
  
  const handleRecruiterAnswer = (id: number, answer: string) => {
      if (!answer.trim()) {
          toast({ title: "Empty Answer", description: "Please type an answer before sending.", variant: 'destructive' });
          return;
      }
      setRecruiterNotifs(prev => prev.map(n => n.id === id ? { ...n, answer: answer, status: 'answered' } : n));
      // Also update the original worker notification to show the answer
      const workerNotifToUpdate = workerNotifs.find(wn => wn.job === recruiterNotifs.find(rn => rn.id === id)?.job);
      if (workerNotifToUpdate) {
        setWorkerNotifs(prev => prev.map(wn => wn.id === workerNotifToUpdate.id ? {...wn, answer: answer} : wn));
      }
      toast({ title: "Answer Sent!", description: "Your answer has been sent to the worker." });
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Bell className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
      </div>
      <p className="text-muted-foreground max-w-2xl">
        Manage your job offers, confirmations, and communications here.
      </p>

      <Tabs defaultValue="worker" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="worker">
            <User className="mr-2 h-4 w-4"/>
            For Workers
          </TabsTrigger>
          <TabsTrigger value="recruiter">
            <Briefcase className="mr-2 h-4 w-4"/>
            For Recruiters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="worker" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Job Offers</CardTitle>
              <CardDescription>
                Review and respond to job offers from recruiters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {workerNotifs.map((notif, index) => (
                <div key={notif.id} className="border-t pt-6 first:border-t-0 first:pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-semibold">{notif.job}</p>
                      <p className="text-sm text-muted-foreground">From: {notif.recruiter}</p>
                    </div>
                    {notif.status === 'pending' && (
                      <Button onClick={() => handleWorkerConfirm(notif.id)}>
                        <Check className="mr-2 h-4 w-4" /> Confirm Availability
                      </Button>
                    )}
                    {notif.status === 'confirmed' && <Badge variant="secondary" className="bg-green-100 text-green-800">Confirmed</Badge>}
                    {notif.status === 'question_asked' && <Badge variant="secondary" className="bg-blue-100 text-blue-800">Question Sent</Badge>}
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground border-t border-b py-3">
                      <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{notif.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{notif.pay}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{notif.schedule}</span>
                      </div>
                  </div>
                  <div className="mt-4 space-y-4">
                    {notif.question && (
                        <div className="p-3 rounded-md bg-muted/50">
                            <p className="text-sm font-semibold">Your Question:</p>
                            <p className="text-sm text-muted-foreground italic">"{notif.question}"</p>
                        </div>
                    )}
                    {notif.answer && (
                        <div className="p-3 rounded-md bg-green-100/50 border border-green-200">
                            <p className="text-sm font-semibold text-green-800">Recruiter's Answer:</p>
                            <p className="text-sm text-green-700 italic">"{notif.answer}"</p>
                        </div>
                    )}
                    {!notif.question && (
                        <div className="space-y-2">
                            <Label htmlFor={`worker-question-${notif.id}`} className="text-sm font-medium flex items-center gap-2">
                                <HelpCircle className="h-4 w-4" /> Ask a question or doubt
                            </Label>
                            <div className="flex gap-2">
                                <Input id={`worker-question-${notif.id}`} placeholder="Type your question..." />
                                <Button size="icon" onClick={() => {
                                    const input = document.getElementById(`worker-question-${notif.id}`) as HTMLInputElement;
                                    handleWorkerQuestion(notif.id, input.value);
                                }}>
                                    <Send className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recruiter" className="space-y-4">
           <Card>
            <CardHeader>
              <CardTitle>My Assignments</CardTitle>
              <CardDescription>
                Track worker confirmations and answer their questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {recruiterNotifs.map((notif) => (
                    <div key={notif.id} className="border-t pt-6 first:border-t-0 first:pt-0">
                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <p className="font-semibold">{notif.job}</p>
                                <p className="text-sm text-muted-foreground">Worker: {notif.worker}</p>
                            </div>
                            {notif.status === 'pending' && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Awaiting Confirmation</Badge>}
                            {notif.status === 'confirmed' && <Badge variant="secondary" className="bg-green-100 text-green-800">Confirmed by Worker</Badge>}
                            {notif.status === 'answered' && <Badge variant="secondary" className="bg-blue-100 text-blue-800">Answer Sent</Badge>}
                       </div>

                       {notif.type === 'question' && (
                           <div className="mt-4 space-y-4">
                                <div className="p-3 rounded-md bg-muted/50">
                                    <p className="text-sm font-semibold">Worker's Question:</p>
                                    <p className="text-sm text-muted-foreground italic">"{notif.question}"</p>
                                </div>
                                {notif.status !== 'answered' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor={`recruiter-answer-${notif.id}`} className="text-sm font-medium flex items-center gap-2">
                                            <Send className="h-4 w-4" /> Your Answer
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input id={`recruiter-answer-${notif.id}`} placeholder="Type your answer..."/>
                                            <Button size="icon" onClick={() => {
                                                const input = document.getElementById(`recruiter-answer-${notif.id}`) as HTMLInputElement;
                                                handleRecruiterAnswer(notif.id, input.value);
                                            }}>
                                                <Send className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 rounded-md bg-green-100/50 border border-green-200">
                                        <p className="text-sm font-semibold text-green-800">Your Answer:</p>
                                        <p className="text-sm text-green-700 italic">"{notif.answer}"</p>
                                    </div>
                                )}
                           </div>
                       )}
                    </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    