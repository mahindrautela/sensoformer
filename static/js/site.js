const copyButton = document.querySelector('#copyCitation');
const citation = document.querySelector('#bibtex code');

copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(citation.textContent.trim());
    copyButton.textContent = 'Copied';
    window.setTimeout(() => { copyButton.textContent = 'Copy BibTeX'; }, 1800);
  } catch {
    copyButton.textContent = 'Select BibTeX below';
  }
});

const navLinks = [...document.querySelectorAll('.page-nav a')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-25% 0px -65% 0px' });

sections.forEach((section) => observer.observe(section));
