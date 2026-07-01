import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Download, CheckCircle2 } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import api from '@/services/api';
import type { ResumeData } from '@/types/resume';

import { JobCard, JobProps } from '@/components/career-coach/JobCard';
import { ResumeBuilderForm } from '@/components/career-coach/ResumeBuilderForm';
import { ResumePDF } from '@/components/career-coach/ResumePDF';
import { JobSearchSection } from '@/components/career-coach/JobSearchSection';

const emptyResumeData: ResumeData = {
  personalInfo: { fullName: '', email: '', phone: '', address: '', linkedIn: '', github: '', portfolio: '' },
  professionalSummary: '',
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  projects: [],
  languages: [],
  achievements: [],
  additionalInfo: ''
};

export function CareerCoach() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData);
  const [hasUploadedResume, setHasUploadedResume] = useState(false);

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

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const response = await api.post('/resume/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Merge the parsed data with our current empty structure
      const parsedData = response.data;
      setResumeData({
        ...emptyResumeData,
        ...parsedData,
        personalInfo: {
          ...emptyResumeData.personalInfo,
          ...(parsedData.personalInfo || {})
        }
      });
      setHasUploadedResume(true);
      alert('Resume parsed successfully! Check the Resume Builder.');
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to parse resume. Ensure your backend has GROQ_API_KEY set.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleJobSearch = async (role: string, jobDescription: string) => {
    setIsSearchingJobs(true);
    try {
      const response = await api.post('/jobs/search', {
        role,
        jobDescription,
        resumeData: hasUploadedResume ? resumeData : undefined
      });
      setRecommendedJobs(response.data.recommendedJobs || []);
      setShowAllJobs(false); // Reset to show top 3 initially after search
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
        {/* Top Left: Upload Resume */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-[600px]">
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-[#1A4BFF] mr-3" />
            <h3 className="font-bold text-[#1D1F4C] text-xl">1. Upload Resume</h3>
          </div>
          <p className="text-[14px] text-slate-500 mb-8 leading-relaxed">
            Upload your latest resume in PDF format. Our AI will instantly parse your information to fill out your profile and recommend the best jobs for you.
          </p>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border-2 border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center mb-6 border-dashed bg-slate-50 cursor-pointer hover:bg-slate-100 hover:border-[#1A4BFF] transition-all"
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
          
          <button 
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`w-full text-[15px] font-bold py-4 rounded-xl transition-colors ${!selectedFile || isUploading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#FFCC00] hover:bg-[#F0C000] text-[#1D1F4C]'}`}
          >
            {isUploading ? 'Extracting Data with AI...' : 'Parse Resume'}
          </button>
        </div>

        {/* Top Right: Resume Builder */}
        <div className="lg:col-span-2 flex flex-col h-[600px]">
          <div className="flex justify-between items-end mb-4">
            <div className="flex items-center">
              <CheckCircle2 className="w-6 h-6 text-[#1A4BFF] mr-3" />
              <h3 className="font-bold text-[#1D1F4C] text-xl">2. Resume Builder</h3>
            </div>
            
            <PDFDownloadLink
              document={<ResumePDF data={resumeData} />}
              fileName={`${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'My'}_Resume.pdf`}
            >
              {({ loading }) => (
                <button 
                  disabled={loading}
                  className="bg-[#1D1F4C] hover:bg-[#15173B] text-white text-sm font-bold py-2.5 px-5 rounded-full flex items-center transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? 'Preparing...' : 'Save & Download PDF'}
                </button>
              )}
            </PDFDownloadLink>
          </div>
          
          <div className="flex-1 min-h-0">
            <ResumeBuilderForm data={resumeData} setData={setResumeData} />
          </div>
        </div>
      </div>

      <hr className="border-t border-slate-200 my-12" />

      {/* Find Your Dream Job Section */}
      <div className="mb-12">
        <JobSearchSection onSearch={handleJobSearch} isLoading={isSearchingJobs} />
      </div>

      {/* Recommended Jobs Section */}
      <div>
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
          <div className="mt-10 text-center">
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
