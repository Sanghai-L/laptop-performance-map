'use strict';
(() => {
  const storageKey = 'laptop-map-theme';
  const root = document.documentElement;
  const stylesheet = document.getElementById('theme-tech');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let selected = 'classic';
  try {
    if (localStorage.getItem(storageKey) === 'tech') selected = 'tech';
  } catch {}

  function apply(theme) {
    selected = theme === 'tech' ? 'tech' : 'classic';
    root.dataset.theme = selected;
    stylesheet.media = selected === 'tech' ? 'all' : 'not all';
    themeColor.content = selected === 'tech' ? '#f3f6fa' : '#f7f8f4';
  }

  // Run in the head so a saved theme applies before the page is displayed.
  apply(selected);
  document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('theme-select');
    select.value = selected;
    select.addEventListener('change', () => {
      apply(select.value);
      try { localStorage.setItem(storageKey, selected); } catch {}
    });
  }, {once:true});
})();
