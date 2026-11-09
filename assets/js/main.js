(function () {
  'use strict';

  var STORAGE_KEY = 'cv-lang';
  var DEFAULT_LANG = 'en';
  var toggle = document.getElementById('langToggle');

  function savedLang() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function applyLang(lang) {
    var dict = window.I18N[lang] || window.I18N[DEFAULT_LANG];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = dict[el.getAttribute('data-i18n')];
      if (value !== undefined) el.innerHTML = value;
    });

    // Tooltips (CSS-only, read from data-tooltip)
    document.querySelectorAll('[data-i18n-tooltip]').forEach(function (el) {
      var value = dict[el.getAttribute('data-i18n-tooltip')];
      if (value !== undefined) el.setAttribute('data-tooltip', value);
    });

    document.documentElement.lang = lang;
    document.title = dict['meta.title'];
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', dict['meta.description']);

    // Button shows the language you can switch TO
    var next = lang === 'en' ? 'es' : 'en';
    toggle.textContent = next.toUpperCase();
    toggle.setAttribute('aria-label', next === 'es' ? 'Ver en español' : 'View in English');

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
  }

  var current = savedLang() === 'es' ? 'es' : DEFAULT_LANG;
  if (current !== DEFAULT_LANG) applyLang(current);

  toggle.addEventListener('click', function () {
    current = current === 'en' ? 'es' : 'en';
    applyLang(current);
  });

  // Navbar shadow on scroll
  var nav = document.getElementById('mainNav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Close mobile menu after picking a link
  var menu = document.getElementById('navMenu');
  menu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (menu.classList.contains('show') && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
