
"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Helper function to format card number for display
const formatCardNumberDisplay = (rawValue: string = ""): string => {
  const cleaned = rawValue.replace(/\D/g, ''); // Remove non-digits
  const parts = [];
  for (let i = 0; i < cleaned.length; i += 4) {
    parts.push(cleaned.substring(i, i + 4));
  }
  return parts.join('-').substring(0, 19); // Ensures format like XXXX-XXXX-XXXX-XXXX (max 16 digits)
};

export function PaymentDetailsForm() {
  const { control } = useFormContext(); // Get control from FormProvider in CheckoutPage

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="cardholderName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cardholder Name</FormLabel>
            <FormControl>
              <Input placeholder="Name as on card" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="cardNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Card Number</FormLabel>
            <FormControl>
              <Input
                type="text" // Use text to allow visual hyphens
                inputMode="numeric"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                {...field} // field.value here will be raw digits
                value={formatCardNumberDisplay(field.value || '')} // Display formatted value
                onChange={(e) => {
                  const userInput = e.target.value;
                  // Remove all non-digits for storing in form state
                  const rawDigits = userInput.replace(/\D/g, '');
                  // Store raw digits, limiting to 16 for common card types
                  field.onChange(rawDigits.substring(0, 16));
                }}
                maxLength={19} // Max visual length for XXXX-XXXX-XXXX-XXXX
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input placeholder="MM/YY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="cvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CVV</FormLabel>
              <FormControl>
                <Input type="password" inputMode="numeric" placeholder="XXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
