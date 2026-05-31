/* ============================================================
   ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়
   Main JavaScript
   ============================================================ */

// Dynamically load SweetAlert2 from CDN if not already present
if (typeof Swal === 'undefined') {
  const SwalScript = document.createElement('script');
  SwalScript.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
  SwalScript.async = true;
  document.head.appendChild(SwalScript);
}

document.addEventListener('DOMContentLoaded', function () {

  // ============================================================
  // Mobile Navigation Toggle
  // ============================================================
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Mobile dropdown toggles
    const dropdownParents = navMenu.querySelectorAll('.nav-menu__item');
    dropdownParents.forEach(function (item) {
      const link = item.querySelector('.nav-menu__link');
      const dropdown = item.querySelector('.nav-dropdown');

      if (link && dropdown) {
        link.addEventListener('click', function (e) {
          if (window.innerWidth <= 768) {
            if (link.getAttribute('href') === '#' || link.querySelector('.arrow')) {
              e.preventDefault();
              dropdown.classList.toggle('mobile-open');
            }
          }
        });
      }
    });
  }

  // Close mobile menu on click outside
  document.addEventListener('click', function (e) {
    if (navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });

  // ============================================================
  // Scroll Animations (Intersection Observer)
  // ============================================================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ============================================================
  // Back to Top Button
  // ============================================================
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ============================================================
  // Lightbox Gallery
  // ============================================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;

  if (galleryItems.length > 0 && lightbox && lightboxImg) {
    galleryItems.forEach(function (item) {
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

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ============================================================
  // Ticker duplication for seamless loop
  // ============================================================
  const tickerContent = document.querySelector('.ticker__content');
  if (tickerContent) {
    const items = tickerContent.innerHTML;
    tickerContent.innerHTML = items + items;
  }

  // ============================================================
  // Active Navigation Highlighting
  // ============================================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-menu__link');

  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav-menu__link--active');
    }
  });

  // ============================================================
  // Counter Animation for Stats
  // ============================================================
  function animateCounter(element, target, duration) {
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var current = Math.floor(progress * target);
      element.textContent = current.toLocaleString('bn-BD');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target.toLocaleString('bn-BD');
      }
    }

    requestAnimationFrame(step);
  }

  const statNumbers = document.querySelectorAll('.stat-card__number, .hero__stat-number');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = parseInt(entry.target.dataset.count || entry.target.textContent, 10);
          if (!isNaN(target)) {
            animateCounter(entry.target, target, 2000);
          }
          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // ============================================================
  // Smooth scroll for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============================================================
  // Filter buttons (Results / Gallery)
  // ============================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Remove active from all
      this.parentElement.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('filter-btn--active');
      });
      this.classList.add('filter-btn--active');
    });
  });

  // ============================================================
  // Form Validation (Contact page)
  // ============================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var inputs = this.querySelectorAll('.form-input[required]');

      inputs.forEach(function (input) {
        if (!input.value.trim()) {
          input.style.borderColor = '#e74c3c';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });

      if (valid) {
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'success',
            title: 'বার্তা পাঠানো হয়েছে!',
            text: 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে! ধন্যবাদ।',
            confirmButtonText: 'ঠিক আছে',
            confirmButtonColor: '#1c69b5'
          });
        } else {
          alert('আপনার বার্তা সফলভাবে পাঠানো হয়েছে! ধন্যবাদ।');
        }
        this.reset();
      }
    });
  }

  // ============================================================
  // Dynamic Header Admin/Login status
  // ============================================================
  const adminToken = localStorage.getItem('adminToken');
  const topBarLinks = document.querySelector('.top-bar__links');
  const mainNavMenu = document.getElementById('nav-menu');

  if (adminToken) {
    // 1. Update Top Bar Links: Show Dashboard & Logout
    if (topBarLinks) {
      topBarLinks.innerHTML = `
        <a href="admin.html" class="top-bar__link" id="login-link">🖥️ ড্যাশবোর্ড</a>
        <a href="#" class="top-bar__link" id="header-logout-btn">🔓 লগআউট</a>
      `;

      // Handle logout click
      const headerLogoutBtn = document.getElementById('header-logout-btn');
      if (headerLogoutBtn) {
        headerLogoutBtn.addEventListener('click', function (e) {
          e.preventDefault();
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              title: 'লগআউট করতে চান?',
              text: 'আপনি ড্যাশবোর্ড সেশনটি বন্ধ করতে যাচ্ছেন।',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'হ্যাঁ, লগআউট করুন',
              cancelButtonText: 'বাতিল'
            }).then((result) => {
              if (result.isConfirmed) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.reload();
              }
            });
          } else {
            if (confirm('লগআউট করতে চান?')) {
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminUser');
              window.location.reload();
            }
          }
        });
      }
    }
    // 2. Append Admin Panel menu link to Main Navigation Menu
    if (mainNavMenu) {
      const adminMenuItem = document.createElement('li');
      adminMenuItem.className = 'nav-menu__item';
      adminMenuItem.setAttribute('role', 'none');
      adminMenuItem.innerHTML = `
        <a href="admin.html" class="nav-menu__link" role="menuitem" style="color: #e74c3c; font-weight: bold;">⚙️ এডমিন প্যানেল</a>
      `;
      mainNavMenu.appendChild(adminMenuItem);
    }
  }

  // 3. Apply Dynamic School Settings
  applyDynamicSchoolSettings();

});

// ============================================================
// Apply Dynamic School Settings globally from DB
// ============================================================
async function applyDynamicSchoolSettings() {
  if (typeof fetchSettings !== 'function') return;

  try {
    const settings = await fetchSettings();
    if (!settings) return;

    // 1. Update document title
    if (settings.schoolName) {
      document.title = document.title.replaceAll('ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়', settings.schoolName);
    }

    // 2. Update top bar elements
    const topBarTitle = document.querySelector('.top-bar__title');
    if (topBarTitle && settings.schoolName) {
      topBarTitle.textContent = settings.schoolName;
    }

    const topBarSubtitle = document.querySelector('.top-bar__subtitle');
    if (topBarSubtitle && settings.schoolNameEnglish) {
      if (topBarSubtitle.textContent.includes('|')) {
        const parts = topBarSubtitle.textContent.split('|');
        topBarSubtitle.textContent = `${settings.schoolNameEnglish} | ${parts[1].trim()}`;
      } else {
        topBarSubtitle.textContent = settings.schoolNameEnglish;
      }
    }

    const topBarLogo = document.querySelector('.top-bar__logo');
    if (topBarLogo && settings.logoUrl) {
      topBarLogo.src = getLogoUrl(settings.logoUrl);
    }

    const topBarBadge = document.querySelector('.top-bar__badge--gold');
    if (topBarBadge && settings.establishedYear) {
      topBarBadge.textContent = `📅 স্থাপিত: ${toBengaliNumerals(settings.establishedYear)} খ্রি.`;
    }

    // 3. Update Hero Banner Image
    const heroImage = document.querySelector('.hero__image');
    if (heroImage) {
      heroImage.addEventListener('error', function () {
        this.src = 'assets/images/hero_banner.png';
      });

      if (settings.bannerUrl) {
        heroImage.src = getLogoUrl(settings.bannerUrl, 'assets/images/hero_banner.png');
      } else {
        heroImage.src = 'assets/images/hero_banner.png';
      }
    }

    // 4. Update Footer About Column
    const footerAboutText = document.querySelector('#footer-about .footer-col__text');
    if (footerAboutText && settings.aboutText) {
      footerAboutText.textContent = settings.aboutText;
    }

    // 5. Update Footer Contact Column
    const footerContact = document.getElementById('footer-contact');
    if (footerContact) {
      const contactDivs = footerContact.querySelectorAll('.footer-contact');
      if (contactDivs.length >= 3) {
        const addressDiv = contactDivs[0].querySelector('div:not(.footer-contact__icon)');
        if (addressDiv && settings.address) {
          addressDiv.textContent = settings.address;
        }
        const phoneDiv = contactDivs[1].querySelector('div:not(.footer-contact__icon)');
        if (phoneDiv && settings.phone) {
          phoneDiv.textContent = settings.phone;
        }
        const emailDiv = contactDivs[2].querySelector('div:not(.footer-contact__icon)');
        if (emailDiv && settings.email) {
          emailDiv.textContent = settings.email;
        }
      }
    }

    // 6. Update Footer Social Links
    const socialFb = document.getElementById('social-fb');
    if (socialFb && settings.facebookLink) {
      socialFb.href = settings.facebookLink;
    }
    const socialYt = document.getElementById('social-yt');
    if (socialYt && settings.youtubeLink) {
      socialYt.href = settings.youtubeLink;
    }

    // 7. Update Copyright Text in footer
    const footerBottomContainer = document.querySelector('.footer-bottom .container');
    if (footerBottomContainer && settings.schoolName) {
      footerBottomContainer.innerHTML = footerBottomContainer.innerHTML.replaceAll(
        'ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়',
        settings.schoolName
      );
    }

    // 8. Replace dynamic table values on index page if there is an info card
    document.querySelectorAll('td').forEach(td => {
      if (td.textContent.trim() === 'ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়') {
        td.textContent = settings.schoolName;
      }
    });

  } catch (error) {
    console.error('Error applying dynamic school settings:', error);
  }
}
