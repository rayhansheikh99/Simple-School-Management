/* ============================================================
   নবমল্লিকা মডেল একাডেমী
   Dynamic Contact Form Submission Handler
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    // Stop js/main.js form submission default alert from firing
    e.stopImmediatePropagation();
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Disable submit button during processing
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⌛ পাঠানো হচ্ছে...';

    // Call client api connection
    const response = await sendContactMessage(name, email, phone, subject, message);

    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;

    if (response.success) {
      // Show dynamic premium success alert
      showToast('success', 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।');
      contactForm.reset();
    } else {
      // Show error alert
      showToast('error', response.message || 'বার্তা পাঠাতে ত্রুটি হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    }
  });

  // Simple clean toast alert system
  function showToast(type, text) {
    const toast = document.createElement('div');
    toast.className = `custom-toast custom-toast--${type}`;
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.25rem;">${type === 'success' ? '✅' : '❌'}</span>
        <div>${text}</div>
      </div>
    `;

    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => {
      toast.classList.add('visible');
    }, 100);

    // Fade out and remove after 4 seconds
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }
});

// Inject styling for our new custom toast alerts
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  .custom-toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 16px 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 5px 25px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 400px;
    font-family: inherit;
    font-size: 0.95rem;
    line-height: 1.4;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }
  .custom-toast.visible {
    transform: translateY(0);
    opacity: 1;
  }
  .custom-toast--success {
    border-left: 4px solid #2ecc71;
    color: #2c3e50;
  }
  .custom-toast--error {
    border-left: 4px solid #e74c3c;
    color: #c0392b;
  }
`;
document.head.appendChild(toastStyle);
