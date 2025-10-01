import React, { useState, useCallback } from 'react';
import { JobForm } from './components/JobForm';
import { JobResults } from './components/JobResults';
import { Header } from './components/Header';
import { fetchJobsFromGemini } from './services/geminiService';
import type { SearchCriteria, JobPosting } from './types';

const App: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    keywords: 'React Developer',
    locationQuery: '',
    locationTypes: ['Remote', 'In-office', 'Hybrid'],
    experience: '0-2',
    yearFilter: new Date().getFullYear() + 1,
    jobType: 'Full-time',
    postedWithin: 7,
    sources: ['LinkedIn', 'Indeed', 'Naukri'],
    scheduleTime: '09:00',
    scheduleFrequency: 'daily',
    email: '',
    maxResults: 50,
  });

  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);

  const handleSearch = useCallback(async () => {
    if (!searchCriteria.email) {
      setError("Please enter a valid email address to receive notifications.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchInitiated(true);
    setJobPostings([]);

    try {
      const results = await fetchJobsFromGemini(searchCriteria);
      setJobPostings(results);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch job postings. The model may be overloaded. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [searchCriteria]);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <JobForm 
              criteria={searchCriteria} 
              setCriteria={setSearchCriteria} 
              onSearch={handleSearch}
              isLoading={isLoading} 
            />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <JobResults 
              jobs={jobPostings}
              isLoading={isLoading}
              error={error}
              searchInitiated={searchInitiated}
              criteria={searchCriteria}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
