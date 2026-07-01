const Job = require('../models/Job');
const Groq = require('groq-sdk');

// Fetch all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed initial 3 jobs
const seedJobs = async (req, res) => {
  try {
    const count = await Job.countDocuments();
    if (count === 0) {
      const initialJobs = [
        {
          title: "Frontend Developer",
          company: "TFG Technologies",
          location: "Remote",
          employmentType: "Full-time",
          experienceRequired: "2-4 years",
          skills: ["HTML", "CSS", "JavaScript", "React"],
          shortDescription: "Build modern and responsive user interfaces.",
          fullDescription: "We are looking for an experienced Frontend Developer..."
        },
        {
          title: "Sales Executive",
          company: "TFG Solutions",
          location: "Bangalore",
          employmentType: "Full-time",
          experienceRequired: "1-3 years",
          skills: ["Negotiation", "Pitching", "CRM"],
          shortDescription: "Drive sales and expand our client base.",
          fullDescription: "As a Sales Executive, you will..."
        },
        {
          title: "UI/UX Designer",
          company: "TFG Innovation Labs",
          location: "Hybrid",
          employmentType: "Full-time",
          experienceRequired: "3+ years",
          skills: ["Figma", "Prototyping", "UX Research"],
          shortDescription: "Design intuitive user experiences.",
          fullDescription: "Join our design team..."
        }
      ];
      await Job.insertMany(initialJobs);
      return res.json({ message: "Seed successful", jobs: initialJobs });
    }
    res.json({ message: "Jobs already seeded" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search jobs semantically via Gemini
const searchJobs = async (req, res) => {
  try {
    const { role, jobDescription, resumeData } = req.body;
    
    // Fetch all jobs to pass to Gemini context
    const jobs = await Job.find();
    
    if (!process.env.GROQ_API_KEY) {
      // Fallback if no API key
      return res.json({ recommendedJobs: jobs.slice(0, 3) });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const prompt = `
      You are an AI job recommendation engine.
      Given a user's resume data, an optional requested role, and an optional requested job description, 
      recommend the top matching jobs from the provided list of available jobs.
      
      User Resume Data: ${JSON.stringify(resumeData || {})}
      Requested Role: ${role || 'None'}
      Requested Job Description: ${jobDescription || 'None'}
      
      Available Jobs List:
      ${JSON.stringify(jobs)}
      
      Please return a JSON object containing a property "recommendedJobIds" which is an array of the '_id' of the recommended jobs, sorted by relevance.
      Example format: { "recommendedJobIds": ["jobId1", "jobId2"] }
      Output ONLY valid JSON.
    `;
    
    const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' }
    });
    
    const jsonResponse = response.choices[0]?.message?.content || "{}";
    
    try {
      const parsed = JSON.parse(jsonResponse);
      const recommendedJobIds = parsed.recommendedJobIds || [];
      const recommendedJobs = jobs.filter(job => recommendedJobIds.includes(job._id.toString()));
      
      // Sort recommended jobs according to the AI's order
      recommendedJobs.sort((a, b) => recommendedJobIds.indexOf(a._id.toString()) - recommendedJobIds.indexOf(b._id.toString()));
      
      res.json({ recommendedJobs: recommendedJobs.length > 0 ? recommendedJobs : jobs.slice(0,3) });
    } catch (parseError) {
      console.error("Failed to parse Gemini response", parseError);
      res.json({ recommendedJobs: jobs.slice(0, 3) });
    }

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, seedJobs, searchJobs };
