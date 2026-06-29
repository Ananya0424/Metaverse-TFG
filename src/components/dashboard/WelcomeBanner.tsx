import { USER_PROFILE } from '@/data/dashboard';

export function WelcomeBanner() {
  const mockName = localStorage.getItem('mock_user_name');
  const displayName = mockName || USER_PROFILE.name;

  return (
    <div className="px-10 pt-8">
      <div className="bg-[#1D1F4C] px-8 py-8 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, {displayName}
        </h1>
        <p className="text-slate-400 font-medium text-sm">
          Based on your profile, we've curated a path just for you.
        </p>
      </div>
    </div>
  );
}
