import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

const FAQS = [
  {
    question: "What is TFG MR-AI Platform and how does it work?",
    answer: "TFG MR-AI Platform is an AI-powered training and interview preparation platform. It allows you to practice leadership, management, sales, customer experience, and workplace skills through interactive exercises. You can use TFG on the web or with a VR headset for a more immersive experience."
  },
  {
    question: "What kinds of modules are available for professionals?",
    answer: "Modules include Leadership & Management, Innovation, Sales Excellence, Customer Experience, Workplace Skills, Employability, Coaching, and Functional Mentoring. Each module has exercises that simulate real-world scenarios you might face at work."
  },
  {
    question: "Do I need a VR headset to train?",
    answer: "No - all modules are available on the web and can be accessed directly from your browser. However, if you want a deeper, more immersive experience, you can use a VR headset to practice in realistic environments."
  },
  {
    question: "How will TFG MR-Ai Platform help me improve?",
    answer: "After each session, TFG generates a personalized report with feedback on your performance, including speaking pace, filler words, and specific skills assessment. This helps you identify areas for improvement and track your progress over time."
  }
];

export function HelpCenter() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="px-10 py-10 max-w-6xl">
      <h1 className="text-2xl font-bold text-[#1D1F4C] mb-8">Help Center</h1>

      <div className="text-sm font-bold text-[#1A4BFF] mb-6">FAQs</div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Contact Card */}
        <div className="w-full lg:w-[320px] bg-[#1A4BFF] rounded-xl p-8 text-white shrink-0 relative overflow-hidden shadow-sm">
          {/* Decorative circles */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 right-10 w-24 h-24 bg-white/10 rounded-full"></div>
          
          <h3 className="text-2xl font-bold mb-3 relative z-10">Didn't find what you were looking for?</h3>
          <p className="text-white/80 text-sm mb-8 relative z-10">Contact our customer service</p>
          
          <button className="bg-white text-[#1A4BFF] px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors relative z-10">
            Contact Us
          </button>
        </div>

        {/* FAQs List */}
        <div className="flex-1 w-full space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`bg-white rounded-xl border transition-all cursor-pointer overflow-hidden ${
                  isOpen ? 'border-[#1D1F4C] shadow-sm' : 'border-slate-100 hover:border-slate-200'
                }`}
                onClick={() => toggleFaq(index)}
              >
                <div className="px-6 py-5 flex items-center justify-between">
                  <h3 className="text-[15px] font-bold text-[#1D1F4C]">{faq.question}</h3>
                  <MoreHorizontal className="w-5 h-5 text-slate-400 shrink-0" />
                </div>
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-slate-500 leading-relaxed border-t border-slate-50 mx-6 mt-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
