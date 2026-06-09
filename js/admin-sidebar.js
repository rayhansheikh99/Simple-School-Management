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

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('school-theme')) {
        const newSystemTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newSystemTheme);
        toggleBtn.innerHTML = `<span class="theme-toggle-icon">${newSystemTheme === 'dark' ? '☀️' : '🌙'}</span>`;
      }
    });
  }

  function initAll() {
    initSidebar();
    initThemeSwitcher();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
