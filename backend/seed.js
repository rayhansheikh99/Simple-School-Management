const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load Models
const User = require('./models/User');
const Notice = require('./models/Notice');
const Teacher = require('./models/Teacher');
const Result = require('./models/Result');
const GalleryItem = require('./models/GalleryItem');

// Load config
dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/demo_school');
    console.log('Connected! Purging old data...');

    // Clear old datasets
    await User.deleteMany();
    await Notice.deleteMany();
    await Teacher.deleteMany();
    await Result.deleteMany();
    await GalleryItem.deleteMany();

    console.log('Purge completed. Seeding default Admin user...');

    // 1. Seed Admin User
    const adminUser = await User.create({
      username: 'admin',
      password: 'password123',
      role: 'admin'
    });
    console.log(`Admin User seeded! Username: "admin" | Password: "password123"`);

    // 1.1 Seed Viewer User (Read-Only)
    const viewerUser = await User.create({
      username: 'user',
      password: 'pass123',
      role: 'viewer'
    });
    console.log(`Viewer User seeded! Username: "user" | Password: "pass123"`);

    // 2. Seed Mock Notices (From notices.html)
    console.log('Seeding mock notices...');
    const mockNotices = [
      {
        title: 'বার্ষিক পরীক্ষার সূচি প্রকাশ - ২০২৬',
        content: 'ষষ্ঠ থেকে দশম শ্রেণির বার্ষিক পরীক্ষা আগামী ১ জুলাই থেকে শুরু হবে। বিস্তারিত সূচি অফিস থেকে সংগ্রহ করুন।',
        category: 'exam',
        date: new Date('2026-05-26')
      },
      {
        title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৬',
        content: 'আগামী ৩০ মে বিদ্যালয় মাঠে বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত হবে। সকল শিক্ষার্থীর উপস্থিতি বাধ্যতামূলক।',
        category: 'event',
        date: new Date('2026-05-25')
      },
      {
        title: 'অর্ধ-বার্ষিক পরীক্ষার ফলাফল প্রকাশ',
        content: 'ষষ্ঠ থেকে নবম শ্রেণির অর্ধ-বার্ষিক পরীক্ষার ফলাফল প্রকাশিত হয়েছে। ফলাফল অফিস/ওয়েবসাইট থেকে দেখুন।',
        category: 'academic',
        date: new Date('2026-05-20')
      },
      {
        title: 'বিজ্ঞান মেলা ২০২৬ - নিবন্ধন',
        content: 'আন্তঃবিদ্যালয় বিজ্ঞান মেলায় অংশগ্রহণের জন্য আগামী ২০ মে এর মধ্যে বিজ্ঞান বিভাগে নিবন্ধন করুন।',
        category: 'academic',
        date: new Date('2026-05-15')
      },
      {
        title: 'গ্রীষ্মকালীন ছুটির নোটিশ',
        content: 'আগামী ১৫ জুন থেকে ৩০ জুন পর্যন্ত গ্রীষ্মকালীন ছুটি থাকবে। ১ জুলাই থেকে নিয়মিত ক্লাস শুরু।',
        category: 'academic',
        date: new Date('2026-05-10')
      },
      {
        title: 'অভিভাবক সমাবেশ - মে ২০২৬',
        content: 'আগামী ১২ মে, বৃহস্পতিবার সকাল ১০টায় বিদ্যালয় মিলনায়তনে অভিভাবক সমাবেশ অনুষ্ঠিত হবে।',
        category: 'event',
        date: new Date('2026-05-05')
      },
      {
        title: 'নতুন শিক্ষক নিয়োগ বিজ্ঞপ্তি',
        content: 'গণিত ও ইংরেজি বিভাগে সহকারী শিক্ষক পদে নিয়োগ দেওয়া হবে। আগ্রহী প্রার্থীরা ১৫ মে এর মধ্যে আবেদন করুন।',
        category: 'admin',
        date: new Date('2026-05-01')
      },
      {
        title: 'জাতীয় শিক্ষা সপ্তাহ উদযাপন',
        content: 'আগামী ১-৭ মে জাতীয় শিক্ষা সপ্তাহ উপলক্ষে বিভিন্ন প্রতিযোগিতা ও সাংস্কৃতিক অনুষ্ঠানের আয়োজন করা হয়েছে।',
        category: 'event',
        date: new Date('2026-04-25')
      }
    ];
    await Notice.insertMany(mockNotices);
    console.log('Notices seeded!');

    // 3. Seed Teachers (From teachers.html & index.html)
    console.log('Seeding teachers list...');
    const mockTeachers = [
      {
        name: 'জনাব মোঃ দেলোয়ার হোসেন',
        designation: 'প্রধান শিক্ষক',
        subject: 'প্রশাসন',
        qualifications: 'বি.এ. (সম্মান), এম.এ., বি.এড',
        photo: 'assets/images/headteacher_photo.png',
        type: 'head',
        order: 1
      },
      {
        name: 'জনাব মোঃ রফিকুল ইসলাম',
        designation: 'সহকারী প্রধান শিক্ষক',
        subject: 'গণিত',
        qualifications: 'বি.এসসি (গণিত), এম.এসসি, বি.এড',
        photo: 'assets/images/chairman_photo.png',
        type: 'assistant',
        order: 2
      },
      {
        name: 'উম্মে হাবিবা',
        designation: 'সহকারী শিক্ষক',
        subject: 'বাংলা',
        qualifications: 'বি.এ. (বাংলা), এম.এ.',
        photo: 'assets/images/teachers_grid.png',
        type: 'assistant',
        order: 3
      },
      {
        name: 'জনাব নাহিদ হাসান',
        designation: 'সহকারী শিক্ষক',
        subject: 'ইংরেজি',
        qualifications: 'বি.এ. (ইংরেজি), এম.এ.',
        photo: 'assets/images/headteacher_photo.png',
        type: 'assistant',
        order: 4
      },
      {
        name: 'জনাব শাহ আলম',
        designation: 'সহকারী শিক্ষক',
        subject: 'পদার্থবিজ্ঞান',
        qualifications: 'বি.এসসি (পদার্থ), এম.এসসি',
        photo: 'assets/images/chairman_photo.png',
        type: 'assistant',
        order: 5
      },
      {
        name: 'জনাব আব্দুল করিম',
        designation: 'সহকারী শিক্ষক',
        subject: 'রসায়ন',
        qualifications: 'বি.এসসি (রসায়ন), এম.এসসি',
        photo: 'assets/images/teachers_grid.png',
        type: 'assistant',
        order: 6
      },
      {
        name: 'ফাতেমা বেগম',
        designation: 'সহকারী শিক্ষক',
        subject: 'জীববিজ্ঞান',
        qualifications: 'বি.এসসি (উদ্ভিদবিজ্ঞান), এম.এসসি',
        photo: 'assets/images/headteacher_photo.png',
        type: 'assistant',
        order: 7
      },
      {
        name: 'জনাব মিজানুর রহমান',
        designation: 'সহকারী শিক্ষক',
        subject: 'ইতিহাস',
        qualifications: 'বি.এ. (ইতিহাস), এম.এ.',
        photo: 'assets/images/chairman_photo.png',
        type: 'assistant',
        order: 8
      },
      {
        name: 'নাসরিন আক্তার',
        designation: 'সহকারী শিক্ষক',
        subject: 'ভূগোল',
        qualifications: 'বি.এস.এস (ভূগোল), এম.এস.এস',
        photo: 'assets/images/teachers_grid.png',
        type: 'assistant',
        order: 9
      },
      {
        name: 'জনাব হাসান মাহমুদ',
        designation: 'সহকারী শিক্ষক',
        subject: 'তথ্য ও যোগাযোগ প্রযুক্তি',
        qualifications: 'বি.এসসি (সিএসই)',
        photo: 'assets/images/headteacher_photo.png',
        type: 'assistant',
        order: 10
      },
      {
        name: 'সেলিনা পারভীন',
        designation: 'সহকারী শিক্ষক',
        subject: 'ইসলাম শিক্ষা',
        qualifications: 'বি.এ. (ইসলামিক স্টাডিজ), এম.এ.',
        photo: 'assets/images/chairman_photo.png',
        type: 'assistant',
        order: 11
      }
    ];
    await Teacher.insertMany(mockTeachers);
    console.log('Teachers seeded!');

    // 4. Seed Academic Results (From results.html class 10 science)
    console.log('Seeding mock results...');
    const mockResults = [
      { studentName: 'মোঃ আরিফুল ইসলাম', roll: 101, class: '10', section: 'A', department: 'science', examType: 'half-yearly', year: 2026, totalMarks: 952, grade: 'A+', gpa: 5.00 },
      { studentName: 'ফাতিমা আক্তার', roll: 102, class: '10', section: 'A', department: 'science', examType: 'half-yearly', year: 2026, totalMarks: 938, grade: 'A+', gpa: 5.00 },
      { studentName: 'মোঃ সাকিব হাসান', roll: 103, class: '10', section: 'A', department: 'science', examType: 'half-yearly', year: 2026, totalMarks: 915, grade: 'A+', gpa: 5.00 },
      { studentName: 'নুসরাত জাহান', roll: 104, class: '10', section: 'A', department: 'science', examType: 'half-yearly', year: 2026, totalMarks: 889, grade: 'A', gpa: 4.50 },
      { studentName: 'মোঃ তানভীর আহমেদ', roll: 105, class: '10', section: 'A', department: 'science', examType: 'half-yearly', year: 2026, totalMarks: 875, grade: 'A', gpa: 4.36 },
      { studentName: 'সুমাইয়া ইসলাম', roll: 106, class: '10', section: 'A', department: 'science', examType: 'half-yearly', year: 2026, totalMarks: 860, grade: 'A', gpa: 4.21 },
      { studentName: 'মোঃ রাকিবুল হাসান', roll: 107, class: '10', section: 'A', department: 'science', examType: 'half-yearly', year: 2026, totalMarks: 842, grade: 'A', gpa: 4.10 },
      { studentName: 'আয়েশা সিদ্দিকা', roll: 108, class: '10', section: 'A', department: 'science', examType: 'half-yearly', year: 2026, totalMarks: 820, grade: 'A-', gpa: 3.85 },
      { studentName: 'মোঃ ইমরান হোসেন', roll: 109, class: '10', section: 'A', department: 'science', examType: 'half-yearly', year: 2026, totalMarks: 805, grade: 'A-', gpa: 3.72 },
      { studentName: 'রুমানা আফরিন', roll: 110, class: '10', section: 'A', department: 'science', examType: 'half-yearly', year: 2026, totalMarks: 790, grade: 'A-', gpa: 3.60 }
    ];
    await Result.insertMany(mockResults);
    console.log('Results seeded!');

    // 5. Seed Gallery Items (From gallery.html & index.html)
    console.log('Seeding gallery media...');
    const mockGallery = [
      { title: 'বিদ্যালয় ভবন', image: 'assets/images/hero_banner.png', mediaType: 'image', category: 'campus' },
      { title: 'সাংস্কৃতিক অনুষ্ঠান', image: 'assets/images/gallery_events.png', mediaType: 'image', category: 'events' },
      { title: 'আমাদের শিক্ষকবৃন্দ', image: 'assets/images/teachers_grid.png', mediaType: 'image', category: 'academic' },
      { title: 'পুরস্কার বিতরণী অনুষ্ঠান', image: 'assets/images/chairman_photo.png', mediaType: 'image', category: 'events' },
      { title: 'বিজ্ঞান মেলা ২০২৬', image: 'assets/images/gallery_events.png', mediaType: 'image', category: 'events' },
      { title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা', image: 'assets/images/hero_banner.png', mediaType: 'image', category: 'sports' }
    ];
    await GalleryItem.insertMany(mockGallery);
    console.log('Gallery seeded!');

    console.log('Seeding Database Completed Successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data: ', error);
    process.exit(1);
  }
};

seedData();
