
'use server';
/**
 * @fileOverview An AI flow to generate hospital images.
 *
 * - generateHospitalImage - A function that generates an image based on a prompt.
 * - GenerateHospitalImageInput - The input type for the generateHospitalImage function.
 * - GenerateHospitalImageOutput - The return type for the generateHospitalImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHospitalImageInputSchema = z.object({
  promptText: z.string().describe('A descriptive prompt to generate the hospital image, e.g., "A modern hospital building in Mumbai, daytime, photorealistic."'),
});
export type GenerateHospitalImageInput = z.infer<typeof GenerateHospitalImageInputSchema>;

const GenerateHospitalImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI (e.g., 'data:image/png;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=')."),
});
export type GenerateHospitalImageOutput = z.infer<typeof GenerateHospitalImageOutputSchema>;

export async function generateHospitalImage(input: GenerateHospitalImageInput): Promise<GenerateHospitalImageOutput> {
  return generateHospitalImageFlow(input);
}

const generateHospitalImageFlow = ai.defineFlow(
  {
    name: 'generateHospitalImageFlow',
    inputSchema: GenerateHospitalImageInputSchema,
    outputSchema: GenerateHospitalImageOutputSchema,
  },
  async (input) => {
    console.log(`Generating image with prompt: ${input.promptText}`);
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // Specific model for image generation
        prompt: input.promptText,
        config: {
          responseModalities: ['IMAGE'], // Request only IMAGE modality
        },
      });

      if (!media || !media.url) {
        throw new Error('Image generation failed or returned no media URL.');
      }
      console.log('Image generated successfully:', media.url.substring(0, 50) + "..."); // Log a snippet

      return { imageDataUri: media.url };
    } catch (error) {
      console.error('Error generating image:', error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }
);
