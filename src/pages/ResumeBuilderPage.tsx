import React, { useState, useRef } from 'react';
import { Upload, FileText, Download, CheckCircle2 } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import api from '@/services/api';
import type { ResumeData } from '@/types/resume';

import { ResumeBuilderForm } from '@/components/career-coach/ResumeBuilderForm';
import { ResumePDF } from '@/components/career-coach/ResumePDF';

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

export function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const parsedData = response.data;
      setResumeData({
        ...emptyResumeData,
        ...parsedData,
        personalInfo: {
          ...emptyResumeData.personalInfo,
          ...(parsedData.personalInfo || {})
        }
      });
      alert('Resume data fetched and populated! You can now edit it.');
    } catch (err: any) {
      console.error('Upload failed', err);
      const errorMsg = err.response?.data?.message || err.message;
      alert(`Error fetching data: ${errorMsg}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-10 max-w-[1400px] mx-auto w-full min-h-screen bg-[#F8FAFC]">
      <div className="mb-10">
        <h1 className="text-[32px] font-bold text-[#1D1F4C]">Resume Builder</h1>
        <p className="text-slate-500 mt-2">Create a professional, ATS-friendly resume from scratch or update an existing one.</p>
      </div>

      {/* Optional Autofill Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <FileText className="w-5 h-5 text-[#1A4BFF] mr-2" />
            <h3 className="font-bold text-[#1D1F4C] text-lg">Optional: Autofill from existing resume</h3>
          </div>
          <p className="text-[14px] text-slate-500">
            Have an old resume? Upload it here and our AI will automatically populate the form fields below so you can edit and improve it.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept=".pdf"
             onChange={handleFileChange}
           />
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold py-3 px-6 rounded-xl w-full sm:w-auto transition-colors whitespace-nowrap"
           >
             {selectedFile ? selectedFile.name : 'Select PDF File'}
           </button>
           <button 
             onClick={handleUpload}
             disabled={!selectedFile || isUploading}
             className={`w-full sm:w-auto text-[15px] font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap ${
               !selectedFile || isUploading 
                 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                 : 'bg-[#FFCC00] hover:bg-[#F0C000] text-[#1D1F4C]'
             }`}
           >
             {isUploading ? 'Extracting...' : 'Upload & Autofill'}
           </button>
        </div>
      </div>

      {/* Resume Builder Section */}
      <div className="flex flex-col">
        <div className="flex justify-between items-end mb-6">
          <div className="flex items-center">
            <CheckCircle2 className="w-6 h-6 text-[#1A4BFF] mr-3" />
            <h2 className="text-[28px] font-bold text-[#1D1F4C]">Your Details</h2>
          </div>
          
          <PDFDownloadLink
            document={<ResumePDF data={resumeData} />}
            fileName={`${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'My'}_Resume.pdf`}
          >
            {({ loading }) => (
              <button 
                disabled={loading}
                className="bg-[#1D1F4C] hover:bg-[#15173B] text-white text-sm font-bold py-2.5 px-6 rounded-full flex items-center transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                {loading ? 'Preparing...' : 'Save & Download PDF'}
              </button>
            )}
          </PDFDownloadLink>
        </div>
        
        <div className="w-full">
          <ResumeBuilderForm data={resumeData} setData={setResumeData} />
        </div>
      </div>
    </div>
  );
}
