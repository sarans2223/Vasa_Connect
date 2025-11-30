'use server';
/**
 * @fileOverview An AI agent for suggesting teams for a user to join based on their skills.
 *
 * - suggestTeamsForUser - A function that suggests teams for a user.
 * - SuggestTeamsForUserInput - The input type for the suggestTeamsForUser function.
 * - SuggestTeamsForUserOutput - The return type for the suggestTeamsForUser function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTeamsForUserInputSchema = z.object({
  userSkills: z
    .array(z.string())
    .describe('A list of skills the user possesses.'),
  allTeams: z.array(z.object({
    name: z.string().describe('The name of the team.'),
    description: z.string().describe('A description of the team and its purpose.'),
    memberCount: z.number().describe('The number of members in the team.')
  })).describe('A list of all available teams.'),
  numberOfSuggestions: z
    .number()
    .default(3)
    .describe('The number of team suggestions to generate.'),
});
export type SuggestTeamsForUserInput = z.infer<typeof SuggestTeamsForUserInputSchema>;

const SuggestTeamsForUserOutputSchema = z.object({
  suggestedTeams: z.array(z.object({
    name: z.string().describe('The name of the suggested team.'),
    description: z.string().describe('The description of the team.'),
    memberCount: z.number().describe('The number of members in the team.'),
    reason: z.string().describe('A brief reason why this team is a good match for the user.'),
  })).describe('An array of teams that are suggested for the user to join.'),
});
export type SuggestTeamsForUserOutput = z.infer<typeof SuggestTeamsForUserOutputSchema>;

export async function suggestTeamsForUser(input: SuggestTeamsForUserInput): Promise<SuggestTeamsForUserOutput> {
  return suggestTeamsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTeamsForUserPrompt',
  input: {schema: SuggestTeamsForUserInputSchema},
  output: {schema: SuggestTeamsForUserOutputSchema},
  prompt: `You are a community-building expert. You will suggest teams for a user to join based on their skills and the available teams.

User's Skills:
{{#each userSkills}}- {{{this}}}{{/each}}

Available Teams:
{{#each allTeams}}
- Name: {{{this.name}}}
  Description: {{{this.description}}}
  Members: {{{this.memberCount}}}
{{/each}}

Analyze the user's skills and suggest {{{numberOfSuggestions}}} teams from the available list that would be a good fit. For each suggestion, provide a short reason why it's a good match.
Do not suggest teams the user is likely already a part of based on the description. Focus on new opportunities.`,
});

const suggestTeamsFlow = ai.defineFlow(
  {
    name: 'suggestTeamsFlow',
    inputSchema: SuggestTeamsForUserInputSchema,
    outputSchema: SuggestTeamsForUserOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);