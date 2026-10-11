// Хичээлийн хуудасны үйлдлүүд: долоо хоногийн жагсаалт, шүүлтүүр, явцын тэмдэглэгээ,
// нэр томьёоны хайлт, дэд цэсийн идэвхтэй төлөв.
(function () {
  var WEEKS = window.COURSE_WEEKS || [];
  var PHASES = window.COURSE_PHASES || {};
  var MILESTONES = window.COURSE_MILESTONES || {};
  var STORE_KEY = "se-fundamentals-progress-v1";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // `хашилт` доторх текстийг <code> болгоно (файлын нэр, команд г.м.)
  function rich(s) {
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  // ---------- Явц (зөвхөн тухайн хөтөч дээр хадгалагдана) ----------
  function loadDone() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function saveDone(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) { /* алгасна */ }
  }
  var done = loadDone();

  // ---------- Долоо хоногуудыг зурах ----------
  var list = document.getElementById("weeks");
  if (list && WEEKS.length) {
    var chevron = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
    var html = "";
    var lastPhase = null;

    WEEKS.forEach(function (w) {
      var ph = PHASES[w.phase] || { name: w.phase, weeks: "" };
      if (w.phase !== lastPhase) {
        html += '<div class="phase-sep ph-' + w.phase + '" data-phase="' + w.phase + '">' +
          esc(ph.name) + ' · ' + esc(ph.weeks) + '-р долоо хоног</div>';
        lastPhase = w.phase;
      }
      var num = (w.n < 10 ? "0" : "") + w.n;
      var bodyId = "week-" + w.n + "-body";
      var ms = w.milestone
        ? '<span class="badge badge-ms" title="' + esc(MILESTONES[w.milestone] || "") + '">' + esc(w.milestone) + '</span>'
        : "";
      var msLine = w.milestone
        ? ' <span class="muted">(' + esc(w.milestone) + (MILESTONES[w.milestone] ? " — " + esc(MILESTONES[w.milestone]) : "") + ')</span>'
        : "";
      var labMinutes = w.lab.reduce(function (s, l) { return s + l[1]; }, 0);

      html +=
        '<article class="week ph-' + w.phase + '" id="week-' + w.n + '" data-phase="' + w.phase + '" data-week="' + w.n + '">' +
          '<div class="week-head">' +
            '<button class="week-toggle" type="button" aria-expanded="false" aria-controls="' + bodyId + '">' +
              '<span class="week-num">' + num + '</span>' +
              '<span>' +
                '<span class="week-title">' + esc(w.title) + '</span>' +
                '<span class="week-en">' + esc(w.en) + '</span>' +
                '<span class="week-badges"><span class="badge badge-phase">' + esc(ph.name) + '</span>' + ms + '</span>' +
              '</span>' +
              chevron +
            '</button>' +
            '<label class="done-toggle" title="Дууссан гэж тэмдэглэх">' +
              '<input type="checkbox" data-done="' + w.n + '" aria-label="' + w.n + '-р долоо хоногийг дууссан гэж тэмдэглэх">' +
              '<span class="lbl">Дууссан</span>' +
            '</label>' +
          '</div>' +
          '<div class="week-body" id="' + bodyId + '" hidden>' +
            '<div class="week-cols">' +
              '<div>' +
                '<h4>Суралцах зорилго</h4>' +
                '<ul>' + w.goals.map(function (g) { return "<li>" + rich(g) + "</li>"; }).join("") + '</ul>' +
                '<h4>Гол ойлголтууд</h4>' +
                '<ul class="chips">' + w.concepts.map(function (c) { return '<li class="chip">' + esc(c) + "</li>"; }).join("") + '</ul>' +
                '<h4>Унших материал</h4>' +
                '<ul>' + w.reading.map(function (r) { return "<li>" + rich(r) + "</li>"; }).join("") + '</ul>' +
              '</div>' +
              '<div>' +
                '<h4>Лабораторийн ажил · ~' + labMinutes + ' мин</h4>' +
                '<ol class="lab-list">' + w.lab.map(function (l) {
                  return '<li><span><b>' + esc(l[0]) + '.</b> ' + rich(l[2]) + '</span><span class="min">' + l[1] + ' мин</span></li>';
                }).join("") + '</ol>' +
              '</div>' +
            '</div>' +
            '<div class="deliverable"><b>Долоо хоногийн эцэст:</b> ' + rich(w.outcome) + msLine + '</div>' +
          '</div>' +
        '</article>';
    });

    list.innerHTML = html;
  }

  var weekEls = list ? Array.prototype.slice.call(list.querySelectorAll(".week")) : [];

  function setOpen(el, open) {
    var btn = el.querySelector(".week-toggle");
    var body = el.querySelector(".week-body");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    body.hidden = !open;
    el.classList.toggle("is-open", open);
  }

  if (list) {
    list.addEventListener("click", function (e) {
      var btn = e.target.closest(".week-toggle");
      if (!btn) return;
      var el = btn.closest(".week");
      setOpen(el, btn.getAttribute("aria-expanded") !== "true");
    });

    list.addEventListener("change", function (e) {
      var box = e.target.closest("input[data-done]");
      if (!box) return;
      var n = Number(box.getAttribute("data-done"));
      done = done.filter(function (x) { return x !== n; });
      if (box.checked) done.push(n);
      saveDone(done);
      paintProgress();
    });
  }

  // ---------- Явцын мөр ----------
  var bar = document.getElementById("progress-bar");
  var count = document.getElementById("progress-count");
  var progress = document.querySelector(".progress");

  function paintProgress() {
    weekEls.forEach(function (el) {
      var n = Number(el.getAttribute("data-week"));
      var isDone = done.indexOf(n) !== -1;
      el.classList.toggle("is-done", isDone);
      var box = el.querySelector("input[data-done]");
      if (box) box.checked = isDone;
    });
    var total = WEEKS.length || 15;
    var k = done.filter(function (n) { return n >= 1 && n <= total; }).length;
    if (bar) bar.style.width = (k / total * 100) + "%";
    if (count) count.textContent = k + " / " + total;
    if (progress) progress.setAttribute("aria-valuenow", String(k));
  }
  paintProgress();

  var reset = document.getElementById("progress-reset");
  if (reset) {
    reset.addEventListener("click", function () {
      if (!done.length) return;
      if (!window.confirm("Бүх долоо хоногийн «Дууссан» тэмдэглэгээг арилгах уу?")) return;
      done = [];
      saveDone(done);
      paintProgress();
    });
  }

  var toggleAll = document.getElementById("toggle-all");
  if (toggleAll) {
    toggleAll.addEventListener("click", function () {
      var visible = weekEls.filter(function (el) { return !el.hidden; });
      var anyClosed = visible.some(function (el) { return !el.classList.contains("is-open"); });
      visible.forEach(function (el) { setOpen(el, anyClosed); });
      toggleAll.textContent = anyClosed ? "Бүгдийг хураах" : "Бүгдийг дэлгэх";
    });
  }

  // ---------- Үе шатаар шүүх ----------
  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter[data-filter]"));
  filters.forEach(function (f) {
    f.addEventListener("click", function () {
      var key = f.getAttribute("data-filter");
      filters.forEach(function (x) { x.setAttribute("aria-pressed", x === f ? "true" : "false"); });
      if (!list) return;
      Array.prototype.forEach.call(list.children, function (el) {
        var ph = el.getAttribute("data-phase");
        el.hidden = key !== "all" && ph !== key;
      });
    });
  });

  // ---------- #week-N холбоосоор нээх ----------
  function openFromHash() {
    var m = /^#week-(\d+)$/.exec(window.location.hash);
    if (!m) return;
    var el = document.getElementById("week-" + m[1]);
    if (!el) return;
    if (el.hidden) {
      var all = document.querySelector('.filter[data-filter="all"]');
      if (all) all.click();
    }
    setOpen(el, true);
    el.scrollIntoView({ block: "start" });
  }
  window.addEventListener("hashchange", openFromHash);
  openFromHash();

  // ---------- Нэр томьёоны хайлт ----------
  var q = document.getElementById("glossary-q");
  var terms = Array.prototype.slice.call(document.querySelectorAll(".term"));
  var empty = document.getElementById("glossary-empty");
  if (q) {
    q.addEventListener("input", function () {
      var needle = q.value.trim().toLowerCase();
      var shown = 0;
      terms.forEach(function (t) {
        var hit = !needle || t.textContent.toLowerCase().indexOf(needle) !== -1;
        t.hidden = !hit;
        if (hit) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    });
  }

  // ---------- Дэд цэсийн идэвхтэй хэсэг ----------
  var subLinks = Array.prototype.slice.call(document.querySelectorAll(".subnav a[href^='#']"));
  var sections = subLinks.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
  var activeIdx = -1;
  var ticking = false;

  function paintActive() {
    ticking = false;
    var line = window.innerHeight * 0.3;
    var idx = -1;
    sections.forEach(function (sec, i) {
      if (sec && sec.getBoundingClientRect().top <= line) idx = i;
    });
    if (idx === activeIdx) return;
    activeIdx = idx;
    subLinks.forEach(function (a, i) { a.classList.toggle("is-active", i === idx); });
    var a = subLinks[idx];
    var ul = a && a.closest("ul");
    if (ul && (a.offsetLeft < ul.scrollLeft || a.offsetLeft + a.offsetWidth > ul.scrollLeft + ul.clientWidth)) {
      ul.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" });
    }
  }
  if (subLinks.length) {
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(paintActive); }
    }, { passive: true });
    window.addEventListener("resize", paintActive);
    paintActive();
  }
})();
