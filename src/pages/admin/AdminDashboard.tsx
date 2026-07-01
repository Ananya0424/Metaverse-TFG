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
    <div className="min-h-screen bg-[#050410] text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0b0822] border-r border-white/5 p-6 flex flex-col h-screen sticky top-0">
        <img src={logoImg} alt="TFG" className="h-10 object-contain mb-10" />
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'users' ? 'bg-[#FFD600] text-[#0b0822] font-semibold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Users size={20} />
            User Management
          </button>
          
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'jobs' ? 'bg-[#FFD600] text-[#0b0822] font-semibold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Briefcase size={20} />
            Post New Job
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-auto"
        >
          <LogOut size={20} />
          Secure Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'users' && (
            <div>
              <h1 className="text-3xl font-bold mb-8">Registered Users</h1>
              {loading ? (
                <div className="text-slate-400">Loading user data...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map(user => (
                    <div 
                      key={user._id} 
                      onClick={() => setSelectedUser(user)}
                      className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#FFD600]/50 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-[#FFD600] rounded-full flex items-center justify-center text-[#0b0822] text-xl font-bold mb-4">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{user.name || 'Unnamed User'}</h3>
                      <p className="text-sm text-slate-400 mb-4">{user.email}</p>
                      <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs text-slate-300">
                        Role: {user.role || 'user'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
              <p className="text-slate-400 mb-8">Jobs posted here will instantly appear on the user's Career Coach page.</p>
              
              <form onSubmit={handleJobSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Job Title</label>
                    <input required type="text" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#FFD600] outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                    <input required type="text" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#FFD600] outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                    <input required type="text" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} placeholder="e.g. Remote, Bangalore" className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#FFD600] outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Salary Range</label>
                    <input required type="text" value={jobForm.salaryRange} onChange={e => setJobForm({...jobForm, salaryRange: e.target.value})} placeholder="e.g. $50k - $80k" className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#FFD600] outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Experience Required</label>
                    <input required type="text" value={jobForm.experienceRequired} onChange={e => setJobForm({...jobForm, experienceRequired: e.target.value})} placeholder="e.g. 2-4 years" className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#FFD600] outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Employment Type</label>
                    <select value={jobForm.employmentType} onChange={e => setJobForm({...jobForm, employmentType: e.target.value})} className="w-full px-4 py-3 bg-[#110d29] border border-white/10 rounded-lg focus:ring-2 focus:ring-[#FFD600] outline-none text-white">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Skills Required (comma separated)</label>
                  <input required type="text" value={jobForm.skills} onChange={e => setJobForm({...jobForm, skills: e.target.value})} placeholder="React, Node, MongoDB" className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#FFD600] outline-none text-white" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Short Description</label>
                  <textarea required rows={3} value={jobForm.shortDescription} onChange={e => setJobForm({...jobForm, shortDescription: e.target.value})} className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#FFD600] outline-none text-white resize-none" />
                </div>

                <Button type="submit" className="w-full bg-[#FFD600] hover:bg-[#e6c100] text-[#0b0822] font-bold py-4 text-lg rounded-xl flex items-center justify-center gap-2">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0b0822] border border-[#FFD600]/20 w-full max-w-4xl rounded-2xl flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(255,214,0,0.1)] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#FFD600] rounded-full flex items-center justify-center text-[#0b0822] text-2xl font-bold">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedUser.name || 'Unnamed User'}</h2>
                  <p className="text-slate-400">{selectedUser.email} &bull; Role: <span className="text-[#FFD600]">{selectedUser.role || 'user'}</span></p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body - Reports/Activity */}
            <div className="p-6 overflow-y-auto">
              <h3 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-4">Activity & Training Reports</h3>
              
              {!selectedUser.reports || selectedUser.reports.length === 0 ? (
                <div className="text-slate-400 py-12 text-center bg-black/20 rounded-xl border border-white/5">
                  This user hasn't completed any training modules yet.
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedUser.reports.map((report: any, idx: number) => (
                    <div key={idx} className="bg-black/40 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="font-semibold text-white text-lg">Training Module Completed</h4>
                          <p className="text-sm text-slate-400">Date: {new Date(report.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-[#FFD600]/20 text-[#FFD600] px-4 py-2 rounded-full text-sm font-bold border border-[#FFD600]/30 shadow-[0_0_15px_rgba(255,214,0,0.2)]">
                          Score: {report.overallScore || 'N/A'}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                          <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Interaction Time</p>
                          <p className="text-lg font-medium text-white">{report.interactionTime || 'N/A'}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                          <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Speaking Pace</p>
                          <p className="text-lg font-medium text-white">{report.speakingPace?.wpm ? `${report.speakingPace.wpm} WPM` : 'N/A'} {report.speakingPace?.rating ? `(${report.speakingPace.rating})` : ''}</p>
                        </div>
                      </div>
                      
                      {report.feedback && (
                        <div className="mt-4 border-t border-white/5 pt-4">
                          <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">AI Feedback & Recommendations</p>
                          <p className="text-sm text-slate-300 leading-relaxed bg-[#0b0822] p-5 rounded-lg italic border border-white/5">"{report.feedback}"</p>
                        </div>
                      )}
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
