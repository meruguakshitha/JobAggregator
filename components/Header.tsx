
import React from 'react';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
        <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Job Aggregator & Notifier</h1>
          <p className="text-sm text-slate-500">Powered by Gemini AI</p>
        </div>
      </div>
    </header>
  );
};
