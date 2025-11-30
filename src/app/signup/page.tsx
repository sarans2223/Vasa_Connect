
'use client';
// src/app/signup/page.tsx
import { AuthForm } from "@/components/auth-form";
import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import React from "react";

export default function SignupPage() {
    const { user, loading } = useUser();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading && user) {
        router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading || user) {
        return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <div>Loading...</div>
        </div>
        );
    }
  return (
      <AuthForm type="signup" />
  );
}
