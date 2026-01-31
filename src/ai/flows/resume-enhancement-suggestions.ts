'use server';
/**
 * @fileOverview This file defines a Genkit flow for enhancing resume text with AI suggestions.
 *
 * The flow analyzes resume content and provides suggestions for improvement, such as keyword optimization
 * and rephrasing for better impact. It exports the `getResumeEnhancementSuggestions` function,
 * the `ResumeEnhancementInput` type, and the `ResumeEnhancementOutput` type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the resume enhancement flow
const ResumeEnhancementInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to be analyzed.'),
});
export type ResumeEnhancementInput = z.infer<typeof ResumeEnhancementInputSchema>;

// Define the output schema for the resume enhancement flow
const ResumeEnhancementOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('AI-powered suggestions for improving the resume, including keyword optimization and rephrasing.'),
});
export type ResumeEnhancementOutput = z.infer<typeof ResumeEnhancementOutputSchema>;

// Define the main function to get resume enhancement suggestions
export async function getResumeEnhancementSuggestions(
  input: ResumeEnhancementInput
): Promise<ResumeEnhancementOutput> {
  return resumeEnhancementFlow(input);
}

// Define the prompt for the AI to analyze the resume and provide suggestions
const resumeEnhancementPrompt = ai.definePrompt({
  name: 'resumeEnhancementPrompt',
  input: {schema: ResumeEnhancementInputSchema},
  output: {schema: ResumeEnhancementOutputSchema},
  prompt: `You are an AI resume expert. Analyze the following resume text and provide suggestions for improvement.

Consider optimizing keywords, rephrasing descriptions for maximum impact, and improving overall readability.

Resume Text:
{{{resumeText}}}`, // Use Handlebars to insert the resume text into the prompt
});

// Define the Genkit flow for resume enhancement
const resumeEnhancementFlow = ai.defineFlow(
  {
    name: 'resumeEnhancementFlow',
    inputSchema: ResumeEnhancementInputSchema,
    outputSchema: ResumeEnhancementOutputSchema,
  },
  async input => {
    const {output} = await resumeEnhancementPrompt(input);
    return output!;
  }
);

