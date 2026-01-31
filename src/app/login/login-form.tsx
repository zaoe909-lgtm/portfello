"use client";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-provider";

function SubmitButton({ pending }: { pending: boolean }) {
  const { dictionary } = useLanguage();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <KeyRound className="mr-2 h-4 w-4" />
      )}
      {dictionary.login.buttonText}
    </Button>
  );
}

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { dictionary } = useLanguage();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (e: any) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          if (userCredential.user) {
            router.push('/admin');
          }
        } catch (creationError: any) {
          setError("Failed to automatically create admin user. This email may be taken if you've tried before with a different password.");
          console.error("Creation error:", creationError);
        }
      } else {
        switch (e.code) {
          case "auth/wrong-password":
            setError("Invalid email or password.");
            break;
          case "auth/invalid-email":
            setError("Please enter a valid email address.");
            break;
          default:
            setError("An unexpected error occurred. Please try again.");
            break;
        }
        console.error(e);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{dictionary.login.title}</CardTitle>
          <CardDescription>
            {dictionary.login.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{dictionary.login.passwordLabel}</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton pending={isPending} />
        </CardFooter>
      </Card>
    </form>
  );
}
