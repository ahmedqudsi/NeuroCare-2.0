
"use client";

import { useState, useEffect } from 'react';
import type { LabTestPackage } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Beaker, Search } from 'lucide-react';
import { LabTestPackageCard } from '@/components/features/healthcare-services/lab-tests/LabTestPackageCard';
import { LabTestBookingForm } from '@/components/features/healthcare-services/lab-tests/LabTestBookingForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { sampleLabTestPackages } from '@/lib/constants'; // Import sample data

export default function LabTestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // Initialize with sample data
  const [allPackages, setAllPackages] = useState<LabTestPackage[]>(sampleLabTestPackages);
  const [filteredPackages, setFilteredPackages] = useState<LabTestPackage[]>(sampleLabTestPackages);

  const pageStaticText = {
    mainTitle: 'At-Home Blood Test Booking',
    mainDescription: 'Schedule lab tests and health packages with sample collection from the comfort of your home.',
    backButtonText: 'Back to Healthcare Services',
    availableTestsTitle: 'Available Tests & Packages',
    bookingFormTitle: 'Book Your At-Home Test',
    searchPlaceholder: 'Search tests or packages...',
    noResults: 'No tests or packages found matching your search.',
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') {
      setFilteredPackages(allPackages);
    } else {
      setFilteredPackages(
        allPackages.filter(
          (pkg) =>
            pkg.testName.toLowerCase().includes(term) ||
            pkg.description.toLowerCase().includes(term) ||
            (pkg.includes && pkg.includes.some(inc => inc.toLowerCase().includes(term))) ||
            (pkg.recommendedFor && pkg.recommendedFor.some(rec => rec.toLowerCase().includes(term)))
        )
      );
    }
  };

  return (
    <div className="space-y-10">
      <div className="animate-in fade-in slide-in-from-top-8 duration-700">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center">
          <Beaker className="mr-3 h-8 w-8 text-primary" />
          {pageStaticText.mainTitle}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {pageStaticText.mainDescription}
        </p>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/healthcare-services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {pageStaticText.backButtonText}
            </Link>
          </Button>
        </div>
      </div>

      <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <h2 className="text-2xl font-semibold text-foreground">{pageStaticText.availableTestsTitle}</h2>
        <div className="relative">
          <Input
            type="text"
            placeholder={pageStaticText.searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 py-2 shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        </div>
        <div className="flex space-x-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => {
            setFilteredPackages(allPackages.filter(pkg => pkg.fastingRequired));
          }}>Fasting</Button>
          <Button variant="outline" size="sm" onClick={() => {
            setFilteredPackages(allPackages.filter(pkg => !pkg.fastingRequired));
          }}>Non-Fasting</Button>
          <select className="border rounded px-2 py-1" onChange={(e) => {
            const budget = e.target.value;
            if (budget === "0-500") {
              setFilteredPackages(allPackages.filter(pkg => pkg.price >= 0 && pkg.price <= 500));
            } else if (budget === "500-1000") {
              setFilteredPackages(allPackages.filter(pkg => pkg.price > 500 && pkg.price <= 1000));
            } else if (budget === "1000-2500") {
              setFilteredPackages(allPackages.filter(pkg => pkg.price > 1000 && pkg.price <= 2500));
            } else if (budget === "2500-5000") {
                setFilteredPackages(allPackages.filter(pkg => pkg.price > 2500 && pkg.price <= 5000));
            }
             else {
              setFilteredPackages(allPackages);
            }
          }}>
            <option value="">Budget</option>
            <option value="0-500">₹0 - ₹500</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="1000-2500">₹1000 - ₹2500</option>
            <option value="2500-5000">₹2500 - ₹5000</option>
          </select>
        </div>
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPackages.map((pkg) => (
              <LabTestPackageCard key={pkg.id} testPackage={pkg} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">{pageStaticText.noResults}</p>
        )}
      </section>

      <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
        <h2 className="text-2xl font-semibold text-foreground">{pageStaticText.bookingFormTitle}</h2>
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {/* Pass allPackages (which is sampleLabTestPackages) to the form */}
            <LabTestBookingForm testPackages={allPackages} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
