// Зургийн цомог: төрлөөр шүүх, томоор харах (lightbox), #id холбоосоор нээх.
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll(".art-card"));
  var dialog = document.getElementById("lightbox");
  var img = document.getElementById("lb-img");
  var title = document.getElementById("lb-title");
  var current = -1;

  // ---------- Шүүлтүүр ----------
  var filters = Array.prototype.slice.call(document.querySelectorAll("[data-art-filter]"));
  filters.forEach(function (f) {
    f.addEventListener("click", function () {
      var key = f.getAttribute("data-art-filter");
      filters.forEach(function (x) { x.setAttribute("aria-pressed", x === f ? "true" : "false"); });
      cards.forEach(function (c) { c.hidden = key !== "all" && c.getAttribute("data-kind") !== key; });
    });
  });

  function visibleCards() { return cards.filter(function (c) { return !c.hidden; }); }

  // ---------- Lightbox ----------
  function show(card) {
    var list = visibleCards();
    current = list.indexOf(card);
    var thumb = card.querySelector("img");
    img.src = card.getAttribute("data-full");
    img.alt = thumb ? thumb.alt : "";
    title.textContent = card.getAttribute("data-title") || "";
  }

  function open(card) {
    if (!dialog || typeof dialog.showModal !== "function") {
      window.open(card.getAttribute("data-full"), "_blank", "noopener");
      return;
    }
    show(card);
    if (!dialog.open) dialog.showModal();
  }

  function step(d) {
    var list = visibleCards();
    if (!list.length) return;
    current = (current + d + list.length) % list.length;
    show(list[current]);
  }

  cards.forEach(function (c) { c.addEventListener("click", function () { open(c); }); });

  if (dialog) {
    document.getElementById("lb-prev").addEventListener("click", function () { step(-1); });
    document.getElementById("lb-next").addEventListener("click", function () { step(1); });
    document.getElementById("lb-close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
    dialog.addEventListener("close", function () { img.removeAttribute("src"); });
  }

  // art.html#mirror гэх мэт холбоосоор ирвэл тухайн зургийг нээнэ
  var target = window.location.hash && document.getElementById(window.location.hash.slice(1));
  if (target && target.classList.contains("art-card")) {
    target.scrollIntoView({ block: "center" });
    open(target);
  }
})();
