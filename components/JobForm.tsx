import React from 'react';
import type { SearchCriteria } from '../types';
import { MailIcon } from './icons/MailIcon';
import { SearchIcon } from './icons/SearchIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface JobFormProps {
  criteria: SearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
  onSearch: () => void;
  isLoading: boolean;
}

const ALL_SOURCES = ['LinkedIn', 'Indeed', 'Naukri', 'Glassdoor', 'Fresher Voice'];
const LOCATION_TYPES = ['Remote', 'In-office', 'Hybrid'];

export const JobForm: React.FC<JobFormProps> = ({ criteria, setCriteria, onSearch, isLoading }) => {
  const handleInputChange = <K extends keyof SearchCriteria,>(
    key: K, 
    value: SearchCriteria[K]
  ) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSourceChange = (source: string) => {
    const newSources = criteria.sources.includes(source)
      ? criteria.sources.filter(s => s !== source)
      : [...criteria.sources, source];
    handleInputChange('sources', newSources);
  };

  const handleLocationTypeChange = (type: string) => {
    const newTypes = criteria.locationTypes.includes(type)
      ? criteria.locationTypes.filter(t => t !== type)
      : [...criteria.locationTypes, type];
    handleInputChange('locationTypes', newTypes);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-slate-700">Search Configuration</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="space-y-4">
        
        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Job Role / Keywords</label>
          <input type="text" value={criteria.keywords} onChange={e => handleInputChange('keywords', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        
        {/* Location Query */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Location (e.g. City, Country)</label>
          <input type="text" value={criteria.locationQuery} onChange={e => handleInputChange('locationQuery', e.target.value)} placeholder="Leave blank for worldwide" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        
        {/* Location Types */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Location Type</label>
          <div className="grid grid-cols-3 gap-2">
            {LOCATION_TYPES.map(type => (
              <label key={type} className="flex items-center space-x-2 text-sm">
                <input type="checkbox" checked={criteria.locationTypes.includes(type)} onChange={() => handleLocationTypeChange(type)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience & Job Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Experience</label>
            <select value={criteria.experience} onChange={e => handleInputChange('experience', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Fresher</option>
              <option>0-2</option>
              <option>2-5</option>
              <option>5+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Job Type</label>
            <select value={criteria.jobType} onChange={e => handleInputChange('jobType', e.target.value as SearchCriteria['jobType'])} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
              <option>Any</option>
            </select>
          </div>
        </div>
        
        {/* Year & Posted Within */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Year Filter</label>
            <input type="number" value={criteria.yearFilter} onChange={e => handleInputChange('yearFilter', parseInt(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Posted Within (Days)</label>
            <input type="number" min="1" value={criteria.postedWithin} onChange={e => handleInputChange('postedWithin', parseInt(e.target.value) || 1)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        
        {/* Sources */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Sources</label>
          <div className="grid grid-cols-2 gap-2">
            {ALL_SOURCES.map(source => (
              <label key={source} className="flex items-center space-x-2 text-sm">
                <input type="checkbox" checked={criteria.sources.includes(source)} onChange={() => handleSourceChange(source)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span>{source}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 my-4 pt-4">
             <h3 className="text-lg font-semibold mb-2 text-slate-700 flex items-center gap-2"><MailIcon className="h-5 w-5"/>Email Notification</h3>
        </div>
        
        {/* Schedule */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Frequency</label>
                <select value={criteria.scheduleFrequency} onChange={e => handleInputChange('scheduleFrequency', e.target.value as SearchCriteria['scheduleFrequency'])} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Time</label>
                <input type="time" value={criteria.scheduleTime} onChange={e => handleInputChange('scheduleTime', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
          <input type="email" placeholder="you@example.com" value={criteria.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required/>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading} className="w-full mt-4 flex justify-center items-center gap-2 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-200">
          {isLoading ? <><SpinnerIcon /> Searching...</> : <><SearchIcon /> Start Aggregation</>}
        </button>
      </form>
    </div>
  );
};
