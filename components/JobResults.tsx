
import React from 'react';
import type { JobPosting, SearchCriteria } from '../types';
import { downloadJson, downloadCsv } from '../utils/fileUtils';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { ClockIcon } from './icons/ClockIcon';

interface JobResultsProps {
  jobs: JobPosting[];
  isLoading: boolean;
  error: string | null;
  searchInitiated: boolean;
  criteria: SearchCriteria;
}

const JobCard: React.FC<{ job: JobPosting }> = ({ job }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-lg text-indigo-700">{job.jobTitle}</h3>
                <p className="font-medium text-slate-600">{job.company}</p>
                {job.salary && <p className="text-sm text-green-600 mt-1">{job.salary}</p>}
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{job.source}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
            <span className="flex items-center gap-1"><MapPinIcon /> {job.location}</span>
            <span className="flex items-center gap-1"><ClockIcon /> {job.postedDate}</span>
        </div>
        <p className="text-sm text-slate-600 my-3">{job.descriptionSnippet}</p>
        <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Apply Now <ExternalLinkIcon />
        </a>
    </div>
);

const SkeletonCard: React.FC = () => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
        <div className="h-8 bg-slate-200 rounded w-24 mt-4"></div>
    </div>
);


export const JobResults: React.FC<JobResultsProps> = ({ jobs, isLoading, error, searchInitiated, criteria }) => {
  const filename = `${criteria.keywords.replace(/\s+/g, '_')}_${criteria.yearFilter}_jobs`;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangleIcon className="mx-auto text-red-500" />
          <h3 className="mt-2 text-lg font-semibold text-red-700">An Error Occurred</h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      );
    }

    if (!searchInitiated) {
        return (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-lg">
                <h3 className="text-xl font-semibold text-slate-700">Ready to find your next job?</h3>
                <p className="text-slate-500 mt-2">Fill out the form and click "Start Aggregation" to begin.</p>
            </div>
        );
    }
    
    if (jobs.length === 0) {
      return (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-lg">
          <h3 className="text-xl font-semibold text-slate-700">No Jobs Found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search criteria for better results.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {jobs.map((job, index) => <JobCard key={`${job.applyLink}-${index}`} job={job} />)}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-700">Aggregated Job Postings</h2>
           {!isLoading && searchInitiated && jobs.length > 0 && (
            <div className="text-sm text-green-600 mt-1 flex items-center gap-2">
                <CheckCircleIcon />
                <span>
                    Aggregation complete! A report for "{criteria.keywords}" will be sent {criteria.scheduleFrequency} to <strong>{criteria.email}</strong> at {criteria.scheduleTime}.
                </span>
            </div>
           )}
        </div>
        {jobs.length > 0 && !isLoading && (
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <button onClick={() => downloadJson(jobs, `${filename}.json`)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              <DownloadIcon /> JSON
            </button>
            <button onClick={() => downloadCsv(jobs, `${filename}.csv`)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
              <DownloadIcon /> CSV
            </button>
          </div>
        )}
      </div>
      {renderContent()}
    </div>
  );
};
