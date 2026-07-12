/* ============================================================
   নবমল্লিকা মডেল একাডেমী
   Dynamic Results Notice Board Loader
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const resultListContainer = document.querySelector('.result-list');
  const classFilterSelect = document.getElementById('class-filter-select');

  if (!resultListContainer) return;

  const classMapping = {
    all: { label: 'সকল শ্রেণি', badgeClass: 'notice-item__badge--academic' },
    play: { label: 'প্লে', badgeClass: 'notice-item__badge--academic' },
    nursery: { label: 'নার্সারি', badgeClass: 'notice-item__badge--academic' },
    kg: { label: 'কেজি', badgeClass: 'notice-item__badge--academic' },
    '1': { label: 'প্রথম শ্রেণি', badgeClass: 'notice-item__badge--academic' },
    '2': { label: 'দ্বিতীয় শ্রেণি', badgeClass: 'notice-item__badge--academic' },
    '3': { label: 'তৃতীয় শ্রেণি', badgeClass: 'notice-item__badge--academic' },
    '4': { label: 'চতুর্থ শ্রেণি', badgeClass: 'notice-item__badge--academic' },
    '5': { label: 'পঞ্চম শ্রেণি', badgeClass: 'notice-item__badge--academic' },
    '6': { label: 'ষষ্ঠ শ্রেণি', badgeClass: 'notice-item__badge--exam' },
    '7': { label: 'সপ্তম শ্রেণি', badgeClass: 'notice-item__badge--event' },
    '8': { label: 'অষ্টম শ্রেণি', badgeClass: 'notice-item__badge--academic' },
    '9': { label: 'নবম শ্রেণি', badgeClass: 'notice-item__badge--admin' },
    '10': { label: '১০ম শ্রেণি', badgeClass: 'notice-item__badge--exam' },
    '11': { label: 'একাদশ শ্রেণি', badgeClass: 'notice-item__badge--exam' },
    '12': { label: 'দ্বাদশ শ্রেণি', badgeClass: 'notice-item__badge--exam' }
  };

  // Create Modal Element dynamically in the DOM
  const modalHtml = `
    <div class="notice-modal" id="result-details-modal">
      <div class="notice-modal-container">
        <button class="notice-modal__close" id="close-result-modal">&times;</button>
        <div class="notice-modal__header">
          <div class="notice-modal__badge-row">
            <span class="notice-item__badge notice-item__badge--academic" id="modal-class-badge">১০ম শ্রেণি</span>
          </div>
          <h2 class="notice-modal__title" id="modal-title">ফলাফল নোটিশ</h2>
          <div class="notice-modal__meta" id="modal-meta">📅 ২৬ মে ২০২৬ | পরীক্ষার বছর: ২০২৬</div>
        </div>
        <div class="notice-modal__body">
          <div class="notice-modal__content-text" id="modal-content">ফলাফল বিবরণ</div>
          <div class="notice-modal__attachment" id="modal-attachment-section" style="display: none;">
            <h4 class="notice-modal__attachment-title">📎 সংযুক্তি ফাইল (PDF / ছবি)</h4>
            <div class="notice-modal__iframe-wrapper">
              <iframe class="notice-modal__pdf-iframe" id="modal-pdf-viewer" src=""></iframe>
            </div>
            <a href="" class="btn btn--primary" id="modal-download-btn" target="_blank" style="justify-content: center; width: 100%;">📥 ফলাফল ডাউনলোড করুন</a>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const resultModal = document.getElementById('result-details-modal');
  const modalClose = document.getElementById('close-result-modal');
  const modalClassBadge = document.getElementById('modal-class-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalMeta = document.getElementById('modal-meta');
  const modalContent = document.getElementById('modal-content');
  const attachmentSection = document.getElementById('modal-attachment-section');
  const pdfViewer = document.getElementById('modal-pdf-viewer');
  const downloadBtn = document.getElementById('modal-download-btn');

  function showResultModal(resultItem) {
    const classDetails = classMapping[resultItem.class] || { label: `${resultItem.class}ম শ্রেণি`, badgeClass: 'notice-item__badge--academic' };
    
    // Set text contents
    modalTitle.textContent = resultItem.title;
    modalContent.textContent = resultItem.content;
    
    const formattedDate = formatBengaliDate(resultItem.date);
    const formattedYear = toBengaliNumerals(resultItem.year);
    modalMeta.textContent = `📅 ${formattedDate} | পরীক্ষার বছর: ${formattedYear}`;
    
    // Set class badge
    modalClassBadge.textContent = classDetails.label;
    modalClassBadge.className = `notice-item__badge ${classDetails.badgeClass}`;
    
    // Handle attachment
    if (resultItem.pdfUrl) {
      const mediaUrl = getMediaUrl(resultItem.pdfUrl);
      pdfViewer.src = mediaUrl;
      downloadBtn.href = mediaUrl;
      attachmentSection.style.display = 'block';
    } else {
      pdfViewer.src = '';
      attachmentSection.style.display = 'none';
    }
    
    // Open Modal
    resultModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeResultModal() {
    resultModal.classList.remove('active');
    document.body.style.overflow = '';
    // Clear pdf viewer source to stop downloading
    pdfViewer.src = '';
  }

  modalClose.addEventListener('click', closeResultModal);
  resultModal.addEventListener('click', (e) => {
    if (e.target === resultModal) {
      closeResultModal();
    }
  });

  // Keep all fetched results in global list for quick lookups
  let allFetchedResults = [];

  // Function to render results list
  async function renderResults(className = 'all', targetResultId = null) {
    // Show Loading Skeleton / Indicator
    resultListContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 0; color: #555; width: 100%;">
        <div class="loader-spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary, #1c69b5); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
        <p>ফলাফল লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
      </div>
    `;

    // Fetch results from backend
    const results = await fetchPublicResults(className);
    allFetchedResults = results;

    if (results.length === 0) {
      resultListContainer.innerHTML = `
        <div class="not-found-card">
          <h3>📭 কোন ফলাফল নোটিশ পাওয়া যায়নি অথবা এখনও যুক্ত করা হয়নি</h3>
          <p>Results not found or not yet published</p>
        </div>
      `;
      return;
    }

    // Build results list items HTML
    let resultsHTML = '';
    results.forEach(res => {
      const resDate = new Date(res.date);
      const day = toBengaliNumerals(resDate.getDate());
      
      const months = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
      const monthYear = `${months[resDate.getMonth()]} ${toBengaliNumerals(resDate.getFullYear().toString().substring(2))}`;

      const classDetails = classMapping[res.class] || { label: `${res.class}ম শ্রেণি`, badgeClass: 'notice-item__badge--academic' };
      const classLabel = classDetails.label;
      const classBadge = classDetails.badgeClass;

      // Action buttons
      const actionButtons = `
        <div style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn--primary btn--sm btn-view-result" data-id="${res._id}">👁️ বিস্তারিত দেখুন</button>
          ${res.pdfUrl ? `<a href="${getMediaUrl(res.pdfUrl)}" class="btn btn--secondary btn--sm" target="_blank">📥 ডাউনলোড (PDF)</a>` : ''}
        </div>
      `;

      resultsHTML += `
        <div class="notice-item animate-on-scroll visible" id="result-${res._id}" style="opacity: 1; transform: translateY(0); cursor: pointer;">
          <div class="notice-item__date-box">
            <span class="notice-item__day">${day}</span>
            <span class="notice-item__month">${monthYear}</span>
          </div>

          <div class="notice-item__content" style="flex: 1;">
            <h3>${res.title}</h3>
            <p>${res.content.substring(0, 150)}${res.content.length > 150 ? '...' : ''}</p>
            ${actionButtons}
          </div>
          <span class="notice-item__badge ${classBadge}">${classLabel}</span>
        </div>
      `;
    });

    resultListContainer.innerHTML = resultsHTML;

    // Attach click listeners to result cards to open modal
    const resultItems = resultListContainer.querySelectorAll('.notice-item');
    resultItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // Prevent opening if clicking on an anchor tag or button
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
          return;
        }
        const resId = item.getAttribute('id').replace('result-', '');
        const selectedRes = allFetchedResults.find(r => r._id === resId);
        if (selectedRes) {
          showResultModal(selectedRes);
        }
      });
    });

    // Attach click listeners to specific View buttons
    const viewButtons = resultListContainer.querySelectorAll('.btn-view-result');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const resId = btn.getAttribute('data-id');
        const selectedRes = allFetchedResults.find(r => r._id === resId);
        if (selectedRes) {
          showResultModal(selectedRes);
        }
      });
    });

    // Trigger target result modal if matched from hash on direct navigate
    if (targetResultId) {
      const selectedRes = results.find(r => r._id === targetResultId);
      if (selectedRes) {
        showResultModal(selectedRes);
      }
    }
  }

  // Handle initial page load with potential hash routing
  let initialResultId = null;
  const hash = window.location.hash;
  if (hash && hash.startsWith('#result-')) {
    initialResultId = hash.replace('#result-', '');
  }

  // Load all results on initial page render
  await renderResults('all', initialResultId);

  // Add change listener to class filter select dropdown
  if (classFilterSelect) {
    classFilterSelect.addEventListener('change', async (e) => {
      const className = e.target.value;
      await renderResults(className);
    });
  }
});

// CSS Injection for dynamic loading spinner
if (!document.getElementById('results-custom-spinner-css')) {
  const style = document.createElement('style');
  style.id = 'results-custom-spinner-css';
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
}
