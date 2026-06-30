/* ============================================================
   গ্রিনফিল্ড একাডেমি
   Dynamic Teachers Page Loader (List/Table Format)
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const headteacherContainer = document.getElementById('headteacher-list-container');
  const assistantsContainer = document.getElementById('asst-teachers-list-container');

  if (!headteacherContainer || !assistantsContainer) return;

  // Show loaders
  const loadingHTML = `
    <div style="text-align: center; padding: 30px 0; color: #555; width: 100%;">
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
      <div class="not-found-card">
        <p>কোন তথ্য পাওয়া যায়নি অথবা এখনও যুক্ত করা হয়নি (Data not found or not yet added)</p>
      </div>
    `;
    headteacherContainer.innerHTML = errorHTML;
    assistantsContainer.innerHTML = errorHTML;
    return;
  }

  // Separate Headteacher vs Assistant Teachers
  const headteachers = teachers.filter(t => t.type === 'head');
  const assistants = teachers.filter(t => t.type === 'assistant');

  const typeMapping = {
    head: 'প্রধান শিক্ষক',
    assistant: 'সহকারী শিক্ষক',
    staff: 'স্টাফ'
  };

  // Render Headteacher
  if (headteachers.length > 0) {
    let htHTML = `
      <table class="teachers-table">
        <thead>
          <tr>
            <th>নাম</th>
            <th>পদবী</th>
            <th>শিক্ষাগত যোগ্যতা</th>
            <th>বিষয়</th>
          </tr>
        </thead>
        <tbody>
    `;
    headteachers.forEach(ht => {
      htHTML += `
        <tr id="teacher-${ht._id}">
          <td data-label="নাম">
            <span class="teachers-table__name">${ht.name}</span>
          </td>
          <td data-label="পদবী">${typeMapping[ht.type] || 'প্রধান শিক্ষক'}</td>
          <td data-label="শিক্ষাগত যোগ্যতা">${ht.qualifications || '-'}</td>
          <td data-label="বিষয়"><span class="teachers-table__badge">${ht.subject || '-'}</span></td>
        </tr>
      `;
    });
    htHTML += `
        </tbody>
      </table>
    `;
    headteacherContainer.innerHTML = htHTML;
  } else {
    headteacherContainer.innerHTML = '<div class="not-found-card"><p>প্রধান শিক্ষক: কোন তথ্য পাওয়া যায়নি অথবা এখনও যুক্ত করা হয়নি (Data not found or not yet added)</p></div>';
  }

  // Render Assistant Teachers
  if (assistants.length > 0) {
    let astHTML = `
      <table class="teachers-table">
        <thead>
          <tr>
            <th>নাম</th>
            <th>পদবী</th>
            <th>শিক্ষাগত যোগ্যতা</th>
            <th>বিষয়</th>
          </tr>
        </thead>
        <tbody>
    `;
    assistants.forEach((ast) => {
      astHTML += `
        <tr id="teacher-${ast._id}">
          <td data-label="নাম">
            <span class="teachers-table__name">${ast.name}</span>
          </td>
          <td data-label="পদবী">${typeMapping[ast.type] || 'সহকারী শিক্ষক'}</td>
          <td data-label="শিক্ষাগত যোগ্যতা">${ast.qualifications || '-'}</td>
          <td data-label="বিষয়"><span class="teachers-table__badge">${ast.subject || '-'}</span></td>
        </tr>
      `;
    });
    astHTML += `
        </tbody>
      </table>
    `;
    assistantsContainer.innerHTML = astHTML;
  } else {
    assistantsContainer.innerHTML = '<div class="not-found-card"><p>সহকারী শিক্ষক: কোন তথ্য পাওয়া যায়নি অথবা এখনও যুক্ত করা হয়নি (Data not found or not yet added)</p></div>';
  }
});
