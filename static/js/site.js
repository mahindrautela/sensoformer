(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const acceleratorDiagram = document.querySelector('.accelerator-diagram');

  if (reducedMotion && typeof acceleratorDiagram?.pauseAnimations === 'function') {
    acceleratorDiagram.pauseAnimations();
  }

  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) setActiveLink(visible[0].target.id);
    }, {
      rootMargin: '-20% 0px -62% 0px',
      threshold: [0, 0.15, 0.4]
    });

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  const progressBar = document.querySelector('.reading-progress span');
  let progressFrame = null;

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    progressBar.style.transform = `scaleX(${progress})`;
    progressFrame = null;
  };

  const queueProgressUpdate = () => {
    if (progressFrame !== null) return;
    progressFrame = window.requestAnimationFrame(updateProgress);
  };

  window.addEventListener('scroll', queueProgressUpdate, { passive: true });
  window.addEventListener('resize', queueProgressUpdate, { passive: true });
  updateProgress();

  const lightbox = document.querySelector('#figureLightbox');
  const lightboxImage = lightbox?.querySelector('.lightbox-stage img');
  const lightboxTitle = lightbox?.querySelector('#lightboxTitle');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxLinks = [...document.querySelectorAll('[data-lightbox]')];
  let lightboxTrigger = null;

  const closeLightbox = () => {
    if (!lightbox?.open) return;
    lightbox.close();
  };

  if (lightbox && typeof lightbox.showModal === 'function') {
    lightboxLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        lightboxTrigger = link;
        const title = link.dataset.title || 'Research figure';
        lightboxImage.src = link.href;
        lightboxImage.alt = title;
        lightboxTitle.textContent = title;
        document.body.classList.add('lightbox-open');
        lightbox.showModal();
        lightboxClose.focus({ preventScroll: true });
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener('close', () => {
      document.body.classList.remove('lightbox-open');
      lightboxImage.removeAttribute('src');
      lightboxTrigger?.focus({ preventScroll: true });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (reducedMotion || !link.closest('.nav-links')) return;
      link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });
})();
