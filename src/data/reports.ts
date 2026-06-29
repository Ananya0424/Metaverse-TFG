
export interface Competency {
  name: string;
  level: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ReportTranscriptMessage {
  speaker: string;
  text: string;
  highlighted?: boolean;
}

export interface UserReport {
  _id?: string;
  reportId?: string; // Kept for backwards compatibility if needed
  module?: {
    _id: string;
    title: string;
  };
  overallScore: string;
  interactionTime: string;
  speakingPace: {
    wpm: number;
    rating: string;
  };
  fillerWords: {
    count: number;
    rating: string;
  };
  skills: {
    communication: string;
    problemSolving: string;
    clarity: string;
    bodyLanguage: string;
  };
  transcript: string;
  feedback: string;
  
  // Frontend computed/extra fields
  date?: string;
  imageUrl?: string;
  lessonCompleted?: number;
}


