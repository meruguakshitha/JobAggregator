export interface SearchCriteria {
  keywords: string;
  locationQuery: string;
  locationTypes: string[];
  experience: string;
  yearFilter: number;
  jobType: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Any';
  postedWithin: number;
  sources: string[];
  scheduleTime: string;
  scheduleFrequency: 'daily' | 'weekly';
  email: string;
  maxResults: number;
}

export interface JobPosting {
  jobTitle: string;
  company: string;
  location: string;
  postedDate: string;
  applyLink: string;
  salary?: string;
  descriptionSnippet: string;
  source: string;
}
