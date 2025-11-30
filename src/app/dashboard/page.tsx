
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, Bell, Users, ShieldAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SosButton } from "@/components/sos-button";
import { useVerification } from "@/hooks/use-verification";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const featureCards = [
  {
    title: "Find Your Next Job",
    description: "Search and apply for jobs that match your skills and preferences.",
    href: "/dashboard/jobs",
    icon: Briefcase,
    cta: "Search Jobs",
  },
  {
    title: "Grow Your Skills",
    description: "Access learning modules to enhance your knowledge and career.",
    href: "/dashboard/learning",
    icon: BookOpen,
    cta: "Start Learning",
  },
  {
    title: "Build Your Team",
    description: "Create or join a team to collaborate and grow together.",
    href: "/dashboard/teams",
    icon: Users,
    cta: "Manage Teams",
  },
  {
    title: "Notifications",
    description: "View job offers, confirmations, and messages.",
    href: "/dashboard/notifications",
    icon: Bell,
    cta: "View Notifications",
  },
];

export default function DashboardPage() {
  const [userName, setUserName] = useState('User');
  const { isVerified, isLoading } = useVerification();

  useEffect(() => {
    const handleStorageChange = () => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName.split(" ")[0]);
        }
    }
    
    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('local-storage', handleStorageChange);
    }
  }, []);

  const FeatureCard = ({ card, disabled }: { card: typeof featureCards[0], disabled: boolean }) => {
    const cardButton = (
      <Button asChild={!disabled} disabled={disabled} className="w-full sm:w-auto bg-gradient-to-r from-[#E0BBE4] to-[#957DAD] hover:opacity-90 text-primary-foreground">
        {disabled ? (
          <span>
            {card.cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        ) : (
          <Link href={card.href}>
            {card.cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        )}
      </Button>
    );

    return (
      <Card className="flex flex-col transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4">
          <card.icon className="h-10 w-10 text-accent" />
          <div className="space-y-1">
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="mt-auto">
          {disabled ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>{cardButton}</TooltipTrigger>
                <TooltipContent>
                  <p>Please verify your profile to access this feature.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            cardButton
          )}
        </CardContent>
      </Card>
    );
  }


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {userName}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your central hub for safety, growth, and opportunity.
        </p>
      </div>

       {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : !isVerified ? (
        <Card className="border-amber-500 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-amber-800">
              <ShieldAlert className="h-6 w-6" />
              Action Required: Verify Your Profile
            </CardTitle>
            <CardDescription className="text-amber-700">
              You must complete your profile verification to access all features, including posting and applying for jobs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/profile">
                Go to Verification
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Immediate Assistance</CardTitle>
            <CardDescription>
              If you are in danger, press the SOS button for immediate help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SosButton />
          </CardContent>
        </Card>
      )}


      <div className="grid gap-6 md:grid-cols-2">
        {featureCards.map((card) => (
          <FeatureCard key={card.title} card={card} disabled={!isVerified && !isLoading} />
        ))}
      </div>
    </div>
  );
}
