/* ================================================================
   SDIT — main.js
   Shared interactions for pages using the .nav masthead
   (apply, support, legal). The charter homepage needs no JS.
   ================================================================ */

(function () {

  /* ---- Nav: scroll shadow + background ---- */
  const nav = document.getElementById('nav');

  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on init in case page loads scrolled
  }

  /* ---- Mobile nav toggle ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close mobile nav on any link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ---- Smooth scroll for in-page anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- Intersection Observer: scroll-in animations ---- */
  const animateEls = document.querySelectorAll('[data-animate]');

  if (animateEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animateEls.forEach(el => observer.observe(el));
  }

})();
