import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, LogOut, PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import logoImg from '@/assets/images/logo.png';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'jobs'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const navigate = useNavigate();

  // Job form state
  const [jobForm, setJobForm] = useState({
    title: '', company: '', location: '', employmentType: 'Full-time',
    experienceRequired: '', salaryRange: '', shortDescription: '', skills: ''
  });

  useEffect(() => {
    // Check auth
    if (localStorage.getItem('isAdminAuthenticated') !== 'true') {
      navigate('/admin');
      return;
    }

    // Fetch users
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin');
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = jobForm.skills.split(',').map(s => s.trim());
      const payload = { ...jobForm, skills: skillsArray };

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert('Job successfully posted!');
        setJobForm({ title: '', company: '', location: '', employmentType: 'Full-time', experienceRequired: '', salaryRange: '', shortDescription: '', skills: '' });
      } else {
        alert('Failed to post job');
      }
    } catch (error) {
      console.error(error);
      alert('Error posting job');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1D1F4C] flex">
      {/* Sidebar */}
      <div className="w-[260px] bg-[#1D1F4C] shadow-xl flex flex-col h-screen fixed left-0 top-0 z-40 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#FFD600] rounded-full blur-[100px]" />
        </div>

        <div className="h-24 flex items-center px-8 border-b border-white/10 relative z-10">
          <img src={logoImg} alt="TFG" className="h-9 w-auto object-contain" />
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 relative z-10">
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'users' ? 'bg-[#FFD600]/15 text-[#FFD600]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
          >
            <Users className="w-5 h-5" />
            User Management
          </button>
          
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'jobs' ? 'bg-[#FFD600]/15 text-[#FFD600]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
          >
            <Briefcase className="w-5 h-5" />
            Post New Job
          </button>
        </nav>

        <div className="p-6 border-t border-white/10 bg-black/10 relative z-10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-[15px] font-semibold text-red-400 hover:bg-red-400/10 rounded-xl transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            Secure Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto ml-[260px]">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'users' && (
            <div>
              <div className="mb-8">
                <h1 className="text-[32px] font-extrabold text-[#1D1F4C] tracking-tight">Registered Users</h1>
                <p className="text-slate-500 font-medium">Manage and view activity for all platform users.</p>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D1F4C]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map(user => (
                    <div 
                      key={user._id} 
                      onClick={() => setSelectedUser(user)}
                      className="bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-3xl p-7 hover:shadow-xl hover:border-[#FFD600]/30 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="w-16 h-16 bg-[#FFD600]/10 rounded-2xl flex items-center justify-center text-[#1D1F4C] text-2xl font-bold mb-6 group-hover:bg-[#FFD600] transition-colors duration-300">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <h3 className="text-lg font-extrabold text-[#1D1F4C] mb-1 truncate">{user.name || 'Unnamed User'}</h3>
                      <p className="text-sm text-slate-500 mb-6 truncate">{user.email}</p>
                      <div className="inline-block px-3 py-1.5 rounded-lg bg-[#F8F9FA] border border-slate-100 text-xs text-slate-500 font-bold uppercase tracking-wider">
                        Role: {user.role || 'user'}
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && !loading && (
                     <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-100">
                        <p className="text-slate-500">No users found in the database.</p>
                     </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="max-w-3xl">
              <div className="mb-8">
                <h1 className="text-[32px] font-extrabold text-[#1D1F4C] tracking-tight mb-2">Post a New Job</h1>
                <p className="text-slate-500 font-medium">Jobs posted here will instantly appear on the user's Career Coach page.</p>
              </div>
              
              <form onSubmit={handleJobSubmit} className="bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-3xl p-10 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Job Title</label>
                    <input required type="text" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FFD600]/40 focus:border-[#FFD600] outline-none text-[#1D1F4C] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
                    <input required type="text" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FFD600]/40 focus:border-[#FFD600] outline-none text-[#1D1F4C] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Location</label>
                    <input required type="text" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} placeholder="e.g. Remote, Bangalore" className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FFD600]/40 focus:border-[#FFD600] outline-none text-[#1D1F4C] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Salary Range</label>
                    <input required type="text" value={jobForm.salaryRange} onChange={e => setJobForm({...jobForm, salaryRange: e.target.value})} placeholder="e.g. $50k - $80k" className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FFD600]/40 focus:border-[#FFD600] outline-none text-[#1D1F4C] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Experience Required</label>
                    <input required type="text" value={jobForm.experienceRequired} onChange={e => setJobForm({...jobForm, experienceRequired: e.target.value})} placeholder="e.g. 2-4 years" className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FFD600]/40 focus:border-[#FFD600] outline-none text-[#1D1F4C] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Employment Type</label>
                    <select value={jobForm.employmentType} onChange={e => setJobForm({...jobForm, employmentType: e.target.value})} className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FFD600]/40 focus:border-[#FFD600] outline-none text-[#1D1F4C] transition-all">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Skills Required (comma separated)</label>
                  <input required type="text" value={jobForm.skills} onChange={e => setJobForm({...jobForm, skills: e.target.value})} placeholder="React, Node, MongoDB" className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FFD600]/40 focus:border-[#FFD600] outline-none text-[#1D1F4C] transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Short Description</label>
                  <textarea required rows={3} value={jobForm.shortDescription} onChange={e => setJobForm({...jobForm, shortDescription: e.target.value})} className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FFD600]/40 focus:border-[#FFD600] outline-none text-[#1D1F4C] transition-all resize-none" />
                </div>

                <Button type="submit" className="w-full bg-[#1D1F4C] hover:bg-[#2A2D6C] text-white font-bold py-4 text-lg rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(29,31,76,0.2)]">
                  <PlusCircle size={24} />
                  Post Job to Database
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D1F4C]/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-100 w-full max-w-4xl rounded-3xl flex flex-col max-h-[90vh] shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-[#1D1F4C] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-[28px] font-extrabold text-[#1D1F4C] leading-tight">{selectedUser.name || 'Unnamed User'}</h2>
                  <p className="text-slate-500 font-medium">{selectedUser.email} &bull; Role: <span className="text-[#1A74E3] uppercase tracking-wider text-xs font-bold">{selectedUser.role || 'user'}</span></p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-[#1D1F4C] transition-colors bg-[#F8F9FA] p-3 rounded-xl hover:bg-slate-100 border border-slate-200">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body - Reports/Activity */}
            <div className="p-8 overflow-y-auto bg-[#F8F9FA]">
              <h3 className="text-xl font-extrabold text-[#1D1F4C] mb-6 flex items-center gap-2">Activity & Training Reports</h3>
              
              {!selectedUser.reports || selectedUser.reports.length === 0 ? (
                <div className="text-slate-500 py-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm font-medium">
                  This user hasn't completed any training modules yet.
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedUser.reports.map((report: any, idx: number) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="font-bold text-[#1D1F4C] text-lg">Training Module Completed</h4>
                          <p className="text-sm text-slate-500 font-medium mt-1">Date: {new Date(report.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-[#1D1F4C] text-[#FFD600] px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                          Score: {report.overallScore || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#F8F9FA] p-4 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-bold">Interaction Time</p>
                          <p className="text-lg font-bold text-[#1D1F4C]">{report.interactionTime || 'N/A'}</p>
                        </div>
                        <div className="bg-[#F8F9FA] p-4 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-bold">Speaking Pace</p>
                          <p className="text-lg font-bold text-[#1D1F4C]">{report.speakingPace?.wpm ? `${report.speakingPace.wpm} WPM` : 'N/A'} {report.speakingPace?.rating ? `(${report.speakingPace.rating})` : ''}</p>
                        </div>
                      </div>
                      
                      {report.feedback && (
                        <div className="mt-4 border-t border-slate-100 pt-6">
                          <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-widest font-bold">AI Feedback & Recommendations</p>
                          <p className="text-sm text-slate-600 leading-relaxed bg-[#F8F9FA] p-5 rounded-xl border border-slate-200">"{report.feedback}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Resumes Section */}
              <h3 className="text-xl font-extrabold text-[#1D1F4C] mt-12 mb-6">Resumes Uploaded</h3>
              {!selectedUser.resumes || selectedUser.resumes.length === 0 ? (
                <div className="text-slate-500 py-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm font-medium">
                  This user hasn't uploaded any resumes.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedUser.resumes.map((resume: any, idx: number) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-[#1D1F4C] text-lg">{resume.fileName || 'Uploaded Resume'}</h4>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-[#F8F9FA] px-3 py-1 rounded-md">{new Date(resume.date).toLocaleDateString()}</span>
                      </div>
                      {resume.parsedData?.personalInfo && (
                        <p className="text-sm text-slate-500 font-medium">Name extracted: <span className="text-[#1D1F4C]">{resume.parsedData.personalInfo.fullName}</span> | Email: <span className="text-[#1D1F4C]">{resume.parsedData.personalInfo.email}</span></p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Mock Interviews Section */}
              <h3 className="text-xl font-extrabold text-[#1D1F4C] mt-12 mb-6">Mock Interviews</h3>
              {!selectedUser.mockInterviews || selectedUser.mockInterviews.length === 0 ? (
                <div className="text-slate-500 py-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm font-medium">
                  This user hasn't completed any mock interviews.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedUser.mockInterviews.map((interview: any, idx: number) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h4 className="font-bold text-[#1D1F4C] text-lg mb-1">Job: {interview.jobTitle}</h4>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(interview.date).toLocaleDateString()}</span>
                        </div>
                        <div className="bg-[#1D1F4C] text-[#FFD600] px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                          Score: {interview.overallScore}
                        </div>
                      </div>
                      {interview.feedback && (
                        <div className="mt-4 border-t border-slate-100 pt-6">
                          <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-widest font-bold">AI Feedback</p>
                          <p className="text-sm text-slate-600 leading-relaxed bg-[#F8F9FA] p-5 rounded-xl border border-slate-200">"{interview.feedback}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Product Training Logs */}
              <h3 className="text-xl font-extrabold text-[#1D1F4C] mt-12 mb-6">Product Training Q&A</h3>
              {!selectedUser.productTrainingLogs || selectedUser.productTrainingLogs.length === 0 ? (
                <div className="text-slate-500 py-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm font-medium">
                  This user hasn't asked any questions in product training.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedUser.productTrainingLogs.map((log: any, idx: number) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                      <p className="text-sm text-[#1A74E3] mb-3 font-bold bg-[#1A74E3]/5 p-3 rounded-xl">Q: {log.query}</p>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium bg-[#F8F9FA] p-4 rounded-xl border border-slate-100">A: {log.response}</p>
                      <p className="text-[10px] text-slate-400 mt-4 text-right font-bold uppercase tracking-widest">{new Date(log.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
