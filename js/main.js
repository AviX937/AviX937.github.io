document.addEventListener('DOMContentLoaded', () => {
  const langBtn = document.getElementById('lang-toggle');
  let currentLang = localStorage.getItem('site-lang') || 'ru';
  applyLanguage(currentLang);

  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('site-lang', currentLang);
    applyLanguage(currentLang);
  });

  // Подсветка активного пункта в оглавлении
  const tocLinks = document.querySelectorAll('.toc a');
  const sections = [];
  tocLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      const id = href.substring(1);
      const section = document.getElementById(id);
      if (section) sections.push({ id, section });
    }
  });

  function highlightToc() {
    const scrollY = window.scrollY + 80;
    let current = '';
    sections.forEach(({ id, section }) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        current = id;
      }
    });
    tocLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        const linkId = href.substring(1);
        link.classList.toggle('active', linkId === current);
      }
    });
  }

  window.addEventListener('scroll', highlightToc);
  highlightToc();

  // Подсветка активного пункта основного меню (для якорных ссылок)
  const navLinks = document.querySelectorAll('.nav a[href^="/#"]');
  function highlightNav() {
    const scrollY = window.scrollY + 100;
    let current = '';
    sections.forEach(({ id, section }) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        current = id;
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkId = href.split('#')[1];
      link.classList.toggle('active', linkId === current);
    });
  }
  window.addEventListener('scroll', highlightNav);
  highlightNav();

  function applyLanguage(lang) {
    document.documentElement.lang = lang;
    const btn = document.getElementById('lang-toggle');
    btn.textContent = lang === 'ru' ? 'EN' : 'RU';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const path = el.getAttribute('data-i18n');
      const translation = getNestedTranslation(i18n[lang], path);
      if (translation !== undefined) {
        el.textContent = translation;
      }
    });

    const resumeLink = document.querySelector('.resume-link');
    if (resumeLink) {
      resumeLink.href = `assets/resume_${lang}.pdf`;
    }
  }

  function getNestedTranslation(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }
});