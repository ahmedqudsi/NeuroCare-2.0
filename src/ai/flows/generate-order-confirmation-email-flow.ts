
'use server';
/**
 * @fileOverview Generates content for an order confirmation email.
 *
 * - generateOrderConfirmationEmail - Generates subject and HTML body for an order confirmation email.
 * - OrderConfirmationEmailInput - Input type for the email generation flow.
 * - OrderConfirmationEmailOutput - Output type for the email generation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OrderItemSchema = z.object({
  name: z.string().describe('Name of the product.'),
  quantity: z.number().describe('Quantity of the product ordered.'),
});

const ShippingAddressSchema = z.object({
  fullName: z.string(),
  streetAddress: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
});

// Removed export from schema constant
const OrderConfirmationEmailInputSchema = z.object({
  orderId: z.string().describe('The unique ID of the order.'),
  items: z.array(OrderItemSchema).describe('A list of items in the order.'),
  total: z.string().describe('The total amount of the order (e.g., "₹1250.00").'),
  shippingAddress: ShippingAddressSchema.describe('The shipping address for the order.'),
  userEmail: z.string().email().describe('The email address of the customer.'),
  customerName: z.string().describe('The full name of the customer.'),
  appBaseUrl: z.string().url().describe('The base URL of the application for link generation (e.g., https://your-app.com).'),
});
export type OrderConfirmationEmailInput = z.infer<typeof OrderConfirmationEmailInputSchema>;

// Removed export from schema constant
const OrderConfirmationEmailOutputSchema = z.object({
  subject: z.string().describe('The subject line for the email.'),
  htmlBody: z.string().describe('The HTML content of the email body.'),
});
export type OrderConfirmationEmailOutput = z.infer<typeof OrderConfirmationEmailOutputSchema>;

export async function generateOrderConfirmationEmail(input: OrderConfirmationEmailInput): Promise<OrderConfirmationEmailOutput> {
  return generateOrderConfirmationEmailFlow(input);
}

const emailPrompt = ai.definePrompt({
  name: 'orderConfirmationEmailPrompt',
  input: { schema: OrderConfirmationEmailInputSchema },
  output: { schema: OrderConfirmationEmailOutputSchema },
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `
    You are an expert at writing friendly and professional order confirmation emails for an online pharmacy called "NeuroCare".
    The customer's name is {{{customerName}}} and their email is {{{userEmail}}}.
    The order ID is {{{orderId}}}.
    The total amount is {{{total}}}.

    The items ordered are:
    {{#each items}}
    - {{name}} (Quantity: {{quantity}})
    {{/each}}

    The shipping address is:
    {{{shippingAddress.fullName}}}
    {{{shippingAddress.streetAddress}}}
    {{{shippingAddress.city}}}, {{{shippingAddress.state}}} - {{{shippingAddress.pincode}}}

    Generate an HTML email with the following components:
    1. A clear subject line like "Your NeuroCare Order #{{{orderId}}} is Confirmed!"
    2. A friendly greeting to {{{customerName}}}.
    3. Confirmation that their order has been received and is being processed.
    4. A summary of the order details: Order ID, Items, Total Amount, Shipping Address.
    5. A prominent link or button to track the order. The link should be: {{{appBaseUrl}}}/order-status?orderId={{{orderId}}}
       Label this link/button clearly, for example: "Track Your Order".
    6. A closing thank you message.
    7. Style the email to be clean, readable, and professional. Use simple HTML tags. Do not include CSS in a <style> tag; use inline styles if necessary for basic formatting like bolding or simple spacing, but keep it minimal.

    Ensure the output is valid JSON matching the OrderConfirmationEmailOutputSchema.
    The htmlBody should be a single string containing the entire HTML for the email.
  `,
});

const generateOrderConfirmationEmailFlow = ai.defineFlow(
  {
    name: 'generateOrderConfirmationEmailFlow',
    inputSchema: OrderConfirmationEmailInputSchema,
    outputSchema: OrderConfirmationEmailOutputSchema,
  },
  async (input) => {
    const { output } = await emailPrompt(input);
    if (!output) {
      throw new Error('Failed to generate email content.');
    }
    return output;
  }
);
