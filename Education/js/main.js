// =============================================
// BrightPath Academy — Main JavaScript (v2)
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Page Loader Bar ----
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.style.width = '70%';
    window.addEventListener('load', () => {
      loader.style.width = '100%';
      setTimeout(() => { loader.style.opacity = '0'; }, 400);
      setTimeout(() => { loader.style.display = 'none'; }, 800);
    });
  }

  // ---- Navbar Scroll Effect ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
      toggleScrollTop();
    });
  }

  // ---- Active Nav Link on Scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { root: null, rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // ---- Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  function closeMobileMenu() {
    if (hamburger) { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
    });

    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hamburger.click(); }
    });

    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobileMenu();
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ---- Scroll Reveal ----
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ---- Counter Animation (Fixed for decimals like 4.8) ----
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(el) {
    const rawTarget = el.getAttribute('data-count');
    const isDecimal = rawTarget.includes('.');
    const target = parseFloat(rawTarget);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const totalFrames = Math.round(duration / 16);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;

      if (frame >= totalFrames) {
        clearInterval(timer);
        el.textContent = (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
      } else {
        el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
      }
    }, 16);
  }

  // ---- Course Filter ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        if (show) {
          card.style.display = 'flex';
          // Reset animation
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.animation = 'fadeInUp 0.4s ease forwards';
            });
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ---- Contact Form with Validation ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl    = document.getElementById('contactName');
      const emailEl   = document.getElementById('contactEmail');
      const messageEl = document.getElementById('contactMessage');

      if (!nameEl.value.trim()) {
        nameEl.focus();
        showToast('Please enter your full name.');
        return;
      }
      if (!emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
        emailEl.focus();
        showToast('Please enter a valid email address.');
        return;
      }
      if (!messageEl.value.trim()) {
        messageEl.focus();
        showToast('Please write your message before sending.');
        return;
      }

      const btn = contactForm.querySelector('.form-submit-btn');
      const successMsg = document.getElementById('successMsg');

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #00a896, #009688)';
        if (successMsg) successMsg.classList.add('show');
        contactForm.reset();

        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message \u279C';
          btn.disabled = false;
          btn.style.background = '';
          if (successMsg) successMsg.classList.remove('show');
        }, 5000);
      }, 1500);
    });
  }

  // ---- Newsletter Form ----
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button[type="submit"]');
      if (input && input.value.trim()) {
        const orig = btn.textContent;
        btn.textContent = '\u2713 Subscribed!';
        input.value = '';
        setTimeout(() => { btn.textContent = orig; }, 3000);
      } else {
        showToast('Please enter your email address to subscribe.');
      }
    });
  });

  // ---- Scroll To Top ----
  const scrollTopBtn = document.getElementById('scrollTop');

  function toggleScrollTop() {
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Enroll Button Toast ----
  document.querySelectorAll('.enroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('\uD83C\uDF89 Enrollment opens soon! You\'ll be the first to know.');
    });
  });

  // ---- Toast Notification ----
  function showToast(message) {
    const existing = document.querySelector('.bp-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'bp-toast';
    toast.innerHTML = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '96px',
      right: '24px',
      background: '#1A1A2E',
      color: '#fff',
      padding: '14px 20px',
      borderRadius: '12px',
      fontSize: '0.875rem',
      fontWeight: '500',
      fontFamily: "'Inter', sans-serif",
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      zIndex: '9999',
      borderLeft: '4px solid #00BFA5',
      maxWidth: '320px',
      lineHeight: '1.6',
      cursor: 'pointer',
      transition: 'opacity 0.3s ease'
    });

    toast.addEventListener('click', () => toast.remove());
    document.body.appendChild(toast);

    // Animate in
    toast.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, fill: 'forwards' });

    setTimeout(() => {
      toast.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
      setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
    }, 4000);
  }

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
