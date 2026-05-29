/* ============================================================
   ডেমো সরকারি মডেল পাইলট উচ্চ বিদ্যালয়
   Main JavaScript
   ============================================================ */

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
        alert('আপনার বার্তা সফলভাবে পাঠানো হয়েছে! ধন্যবাদ।');
        this.reset();
      }
    });
  }

});
