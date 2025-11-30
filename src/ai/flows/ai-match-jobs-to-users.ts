'use server';
/**
 * @fileOverview An AI-powered job matching flow that suggests relevant job postings to users based on their profiles and skills.
 *
 * - matchJobsToUsers - A function that takes a user profile and returns a list of matching job postings.
 * - MatchJobsToUsersInput - The input type for the matchJobsToUsers function.
 * - MatchJobsToUsersOutput - The return type for the matchJobsToUsers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const MatchJobsToUsersInputSchema = z.object({
  userProfile: z.object({
    skills: z.array(z.string()).describe('List of skills possessed by the user'),
    experience: z.string().describe('Description of the user experience'),
    desiredJobType: z.string().describe('The job type the user is seeking (e.g., full-time, part-time, contract)'),
    locationPreferences: z.string().describe('The location preferences of the user'),
    industryPreferences: z.array(z.string()).describe('The industry preferences of the user'),
  }).describe('The user profile containing skills, experience, and preferences'),
  jobPostings: z.array(z.object({
    title: z.string().describe('The job title'),
    description: z.string().describe('The job description'),
    skillsRequired: z.array(z.string()).describe('List of skills required for the job'),
    jobType: z.string().describe('The job type (e.g., full-time, part-time, contract)'),
    location: z.string().describe('The job location'),
    industry: z.string().describe('The industry of the job'),
  })).describe('A list of available job postings'),
});
export type MatchJobsToUsersInput = z.infer<typeof MatchJobsToUsersInputSchema>;

// Define the output schema
const MatchJobsToUsersOutputSchema = z.array(z.object({
  jobTitle: z.string().describe('The title of the matched job posting'),
  relevanceScore: z.number().describe('A score indicating the relevance of the job posting to the user (0-1)'),
  jobDescription: z.string().describe('The job description of the matched job'),
})).describe('A list of job postings matched to the user, with a relevance score for each job');
export type MatchJobsToUsersOutput = z.infer<typeof MatchJobsToUsersOutputSchema>;

// Exported function to match jobs to users
export async function matchJobsToUsers(input: MatchJobsToUsersInput): Promise<MatchJobsToUsersOutput> {
  return matchJobsToUsersFlow(input);
}

// Define the prompt
const matchJobsToUsersPrompt = ai.definePrompt({
  name: 'matchJobsToUsersPrompt',
  input: {schema: MatchJobsToUsersInputSchema},
  output: {schema: MatchJobsToUsersOutputSchema},
  prompt: `You are an AI-powered job matching expert. Given a user profile and a list of job postings, your task is to identify the most relevant job opportunities for the user.

User Profile:
Skills: {{userProfile.skills}}
Experience: {{userProfile.experience}}
Desired Job Type: {{userProfile.desiredJobType}}
Location Preferences: {{userProfile.locationPreferences}}
Industry Preferences: {{userProfile.industryPreferences}}

Job Postings:
{{#each jobPostings}}
Title: {{this.title}}
Description: {{this.description}}
Skills Required: {{this.skillsRequired}}
Job Type: {{this.jobType}}
Location: {{this.location}}
Industry: {{this.industry}}
---
{{/each}}

Analyze the user profile and each job posting. Determine a relevance score (0-1) for each job posting based on how well it matches the user's skills, experience, desired job type, location preferences and industry preferences.

Return a list of job postings matched to the user, with a relevance score for each job and the job description.
`,
});

// Define the flow
const matchJobsToUsersFlow = ai.defineFlow(
  {
    name: 'matchJobsToUsersFlow',
    inputSchema: MatchJobsToUsersInputSchema,
    outputSchema: MatchJobsToUsersOutputSchema,
  },
  async input => {
    const {output} = await matchJobsToUsersPrompt(input);
    return output!;
  }
);

