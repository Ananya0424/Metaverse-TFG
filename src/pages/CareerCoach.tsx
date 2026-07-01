import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, PlusCircle } from 'lucide-react';
import api from '@/services/api';
import type { ResumeData } from '@/types/resume';

import { JobCard, JobProps } from '@/components/career-coach/JobCard';
import { JobSearchSection } from '@/components/career-coach/JobSearchSection';

export function CareerCoach() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [cachedResumeData, setCachedResumeData] = useState<ResumeData | undefined>(undefined);

  const [recommendedJobs, setRecommendedJobs] = useState<JobProps[]>([]);
  const [isSearchingJobs, setIsSearchingJobs] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);

  // Fetch initial jobs on load
  useEffect(() => {
    fetchInitialJobs();
  }, []);

  const fetchInitialJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setRecommendedJobs(response.data);
    } catch (err) {
      console.error('Failed to load initial jobs', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadAndSearch = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    
    try {
      // Step 1: Parse the resume
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const parseResponse = await api.post('/resume/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const parsedData = parseResponse.data;
      setCachedResumeData(parsedData);
      setHasUploadedResume(true);
      
      // Step 2: Automatically search for jobs using parsed data
      setIsSearchingJobs(true);
      const searchResponse = await api.post('/jobs/search', {
        role: '',
        jobDescription: '',
        resumeData: parsedData
      });
      
      setRecommendedJobs(searchResponse.data.recommendedJobs || []);
      setShowAllJobs(false);
      alert('Resume processed! Showing personalized job matches.');
      
    } catch (err: any) {
      console.error('Upload failed', err);
      const errorMsg = err.response?.data?.message || err.message;
      alert(`Error processing resume: ${errorMsg}`);
    } finally {
      setIsUploading(false);
      setIsSearchingJobs(false);
    }
  };

  const handleJobSearch = async (role: string, jobDescription: string, filters: { location: string, employmentType: string }) => {
    setIsSearchingJobs(true);
    try {
      const response = await api.post('/jobs/search', {
        role,
        jobDescription,
        resumeData: hasUploadedResume ? cachedResumeData : undefined,
        filters
      });
      setRecommendedJobs(response.data.recommendedJobs || []);
      setShowAllJobs(false);
    } catch (err) {
      console.error('Job search failed', err);
    } finally {
      setIsSearchingJobs(false);
    }
  };

  const displayedJobs = showAllJobs ? recommendedJobs : recommendedJobs.slice(0, 3);

  return (
    <div className="p-10 max-w-[1400px] mx-auto w-full min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-[32px] font-bold text-[#1D1F4C]">Career Coach & Job Matching</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Top Left: Upload Resume for Jobs */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-[#1A4BFF] mr-3" />
                <h3 className="font-bold text-[#1D1F4C] text-xl">Find Match</h3>
              </div>
            </div>
            
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">
              Upload your resume and our AI will instantly recommend the best jobs suited for your skills.
            </p>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center mb-6 border-dashed bg-slate-50 cursor-pointer hover:bg-slate-100 hover:border-[#1A4BFF] transition-all"
            >
               <Upload className="w-10 h-10 text-slate-400 mb-4" />
               <span className="text-sm font-semibold text-[#1D1F4C] mb-2">Click to select or drag PDF</span>
               <span className="text-xs text-slate-500 text-center px-4">
                 {selectedFile ? selectedFile.name : 'Supports PDF up to 5MB'}
               </span>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept=".pdf"
                 onChange={handleFileChange}
               />
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={handleUploadAndSearch}
              disabled={!selectedFile || isUploading}
              className={`w-full text-[15px] font-bold py-4 rounded-xl transition-colors ${!selectedFile || isUploading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#FFCC00] hover:bg-[#F0C000] text-[#1D1F4C]'}`}
            >
              {isUploading ? 'Extracting & Matching Jobs...' : 'Find Matching Jobs'}
            </button>
            
            <button 
              onClick={() => navigate('/dashboard/career-coach/builder')}
              className="w-full text-[#1A4BFF] text-[15px] font-bold py-4 rounded-xl transition-colors border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 flex items-center justify-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create New Resume
            </button>
          </div>
        </div>

        {/* Top Right: Job Search Section */}
        <div className="lg:col-span-2">
          <JobSearchSection onSearch={handleJobSearch} isLoading={isSearchingJobs} />
        </div>
      </div>

      {/* Recommended Jobs Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[28px] font-bold text-[#1D1F4C]">Recommended Jobs</h2>
          {recommendedJobs.length > 3 && (
            <button 
              onClick={() => setShowAllJobs(!showAllJobs)}
              className="text-[#1A4BFF] font-semibold hover:underline"
            >
              {showAllJobs ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedJobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
          {displayedJobs.length === 0 && (
            <div className="col-span-3 py-10 text-center text-slate-500">
              No jobs found. Try adjusting your search criteria.
            </div>
          )}
        </div>
        
        {!showAllJobs && recommendedJobs.length > 3 && (
          <div className="mt-8 text-center">
            <button 
              onClick={() => setShowAllJobs(true)}
              className="bg-white border-2 border-slate-200 hover:border-slate-300 text-[#1D1F4C] font-bold py-3 px-8 rounded-full transition-colors"
            >
              View All {recommendedJobs.length} Jobs
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
