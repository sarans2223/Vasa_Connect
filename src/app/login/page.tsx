
'use client';
// src/app/login/page.tsx
import React from "react";
import { AuthForm } from "@/components/auth-form";
import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
    <main>
      <AuthForm type="login" />
    </main>
  );
}
