"use client";

import { useState, useEffect } from 'react';
import { HospitalCard } from '@/components/features/hospital-locator/HospitalCard';
import { sampleHospitals } from '@/lib/constants';
import type { Hospital } from '@/types';
import { Input } from '@/components/ui/input';
import { Search, Building2 } from 'lucide-react';

export default function HospitalLocatorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedHospitals, setDisplayedHospitals] = useState<Hospital[]>(sampleHospitals);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setDisplayedHospitals(sampleHospitals);
      return;
    }
    setDisplayedHospitals(
      sampleHospitals.filter(
        (h) =>
          h.name.toLowerCase().includes(term) ||
          h.address.toLowerCase().includes(term)
      )
    );
  }, [searchTerm]);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-6 duration-700">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Find Nearby Hospitals
        </h1>
        <p className="mt-1 text-muted-foreground">
          Locate medical facilities equipped for stroke care.
        </p>
      </div>

      {/* Search */}
      <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search by hospital name or address..."
          className="pl-10 h-11 rounded-xl bg-card"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />
        {/* Live result count badge */}
        {searchTerm.trim() && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {displayedHospitals.length} result{displayedHospitals.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Results */}
      <div className="animate-in fade-in duration-700 delay-300">
        {displayedHospitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedHospitals.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">No hospitals found</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              No results for &quot;{searchTerm}&quot;. Try a different name or address.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}