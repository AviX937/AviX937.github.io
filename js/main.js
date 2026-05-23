document.addEventListener('DOMContentLoaded', () => {
  const langBtn = document.getElementById('lang-toggle');
  let currentLang = localStorage.getItem('site-lang') || 'ru';
  applyLanguage(currentLang);

  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('site-lang', currentLang);
    applyLanguage(currentLang);
  });

  // ---- Логика появления ссылок в хедере ----
  const toc = document.getElementById('toc');
  const headerNav = document.getElementById('header-nav');

  if (toc && headerNav) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            headerNav.classList.add('visible');
          } else {
            headerNav.classList.remove('visible');
          }
        });
      },
      { rootMargin: '-64px 0px 0px 0px' }   // высота хедера
    );
    observer.observe(toc);
  }

  // ---- Подсветка активных ссылок (toc + хедер) ----
  const sections = [];
  const allNavLinks = [];

  // Собираем ссылки из ToC и из хедер-навигации
  const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  const headerLinks = document.querySelectorAll('.header-nav a[href^="/#"]');

  tocLinks.forEach(link => {
    allNavLinks.push(link);
    const id = link.getAttribute('href').substring(1);
    const section = document.getElementById(id);
    if (section) sections.push({ id, section });
  });

  headerLinks.forEach(link => {
    allNavLinks.push(link);
    // id из href вида "/#about"
    const href = link.getAttribute('href');
    const id = href.split('#')[1];
    if (!sections.some(s => s.id === id)) {
      const section = document.getElementById(id);
      if (section) sections.push({ id, section });
    }
  });

  function highlightAllNav() {
    const scrollY = window.scrollY + 100;
    let current = '';
    sections.forEach(({ id, section }) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        current = id;
      }
    });

    allNavLinks.forEach(link => {
      let linkId;
      if (link.getAttribute('href').startsWith('#')) {
        linkId = link.getAttribute('href').substring(1);
      } else {
        linkId = link.getAttribute('href').split('#')[1];
      }
      link.classList.toggle('active', linkId === current);
    });
  }

  window.addEventListener('scroll', highlightAllNav);
  highlightAllNav();

  // ---- Смена языка ----
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