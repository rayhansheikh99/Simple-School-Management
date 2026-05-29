/* ============================================================
   ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়
   Frontend Client API Connector
   ============================================================ */

const API_BASE_URL = 'http://localhost:5000/api';
const UPLOADS_BASE_URL = 'http://localhost:5000';

// Helper: Translate digits to Bengali numerals
function toBengaliNumerals(num) {
  if (num === null || num === undefined) return '';
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(digit => {
    const index = englishDigits.indexOf(digit);
    return index !== -1 ? bengaliDigits[index] : digit;
  }).join('');
}

// Helper: Format date in Bengali standard
function formatBengaliDate(dateStr) {
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const date = new Date(dateStr);
  const day = toBengaliNumerals(date.getDate());
  const month = months[date.getMonth()];
  const year = toBengaliNumerals(date.getFullYear().toString().substring(2));
  return `${day} ${month} ${year}`;
}

// 1. Fetch notices
async function fetchNotices(category = 'all', limit = null) {
  try {
    let url = `${API_BASE_URL}/notices?category=${category}`;
    if (limit) url += `&limit=${limit}`;
    
    const response = await fetch(url);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching notices:', error);
    return [];
  }
}

// 2. Fetch teachers list
async function fetchTeachers() {
  try {
    const response = await fetch(`${API_BASE_URL}/teachers`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
}

// 3. Search Result
async function queryStudentResult(roll, className, examType, year) {
  try {
    const url = `${API_BASE_URL}/results/search?roll=${roll}&class=${className}&examType=${examType}&year=${year}`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error querying results:', error);
    return { success: false, message: 'সার্ভার সংযোগ বিচ্ছিন্ন। দয়া করে পরে আবার চেষ্টা করুন।' };
  }
}

// 4. Submit Contact Message
async function sendContactMessage(name, email, phone, subject, message) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, phone, subject, message })
    });
    return await response.json();
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, message: 'সার্ভার সংযোগ ত্রুটি। বার্তা পাঠানো সম্ভব হয়নি।' };
  }
}

// 5. Fetch Gallery Items
async function fetchGalleryItems(category = 'all') {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery?category=${category}`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
}

// Helper: Resolve image/photo paths safely
function getMediaUrl(photoPath) {
  if (!photoPath) return 'assets/images/default_teacher.png';
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://') || photoPath.startsWith('assets/')) {
    return photoPath;
  }
  return `${UPLOADS_BASE_URL}/${photoPath}`;
}
