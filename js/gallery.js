/* ============================================================
   ব্লুমিং ফ্লাওয়ার ইন্টারন্যাশনাল কলেজ
   Dynamic Gallery Loader
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const galleryGrid = document.querySelector('.gallery-grid');
  const filterButtons = document.querySelectorAll('#gallery-filter .filter-btn');

  if (!galleryGrid) return;

  const categoryMapping = {
    'সকল': 'all',
    'অনুষ্ঠান': 'events',
    'ক্রীড়া': 'sports',
    'সাংস্কৃতিক': 'events',
    'ক্যাম্পাস': 'campus'
  };

  async function renderGallery(category = 'all') {
    galleryGrid.innerHTML = `
      <div style="text-align: center; padding: 40px 0; color: #555; grid-column: 1 / -1; width: 100%;">
        <div class="loader-spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary, #1c69b5); border-radius: 50%; width: 35px; height: 35px; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
        <p>ছবি লোড হচ্ছে...</p>
      </div>
    `;

    const items = await fetchGalleryItems(category);

    if (items.length === 0) {
      galleryGrid.innerHTML = `
        <div class="not-found-card" style="grid-column: 1 / -1; margin: 0;">
          <p>কোন তথ্য পাওয়া যায়নি অথবা এখনও যুক্ত করা হয়নি (Data not found or not yet added)</p>
        </div>
      `;
      return;
    }

    let galleryHTML = '';
    const isHomePage = filterButtons.length === 0;
    const itemsToShow = isHomePage ? items.slice(0, 6) : items;

    itemsToShow.forEach((item, index) => {
      galleryHTML += `
        <div class="gallery-item animate-on-scroll delay-${(index % 3) + 1} visible" id="gallery-${item._id}" style="opacity: 1; transform: translateY(0);">
          <img src="${getMediaUrl(item.image)}" alt="${item.title || 'গ্যালারি ছবি'}">
          <div class="gallery-item__overlay">
            <span class="gallery-item__caption">${item.title || 'গ্যালারি ছবি'}</span>
          </div>
        </div>
      `;
    });

    galleryGrid.innerHTML = galleryHTML;

    // Re-bind Lightbox events because grid is re-rendered
    bindLightboxEvents();
  }

  // Bind lightbox trigger events
  function bindLightboxEvents() {
    const items = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;

    if (items.length > 0 && lightbox && lightboxImg) {
      items.forEach(item => {
        item.addEventListener('click', function () {
          const img = this.querySelector('img');
          if (img) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
        });
      });
    }
  }

  // Lightbox Close Events
  const lightbox = document.querySelector('.lightbox');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Initial Load
  await renderGallery('all');

  // Filter Buttons Click Events
  filterButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      filterButtons.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      const text = btn.textContent.trim();
      const category = categoryMapping[text] || 'all';
      await renderGallery(category);
    });
  });
});
