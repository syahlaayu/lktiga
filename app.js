/**
 * E-PORTOFOLIO REFLEKSI PENGALAMAN BELAJAR PPG — SYAHLA AYU YASINTA
 * Core Interactive Navigation and Presentation Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const slidesWrapper = document.getElementById('slidesWrapper');
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const nextBtnText = document.getElementById('nextBtnText');
  const nextBtnIcon = document.getElementById('nextBtnIcon');
  
  const pageNumBtns = document.querySelectorAll('.page-num-btn');
  const slideFraction = document.getElementById('slideFraction');
  const slideTopicBadge = document.getElementById('slideTopicBadge');
  const progressBar = document.getElementById('progressBar');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  // State
  let currentSlideIndex = 0;
  let isMobile = window.innerWidth <= 860;

  // Slide Topics Metadata
  const slideTopics = [
    '01 — Profil',
    '02 — Pandangan Pendidikan',
    '03 — Upaya Guru Profesional',
    '04 — Rencana Tindak Lanjut',
    '05 — Refleksi Penutup'
  ];

  /**
   * Update the UI based on currentSlideIndex
   */
  function updatePresentation(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    
    currentSlideIndex = index;
    isMobile = window.innerWidth <= 860;

    // 1. Move slides wrapper (Desktop horizontal carousel)
    if (!isMobile) {
      const translateXPercent = -(currentSlideIndex * 20); // 100% / 5 slides = 20%
      slidesWrapper.style.transform = `translateX(${translateXPercent}%)`;
      
      // Reset scroll position of current slide to top
      if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].scrollTop = 0;
      }
    } else {
      // Mobile smooth scroll
      const targetSlide = slides[currentSlideIndex];
      if (targetSlide) {
        targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // 2. Update Active Classes
    slides.forEach((slide, i) => {
      if (i === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // 3. Update Pagination Buttons
    pageNumBtns.forEach((btn, i) => {
      if (i === currentSlideIndex) {
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'step');
      } else {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
      }
    });

    // 4. Update Fraction Counter & Badge
    const displayNum = String(currentSlideIndex + 1).padStart(2, '0');
    const displayTotal = String(totalSlides).padStart(2, '0');
    if (slideFraction) {
      slideFraction.textContent = `${displayNum} / ${displayTotal}`;
    }

    if (slideTopicBadge) {
      slideTopicBadge.textContent = slideTopics[currentSlideIndex] || `0${currentSlideIndex + 1} — Bagian`;
    }

    // 5. Update Progress Bar
    const progressPercent = ((currentSlideIndex + 1) / totalSlides) * 100;
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }

    // 6. Update Prev Button State
    if (prevBtn) {
      if (currentSlideIndex === 0) {
        prevBtn.disabled = true;
      } else {
        prevBtn.disabled = false;
      }
    }

    // 7. Update Next Button State & Label
    if (nextBtn) {
      if (currentSlideIndex === totalSlides - 1) {
        nextBtnText.textContent = 'Kembali ke Awal';
        nextBtn.setAttribute('aria-label', 'Kembali ke slide awal');
        nextBtnIcon.innerHTML = '<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>';
      } else {
        nextBtnText.textContent = 'Selanjutnya';
        nextBtn.setAttribute('aria-label', 'Slide Selanjutnya');
        nextBtnIcon.innerHTML = '<polyline points="9 18 15 12 9 6"></polyline>';
      }
    }
  }

  // Navigation Handlers
  function goToNext() {
    if (currentSlideIndex < totalSlides - 1) {
      updatePresentation(currentSlideIndex + 1);
    } else {
      // Loop back to start on last slide
      updatePresentation(0);
    }
  }

  function goToPrev() {
    if (currentSlideIndex > 0) {
      updatePresentation(currentSlideIndex - 1);
    }
  }

  function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
      updatePresentation(index);
    }
  }

  // Event Listeners for Prev & Next Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToPrev();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToNext();
    });
  }

  // Pagination direct jump
  pageNumBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetIndex = parseInt(btn.getAttribute('data-index'), 10);
      if (!isNaN(targetIndex)) {
        goToSlide(targetIndex);
      }
    });
  });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    // Ignore keystrokes when focus is in input or textarea
    if (['input', 'textarea', 'select'].includes(document.activeElement.tagName.toLowerCase())) {
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case 'Space':
        e.preventDefault();
        goToNext();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        goToPrev();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        const slideNum = parseInt(e.key, 10) - 1;
        if (slideNum >= 0 && slideNum < totalSlides) {
          goToSlide(slideNum);
        }
        break;
    }
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const minSwipeDistance = 50;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
  }, { passive: true });

  function handleSwipeGesture() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Ensure horizontal swipe is dominant over vertical scrolling
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX < 0) {
        // Swiped Left -> Next
        goToNext();
      } else {
        // Swiped Right -> Prev
        goToPrev();
      }
    }
  }

  // Fullscreen Toggle
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });

    document.addEventListener('fullscreenchange', () => {
      const fsIcon = document.getElementById('fsIcon');
      if (document.fullscreenElement) {
        fullscreenBtn.setAttribute('title', 'Keluar Layar Penuh');
        if (fsIcon) {
          fsIcon.innerHTML = '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>';
        }
      } else {
        fullscreenBtn.setAttribute('title', 'Mode Layar Penuh');
        if (fsIcon) {
          fsIcon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>';
        }
      }
    });
  }

  // Window Resize Handling
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updatePresentation(currentSlideIndex);
    }, 150);
  });

  // Mobile scroll spy to update active slide when scrolling naturally
  if (window.innerWidth <= 860) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-slide-index'), 10);
          if (!isNaN(index) && index !== currentSlideIndex) {
            currentSlideIndex = index;
            
            // Update active buttons & header without triggering scroll jump
            pageNumBtns.forEach((btn, i) => {
              btn.classList.toggle('active', i === currentSlideIndex);
            });
            if (slideFraction) {
              slideFraction.textContent = `${String(currentSlideIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
            }
            if (slideTopicBadge) {
              slideTopicBadge.textContent = slideTopics[currentSlideIndex];
            }
            if (progressBar) {
              progressBar.style.width = `${((currentSlideIndex + 1) / totalSlides) * 100}%`;
            }
            if (prevBtn) prevBtn.disabled = (currentSlideIndex === 0);
            if (nextBtn) {
              if (currentSlideIndex === totalSlides - 1) {
                nextBtnText.textContent = 'Kembali ke Awal';
                nextBtnIcon.innerHTML = '<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>';
              } else {
                nextBtnText.textContent = 'Selanjutnya';
                nextBtnIcon.innerHTML = '<polyline points="9 18 15 12 9 6"></polyline>';
              }
            }
          }
        }
      });
    }, observerOptions);

    slides.forEach((slide) => slideObserver.observe(slide));
  }

  // Initialize presentation on first load
  updatePresentation(0);
});
