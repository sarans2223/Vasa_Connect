'use server';

/**
 * @fileOverview An AI agent for suggesting team members based on skills and profiles.
 *
 * - suggestTeamMembers - A function that suggests team members.
 * - SuggestTeamMembersInput - The input type for the suggestTeamMembers function.
 * - SuggestTeamMembersOutput - The return type for the suggestTeamMembers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTeamMembersInputSchema = z.object({
  teamDescription: z
    .string()
    .describe('The description of the team and its goals.'),
  currentTeamMembers: z
    .array(z.string())
    .optional()
    .describe('The user IDs of the current team members, if any.'),
  numberOfSuggestions: z
    .number()
    .default(5)
    .describe('The number of team member suggestions to generate.'),
});
export type SuggestTeamMembersInput = z.infer<typeof SuggestTeamMembersInputSchema>;

const SuggestTeamMembersOutputSchema = z.object({
  suggestedUserIds: z
    .array(z.string())
    .describe('An array of user IDs that are suggested as team members.'),
});
export type SuggestTeamMembersOutput = z.infer<typeof SuggestTeamMembersOutputSchema>;

export async function suggestTeamMembers(input: SuggestTeamMembersInput): Promise<SuggestTeamMembersOutput> {
  return suggestTeamMembersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTeamMembersPrompt',
  input: {schema: SuggestTeamMembersInputSchema},
  output: {schema: SuggestTeamMembersOutputSchema},
  prompt: `You are a team building expert. You will suggest users to add to a team based on the team's description and the current team members.

Team Description: {{{teamDescription}}}

Current Team Members (if any): {{#if currentTeamMembers}}{{#each currentTeamMembers}}- {{{this}}}{{/each}}{{else}}None{{/if}}

You should suggest {{{numberOfSuggestions}}} user IDs that would be a good fit for the team.  Return only the user IDs, one user id per line.

Ensure each user ID corresponds to an existing user within the system; do not fabricate any user IDs.

Output the suggested user IDs:`,
});

const suggestTeamMembersFlow = ai.defineFlow(
  {
    name: 'suggestTeamMembersFlow',
    inputSchema: SuggestTeamMembersInputSchema,
    outputSchema: SuggestTeamMembersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Split the output by newlines to get the list of user IDs
    const suggestedUserIds = output!.suggestedUserIds;
    return {
      suggestedUserIds: suggestedUserIds,
    };
  }
);
