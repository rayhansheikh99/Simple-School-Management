/* ============================================================
   Admin Sidebar Mobile Toggle
   Handles hamburger button, sidebar slide-in, and backdrop overlay
   ============================================================ */
(function () {
  'use strict';

  function initSidebar() {
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.querySelector('.db-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (!toggleBtn || !sidebar || !overlay) return;

    function openSidebar() {
      sidebar.classList.add('sidebar-open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent background scroll
    }

    function closeSidebar() {
      sidebar.classList.remove('sidebar-open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', function () {
      if (sidebar.classList.contains('sidebar-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    // Close when clicking the backdrop
    overlay.addEventListener('click', closeSidebar);

    // Close sidebar when a nav link is clicked on mobile
    const navLinks = sidebar.querySelectorAll('.db-menu-btn');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          closeSidebar();
        }
      });
    });

    // On resize to desktop: restore sidebar and body scroll
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        sidebar.classList.remove('sidebar-open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  function initThemeSwitcher() {
    const topBarRight = document.querySelector('.top-bar__right');
    if (!topBarRight) return;

    const existingBtn = document.getElementById('theme-toggle-btn');
    if (existingBtn) existingBtn.remove();

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle-btn';
    toggleBtn.id = 'theme-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'থিম পরিবর্তন করুন');
    toggleBtn.setAttribute('title', 'থিম পরিবর্তন করুন');
    const getTheme = () => document.documentElement.getAttribute('data-theme') || 'light';
    
    toggleBtn.innerHTML = `<span class="theme-toggle-icon">${getTheme() === 'dark' ? '☀️' : '🌙'}</span>`;
    
    // Append last so it sits at the far-right end, matching the front panel
    topBarRight.appendChild(toggleBtn);

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
  }

  function initHeaderLogoutBtn() {
    const topBarRight = document.querySelector('.top-bar__right');
    if (!topBarRight) return;

    const existingBtn = document.getElementById('header-logout-btn');
    if (existingBtn) existingBtn.remove();

    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) return;

    const logoutBtn = document.createElement('a');
    logoutBtn.href = '#';
    logoutBtn.className = 'top-bar__link';
    logoutBtn.id = 'header-logout-btn';
    logoutBtn.style.textDecoration = 'none';
    logoutBtn.style.display = 'inline-flex';
    logoutBtn.style.alignItems = 'center';
    logoutBtn.style.justifyContent = 'center';
    logoutBtn.innerHTML = '🔓 লগআউট';

    // Insert before theme toggle button if it exists, otherwise append
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      topBarRight.insertBefore(logoutBtn, themeToggleBtn);
    } else {
      topBarRight.appendChild(logoutBtn);
    }

    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Attempt to trigger the sidebar's existing logout button logic
      const sidebarLogout = document.getElementById('logout-btn');
      if (sidebarLogout) {
        sidebarLogout.click();
      } else {
        // Fallback confirmation dialog
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
              localStorage.removeItem('adminRole');
              window.location.reload();
            }
          });
        } else {
          if (confirm('লগআউট করতে চান?')) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            localStorage.removeItem('adminRole');
            window.location.reload();
          }
        }
      }
    });
  }

  function initAll() {
    initSidebar();

    // Style return home button to match the top-bar links (like the logout button)
    const topBarRight = document.querySelector('.top-bar__right');
    if (topBarRight) {
      const homeBtn = topBarRight.querySelector('a[href="/"]');
      if (homeBtn) {
        homeBtn.className = 'top-bar__link';
        homeBtn.style.textDecoration = 'none';
        homeBtn.style.display = 'inline-flex';
        homeBtn.style.alignItems = 'center';
        homeBtn.style.justifyContent = 'center';
        homeBtn.style.gap = '6px';
      }
    }

    initThemeSwitcher();
    initHeaderLogoutBtn();
  }

  // Watch for class changes on documentElement to re-check login state (useful for admin/index.html where login happens without a reload)
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          initHeaderLogoutBtn();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
