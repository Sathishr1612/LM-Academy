/* LM Academy - vanilla JS (no frameworks) */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp links (prefilled message) ---------- */
  var WA = 'https://wa.me/918098000121?text=' + encodeURIComponent(
    'Hi LM Academy, I am interested in learning about your ROOT Concept trading course. Please share the course details, fees and batch timings. Thank you!');
  document.querySelectorAll('.js-wa').forEach(function (a) { a.href = WA; });

  /* ---------- helpers ---------- */
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function rng(seed) { // small deterministic PRNG so graphics look identical every load
    return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  }

  /* ---------- Sticky nav state ---------- */
  var nav = document.getElementById('topnav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* close mobile menu after choosing a link */
  var menu = document.getElementById('navMenu');
  document.querySelectorAll('#navMenu .nav-link').forEach(function (l) {
    l.addEventListener('click', function () {
      if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    });
  });

  /* ---------- Active nav link ---------- */
  var links = {};
  document.querySelectorAll('#navMenu .nav-link').forEach(function (l) { links[l.getAttribute('href').slice(1)] = l; });
  var ids = Object.keys(links);
  function setActive() {
    var y = window.scrollY + 140, cur = ids[0];
    ids.forEach(function (id) { var s = document.getElementById(id); if (s && s.offsetTop <= y) cur = id; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) cur = ids[ids.length - 1];
    ids.forEach(function (id) {
      links[id].classList.toggle('active', id === cur);
      if (id === cur) links[id].setAttribute('aria-current', 'true'); else links[id].removeAttribute('aria-current');
    });
  }
  setActive();
  window.addEventListener('scroll', setActive, { passive: true });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (n) { io.observe(n); });
  } else {
    revealEls.forEach(function (n) { n.classList.add('in'); });
  }

  /* ---------- Stage tabs: hint hand + next buttons ---------- */
  var hand = document.getElementById('tapHand');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.stage-tab'));
  var visited = [true, false, false];   // stage 1 is open on load
  var current = 0;
  function placeHand() {
    if (!hand) return;
    var next = -1, i;
    for (i = current + 1; i < tabs.length; i++) if (!visited[i]) { next = i; break; }
    if (next < 0) for (i = 0; i < current; i++) if (!visited[i]) { next = i; break; }
    if (next < 0) { hand.classList.add('gone'); return; }   // all stages seen
    var t = tabs[next];
    hand.style.left = (t.offsetLeft + t.offsetWidth * 0.58) + 'px';
    hand.style.top = (t.offsetTop + t.offsetHeight * 0.62) + 'px';
    hand.classList.remove('gone');
  }
  tabs.forEach(function (t, idx) {
    t.addEventListener('shown.bs.tab', function () { current = idx; visited[idx] = true; placeHand(); });
  });
  placeHand();
  window.addEventListener('resize', placeHand);
  document.querySelectorAll('[data-go]').forEach(function (b) {
    b.addEventListener('click', function () {
      var tab = document.getElementById(b.getAttribute('data-go'));
      if (!tab) return;
      bootstrap.Tab.getOrCreateInstance(tab).show();
      var box = document.querySelector('.stage-tabs');
      var top = box.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Decorative candlestick backgrounds ---------- */
  function candles(svg, count, seed) {
    var W = 1200, H = 600, r = rng(seed), price = 300, step = W / count;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    for (var i = 0; i < count; i++) {
      var open = price, move = (r() - 0.47) * 60;
      var close = Math.max(120, Math.min(480, open + move));
      var hi = Math.max(open, close) + r() * 30, lo = Math.min(open, close) - r() * 30;
      price = close;
      var up = close >= open, col = up ? '#00C853' : '#E53935', x = i * step + step / 2;
      var g = el('g', { 'class': 'c', style: '--s:' + (1 + r() * 0.25).toFixed(2) + ';animation-delay:' + (-r() * 6).toFixed(2) + 's' }, svg);
      el('line', { x1: x, x2: x, y1: H - hi, y2: H - lo, stroke: col, 'stroke-width': 1.5, opacity: 0.55 }, g);
      el('rect', { x: x - step * 0.22, width: step * 0.44, y: H - Math.max(open, close), height: Math.max(3, Math.abs(close - open)), fill: col, opacity: 0.35 }, g);
    }
  }
  var hc = document.getElementById('heroCandles'); if (hc) candles(hc, 34, 7);
  var cc = document.getElementById('ctaCandles'); if (cc) candles(cc, 40, 21);

  /* ---------- Golden ROOT tree (abstract) ---------- */
  var tree = document.getElementById('rootTree');
  if (tree) {
    var r2 = rng(11), cx = 260, base = 300;
    var defs = el('defs', {}, tree);
    var gr = el('linearGradient', { id: 'tg', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el('stop', { offset: '0', 'stop-color': '#F5CC65' }, gr);
    el('stop', { offset: '1', 'stop-color': '#D4AF37' }, gr);
    var rg = el('radialGradient', { id: 'tglow', cx: '50%', cy: '52%', r: '50%' }, defs);
    el('stop', { offset: '0', 'stop-color': 'rgba(212,175,55,.22)' }, rg);
    el('stop', { offset: '1', 'stop-color': 'rgba(212,175,55,0)' }, rg);
    el('circle', { cx: cx, cy: base, r: 250, fill: 'url(#tglow)' }, tree);
    // ground line
    el('line', { x1: 40, x2: 480, y1: base, y2: base, stroke: '#D4AF37', 'stroke-opacity': 0.35, 'stroke-dasharray': '2 6' }, tree);

    var gT = el('g', { fill: 'none', stroke: 'url(#tg)', 'stroke-linecap': 'round' }, tree);
    var gN = el('g', {}, tree);

    function branch(x, y, ang, len, w, depth, dir, delay) {
      var x2 = x + Math.sin(ang) * len, y2 = y - Math.cos(ang) * len * dir;
      var bend = (r2() - 0.5) * len * 0.5;
      var mx = (x + x2) / 2 + Math.cos(ang) * bend, my = (y + y2) / 2 + Math.sin(ang) * bend * dir;
      var p = el('path', { d: 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1),
        'stroke-width': w.toFixed(1), 'stroke-opacity': dir > 0 ? 0.95 : 0.7, 'class': 'branch', style: '--bd:' + delay.toFixed(2) + 's' }, gT);
      var l = Math.ceil(len * 1.25); p.style.setProperty('--len', l);
      if (depth <= 0) {
        if (dir > 0) {
          el('circle', { cx: x2, cy: y2, r: 3.2, fill: r2() > 0.5 ? '#00C853' : '#F5CC65' }, gN).setAttribute('opacity', 0.9);
        }
        return;
      }
      var n = depth > 2 ? 2 : 2 + (r2() > 0.55 ? 1 : 0);
      for (var i = 0; i < n; i++) {
        var spread = (i - (n - 1) / 2) * (0.55 + r2() * 0.25) + (r2() - 0.5) * 0.2;
        branch(x2, y2, ang + spread, len * (0.7 + r2() * 0.08), w * 0.68, depth - 1, dir, delay + 0.28);
      }
    }
    branch(cx, base, 0, 78, 12, 5, 1, 0);          // crown
    branch(cx, base, 0.0, 74, 12, 5, -1, 0.1);     // roots (mirrored below)
    // extra side roots
    branch(cx, base + 6, -0.9, 60, 6, 3, -1, 0.5);
    branch(cx, base + 6, 0.9, 60, 6, 3, -1, 0.5);
  }

  /* ---------- Mini illustrative charts ---------- */
  document.querySelectorAll('.mini-chart').forEach(function (box, idx) {
    var kind = box.getAttribute('data-kind'), r = rng(40 + idx * 9), W = 240, H = 90;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'none', 'aria-hidden': 'true' }, box);
    var n = 16, step = W / n, price = 50, pts = [];
    for (var i = 0; i < n; i++) {
      var o = price, c = Math.max(18, Math.min(72, o + (r() - 0.45) * 18)); price = c;
      var up = c >= o, col = up ? '#00C853' : '#E53935', x = i * step + step / 2;
      var hi = Math.max(o, c) + r() * 7, lo = Math.min(o, c) - r() * 7;
      var special = (kind === 'imo' && i === 10) || (kind === 'lo' && i === 12);
      if (special) { col = '#F5CC65'; hi += 8; lo -= 8; }
      el('line', { x1: x, x2: x, y1: H - hi, y2: H - lo, stroke: col, 'stroke-width': 1, opacity: special ? 1 : 0.7 }, svg);
      el('rect', { x: x - (special ? 6 : 3), width: special ? 12 : 6, y: H - Math.max(o, c) - (special ? 4 : 0), height: Math.max(3, Math.abs(c - o)) + (special ? 8 : 0), fill: col, opacity: special ? 1 : 0.65 }, svg);
      pts.push([x, H - (o + c) / 2]);
    }
    if (kind === 'avg') {
      var sm = pts.map(function (p, i) { var a = pts[Math.max(0, i - 2)][1], b = pts[Math.min(pts.length - 1, i + 2)][1]; return [p[0], (a + p[1] + b) / 3]; });
      var d = sm.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
      el('path', { d: d, fill: 'none', stroke: '#D4AF37', 'stroke-width': 1.6 }, svg);
    }
  });
})();
