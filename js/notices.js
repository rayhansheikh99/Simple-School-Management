/* ============================================================
   ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়
   Dynamic Notices Page Loader
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const noticeListContainer = document.querySelector('.notice-list');
  const filterButtons = document.querySelectorAll('#notice-filter .filter-btn');

  if (!noticeListContainer) return;

  const categoryMapping = {
    all: { label: 'সকল', badgeClass: 'academic' },
    academic: { label: 'একাডেমিক', badgeClass: 'notice-item__badge--academic' },
    exam: { label: 'পরীক্ষা', badgeClass: 'notice-item__badge--exam' },
    event: { label: 'অনুষ্ঠান', badgeClass: 'notice-item__badge--event' },
    admin: { label: 'প্রশাসনিক', badgeClass: 'notice-item__badge--admin' }
  };

  // Function to render notices list
  async function renderNotices(category = 'all') {
    // Show Loading Skeleton / Indicator
    noticeListContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 0; color: #555; width: 100%;">
        <div class="loader-spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary, #1c69b5); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
        <p>নোটিশ লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
      </div>
    `;

    // Fetch notices from backend
    const notices = await fetchNotices(category);

    if (notices.length === 0) {
      noticeListContainer.innerHTML = `
        <div style="text-align: center; padding: 50px 0; color: #e74c3c; width: 100%; border: 1px dashed #ccc; border-radius: 8px; background: #fff;">
          <h3>📭 কোন নোটিশ পাওয়া যায়নি</h3>
          <p>এই বিভাগে বর্তমানে কোন নোটিশ পোস্ট করা নেই।</p>
        </div>
      `;
      return;
    }

    // Build notice list items HTML
    let noticeHTML = '';
    notices.forEach(notice => {
      const noticeDate = new Date(notice.date);
      const day = toBengaliNumerals(noticeDate.getDate());
      
      const months = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
      const monthYear = `${months[noticeDate.getMonth()]} ${toBengaliNumerals(noticeDate.getFullYear().toString().substring(2))}`;

      const catDetails = categoryMapping[notice.category] || { label: 'একাডেমিক', badgeClass: 'notice-item__badge--academic' };
      const categoryLabel = catDetails.label;
      const categoryBadge = catDetails.badgeClass;

      // Check if PDF url exists
      const pdfLink = notice.pdfUrl 
        ? `<div style="margin-top: 10px;"><a href="${getMediaUrl(notice.pdfUrl)}" class="btn btn--secondary btn--sm" target="_blank">📥 নোটিশ ডাউনলোড (PDF)</a></div>`
        : '';

      noticeHTML += `
        <div class="notice-item animate-on-scroll visible" id="notice-${notice._id}" style="opacity: 1; transform: translateY(0);">
          <div class="notice-item__date-box">
            <span class="notice-item__day">${day}</span>
            <span class="notice-item__month">${monthYear}</span>
          </div>
          <div class="notice-item__content">
            <h3>${notice.title}</h3>
            <p>${notice.content}</p>
            ${pdfLink}
          </div>
          <span class="notice-item__badge ${categoryBadge}">${categoryLabel}</span>
        </div>
      `;
    });

    noticeListContainer.innerHTML = noticeHTML;
  }

  // Load all notices on initial page render
  await renderNotices('all');

  // Add click listeners to filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      // Toggle active classes
      filterButtons.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      const id = btn.getAttribute('id');
      const category = id.replace('filter-', ''); // e.g. "filter-academic" -> "academic"
      await renderNotices(category);
    });
  });
});

// CSS Injection for dynamic loading spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .btn--sm {
    padding: 6px 12px;
    font-size: 0.85rem;
    border-radius: 4px;
    display: inline-block;
  }
`;
document.head.appendChild(style);
