/* ============================================================
   নবমল্লিকা মডেল একাডেমী
   Dynamic Teachers Page Loader (List/Table Format)
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const sections = [
    { type: 'head', containerId: 'headteacher-list-container', headerId: 'headteacher-section', emptyMessage: 'প্রধান শিক্ষক: কোন তথ্য পাওয়া যায়নি অথবা এখনও যুক্ত করা হয়নি' },
    { type: 'assistant_head', containerId: 'assistant-headteacher-list-container', headerId: 'assistant-headteacher-section' },
    { type: 'assistant', containerId: 'asst-teachers-list-container', headerId: 'asst-teachers-section', emptyMessage: 'সহকারী শিক্ষক: কোন তথ্য পাওয়া যায়নি অথবা এখনও যুক্ত করা হয়নি' },
    { type: 'third_class_staff', containerId: 'third-class-staff-list-container', headerId: 'third-class-staff-section' },
    { type: 'fourth_class_staff', containerId: 'fourth-class-staff-list-container', headerId: 'fourth-class-staff-section' }
  ];

  const typeMapping = {
    head: 'প্রধান শিক্ষক',
    assistant_head: 'সহকারী প্রধান শিক্ষক',
    assistant: 'সহকারী শিক্ষক',
    third_class_staff: 'তৃতীয় শ্রেণীর কর্মচারী',
    fourth_class_staff: 'চতুর্থ শ্রেণীর কর্মচারী',
    staff: 'স্টাফ'
  };

  const loadingHTML = `
    <div style="text-align: center; padding: 30px 0; color: #555; width: 100%;">
      <div class="loader-spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary, #1c69b5); border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
      <p>লোড হচ্ছে...</p>
    </div>
  `;

  const renderTeacherTable = (teachers) => `
    <table class="teachers-table">
      <thead>
        <tr>
          <th>ছবি</th>
          <th>নাম</th>
          <th>পদবী</th>
          <th>শিক্ষাগত যোগ্যতা</th>
          <th>বিষয়</th>
        </tr>
      </thead>
      <tbody>
        ${teachers.map((teacher) => `
          <tr id="teacher-${teacher._id}">
            <td data-label="ছবি"><img src="${getMediaUrl(teacher.photo)}" alt="${teacher.name}" class="teachers-table__avatar" onerror="this.onerror=null; this.src='${getMediaUrl('assets/images/default_teacher.png')}';"></td>
            <td data-label="নাম"><span class="teachers-table__name">${teacher.name}</span></td>
            <td data-label="পদবী">${typeMapping[teacher.type] || 'স্টাফ'}</td>
            <td data-label="শিক্ষাগত যোগ্যতা">${teacher.qualifications || '-'}</td>
            <td data-label="বিষয়"><span class="teachers-table__badge">${teacher.subject || '-'}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  const availableSections = sections.map((section) => ({
    ...section,
    container: document.getElementById(section.containerId),
    header: document.getElementById(section.headerId)
  })).filter((section) => section.container && section.header);

  if (availableSections.length === 0) return;

  availableSections.forEach(({ container }) => {
    container.innerHTML = loadingHTML;
  });

  const teachers = await fetchTeachers();

  availableSections.forEach(({ type, container, header, emptyMessage }) => {
    const teachersForType = teachers.filter((teacher) => teacher.type === type);

    if (teachersForType.length > 0) {
      header.style.display = '';
      container.style.display = '';
      container.innerHTML = renderTeacherTable(teachersForType);
    } else if (emptyMessage) {
      header.style.display = '';
      container.style.display = '';
      container.innerHTML = `<div class="not-found-card"><p>${emptyMessage} (Data not found or not yet added)</p></div>`;
    } else {
      header.style.display = 'none';
      container.style.display = 'none';
      container.innerHTML = '';
    }
  });
});
