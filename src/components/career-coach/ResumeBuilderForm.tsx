import React, { useState } from 'react';
import type { ResumeData } from '../../types/resume';
import { Plus, Trash2 } from 'lucide-react';

export function ResumeBuilderForm({ 
  data, 
  setData 
}: { 
  data: ResumeData; 
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
}) {
  const [activeTab, setActiveTab] = useState('personal');

  const updateField = (section: keyof ResumeData, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const updateArrayField = (section: 'experience' | 'education' | 'projects', index: number, field: string, value: string) => {
    setData(prev => {
      const newArray = [...prev[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const addArrayItem = (section: 'experience' | 'education' | 'projects', emptyItem: any) => {
    setData(prev => ({
      ...prev,
      [section]: [...prev[section], emptyItem]
    }));
  };

  const removeArrayItem = (section: 'experience' | 'education' | 'projects', index: number) => {
    setData(prev => {
      const newArray = [...prev[section]];
      newArray.splice(index, 1);
      return { ...prev, [section]: newArray };
    });
  };

  const handleStringArray = (section: 'skills' | 'certifications' | 'languages' | 'achievements', value: string) => {
    setData(prev => ({
      ...prev,
      [section]: value.split(',').map(item => item.trim()).filter(Boolean)
    }));
  };

  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills & More' }
  ];

  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);

  const handlePrev = () => {
    if (currentTabIndex > 0) setActiveTab(tabs[currentTabIndex - 1].id);
  };
  
  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1) setActiveTab(tabs[currentTabIndex + 1].id);
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-[600px] flex flex-col">
      <div className="flex overflow-x-auto gap-2 mb-6 border-b border-slate-100 pb-4 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-[#1D1F4C] text-white' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === 'personal' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Full Name</label>
              <input type="text" value={data.personalInfo.fullName} onChange={e => updateField('personalInfo', 'fullName', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Email</label>
              <input type="email" value={data.personalInfo.email} onChange={e => updateField('personalInfo', 'email', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Phone</label>
              <input type="text" value={data.personalInfo.phone} onChange={e => updateField('personalInfo', 'phone', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Address</label>
              <input type="text" value={data.personalInfo.address} onChange={e => updateField('personalInfo', 'address', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1D1F4C] mb-1">LinkedIn</label>
              <input type="text" value={data.personalInfo.linkedIn} onChange={e => updateField('personalInfo', 'linkedIn', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1D1F4C] mb-1">GitHub</label>
              <input type="text" value={data.personalInfo.github} onChange={e => updateField('personalInfo', 'github', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div>
            <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Professional Summary</label>
            <textarea 
              rows={8}
              value={data.professionalSummary} 
              onChange={e => setData(prev => ({...prev, professionalSummary: e.target.value}))} 
              className="w-full border border-slate-200 rounded-lg px-3 py-2 resize-none"
            />
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl relative">
                <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Company</label>
                    <input type="text" value={exp.company} onChange={e => updateArrayField('experience', idx, 'company', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Role</label>
                    <input type="text" value={exp.role} onChange={e => updateArrayField('experience', idx, 'role', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Start Date</label>
                    <input type="text" value={exp.startDate} onChange={e => updateArrayField('experience', idx, 'startDate', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1D1F4C] mb-1">End Date</label>
                    <input type="text" value={exp.endDate} onChange={e => updateArrayField('experience', idx, 'endDate', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Description</label>
                    <textarea rows={3} value={exp.description} onChange={e => updateArrayField('experience', idx, 'description', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 resize-none" />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => addArrayItem('experience', { company: '', role: '', startDate: '', endDate: '', description: '' })}
              className="w-full py-3 border-2 border-dashed border-[#1A4BFF] text-[#1A4BFF] rounded-xl font-bold flex items-center justify-center hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Experience
            </button>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="space-y-6">
            {data.education.map((edu, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl relative">
                <button onClick={() => removeArrayItem('education', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Institution</label>
                    <input type="text" value={edu.institution} onChange={e => updateArrayField('education', idx, 'institution', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Degree</label>
                    <input type="text" value={edu.degree} onChange={e => updateArrayField('education', idx, 'degree', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Year</label>
                    <input type="text" value={edu.year} onChange={e => updateArrayField('education', idx, 'year', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => addArrayItem('education', { institution: '', degree: '', year: '' })}
              className="w-full py-3 border-2 border-dashed border-[#1A4BFF] text-[#1A4BFF] rounded-xl font-bold flex items-center justify-center hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Education
            </button>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl relative">
                <button onClick={() => removeArrayItem('projects', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Project Title</label>
                    <input type="text" value={proj.title} onChange={e => updateArrayField('projects', idx, 'title', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Link (Optional)</label>
                    <input type="text" value={proj.link} onChange={e => updateArrayField('projects', idx, 'link', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Description</label>
                    <textarea rows={3} value={proj.description} onChange={e => updateArrayField('projects', idx, 'description', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 resize-none" />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => addArrayItem('projects', { title: '', description: '', link: '' })}
              className="w-full py-3 border-2 border-dashed border-[#1A4BFF] text-[#1A4BFF] rounded-xl font-bold flex items-center justify-center hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </button>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Skills (comma separated)</label>
              <textarea rows={3} value={data.skills.join(', ')} onChange={e => handleStringArray('skills', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Certifications (comma separated)</label>
              <textarea rows={2} value={data.certifications.join(', ')} onChange={e => handleStringArray('certifications', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1D1F4C] mb-1">Languages (comma separated)</label>
              <input type="text" value={data.languages.join(', ')} onChange={e => handleStringArray('languages', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            </div>
          </div>
        )}

      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 shrink-0">
        <button 
          onClick={handlePrev}
          disabled={currentTabIndex === 0}
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${
            currentTabIndex === 0 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Previous
        </button>
        
        <button 
          onClick={handleNext}
          disabled={currentTabIndex === tabs.length - 1}
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${
            currentTabIndex === tabs.length - 1
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-[#1A4BFF] hover:bg-[#153BCC] text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
