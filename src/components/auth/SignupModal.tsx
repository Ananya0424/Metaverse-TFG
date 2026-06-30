import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Link as LinkIcon, Lock, X, Check, Circle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import api from '@/services/api';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State for Step 2
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    experience: '',
    password: '',
    confirmPassword: ''
  });

  // State for Step 3
  const [membershipType, setMembershipType] = useState<'monthly' | 'annually'>('annually');

  const [error, setError] = useState('');

  const handleNextToStep2 = () => setStep(2);
  const handleNextToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setStep(3);
  };
  
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await api.post('/auth/register', {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password
      });

      if (response.data && response.data.token) {
        login(response.data.token);
        onClose();
        setTimeout(() => setStep(1), 300);
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      // Reset after animation
      setTimeout(() => setStep(1), 300);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep(1), 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`w-full bg-white rounded-xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col transition-all duration-300 ${step === 3 ? 'max-w-5xl' : 'max-w-4xl'}`}
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP 1: CHOOSE YOUR LICENCE */}
            {step === 1 && (
              <div className="flex flex-col h-full overflow-y-auto">
                <div className="px-10 pt-10 pb-6 border-b border-slate-100 shrink-0">
                  <h2 className="text-3xl font-bold text-[#1D1F4C]">Choose Your Licence</h2>
                </div>
                <div className="px-10 py-10 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Individual Card */}
                  <div className="border-2 border-slate-200 rounded-xl p-8 hover:border-[#1A74E3] transition-colors bg-white flex flex-col">
                    <h3 className="text-3xl font-bold text-[#1D1F4C] mb-2">Individual</h3>
                    <p className="text-slate-400 text-sm mb-6">This is an individual user License</p>
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-4xl font-bold text-[#1D1F4C]">$30</span>
                      <span className="text-slate-400 text-sm">/Month</span>
                    </div>
                    <Button 
                      onClick={handleNextToStep2}
                      variant="outline" 
                      className="w-full py-3 mb-8 border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Get Started Now
                    </Button>
                    <div className="space-y-4 flex-1">
                      {[
                        'Access our full content library',
                        'All VR and Web practice exercises',
                        'Gen AI-enhanced exercises',
                        'Roleplay with AI avatars',
                        'AI feedback on performance',
                        'Personal AI career coach'
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="bg-blue-50 text-[#1A74E3] rounded-full p-1">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </div>
                          <span className="text-slate-600 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enterprise Card */}
                  <div className="bg-[#2A2B2E] rounded-xl p-8 flex flex-col text-white">
                    <h3 className="text-3xl font-bold text-yellow-500 mb-2">Enterprise</h3>
                    <p className="text-slate-300 text-sm mb-8">Empower your Organisation with AI-based Training</p>
                    <Button 
                      variant="primary" 
                      className="w-full py-3 mb-8 bg-white text-[#1A74E3] hover:bg-slate-100 border-none"
                    >
                      Talk to Us
                    </Button>
                    <div className="space-y-4 flex-1">
                      {[
                        'Everything in individual Plan',
                        'Add and manage multiple users',
                        'Centralised L&D (Learning & Development) dashboard',
                        'Strong analytics and reporting',
                        'Full access for all employees',
                        'Assign modules to specific team/class'
                      ].map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="bg-blue-100/10 text-white rounded-full p-1 shrink-0 mt-0.5">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </div>
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: USER DETAILS */}
            {step === 2 && (
              <div className="flex flex-col h-full overflow-y-auto">
                <div className="px-10 pt-10 pb-6 border-b border-slate-100 shrink-0">
                  <h2 className="text-3xl font-bold text-[#1D1F4C]">Tell Us About Yourself</h2>
                  {error && <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">{error}</div>}
                </div>

                <div className="px-10 py-6 flex-1">
                  <form id="signupForm" onSubmit={handleNextToStep3} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="First Name"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all placeholder:text-slate-300"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Last Name"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all placeholder:text-slate-300"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email ID</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="iam...kumar145@gmail.com"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all placeholder:text-slate-300"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone No.</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="tel"
                          required
                          placeholder="+91-7073291643"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all placeholder:text-slate-300"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn Profile URL</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LinkIcon className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all placeholder:text-slate-300"
                          value={formData.linkedin}
                          onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                      <input
                        type="text"
                        required
                        placeholder="Years of Experience"
                        className="w-full px-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all placeholder:text-slate-300"
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all placeholder:text-slate-300"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all placeholder:text-slate-300"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="px-10 py-6 border-t border-slate-100 shrink-0 bg-slate-50">
                  <Button 
                    type="submit" 
                    form="signupForm"
                    className="w-full bg-[#1A74E3] hover:bg-blue-700 text-white font-semibold py-4 text-lg rounded-md shadow-md transition-colors mb-4"
                  >
                    Next
                  </Button>
                  <p className="text-xs text-slate-500 text-center">
                    By sending the request you can confirm that you accept our <a href="#" className="text-[#1A74E3] hover:underline">Terms of Service</a> and <a href="#" className="text-[#1A74E3] hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <div className="flex flex-col h-full overflow-y-auto">
                <div className="px-10 pt-10 pb-6 shrink-0">
                  <h2 className="text-3xl font-bold text-[#1D1F4C]">Individual Plan</h2>
                  <p className="text-slate-500 mt-2">Get Access to All Learning Modules on Web and VR</p>
                  {error && <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">{error}</div>}
                </div>

                <form id="paymentForm" onSubmit={handlePayment} className="px-10 py-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column: Billing Details */}
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Billed to</label>
                        <input
                          type="text"
                          placeholder="Name"
                          className="w-full px-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all"
                        />
                      </div>
                      
                      <div>
                        <input
                          type="text"
                          placeholder="Card Number"
                          className="w-full px-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png')] bg-no-repeat bg-[length:30px] bg-[right_10px_center]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="w-full px-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="w-full px-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                        <input
                          type="text"
                          defaultValue="India"
                          className="w-full px-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Zip Code"
                          className="w-full px-4 py-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#1A74E3] focus:border-[#1A74E3] outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Right Column: Membership Type */}
                    <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 flex flex-col h-full">
                      <h3 className="font-bold text-[#1D1F4C] mb-4">Membership Type</h3>
                      
                      <div className="space-y-4 mb-8">
                        {/* Monthly Option */}
                        <label 
                          className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors ${membershipType === 'monthly' ? 'border-[#1A74E3] bg-blue-50/30' : 'border-slate-200 bg-white'}`}
                        >
                          <input 
                            type="radio" 
                            name="membership" 
                            className="sr-only" 
                            checked={membershipType === 'monthly'}
                            onChange={() => setMembershipType('monthly')}
                          />
                          <div className="mr-4 mt-0.5">
                            {membershipType === 'monthly' ? (
                              <CheckCircle2 className="w-5 h-5 text-[#1A74E3]" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-[#1D1F4C]">Pay Monthly</div>
                            <div className="text-sm text-slate-500">$20 / Month Per Member</div>
                          </div>
                        </label>

                        {/* Annually Option */}
                        <label 
                          className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors ${membershipType === 'annually' ? 'border-[#1A74E3] bg-blue-50/50' : 'border-slate-200 bg-white'}`}
                        >
                          <input 
                            type="radio" 
                            name="membership" 
                            className="sr-only" 
                            checked={membershipType === 'annually'}
                            onChange={() => setMembershipType('annually')}
                          />
                          <div className="mr-4 mt-0.5">
                            {membershipType === 'annually' ? (
                              <CheckCircle2 className="w-5 h-5 text-[#1A74E3]" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-[#1D1F4C]">Pay Annually</div>
                            <div className="text-sm text-slate-500">$18 / Month Per Member</div>
                          </div>
                          <div className="font-bold text-sm text-[#1D1F4C]">Save 20%</div>
                        </label>
                      </div>

                      <div className="mt-auto">
                        <p className="text-xs text-slate-500 mb-4">
                          By Continuing you agree to our <a href="#" className="text-[#1A74E3] hover:underline">terms and conditions</a>.
                        </p>
                        <Button 
                          type="submit" 
                          className="w-full bg-[#1EA4FF] hover:bg-blue-500 text-white font-semibold py-3.5 text-base rounded-md shadow-sm transition-colors"
                        >
                          Pay
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total summary outside the grid to match design */}
                  <div className="mt-8 mb-4">
                     <div className="text-2xl font-bold text-[#1D1F4C]">
                       {membershipType === 'annually' ? '$216.00' : '$20.00'} / {membershipType === 'annually' ? 'Year' : 'Month'} / User
                     </div>
                     <a href="#" className="text-[#1A74E3] text-sm hover:underline">Details</a>
                  </div>
                </form>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
