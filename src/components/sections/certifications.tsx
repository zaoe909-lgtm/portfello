"use client";

import { SectionHeading } from "../shared/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Award, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";

export default function Certifications() {
  const firestore = useFirestore();
  const certsCol = useMemoFirebase(() => firestore && query(collection(firestore, "certifications"), orderBy("date", "desc")), [firestore]);
  const { data: certifications, isLoading } = useCollection(certsCol);

  return (
    <section id="certifications" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Certifications"
          subtitle="My professional certifications."
          className="mb-12"
        />
        {isLoading && <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certifications?.map((cert) => (
            <Card key={cert.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <Award className="h-10 w-10 text-primary" />
                <div>
                  <CardTitle className="text-xl font-headline">{cert.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{cert.issuer} - {cert.date}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex items-end justify-end">
                <Button asChild variant="link">
                  <Link href={cert.url} target="_blank" rel="noopener noreferrer">
                    View Credential <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
