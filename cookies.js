/* =====================================================
   cookies.js — GDPR + zákon č. 127/2005 Sb. compliant
   Granular consent: necessary / analytics / marketing
   ===================================================== */
(function () {
  'use strict';

  var COOKIE_NAME = 'an_consent_v1';
  var COOKIE_DAYS = 365;

  /* ---------- helpers ---------- */
  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) +
      '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function getConsent() {
    var raw = getCookie(COOKIE_NAME);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function saveConsent(obj) {
    obj.ts = Date.now();
    setCookie(COOKIE_NAME, JSON.stringify(obj), COOKIE_DAYS);
  }

  function applyConsent(consent) {
    /* Analytics (Google Analytics placeholder) */
    if (consent.analytics) {
      window['ga-disable-UA-XXXXXXXX-X'] = false;
    } else {
      window['ga-disable-UA-XXXXXXXX-X'] = true;
    }
    /* Marketing — zatím prázdné, připraveno pro FB Pixel apod. */
    /* dispatch event for other scripts */
    window.dispatchEvent(new CustomEvent('consentUpdated', { detail: consent }));
  }

  /* ---------- build banner ---------- */
  function buildBanner() {
    var style = document.createElement('style');
    style.textContent = [
      '#an-cookie-root *{box-sizing:border-box;font-family:\'Inter\',sans-serif}',
      '#an-cookie-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9000;display:flex;align-items:flex-end;justify-content:center;padding:0 0 0 0}',
      '#an-cookie-banner{width:100%;max-width:780px;margin:0 auto;background:#161616;border:1px solid rgba(255,255,255,.1);border-bottom:none;border-radius:20px 20px 0 0;padding:28px 32px 32px;color:#f0f0f0;box-shadow:0 -24px 80px rgba(0,0,0,.5)}',
      '@media(max-width:600px){#an-cookie-banner{padding:20px 18px 24px;border-radius:16px 16px 0 0}}',
      '#an-cookie-banner h2{margin:0 0 10px;font-size:1.05rem;font-weight:700;color:#fff}',
      '#an-cookie-banner p{margin:0 0 18px;font-size:.85rem;color:#b0b0b0;line-height:1.55}',
      '#an-cookie-banner a{color:#e63946;text-decoration:underline}',
      '.an-toggle-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-top:1px solid rgba(255,255,255,.07)}',
      '.an-toggle-row:first-child{border-top:none}',
      '.an-toggle-info strong{display:block;font-size:.88rem;color:#e0e0e0;font-weight:600}',
      '.an-toggle-info span{font-size:.78rem;color:#888}',
      '.an-switch{position:relative;width:44px;height:24px;flex-shrink:0}',
      '.an-switch input{opacity:0;width:0;height:0;position:absolute}',
      '.an-slider{position:absolute;inset:0;border-radius:999px;background:#333;cursor:pointer;transition:background .2s}',
      '.an-slider::before{content:\'\';position:absolute;width:18px;height:18px;left:3px;top:3px;border-radius:50%;background:#fff;transition:transform .2s}',
      '.an-switch input:checked+.an-slider{background:#e63946}',
      '.an-switch input:checked+.an-slider::before{transform:translateX(20px)}',
      '.an-switch input:disabled+.an-slider{opacity:.5;cursor:not-allowed}',
      '.an-btns{display:flex;gap:10px;margin-top:20px;flex-wrap:wrap}',
      '.an-btn{flex:1;min-width:130px;padding:13px 18px;border-radius:999px;border:0;cursor:pointer;font-size:.9rem;font-weight:700;transition:transform .15s,box-shadow .15s}',
      '.an-btn-all{background:#e63946;color:#fff;box-shadow:0 8px 24px rgba(230,57,70,.25)}',
      '.an-btn-all:hover{transform:translateY(-1px);box-shadow:0 14px 30px rgba(230,57,70,.3)}',
      '.an-btn-sel{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.14)}',
      '.an-btn-sel:hover{background:rgba(255,255,255,.13)}',
      '.an-btn-rej{background:transparent;color:#888;border:1px solid rgba(255,255,255,.1)}',
      '.an-btn-rej:hover{color:#bbb}',
      /* floating re-open button */
      '#an-cookie-reopen{position:fixed;left:18px;bottom:18px;z-index:8000;background:#1a1a1a;border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:9px 16px;font-size:.78rem;color:#aaa;cursor:pointer;display:none;align-items:center;gap:7px;transition:background .2s}',
      '#an-cookie-reopen:hover{background:#242424;color:#fff}',
    ].join('');
    document.head.appendChild(style);

    var root = document.createElement('div');
    root.id = 'an-cookie-root';

    root.innerHTML = '<div id="an-cookie-overlay">' +
      '<div id="an-cookie-banner" role="dialog" aria-modal="true" aria-label="Nastavení cookies">' +
        '<h2>🍪 Používáme cookies</h2>' +
        '<p>Tato stránka používá cookies v souladu s GDPR a zákonem č.&nbsp;127/2005&nbsp;Sb. ' +
        'Nezbytné cookies zajišťují funkčnost webu a nelze je vypnout. ' +
        'Ostatní cookies používáme pouze s vaším souhlasem. ' +
        'Více informací: <a href="cookies.html">Zásady cookies</a> | <a href="podminky.html">Smluvní podmínky</a> | <a href="gdpr.html">Ochrana osobních údajů</a>.</p>' +
        '<div class="an-toggle-row">' +
          '<div class="an-toggle-info"><strong>Nezbytné cookies</strong><span>Zajišťují základní funkce webu — formulář, bezpečnost.</span></div>' +
          '<label class="an-switch"><input type="checkbox" id="an-nec" checked disabled><span class="an-slider"></span></label>' +
        '</div>' +
        '<div class="an-toggle-row">' +
          '<div class="an-toggle-info"><strong>Analytické cookies</strong><span>Pomáhají nám pochopit, jak web používáte (Google Analytics).</span></div>' +
          '<label class="an-switch"><input type="checkbox" id="an-ana"><span class="an-slider"></span></label>' +
        '</div>' +
        '<div class="an-toggle-row">' +
          '<div class="an-toggle-info"><strong>Marketingové cookies</strong><span>Umožňují relevantní reklamu (Facebook Pixel, retargeting).</span></div>' +
          '<label class="an-switch"><input type="checkbox" id="an-mkt"><span class="an-slider"></span></label>' +
        '</div>' +
        '<div class="an-btns">' +
          '<button class="an-btn an-btn-all" id="an-accept-all">Přijmout vše</button>' +
          '<button class="an-btn an-btn-sel" id="an-accept-sel">Uložit výběr</button>' +
          '<button class="an-btn an-btn-rej" id="an-reject-all">Pouze nezbytné</button>' +
        '</div>' +
      '</div>' +
    '</div>';

    /* floating reopen button */
    var reopen = document.createElement('button');
    reopen.id = 'an-cookie-reopen';
    reopen.setAttribute('aria-label', 'Nastavení cookies');
    reopen.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg> Cookies';
    document.body.appendChild(reopen);
    document.body.appendChild(root);

    /* events */
    root.querySelector('#an-accept-all').addEventListener('click', function () {
      var c = { necessary: true, analytics: true, marketing: true };
      saveConsent(c); applyConsent(c); hide();
    });
    root.querySelector('#an-accept-sel').addEventListener('click', function () {
      var c = {
        necessary: true,
        analytics: !!root.querySelector('#an-ana').checked,
        marketing: !!root.querySelector('#an-mkt').checked
      };
      saveConsent(c); applyConsent(c); hide();
    });
    root.querySelector('#an-reject-all').addEventListener('click', function () {
      var c = { necessary: true, analytics: false, marketing: false };
      saveConsent(c); applyConsent(c); hide();
    });
    reopen.addEventListener('click', function () {
      root.style.display = '';
      reopen.style.display = 'none';
      /* pre-fill toggles from saved consent */
      var saved = getConsent();
      if (saved) {
        root.querySelector('#an-ana').checked = !!saved.analytics;
        root.querySelector('#an-mkt').checked = !!saved.marketing;
      }
    });
  }

  function hide() {
    var root = document.getElementById('an-cookie-root');
    if (root) root.style.display = 'none';
    var reopen = document.getElementById('an-cookie-reopen');
    if (reopen) reopen.style.display = 'flex';
  }

  /* ---------- init ---------- */
  function init() {
    var existing = getConsent();
    if (existing) {
      applyConsent(existing);
      /* still build the hidden reopen button */
      buildBanner();
      hide();
    } else {
      buildBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
