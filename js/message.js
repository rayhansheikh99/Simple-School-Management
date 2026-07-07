/* ============================================================
   ব্লুমিং ফ্লাওয়ার ইন্টারন্যাশনাল কলেজ
   Dynamic Single Committee Message Loader
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('message-details-container');
  if (!container) return;

  // Get ID from URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const memberId = urlParams.get('id');

  if (!memberId) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 0; color: var(--color-error, #ef4444); font-weight: bold;">
        <p>ভুল লিংক! কোনো পরিচালকের আইডি পাওয়া যায়নি।</p>
        <a href="/" class="btn btn--primary btn--sm" style="margin-top: 15px; display: inline-flex;">হোম পেজে ফিরে যান</a>
      </div>
    `;
    return;
  }

  const staticMembers = {
    founder: {
      name: 'খালেদ মোশারফ',
      designation: 'উপদেষ্টা',
      header: 'উপদেষ্টার কথা',
      photo: 'assets/images/founder.png',
      message: `সম্মানিত অভিভাবকবৃন্দ আস্সালামু আলাইকুম। পুর্ণাঙ্গ শিক্ষা ও পাঠদান একটি জটিল প্রক্রিয়া। শিক্ষা প্রতিষ্ঠান হলো জ্ঞান দান করার অন্যতম মাধ্যম এবং সুশিক্ষার জন্য সহায়ক। জ্ঞান অর্জন মানুষের জীবনের শ্রেষ্ঠ অর্জন। জ্ঞান অর্জনের জন্য গুণগত শিক্ষা প্রতিষ্ঠান অপরিহার্য। সমগ্র বাংলাদেশের মানুষ বিভিন্ন শিক্ষা প্রতিষ্ঠানের সঙ্গে পরিচিত। বর্তমান সময়োপযোগী আধুনিক বিশ্বের জ্ঞান-বিজ্ঞান অনুশীলনে মেধার বিকল্প নেই। বর্তমান সৃজনশীল শিক্ষা ব্যবস্থার সাথে সংগতি রেখে সক্রিয়ভাবে শিক্ষার্থীর মাঝে (বেসিক) মৌলিক শিক্ষায় জ্ঞান দানে ক্যাডেট ও গুণগত প্রতিষ্ঠানের ন্যায় প্রতিযোগিতামূলক ফলাফল ইতিমধ্যে ব্লুমিং ফ্লাওয়ার ইন্টারন্যাশনাল কলেজ কোমলমতি ছাত্র-ছাত্রীদের সহজ উপায় অবলম্বনসহ যত্ন সহকারে বাস্তবে দায়িত্ব পালন ও ধারাবাহিক কর্ম করে আসছে।

প্রতিষ্ঠানটি স্থাপনে যারা সক্রিয়ভাবে সহযোগিতা করেছেন তাদের নিকট কৃতজ্ঞ। আমাকে যারা উৎসাহ ও প্রেরণা জুগিয়েছেন এবং আন্তরিক সহযোগিতা করেছেন তাদের ধন্যবাদ এবং যাদের উদ্দেশ্যে প্রতিষ্ঠানটি স্থাপন করা হয়েছে তাদের স্বার্থ রক্ষা হলেই আমার শ্রম সার্থক মনে করি। আমাদের সত্যকে স্বীকার করতে হবে। কর্মের ফল কখনো বৃথা যায় না। তাই আমাদের কর্ম হোক সুন্দর। তাই আমরা হতে চাই শীর্ষ ফলাফলের গর্বিত সন্তানের গর্বিত পিতা-মাতা। অনেক সতর্কতা সত্ত্বেও ভুলত্রুটি থাকা অসম্ভব নয়। তাই ভুলগুলিকে সুন্দর দৃষ্টিতে দেখার জন্য আমি কৃতজ্ঞ।

পরিশেষে সকলের দোয়া কামনা করছি।

ধন্যবাদান্তে
<strong>খালেদ মোশারফ</strong>
উপদেষ্টা`
    },
    director: {
      name: 'ডাঃ মাহাথির মুহাম্মদ আসিফ',
      designation: 'পরিচালক',
      header: 'পরিচালকের কথা',
      photo: 'assets/images/director.png',
      message: `বড় আদরের প্রিয় শিক্ষার্থী আস্থাপূর্ণ সম্মানিত অভিভাবক, অভিজ্ঞ শিক্ষক-শিক্ষিকাবৃন্দ, সচেতন বুদ্ধিজীবি শিক্ষাবান্ধব শুভাকাঙ্ক্ষী সুধীবৃন্দ, আপনাদের প্রতি বিনম্র শ্রদ্ধা জ্ঞাপন করছি। শুভকামনা করছি। আপনারা জানেন যে, ১৯৯২ খ্রীঃ শিক্ষা সুবিধা বঞ্চিত এলাকা থাকা সত্ত্বেও অভিভাবকের লালিত স্বপ্ন, মাইল ফলক পদক্ষেপ, কাঙ্ক্ষিত ইচ্ছা পূরণে গুণগত শিক্ষা-সেবার মান দুর্বল/সবল প্রতিটি শিক্ষার্থীর বেসিক সুপ্ত প্রতিভা অর্জনের স্বার্থে যা যা প্রয়োজন প্রায় তিনযুগ যাবৎ নির্ভীক ও আন্তরিকতার সহিত বাস্তবে সময়োপযোগী পদক্ষেপ গ্রহণ করছি।

তারই বহিঃপ্রকাশ সমগ্র ঢাকা বোর্ডে <strong>৩</strong> বার (বোর্ডস্ট্যান্ড) বোর্ডট্যালেন্টপুল বৃত্তি জাতীয় মেধাস্থান <strong>৫৫, ৩৩, ৬৫</strong> অর্জন করছি। <strong>গোল্ডেন A+</strong> সহ দীর্ঘ <strong>২৬</strong> বছর যাবৎ ধারাবাহিক বাঁধভাঙা শীর্ষ ফলাফল ও শতভাগ পাস ঢাকা বোর্ডকে দিতে পেরে আপনাদের সাথে নিয়ে নিজেদেরকে সৌভাগ্যবান মনে করছি।

২০২৫ সালের অসাধারণ বাঁধভাঙা <strong>গোল্ডেন A+</strong> সহ শতভাগ পাস তাই প্রমাণ করে। বেশি দাবি করছি না। সত্য চিরকালই সত্য। বাগানে অনেক মালি থাকতে পারে কিন্তু বড় ফুল ফোটানোর দক্ষতা সবার সমান নয়।

প্রিয় সুধীবৃন্দ, অত্র বিদ্যালয়ের বাঁধভাঙা ফলাফল নতুন কিছু নয়। অত্র বিদ্যালয়ের শিক্ষার্থী ভর্তি যুদ্ধে <strong>বিসিএস ক্যাডার, ডাক্তার, ইঞ্জিনিয়ার, ম্যাজিস্ট্রেট, টিএনও, ব্যারিস্টার, অ্যাডভোকেট সহ</strong> দেশের ভিতর ও দেশের বাইরে বিভিন্ন পেশাগত দক্ষতায় সেরাদের সেরা বাস্তবে প্রমাণ করে আসছে। দেশের স্বনামধন্য শীর্ষ বিদ্যাপীঠ <strong>নটর ডেম কলেজ</strong>, ঢাকা বিশ্ববিদ্যালয়, জাহাঙ্গীর নগর বিশ্ববিদ্যালয়, সকল স্বনামধন্য বিশ্ববিদ্যালয়, মেডিকেল কলেজ, বুয়েট, কুয়েট, চুয়েট, ঢাকা কলেজ, রাজউক কলেজ সহ দেশের শীর্ষ শিক্ষা প্রতিষ্ঠানে ভর্তি যুদ্ধে প্রায় ২২০০+ শিক্ষার্থী যোগ্যতা প্রমাণ করে আসছে।

২০২৪ ও ২০২৫ সালের গোল্ডেন <strong>A+</strong> সহ শতভাগ ফলাফল ব্লুমিং ফ্লাওয়ার ইন্টারন্যাশনাল কলেজ, তুরাগবাসী ও উত্তরাবাসীর সম্মান নিঃসন্দেহে বৃদ্ধি করেছে। ব্লুমিং ফ্লাওয়ার ইন্টারন্যাশনাল কলেজ সর্বজন সমাদৃত ও নন্দিত। দক্ষ অভিজ্ঞ শিক্ষকমণ্ডলী সচেতন অভিভাবকবৃন্দ শিক্ষাবান্ধব প্রিয় এলাকাবাসী, তুরাগবাসী ও উত্তরাবাসীর সমন্বিত প্রয়াসে দিন দিন শিক্ষার্থী, অভিভাবকের কাঙ্ক্ষিত ও পছন্দের কেন্দ্র বিন্দুতে পরিণত ও মাইলফলক উন্নয়নে ত্বরান্বিত হয়ে আসছে। যাহা সম্মানিত অভিভাবক, বিজ্ঞ এলাকাবাসী শিক্ষা সংশ্লিষ্ট শিক্ষা বান্ধব তুরাগবাসীর সার্বিক সহযোগীতা ও দোয়ার ভিত্তিতে।

প্রিয় তুরাগবাসী আপনাদের লালিত স্বপ্ন কাঙ্ক্ষিত ইচ্ছাপূরণে শীর্ষ গুণগত শিক্ষা-সেবার মান ধারাবাহিক অব্যাহত রাখতে আপনাদের সহযোগীতা ও দোয়ার বিকল্প নেই। অসাধারণ বাঁধভাঙা জাতীয় শীর্ষ মেধাস্থান ও শতভাগ ফলাফলের অব্যাহত শীর্ষ মেধাস্থানের ঐতিহ্যের সন্ধানে বাস্তব নির্ভীক শিক্ষা প্রতিষ্ঠান ব্লুমিং ফ্লাওয়ার ইন্টারন্যাশনাল কলেজ আরো একধাপ অগ্রযাত্রায় সম্মানিত অভিভাবকগণ এলাকাবাসী, তুরাগবাসী ও উত্তরাবাসীর অবদান কৃতজ্ঞতার সহিত স্মরণ করছি। শুভকামনা। শুভেচ্ছা ও বিনম্র শ্রদ্ধা জ্ঞাপন করছি।

ধন্যবাদান্তে-
<strong>ডাঃ মাহাথির মুহাম্মদ আসিফ</strong>
এম বি বি এস (ঢাকা), এম.পি.এইচ, সিসিডি (বারডেম)
প্রাক্তন নটরডেমিয়ান
(বোর্ডস্ট্যান্ড), বোর্ড ট্যালেন্টপুল বৃত্তি প্রাপ্ত জাতীয় মেধাস্থান-৫৫
<strong>পরিচালক</strong>
<strong>ব্লুমিং ফ্লাওয়ার ইন্টারন্যাশনাল কলেজ</strong>`
    },
    principal: {
      name: 'নাছিমা আক্তার',
      designation: 'অধ্যক্ষ',
      header: 'অধ্যক্ষের কথা',
      photo: 'assets/images/principal.png',
      message: `সর্বশক্তিমান আল্লাহর প্রতি একান্ত বিশ্বাস, ধর্মীয় কাজগুলোর নিয়মিত অনুশীলন, মাতা-পিতা ও গুরুজনদের প্রতি ভক্তিশ্রদ্ধা, নিষ্ঠা ও সততার সঙ্গে কর্তব্য সম্পাদন, নিরলস পরিশ্রম, নিরবিচ্ছিন্ন সাধনা, অধ্যবসায় ও দৃঢ় মনোবল সাফল্য লাভের চাবিকাঠি।

পূর্ণাঙ্গ শিক্ষাদান একটি জটিল প্রক্রিয়া। এই প্রক্রিয়ায় অনেকেই জড়িত থাকলেও শিক্ষার্থীর ভূমিকাই প্রধান ও গুরুত্বপূর্ণ। অন্যরা সহায়ক মাত্র। যদি তুমি মনোযোগী হও, তাহলে তুমি সাফল্যের সহিত ভাল ফলাফল করতে সক্ষম হবে। যেমন কর্ম করবে, তেমন ফল পাবে। কর্মের ফল কখনো বৃথা যায় না। বড় আদরের প্রিয় শিক্ষার্থী, তোমরা প্রায় ৩ যুগের গৌরবময় ঐতিহ্যের ধারক ও বাহক। সংকোচের বিহ্বলতা নিজেরই অপমান।

তোমাদের লক্ষ্য হউক Plain living and high thingking.

*তোমাদের শুভ কামনায়*
<strong>নাছিমা আক্তার</strong>
অধ্যক্ষ`
    },
    member: {
      name: 'ডা. শামছুন নাহার অন্তু',
      designation: 'কার্যকারী সদস্য',
      header: 'কার্যকরী সদস্যের কথা',
      photo: 'assets/images/chairman.png',
      message: `আল্লাহর প্রতি অটল বিশ্বাস, নৈতিকতা ও দায়িত্ববোধ একজন মানুষকে সঠিক পথে পরিচালিত করে। জীবনে সফল হতে হলে প্রয়োজন সততা, শৃঙ্খলা এবং নিয়মিত পরিশ্রম। শিক্ষা শুধু জ্ঞান অর্জনের বিষয় নয়, বরং চরিত্র গঠনের একটি গুরুত্বপূর্ণ মাধ্যম। এই প্রক্রিয়ায় শিক্ষক ও অভিভাবক সহায়কের ভূমিকা পালন করেন, তবে শিক্ষার্থীর নিজস্ব আগ্রহ ও চেষ্টা সবচেয়ে বেশি গুরুত্বপূর্ণ। পরিশ্রম ও অধ্যবসায় ছাড়া কোনো লক্ষ্য অর্জন সম্ভব নয়। তাই প্রত্যেককে নিজের কাজে নিষ্ঠাবান ও আত্মবিশ্বাসী হতে হবে। তোমরা তোমাদের দায়িত্ব সঠিকভাবে পালন করলে ভবিষ্যতে সফলতা অবশ্যই অর্জন করবে।`
    }
  };

  try {
    let member;
    if (staticMembers[memberId]) {
      member = staticMembers[memberId];
    } else {
      member = await fetchCommitteeMemberById(memberId);
    }

    if (!member) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 0; color: var(--color-error, #ef4444); font-weight: bold;">
          <p>দুঃখিত, এই ব্যক্তির কোনো বার্তা খুঁজে পাওয়া যায়নি!</p>
          <a href="/" class="btn btn--primary btn--sm" style="margin-top: 15px; display: inline-flex;">হোম পেজে ফিরে যান</a>
        </div>
      `;
      return;
    }

    // Set page title and subtitle dynamically
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    if (pageTitle) pageTitle.textContent = `${member.designation} এর বাণী`;
    if (pageSubtitle) pageSubtitle.textContent = `${member.name} - ${member.designation}, ব্লুমিং ফ্লাওয়ার ইন্টারন্যাশনাল কলেজ`;

    let headerClass = 'message-detail__header';
    let headerWithEmoji = member.header;

    if (member.header.includes('সভাপতি') || member.header.includes('Chairman') || member.header.includes('President') || member.header.includes('চেয়ারম্যান') || member.header.includes('উপদেষ্টা') || member.header.includes('প্রতিষ্ঠাতা')) {
      headerClass += ' message-detail__header--chairman';
      if (!headerWithEmoji.startsWith('🏛️')) {
        headerWithEmoji = '🏛️ ' + headerWithEmoji;
      }
    } else if (member.header.includes('প্রধান শিক্ষক') || member.header.includes('সদস্য সচিব') || member.header.includes('Head') || member.header.includes('পরিচালক')) {
      headerClass += ' message-detail__header--headteacher';
      if (!headerWithEmoji.startsWith('👨‍🏫')) {
        headerWithEmoji = '👨‍🏫 ' + headerWithEmoji;
      }
    } else {
      headerClass += ' message-detail__header--chairman';
      if (!headerWithEmoji.startsWith('👤')) {
        headerWithEmoji = '👤 ' + headerWithEmoji;
      }
    }

    container.innerHTML = `
      <div class="message-detail__card animate-on-scroll visible">
        <div class="${headerClass}">
          ${headerWithEmoji}
        </div>
        <div class="message-detail__body">
          <div class="message-detail__sidebar">
            <img src="${getMediaUrl(member.photo)}" alt="${member.name}" class="message-detail__photo" onerror="this.onerror=null; this.src='${getMediaUrl('assets/images/default_teacher.png')}';">
            <div class="message-detail__info">
              <h2 class="message-detail__name">${member.name}</h2>
              <p class="message-detail__designation">${member.designation}</p>
              <div class="message-detail__divider"></div>
              <p class="message-detail__inst">ব্লুমিং ফ্লাওয়ার ইন্টারন্যাশনাল কলেজ</p>
            </div>
          </div>
          <div class="message-detail__content">
            <div class="message-detail__quote-mark">“</div>
            <div class="message-detail__text">${member.message.replace(/\n/g, '<br>')}</div>
            <div style="margin-top: 30px;">
              <a href="/" class="btn btn--outline btn--sm">← হোমে ফিরে যান</a>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading message details:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 0; color: var(--color-error, #ef4444); font-weight: bold;">
        <p>বার্তা লোড করার সময় একটি ত্রুটি ঘটেছে!</p>
        <a href="/" class="btn btn--primary btn--sm" style="margin-top: 15px; display: inline-flex;">হোম পেজে ফিরে যান</a>
      </div>
    `;
  }
});
