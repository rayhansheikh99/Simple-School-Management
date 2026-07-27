/* Shared password visibility toggle for admin forms. */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    const input = document.getElementById(button.dataset.passwordToggle);
    if (!input) return;

    button.addEventListener('click', () => {
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      button.textContent = isHidden ? '🙈' : '👁️';
      const label = isHidden ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখান';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
    });
  });
});
