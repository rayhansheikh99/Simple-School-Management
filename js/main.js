/* ============================================================
   নবমল্লিকা মডেল একাডেমী
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
  // Premium Theme Switcher & Storage Integration
  // ============================================================
  function initThemeSwitcher() {
    const topBarRight = document.querySelector('.top-bar__right');
    if (!topBarRight) return;

    const container = topBarRight;

    // Remove existing theme switcher if any
    const existingBtn = document.getElementById('theme-toggle-btn');
    if (existingBtn) existingBtn.remove();

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle-btn';
    toggleBtn.id = 'theme-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'থিম পরিবর্তন করুন');
    toggleBtn.setAttribute('title', 'থিম পরিবর্তন করুন');
    const getTheme = () => document.documentElement.getAttribute('data-theme') || 'light';
    
    // Set initial icon
    toggleBtn.innerHTML = `<span class="theme-toggle-icon">${getTheme() === 'dark' ? '☀️' : '🌙'}</span>`;

    // Append last so it appears at the far-right edge of the header
    container.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', function () {
      const activeTheme = getTheme();
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.classList.add('theme-transition');
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('school-theme', newTheme);
      
      toggleBtn.innerHTML = `<span class="theme-toggle-icon">${newTheme === 'dark' ? '☀️' : '🌙'}</span>`;
      
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
      }, 500);
    });

    // Listen for system changes if user has no saved preference
  }
  initThemeSwitcher();

  // Dynamic gradient orb injection in hero
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const orb1 = document.createElement('div');
    orb1.className = 'gradient-orb orb-primary';
    const orb2 = document.createElement('div');
    orb2.className = 'gradient-orb orb-secondary';
    heroSection.insertBefore(orb1, heroSection.firstChild);
    heroSection.insertBefore(orb2, heroSection.firstChild);
  }


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
  // Reusable Premium Scroll Easing Function (Ease-In-Out Cubic)
  // ============================================================
  function smoothScrollTo(targetY, duration = 800) {
    const startY = window.scrollY || window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    // Cubic Easing Function: easeInOutCubic
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * easedProgress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }

  // ============================================================
  // Back to Top Button with Custom Scroll Easing
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
      smoothScrollTo(0, 800); // 800ms animation using custom Cubic Easing
    });
  }

  // ============================================================
  // Lightbox Gallery (Event Delegation)
  // ============================================================
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;

  if (lightbox && lightboxImg) {
    document.addEventListener('click', function (e) {
      const item = e.target.closest('.gallery-item');
      if (item) {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }
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
  // Smooth scroll for anchor links with Custom Easing
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        
        // Calculate offset position to account for the sticky main menu
        const navHeader = document.querySelector('.main-nav');
        const headerOffset = navHeader ? navHeader.offsetHeight : 60;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        smoothScrollTo(offsetPosition, 900); // 900ms duration with custom Cubic Easing
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
        <a href="admin/index.html" class="top-bar__link" id="login-link">🖥️ ড্যাশবোর্ড</a>
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
        <a href="admin/index.html" class="nav-menu__link" role="menuitem" style="color: #e74c3c; font-weight: bold;">⚙️ এডমিন প্যানেল</a>
      `;
      mainNavMenu.appendChild(adminMenuItem);
    }
  } else {
    // Not logged in — hide the login link entirely from the top bar
    const loginLink = document.getElementById('login-link');
    if (loginLink) loginLink.style.display = 'none';
  }

  // 3. Apply Dynamic School Settings
  applyDynamicSchoolSettings();

});

// ============================================================
// Ease Scroll (Vanilla JS) — Fixed for modern browsers
// ============================================================
(function () {
  // Skip on touch/mobile devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  var goUp = true;
  var end = null;
  var interval = null;

  function getScrollTop() {
    return window.scrollY || window.pageYOffset;
  }

  function getScrollHeight() {
    return document.documentElement.scrollHeight;
  }

  function getWindowHeight() {
    return window.innerHeight;
  }

  function handle(delta) {
    var animationInterval = 16;
    var scrollSpeed = 10;

    if (end == null) {
      end = getScrollTop();
    }
    end -= 40 * delta;
    goUp = delta > 0;

    if (interval == null) {
      interval = setInterval(function () {
        var scrollTop = getScrollTop();
        var step = Math.round((end - scrollTop) / scrollSpeed);
        if (
          scrollTop <= 0 ||
          scrollTop >= getScrollHeight() - getWindowHeight() ||
          (goUp && step > -1) ||
          (!goUp && step < 1)
        ) {
          clearInterval(interval);
          interval = null;
          end = null;
        }
        window.scrollTo(0, scrollTop + step);
      }, animationInterval);
    }
  }

  // Modern 'wheel' event — works in Chrome, Edge, Firefox, Safari
  window.addEventListener('wheel', function (event) {
    // Don't intercept if modals/lightbox are open
    if (document.body.style.overflow === 'hidden') return;

    // Don't intercept if Ctrl held (browser zoom)
    if (event.ctrlKey) return;

    // Use modern deltaY property
    var delta = -event.deltaY / 40;

    handle(delta);
    event.preventDefault();
  }, { passive: false });
})();

// ============================================================
// Apply Dynamic School Settings globally from DB
// ============================================================
async function applyDynamicSchoolSettings() {
  if (typeof fetchSettings !== 'function') return;

  try {
    const settings = await fetchSettings();
    if (!settings) return;

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

    // 4. Update Footer Social Links
    const socialFb = document.getElementById('social-fb');
    if (socialFb && settings.facebookLink) {
      socialFb.href = settings.facebookLink;
    }
    const socialYt = document.getElementById('social-yt');
    if (socialYt && settings.youtubeLink) {
      socialYt.href = settings.youtubeLink;
    }

  } catch (error) {
    console.error('Error applying dynamic school settings:', error);
  }
}
