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

  const imputationImage = document.querySelector('#imputationResultImage');

  if (imputationImage) {
    const imputationSlides = [
      { facility: 'lansce-history', mask: 'point', facilityLabel: 'LANSCE · 2019–2024', maskLabel: 'Point-wise mask', figure: 4, src: 'static/images/missing-data-imputation-poster.png' },
      { facility: 'lansce-history', mask: 'block', facilityLabel: 'LANSCE · 2019–2024', maskLabel: 'Block-wise mask', figure: 5, src: 'static/images/imputation-02-lansce-2019-2024-block-wise.png' },
      { facility: 'lansce-2025', mask: 'point', facilityLabel: 'LANSCE · 2025', maskLabel: 'Point-wise mask', figure: 6, src: 'static/images/imputation-03-lansce-2025-point-wise.png' },
      { facility: 'lansce-2025', mask: 'block', facilityLabel: 'LANSCE · 2025', maskLabel: 'Block-wise mask', figure: 7, src: 'static/images/imputation-04-lansce-2025-block-wise.png' },
      { facility: 'lhc', mask: 'point', facilityLabel: 'LHC · CERN', maskLabel: 'Point-wise mask', figure: 8, src: 'static/images/imputation-05-lhc-cern-point-wise.png' },
      { facility: 'sns', mask: 'point', facilityLabel: 'SNS · Oak Ridge', maskLabel: 'Point-wise mask', figure: 9, src: 'static/images/imputation-06-sns-point-wise.png' },
      { facility: 'sns', mask: 'block', facilityLabel: 'SNS · Oak Ridge', maskLabel: 'Block-wise mask', figure: 10, src: 'static/images/imputation-07-sns-block-wise.png' },
      { facility: 'lcls', mask: 'point', facilityLabel: 'LCLS · SLAC', maskLabel: 'Point-wise mask', figure: 11, src: 'static/images/imputation-08-lcls-point-wise.png' },
      { facility: 'lcls', mask: 'block', facilityLabel: 'LCLS · SLAC', maskLabel: 'Block-wise mask', figure: 12, src: 'static/images/imputation-09-lcls-block-wise.png' },
      { facility: 'gmps-booster', mask: 'combined', facilityLabel: 'Booster · Fermilab', maskLabel: 'Point-wise + block-wise masks', figure: 13, src: 'static/images/imputation-10-gmps-booster-fermilab.png' }
    ];
    const facilityButtons = [...document.querySelectorAll('[data-imputation-facility]')];
    const maskButtons = [...document.querySelectorAll('[data-imputation-mask]')];
    const imputationLinks = [
      document.querySelector('#imputationZoomLink'),
      document.querySelector('#imputationFigureLink')
    ].filter(Boolean);
    const selection = document.querySelector('#imputationSelection');
    const selectionFacility = selection?.querySelector('strong');
    const selectionDetail = selection?.querySelector('span');
    const count = document.querySelector('#imputationCount');
    const previous = document.querySelector('[data-imputation-previous]');
    const next = document.querySelector('[data-imputation-next]');
    let selectedIndex = 0;

    const showImputationSlide = (index) => {
      selectedIndex = (index + imputationSlides.length) % imputationSlides.length;
      const slide = imputationSlides[selectedIndex];
      const title = `${slide.facilityLabel} · ${slide.maskLabel.toLowerCase()} · Paper Figure ${slide.figure}`;
      const alt = `${slide.facilityLabel} ${slide.maskLabel.toLowerCase()} imputation with 15 percent of sensor values hidden; blue is ground truth, red is hidden data, and green is the model prediction.`;

      if (imputationImage.getAttribute('src') !== slide.src) {
        imputationImage.classList.add('is-loading');
        imputationImage.src = slide.src;
      }
      imputationImage.alt = alt;

      imputationLinks.forEach((link) => {
        link.href = slide.src;
        link.dataset.title = title;
      });

      facilityButtons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.imputationFacility === slide.facility));
      });

      maskButtons.forEach((button) => {
        const mask = button.dataset.imputationMask;
        button.disabled = !imputationSlides.some((item) => item.facility === slide.facility && item.mask === mask);
        button.setAttribute('aria-pressed', String(mask === slide.mask));
      });

      if (selectionFacility) selectionFacility.textContent = slide.facilityLabel;
      if (selectionDetail) selectionDetail.textContent = `${slide.maskLabel} · Paper Fig. ${slide.figure}`;
      if (count) {
        count.textContent = `${String(selectedIndex + 1).padStart(2, '0')} / ${String(imputationSlides.length).padStart(2, '0')}`;
        count.setAttribute('aria-label', `Selected figure ${selectedIndex + 1} of ${imputationSlides.length}`);
      }
    };

    imputationImage.addEventListener('load', () => imputationImage.classList.remove('is-loading'));

    facilityButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const facility = button.dataset.imputationFacility;
        const currentMask = imputationSlides[selectedIndex].mask;
        const exactMatch = imputationSlides.findIndex((slide) => slide.facility === facility && slide.mask === currentMask);
        const fallback = imputationSlides.findIndex((slide) => slide.facility === facility);
        showImputationSlide(exactMatch >= 0 ? exactMatch : fallback);
      });
    });

    maskButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const currentFacility = imputationSlides[selectedIndex].facility;
        const index = imputationSlides.findIndex((slide) => slide.facility === currentFacility && slide.mask === button.dataset.imputationMask);
        if (index >= 0) showImputationSlide(index);
      });
    });

    previous?.addEventListener('click', () => showImputationSlide(selectedIndex - 1));
    next?.addEventListener('click', () => showImputationSlide(selectedIndex + 1));
    showImputationSlide(0);
  }

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
