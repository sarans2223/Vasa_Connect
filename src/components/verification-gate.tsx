
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useVerification } from '@/hooks/use-verification';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { ShieldAlert } from 'lucide-react';

export function VerificationGate({ children }: { children: React.ReactNode }) {
  const { isVerified, isLoading } = useVerification();
  const router = useRouter();

  if (isLoading) {
    // You can render a skeleton or loader here
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 flex items-center justify-center h-full">
            <p>Loading verification status...</p>
        </div>
    );
  }

  if (!isVerified) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <ShieldAlert className="h-6 w-6 text-destructive" />
                Profile Verification Required
            </DialogTitle>
            <DialogDescription className="pt-4">
              To access this feature, you must first complete your profile verification by uploading your PAN and Aadhaar documents. This helps ensure a safe and secure community for everyone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
                onClick={() => router.push('/dashboard/profile')}
                className="w-full bg-gradient-to-r from-[#E0BBE4] to-[#957DAD] hover:opacity-90 text-primary-foreground"
            >
              Complete Profile Verification
            </Button>
          </DialogFooter>
        </DialogContent>
        {/* Render children behind the modal, but make them non-interactive */}
        <div className="opacity-25 pointer-events-none" aria-hidden="true">
            {children}
        </div>
      </Dialog>
    );
  }

  return <>{children}</>;
}
