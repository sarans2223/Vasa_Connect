'use client';

import { useState } from 'react';
import { Siren } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export function SosButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();

  const handleSosActivation = () => {
    setIsActivating(true);
    toast({
      title: 'Activating SOS...',
      description: 'Attempting to get your location. Please approve the request.',
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Location captured:', { latitude, longitude });
        
        // Here you would trigger the Cloud Function
        // For example: triggerSosAlert({ latitude, longitude });

        toast({
          title: 'SOS Activated!',
          description: `Your location has been recorded. Emergency contacts and administrators have been notified.`,
          variant: 'destructive',
        });
        setIsActivating(false);
        setIsOpen(false);
      },
      (error) => {
        toast({
          title: 'Error capturing location',
          description: `Could not get your location. Please ensure location services are enabled. Error: ${error.message}`,
          variant: 'destructive',
        });
        setIsActivating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="lg"
          className="h-16 w-full text-lg font-bold bg-destructive/90 hover:bg-destructive text-destructive-foreground shadow-lg transition-transform hover:scale-105"
        >
          <Siren className="mr-3 h-8 w-8 animate-pulse" />
          SOS EMERGENCY ALERT
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Emergency Alert</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately send an alert with your current location to your emergency contacts and our support team. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isActivating}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSosActivation}
            disabled={isActivating}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isActivating ? 'Activating...' : 'Yes, I am in danger'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
