import { useState } from 'react';
import { Search } from 'lucide-react';

interface Props {
  onSearch: (role: string, jobDescription: string, filters: { location: string, employmentType: string }) => void;
  isLoading: boolean;
}

export function JobSearchSection({ onSearch, isLoading }: Props) {
  const [role, setRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [location, setLocation] = useState('Any');
  const [employmentType, setEmploymentType] = useState('Any');

  const handleSearch = () => {
    onSearch(role, jobDescription, { location, employmentType });
  };

  return (
    <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 max-w-4xl">
      <h2 className="text-[28px] font-bold text-[#1D1F4C] mb-2">Find Your Dream Job</h2>
      <p className="text-slate-500 text-sm mb-8">Search jobs using role name or job description</p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#1D1F4C] text-sm font-bold mb-2">Search by Role</label>
            <input 
              type="text" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer" 
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFCC00]"
            />
          </div>
          <div>
            <label className="block text-[#1D1F4C] text-sm font-bold mb-2">Location</label>
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFCC00] bg-white"
            >
              <option value="Any">Any Location</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[#1D1F4C] text-sm font-bold mb-2">Employment Type</label>
          <select 
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFCC00] bg-white mb-6"
          >
            <option value="Any">Any Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div>
          <label className="block text-[#1D1F4C] text-sm font-bold mb-2">Paste Job Description</label>
          <textarea 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste complete job description here..." 
            rows={4}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFCC00] resize-none"
          ></textarea>
        </div>

        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className={`w-full text-[#1D1F4C] text-[15px] font-bold py-4 rounded-xl flex items-center justify-center transition-colors ${
            isLoading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#FFCC00] hover:bg-[#F0C000]'
          }`}
        >
          <Search className="w-5 h-5 mr-2" />
          {isLoading ? 'Searching...' : 'Search Jobs'}
        </button>
      </div>
    </div>
  );
}
