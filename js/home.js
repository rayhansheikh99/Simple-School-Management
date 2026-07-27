/* ============================================================
   নবমল্লিকা মডেল একাডেমী
   Dynamic Home Page Loader
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  // Select homepage elements
  const tickerContent = document.querySelector('.ticker__content');
  const mainNoticeCard = document.getElementById('notice-card-main');
  const recentEventsList = document.querySelector('#events-section + .notice-list');
  const homeTeachersGrid = document.getElementById('home-teachers-list-container');

  // Load Dynamic Notices (Ticker, Highlights, & Events)
  if (tickerContent || mainNoticeCard || recentEventsList) {
    const notices = await fetchNotices('all', 6); // Fetch top 6 notices

    if (notices && notices.length > 0) {
      // 1. Render Ticker Content
      if (tickerContent) {
        let tickerHTML = '';
        notices.slice(0, 5).forEach(notice => {
          tickerHTML += `<span class="ticker__item">${notice.title}</span>`;
        });

        // Populate and duplicate for seamless marquee loops
        tickerContent.innerHTML = tickerHTML + tickerHTML;
      }

      // 2. Render Main Highlight Card
      if (mainNoticeCard) {
        const latestNotice = notices[0];
        const dateStr = formatBengaliDate(latestNotice.date);

        mainNoticeCard.innerHTML = `
          <img src="assets/images/hero_banner.png" alt="বিদ্যালয়ের সাম্প্রতিক কার্যক্রম" class="notice-card__image">
          <div class="notice-card__body">
            <span class="notice-card__date">📅 ${dateStr}</span>
            <h3 class="notice-card__title"><a href="notices.html#notice-${latestNotice._id}">${latestNotice.title}</a></h3>
            <p class="notice-card__text">${latestNotice.content.substring(0, 180)}...</p>
            <a href="notices.html#notice-${latestNotice._id}" class="notice-card__more">আরও পড়ুন →</a>
          </div>
        `;
      }

      // 3. Render Next 3 Recent Events/Notices
      if (recentEventsList) {
        if (notices.length > 1) {
          let eventHTML = '';
          const recentNotices = notices.slice(1, 4); // Next 3 notices

          const categoryMapping = {
            academic: { label: 'একাডেমিক', badgeClass: 'notice-item__badge--academic' },
            exam: { label: 'পরীক্ষা', badgeClass: 'notice-item__badge--exam' },
            event: { label: 'অনুষ্ঠান', badgeClass: 'notice-item__badge--event' },
            admin: { label: 'প্রশাসনিক', badgeClass: 'notice-item__badge--admin' }
          };

          const months = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];

          recentNotices.forEach((notice, idx) => {
            const noticeDate = new Date(notice.date);
            const day = toBengaliNumerals(noticeDate.getDate());
            const monthYear = `${months[noticeDate.getMonth()]} ${toBengaliNumerals(noticeDate.getFullYear().toString().substring(2))}`;

            const catDetails = categoryMapping[notice.category] || { label: 'একাডেমিক', badgeClass: 'notice-item__badge--academic' };

            eventHTML += `
              <div class="notice-item animate-on-scroll visible" id="event-${notice._id}" style="opacity: 1; transform: translateY(0); cursor: pointer;" onclick="window.location.href='notices.html#notice-${notice._id}'">
                <div class="notice-item__date-box">
                  <span class="notice-item__day">${day}</span>
                  <span class="notice-item__month">${monthYear}</span>
                </div>
                <div class="notice-item__content" style="flex: 1;">
                  <h3>${notice.title}</h3>
                  <p>${notice.content.substring(0, 60)}...</p>
                </div>
                <span class="notice-item__badge ${catDetails.badgeClass}">${catDetails.label}</span>
              </div>
            `;
          });
          recentEventsList.innerHTML = eventHTML;
        } else {
          recentEventsList.innerHTML = '';
          const eventsSection = document.getElementById('events-section');
          if (eventsSection) eventsSection.style.display = 'none';
        }
      }

      // 4. Render Sidebar Notices Card
      const sidebarNotices = document.getElementById('sidebar-notices');
      if (sidebarNotices) {
        const sidebarBody = sidebarNotices.querySelector('.sidebar-card__body');
        if (sidebarBody) {
          let sidebarHTML = '';
          notices.slice(0, 5).forEach(notice => {
            sidebarHTML += `<a href="notices.html#notice-${notice._id}" class="sidebar-link sidebar-link--notice">${notice.title}</a>`;
          });
          sidebarBody.innerHTML = sidebarHTML;
        }
      }
    } else {
      // Hide all notice components if none exist
      const tickerEl = document.getElementById('ticker');
      if (tickerEl) tickerEl.style.display = 'none';

      if (mainNoticeCard) mainNoticeCard.style.display = 'none';

      if (recentEventsList) {
        recentEventsList.innerHTML = '';
        const eventsSection = document.getElementById('events-section');
        if (eventsSection) eventsSection.style.display = 'none';
      }

      const sidebarNotices = document.getElementById('sidebar-notices');
      if (sidebarNotices) sidebarNotices.style.display = 'none';
    }
  }

  // Load Dynamic Home Page Teachers Grid
  if (homeTeachersGrid) {
    const teachers = await fetchTeachers();

    if (teachers && teachers.length > 0) {
      // Show top 5 teachers (Head + first 4 assistants)
      const homeTeachers = teachers.slice(0, 5);
      let teachersHTML = `
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
      `;

      const typeMapping = {
        head: 'প্রধান শিক্ষক',
        assistant_head: 'সহকারী প্রধান শিক্ষক',
        assistant: 'সহকারী শিক্ষক',
        third_class_staff: 'তৃতীয় শ্রেণীর কর্মচারী',
        fourth_class_staff: 'চতুর্থ শ্রেণীর কর্মচারী',
        staff: 'স্টাফ'
      };

      homeTeachers.forEach((teacher) => {
        teachersHTML += `
          <tr id="teacher-${teacher._id}">
            <td data-label="ছবি"><img src="${getMediaUrl(teacher.photo)}" alt="${teacher.name}" class="teachers-table__avatar" onerror="this.onerror=null; this.src='${getMediaUrl('assets/images/default_teacher.png')}';"></td>
            <td data-label="নাম"><span class="teachers-table__name">${teacher.name}</span></td>
            <td data-label="পদবী">${typeMapping[teacher.type] || 'সহকারী শিক্ষক'}</td>
            <td data-label="শিক্ষাগত যোগ্যতা">${teacher.qualifications || '-'}</td>
            <td data-label="বিষয়"><span class="teachers-table__badge">${teacher.subject || '-'}</span></td>
          </tr>
        `;
      });
      teachersHTML += `
          </tbody>
        </table>
      `;
      homeTeachersGrid.innerHTML = teachersHTML;
    } else {
      homeTeachersGrid.innerHTML = '';
      const teachersSection = document.getElementById('teachers-section');
      if (teachersSection) teachersSection.style.display = 'none';
    }
  }

  // Load Dynamic Home Page Gallery Grid
  const homeGalleryGrid = document.querySelector('.gallery-section .gallery-grid');
  if (homeGalleryGrid) {
    if (typeof fetchGalleryItems === 'function') {
      const items = await fetchGalleryItems('all');
      if (items && items.length > 0) {
        const topItems = items.slice(0, 6); // Limit to top 6
        let galleryHTML = '';
        topItems.forEach((item, index) => {
          galleryHTML += `
            <div class="gallery-item animate-on-scroll delay-${(index % 3) + 1} visible" id="gallery-${item._id}" style="opacity: 1; transform: translateY(0);">
              <img src="${getMediaUrl(item.image)}" alt="${item.title || 'গ্যালারি ছবি'}">
              <div class="gallery-item__overlay">
                <span class="gallery-item__caption">${item.title || 'গ্যালারি ছবি'}</span>
              </div>
            </div>
          `;
        });
        homeGalleryGrid.innerHTML = galleryHTML;
      } else {
        homeGalleryGrid.innerHTML = '';
        const gallerySection = document.getElementById('gallery-section');
        if (gallerySection) gallerySection.style.display = 'none';
      }
    }
  }

});
