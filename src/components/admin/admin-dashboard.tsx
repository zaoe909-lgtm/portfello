
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useFirestore,
  useUser,
  useCollection,
  useDoc,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
  setDocumentNonBlocking
} from "@/firebase";
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { Edit, PlusCircle, Trash2, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

// Types for data entities
type PersonalInfo = z.infer<typeof personalInfoSchema>;
type Project = z.infer<typeof projectSchema> & { id: string, technologies?: string[] };
type Skill = z.infer<typeof skillSchema> & { id: string };
type Experience = z.infer<typeof experienceSchema> & { id: string };
type Education = z.infer<typeof educationSchema> & { id: string };
type Certification = z.infer<typeof certificationSchema> & { id: string };
type BlogPost = z.infer<typeof blogPostSchema> & { id: string, publicationDate?: string };
type Message = { id: string, name: string, email: string, message: string, submissionDate: any };

// Schemas for validation
const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  avatarHint: z.string().optional().or(z.literal('')),
});
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  githubLink: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  demoLink: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  playStoreLink: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  appStoreLink: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  technologies: z.string().optional(),
});
const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  proficiency: z.coerce.number().min(0).max(100),
});
const experienceSchema = z.object({
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  order: z.coerce.number().optional(),
});
const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});
const certificationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  url: z.string().url("Must be a valid URL"),
});
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and contain only letters, numbers, and hyphens"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  imageHint: z.string().optional(),
});

// --- DUMMY DATA FOR SEEDING ---
const dummyPersonalInfo = {
  name: 'Abdallah Essameldin',
  title: 'Senior Flutter Developer',
  summary: "Senior Flutter Developer with 5+ years of experience building high-quality, scalable, and user-focused mobile apps. Expert in Flutter, Dart, state management, and clean architecture. Strong team player with leadership, problem-solving, and collaboration skills. Proven track record in delivering projects on time, optimizing app performance, and enhancing user engagement.",
  phone: '+20 114 147 6814 | +20 106 831 5808',
  email: 'abdallah.esam.eldin@gmail.com',
  location: 'Asyut, Egypt – Open to Remote, Hybrid, or On-site Opportunities',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://www.linkedin.com/in/abdallah-essamelden',
  twitterUrl: 'https://twitter.com',
  avatarUrl: 'https://images.unsplash.com/photo-1591461283504-48919ae873f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwb3J0cmFpdCUyMHBlcnNvbnxlbnwwfHx8fDE3Njk3OTA0MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  avatarHint: 'portrait person',
};
const dummyProjects = [
  {
    title: 'Spring Rose',
    description: 'A high-performance Flutter app with 50k+ downloads across Google Play, App Store, and App Gallery. Features secure payment gateways (Tabby, Tamara, MyFatoorah) and deep integration with analytics platforms.',
    imageUrl: 'https://images.unsplash.com/photo-1621691187532-bbeb671757ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8YXBwJTIwc2NyZWVuc2hvdHxlbnwwfHx8fDE3Njk3OTE5ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    githubLink: '',
    demoLink: '',
    playStoreLink: 'https://play.google.com/store/apps',
    appStoreLink: 'https://apps.apple.com/app',
    technologies: ['Flutter', 'Firebase', 'AppsFlyer', 'Stripe', 'Dart'],
  },
  {
    title: 'Sputnik-1',
    description: 'A modular communication platform incorporating blockchain-based components for identity, verification, and secure data exchange. Features decentralized flows and real-time messaging.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjB1aXxlbnwwfHx8fDE3Njk3ODQ1MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    githubLink: '',
    demoLink: '',
    playStoreLink: '',
    appStoreLink: '',
    technologies: ['Flutter', 'Blockchain', 'Web3', 'Dart'],
  },
];
const dummySkills = [
  { name: 'Bloc (Cubit)', proficiency: 95 },
  { name: 'Provider', proficiency: 90 },
  { name: 'GetX', proficiency: 85 },
  { name: 'Clean Architecture', proficiency: 95 },
  { name: 'MVVM', proficiency: 90 },
  { name: 'Firebase', proficiency: 95 },
  { name: 'RESTful APIs', proficiency: 95 },
  { name: 'MyFatoorah / Stripe', proficiency: 90 },
  { name: 'AppsFlyer / WebEngage', proficiency: 85 },
  { name: 'Google Maps SDK', proficiency: 90 },
];
const dummyExperience = [
  {
    position: 'Flutter Developer',
    company: 'Digital Craft - Saudi Arabia - Remote',
    date: '6/2023 - Present',
    description: '• Developed and maintained Spring Rose, a high-performance Flutter app with 50k+ downloads, delivering a smooth user journey.\n• Implemented secure payment gateways including Tabby, Tamara, and MyFatoorah.\n• Integrated AppsFlyer, WebEngage, and Firebase Analytics for tracking and marketing insights.\n• Ensured app stability through memory optimization and efficient API handling.',
    order: 1,
  },
  {
    position: 'Flutter Developer',
    company: 'Esmativity - Egypt - On Site',
    date: '7/2021 - 2/2023',
    description: '• Engineered modular mobile features using layered architectures and DDD for long-term scaling.\n• Built resilient data flows that handle network failures and caching between remote and local storage.\n• Delivered production-ready monetization and subscription experiences.\n• Implemented map-driven and real-time location features optimized for performance.',
    order: 2,
  },
  {
    position: 'Flutter Developer',
    company: 'Adaptive Stone - Belarus - Remote',
    date: '2/2020 - 4/2021',
    description: '• Contributed to Sputnik-1, a modular communication platform with blockchain-based components.\n• Implemented decentralized feature flows for identity, verification, and secure data exchange.\n• Designed flexible UI modules for dynamically enabling blockchain-powered features.\n• Integrated smart-contract–driven logic ensuring synchronization with on-chain data.',
    order: 3,
  },
];
const dummyEducation = [
  {
    degree: 'Bachelor of Science in Computer and Information',
    institution: 'Assiut University, Egypt',
    date: '2015 - 2019',
    description: '',
  },
];
const dummyCertifications = [
  { name: 'Certified Flutter Developer', issuer: 'Google', date: '2021', url: 'https://google.com' },
  { name: 'Professional Cloud Developer', issuer: 'Google', date: '2022', url: 'https://google.com' },
];
const dummyBlogPosts = [
  {
    title: 'Mastering State Management in Flutter',
    slug: 'mastering-state-management-in-flutter',
    excerpt: 'A comprehensive guide to different state management approaches in Flutter, from Provider to BLoC. Learn the pros and cons of each to choose the best fit for your project.',
    content: 'State management is a critical concept in Flutter development... (full markdown content here)',
    imageUrl: 'https://images.unsplash.com/photo-1652696290920-ee4c836c711e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Y29kZSUyMHByb2dyYW1taW5nfGVufDB8fHx8MTc2OTgwMjgxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'code programming',
    publicationDate: new Date().toISOString(),
  },
  {
    title: 'A Deep Dive into Next.js 14 Features',
    slug: 'deep-dive-nextjs-14',
    excerpt: 'Explore the latest features in Next.js 14, including the App Router, Server Actions, and improved performance optimizations. See how they can revolutionize your web development workflow.',
    content: 'Next.js continues to push the boundaries of web development... (full markdown content here)',
    imageUrl: 'https://images.unsplash.com/photo-1568952433726-3896e3881c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHx0ZWNobm9sb2d5JTIwYWJzdHJhY3R8ZW58MHx8fHwxNzY5NzI2MDg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'technology abstract',
    publicationDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  },
];


export function AdminDashboard() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [hasSeeded, setHasSeeded] = useState(false);

  const personalInfoRef = useMemoFirebase(() => firestore && doc(firestore, "personalInfo", "main"), [firestore]);
  const { data: personalInfo, isLoading: loadingPersonalInfo } = useDoc(personalInfoRef);

  const projectsCol = useMemoFirebase(() => firestore && collection(firestore, "projects"), [firestore]);
  const { data: projects, isLoading: loadingProjects } = useCollection(projectsCol);

  const skillsCol = useMemoFirebase(() => firestore && collection(firestore, "skills"), [firestore]);
  const { data: skills, isLoading: loadingSkills } = useCollection(skillsCol);

  const experienceCol = useMemoFirebase(() => firestore && collection(firestore, "experience"), [firestore]);
  const { data: experience, isLoading: loadingExperience } = useCollection(experienceCol);

  const educationCol = useMemoFirebase(() => firestore && collection(firestore, "education"), [firestore]);
  const { data: education, isLoading: loadingEducation } = useCollection(educationCol);

  const certificationsCol = useMemoFirebase(() => firestore && collection(firestore, "certifications"), [firestore]);
  const { data: certifications, isLoading: loadingCerts } = useCollection(certificationsCol);

  const blogPostsCol = useMemoFirebase(() => firestore && collection(firestore, "blogPosts"), [firestore]);
  const { data: blogPosts, isLoading: loadingBlogPosts } = useCollection(blogPostsCol);

  const messagesCol = useMemoFirebase(() => firestore && collection(firestore, "contactFormEntries"), [firestore]);
  const { data: messages, isLoading: loadingMessages } = useCollection(messagesCol);

  const isLoading = loadingPersonalInfo || loadingProjects || loadingSkills || loadingExperience || loadingEducation || loadingCerts || loadingBlogPosts;

  const seedDatabase = useCallback(async (force = false) => {
    if (!firestore) return;
    let seededSomething = false;

    const seedCollection = async (data: any[] | undefined, collectionRef: any, seedData: any[], name: string) => {
      if (force || (data && data.length === 0)) {
        seededSomething = true;
        for (const item of seedData) {
          await addDocumentNonBlocking(collectionRef, { ...item, createdAt: serverTimestamp() });
        }
      }
    };

    if (force || !personalInfo) {
      seededSomething = true;
      const personalInfoDocRef = doc(firestore, "personalInfo", "main");
      await setDocumentNonBlocking(personalInfoDocRef, dummyPersonalInfo, { merge: true });
    }

    await seedCollection(projects ?? undefined, projectsCol, dummyProjects, 'Projects');
    await seedCollection(skills ?? undefined, skillsCol, dummySkills, 'Skills');
    await seedCollection(experience ?? undefined, experienceCol, dummyExperience, 'Experience');
    await seedCollection(education ?? undefined, educationCol, dummyEducation, 'Education');
    await seedCollection(certifications ?? undefined, certificationsCol, dummyCertifications, 'Certifications');
    await seedCollection(blogPosts ?? undefined, blogPostsCol, dummyBlogPosts, 'Blog Posts');

    if (seededSomething) {
      // Data updated quietly
    }
    if (!force) setHasSeeded(true);
  }, [
    firestore, personalInfo, projects, projectsCol, skills, skillsCol, experience, experienceCol,
    education, educationCol, certifications, certificationsCol, blogPosts, blogPostsCol, toast
  ]);

  useEffect(() => {
    if (isLoading || hasSeeded || !firestore) return;
    seedDatabase();
  }, [isLoading, hasSeeded, firestore, seedDatabase]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="personal-info">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="certifications">Certs</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal-info">
          <CrudUI
            title="Personal Information"
            data={personalInfo ? [personalInfo] : []}
            isLoading={loadingPersonalInfo}
            schema={personalInfoSchema}
            collectionRef={personalInfoRef}
            isSingleDoc={true}
            renderForm={({ form }: { form: any }) => (
              <>
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="summary" render={({ field }) => (<FormItem><FormLabel>Summary</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="githubUrl" render={({ field }) => (<FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="linkedinUrl" render={({ field }) => (<FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="twitterUrl" render={({ field }) => (<FormItem><FormLabel>Twitter URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="avatarUrl" render={({ field }) => (<FormItem><FormLabel>Profile Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="avatarHint" render={({ field }) => (<FormItem><FormLabel>Image AI Hint (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </>
            )}
          />
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <CrudUI<Project>
            title="Projects"
            data={projects ?? undefined}
            isLoading={loadingProjects}
            collectionRef={projectsCol}
            schema={projectSchema}
            renderTable={({ data, onEdit, onDelete }: { data: Project[] | undefined, onEdit: (item: Project) => void, onDelete: (id: string) => void }) => (
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{(Array.isArray(item.technologies) ? item.technologies : []).join(', ')}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => onEdit(item)}><Edit className="h-4 w-4" /></Button>
                      <DeleteButton onConfirm={() => onDelete(item.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
            renderForm={({ form }: { form: any }) => (
              <>
                <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="githubLink" render={({ field }) => (<FormItem><FormLabel>GitHub Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="demoLink" render={({ field }) => (<FormItem><FormLabel>Demo Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="playStoreLink" render={({ field }) => (<FormItem><FormLabel>Play Store Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="appStoreLink" render={({ field }) => (<FormItem><FormLabel>App Store Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="technologies" render={({ field }) => (<FormItem><FormLabel>Technologies (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </>
            )}
          />
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <CrudUI<Skill>
            title="Skills"
            data={skills ?? undefined}
            isLoading={loadingSkills}
            collectionRef={skillsCol}
            schema={skillSchema}
            renderTable={({ data, onEdit, onDelete }: { data: Skill[] | undefined, onEdit: (item: Skill) => void, onDelete: (id: string) => void }) => (
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.proficiency}%</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => onEdit(item)}><Edit className="h-4 w-4" /></Button>
                      <DeleteButton onConfirm={() => onDelete(item.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
            renderForm={({ form }: { form: any }) => (
              <>
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="proficiency" render={({ field }) => (<FormItem><FormLabel>Proficiency (0-100)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </>
            )}
          />
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience">
          <CrudUI<Experience>
            title="Work Experience"
            data={experience ?? undefined}
            isLoading={loadingExperience}
            collectionRef={experienceCol}
            schema={experienceSchema}
            renderTable={({ data, onEdit, onDelete }: { data: Experience[] | undefined, onEdit: (item: Experience) => void, onDelete: (id: string) => void }) => (
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.position} at {item.company}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => onEdit(item)}><Edit className="h-4 w-4" /></Button>
                      <DeleteButton onConfirm={() => onDelete(item.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
            renderForm={({ form }: { form: any }) => (
              <>
                <FormField control={form.control} name="position" render={({ field }) => (<FormItem><FormLabel>Position</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="company" render={({ field }) => (<FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="date" render={({ field }) => (<FormItem><FormLabel>Date Range</FormLabel><FormControl><Input {...field} placeholder="e.g., 2020 - Present" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="order" render={({ field }) => (<FormItem><FormLabel>Display Order (Lower = First)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
              </>
            )}
          />
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <CrudUI<Education>
            title="Education"
            data={education ?? undefined}
            isLoading={loadingEducation}
            collectionRef={educationCol}
            schema={educationSchema}
            renderTable={({ data, onEdit, onDelete }: { data: Education[] | undefined, onEdit: (item: Education) => void, onDelete: (id: string) => void }) => (
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.degree} from {item.institution}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => onEdit(item)}><Edit className="h-4 w-4" /></Button>
                      <DeleteButton onConfirm={() => onDelete(item.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
            renderForm={({ form }: { form: any }) => (
              <>
                <FormField control={form.control} name="degree" render={({ field }) => (<FormItem><FormLabel>Degree</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="institution" render={({ field }) => (<FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="date" render={({ field }) => (<FormItem><FormLabel>Date Range</FormLabel><FormControl><Input {...field} placeholder="e.g., 2014 - 2018" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
              </>
            )}
          />
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications">
          <CrudUI<Certification>
            title="Certifications"
            data={certifications ?? undefined}
            isLoading={loadingCerts}
            collectionRef={certificationsCol}
            schema={certificationSchema}
            renderTable={({ data, onEdit, onDelete }: { data: Certification[] | undefined, onEdit: (item: Certification) => void, onDelete: (id: string) => void }) => (
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name} by {item.issuer}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => onEdit(item)}><Edit className="h-4 w-4" /></Button>
                      <DeleteButton onConfirm={() => onDelete(item.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
            renderForm={({ form }: { form: any }) => (
              <>
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="issuer" render={({ field }) => (<FormItem><FormLabel>Issuer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="date" render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="url" render={({ field }) => (<FormItem><FormLabel>Credential URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </>
            )}
          />
        </TabsContent>

        {/* Blog Tab */}
        <TabsContent value="blog">
          <CrudUI<BlogPost>
            title="Blog Posts"
            data={blogPosts ?? undefined}
            isLoading={loadingBlogPosts}
            collectionRef={blogPostsCol}
            schema={blogPostSchema}
            renderTable={({ data, onEdit, onDelete }: { data: BlogPost[] | undefined, onEdit: (item: BlogPost) => void, onDelete: (id: string) => void }) => (
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.publicationDate ? new Date(item.publicationDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => onEdit(item)}><Edit className="h-4 w-4" /></Button>
                      <DeleteButton onConfirm={() => onDelete(item.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
            renderForm={({ form }: { form: any }) => (
              <>
                <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="excerpt" render={({ field }) => (<FormItem><FormLabel>Excerpt</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="content" render={({ field }) => (<FormItem><FormLabel>Content (Markdown)</FormLabel><FormControl><Textarea {...field} rows={10} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="imageHint" render={({ field }) => (<FormItem><FormLabel>Image Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </>
            )}
          />
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Contact Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMessages ? (<Loader2 className="animate-spin" />) : (
                <Table>
                  <TableHeader><TableRow><TableHead>From</TableHead><TableHead>Email</TableHead><TableHead>Message</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {messages?.map((msg: Message) => (
                      <TableRow key={msg.id}>
                        <TableCell>{msg.name}</TableCell>
                        <TableCell>{msg.email}</TableCell>
                        <TableCell className="max-w-xs truncate">{msg.message}</TableCell>
                        <TableCell>{msg.submissionDate ? new Date(msg.submissionDate.toDate()).toLocaleString() : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Generic CRUD UI Component
interface CrudUIProps<T> {
  title: string;
  data: T[] | undefined;
  isLoading: boolean;
  collectionRef: any;
  schema: any;
  renderTable?: (args: { data: T[] | undefined, onEdit: (item: T) => void, onDelete: (id: string) => void }) => React.ReactNode;
  renderForm: (args: { form: any, item?: T }) => React.ReactNode;
  isSingleDoc?: boolean;
}

function CrudUI<T extends { id: string, technologies?: string[] }>({ title, data, isLoading, collectionRef, schema, renderTable, renderForm, isSingleDoc = false }: CrudUIProps<T>) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  const defaultValues = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (schema?.shape) {
      Object.keys(schema.shape).forEach((key) => {
        defaults[key] = '';
      });
    }
    return defaults;
  }, [schema]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { formState: { isSubmitting }, reset } = form;

  useEffect(() => {
    const initialValues: Record<string, any> = {};
    const fields = Object.keys(schema.shape);

    let sourceData: any = null;
    if (isSingleDoc) {
      sourceData = data?.[0];
    } else if (editingItem) {
      sourceData = editingItem;
    }

    for (const key of fields) {
      initialValues[key] = sourceData?.[key] ?? '';
    }

    if (editingItem && editingItem.technologies && Array.isArray(editingItem.technologies)) {
      initialValues.technologies = editingItem.technologies.join(', ');
    }

    reset(initialValues);
  }, [isSingleDoc, data, editingItem, reset, schema]);


  const handleOpenDialog = (item: T | null = null) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const onSubmit = async (values: any) => {
    try {
      const dataToSave = { ...values };
      if (schema === projectSchema && values.technologies && typeof values.technologies === 'string') {
        dataToSave.technologies = values.technologies.split(',').map((t: string) => t.trim());
      }
      if (schema === blogPostSchema && !editingItem) {
        dataToSave.publicationDate = new Date().toISOString();
      }

      if (isSingleDoc) {
        await setDocumentNonBlocking(collectionRef, dataToSave, { merge: true });
        toast({ title: "Success!", description: "Personal information updated.", variant: "success", duration: 3000 });
      } else if (editingItem) {
        const itemRef = doc(firestore, collectionRef.path, editingItem.id);
        await updateDocumentNonBlocking(itemRef, dataToSave);
        toast({ title: "Success!", description: `${title.slice(0, -1)} updated.`, variant: "success", duration: 3000 });
      } else {
        await addDocumentNonBlocking(collectionRef, { ...dataToSave, createdAt: serverTimestamp() });
        toast({ title: "Success!", description: `${title.slice(0, -1)} added.`, variant: "success", duration: 3000 });
      }

      if (!isSingleDoc) handleCloseDialog();
    } catch (error) {
      console.error("Firestore operation failed", error);
      toast({ title: "Error", description: "An error occurred while saving.", variant: "destructive", duration: 5000 });
    }
  };

  const onDelete = (id: string) => {
    const itemRef = doc(firestore, collectionRef.path, id);
    deleteDocumentNonBlocking(itemRef);
  };

  if (isSingleDoc) {
    return (
      <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {isLoading ? <Loader2 className="animate-spin" /> : renderForm({ form, item: data?.[0] })}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />} Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-4 w-4" /> Add {title}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingItem ? "Edit" : "Add"} {title}</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                {renderForm({ form })}
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="animate-spin mr-2" />}
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader><TableRow><TableHead>{title}</TableHead><TableHead>Info</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            {isLoading ? <TableBody><TableRow><TableCell colSpan={3} className="text-center"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow></TableBody> : renderTable && renderTable({ data, onEdit: handleOpenDialog, onDelete })}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

