document.addEventListener('DOMContentLoaded', () => {
  const langBtn = document.getElementById('lang-toggle');
  
  // Определение языка: localStorage или браузерный
  let currentLang = localStorage.getItem('site-lang') || 'ru';
  applyLanguage(currentLang);

  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('site-lang', currentLang);
    applyLanguage(currentLang);
  });

  renderPortfolio(currentLang);
});

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  const btn = document.getElementById('lang-toggle');
  btn.textContent = lang === 'ru' ? 'EN' : 'RU';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const path = el.getAttribute('data-i18n');
    const translation = getNestedTranslation(i18n[lang], path);
    if (translation !== undefined) {
      if (el.tagName === 'A' && el.getAttribute('download') !== null) {
        // Ссылка на резюме: меняем href в зависимости от языка
        el.href = `assets/resume_${lang}.pdf`;
        el.textContent = translation;
      } else {
        el.textContent = translation;
      }
    }
  });

  // Обновить портфолио, т.к. язык изменился
  renderPortfolio(lang);
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