"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, MessageCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useLanguage } from "@/context/language-provider";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export default function Hero() {
  const { dictionary } = useLanguage();
  const firestore = useFirestore();

  const personalInfoRef = useMemoFirebase(() => firestore && doc(firestore, "personalInfo", "main"), [firestore]);
  const { data: personalInfo, isLoading } = useDoc(personalInfoRef);

  if (isLoading) {
    return (
      <section id="home" className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        </div>
      </section>
    )
  }

  const name = personalInfo?.name || "Your Name";
  const title = personalInfo?.title || "Your Title";
  const summary = personalInfo?.summary || "Your professional summary.";
  const avatarUrl = personalInfo?.avatarUrl || `https://picsum.photos/seed/avatar/128/128`;
  const avatarHint = personalInfo?.avatarHint || `portrait person`;


  return (
    <section id="home" className="py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-primary shadow-lg">
            <AvatarImage src={avatarUrl} alt={name} data-ai-hint={avatarHint}/>
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>

        <h1 className="text-4xl md:text-6xl font-extrabold font-headline mb-4">
          <span className="text-primary">{name}</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          {title}
        </p>
        <p className="max-w-3xl mx-auto mb-10 text-lg text-foreground/80 leading-relaxed">
          {summary}
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button asChild size="lg">
            <Link href="#projects">
              {dictionary.hero.viewWork} <ArrowDown className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="#contact">
              {dictionary.hero.getInTouch} <MessageCircle className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
