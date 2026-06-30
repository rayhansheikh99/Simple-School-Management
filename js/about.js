/* ============================================================
   গ্রিনফিল্ড একাডেমি
   Dynamic Committee Page Loader
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const committeeContainer = document.getElementById('committee-container');

  if (!committeeContainer) return;

  // Show loading spinner
  committeeContainer.innerHTML = `
    <div style="text-align: center; padding: 40px 0; color: #555; grid-column: 1 / -1; width: 100%;">
      <div class="loader-spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary, #1c69b5); border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
      <p>ম্যানেজিং কমিটি লোড হচ্ছে...</p>
    </div>
  `;

  // Fetch committee members from backend
  const members = await fetchCommitteeMembers();

  if (members.length === 0) {
    committeeContainer.innerHTML = `
      <div class="not-found-card" style="grid-column: 1 / -1; margin: 0;">
        <p>ম্যানেজিং কমিটির কোনো তথ্য পাওয়া যায়নি (Data not found)</p>
      </div>
    `;
    return;
  }

  // Ensure container wrapper has table styling class
  committeeContainer.className = 'committee-table-wrapper animate-on-scroll visible';

  // Helper to remove emojis from text for clean list design
  const cleanEmojis = (str) => {
    if (!str) return '';
    return str.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();
  };

  let htmlContent = `
    <table class="committee-table">
      <thead>
        <tr>
          <th>নাম</th>
          <th>ক্যাটাগরি</th>
          <th>পদবী</th>
        </tr>
      </thead>
      <tbody>
  `;

  members.forEach((member) => {
    const cleanedHeader = cleanEmojis(member.header);
    const cleanedDesignation = cleanEmojis(member.designation);

    htmlContent += `
      <tr>
        <td>
          <div class="committee-table__member">
            <img src="${getMediaUrl(member.photo)}" alt="${member.name}" class="committee-table__avatar" onerror="this.onerror=null; this.src='${getMediaUrl('assets/images/default_teacher.png')}';">
            <span class="committee-table__name">${member.name}</span>
          </div>
        </td>
        <td>${cleanedHeader}</td>
        <td>${cleanedDesignation}</td>
      </tr>
    `;
  });

  htmlContent += `
      </tbody>
    </table>
  `;

  committeeContainer.innerHTML = htmlContent;
});
