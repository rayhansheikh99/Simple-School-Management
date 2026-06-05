const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: [
    'https://edumanage.site',
    'http://edumanage.site',
    'http://localhost:5000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3000'
  ],
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve Static Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// 🛠️ UNIVERSAL ROUTER: Webuzo-র ডবল বা সিঙ্গেল পাথ জট খোলার জন্য বিশেষ ট্রিক
const mainRouter = express.Router();

mainRouter.use('/auth', require('./routes/authRoutes'));
mainRouter.use('/notices', require('./routes/noticeRoutes'));
mainRouter.use('/teachers', require('./routes/teacherRoutes'));
mainRouter.use('/results', require('./routes/resultRoutes'));
mainRouter.use('/contact', require('./routes/contactRoutes'));
mainRouter.use('/gallery', require('./routes/galleryRoutes'));
mainRouter.use('/registrations', require('./routes/registrationRoutes'));
mainRouter.use('/settings', require('./routes/settingRoutes'));

mainRouter.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Demo Govt. Model Pilot High School API!',
    status: 'online',
    version: '1.0.0'
  });
});

// এই দুটি লাইন একই সাথে দেওয়ার কারণে /api/notices এবং শুধু /notices দুটিই কাজ করবে
app.use('/', mainRouter);
app.use('/api', mainRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(err.stack);
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 30156;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});