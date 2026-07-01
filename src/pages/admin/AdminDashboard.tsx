import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, LogOut, PlusCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import logoImg from '@/assets/images/logo.png';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'jobs'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
                    <div key={user._id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#FFD600]/50 transition-colors">
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
    </div>
  );
}
