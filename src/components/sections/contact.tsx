
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "../shared/section-heading";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "../ui/label";
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { Phone, Mail, MapPin } from "lucide-react";
import { useDoc, useMemoFirebase, useFirestore, addDocumentNonBlocking } from "@/firebase";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Send className="mr-2 h-4 w-4" />
      )}
      Send Message
    </Button>
  );
}

export default function Contact() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isPending, setIsPending] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const personalInfoRef = useMemoFirebase(() => firestore && doc(firestore, "personalInfo", "main"), [firestore]);
  const { data: personalInfo } = useDoc(personalInfoRef);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) {
      toast({ title: "Error", description: "Database not available.", variant: "destructive", duration: 5000 });
      return;
    }

    setIsPending(true);

    try {
      const messagesCol = collection(firestore, "contactFormEntries");
      await addDocumentNonBlocking(messagesCol, {
        ...formState,
        submissionDate: serverTimestamp(),
      });

      toast({
        title: "Success!",
        description: "Thank you for your message! I'll get back to you soon.",
        variant: "success",
        duration: 3000,
      });
      setFormState({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Get in Touch"
          subtitle="Have a project in mind or just want to say hello? Fill out the form below, and I'll get back to you as soon as possible."
          className="mb-12"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold font-headline mb-6">Contact Information</h3>

            {personalInfo?.email && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <a href={`mailto:${personalInfo.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {personalInfo.email}
                  </a>
                </div>
              </div>
            )}

            {personalInfo?.phone && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Phone</p>
                  <p className="text-muted-foreground">{personalInfo.phone}</p>
                </div>
              </div>
            )}

            {personalInfo?.location && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Location</p>
                  <p className="text-muted-foreground">{personalInfo.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={formState.name} onChange={handleInputChange} placeholder="Your Name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={formState.email} onChange={handleInputChange} placeholder="Your Email" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" value={formState.message} onChange={handleInputChange} placeholder="Your Message" required rows={5} />
                  </div>
                  <SubmitButton pending={isPending} />
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
