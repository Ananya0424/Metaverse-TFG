export interface Experience {
  id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  year: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  link: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedIn: string;
    github: string;
    portfolio: string;
  };
  professionalSummary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: string[];
  projects: Project[];
  languages: string[];
  achievements: string[];
  additionalInfo: string;
}
