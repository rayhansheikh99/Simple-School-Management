/* ============================================================
   ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়
   Frontend Client API Connector
   ============================================================ */

// ============================================================
// ADMIN PANEL CUTE PRELOADER INJECTION & FADE-OUT (MIN 3 SEC - SESSION INITIAL LOAD ONLY)
// ============================================================
window.triggerAdminPreloader = () => {
  if (document.getElementById('preloader')) return null;

  const preloaderStartTime = Date.now();
  const preloaderDiv = document.createElement('div');
  preloaderDiv.id = 'preloader';
  preloaderDiv.innerHTML = `
    <div class="preloader-bg-blob preloader-bg-blob--1"></div>
    <div class="preloader-bg-blob preloader-bg-blob--2"></div>
    <div class="preloader-content">
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div class="book-loader">
          <div class="book-loader__spine"></div>
          <div class="book-loader__page book-loader__page--left"></div>
          <div class="book-loader__page book-loader__page--right"></div>
          <div class="book-loader__page book-loader__page--flip"></div>
        </div>
        <p class="preloader-subtitle">
          <span class="preloader-dots"><span></span><span></span><span></span></span>
        </p>
      </div>
    </div>
  `;
  document.body.prepend(preloaderDiv);

  const hidePreloader = (onComplete) => {
    const elapsed = Date.now() - preloaderStartTime;
    const delay = Math.max(3000 - elapsed, 0);

    setTimeout(() => {
      preloaderDiv.classList.add('fade-out');
      setTimeout(() => {
        preloaderDiv.remove();
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, 500);
    }, delay);
  };

  return hidePreloader;
};


const API_BASE_URL = (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.hostname === '' || 
  window.location.protocol === 'file:'
)
  ? 'http://localhost:5000/api'
  : 'https://edumanage.site/api';

const UPLOADS_BASE_URL = (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.hostname === '' || 
  window.location.protocol === 'file:'
)
  ? 'http://localhost:5000'
  : 'https://edumanage.site/api';


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

// 3.1 Fetch Public Results
async function fetchPublicResults(className = 'all') {
  try {
    const url = `${API_BASE_URL}/results/public?class=${className}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching public results:', error);
    return [];
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

// 6. Submit Student Registration (public — uses FormData for photo upload)
async function submitRegistration(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      body: formData   // No Content-Type header — browser sets multipart boundary
    });
    return await response.json();
  } catch (error) {
    console.error('Error submitting registration:', error);
    return { success: false, message: 'সার্ভার সংযোগ ত্রুটি। আবেদন জমা দেওয়া সম্ভব হয়নি।' };
  }
}

// 7. Fetch all registrations (admin)
async function fetchRegistrations(token, status = '') {
  try {
    let url = `${API_BASE_URL}/registrations`;
    if (status) url += `?status=${status}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }
}

// 8. Update registration status (admin)
async function updateRegistrationStatus(id, status, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/registrations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating registration:', error);
    return { success: false, message: 'স্ট্যাটাস আপডেট ব্যর্থ।' };
  }
}

// 9. Delete registration (admin)
async function deleteRegistrationById(id, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/registrations/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting registration:', error);
    return { success: false, message: 'মুছে ফেলা ব্যর্থ।' };
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

// 10. Fetch school settings
async function fetchSettings() {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

// 11. Update school settings (admin)
async function updateSettings(formData, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating settings:', error);
    return { success: false, message: 'সার্ভার সংযোগ ত্রুটি। সেটিংস আপডেট করা সম্ভব হয়নি।' };
  }
}

// Helper: Resolve logo/banner image paths safely with specific fallbacks
function getLogoUrl(logoPath, fallback = 'assets/images/school_logo.png') {
  if (!logoPath) return fallback;
  if (logoPath.includes('hero_bg.jpg')) return 'assets/images/hero_banner.png';
  if (logoPath.startsWith('http://') || logoPath.startsWith('https://') || logoPath.startsWith('assets/')) {
    return logoPath;
  }
  return `${UPLOADS_BASE_URL}/${logoPath}`;
}

