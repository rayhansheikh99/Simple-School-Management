/* ============================================================
   ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়
   Dynamic Results Query & Statistics Loader
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('result-search-form');
  const resultTableWrapper = document.getElementById('result-table');
  const detailedResultsHeader = document.getElementById('detailed-results');

  if (!searchForm || !resultTableWrapper) return;

  // Save the original static table structure so we can restore it on reset
  const originalTableHeader = detailedResultsHeader ? detailedResultsHeader.outerHTML : '';
  const originalTableBody = resultTableWrapper.innerHTML;

  const departmentTranslations = {
    science: 'বিজ্ঞান',
    humanities: 'মানবিক',
    commerce: 'ব্যবসায় শিক্ষা',
    none: 'সাধারণ'
  };

  const examTypeTranslations = {
    'half-yearly': 'অর্ধ-বার্ষিক',
    'annual': 'বার্ষিক',
    'ssc': 'এসএসসি'
  };

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const className = document.getElementById('search-class').value;
    const examType = document.getElementById('search-exam').value;
    const year = document.getElementById('search-year').value;
    const roll = document.getElementById('search-roll').value;

    // Show Loading
    resultTableWrapper.innerHTML = `
      <div style="text-align: center; padding: 40px 0; color: #555; background: #fff; border-radius: 8px; border: 1px solid #eee;">
        <div class="loader-spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary, #1c69b5); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
        <p>ফলাফল অনুসন্ধান করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
      </div>
    `;

    // Query result from backend
    const response = await queryStudentResult(roll, className, examType, year);

    if (!response.success) {
      // Show Error / Empty State
      if (detailedResultsHeader) {
        detailedResultsHeader.querySelector('.section-header__text').textContent = 'অনুসন্ধানের ফলাফল';
      }
      resultTableWrapper.innerHTML = `
        <div style="text-align: center; padding: 50px 0; color: #e74c3c; border: 1px dashed #e74c3c; border-radius: 8px; background: #fff;">
          <span style="font-size: 3rem;">⚠️</span>
          <h3 style="margin-top: 15px; color: #c0392b;">ফলাফল পাওয়া যায়নি!</h3>
          <p style="color: #666; margin-top: 8px; font-weight: bold;">কোন তথ্য পাওয়া যায়নি অথবা এখনও যুক্ত করা হয়নি (Data not found or not yet added)</p>
          <button id="btn-reset-results" class="btn btn--secondary" style="margin-top: 15px; padding: 8px 16px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px;">পূর্ববর্তী তালিকায় ফিরে যান</button>
        </div>
      `;

      document.getElementById('btn-reset-results').addEventListener('click', () => {
        resetToStatic();
      });
      return;
    }

    const studentResult = response.data;

    // Update Header Text to represent Student Report Card
    if (detailedResultsHeader) {
      detailedResultsHeader.querySelector('.section-header__text').textContent = 
        `ব্যক্তিগত নম্বরপত্র: ${studentResult.studentName} (রোল: ${toBengaliNumerals(studentResult.roll)})`;
    }

    const departmentText = departmentTranslations[studentResult.department] || 'সাধারণ';
    const examText = examTypeTranslations[studentResult.examType] || studentResult.examType;

    // Build Premium Dynamic Report Card view instead of a generic table list
    resultTableWrapper.innerHTML = `
      <div class="grade-sheet-container" style="background: #fff; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-top: 4px solid var(--color-primary, #1c69b5); overflow: hidden; max-width: 650px; margin: 0 auto;">
        
        <!-- Header Info -->
        <div style="padding: 24px 30px; background: linear-gradient(to right, #f8faff, #edf3fc); border-bottom: 1px solid #e2eaf8; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <span style="font-size: 0.85rem; color: #777; text-transform: uppercase; font-weight: bold;">শিক্ষার্থীর নাম</span>
            <h4 style="margin: 4px 0 0; color: var(--color-primary, #1c69b5); font-size: 1.25rem;">${studentResult.studentName}</h4>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.85rem; color: #777; text-transform: uppercase; font-weight: bold;">রোল নম্বর</span>
            <h4 style="margin: 4px 0 0; color: #333; font-size: 1.2rem;">${toBengaliNumerals(studentResult.roll)}</h4>
          </div>
          <div>
            <span style="font-size: 0.85rem; color: #777; text-transform: uppercase; font-weight: bold;">শ্রেণি ও বিভাগ</span>
            <p style="margin: 4px 0 0; font-weight: 600; color: #555;">${toBengaliNumerals(studentResult.class)}ম শ্রেণি (${departmentText})</p>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.85rem; color: #777; text-transform: uppercase; font-weight: bold;">পরীক্ষার ধরন ও বছর</span>
            <p style="margin: 4px 0 0; font-weight: 600; color: #555;">${examText} পরীক্ষা - ${toBengaliNumerals(studentResult.year)}</p>
          </div>
        </div>

        <!-- Grade Badges Grid -->
        <div style="padding: 30px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; text-align: center;">
          <div style="padding: 20px; background: #fdfefe; border: 1px solid #eee; border-radius: 6px;">
            <span style="font-size: 0.8rem; color: #888;">মোট প্রাপ্ত নম্বর</span>
            <h2 style="margin: 8px 0 0; color: var(--color-primary, #1c69b5);">${toBengaliNumerals(studentResult.totalMarks)}</h2>
          </div>
          <div style="padding: 20px; background: #fdfefe; border: 1px solid #eee; border-radius: 6px;">
            <span style="font-size: 0.8rem; color: #888;">লেটার গ্রেড</span>
            <h2 style="margin: 8px 0 0; color: #2ecc71;">${studentResult.grade}</h2>
          </div>
          <div style="padding: 20px; background: #fdfefe; border: 1px solid #eee; border-radius: 6px;">
            <span style="font-size: 0.8rem; color: #888;">জিপিএ (GPA)</span>
            <h2 style="margin: 8px 0 0; color: #e67e22;">${toBengaliNumerals(studentResult.gpa.toFixed(2))}</h2>
          </div>
        </div>

        <!-- Reset Button -->
        <div style="padding: 20px; text-align: center; background: #f9f9f9; border-top: 1px solid #eee;">
          <button id="btn-reset-results" class="btn btn--outline" style="padding: 10px 20px; cursor: pointer; font-weight: bold;">← অন্য ফলাফল খুঁজুন</button>
        </div>
      </div>
    `;

    document.getElementById('btn-reset-results').addEventListener('click', () => {
      resetToStatic();
    });
  });

  function resetToStatic() {
    if (detailedResultsHeader) {
      detailedResultsHeader.outerHTML = originalTableHeader;
    }
    resultTableWrapper.innerHTML = originalTableBody;
    searchForm.reset();
  }
});
