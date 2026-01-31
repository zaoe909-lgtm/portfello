"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "../shared/section-heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { enhanceResume } from "@/app/actions";
import { Sparkles, Loader2, Lightbulb } from "lucide-react";
import { MarkdownRenderer } from "../blog/markdown-renderer";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Enhance My Resume
    </Button>
  );
}

export default function ResumeEnhancer() {
  const initialState = { suggestions: "", error: "" };
  const [state, formAction] = useActionState(enhanceResume, initialState);

  return (
    <section id="resume-enhancer" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="AI Resume Enhancer"
          subtitle="Paste a section of your resume below. Our AI will provide suggestions to improve its impact and keyword optimization."
          className="mb-12"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <Card>
            <CardContent className="pt-6">
              <form action={formAction} className="space-y-4">
                <Textarea
                  name="resumeText"
                  placeholder="Paste your resume experience section here... e.g., 'Developed and maintained a high-traffic e-commerce app using Flutter...'"
                  rows={12}
                  required
                />
                <SubmitButton />
              </form>
            </CardContent>
          </Card>
          
          <div className="h-full">
            {state.error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            {state.suggestions && (
              <Card className="h-full bg-accent/30 border-primary/50">
                <CardContent className="pt-6">
                   <div className="flex items-center text-primary font-bold mb-4">
                     <Lightbulb className="h-5 w-5 mr-2"/>
                     <h3 className="text-lg font-headline">AI Suggestions</h3>
                   </div>
                  <MarkdownRenderer content={state.suggestions} className="prose-sm"/>
                </CardContent>
              </Card>
            )}
            {!state.error && !state.suggestions && (
               <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4"/>
                  <p className="text-muted-foreground">Your AI-powered suggestions will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
