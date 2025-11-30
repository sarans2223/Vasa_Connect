
"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { KeyRound, Mail, User, Users, Eye, EyeOff } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/firebase/provider";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" {...props}>
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
        c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
        s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
        C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
        c-5.222,0-9.617-3.27-11.283-7.94l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238
        C42.418,34.569,44,29.692,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

type AuthFormProps = {
  type: "login" | "signup";
};

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [showForgot, setShowForgot] = useState(false);


  const handleAuthSuccess = (userCredential: any) => {
    const user = userCredential.user;
    localStorage.setItem("userName", user.displayName || name || "User");
    if (user.email) {
      localStorage.setItem("userEmail", user.email.toLowerCase());
    }
    router.push("/dashboard");
  };

  const handleAuthError = (error: any, context: string) => {
    console.error(`${context} Error:`, error);
    let description = "An unexpected error occurred. Please try again.";
    if (error.code) {
        switch(error.code) {
            case 'auth/email-already-in-use':
                description = "This email is already in use. Please log in or use a different email.";
                break;
            case 'auth/wrong-password':
                description = "The password you entered is incorrect. Please try again.";
                setShowForgot(true);
                break;
            case 'auth/user-not-found':
                description = "No account found with this email. Please sign up first.";
                break;
            case 'auth/weak-password':
                description = "Your password is too weak. It must be at least 6 characters long.";
                break;
            case 'auth/popup-closed-by-user':
                description = 'Google sign-in was cancelled. Please try again.';
                break;
            default:
                description = error.message;
        }
    }
    toast({
        title: `${context} Failed`,
        description,
        variant: "destructive",
    });
  }

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    // Simulate a user object
    const fakeUser = {
        displayName: "User",
        email: "user@example.com"
    };
    // Use a simplified success handler
    localStorage.setItem("userName", fakeUser.displayName);
    localStorage.setItem("userEmail", fakeUser.email);
    router.push("/dashboard");
  };


  const handleForgotPassword = () => {
    toast({
      title: "Forgot password",
      description:
        "In a real VaSa app, we would send a password reset link to your email.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowForgot(false);

    if (!email.includes('@')) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    
    if (type === "signup") {
      if (!name.trim()) {
        toast({ title: "Name required", description: "Please enter your full name.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (!agreeTerms) {
        toast({ title: "Agreement required", description: "You must accept the Terms & Privacy Policy to continue.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (!isAdult) {
        toast({ title: "Eligibility check", description: "Please confirm that you are 18+ or have guardian permission.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        handleAuthSuccess(userCredential);
      } catch (error) {
        handleAuthError(error, 'Sign Up');
      }

    } else { // type === 'login'
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            handleAuthSuccess(userCredential);
        } catch(error) {
            handleAuthError(error, 'Log In');
        }
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog>
      <div className="flex w-full min-h-screen items-center justify-center bg-background">
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#E0BBE4] via-[#957DAD] to-[#D291BC]">
                {type === "login"
                  ? "Welcome Back to VaSa"
                  : "Join the VaSa Community"}
              </CardTitle>
              <CardDescription>
                {type === "login"
                  ? "Enter your credentials to access your account."
                  : "Create an account to get started."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {type === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Savitri Bai"
                        required
                        minLength={2}
                        maxLength={50}
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="savitri@example.com"
                      required
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  {type === "signup" && (
                    <p className="text-xs text-muted-foreground">
                      Must be at least 6 characters.
                    </p>
                  )}
                  {type === "login" && showForgot && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="mt-1 text-xs text-accent underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                {type === "signup" && (
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <span>
                        I agree to VaSa's{" "}
                        <DialogTrigger asChild>
                          <span className="underline hover:text-accent cursor-pointer">
                            Terms and Privacy Policy
                          </span>
                        </DialogTrigger>
                        .
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={isAdult}
                        onChange={(e) => setIsAdult(e.target.checked)}
                      />
                      <span>
                        I am 18+ or have guardian permission to use this platform.
                      </span>
                    </label>
                  </div>
                )}

                <Button
                  disabled={isLoading || isGoogleLoading}
                  type="submit"
                  className="w-full font-semibold bg-gradient-to-r from-[#E0BBE4] to-[#957DAD] hover:opacity-90 transition-opacity text-primary-foreground"
                >
                  {isLoading
                    ? "Processing..."
                    : type === "login"
                    ? "Log In"
                    : "Create Account"}
                </Button>
              </form>

              <div className="my-6 flex items-center">
                <Separator className="flex-1" />
                <span className="mx-4 text-sm text-muted-foreground">
                  OR CONTINUE WITH
                </span>
                <Separator className="flex-1" />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
                  <GoogleIcon className="mr-2 h-5 w-5" />
                  {isGoogleLoading ? "Signing in..." : "Google"}
                </Button>
              </div>

              {type === "login" && (
                <>
                  <div className="my-6 flex items-center">
                    <Separator className="flex-1" />
                    <span className="mx-4 text-sm text-muted-foreground">OR</span>
                    <Separator className="flex-1" />
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => router.push("/onsite-login")}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Onsite Member Login
                  </Button>
                </>
              )}
            </CardContent>

            <CardFooter className="justify-center text-sm">
              {type === "login" ? (
                <p>
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-accent hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-accent hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Terms and Conditions</DialogTitle>
          <DialogDescription>
            Last updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[50vh] pr-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <h3 className="font-semibold text-foreground">1. Introduction</h3>
            <p>Welcome to VaSa. By using our application, you agree to these Terms and Conditions. If you disagree, you may not use the service.</p>

            <h3 className="font-semibold text-foreground">2. User Accounts</h3>
            <p>You must provide accurate and complete information when creating an account. You are responsible for safeguarding your password and for all activities that occur under your account.</p>

            <h3 className="font-semibold text-foreground">3. Content</h3>
            <p>You are responsible for any content you post, including its legality and appropriateness. By posting content, you grant us a license to use, modify, and distribute it in connection with the service.</p>
            
            <h3 className="font-semibold text-foreground">4. Prohibited Uses</h3>
            <p>You agree not to use the service for any unlawful purpose, to solicit others to perform or participate in any unlawful acts, or to harass, abuse, or harm another person.</p>

            <h3 className="font-semibold text-foreground">5. SOS Feature</h3>
            <p>The SOS feature is intended for genuine emergencies only. Misuse of this feature may result in suspension of your account. We are not liable for any delays or failures in the SOS system but will make a best effort to notify your emergency contacts.</p>

            <h3 className="font-semibold text-foreground">6. Termination</h3>
            <p>We may terminate or suspend your account at any time, without prior notice, for any reason, including a breach of these Terms.</p>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
