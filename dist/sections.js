'use strict';
(() => {
  const key = 'laptop-map-intro-collapsed';
  let collapsed = false;
  try { collapsed = localStorage.getItem(key) === 'true'; } catch {}
  // Set the preference before the introduction can paint.
  document.documentElement.dataset.introState = collapsed ? 'collapsed' : 'expanded';

  document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('starter-content');
    const button = document.getElementById('starter-toggle');
    const label = document.getElementById('starter-toggle-label');
    const t = value => window.CPU_I18N.t(value);
    function setCollapsed(value, remember = true) {
      collapsed = value;
      document.documentElement.dataset.introState = value ? 'collapsed' : 'expanded';
      content.hidden = value;
      button.setAttribute('aria-expanded', String(!value));
      label.textContent = t(value ? '显示示例' : '隐藏示例');
      button.setAttribute('aria-label', t(value ? '显示轻薄本配置示例' : '隐藏轻薄本配置示例'));
      if (remember) try { localStorage.setItem(key, String(value)); } catch {}
    }
    setCollapsed(collapsed, false);
    button.hidden = false;
    button.addEventListener('click', () => setCollapsed(!collapsed));
    // A navigation link requesting the examples should reveal them before scrolling.
    document.querySelector('.site-header nav a[href="#start"]').addEventListener('click', () => setCollapsed(false));
  }, {once:true});
})();
