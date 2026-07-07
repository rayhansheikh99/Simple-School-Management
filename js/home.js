/* ============================================================
   ব্লুমিং ফ্লাওয়ার ইন্টারন্যাশনাল কলেজ
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

    // 1. Render Ticker Content
    if (tickerContent) {
      if (notices.length > 0) {
        let tickerHTML = '';
        notices.slice(0, 5).forEach(notice => {
          tickerHTML += `<span class="ticker__item">${notice.title}</span>`;
        });
        tickerContent.innerHTML = tickerHTML + tickerHTML;
      } else {
        tickerContent.innerHTML = '<span class="ticker__item">কোনো সাম্প্রতিক নোটিশ পাওয়া যায়নি।</span>';
      }
    }

    // 2. Render Main Highlight Card
    if (mainNoticeCard) {
      if (notices.length > 0) {
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
      } else {
        mainNoticeCard.innerHTML = `
          <div class="not-found-card" style="text-align: center; padding: 30px 0; color: #555; width: 100%;">
            <p>কোনো সাম্প্রতিক নোটিশ পাওয়া যায়নি (No notices found)</p>
          </div>
        `;
      }
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
        recentEventsList.innerHTML = `
          <div class="not-found-card" style="text-align: center; padding: 20px; color: #555; width: 100%;">
            <p>কোনো অতিরিক্ত সাম্প্রতিক কার্যক্রম পাওয়া যায়নি (No additional activities found)</p>
          </div>
        `;
      }
    }

    // 4. Render Sidebar Notices
    const sidebarNoticesBody = document.querySelector('#sidebar-notices .sidebar-card__body');
    if (sidebarNoticesBody) {
      if (notices.length > 0) {
        let sidebarHTML = '';
        notices.slice(0, 5).forEach(notice => {
          sidebarHTML += `<a href="notices.html#notice-${notice._id}" class="sidebar-link sidebar-link--notice">${notice.title}</a>`;
        });
        sidebarNoticesBody.innerHTML = sidebarHTML;
      } else {
        sidebarNoticesBody.innerHTML = `
          <div style="text-align: center; padding: 15px; color: #666; font-size: 0.85rem;">
            কোনো সাম্প্রতিক নোটিশ পাওয়া যায়নি।
          </div>
        `;
      }
    }
  }

  // Load Dynamic Home Page Teachers Grid
  if (homeTeachersGrid) {
    const teachers = await fetchTeachers();

    if (teachers.length > 0) {
      // Show top 5 teachers (Head + first 4 assistants)
      const homeTeachers = teachers.slice(0, 5);
      let teachersHTML = `
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

      const typeMapping = {
        head: 'প্রধান শিক্ষক',
        assistant: 'সহকারী শিক্ষক',
        staff: 'স্টাফ'
      };

      homeTeachers.forEach((teacher) => {
        teachersHTML += `
          <tr id="teacher-${teacher._id}">
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
      homeTeachersGrid.innerHTML = `
        <div class="not-found-card" style="text-align: center; padding: 30px 0; color: #555; width: 100%;">
          <p>কোন শিক্ষকের তথ্য পাওয়া যায়নি অথবা এখনও যুক্ত করা হয়নি (Data not found or not yet added)</p>
        </div>
      `;
    }
  }

});
