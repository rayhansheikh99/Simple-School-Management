/* ============================================================
   ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়
   Dynamic Home Page Loader
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  // Select homepage elements
  const tickerContent = document.querySelector('.ticker__content');
  const mainNoticeCard = document.getElementById('notice-card-main');
  const recentEventsList = document.querySelector('#events-section + .notice-list');
  const homeTeachersGrid = document.querySelector('.teachers-section .teachers-grid');

  // Load Dynamic Notices (Ticker, Highlights, & Events)
  if (tickerContent || mainNoticeCard || recentEventsList) {
    const notices = await fetchNotices('all', 6); // Fetch top 6 notices

    if (notices.length > 0) {
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
      if (recentEventsList && notices.length > 1) {
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
      }
    }
  }

  // Load Dynamic Home Page Teachers Grid
  if (homeTeachersGrid) {
    const teachers = await fetchTeachers();

    if (teachers.length > 0) {
      // Show top 5 teachers (Head + first 4 assistants)
      const homeTeachers = teachers.slice(0, 5);
      let teachersHTML = '';
      
      const typeMapping = {
        head: 'প্রধান শিক্ষক',
        assistant: 'সহকারী শিক্ষক',
        staff: 'স্টাফ'
      };

      homeTeachers.forEach((teacher, index) => {
        teachersHTML += `
          <div class="teacher-card animate-on-scroll delay-${(index % 4) + 1} visible" id="teacher-${teacher._id}" style="opacity: 1; transform: translateY(0);">
            <div class="teacher-card__photo-wrapper">
              <img src="${getMediaUrl(teacher.photo)}" alt="${teacher.name}" class="teacher-card__photo">
            </div>
            <div class="teacher-card__info">
              <div class="teacher-card__name">${teacher.name}</div>
              <div class="teacher-card__designation">${typeMapping[teacher.type] || 'সহকারী শিক্ষক'} | 📱 ${teacher.phone}</div>
              <span class="teacher-card__subject">${teacher.subject}</span>
            </div>
          </div>
        `;
      });
      homeTeachersGrid.innerHTML = teachersHTML;
    }
  }

  // Load Dynamic Committee Messages (Chairman & Head Teacher)
  const homeMessagesContainer = document.getElementById('home-messages-container');
  if (homeMessagesContainer) {
    const members = await fetchCommitteeMembers();
    // Filter members that have messages
    const membersWithMessages = members.filter(m => m.message && m.message.trim() !== '');

    if (membersWithMessages.length > 0) {
      let messagesHTML = '';
      membersWithMessages.forEach(member => {
        let headerClass = 'message-card__header';
        let headerWithEmoji = member.header;

        if (member.header.includes('সভাপতি') || member.header.includes('Chairman') || member.header.includes('President') || member.header.includes('চেয়ারম্যান')) {
          headerClass += ' message-card__header--chairman';
          if (!headerWithEmoji.startsWith('🏛️')) {
            headerWithEmoji = '🏛️ ' + headerWithEmoji;
          }
        } else if (member.header.includes('প্রধান শিক্ষক') || member.header.includes('সদস্য সচিব') || member.header.includes('Head')) {
          headerClass += ' message-card__header--headteacher';
          if (!headerWithEmoji.startsWith('👨‍🏫')) {
            headerWithEmoji = '👨‍🏫 ' + headerWithEmoji;
          }
        } else {
          headerClass += ' message-card__header--chairman';
          if (!headerWithEmoji.startsWith('👤')) {
            headerWithEmoji = '👤 ' + headerWithEmoji;
          }
        }

        messagesHTML += `
          <div class="message-card animate-on-scroll visible" id="member-${member._id}" style="opacity: 1; transform: translateY(0);">
            <div class="${headerClass}">
              ${headerWithEmoji}
            </div>
            <div class="message-card__body">
              <img src="${getMediaUrl(member.photo)}" alt="${member.name}" class="message-card__photo" onerror="this.onerror=null; this.src='${getMediaUrl('assets/images/default_teacher.png')}';">
              <div class="message-card__content">
                <div class="message-card__name">${member.name}</div>
                <div class="message-card__designation">${member.designation}</div>
                <p class="message-card__text">${member.message}</p>
              </div>
            </div>
          </div>
        `;
      });
      homeMessagesContainer.innerHTML = messagesHTML;
    } else {
      homeMessagesContainer.innerHTML = '';
      homeMessagesContainer.style.display = 'none';
    }
  }
});
