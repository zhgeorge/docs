/* zerohash docs — changelog month navigation.
   On /changelog, replaces the sidebar's single "Changelog" entry with a list of months
   (one per month that has releases). Each month jumps to its first release. Built from the
   rendered <Update> entries, so it never drifts from changelog.mdx. Mintlify injects this
   file on every page; it only acts when the changelog marker is present. */
(function () {
  if (window.__zhChangelogTocBooted) return;
  window.__zhChangelogTocBooted = true;

  const TOC_CLASS = "zh-cl-toc";

  function entries() {
    const out = [];
    for (const up of document.querySelectorAll("#content > .update")) {
      const a = up.querySelector('a[href^="#"]');
      if (!a) continue;
      const label = (a.getAttribute("aria-label") || a.textContent || "").replace(/^Navigate to changelog:\s*/i, "").trim();
      const m = label.match(/^([A-Z][a-z]+)\s+\d+(?:st|nd|rd|th)?,\s*(\d{4})$/);
      if (!m) continue;
      out.push({ el: up, id: a.getAttribute("href").slice(1), month: `${m[1]} ${m[2]}` });
    }
    return out;
  }

  function groupMonths(list) {
    const months = [], seen = new Set();
    for (const e of list) { if (seen.has(e.month)) continue; seen.add(e.month); months.push({ month: e.month, id: e.id, els: list.filter(x => x.month === e.month).map(x => x.el) }); }
    return months;
  }

  function renderNav(months) {
    const nav = document.createElement("nav");
    nav.className = TOC_CLASS; nav.setAttribute("aria-label", "Releases by month");
    nav.innerHTML = `<p class="${TOC_CLASS}-title">Releases</p><ul></ul>`;
    const ul = nav.querySelector("ul");
    for (const mo of months) {
      const li = document.createElement("li"), a = document.createElement("a");
      a.href = "#" + mo.id; a.textContent = mo.month; a.dataset.month = mo.month;
      li.append(a); ul.append(li);
    }
    return nav;
  }

  function setActive(nav, month) {
    nav.querySelectorAll("a").forEach(a => a.classList.toggle("active", a.dataset.month === month));
  }

  /* Scroll-spy: the active month is the one whose entry is closest above the reading line. */
  let onScroll = null;
  function watchScroll(nav, months, list) {
    if (onScroll) { window.removeEventListener("scroll", onScroll); window.removeEventListener("hashchange", onScroll); }
    const monthOf = new Map(); months.forEach(mo => mo.els.forEach(el => monthOf.set(el, mo.month)));
    const update = () => {
      const line = 140;   // just under the sticky navbar
      let current = list[0];
      for (const e of list) { if (e.el.getBoundingClientRect().top <= line) current = e; else break; }
      if (current) setActive(nav, monthOf.get(current.el));
    };
    onScroll = () => update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onScroll);
    update();
  }

  let watched = [];   // entry elements the scroll-spy is observing
  function mount() {
    const onChangelog = !!document.querySelector(".zh-cl-page");
    const host = document.querySelector("#sidebar-content > div > div") || document.querySelector("#sidebar-content");
    const existing = document.querySelector("." + TOC_CLASS);
    if (!onChangelog) { if (existing) { existing.remove(); if (onScroll) { window.removeEventListener("scroll", onScroll); window.removeEventListener("hashchange", onScroll); onScroll = null; } watched = []; } return; }
    if (!host) return;
    const list = entries();
    if (!list.length) return;
    const months = groupMonths(list);
    if (!existing) {
      host.prepend(renderNav(months));
    } else if (watched.length && watched.every(el => document.contains(el))) {
      return;   // already mounted and still watching live nodes
    }
    // (re)attach the scroll-spy — Mintlify re-renders the entries after hydration, which detaches the old nodes
    const nav = document.querySelector("." + TOC_CLASS);
    watched = list.map(e => e.el);
    watchScroll(nav, months, list);
  }

  mount();
  new MutationObserver(mount).observe(document.documentElement, { childList: true, subtree: true });
})();
