// src/ai/flows/dish-recommendation.ts
'use server';

/**
 * @fileOverview Recommends popular Nepali dishes based on time of day and customer order history.
 *
 * - getDishRecommendation - A function that returns a dish recommendation.
 * - DishRecommendationInput - The input type for the getDishRecommendation function.
 * - DishRecommendationOutput - The return type for the getDishRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DishRecommendationInputSchema = z.object({
  timeOfDay: z
    .string()
    .describe(
      'The time of day (e.g., morning, afternoon, evening, night).' /* Example: morning, afternoon, evening */
    ),
  orderHistory: z
    .string()
    .optional()
    .describe('A comma-separated list of the customer previous orders.'),
});

export type DishRecommendationInput = z.infer<typeof DishRecommendationInputSchema>;

const DishRecommendationOutputSchema = z.object({
  dishName: z.string().describe('The name of the recommended Nepali dish.'),
  description: z.string().describe('A brief description of the dish.'),
  reason: z.string().describe('The reason for recommending this dish based on the input.'),
});

export type DishRecommendationOutput = z.infer<typeof DishRecommendationOutputSchema>;

export async function getDishRecommendation(
  input: DishRecommendationInput
): Promise<DishRecommendationOutput> {
  return dishRecommendationFlow(input);
}

const dishRecommendationPrompt = ai.definePrompt({
  name: 'dishRecommendationPrompt',
  input: {
    schema: DishRecommendationInputSchema,
  },
  output: {schema: DishRecommendationOutputSchema},
  prompt: `You are a Nepali cuisine expert. Recommend a popular Nepali dish based on the time of day and the customer's order history.

Time of Day: {{{timeOfDay}}}
Order History: {{{orderHistory}}}

Consider the time of day and the customer's order history when making your recommendation. For example, in the morning, recommend breakfast items like "Sel Roti". If the customer has previously ordered dal bhat, suggest a variation or a complementary dish like "Chicken Curry".

Dish Recommendation:
Name: {{dishName}}
Description: {{description}}
Reason: {{reason}}`,
});

const dishRecommendationFlow = ai.defineFlow(
  {
    name: 'dishRecommendationFlow',
    inputSchema: DishRecommendationInputSchema,
    outputSchema: DishRecommendationOutputSchema,
  },
  async input => {
    const {output} = await dishRecommendationPrompt(input);
    return output!;
  }
);
