"use client";

import { SectionHeading } from "../shared/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Briefcase, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";

export default function Experience() {
  const firestore = useFirestore();
  const experienceCol = useMemoFirebase(() => firestore && query(collection(firestore, "experience"), orderBy("order", "asc")), [firestore]);
  const { data: experience, isLoading } = useCollection(experienceCol);

  return (
    <section id="experience" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Work Experience"
          subtitle="My professional journey as a software developer."
          className="mb-12"
        />
        {isLoading && <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />}
        <div className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-border">
          {experience?.map((item, index) => (
            <div key={item.id} className="relative mb-8 pl-8">
              <div className="absolute left-[-26px] top-1 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Briefcase className="h-6 w-6" />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-headline">{item.position}</CardTitle>
                  <p className="text-muted-foreground font-semibold">{item.company} | {item.date}</p>
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
