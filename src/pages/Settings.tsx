import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { USER_PROFILE } from '@/data/dashboard';

export function Settings() {
  const mockName = localStorage.getItem('mock_user_name');
  const mockEmail = localStorage.getItem('mock_user_email');
  
  const displayName = mockName || USER_PROFILE.name;
  const displayEmail = mockEmail || USER_PROFILE.email;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }
    
    // In a real app, you would verify current password via backend API.
    // For this mock, we just update local storage if they entered a new password.
    if (newPassword) {
      localStorage.setItem('mock_user_password', newPassword);
      setMessage('Password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl px-10 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1D1F4C] mb-2">Account Settings</h1>
        <p className="text-slate-500 text-sm">Manage your profile information</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 mb-8">
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-semibold text-[#1D1F4C] mb-2">
              Full Name
            </label>
            <input
              type="text"
              readOnly
              value={displayName}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1D1F4C] mb-2">
              Email Address
            </label>
            <input
              type="email"
              readOnly
              value={displayEmail}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-500 bg-slate-50 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="primary" className="px-6 py-2.5 bg-[#1A4BFF] hover:bg-blue-700 text-white rounded-full font-semibold shadow-none border-none">
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-[#1D1F4C] mb-6">Change Password</h2>
        
        <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-2xl">
          <div>
            <label className="block text-sm font-semibold text-[#1D1F4C] mb-2">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1A4BFF] focus:border-[#1A4BFF] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1D1F4C] mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1A4BFF] focus:border-[#1A4BFF] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1D1F4C] mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1A4BFF] focus:border-[#1A4BFF] outline-none transition-all"
            />
          </div>
          
          {message && (
            <div className={`text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" className="px-6 py-2.5 bg-[#1A4BFF] hover:bg-blue-700 text-white rounded-full font-semibold shadow-none border-none">
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
