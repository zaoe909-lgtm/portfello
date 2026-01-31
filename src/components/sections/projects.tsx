"use client";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeading } from "../shared/section-heading";
import { Github, Globe, Loader2, Apple, Play } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export default function Projects() {
  const firestore = useFirestore();
  const projectsCol = useMemoFirebase(() => firestore && collection(firestore, "projects"), [firestore]);
  const { data: projects, isLoading } = useCollection(projectsCol);

  return (
    <section id="projects" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Featured Projects"
          subtitle="A selection of my work. I'm passionate about building scalable, user-friendly, and beautiful mobile applications."
          className="mb-12"
        />
        {isLoading && <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects?.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <CardHeader className="p-0">
                <div className="aspect-video relative">
                  <Image
                    src={project.imageUrl || `https://picsum.photos/seed/${project.id}/600/400`}
                    alt={project.title}
                    fill
                    className="object-cover"
                    data-ai-hint="project app screenshot"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-6 flex-grow">
                <CardTitle className="mb-2 font-headline">{project.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.map((tag: string) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-end gap-2">
                {project.githubLink && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> GitHub
                    </Link>
                  </Button>
                )}
                {project.demoLink && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={project.demoLink} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" /> Demo
                    </Link>
                  </Button>
                )}
                {project.playStoreLink && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={project.playStoreLink} target="_blank" rel="noopener noreferrer">
                      <Play className="mr-2 h-4 w-4" /> Play Store
                    </Link>
                  </Button>
                )}
                {project.appStoreLink && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={project.appStoreLink} target="_blank" rel="noopener noreferrer">
                      <Apple className="mr-2 h-4 w-4" /> App Store
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
