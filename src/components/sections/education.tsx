"use client";

import { SectionHeading } from "../shared/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { GraduationCap, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";


export default function Education() {
  const firestore = useFirestore();
  const educationCol = useMemoFirebase(() => firestore && query(collection(firestore, "education"), orderBy("date", "desc")), [firestore]);
  const { data: education, isLoading } = useCollection(educationCol);

  return (
    <section id="education" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Education"
          subtitle="My academic background."
          className="mb-12"
        />
        {isLoading && <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />}
        <div className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-border">
          {education?.map((item) => (
            <div key={item.id} className="relative mb-8 pl-8">
              <div className="absolute left-[-26px] top-1 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-headline">{item.degree}</CardTitle>
                  <p className="text-muted-foreground font-semibold">{item.institution} | {item.date}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{item.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
