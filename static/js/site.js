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

  const imputationPanelLinks = [...document.querySelectorAll('[data-imputation-panel]')];

  if (imputationPanelLinks.length) {
    const paperSourceRoot = 'static/images/paper-source';
    const imputationSlides = [
      {
        facility: 'lansce-history', mask: 'point', facilityLabel: 'LANSCE · 2019–2024', maskLabel: 'Point-wise mask', figure: 4,
        folder: 'figures/LANSCE-1/point',
        files: [
          'Sample-456_Split-2_Ch-0_M-B_DS-0_MR-0.15_MAE=1.6681e-04.png',
          'Sample-467_Split-8_Ch-2_M-B_DS-0_MR-0.15_MAE=6.2682e-03.png',
          'Sample-726_Split-4_Ch-2_M-B_DS-0_MR-0.15_MAE=9.5087e-11.png',
          'Sample-856_Split-0_Ch-3_M-B_DS-0_MR-0.15_MAE=2.2923e-06.png',
          'Sample-780_Split-9_Ch-0_M-B_DS-0_MR-0.15_MAE=1.3958e-05.png'
        ]
      },
      {
        facility: 'lansce-history', mask: 'block', facilityLabel: 'LANSCE · 2019–2024', maskLabel: 'Block-wise mask', figure: 5,
        folder: 'figures/LANSCE-1/block',
        files: [
          'Sample-146_Split-6_Ch-1_M-B_DS-0_MR-0.15_MAE=6.1262e-06.png',
          'Sample-903_Split-6_Ch-3_M-B_DS-0_MR-0.15_MAE=6.9402e-04.png',
          'Sample-910_Split-2_Ch-0_M-B_DS-0_MR-0.15_MAE=1.1667e-02.png',
          'Sample-1109_Split-7_Ch-2_M-B_DS-0_MR-0.15_MAE=5.9553e-05.png',
          'Sample-976_Split-0_Ch-29_M-B_DS-0_MR-0.15_MAE=0.0000e+00.png'
        ]
      },
      {
        facility: 'lansce-2025', mask: 'point', facilityLabel: 'LANSCE · 2025', maskLabel: 'Point-wise mask', figure: 6,
        folder: 'figures/LANSCE-2/point',
        files: [
          'Sample-16_Split-1_Ch-76_M-B_DS-1_MR-0.15_MAE=4.4983e-08.png',
          'Sample-16_Split-4_Ch-123_M-B_DS-1_MR-0.15_MAE=2.7316e-07.png',
          'Sample-16_Split-8_Ch-526_M-B_DS-1_MR-0.15_MAE=0.0000e+00.png',
          'Sample-2_Split-4_Ch-278_M-B_DS-1_MR-0.15_MAE=0.0000e+00.png',
          'Sample-5_Split-0_Ch-205_M-B_DS-1_MR-0.15_MAE=7.6561e-06.png'
        ]
      },
      {
        facility: 'lansce-2025', mask: 'block', facilityLabel: 'LANSCE · 2025', maskLabel: 'Block-wise mask', figure: 7,
        folder: 'figures/LANSCE-2/block',
        files: [
          'Sample-16_Split-8_Ch-46_M-B_DS-1_MR-0.15_MAE=0.0000e+00.png',
          'Sample-4_Split-7_Ch-216_M-B_DS-1_MR-0.15_MAE=0.0000e+00.png',
          'Sample-14_Split-5_Ch-656_M-B_DS-1_MR-0.15_MAE=0.0000e+00.png',
          'Sample-16_Split-7_Ch-270_M-B_DS-1_MR-0.15_MAE=0.0000e+00.png',
          'Sample-1_Split-0_Ch-635_M-B_DS-1_MR-0.15_MAE=4.5858e-06.png'
        ]
      },
      {
        facility: 'lhc', mask: 'point', facilityLabel: 'LHC · CERN', maskLabel: 'Point-wise mask', figure: 8,
        folder: 'figures/LHC/point',
        files: [
          'Sample-0_Split-1_Ch-2_M-B_DS-2_MR-0.15_MAE=1.8878e-05.png',
          'Sample-0_Split-114_Ch-0_M-B_DS-2_MR-0.15_MAE=7.5963e-03.png',
          'Sample-0_Split-15_Ch-0_M-B_DS-2_MR-0.15_MAE=7.2742e-10.png',
          'Sample-0_Split-3_Ch-3_M-B_DS-2_MR-0.15_MAE=8.0573e-06.png',
          'Sample-0_Split-57_Ch-1_M-B_DS-2_MR-0.15_MAE=3.1044e-10.png'
        ]
      },
      {
        facility: 'sns', mask: 'point', facilityLabel: 'SNS · Oak Ridge', maskLabel: 'Point-wise mask', figure: 9,
        folder: 'figures/SNS/point',
        files: [
          'Sample-1_Split-0_Ch-7_M-B_DS-3_MR-0.15_MAE=5.2937e-04.png',
          'Sample-1_Split-1_Ch-0_M-B_DS-3_MR-0.15_MAE=4.4882e-02.png',
          'Sample-1_Split-3_Ch-6_M-B_DS-3_MR-0.15_MAE=7.8161e-03.png',
          'Sample-103_Split-0_Ch-6_M-B_DS-3_MR-0.15_MAE=3.8125e-03.png',
          'Sample-79_Split-2_Ch-6_M-B_DS-3_MR-0.15_MAE=9.0885e-04.png'
        ]
      },
      {
        facility: 'sns', mask: 'block', facilityLabel: 'SNS · Oak Ridge', maskLabel: 'Block-wise mask', figure: 10,
        folder: 'figures/SNS/block',
        files: [
          'Sample-22_Split-0_Ch-0_M-B_DS-3_MR-0.15_MAE=4.7777e-02.png',
          'Sample-22_Split-0_Ch-2_M-B_DS-3_MR-0.15_MAE=1.7489e-02.png',
          'Sample-27_Split-3_Ch-8_M-B_DS-3_MR-0.15_MAE=2.8433e-03.png',
          'Sample-48_Split-2_Ch-8_M-B_DS-3_MR-0.15_MAE=4.9814e-04.png',
          'Sample-57_Split-0_Ch-8_M-B_DS-3_MR-0.15_MAE=7.9181e-04.png'
        ]
      },
      {
        facility: 'lcls', mask: 'point', facilityLabel: 'LCLS · SLAC', maskLabel: 'Point-wise mask', figure: 11,
        folder: 'figures/LCLS/point',
        files: [
          'Sample-228_Split-0_Ch-8_M-B_DS-4_MR-0.15_MAE=6.3293e-02.png',
          'Sample-841_Split-0_Ch-6_M-B_DS-4_MR-0.15_MAE=5.7797e-02.png',
          'Sample-964_Split-1_Ch-8_M-B_DS-4_MR-0.15_MAE=3.2478e-03.png',
          'Sample-1026_Split-0_Ch-6_M-B_DS-4_MR-0.15_MAE=6.2990e-02.png',
          'Sample-999_Split-1_Ch-7_M-B_DS-4_MR-0.15_MAE=1.7676e-02.png'
        ]
      },
      {
        facility: 'lcls', mask: 'block', facilityLabel: 'LCLS · SLAC', maskLabel: 'Block-wise mask', figure: 12,
        folder: 'figures/LCLS/block',
        files: [
          'Sample-1026_Split-0_Ch-5_M-B_DS-4_MR-0.15_MAE=2.0360e-03.png',
          'Sample-227_Split-1_Ch-7_M-B_DS-4_MR-0.15_MAE=2.6273e-02.png',
          'Sample-228_Split-0_Ch-6_M-B_DS-4_MR-0.15_MAE=2.1459e-02.png',
          'Sample-72_Split-0_Ch-0_M-B_DS-4_MR-0.15_MAE=5.2664e-02.png',
          'Sample-662_Split-0_Ch-6_M-B_DS-4_MR-0.15_MAE=2.6112e-02.png'
        ]
      },
      {
        facility: 'gmps-booster', mask: 'combined', facilityLabel: 'Booster · Fermilab', maskLabel: 'Point-wise + block-wise masks', figure: 13,
        folder: 'figures_rebuttal',
        files: [
          'Sample-0_Split-197_Ch-16_M-B_DS-6_MR-0.15_MAE=3.1402e-03.png',
          'Sample-0_Split-202_Ch-20_M-B_DS-6_MR-0.15_MAE=0.0000e+00.png',
          'Sample-0_Split-205_Ch-6_M-B_DS-6_MR-0.15_MAE=3.3181e-02.png',
          'Sample-0_Split-902_Ch-1_M-B_DS-6_MR-0.15_MAE=0.0000e+00.png',
          'Sample-0_Split-907_Ch-0_M-B_DS-6_MR-0.15_MAE=0.0000e+00.png'
        ]
      }
    ].map((slide) => ({
      ...slide,
      images: slide.files.map((file) => `${paperSourceRoot}/${slide.folder}/${file}`)
    }));
    const facilityButtons = [...document.querySelectorAll('[data-imputation-facility]')];
    const maskButtons = [...document.querySelectorAll('[data-imputation-mask]')];
    const imputationZoomLink = document.querySelector('#imputationZoomLink');
    const imputationPanelImages = imputationPanelLinks.map((link) => link.querySelector('img'));
    const imputationPanelGrid = document.querySelector('#imputationResultPanels');
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
      const altBase = `${slide.facilityLabel} ${slide.maskLabel.toLowerCase()} imputation with 15 percent of sensor values hidden`;

      imputationPanelLinks.forEach((link, panelIndex) => {
        const image = imputationPanelImages[panelIndex];
        const source = slide.images[panelIndex];
        const panelTitle = `${title} · Panel ${panelIndex + 1}`;
        if (image.getAttribute('src') !== source) {
          image.classList.add('is-loading');
          image.src = source;
        }
        image.alt = `${altBase}, panel ${panelIndex + 1}; blue is ground truth, red is hidden data, and green is the model prediction.`;
        link.href = source;
        link.dataset.title = panelTitle;
        link.setAttribute('aria-label', `Open panel ${panelIndex + 1} of ${slide.facilityLabel} ${slide.maskLabel.toLowerCase()} at full resolution`);
      });

      if (imputationZoomLink) {
        imputationZoomLink.href = slide.images[0];
        imputationZoomLink.dataset.title = `${title} · Panel 1`;
      }
      if (imputationPanelGrid) imputationPanelGrid.setAttribute('aria-label', `Five camera-ready panels for ${slide.facilityLabel} ${slide.maskLabel.toLowerCase()}`);

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

    imputationPanelImages.forEach((image) => image.addEventListener('load', () => {
      image.width = image.naturalWidth;
      image.height = image.naturalHeight;
      image.classList.remove('is-loading');
    }));

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
