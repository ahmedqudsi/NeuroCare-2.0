
import type { LucideIcon } from 'lucide-react';

export type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export type Exercise = {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  imageUrl?: string;
  imageHint?: string;
  videoUrl?: string;
};

export type Quote = {
  id: string;
  text: string;
  author: string;
};

export type Hospital = {
  id: string;
  name: string;
  address: string;
  phone: string;
  services: string[];
  imageUrl?: string;
  imageHint?: string;
};

export type FASTStep = {
  id: 'F' | 'A' | 'S' | 'T';
  title: string;
  description:string;
  checkItems: string[];
  details: string;
  icon?: LucideIcon;
};

export interface HealthcareService {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  cta: string;
}

export interface Nurse {
  id: string;
  name: string;
  specializations: string[];
  experienceYears: number;
  hourlyRate: number; // in INR or a common currency
  availability: string; // e.g., "Mon-Fri, 9am-5pm", "Weekends only"
  imageUrl?: string;
  imageHint?: string;
  bio?: string;
  verifiedLicense?: boolean;
}

export type NurseBookingFormData = {
  patientName: string;
  selectedNurseId: string;
  bookingDate: Date;
  bookingTime: string; // e.g., "10:00 AM - 12:00 PM"
  address: string;
  notes?: string;
};

// Types for Doctor Visits
export interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
  yearsOfExperience: number;
  languagesSpoken: string[];
  ratings: number; // e.g., 4.5
  verifiedLicense: boolean;
  profilePictureUrl: string;
  imageHint?: string;
  locationDescription: string; // e.g., "Serves Mehdipatnam and surrounding areas within a 5km radius"
  consultationFee: number; // in INR
  availability: string; // General availability, e.g., "Mon-Fri, 10am-5pm"
  bio?: string;

  // New fields for video consultation
  videoConsultationFee?: number;
  videoAvailabilitySlots?: string[]; // e.g., ["Mon 9am-10am", "Tue 2pm-3pm (Next Week)"]
}

export type DoctorBookingFormData = {
  patientName: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  symptoms: string;
  preferredDate: Date;
  preferredTime: string; // e.g., "10:00 AM"
  visitAddress: string;
};

// Types for Video Consultation
export type VideoConsultationBookingFormData = {
  patientName: string;
  selectedDoctorId: string;
  consultationType: string;
  preferredDate: Date;
  preferredTimeSlot: string;
  symptoms: string;
};

export type ConsultationType = {
  id: string;
  name: string;
  description?: string;
};

// Types for Pharma Delivery
export interface PharmacyProduct {
  id: string;
  productName: string;
  category: string; // e.g., Blood Thinners, Supplements, Pain Relief
  imageUrl: string;
  imageHint?: string;
  price: number; // in INR
  inStock: boolean;
  description: string;
  tags?: string[]; // e.g., stroke recovery, neuro meds
  prescriptionRequired?: boolean;
}

// Types for Lab Tests
export interface LabTestPackage {
  id: string;
  testName: string;
  testType: 'single' | 'package';
  description: string;
  recommendedFor?: string[]; // e.g., ['post-stroke', 'diabetes']
  price: number; // in INR
  fastingRequired: boolean;
  imageUrl?: string; // Optional image for the test/package
  imageHint?: string;
  includes?: string[]; // For packages, list of tests included
}

export type LabTestBookingFormData = {
  patientName: string;
  selectedTestIds: string[]; // Changed from selectedTestId: string
  preferredDate: Date;
  preferredTimeSlot: string;
  address: string;
  fastingConfirmed?: boolean; // If test requires fasting
  notes?: string;
};

