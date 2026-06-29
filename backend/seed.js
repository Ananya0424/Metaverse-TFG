const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Module = require('./models/Module');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://ananya:Ananya%4024@cluster0.fc2jsu2.mongodb.net/?appName=Cluster0')
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.log(err));

const seedModules = [
  {
    title: 'Leadership & Management Skills',
    description: 'Master EQ based leadership, decision making, crisis management and more.',
    type: 'WEB',
    duration: '45 mins',
    totalLessons: 6,
    subModules: [
      { title: 'EQ based leadership', status: 'available' },
      { title: 'Decision Making', status: 'available' },
      { title: 'Crisis Management', status: 'locked' },
      { title: 'Critical Thinking', status: 'locked' },
      { title: 'Problem Solving', status: 'locked' },
      { title: 'Leading teams', status: 'locked' }
    ]
  },
  {
    title: 'Innovation',
    description: 'Sharpen your strategic mindset and design thinking.',
    type: 'WEB',
    duration: '30 mins',
    totalLessons: 3,
    subModules: [
      { title: 'Strategic Thinking', status: 'available' },
      { title: 'Design thinking-based Ideation', status: 'available' },
      { title: 'Effective Meeting Skills', status: 'locked' }
    ]
  },
  {
    title: 'Sales Excellence',
    description: 'Master the art of selling and negotiation.',
    type: 'WEB',
    duration: '60 mins',
    totalLessons: 6,
    subModules: [
      { title: 'Selling Skills', status: 'available' },
      { title: 'Cross Selling', status: 'locked' },
      { title: 'Closing Skills', status: 'locked' },
      { title: 'Negotiation Skills', status: 'locked' },
      { title: 'Virtual Sales', status: 'locked' },
      { title: 'Presentation Skills', status: 'locked' }
    ]
  },
  {
    title: 'Customer Experience',
    description: 'Deliver service that leaves a lasting impression. Train in empathy, human-centric service, telephonic conversations, and managing difficult customers with confidence.',
    type: 'WEB',
    duration: '45 mins',
    totalLessons: 4,
    subModules: [
      { title: 'Empathy in service', status: 'available' },
      { title: 'Handling angry customers', status: 'locked' }
    ]
  },
  {
    title: 'Workplace Skills',
    description: 'Enhance day-to-day workplace interactions. Practice performance reviews, team meetings, handling difficult conversations, and responding to workplace challenges.',
    type: 'WEB',
    duration: '60 mins',
    totalLessons: 5,
    subModules: [
      { title: 'Team Meetings', status: 'available' },
      { title: 'Performance Reviews', status: 'locked' }
    ]
  },
  {
    title: 'Employability',
    description: 'Prepare for your next career step. Improve interview performance, tackle stress interviews, get career guidance, and stay sharp with GK and current affairs prep.',
    type: 'WEB',
    duration: '40 mins',
    totalLessons: 4,
    subModules: [
      { title: 'Interview Performance', status: 'available' }
    ]
  },
  {
    title: 'Coaching',
    description: 'Access personal and professional coaching in wellness, branding, financial literacy, and career guidance. Empower yourself with lifelong skills.',
    type: 'WEB',
    duration: '30 mins',
    totalLessons: 3,
    subModules: [
      { title: 'Wellness Coaching', status: 'available' }
    ]
  },
  {
    title: 'Functional Mentoring',
    description: 'Work with performance and subject matter coaches to gain targeted guidance on specific functional skills and career growth.',
    type: 'WEB',
    duration: '60 mins',
    totalLessons: 5,
    subModules: [
      { title: 'Subject Matter Coaching', status: 'available' }
    ]
  }
];

const seedData = async () => {
  try {
    await Module.deleteMany(); // Clear existing modules
    await Module.insertMany(seedModules);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
