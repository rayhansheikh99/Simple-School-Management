/* ============================================================
   নবমল্লিকা মডেল একাডেমী
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

  // Create Modal Element dynamically in the DOM
  const modalHtml = `
    <div class="notice-modal" id="notice-details-modal">
      <div class="notice-modal-container">
        <button class="notice-modal__close" id="close-notice-modal">&times;</button>
        <div class="notice-modal__header">
          <div class="notice-modal__badge-row">
            <span class="notice-item__badge notice-item__badge--academic" id="modal-category-badge">একাডেমিক</span>
          </div>
          <h2 class="notice-modal__title" id="modal-title">নোটিশ শিরোনাম</h2>
          <div class="notice-modal__meta" id="modal-date">📅 ২৬ মে ২০২৬</div>
        </div>
        <div class="notice-modal__body">
          <div class="notice-modal__content-text" id="modal-content">নোটিশ বিবরণ</div>
          <div class="notice-modal__attachment" id="modal-attachment-section" style="display: none;">
            <h4 class="notice-modal__attachment-title">📎 সংযুক্তি ফাইল (PDF / ছবি)</h4>
            <div class="notice-modal__iframe-wrapper">
              <iframe class="notice-modal__pdf-iframe" id="modal-pdf-viewer" src=""></iframe>
            </div>
            <a href="" class="btn btn--primary" id="modal-download-btn" target="_blank" style="justify-content: center; width: 100%;">📥 ফাইলটি ডাউনলোড করুন</a>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const noticeModal = document.getElementById('notice-details-modal');
  const modalClose = document.getElementById('close-notice-modal');
  const modalBadge = document.getElementById('modal-category-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalDate = document.getElementById('modal-date');
  const modalContent = document.getElementById('modal-content');
  const attachmentSection = document.getElementById('modal-attachment-section');
  const pdfViewer = document.getElementById('modal-pdf-viewer');
  const downloadBtn = document.getElementById('modal-download-btn');

  function showNoticeModal(notice) {
    const catDetails = categoryMapping[notice.category] || { label: 'একাডেমিক', badgeClass: 'notice-item__badge--academic' };
    
    // Set text contents
    modalTitle.textContent = notice.title;
    modalContent.textContent = notice.content;
    modalDate.textContent = `📅 ${formatBengaliDate(notice.date)}`;
    
    // Set category badge
    modalBadge.textContent = catDetails.label;
    modalBadge.className = `notice-item__badge ${catDetails.badgeClass}`;
    
    // Handle attachment
    if (notice.pdfUrl) {
      const mediaUrl = getMediaUrl(notice.pdfUrl);
      pdfViewer.src = mediaUrl;
      downloadBtn.href = mediaUrl;
      attachmentSection.style.display = 'block';
    } else {
      pdfViewer.src = '';
      attachmentSection.style.display = 'none';
    }
    
    // Open Modal
    noticeModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeNoticeModal() {
    noticeModal.classList.remove('active');
    document.body.style.overflow = '';
    // Clear pdf viewer source to stop downloading
    pdfViewer.src = '';
  }

  modalClose.addEventListener('click', closeNoticeModal);
  noticeModal.addEventListener('click', (e) => {
    if (e.target === noticeModal) {
      closeNoticeModal();
    }
  });

  // Keep all fetched notices in global list for quick lookups
  let allFetchedNotices = [];

  // Function to render notices list
  async function renderNotices(category = 'all', targetNoticeId = null) {
    // Show Loading Skeleton / Indicator
    noticeListContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 0; color: #555; width: 100%;">
        <div class="loader-spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary, #1c69b5); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
        <p>নোটিশ লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
      </div>
    `;

    // Fetch notices from backend
    const notices = await fetchNotices(category);
    allFetchedNotices = notices;

    if (notices.length === 0) {
      noticeListContainer.innerHTML = `
        <div class="not-found-card">
          <h3>📭 কোন তথ্য পাওয়া যায়নি অথবা এখনও যুক্ত করা হয়নি</h3>
          <p>Data not found or not yet added</p>
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

      // Action buttons
      const actionButtons = `
        <div style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn--primary btn--sm btn-view-notice" data-id="${notice._id}">👁️ বিস্তারিত দেখুন</button>
          ${notice.pdfUrl ? `<a href="${getMediaUrl(notice.pdfUrl)}" class="btn btn--secondary btn--sm" target="_blank">📥 ডাউনলোড (PDF)</a>` : ''}
        </div>
      `;

      noticeHTML += `
        <div class="notice-item animate-on-scroll visible" id="notice-${notice._id}" style="opacity: 1; transform: translateY(0); cursor: pointer;">
          <div class="notice-item__date-box">
            <span class="notice-item__day">${day}</span>
            <span class="notice-item__month">${monthYear}</span>
          </div>
          <div class="notice-item__content" style="flex: 1;">
            <h3>${notice.title}</h3>
            <p>${notice.content.substring(0, 150)}${notice.content.length > 150 ? '...' : ''}</p>
            ${actionButtons}
          </div>
          <span class="notice-item__badge ${categoryBadge}">${categoryLabel}</span>
        </div>
      `;
    });

    noticeListContainer.innerHTML = noticeHTML;

    // Attach click listeners to notice cards to open modal
    const noticeItems = noticeListContainer.querySelectorAll('.notice-item');
    noticeItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // Prevent opening if clicking on an anchor tag or button
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
          return;
        }
        const noticeId = item.getAttribute('id').replace('notice-', '');
        const selectedNotice = allFetchedNotices.find(n => n._id === noticeId);
        if (selectedNotice) {
          showNoticeModal(selectedNotice);
        }
      });
    });

    // Attach click listeners to specific View buttons
    const viewButtons = noticeListContainer.querySelectorAll('.btn-view-notice');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const noticeId = btn.getAttribute('data-id');
        const selectedNotice = allFetchedNotices.find(n => n._id === noticeId);
        if (selectedNotice) {
          showNoticeModal(selectedNotice);
        }
      });
    });

    // Trigger target notice modal if matched from hash on direct navigate
    if (targetNoticeId) {
      const selectedNotice = notices.find(n => n._id === targetNoticeId);
      if (selectedNotice) {
        showNoticeModal(selectedNotice);
      }
    }
  }

  // Handle initial page load with potential hash routing
  let initialNoticeId = null;
  const hash = window.location.hash;
  if (hash && hash.startsWith('#notice-')) {
    initialNoticeId = hash.replace('#notice-', '');
  }

  // Load all notices on initial page render
  await renderNotices('all', initialNoticeId);

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
