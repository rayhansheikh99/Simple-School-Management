const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const sanitizeInput = require('./middleware/sanitizeMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Secure HTTP headers with helmet
app.use(helmet({
  contentSecurityPolicy: false, // Disabled temporarily to prevent blocking public CDNs used by the frontend
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enable CORS
app.use(cors({
  origin: (origin, callback) => {
    // In development mode, allow any origin (including null for file://)
    if (process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      const allowedOrigins = [
        'http://localhost:5000',
        'http://localhost:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5501',
        'http://nobomallikamodelacademy.edu.bd',
        'https://nobomallikamodelacademy.edu.bd'
      ];
      if (!origin || allowedOrigins.includes(origin) || origin === 'null') {
        callback(null, true);
      } else {
        callback(null, false);
      }
    }
  },
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve Static Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Global Input Sanitization Middleware to prevent stored XSS
app.use(sanitizeInput);

// Global General Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // Limit each IP to 500 requests per 15 minutes
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// 🛠️ UNIVERSAL ROUTER: Webuzo-র ডবল বা সিঙ্গেল পাথ জট খোলার জন্য বিশেষ ট্রিক
const mainRouter = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // Max 15 login attempts per 15 mins
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Max 10 form submissions per 15 mins
  message: { success: false, message: 'Too many form submissions. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

mainRouter.use('/auth', loginLimiter, require('./routes/authRoutes'));
mainRouter.use('/notices', require('./routes/noticeRoutes'));
mainRouter.use('/teachers', require('./routes/teacherRoutes'));
mainRouter.use('/results', require('./routes/resultRoutes'));
mainRouter.use('/contact', formLimiter, require('./routes/contactRoutes'));
mainRouter.use('/gallery', require('./routes/galleryRoutes'));
mainRouter.use('/registrations', require('./routes/registrationRoutes'));
mainRouter.use('/settings', require('./routes/settingRoutes'));
mainRouter.use('/committee', require('./routes/committeeRoutes'));

mainRouter.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Nobomallika Model Academy API!',
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
console.log('port:', PORT)
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});