document.addEventListener('DOMContentLoaded', () => {
  const langBtn = document.getElementById('lang-toggle');
  
  let currentLang = localStorage.getItem('site-lang') || 'ru';
  applyLanguage(currentLang);

  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('site-lang', currentLang);
    applyLanguage(currentLang);
  });

  // Подсветка активного пункта меню
  highlightActiveNav();
  
  // Если на странице есть сетка портфолио — отрисовать
  if (document.getElementById('portfolio-grid')) {
    renderPortfolio(currentLang);
  }
});

function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  const btn = document.getElementById('lang-toggle');
  btn.textContent = lang === 'ru' ? 'EN' : 'RU';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const path = el.getAttribute('data-i18n');
    const translation = getNestedTranslation(i18n[lang], path);
    if (translation !== undefined) {
      if (el.tagName === 'A' && el.getAttribute('download') !== null) {
        // Меняем файл резюме в зависимости от языка
        el.href = `assets/resume_${lang}.pdf`;
        el.textContent = translation;
      } else {
        el.textContent = translation;
      }
    }
  });

  // Обновляем портфолио, если оно есть на странице
  if (document.getElementById('portfolio-grid')) {
    renderPortfolio(lang);
  }
  
  // Обновляем title страницы (можно задать через data-i18n на title, но проще прописать в i18n для каждой страницы)
  updatePageTitle(lang);
}

function updatePageTitle(lang) {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const titles = {
    'index.html': { ru: 'Ваше Имя — Главная', en: 'Your Name — Home' },
    'about.html': { ru: 'Обо мне', en: 'About' },
    'portfolio.html': { ru: 'Портфолио', en: 'Portfolio' },
    'services.html': { ru: 'Услуги', en: 'Services' },
    'contact.html': { ru: 'Контакты', en: 'Contact' }
  };
  if (titles[currentPage]) {
    document.title = titles[currentPage][lang];
  }
}

function getNestedTranslation(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function renderPortfolio(lang) {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  grid.innerHTML = projects.map(p => {
    const title = lang === 'ru' ? p.titleRu : p.titleEn;
    const desc = lang === 'ru' ? p.descRu : p.descEn;
    return `
      <div class="portfolio-card">
        <img src="${p.thumb}" alt="${title}" loading="lazy">
        <div class="portfolio-card__caption">
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>
      </div>
    `;
  }).join('');
}