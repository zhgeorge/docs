/* Line illustrations for the landing page's product cards.

   Each card carries an empty <span class="zh-card-art" data-art="…">; this draws an SVG into it.
   The art is built here rather than written in the MDX because Mintlify strips <line>, <polyline>
   and friends from SVG it renders, and anything created at runtime is left alone.

   Every drawing holds still until its card is hovered, then moves. All motion is cyclic and every
   frame is a finished composition, so wherever an animation pauses it still reads. Colours and
   motion live in landing.css: strokes use the classes l0/l1/l2 (ink at rising weight), hi (accent),
   dot/dothi (fills); motion uses fl/flr (dashes flowing forward/back along a path), sp (spin),
   sl (slide by --dx) and a few one-off keyframes. */
(function () {
  if (window.__zhCardArtBooted) return;
  window.__zhCardArtBooted = true;

  const W = 280, H = 96;
  const WIDE = { api: 440 };   // the build-path card is twice a product card's width
  const n = (v) => Math.round(v * 10) / 10;
  const path = (d, cls, extra = "") => `<path d="${d}" class="${cls}"${extra}/>`;
  const dot = (x, y, r = 1.6, cls = "dot") => `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" class="${cls}"/>`;
  const delay = (s) => ` style="animation-delay:${s}s"`;

  // a sine wave sampled every 4px, wide enough to slide a full period without showing an end
  function wave(y0, amp, wl, phase, x0, x1) {
    let d = "";
    for (let x = x0; x <= x1; x += 4) {
      const y = y0 + amp * Math.sin(((x - x0) / wl) * Math.PI * 2 + phase);
      d += `${d ? "L" : "M"}${n(x)} ${n(y)}`;
    }
    return d;
  }
  // a pointy-top hexagon
  function hex(cx, cy, r) {
    let d = "";
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      d += `${i ? "L" : "M"}${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))}`;
    }
    return d + "Z";
  }
  // an arc of radius r around (cx, cy) from a0 to a1 degrees
  function arc(cx, cy, r, a0, a1) {
    const p = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${n(x0)} ${n(y0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${n(x1)} ${n(y1)}`;
  }

  const ART = {
    /* Account Funding: deposits from many places converge on one account, then land as a balance. */
    fund() {
      const ys = [14, 25, 36, 48, 60, 71, 82];
      let s = "";
      ys.forEach((y) => { s += path(`M18 ${y}C96 ${y} 120 48 186 48`, "l0"); });
      ys.forEach((y, i) => { s += path(`M18 ${y}C96 ${y} 120 48 186 48`, i === 3 ? "hi fl" : "l2 fl", delay(-i * 0.17)); });
      ys.forEach((y) => { s += dot(16, y); });
      s += `<rect x="186" y="42" width="12" height="12" rx="2" class="hi"/><rect x="189.5" y="45.5" width="5" height="5" rx="1" class="dothi"/>`;
      s += path("M198 48H268", "l1") + path("M198 48H268", "hi fl");
      for (let x = 204; x <= 268; x += 6) s += path(`M${x} 56V${(x - 204) % 24 === 0 ? 64 : 60}`, "l1");
      return s;
    },

    /* Buy / Sell: bid and ask run against each other; the price is where they meet. */
    trade() {
      let s = path("M8 88H272", "l0");
      for (let x = 8; x <= 272; x += 8) s += path(`M${x} 88V${((x - 8) / 8) % 5 === 0 ? 81 : 84.5}`, "l0");
      s += `<g class="sl" style="--dx:-92px;animation-duration:7s">${path(wave(46, 17, 92, 0, -184, 464), "l2")}</g>`;
      s += `<g class="sl" style="--dx:92px;animation-duration:7s">${path(wave(46, 17, 92, Math.PI, -184, 464), "hi")}</g>`;
      s += path("M140 12V80", "l1 dsh");
      s += path("M135.5 5H144.5L140 11Z", "dothi");
      return s;
    },

    /* AUTH: two accounts held apart and joined by a secured, two-way link. */
    auth() {
      let s = "";
      for (const [cx, dir] of [[84, ""], [196, ";animation-direction:reverse"]]) {
        s += `<g class="sp" style="transform-origin:${cx}px 48px;animation-duration:16s${dir}"><circle cx="${cx}" cy="48" r="31" class="l1 dsh"/></g>`;
        s += `<circle cx="${cx}" cy="48" r="21" class="l2"/><circle cx="${cx}" cy="48" r="11" class="l0"/>` + dot(cx, 48, 2.2);
      }
      s += path("M106 33Q140 17 174 33", "l1") + path("M106 33Q140 17 174 33", "hi fl");
      s += path("M174 63Q140 79 106 63", "l1") + path("M174 63Q140 79 106 63", "hi fl");
      s += `<rect x="131.5" y="44" width="17" height="13" rx="2.5" class="hi"/>`;
      s += path("M135 44V40.5a5 5 0 0 1 10 0V44", "hi");
      s += dot(140, 50.5, 1.4, "dothi");
      return s;
    },

    /* Payouts: one balance fans out to many recipients' wallets. */
    payouts() {
      const ends = [[262, 12], [246, 22], [262, 32], [246, 42], [262, 54], [246, 64], [262, 74], [246, 84]];
      let s = path("M8 48H30", "l1") + dot(8, 48);
      ends.forEach(([x, y]) => { s += path(`M40 48C110 48 130 ${y} ${x} ${y}`, "l0"); });
      ends.forEach(([x, y], i) => { s += path(`M40 48C110 48 130 ${y} ${x} ${y}`, i === 2 ? "hi fl" : "l2 fl", delay(-i * 0.13)); });
      ends.forEach(([x, y], i) => { s += path(`M${x} ${y - 3}L${x + 5} ${y}L${x} ${y + 3}Z`, i === 2 ? "dothi" : "dot"); });
      s += `<rect x="30" y="43" width="10" height="10" rx="2" class="hi"/><rect x="33" y="46" width="4" height="4" rx="1" class="dothi"/>`;
      return s;
    },

    /* Payins: payments arrive from every side and settle at the checkout in the middle. */
    payins() {
      let s = `<ellipse cx="140" cy="48" rx="118" ry="40" class="l0 dsh"/>`;
      const spokes = [];
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12 + Math.PI / 12;
        spokes.push([140 + 118 * Math.cos(a), 48 + 40 * Math.sin(a), 140 + 17 * Math.cos(a), 48 + 17 * Math.sin(a)]);
      }
      spokes.forEach(([ox, oy, ex, ey]) => { s += path(`M${n(ox)} ${n(oy)}L${n(ex)} ${n(ey)}`, "l0"); });
      spokes.forEach(([ox, oy, ex, ey], i) => { s += path(`M${n(ox)} ${n(oy)}L${n(ex)} ${n(ey)}`, i % 4 === 1 ? "hi fl" : "l2 fl", delay(-i * 0.11)); });
      spokes.forEach(([ox, oy]) => { s += dot(ox, oy); });
      s += `<rect x="129" y="37" width="22" height="22" rx="3" class="hi"/>`;
      s += `<g class="pulse" style="transform-origin:140px 48px"><rect x="135" y="43" width="10" height="10" rx="1.5" class="dothi"/></g>`;
      return s;
    },

    /* Bank Rails: three rails moving dollars at three speeds; the main track runs underneath. */
    bank() {
      let s = path("M8 20H272", "l0") + path("M8 20H272", "hi fl", ' style="animation-duration:.45s"');
      s += path("M8 42H272", "l2") + path("M8 54H272", "l2");
      let ties = "";
      for (let x = -12; x <= 292; x += 12) ties += path(`M${x} 38V58`, "l1");
      s += `<g class="sl" style="--dx:-12px;animation-duration:.9s">${ties}</g>`;
      s += path("M8 36V60", "l2") + path("M272 36V60", "l2");
      s += path("M8 78H272", "l0") + path("M8 78H272", "l2 fl", ' style="animation-duration:2.4s"');
      return s;
    },

    /* Virtual Accounts: an account of their own for every customer, numbers issued one by one. */
    va() {
      let s = `<rect x="30" y="10" width="220" height="76" rx="8" class="l1"/>`;
      s += `<rect x="44" y="21" width="18" height="14" rx="2" class="l2"/>` + path("M44 28H62M53 21V35", "l1");
      const row = (y) => {
        let d = "";
        for (let g = 0; g < 4; g++) for (let b = 0; b < 4; b++) { const x = 44 + g * 30 + b * 5; d += `M${x} ${y - 3.5}V${y + 3.5}`; }
        return d;
      };
      [50, 62, 74].forEach((y) => { s += path(row(y), "l1"); });
      // phases chosen so the top row is lit at rest and the others follow in order
      [-0.45, -2.45, -1.45].forEach((d, i) => { s += path(row([50, 62, 74][i]), "hi blink", delay(d)); });
      s += path("M176 50H236", "l1") + path("M176 62H216", "l1") + path("M176 74H226", "l1");
      return s;
    },

    /* On & Off Ramps: up the ramp from dollars into crypto, and back down again. */
    ramps() {
      let s = path("M10 80H270", "l1");
      const surface = (x) => (x <= 104 ? 80 - ((x - 26) * 52) / 78 : x <= 176 ? 28 : 28 + ((x - 176) * 52) / 78);
      for (let x = 38; x <= 242; x += 12) s += path(`M${x} 80V${n(surface(x))}`, "l0");
      s += path("M26 80L104 28H176L254 80", "l2");
      s += path("M26 80L104 28H176L254 80", "hi fl", ' style="animation-duration:.8s"');
      s += dot(104, 28, 2) + dot(176, 28, 2) + dot(26, 80, 2.2, "dothi");
      s += path("M250.5 74.5L256 81.5L247.5 81Z", "dothi");
      return s;
    },

    /* Staking: a validator turning over, rewards compounding beside it. */
    staking() {
      let s = path("M10 48H100", "l0") + path("M180 48H270", "l0");
      for (let x = 10; x <= 100; x += 10) s += path(`M${x} 45V51`, "l0");
      let ticks = "";
      for (let i = 0; i < 48; i++) {
        const a = (Math.PI * 2 * i) / 48, r0 = i % 4 === 0 ? 28 : 31, r1 = 35;
        ticks += `M${n(140 + r0 * Math.cos(a))} ${n(48 + r0 * Math.sin(a))}L${n(140 + r1 * Math.cos(a))} ${n(48 + r1 * Math.sin(a))}`;
      }
      s += `<g class="sp" style="transform-origin:140px 48px;animation-duration:40s">${path(ticks, "l1")}</g>`;
      s += `<circle cx="140" cy="48" r="19" class="l1 dsh"/>`;
      s += `<g class="sp" style="transform-origin:140px 48px;animation-duration:4s">${path(arc(140, 48, 24, -90, 20), "hi")}${dot(140, 24, 2.2, "dothi")}</g>`;
      s += `<rect x="136" y="44" width="8" height="8" rx="1.5" class="dothi"/>`;
      s += path("M186 86H200V82H214V77H228V71H242V64H256V56H268", "hi");
      return s;
    },

    /* Settlements: each side delivers to the line in the middle, and only then does it settle. */
    saas() {
      let s = `<defs><pattern id="zh-art-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">${path("M0 0V5", "l1")}</pattern></defs>`;
      s += path("M14 32H136", "l0") + path("M14 32H136", "l1 fl") + path("M144 32H266", "l0");
      s += path("M266 64H144", "l0") + path("M266 64H144", "l1 fl") + path("M136 64H14", "l0");
      s += path("M14 26V38M266 58V70", "l2");
      s += `<rect x="76" y="24" width="60" height="16" rx="2" class="l2 hatch meetL"/>`;
      s += `<rect x="144" y="56" width="60" height="16" rx="2" class="l2 hatch meetR"/>`;
      s += path("M140 10V86", "hi");
      s += path("M136.5 8L140 4L143.5 8L140 12Z", "dothi") + path("M136.5 88L140 84L143.5 88L140 92Z", "dothi");
      return s;
    },

    /* Tokenization: an engine stamping out identical tokens, one after another, at scale. */
    token() {
      let s = `<defs><clipPath id="zh-art-tokclip"><rect x="74" y="0" width="206" height="96"/></clipPath></defs>`;
      s += path("M76 48H272", "l0");
      let toks = "";
      for (let k = 0; k <= 9; k++) { const cx = 62 + 26 * k; toks += path(hex(cx, 48, 8.5), "l1") + dot(cx, 48, 1.3); }
      s += `<g clip-path="url(#zh-art-tokclip)"><g class="sl" style="--dx:26px;animation-duration:1.4s">${toks}</g></g>`;
      // the stamp sits on a token slot, so at rest it frames a token rather than overlapping two
      s += path(hex(88, 48, 11.5), "hi");
      s += path("M52 26L70 36L52 46L34 36Z", "hi");
      s += path("M34 36V58L52 68V46M70 36V58L52 68", "l2");
      return s;
    },

    /* Crypto Taxes: a ledger read line by line down to the total. */
    tax() {
      let s = path("M40 10H226L240 24V86H40Z", "l1") + path("M226 10V24H240", "l1");
      [26, 38, 50, 62].forEach((y) => { s += path(`M50 ${y}H230`, "l0"); });
      s += path("M120 18V66M180 18V66", "l0");
      const vals = [[22, 30, 18], [34, 20, 28], [16, 38, 24], [28, 26, 34]];
      vals.forEach(([a, b, c], i) => {
        const y = 22 + i * 12;
        s += path(`M${116 - a} ${y}H116M${176 - b} ${y}H176M${230 - c} ${y}H230`, "l2 v");
      });
      s += path("M120 72H230M120 75H230", "hi");
      s += path("M196 81H230", "hi v");
      s += `<g class="scan">${path("M50 24.5H230", "hi")}</g>`;
      return s;
    },

    /* Build paths, API only: your code signs a request, the endpoints answer, and you handle the rest. */
    api() {
      let s = `<rect x="16" y="10" width="128" height="76" rx="6" class="l2"/>` + path("M16 22H144", "l1");
      s += dot(24, 16, 1.4) + dot(30, 16, 1.4) + dot(36, 16, 1.4);
      s += path("M26 34H62M34 42H96M34 58H84M26 66H30", "l1");
      s += path("M34 50H112", "hi");   // the signed header
      s += `<g class="blink" style="animation-duration:1.1s;animation-delay:-.2s">${path("M34 62.5V69.5", "hi")}</g>`;
      // the request, carrying its signature, and the answer coming back
      s += path("M150 36H284", "l1") + path("M150 36H284", "hi fl") + path("M280 32.5L284.5 36L280 39.5", "l2");
      s += `<circle cx="212" cy="26" r="3.5" class="hi"/>` + path("M215.5 26H226M223 26V29.5", "hi");
      s += path("M286 60H152", "l1") + path("M286 60H152", "l2 fl") + path("M156 56.5L151.5 60L156 63.5", "l2");
      s += path("M214 68.5L217 71.5L223 65.5", "l2");
      // the endpoints, read down by a highlight
      s += `<rect x="292" y="8" width="132" height="80" rx="6" class="l2"/>`;
      [[21, 70], [33, 52], [45, 84], [57, 60], [69, 74]].forEach(([yy, len]) => {
        s += `<rect x="302" y="${yy - 3}" width="14" height="6" rx="2" class="l1"/>` + path(`M322 ${yy}H${322 + len}`, "l1");
      });
      s += `<g class="scan" style="--dy:48px;animation-duration:2.2s"><rect x="297" y="15" width="122" height="12" rx="3" class="hi"/></g>`;
      return s;
    },
  };

  function draw() {
    document.querySelectorAll(".zh-card-art[data-art]").forEach((el) => {
      if (el.querySelector("svg")) return;
      const art = ART[el.dataset.art];
      if (!art) return;
      const w = WIDE[el.dataset.art] || W;
      el.innerHTML = `<svg viewBox="0 0 ${w} ${H}" preserveAspectRatio="xMidYMid meet" focusable="false">${art()}</svg>`;
    });
  }
  draw();
  new MutationObserver(draw).observe(document.documentElement, { childList: true, subtree: true });
})();
