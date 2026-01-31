"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Github, Linkedin, Twitter, Code, Loader2 } from "lucide-react";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export default function Footer() {
  const firestore = useFirestore();
  const personalInfoRef = useMemoFirebase(() => firestore && doc(firestore, "personalInfo", "main"), [firestore]);
  const { data: personalInfo, isLoading } = useDoc(personalInfoRef);

  const socials = [
    { name: "GitHub", url: personalInfo?.githubUrl || '#', icon: Github },
    { name: "LinkedIn", url: personalInfo?.linkedinUrl || '#', icon: Linkedin },
    { name: "Twitter", url: personalInfo?.twitterUrl || '#', icon: Twitter },
  ];

  const name = personalInfo?.name || "Your Name";

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">FlutterFolio Pro</span>
          </div>
          <div className="flex gap-2">
            {isLoading ? <Loader2 className="animate-spin"/> : (
              socials.map((social) => (
                social.url &&
                <Button key={social.name} asChild variant="ghost" size="icon">
                  <Link href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                    <social.icon className="h-5 w-5" />
                  </Link>
                </Button>
              ))
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {isLoading ? <Loader2 className="h-4 w-4 animate-spin inline-block"/> : name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
