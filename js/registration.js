/* ============================================================
   গ্রিনফিল্ড একাডেমি
   Student Registration Form Handler
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('registration-form');
  const submitBtn = document.getElementById('reg-submit-btn');
  const photoInput = document.getElementById('reg-photo');
  const photoPreview = document.getElementById('photo-preview');

  // Live photo preview
  if (photoInput && photoPreview) {
    photoInput.addEventListener('change', function () {
      const file = this.files[0];
      if (file) {
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: 'warning',
              title: 'ফাইল খুব বড়!',
              text: 'ছবির সাইজ সর্বোচ্চ ২MB হতে হবে।',
              confirmButtonText: 'ঠিক আছে'
            });
          }
          this.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
          photoPreview.innerHTML = `<img src="${e.target.result}" alt="ছবি প্রিভিউ">`;
        };
        reader.readAsDataURL(file);
      } else {
        photoPreview.innerHTML = '<span class="placeholder-icon">📷</span>';
      }
    });
  }

  // Toggle desiredGroup field based on desiredClass selection
  const classSelect = document.getElementById('reg-desiredClass');
  const groupWrapper = document.getElementById('group-select-wrapper');
  const groupSelect = document.getElementById('reg-desiredGroup');

  if (classSelect && groupWrapper && groupSelect) {
    classSelect.addEventListener('change', function () {
      const selectedClass = this.value;
      if (['9', '10', '11', '12'].includes(selectedClass)) {
        groupWrapper.style.display = 'flex';
      } else {
        groupWrapper.style.display = 'none';
        groupSelect.value = '';
      }
    });
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Collect required values
      const studentName = document.getElementById('reg-studentName').value.trim();
      const fatherName = document.getElementById('reg-fatherName').value.trim();
      const motherName = document.getElementById('reg-motherName').value.trim();
      const dateOfBirth = document.getElementById('reg-dateOfBirth').value;
      const gender = document.getElementById('reg-gender').value;
      const desiredClass = document.getElementById('reg-desiredClass').value;
      const desiredGroupEl = document.getElementById('reg-desiredGroup');
      const desiredGroup = desiredGroupEl ? desiredGroupEl.value : '';
      const phone = document.getElementById('reg-phone').value.trim();
      const address = document.getElementById('reg-address').value.trim();

      // Validate required fields
      if (!studentName || !fatherName || !motherName || !dateOfBirth || !gender || !desiredClass || !phone || !address) {
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'error',
            title: 'অসম্পূর্ণ তথ্য!',
            text: 'সকল আবশ্যক (*) ক্ষেত্র পূরণ করুন।',
            confirmButtonText: 'ঠিক আছে'
          });
        }
        return;
      }

      // If class is 9, 10, 11, or 12, then desiredGroup is required
      if (['9', '10', '11', '12'].includes(desiredClass) && !desiredGroup) {
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'error',
            title: 'অসম্পূর্ণ তথ্য!',
            text: 'শ্রেণি ৯-১২ এর জন্য বিভাগ (গ্রুপ) নির্বাচন করা আবশ্যক।',
            confirmButtonText: 'ঠিক আছে'
          });
        }
        return;
      }

      // Build FormData for multipart upload
      const formData = new FormData();
      formData.append('studentName', studentName);
      formData.append('fatherName', fatherName);
      formData.append('motherName', motherName);
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('gender', gender);
      formData.append('desiredClass', desiredClass);
      formData.append('desiredGroup', desiredGroup);
      formData.append('phone', phone);
      formData.append('address', address);

      // Optional fields
      const email = document.getElementById('reg-email').value.trim();
      const previousSchool = document.getElementById('reg-previousSchool').value.trim();
      if (email) formData.append('email', email);
      if (previousSchool) formData.append('previousSchool', previousSchool);

      // Photo
      const photoFile = photoInput && photoInput.files[0];
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      // Disable button and show loading
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');

      try {
        const result = await submitRegistration(formData);

        if (result.success) {
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: 'success',
              title: 'আবেদন সফল! 🎉',
              html: `<p style="font-size:15px;">${result.message || 'আপনার ভর্তি আবেদনটি সফলভাবে জমা হয়েছে।'}</p>`,
              confirmButtonText: 'ঠিক আছে',
              confirmButtonColor: '#2563eb'
            }).then(() => {
              form.reset();
              if (groupWrapper) groupWrapper.style.display = 'none';
              photoPreview.innerHTML = '<span class="placeholder-icon">📷</span>';
            });
          } else {
            form.reset();
            if (groupWrapper) groupWrapper.style.display = 'none';
            photoPreview.innerHTML = '<span class="placeholder-icon">📷</span>';
          }
        } else {
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: 'error',
              title: 'ত্রুটি!',
              text: result.message || 'আবেদন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
              confirmButtonText: 'ঠিক আছে'
            });
          }
        }
      } catch (err) {
        console.error('Registration submission error:', err);
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'error',
            title: 'সার্ভার ত্রুটি!',
            text: 'সার্ভারের সাথে সংযোগ করা সম্ভব হয়নি। পরে আবার চেষ্টা করুন।',
            confirmButtonText: 'ঠিক আছে'
          });
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    });
  }
});
