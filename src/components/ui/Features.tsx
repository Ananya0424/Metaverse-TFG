import { motion, useReducedMotion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { cn } from '@/utils/cn';
import { FEATURES_DATA } from '@/data/features';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index?: number;
}

export function FeatureCard({ title, description, icon: Icon, index = 0 }: FeatureCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 30, 
      filter: shouldReduceMotion ? 'blur(0px)' : 'blur(10px)' 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, delay: shouldReduceMotion ? 0 : (index + 1) * 0.1, ease: [0.21, 0.47, 0.32, 0.98] as const }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="h-full"
    >
      <Card 
        className={cn(
          "group h-full flex flex-col bg-white border border-transparent hover:bg-blue-50/30 hover:border-blue-300 p-8 md:p-10",
          "rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(26,116,227,0.15)] hover:-translate-y-1.5 transition-all duration-500",
          "focus-within:ring-2 focus-within:ring-[#1A74E3] focus-within:ring-offset-2"
        )}
      >
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:bg-blue-50/80">
          <Icon className="w-8 h-8 text-[#1A74E3] transition-colors duration-500" aria-hidden="true" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-[#1D1F4C] mb-4">{title}</h3>
        <p className="text-slate-600 leading-relaxed flex-grow text-base md:text-lg">
          {description}
        </p>
      </Card>
    </motion.div>
  );
}

export function Features() {
  const shouldReduceMotion = useReducedMotion();

  const headerVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20,
      filter: shouldReduceMotion ? 'blur(0px)' : 'blur(10px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] as const }
    }
  };

  return (
    <section 
      aria-labelledby="features-heading"
      className="py-24 md:py-32 bg-[#F8FAFC]"
    >
      <div className="container max-w-7xl mx-auto px-6 lg:px-12">
        
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 md:mb-24 flex flex-col items-center"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6 tracking-wide shadow-sm">
            Platform Capabilities
          </span>
          <h2 
            id="features-heading"
            className="text-3xl md:text-5xl font-bold text-[#1D1F4C] mb-6 tracking-tight"
          >
            Why Choose TFG?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Our platform provides state-of-the-art tools designed specifically to accelerate professional growth and enterprise excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {FEATURES_DATA.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
