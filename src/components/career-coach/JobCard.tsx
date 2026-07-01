import { useNavigate } from 'react-router-dom';
import { Mic, Briefcase } from 'lucide-react';

export interface JobProps {
  _id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  experienceRequired: string;
  skills: string[];
  shortDescription: string;
  applyLink?: string;
}

export function JobCard({ job }: { job: JobProps }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-[#F8FAFC] rounded-lg flex items-center justify-center mb-4 border border-slate-100">
        <Briefcase className="w-6 h-6 text-[#1A4BFF]" />
      </div>
      <h3 className="font-bold text-[#1D1F4C] text-[16px] mb-1">{job.title}</h3>
      <p className="text-[#1A74E3] font-medium text-[13px] mb-1">{job.company}</p>
      
      <div className="flex flex-wrap gap-2 mb-4 text-[12px] text-slate-500">
        <span className="bg-slate-50 px-2 py-1 rounded">{job.location}</span>
        <span className="bg-slate-50 px-2 py-1 rounded">{job.employmentType}</span>
        <span className="bg-slate-50 px-2 py-1 rounded">{job.experienceRequired}</span>
      </div>
      
      <p className="text-slate-500 text-[13px] mb-4 line-clamp-2">{job.shortDescription}</p>
      
      <div className="flex flex-wrap gap-1.5 mb-6">
        {job.skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="bg-blue-50 text-blue-600 text-[11px] font-semibold px-2 py-1 rounded-md">
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="bg-slate-50 text-slate-500 text-[11px] font-semibold px-2 py-1 rounded-md">
            +{job.skills.length - 3}
          </span>
        )}
      </div>
      
      <div className="mt-auto grid grid-cols-2 gap-3">
        {job.applyLink && (
          <a 
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 bg-[#1D1F4C] hover:bg-[#15173B] text-white text-xs font-bold py-2.5 px-4 rounded-full flex justify-center items-center transition-colors"
          >
            Apply Now
          </a>
        )}
        <button 
          onClick={() => navigate('/dashboard/career-coach/interview')}
          className={`${job.applyLink ? 'col-span-2' : 'col-span-2'} bg-[#FFCC00] hover:bg-[#F0C000] text-[#1D1F4C] text-xs font-bold py-2.5 px-4 rounded-full flex items-center justify-center transition-colors shadow-sm`}
        >
          <Mic className="w-4 h-4 mr-2" />
          Start Mock Interview
        </button>
      </div>
    </div>
  );
}
