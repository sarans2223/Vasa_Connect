
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, FileQuestion, ArrowRight, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockUser } from '@/lib/data';
import Link from 'next/link';

const skillsToLearn = [
  { id: 'skill-1', title: 'Professional Cooking', description: 'Master culinary fundamentals, from knife skills to advanced sauce making.' },
  { id: 'skill-2', title: 'Digital Marketing', description: 'Learn SEO, SEM, and social media strategies to boost online presence.' },
  { id: 'skill-3', title: 'Advanced Tailoring', description: 'Go beyond basics with pattern making and complex garment construction.' },
  { id: 'skill-4', title: 'Financial Literacy for Small Business', description: 'Understand budgeting, cash flow, and how to secure funding.' },
  { id: 'skill-5', title: 'Customer Service Excellence', description: 'Develop communication skills to provide outstanding customer support.' },
  { id: 'skill-6', title: 'Event Planning & Management', description: 'Learn to organize and execute flawless events from start to finish.' },
  { id: 'skill-7', title: 'Basic Computer Skills', description: 'Grasp the essentials of using computers, including email and Microsoft Office.' },
  { id: 'skill-8', title: 'Handicrafts & Artisan Skills', description: 'Monetize your creative talents by learning to produce and sell handmade goods.' },
];

export default function LearningPage() {
  const { toast } = useToast();
  const [user] = useState(mockUser);
  const isPremium = user.membership === 'Bloom' || user.membership === 'Empower';

  const handlePremiumCheck = (action: string, skill: string) => {
    if (isPremium) {
      toast({
        title: 'Feature Unlocked!',
        description: `You have access to ${action} for ${skill} as a premium member.`,
      });
      // In a real app, you would navigate to the learning/testing page.
    } else {
      toast({
        title: 'Upgrade Required',
        description: `Please upgrade to a premium membership to ${action.toLowerCase()} for ${skill}.`,
        action: (
          <Button asChild>
            <Link href="/dashboard/membership">Upgrade Now</Link>
          </Button>
        ),
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Learning & Certification Hub</h1>
      </div>
      <p className="text-muted-foreground max-w-2xl">
        Empower yourself with new skills. Learn, take tests, and get certified to stand out.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skillsToLearn.map((skill) => (
          <Card key={skill.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{skill.title}</CardTitle>
              <CardDescription>{skill.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end space-y-2">
              <Button 
                variant="outline"
                onClick={() => handlePremiumCheck('Learn Skill', skill.title)}
              >
                <BookOpen className="mr-2 h-4 w-4" /> Learn Skill
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePremiumCheck('Take Test', skill.title)}
              >
                <FileQuestion className="mr-2 h-4 w-4" /> Take Test
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#E0BBE4] to-[#957DAD] hover:opacity-90 text-primary-foreground"
                onClick={() => handlePremiumCheck('Get Certified', skill.title)}
              >
                <Award className="mr-2 h-4 w-4" /> Get Certified
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
