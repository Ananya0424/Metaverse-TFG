const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/modules', require('./routes/moduleRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    } else {
      next();
    }
  });
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://ananya:Ananya%4024@cluster0.fc2jsu2.mongodb.net/?appName=Cluster0')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
