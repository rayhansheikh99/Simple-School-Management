/* ============================================================
   ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়
   Dynamic Teachers Page Loader
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const headteacherContainer = document.querySelector('#headteacher-section + .teachers-grid');
  const assistantsContainer = document.querySelector('#asst-teachers-section + .teachers-grid');

  if (!headteacherContainer || !assistantsContainer) return;

  // Show loaders
  const loadingHTML = `
    <div style="text-align: center; padding: 20px 0; color: #555; grid-column: 1 / -1; width: 100%;">
      <div class="loader-spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary, #1c69b5); border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
      <p>লোড হচ্ছে...</p>
    </div>
  `;
  headteacherContainer.innerHTML = loadingHTML;
  assistantsContainer.innerHTML = loadingHTML;

  // Fetch teachers from backend
  const teachers = await fetchTeachers();

  if (teachers.length === 0) {
    const errorHTML = `
      <div style="text-align: center; padding: 30px 0; color: #e74c3c; grid-column: 1 / -1; width: 100%;">
        <p>শিক্ষকবৃন্দের তালিকা লোড করা সম্ভব হয়নি।</p>
      </div>
    `;
    headteacherContainer.innerHTML = errorHTML;
    assistantsContainer.innerHTML = errorHTML;
    return;
  }

  // Separate Headteacher vs Assistant Teachers
  const headteachers = teachers.filter(t => t.type === 'head');
  const assistants = teachers.filter(t => t.type === 'assistant');

  // Render Headteacher
  if (headteachers.length > 0) {
    let htHTML = '';
    headteachers.forEach(ht => {
      htHTML += `
        <div class="teacher-card animate-on-scroll visible" id="teacher-${ht._id}" style="opacity: 1; transform: translateY(0);">
          <div class="teacher-card__photo-wrapper">
            <img src="${getMediaUrl(ht.photo)}" alt="${ht.name}" class="teacher-card__photo">
          </div>
          <div class="teacher-card__info">
            <div class="teacher-card__name">${ht.name}</div>
            <div class="teacher-card__designation">${ht.designation}</div>
            <span class="teacher-card__subject">${ht.qualifications || ht.subject}</span>
          </div>
        </div>
      `;
    });
    headteacherContainer.innerHTML = htHTML;
  } else {
    headteacherContainer.innerHTML = '<div style="text-align: center; grid-column: 1/-1;">কোন প্রধান শিক্ষক পাওয়া যায়নি।</div>';
  }

  // Render Assistant Teachers
  if (assistants.length > 0) {
    let astHTML = '';
    assistants.forEach((ast, index) => {
      astHTML += `
        <div class="teacher-card animate-on-scroll delay-${(index % 4) + 1} visible" id="teacher-${ast._id}" style="opacity: 1; transform: translateY(0);">
          <div class="teacher-card__photo-wrapper">
            <img src="${getMediaUrl(ast.photo)}" alt="${ast.name}" class="teacher-card__photo">
          </div>
          <div class="teacher-card__info">
            <div class="teacher-card__name">${ast.name}</div>
            <div class="teacher-card__designation">${ast.designation}</div>
            <span class="teacher-card__subject">${ast.subject}</span>
          </div>
        </div>
      `;
    });
    assistantsContainer.innerHTML = astHTML;
  } else {
    assistantsContainer.innerHTML = '<div style="text-align: center; grid-column: 1/-1;">কোন সহকারী শিক্ষক পাওয়া যায়নি।</div>';
  }
});
