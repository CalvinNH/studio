'use server';
/**
 * @fileOverview A motivational quote generator for time management, focus, and structure.
 *
 * - generateMotivationalQuote - A function that generates a motivational quote.
 * - MotivationalQuoteInput - The input type for the generateMotivationalQuote function.
 * - MotivationalQuoteOutput - The return type for the generateMotivationalQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalQuoteInputSchema = z.object({
  topic: z
    .string()    
    .describe("The topic of the quote, which could be time management, focus, or structure."),
});
export type MotivationalQuoteInput = z.infer<typeof MotivationalQuoteInputSchema>;

const MotivationalQuoteOutputSchema = z.object({
  quote: z.string().describe('The motivational quote.'),
  author: z.string().describe('The author of the quote.'),
});
export type MotivationalQuoteOutput = z.infer<typeof MotivationalQuoteOutputSchema>;

export async function generateMotivationalQuote(input: MotivationalQuoteInput): Promise<MotivationalQuoteOutput> {
  return generateMotivationalQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalQuotePrompt',
  input: {schema: MotivationalQuoteInputSchema},
  output: {schema: MotivationalQuoteOutputSchema},
  prompt: `You are a motivational quote generator. Generate a quote related to {{topic}} from a famous person.

Ensure the quote focuses on the value of time, importance of focus, and effectiveness of structure in life.

Quote:`,  
});

const generateMotivationalQuoteFlow = ai.defineFlow(
  {
    name: 'generateMotivationalQuoteFlow',
    inputSchema: MotivationalQuoteInputSchema,
    outputSchema: MotivationalQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
