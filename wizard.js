/* zerohash docs: the setup wizard (/setup-wizard) and the landing page's hero card and backgrounds.
   Mintlify injects this file on every page; it only acts when its elements are present.
   Facts, endpoints and payloads come from the guides in docs/ — each guide section links to its source. */
(function () {
  if (window.__zhWizardBooted) return;
  window.__zhWizardBooted = true;

  const DOCS = "/docs/";
  const REF = "https://docs.zerohash.com/reference/";
  const REGIONS = {
    us: { name: "United States", entity: "zerohash LLC", cert: "https://api.cert.zerohash.com", prod: "https://api.zerohash.com", sdk: "https://web-sdk.zerohash.com", portalCert: "https://portal.cert.zerohash.com", portalProd: "https://portal.zerohash.com" },
    eu: { name: "European Union", entity: "zerohash europe B.V.", cert: "https://api.cert.zerohash.eu", prod: "https://api.zerohash.eu", sdk: "https://web-sdk.zerohash.eu", portalCert: "https://portal.cert.zerohash.eu", portalProd: "https://portal.zerohash.eu" },
  };

  /* ---- tokens and networks are separate choices; symbols are network-qualified (USDC.BASE) ---- */
  const STABLE = [["USDC","USDC"],["USDT","USDT (Tether)"],["PYUSD","PayPal USD"],["EURC","EURC"]];
  const CRYPTO = [["BTC","Bitcoin"],["ETH","Ethereum"],["SOL","Solana"],["XRP","XRP"],["DOGE","Dogecoin"],["ADA","Cardano"]];
  const NETWORKS = [["ETH","Ethereum"],["BASE","Base"],["SOL","Solana"],["POLYGON","Polygon"],["ARBITRUM","Arbitrum"],["OPTIMISM","Optimism"],["AVAX","Avalanche"],["BSC","BNB Chain"],["TRX","Tron"],["XLM","Stellar"]];
  const PAIRS = { USDC: ["ETH","BASE","SOL","POLYGON","ARBITRUM","OPTIMISM","AVAX","BSC","XLM"], USDT: ["TRX","ARBITRUM","OPTIMISM","BSC"], PYUSD: ["ETH","SOL"], EURC: ["ETH"] };
  const isStable = (t) => PAIRS[t] !== undefined;
  const hasStable = (a) => (a.tokens || []).some(isStable);
  const TRADE_TOKENS = [...CRYPTO, ["USDC", "USDC"]];
  const CHAINS = [["ETH","Ethereum"],["AVAX","Avalanche"],["APT","Aptos"],["ARBITRUM","Arbitrum"],["OPTIMISM","Optimism"],["POLYGON","Polygon"],["CELO","Celo"],["SOL","Solana"]];
  const netsFor = (tok) => NETWORKS.filter(([nw]) => (PAIRS[tok] || []).includes(nw));

  /* Which assets a product's guide lets you add or remove. Nobody is asked about assets during
     the questions: the guide starts on a sensible default and the chips there rewrite the code. */
  const ASSET_DEFAULTS = {
    fund: { tokens: ["USDC"], networks: ["BASE"] },
    payouts: { tokens: ["USDC"], networks: ["SOL"] },
    payins: { tokens: ["USDC"], networks: ["BASE"] },
    trade: { tokens: ["BTC", "ETH"] },
    ramps: { tokens: ["BTC"] },
    saas: { tokens: ["BTC"] },
    token: { chains: ["ETH"] },
    va: { token: "USDC", network: "SOL" },
  };
  function assetFields(pid, a) {
    if (pid === "fund" || pid === "payouts" || pid === "payins") return [
      { key: "tokens", label: "Assets", kind: "multi", options: [...STABLE, ...CRYPTO] },
      ...(hasStable(a) ? [{ key: "networks", label: "Networks", kind: "multi", options: NETWORKS.filter(([nw]) => (a.tokens || []).some(t => isStable(t) && PAIRS[t].includes(nw))) }] : []),
    ];
    if (pid === "trade" || pid === "ramps" || pid === "saas") return [{ key: "tokens", label: "Assets", kind: "multi", options: TRADE_TOKENS }];
    if (pid === "token") return [{ key: "chains", label: "Networks", kind: "multi", options: CHAINS }];
    if (pid === "va" && a.policy === "convert") return [
      { key: "token", label: "Stablecoin", kind: "single", options: [["USDC","USDC"],["USDT","USDT (Tether)"],["PYUSD","PayPal USD"]] },
      { key: "network", label: "Network", kind: "single", options: netsFor(a.token || "USDC") },
    ];
    return [];
  }
  /* Fill in defaults and drop combinations zerohash does not support. */
  function seedAssets(pid) {
    const a = ans(pid), d = ASSET_DEFAULTS[pid] || {};
    for (const k in d) if (a[k] === undefined || (Array.isArray(a[k]) && !a[k].length)) a[k] = Array.isArray(d[k]) ? d[k].slice() : d[k];
    if (Array.isArray(a.tokens) && Array.isArray(a.networks)) {
      const fits = (nw) => a.tokens.some(t => isStable(t) && PAIRS[t].includes(nw));
      if (!hasStable(a)) a.networks = [];
      else {
        a.networks = a.networks.filter(fits);
        if (!a.networks.length) { const first = NETWORKS.map(([nw]) => nw).find(fits); if (first) a.networks = [first]; }
      }
    }
    if (pid === "va" && a.policy === "convert") {
      const ok = netsFor(a.token || "USDC").map(([nw]) => nw);
      if (!ok.includes(a.network)) a.network = ok[0];
    }
    return a;
  }
  function symbols(a, fallback) {
    const out = [];
    for (const t of a.tokens || []) {
      if (isStable(t)) { for (const n of a.networks || []) if (PAIRS[t].includes(n)) out.push(`${t}.${n}`); }
      else out.push(t);
    }
    return out.length ? out : fallback;
  }
  /* Short, readable description of the chosen assets: full list when small, a summary when large. */
  function describeAssets(a, fallback) {
    const syms = symbols(a, fallback);
    if (syms.length <= 4) return list(syms, "or");
    const stables = (a.tokens || []).filter(isStable), cryptos = (a.tokens || []).filter(t => !isStable(t));
    const nets = new Set(syms.filter(x => x.includes(".")).map(x => x.split(".")[1]));
    const parts = [];
    if (stables.length) parts.push(`${list(stables, "and")} on ${nets.size} network${nets.size === 1 ? "" : "s"}`);
    if (cryptos.length) parts.push(list(cryptos, "and"));
    return parts.join(", plus ");
  }

  const PRODUCTS = [
    { id: "fund", name: "Account Funding", tag: "Move money in", short: "Customers add money by sending crypto.", plain: "Show a customer an address, they send USDC (or another asset) to it, and their balance updates within minutes — as dollars if you want. A funding method that sits next to cards, wires and ACH.", src: "fund-overview" },
    { id: "trade", name: "Buy / Sell", tag: "Trade", short: "Let customers buy and sell crypto.", plain: "You ask zerohash for a firm price, show it to the customer, and confirm. zerohash handles liquidity, custody and compliance behind the scenes.", src: "buysell" },
    { id: "payouts", name: "Payouts", tag: "Move money out", short: "Pay people in stablecoins or crypto.", plain: "Contractors, sellers and creators get paid in minutes instead of days — across borders, without bank wires.", src: "payouts" },
    { id: "payins", name: "Payins", tag: "Get paid", short: "Accept crypto payments at checkout.", plain: "A shopper pays from their wallet; you get a locked-in dollar amount and a notification when the money lands.", src: "payins-api-integration-guide" },
    { id: "bank", name: "Bank Rails", tag: "Move money in & out", short: "Move dollars in and out by bank transfer.", plain: "Pull dollars in by ACH to buy crypto, and send dollars out by ACH, RTP or FedNow when customers cash out. Bank linking is handled through Plaid.", src: "fiat" },
    { id: "va", name: "Virtual Accounts", tag: "Move money in", short: "Give each customer an account number.", plain: "Customers (or their employers) push dollars to it like any bank account. When money arrives, zerohash holds it or converts it to a stablecoin.", src: "virtual-accounts" },
    { id: "ramps", name: "On & Off Ramps", tag: "Convert", short: "Turn dollars into crypto, and back.", plain: "The simplest conversion product: a quote, a confirmation, and the asset moves. Three endpoints in total.", src: "on-off-ramps" },
    { id: "staking", name: "Staking", tag: "Earn", short: "Let customers earn rewards on their ETH.", plain: "Customers lock up ETH to help run the network and earn rewards. zerohash runs the validators; you set the fee you keep.", src: "staking" },
    { id: "saas", name: "Settlements as a Service", tag: "Settle", short: "Settle trades you matched elsewhere.", plain: "You agree the trade (on your venue or over the phone); zerohash moves the money and the crypto only once both sides have delivered.", src: "settlements-as-a-service" },
    { id: "token", name: "Tokenization Engine", tag: "Issue", short: "Issue your own tokens on EVM or Solana.", plain: "Mint, move and redeem a stablecoin, security or NFT, with compliance controls built in and gas fees handled for you.", src: "tokenization-engine" },
  ];
  const PRODUCT_IDS = PRODUCTS.map(p => p.id);

  /* one line icon per product */
  const ICON_PATHS = {
    fund: '<path d="M12 4v10"/><path d="M8 10l4 4 4-4"/><path d="M5 19h14"/>',
    trade: '<path d="M7 4v14"/><path d="M4 7l3-3 3 3"/><path d="M17 20V6"/><path d="M14 17l3 3 3-3"/>',
    payouts: '<path d="M14 4h6v6"/><path d="M20 4l-8 8"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
    payins: '<path d="M10 20H4v-6"/><path d="M4 20l8-8"/><path d="M6 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4"/>',
    bank: '<path d="M3 9l9-5 9 5"/><path d="M4 20h16"/><path d="M6.5 20v-7M10.2 20v-7M13.8 20v-7M17.5 20v-7"/>',
    va: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 14.5h4"/>',
    ramps: '<path d="M4 9h16"/><path d="M17 6l3 3-3 3"/><path d="M20 15H4"/><path d="M7 12l-3 3 3 3"/>',
    staking: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
    saas: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',
    token: '<path d="M12 3l7.5 4.3v9.4L12 21l-7.5-4.3V7.3L12 3z"/><circle cx="12" cy="12" r="3"/>',
  };
  const productIcon = (id, cls) => `<span class="${cls}" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[id] || ""}</svg></span>`;

  /* ---- the essential questions only ---- */
  const QUESTIONS = {
    fund: [
      { id: "dir", type: "multi", title: "What do customers need to do?", opts: [["deposits","Add money (deposits)","Send stablecoins or crypto into their account."],["withdrawals","Take money out (withdrawals)","Send stablecoins or crypto to their own wallet or exchange."]], src: "fund-overview" },
      { id: "convert", type: "single", title: "When money arrives, what should the customer see?", when: a => (a.dir || []).includes("deposits"), plain: "Most platforms choose dollars: the customer never has to think about crypto, and their balance is just a number in USD.",
        opts: [["usd","Dollars","zerohash converts the deposit to USD the moment it lands (1 USDC → $1, minus a small fee)."],["crypto","The asset itself","The deposit stays as the stablecoin or crypto they sent."]], src: "sdk-index" },
      { id: "style", type: "single", title: "How do you want to build the screens?", opts: [["sdk","Use zerohash's ready-made screens","Fastest. A drop-in flow that shows the address, QR code and receipts, in your colors."],["api","Build my own screens","You call the API and design every step yourself."]], src: "fund-overview" },
      { id: "auth", type: "single", title: "Should customers be able to connect their exchange or wallet?", plain: "AUTH connections remove the error and friction of QR codes, networks, and addresses.",
        opts: [["on","Yes, add AUTH","Connect exchanges and wallets in-app."],["off","No, stick to manual transfers","Customers send from any wallet to the address you show."]], src: "auth" },
    ],
    trade: [
      { id: "model", type: "multi", title: "How should trades be priced?", plain: "Start with a quote if you're unsure. It's the simpler integration and the right fit for most consumer apps.",
        opts: [["rfq","Firm quote (RFQ)","Ask for a price, show it, confirm within 30 seconds. Two API calls."],["clob","Order book (CLOB)","Place limit and market orders into a live order book. For trading platforms and high volume."]], src: "buysell" },
    ],
    payouts: [
      { id: "type", type: "single", title: "How much do you want to manage yourself?", opts: [["single","Keep it simple","One API call per payout; zerohash handles verification and wallet linking."],["modular","Control each step","Register the recipient, link their wallet and send as separate steps, for custom screens."]], src: "payouts" },
      { id: "bene", type: "multi", title: "Who will you pay?", opts: [["individual","People","Contractors, creators, sellers."],["entity","Businesses","Companies and LLCs."]], src: "new-payouts-api-integration-guide" },
    ],
    payins: [
      { id: "role", type: "single", title: "Who is selling?", opts: [["self","We are","Your platform sells its own goods or services."],["psp","Other businesses on our platform","You're a payment provider; each merchant is registered separately."]], src: "payins-api-integration-guide" },
    ],
    bank: [
      { id: "model", type: "single", title: "How fast should bank deposits be usable?", plain: "Bank transfers (ACH) take 1–3 business days to settle. Faster options mean you front the money from a float balance you keep with zerohash.",
        opts: [["prefunded","When the transfer settles","Simplest; no float needed."],["ondemand","Immediately, for a purchase","The customer's buy happens as soon as the debit is approved."],["instant","Immediately, as a balance","Dollars appear in their balance right away."]], src: "funding-models" },
      { id: "rails", type: "multi", title: "Which ways should money move?", selectAll: true, opts: [["ach","ACH","In and out. 1–3 business days. Low cost."],["rtp","RTP / FedNow","Out only. Arrives in seconds, 24/7."],["wire","Wire","In and out, same day. For larger amounts."]], src: "fiat" },
    ],
    va: [
      { id: "policy", type: "single", title: "When dollars arrive, what happens?", opts: [["hold","Hold them as a balance","The customer decides later whether to buy crypto or withdraw."],["convert","Convert and send on-chain","Dollars become a stablecoin and go to a wallet you've approved for that customer."]], src: "create-a-virtual-account" },
    ],
    ramps: [
      { id: "dir", type: "multi", title: "Which way should money go?", opts: [["on","Dollars → crypto (on-ramp)","Customer pays in dollars; crypto lands in their own wallet."],["off","Crypto → dollars (off-ramp)","Customer sends crypto; they get dollars."]], src: "on-off-ramps" },
    ],
    staking: [
      { id: "asset", type: "single", title: "Which asset?", opts: [["ETH","Ethereum (ETH)","Available now."],["SOL","Solana (SOL)","Coming Q4 2026."]], src: "staking" },
    ],
    saas: [
      { id: "model", type: "single", title: "What's your role in the trade?", opts: [["agency","Middleman","You match a buyer and a seller and take no risk yourself."],["principal","Counterparty","You buy and sell with your own balance sheet."]], src: "settlements-as-a-service" },
    ],
    token: [
      { id: "kind", type: "single", title: "What kind of token?", opts: [["fungible","A currency-like token","A stablecoin or security. Many identical units."],["nft","Unique tokens (NFTs)","Each token represents one specific asset, like a loan."]], src: "tokenization-engine" },
    ],
  };
  const PAGE_TITLES = { "fund-overview": "Account Funding", "sdk-index": "Available SDKs", "auth": "AUTH", "buysell": "Buy/Sell", "usdc-trading-pairs": "USDC Trading Pairs", "submit-and-execute-quotes": "Request and Execute Quotes", "spreads-and-fees": "Spreads and Fees", "supported-instruments-1": "Supported Instruments (RFQ)", "payouts": "Payouts", "modular-payouts": "Modular Payouts", "new-payouts-api-integration-guide": "Single API Call Payouts guide", "payins-api-integration-guide": "Payins API guide", "payins-integration-guide": "Payins SDK guide", "funding-models": "Funding Models", "bank-account-linking": "Bank Account Linking", "fiat": "Bank Rails", "create-a-virtual-account": "Create and Use Virtual Accounts", "on-off-ramps": "On & Off Ramps", "off-ramp-integration-guide": "Off Ramp guide", "on-ramp-integration-guide": "On Ramp guide", "staking": "Staking", "settlements-as-a-service": "Settlements as a Service", "settlements-as-a-service-integration-guide": "Settlements as a Service guide", "tokenization-engine": "Tokenization Engine", "account-setup-1": "Account Setup & Funding Models" };

  /* ---------------- state ---------------- */
  const KEY = "zh-wizard-v3";
  const DEFAULT = { region: "", customers: [], kyc: "", products: [], answers: {}, step: 0 };
  let S = load();
  function load() { try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign({}, DEFAULT, JSON.parse(raw)); } catch (e) {} return JSON.parse(JSON.stringify(DEFAULT)); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  const ans = (pid) => S.answers[pid] || (S.answers[pid] = {});
  // Nothing is preselected, so fall back to US only when generating the guide.
  const regionId = () => S.region || "us";
  const REG = () => REGIONS[regionId()];
  const host = () => REG().cert;
  const optItems = (q) => q.groups ? q.groups.flatMap(g => g.items.map(([v]) => v)) : q.opts.map(([v]) => v);

  function stepList() {
    const list = [{ id: "products", label: "Products", meta: S.products.length ? `${S.products.length} selected` : "Pick one or more" }, { id: "basics", label: "About you", meta: "Region, customers, verification" }];
    for (const pid of PRODUCT_IDS.filter(id => S.products.includes(id))) list.push({ id: "p:" + pid, label: PRODUCTS.find(p => p.id === pid).name, meta: "A few choices" });
    list.push({ id: "guide", label: "Your guide", meta: "Steps and code" });
    return list;
  }
  const visibleQuestions = (pid) => { const a = ans(pid); return QUESTIONS[pid].filter(q => !q.when || q.when(a)); };
  const productComplete = (pid) => { const a = ans(pid); return visibleQuestions(pid).every(q => q.type === "multi" ? (a[q.id] && a[q.id].length) : a[q.id] !== undefined); };
  function stepComplete(i) { const st = stepList()[i]; if (!st) return false; if (st.id === "basics") return !!S.region && !!S.kyc && S.customers.length > 0; if (st.id === "products") return S.products.length > 0; if (st.id.startsWith("p:")) return productComplete(st.id.slice(2)); return false; }
  function canGo(i) { for (let k = 0; k < i; k++) if (!stepComplete(k)) return false; return true; }

  /* ---------------- helpers ---------------- */
  const el = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstElementChild; };
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const srcLink = (slug, label) => `<p class="src">From the docs: <a href="${DOCS}${slug}">${esc(label || PAGE_TITLES[slug] || slug)}</a></p>`;
  const sentence = (items) => list(items, "and");
  const list = (arr, word = "and") => arr.length <= 1 ? arr.join("") : arr.slice(0, -1).join(", ") + ` ${word} ` + arr[arr.length - 1];
  let ROOT = null;
  const $ = (sel) => ROOT.querySelector(sel);

  /* ---------------- render ---------------- */
  let lastStep = -1;
  function render() {
    const steps = stepList();
    if (S.step >= steps.length) S.step = steps.length - 1;
    while (S.step > 0 && !canGo(S.step)) S.step--;
    renderRail(steps);
    const st = steps[S.step], main = $(".main"); main.innerHTML = "";
    if (st.id === "products") main.append(viewProducts());
    else if (st.id === "basics") main.append(viewBasics());
    else if (st.id.startsWith("p:")) main.append(viewProduct(st.id.slice(2)));
    else main.append(viewGuide());
    main.append(viewNav(steps));
    save();
    // Moving between steps starts you at the top; answering a question leaves you where you are.
    if (S.step !== lastStep) window.scrollTo({ top: 0 });
    lastStep = S.step;
  }

  /* An answer changes the rail and the nav button, not the question you are looking at, so only
     those are rebuilt. The control repaints its own selected state. */
  function refreshChrome() {
    const steps = stepList();
    renderRail(steps);
    const main = $(".main"), nav = main.querySelector(".navbar");
    if (nav) main.replaceChild(viewNav(steps), nav);
    save();
  }
  function renderRail(steps) {
    const ol = $(".steps"); ol.innerHTML = "";
    steps.forEach((st, i) => {
      const done = i < S.step && stepComplete(i);
      const li = el(`<li><button type="button" class="step-btn ${i === S.step ? "current" : ""} ${done ? "done" : ""}" ${canGo(i) ? "" : "disabled"}><span class="dot">${done ? "✓" : i + 1}</span><span class="lbl">${esc(st.label)}<span class="meta">${esc(st.meta)}</span></span></button></li>`);
      li.querySelector("button").onclick = () => { S.step = i; render(); };
      ol.append(li);
    });
  }
  function viewNav(steps) {
    const last = S.step === steps.length - 1;
    const wrap = el(`<div class="navbar"><button type="button" class="btn ghost" ${S.step === 0 ? "disabled" : ""}>← Back</button><span class="hint"></span><button type="button" class="btn primary">${last ? "Start over" : (S.step === steps.length - 2 ? "Show my guide →" : "Continue →")}</button></div>`);
    const [back, hint, next] = wrap.children;
    back.onclick = () => { S.step--; render(); };
    if (!last && !stepComplete(S.step)) { next.disabled = true; hint.textContent = steps[S.step].id === "products" ? "Pick at least one product." : "Pick an answer for each question."; }
    next.onclick = () => { if (last) { if (confirm("Clear your choices and start over?")) { S = JSON.parse(JSON.stringify(DEFAULT)); render(); } } else { S.step++; render(); } };
    return wrap;
  }

  /* shared controls */
  function singleCards(opts, current, onPick) {
    const box = el(`<div class="cards"></div>`);
    const paint = (val) => box.querySelectorAll(".card").forEach(c => { const on = c.dataset.v === val; c.classList.toggle("on", on); c.setAttribute("aria-checked", on); });
    for (const [val, t, d] of opts) {
      const c = el(`<button type="button" class="card single" role="radio" aria-checked="false" data-v="${esc(val)}"><div class="t">${esc(t)}</div>${d ? `<div class="d">${esc(d)}</div>` : ""}</button>`);
      c.onclick = () => { paint(val); onPick(val); }; box.append(c);
    }
    paint(current);
    return box;
  }
  function multiCards(opts, selected, onChange) {
    const box = el(`<div class="cards"></div>`);
    let sel = selected.slice();
    const paint = () => box.querySelectorAll(".card").forEach(c => { const on = sel.includes(c.dataset.v); c.classList.toggle("on", on); c.setAttribute("aria-checked", on); });
    for (const [val, t, d] of opts) {
      const c = el(`<button type="button" class="card multi" role="checkbox" aria-checked="false" data-v="${esc(val)}"><span class="check" aria-hidden="true"></span><div class="t">${esc(t)}</div>${d ? `<div class="d">${esc(d)}</div>` : ""}</button>`);
      c.onclick = () => { sel = sel.includes(val) ? sel.filter(x => x !== val) : [...sel, val]; paint(); onChange(sel.slice()); }; box.append(c);
    }
    paint();
    return box;
  }
  function chipGroups(q, selected, onChange) {
    const wrap = el(`<div></div>`);
    const all = optItems(q);
    let sel = selected.slice(), sa = null;
    const paint = () => {
      wrap.querySelectorAll(".chip[data-v]").forEach(ch => { const on = sel.includes(ch.dataset.v); ch.classList.toggle("on", on); ch.setAttribute("aria-pressed", on); });
      if (sa) { const on = all.every(v => sel.includes(v)); sa.classList.toggle("on", on); sa.setAttribute("aria-pressed", on); sa.textContent = on ? "Clear all" : "Select all"; }
    };
    if (q.selectAll) {
      sa = el(`<button type="button" class="chip select-all" aria-pressed="false">Select all</button>`);
      sa.onclick = () => { sel = all.every(v => sel.includes(v)) ? [] : all.slice(); paint(); onChange(sel.slice()); };
      const saGroup = el(`<div class="chip-group"><div class="chips"></div></div>`);
      saGroup.querySelector(".chips").append(sa);
      wrap.append(saGroup);
    }
    for (const g of q.groups) {
      const grp = el(`<div class="chip-group"><p class="g">${esc(g.g)}</p><div class="chips"></div></div>`);
      for (const [sym, label] of g.items) {
        const ch = el(`<button type="button" class="chip" aria-pressed="false" data-v="${esc(sym)}">${esc(label)}${label !== sym ? `<span class="sym">${esc(sym)}</span>` : ""}</button>`);
        ch.onclick = () => { sel = sel.includes(sym) ? sel.filter(x => x !== sym) : [...sel, sym]; paint(); onChange(sel.slice()); };
        grp.querySelector(".chips").append(ch);
      }
      wrap.append(grp);
    }
    paint();
    return wrap;
  }

  function viewProducts() {
    const v = el(`<section><p class="eyebrow">Step 1 · Products</p><p class="h1">Select one or multiple products you want to integrate</p><p class="lede">zerohash is the regulated plumbing behind crypto and stablecoin features: custody, compliance, liquidity and settlement. You pick what you want to offer your customers; this guide shows you what to build, in plain language, with the code ready when you need it.</p><div class="cards" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))"></div></section>`);
    const box = v.querySelector(".cards");
    for (const p of PRODUCTS) {
      const on = S.products.includes(p.id);
      const c = el(`<button type="button" class="card multi product ${on ? "on" : ""}" role="checkbox" aria-checked="${on}"><span class="check" aria-hidden="true"></span>${productIcon(p.id, "ico")}<div class="body"><div class="t">${esc(p.name)}</div><div class="d">${esc(p.short)}</div></div></button>`);
      c.onclick = () => {
        const picked = !S.products.includes(p.id);
        S.products = picked ? [...S.products, p.id] : S.products.filter(x => x !== p.id);
        c.classList.toggle("on", picked); c.setAttribute("aria-checked", picked);
        refreshChrome();
      };
      box.append(c);
    }
    return v;
  }

  function viewBasics() {
    const v = el(`<section>
      <p class="eyebrow">Step 2 · About you</p>
      <p class="h1">Three quick questions about your platform</p>
      <p class="lede">These decide which zerohash entity you work with and how your customers get verified.</p>
      <div class="q"><p class="h2">Where are you based?</p><div class="body"></div></div>
      <div class="q"><p class="h2">Who are your customers?</p><p class="q-help">Pick as many as you like.</p><div class="body"></div></div>
      <div class="q"><p class="h2">Who do you expect to verify your customer's identity?</p><p class="q-help">Every customer must be identity-checked before they can transact. Most platforms let zerohash do it.</p><div class="body"></div></div>
    </section>`);
    const bodies = v.querySelectorAll(".body");
    bodies[0].replaceWith(singleCards([["us","United States","zerohash LLC"],["eu","European Union","zerohash europe B.V., licensed by the Dutch AFM"]], S.region, (val) => { S.region = val; refreshChrome(); }));
    bodies[1].replaceWith(multiCards([["individuals","People",""],["businesses","Businesses",""]], S.customers, (sel) => { S.customers = sel; refreshChrome(); }));
    bodies[2].replaceWith(singleCards([["sdk","zerohash","A ready-made verification screen you drop into your app. zerohash handles the checks and any manual review."],["api","Ourselves","You verify customers yourself and pass zerohash the results. Needs approval from zerohash."]], S.kyc, (val) => { S.kyc = val; refreshChrome(); }));
    return v;
  }

  function viewProduct(pid) {
    const p = PRODUCTS.find(x => x.id === pid), a = ans(pid);
    const v = el(`<section><p class="eyebrow">Step ${S.step + 1}</p><p class="h1">${esc(p.name)}</p><p class="lede">${esc(p.plain)}</p><div class="qs"></div></section>`);
    const qs = v.querySelector(".qs");
    for (const q of visibleQuestions(pid)) {
      const w = el(`<div class="q"><p class="h2">${esc(q.title)}</p>${q.plain ? `<p class="q-help">${q.plain}</p>` : ""}${q.help ? `<p class="q-help">${esc(q.help)}</p>` : ""}${q.type === "multi" ? `<p class="q-help">Pick as many as you like.</p>` : ""}<div class="body"></div></div>`);
      const body = w.querySelector(".body");
      const sig = () => visibleQuestions(pid).map(x => x.id).join(",");
      const set = (val) => { const before = sig(); a[q.id] = val; if (sig() !== before) render(); else refreshChrome(); };
      if (q.type === "single") body.replaceWith(singleCards(q.opts, a[q.id], set));
      else if (q.groups) body.replaceWith(chipGroups(q, a[q.id] || [], set));
      else {
        const sel = a[q.id] || [];
        const wrap = el(`<div></div>`);
        if (q.selectAll) { const all = optItems(q), allOn = all.every(v => sel.includes(v)); const sa = el(`<div class="chips" style="margin-bottom:10px"><button type="button" class="chip select-all ${allOn ? "on" : ""}">${allOn ? "Clear all" : "Select all"}</button></div>`); sa.querySelector("button").onclick = () => set(allOn ? [] : all.slice()); wrap.append(sa); }
        wrap.append(multiCards(q.opts, sel, set)); body.replaceWith(wrap);
      }
      qs.append(w);
    }
    return v;
  }

  /* ---------------- guide ---------------- */
  const CURL_HEADERS = (h, method, path) => `curl --request ${method} \\\n  --url ${h}${path} \\\n  --header 'X-SCX-API-KEY: $ZH_PUBLIC_KEY' \\\n  --header 'X-SCX-SIGNED: $ZH_SIGNATURE' \\\n  --header 'X-SCX-TIMESTAMP: $ZH_TIMESTAMP' \\\n  --header 'X-SCX-PASSPHRASE: $ZH_PASSPHRASE' \\\n  --header 'Content-Type: application/json'`;
  const curl = (method, path, body) => CURL_HEADERS(host(), method, path) + (body ? ` \\\n  --data '${JSON.stringify(body, null, 2).replace(/'/g, "'\\''")}'` : "");
  const J = (o) => JSON.stringify(o, null, 2);
  function signedAgreements() {
    const l = [];
    if (S.products.includes("fund") && (ans("fund").dir || []).includes("deposits") && ans("fund").convert === "usd") l.push({ type: "fund_auto_convert", region: regionId(), signed_timestamp: 1712008721000 });
    if (S.products.includes("staking")) l.push({ type: "staking", region: regionId(), signed_timestamp: 1712008721000 });
    if (S.products.includes("payins")) l.push({ type: "ACCOUNT_FUNDING_PAY", region: regionId(), signed_timestamp: 1712008721000 });
    if (!l.length) l.push({ type: "user_agreement", region: regionId(), signed_timestamp: 1712008721000 });
    return l;
  }
  const customerPayload = () => ({ first_name: "John", last_name: "Smith", email: "jsmith@example.com", phone_number: "9545551234", address_one: "1 Main St.", address_two: "Suite 1000", city: "Chicago", state: "IL", zip: "12345", country: "United States", date_of_birth: "1985-09-02", citizenship: "United States", tax_id: "123456789", risk_rating: "low", kyc: "pass", kyc_timestamp: 1630623005000, sanction_screening: "pass", sanction_screening_timestamp: 1630623005000, idv: "pass", liveness_check: "pass", signed_timestamp: 1630623005000, metadata: {}, signed_agreements: signedAgreements() });
  const entityPayload = () => ({ request_id: "a1b2c3d4-5678-90ab-cdef-1234567890ab", platform_code: "PLAT01", legal_name: "Entity A", contact_number: "15553765432", address_one: "1 Main St.", address_two: "Suite 1000", city: "Chicago", postal_code: "12345", jurisdiction_code: "US-IL", tax_id: "883987654", id_issuing_authority: "United States", sanction_screening: "pass", sanction_screening_timestamp: 1603378501286, signed_agreements: signedAgreements() });
  const sdkSnippet = (R, module, comment) => `import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';\n\nconst sdk = new ZeroHashSDK({\n  zeroHashAppsURL: '${R.sdk}',\n  env: 'cert',        // 'cert' | 'prod'\n  theme: 'auto',      // 'light' | 'dark' | 'auto'\n});\n\n// jwt = the access token your server minted with POST /client_auth_token\nsdk.openModal({ appIdentifier: AppIdentifier.${module}, jwt });${comment ? `\n// ${comment}` : ""}`;

  function buildGuide() {
    const R = REG(), h = host(), phases = [];
    const link = (slug, label) => [label || PAGE_TITLES[slug] || slug, DOCS + slug];
    const ref = (slug, label) => [label, REF + slug];

    phases.push({ eyebrow: "Phase 1", title: "Get set up", intro: `You'll work with ${R.entity}. Start in <b>Cert</b>, zerohash's sandbox with pretend money, at ${h}. When you're approved for real money, the same calls go to ${R.prod}.`,
      steps: [
        { title: "Get your sandbox account", html: `<p>Ask zerohash sales or solutions engineering for a Cert platform. They add your team, you confirm your email and set up 2FA, and you can log in at <a href="${R.portalCert}">${R.portalCert.replace("https://", "")}</a>. Going live later means signing up at <a href="${R.portalProd}">${R.portalProd.replace("https://", "")}</a> and completing a short business application.</p>`, links: [link("get-platform-access")] },
        { title: "Create an API key", html: `<p>In the portal: <b>Administration → API Keys → Add API Key</b>. Save the public key, private key and passphrase right away — you only see them once. Then tell zerohash which IP addresses you'll call from; keys need two approvals before they work.</p>`, links: [link("generate-api-keys"), link("api-security", "API Security")] },
        { title: "Make your first call", html: `<p><span class="ep">GET /time</span> needs no login and proves your connection works. Every other call is signed: you send four headers computed from your key, a timestamp and the request. The helper below does it for you.</p>`,
          code: [{ lang: "bash", label: "Try it: GET /time", text: `curl --request GET \\\n  --url ${h}/time \\\n  --header 'accept: application/json'` }, { lang: "javascript", label: "Node.js: sign a request", text: `const crypto = require("crypto");\n\nfunction zhHeaders(method, path, body = null) {\n  const timestamp = Math.floor(Date.now() / 1000).toString();\n  const bodyStr = body ? JSON.stringify(body) : "{}";\n  const message = timestamp + method.toUpperCase() + path + bodyStr;\n  const signature = crypto\n    .createHmac("sha256", process.env.ZH_PRIVATE_KEY)\n    .update(message)\n    .digest("base64");\n  return {\n    "X-SCX-API-KEY": process.env.ZH_PUBLIC_KEY,\n    "X-SCX-SIGNED": signature,\n    "X-SCX-TIMESTAMP": timestamp,\n    "X-SCX-PASSPHRASE": process.env.ZH_PASSPHRASE,\n    "Content-Type": "application/json",\n  };\n}` }], links: [link("submit-first-api-call"), link("authentication", "API Authentication")] },
      ],
      config: ["a Cert platform for your team", "the IP addresses you'll call from", "a webhook URL where zerohash can send status updates for everything below"] });

    const onb = { eyebrow: "Phase 2", title: "Verify your customers", intro: "Before a customer can do anything, they're verified once and get a <b>participant code</b> (like <code>CUST01</code>) — the ID you'll use for them in every later call.", steps: [], config: [] };
    const agreements = signedAgreements().map(a => a.type);
    if (S.kyc === "sdk") {
      onb.steps.push({ title: "Open zerohash's verification screen", html: `<p>Your server asks for a short-lived access token with <span class="ep">POST /client_auth_token</span>; your app opens the Onboarding screen with it. zerohash collects the ID and personal details (you never store them) and tells you by webhook when the customer is <code>approved</code>.</p>`,
        code: [{ lang: "javascript", label: "Open the Onboarding screen", text: sdkSnippet(R, "USER_ONBOARDING", "USER_ONBOARDING is illustrative — use the module identifier from the SDK reference (linked below)") }],
        links: [link("onboarding-experience-sample", "Onboarding SDK"), ref("sdk-modules-user-onboarding", "SDK reference — User Onboarding"), ref("post_client-auth-token", "POST /client_auth_token")] });
      if (agreements.some(a => a !== "user_agreement")) onb.steps.push({ title: "Agreements are handled for you", html: `<p>Your products need customers to accept <code>${agreements.join("</code>, <code>")}</code>. The screen shows these automatically.</p>` });
    } else {
      if (S.customers.includes("individuals")) onb.steps.push({ title: "Send zerohash each verified person", html: `<p>You've already checked their identity, so you send the results (KYC, sanctions, ID, liveness: pass or fail) plus the agreements they accepted. You get their participant code back.</p>`, code: [{ lang: "bash", label: "POST /participants/customers/new", text: curl("POST", "/participants/customers/new", customerPayload()) }], links: [ref("post_participants-customers-new", "POST /participants/customers/new"), link("permitted-and-restricted-jurisdictions", "Where you can operate")] });
      if (S.customers.includes("businesses")) onb.steps.push({ title: "Send zerohash each verified business", html: `<p>Businesses use a separate call with company details. Licensed institutions can send a shorter packet; the full version adds owners and control persons.</p>`, code: [{ lang: "bash", label: "POST /participants/entity/new", text: curl("POST", "/participants/entity/new", entityPayload()) }], links: [ref("post_participants-entity-new", "POST /participants/entity/new")] });
      onb.config.push("approval to use your own KYC (the \"Reliance\" model)");
    }
    phases.push(onb);

    let n = 3;
    for (const pid of PRODUCT_IDS.filter(id => S.products.includes(id))) { const ph = PRODUCT_PHASE[pid](seedAssets(pid), { h, R, link, ref }); ph.eyebrow = `Phase ${n++}`; ph.pid = pid; phases.push(ph); }
    return phases;
  }

  const PRODUCT_PHASE = {
    fund(a, { R, link, ref }) {
      const syms = symbols(a, ["USDC.BASE"]), first = syms[0], dep = (a.dir || []).includes("deposits"), wd = (a.dir || []).includes("withdrawals"), usd = a.convert === "usd", sdk = a.style === "sdk", auth = a.auth === "on";
      const ph = { title: "Account Funding", intro: `${dep ? `Customers send ${describeAssets(a, ["USDC.BASE"])} — ${usd ? "and see dollars in their balance" : "and keep it as that asset"}.` : ""}${wd ? `${dep ? " They can also" : "Customers"} withdraw to their own wallet or exchange.` : ""} You ${sdk ? "use zerohash's ready-made screens" : "build the screens on the API"}${auth ? ", with AUTH so they can connect an exchange or wallet" : ""}.`, steps: [], config: [] };
      if (dep && usd) {
        ph.steps.push(sdk
          ? { title: "Show the deposit screen", html: `<p>Ask for a token with the <code>fwc</code> permission for an approved customer, then open the Account Funding screen. It shows the address and QR code, the agreements, and emails the receipt.</p>`, code: [{ lang: "bash", label: "POST /client_auth_token", text: curl("POST", "/client_auth_token", { participant_code: "CUST01", permissions: ["fwc"] }) }, { lang: "javascript", label: "Open the Account Funding screen", text: sdkSnippet(R, "ACCOUNT_FUNDING", "ACCOUNT_FUNDING is illustrative — use the identifier from the Fund SDK reference (linked below)") }], links: [ref("fund-sdk", "Fund SDK reference"), link("fund-integration-guide-sdk", "Fund SDK guide")] }
          : { title: "Get a deposit address for the customer", html: `<p><span class="ep">POST /fund/rfq</span> returns an address for one asset. Anything sent there converts to dollars automatically. Ask for one address per asset you support.</p>`, code: [{ lang: "bash", label: "POST /fund/rfq", text: curl("POST", "/fund/rfq", { participant_code: "CUST01", fund_asset: first, client_fund_id: "abc123" }) }, { lang: "json", label: "What comes back", text: J({ message: { participant_code: "CUST01", fund_asset: first, rate: "1", quoted_currency: "USD", deposit_address: first.includes("SOL") ? "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU" : "0x5f59B625036ccB4f7aD27Ca4Cb896e4452AfFDAF", minimum_deposit: "1", maximum_deposit: "250000" } }) }], links: [ref("post_fund-rfq", "POST /fund/rfq"), link("fund-integration-guide-api", "Fund API guide")] });
        ph.steps.push({ title: "Get told when money lands", html: `<p>When the deposit confirms on-chain, zerohash converts it to USD, credits the customer, and sends a webhook. Update your customer's balance from it. Failures (too large, customer not approved) arrive the same way with <code>success: false</code>.</p>`, code: [{ lang: "json", label: "Webhook: deposit complete", text: J({ participant_code: "CUST01", fund_asset: first, quantity: "500", notional: "495.00", quoted_currency: "USD", deposit_address: "0x5f59B625036ccB4f7aD27Ca4Cb896e4452AfFDAF", fund_id: "a1b2c3d4-5678-9012-abcd-ef1234567890", success: true, reason: "Deposit processed" }) }], links: [ref("fund-transaction-update", "Account Funding webhooks")] });
        ph.steps.push({ title: "Show history", html: `<p><span class="ep">GET /fund/transactions</span> lists a customer's past deposits for your transaction history page.</p>`, code: [{ lang: "bash", label: "GET /fund/transactions", text: curl("GET", "/fund/transactions?participant_code=CUST01&page=1") }], links: [ref("get_fund-transactions", "GET /fund/transactions")] });
        ph.config.push("turning on Account Funding", "choosing whether converted dollars go to your account (the usual setup) or stay with the customer", "who pays the small conversion fee", "any deposit limits beyond the default $1 to $250,000");
      }
      if (dep && !usd) {
        ph.steps.push(sdk
          ? { title: "Show the deposit screen", html: `<p>Ask for a token with the <code>crypto-deposits</code> permission and open the Crypto Deposits screen. The asset stays as ${describeAssets(a, ["USDC.BASE"])} in the customer's account.</p>`, code: [{ lang: "bash", label: "POST /client_auth_token", text: curl("POST", "/client_auth_token", { participant_code: "CUST01", permissions: ["crypto-deposits"] }) }], links: [link("crypto-deposits-sdk-guide", "Crypto Deposits SDK guide")] }
          : { title: "Get a deposit address for the customer", html: `<p><span class="ep">POST /deposits/digital_asset_addresses</span> returns an address; deposits stay as the asset and you get a balance webhook when they land.</p>`, code: [{ lang: "bash", label: "POST /deposits/digital_asset_addresses", text: curl("POST", "/deposits/digital_asset_addresses", { participant_code: "CUST01", asset: first }) }], links: [ref("post_deposits-digital-asset-addresses", "POST /deposits/digital_asset_addresses")] });
      }
      if (wd) ph.steps.push({ title: "Let customers withdraw", html: `<p>Ask for a token with the <code>crypto-withdrawals</code> permission and open the withdrawal screen. The customer picks asset, network, destination${auth ? " (or a connected exchange)" : ""} and amount; you learn the outcome by webhook (submitted → posted → settled).</p>`, code: [{ lang: "bash", label: "POST /client_auth_token", text: curl("POST", "/client_auth_token", { participant_code: "CUST01", permissions: ["crypto-withdrawals"] }) }, { lang: "javascript", label: "Open the withdrawal screen", text: sdkSnippet(R, "CRYPTO_WITHDRAWALS") }], links: [link("crypto-withdrawals-guide", "Crypto Withdrawals SDK guide"), link("wallet-link-sdk-integration-guide", "Withdrawals that convert dollars to crypto")] });
      if (auth) { ph.steps.push({ title: "AUTH: connect exchanges and wallets", html: `<p>Nothing extra to code — once zerohash enables AUTH, the screens above gain a "connect your exchange or wallet" step. You choose which exchanges and wallets appear, and optionally add name matching between the customer and the connected account (AUTH Validate).</p>`, links: [link("auth", "AUTH"), link("auth-network", "Supported exchanges and wallets"), link("auth-validate", "AUTH controls")] }); ph.config.push("turning on AUTH and choosing which exchanges and wallets to offer"); }
      if (syms.length > 1) ph.config.push(`enabling your assets (${syms.join(", ")})`);
      return ph;
    },
    trade(a, { link, ref }) {
      const models = a.model || ["rfq"], syms = a.tokens || ["BTC"];
      const ph = { title: "Buy / Sell", intro: `Customers trade ${list(syms, "and")} ${models.includes("rfq") && models.includes("clob") ? "by firm quote and on the order book" : models.includes("clob") ? "on the order book" : "by firm quote"}.`, steps: [], config: [] };
      if (models.includes("rfq")) {
        ph.steps.push({ title: "Ask for a price", html: `<p><span class="ep">POST /liquidity/rfq</span> with the asset, buy or sell, and how much. You get an all-in price (your markup included) that's good for about 30 seconds.</p>`, code: [{ lang: "bash", label: "POST /liquidity/rfq", text: curl("POST", "/liquidity/rfq", { side: "buy", participant_code: "CUST01", account_label: "general", underlying: syms[0], quoted_currency: "USD", quantity: 0.01 }) }], links: [link("submit-and-execute-quotes")] });
        ph.steps.push({ title: "Confirm the trade", html: `<p>Send the <code>quote_id</code> to <span class="ep">POST /liquidity/execute</span> before it expires. zerohash checks the balance and returns a completed trade. <span class="ep">GET /trades</span> lists history.</p>`, code: [{ lang: "bash", label: "POST /liquidity/execute", text: curl("POST", "/liquidity/execute", { quote_id: "1f998343-d9f1-4b1d-bed7-df3aa8265bdb" }) }], links: [ref("post_liquidity-execute", "POST /liquidity/execute"), link("spreads-and-fees", "Setting your markup")] });
      }
      if (models.includes("clob")) { ph.steps.push({ title: "Connect to the order book", html: `<p>The order book runs over a FIX connection zerohash sets up with you. Email <a href="mailto:support@zerohash.com">support@zerohash.com</a> to become a member; then place limit, market and stop orders.</p>`, links: [link("central-limit-order-book-3"), link("supported-orders", "Order types")] }); ph.config.push("CLOB membership and a FIX connection"); }
      ph.config.push("whose dollars fund a buy — your float account (you settle daily) or each customer's own balance", "your default markup and how long quotes stay valid");
      return ph;
    },
    payouts(a, { link, ref }) {
      const syms = symbols(a, ["USDC.SOL"]), first = syms[0], [sym, net] = first.includes(".") ? first.split(".") : [first, first], who = a.bene || ["individual"];
      const ph = { title: "Payouts", intro: `Pay ${list(who.map(w => w === "entity" ? "businesses" : "people"), "and")} in ${describeAssets(a, ["USDC.SOL"])}, ${a.type === "single" ? "with one call per payout" : "controlling each step yourself"}.`, steps: [], config: [] };
      ph.steps.push({ title: "Register who's paying and fund the float", html: `<p>The payer (usually you) is registered once as a business. Payouts come out of a dollar float you keep with zerohash — it's pre-funded for you in Cert.</p>`, links: [link("new-payouts-api-integration-guide")] });
      if (a.type === "single") ph.steps.push({ title: "Send a payout", html: `<p>One call: who's paying, who's receiving (created on the fly if new), their wallet, and the amount in dollars. zerohash converts and sends. Track with <span class="ep">GET /payouts</span> and webhooks.</p>`, code: [{ lang: "bash", label: "POST /payouts", text: curl("POST", "/payouts", { account_model: "fully_disclosed", payor: { participant_code: "PAYOR1" }, beneficiary: { info: { individual: { onboarding_profile: "payouts_beneficiary", first_name: "Jane", last_name: "Smith", date_of_birth: "1990-01-01", address_one: "123 Main St", city: "New York", zip: "10001", jurisdiction_code: "US-NY", tax_id: "123456789", id_issuing_authority: "US" } }, external_account: { info: { network: net, crypto_address: "ab123...", supported_symbols: [sym] } } }, payment: { asset: first, quoted_asset: "USD", total: "100.00", description: "Contractor payout" } }) }], links: [link("new-payouts-api-integration-guide"), link("supported-regions", "Where you can pay")] });
      else ph.steps.push({ title: "Four steps per recipient", html: `<ul><li>Register the recipient — <span class="ep">POST /participants/beneficiaries/new</span></li><li>Link their wallet — <span class="ep">POST /payments/external_accounts</span></li><li>Send the payout — <span class="ep">POST /payments</span></li><li>Track it — <span class="ep">GET /payments/{id}</span> and webhooks</li></ul>`, code: [{ lang: "bash", label: "POST /payments/external_accounts", text: curl("POST", "/payments/external_accounts", { participant_code: "BENE01", type: "crypto", details: { network: net, supported_assets: [sym], address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } }) }], links: [link("payouts-integration-guide", "Modular Payouts guide"), link("payouts-sdk-integration-guide", "Or use the ready-made screens")] });
      ph.config.push("turning on Payouts");
      return ph;
    },
    payins(a, { link, ref }) {
      const syms = symbols(a, ["USDC.BASE"]), first = syms[0];
      const ph = { title: "Payins", intro: `Shoppers pay in ${describeAssets(a, ["USDC.BASE"])}${a.role === "psp" ? "; you register each merchant on your platform" : ""}.`, steps: [], config: [] };
      if (a.role === "psp") ph.steps.push({ title: "Register each merchant", html: `<p>Merchants are businesses: <span class="ep">POST /participants/entity/new</span>, then their documents.</p>`, links: [link("merchant-onboarding-guide", "Merchant onboarding")] });
      ph.steps.push({ title: "Register the shopper", html: `<p>Shoppers are verified like any customer (Phase 2). How much detail you need depends on what they buy and for how much; if a payment needs more, the error tells you exactly which fields to add.</p>`, links: [link("onboard-shoppers", "Shopper onboarding")] });
      ph.steps.push({ title: "Take a payment", html: `<p><span class="ep">POST /pay/rfq</span> locks the dollar amount and gives you an address to show. The shopper pays from their wallet; a webhook confirms it landed.${a.role === "psp" ? " Include the merchant's code on each quote." : ""} Ready-made checkout screens are available too.</p>`, code: [{ lang: "bash", label: "POST /pay/rfq", text: curl("POST", "/pay/rfq", Object.assign({ participant_code: "SHOPP1", pay_asset: first, quoted_total: "100.00", quoted_currency: "USD", account_label: "pay", client_reference_id: "order-12345" }, a.role === "psp" ? { merchant_participant_code: "MERCH01" } : {})) }], links: [link("payins-api-integration-guide"), link("payins-integration-guide", "Payins with ready-made screens")] });
      ph.config.push("turning on Payins and funding a refund account");
      return ph;
    },
    bank(a, { link, ref }) {
      const rails = a.rails || ["ach"], names = { ach: "ACH", rtp: "RTP/FedNow", wire: "wire" };
      const ph = { title: "Bank Rails (ACH + RTP)", intro: `Move dollars by ${list(rails.map(r => names[r]), "and")}; bank deposits are usable ${a.model === "prefunded" ? "once they settle" : a.model === "instant" ? "immediately as a balance" : "immediately for a purchase"}.`, steps: [], config: [] };
      ph.steps.push({ title: "Link the customer's bank account", html: `<p>Customers connect their bank through Plaid inside a zerohash screen — no Plaid contract needed on your side. (If you already use Plaid, you can pass zerohash a processor token instead.)</p>`, links: [link("bank-account-linking")] });
      ph.steps.push(a.model === "prefunded"
        ? { title: "Pull dollars in, then trade", html: `<p>Request the deposit with <span class="ep">POST /fund/deposit</span>; when it settles the customer has a dollar balance to buy with. Selling credits dollars they can withdraw to the same bank.</p>`, links: [link("funding-models", "Funding models")] }
        : { title: "Quote and confirm a bank-funded trade", html: `<p><span class="ep">POST /payments/rfq</span> prices the trade (a buy debits the bank, a sell credits it), then <span class="ep">POST /payments/execute</span> confirms it.</p>`, code: [{ lang: "bash", label: "POST /payments/rfq", text: curl("POST", "/payments/rfq", { side: "buy", underlying_currency: "BTC", quoted_currency: "USD", total: "100", participant_code: "CUST01", quote_expiry: "1m" }) }], links: [link("funding-models", "Funding models")] });
      if (rails.includes("rtp")) ph.steps.push({ title: "Pay out in seconds", html: `<p>RTP and FedNow credits arrive in seconds, 24/7, using the <code>rtp</code> network type.</p>`, links: [link("fiat")] });
      ph.config.push("a loss reserve (needed whenever ACH is on)", a.model === "prefunded" ? "no float, since you wait for settlement" : "a float balance, which caps what customers can trade before ACH settles", "Plaid set-up through zerohash");
      return ph;
    },
    va(a, { link, ref }) {
      const tok = a.token || "USDC", net = a.network || "SOL";
      const ph = { title: "Virtual Accounts", intro: a.policy === "convert" ? `Each customer gets an account number; dollars that arrive become ${tok} on ${net} and go to their approved wallet.` : "Each customer gets an account number; dollars that arrive are held as their balance.", steps: [], config: [] };
      if (a.policy === "convert") ph.steps.push({ title: "Approve the customer's wallet", html: `<p>Register the destination wallet with <span class="ep">POST /payments/external_accounts</span>; zerohash screens it.</p>`, code: [{ lang: "bash", label: "POST /payments/external_accounts", text: curl("POST", "/payments/external_accounts", { participant_code: "CUST01", type: "crypto", details: { network: net, supported_assets: [tok], address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } }) }], links: [link("create-a-virtual-account")] });
      ph.steps.push({ title: "Open the account", html: `<p><span class="ep">POST /virtual_accounts</span> creates it; a webhook delivers the account and routing number when it's active. Share those with the customer — money can be pushed in by ACH, wire, RTP or FedNow from any bank.</p>`, code: [{ lang: "bash", label: "POST /virtual_accounts", text: curl("POST", "/virtual_accounts", a.policy === "convert" ? { participant_code: "CUST01", settlement_policy: { type: "AUTO_CONVERT_AND_WITHDRAW", asset: tok, external_account_id: "7c1e2c3a-4b5d-4e6f-8a9b-0c1d2e3f4a5b" } } : { participant_code: "CUST01", settlement_policy: { type: "HOLD" } }) }], links: [link("create-a-virtual-account"), ref("virtual-account-updates", "Virtual account webhooks")] });
      ph.config.push("confirming Virtual Accounts is available where your customers live");
      return ph;
    },
    ramps(a, { link, ref }) {
      const dirs = a.dir || ["on"], syms = a.tokens || ["BTC"], first = syms[0];
      const ph = { title: "On & Off Ramps", intro: `Convert ${dirs.includes("on") ? "dollars into " + list(syms, "or") + " sent to the customer's wallet" : ""}${dirs.length === 2 ? ", and " : ""}${dirs.includes("off") ? list(syms, "or") + " into dollars" : ""}.`, steps: [], config: [] };
      if (dirs.includes("on")) ph.steps.push({ title: "Dollars to crypto", html: `<p><span class="ep">POST /convert_withdraw/rfq</span> with the dollar amount and the customer's wallet address gives a price including the network fee; <span class="ep">POST /convert_withdraw/execute</span> confirms and sends.</p>`, code: [{ lang: "bash", label: "POST /convert_withdraw/rfq", text: curl("POST", "/convert_withdraw/rfq", { participant_code: "CUST01", side: "buy", underlying: first, quoted_currency: "USD", total: 20, withdrawal_address: "2N8PYGKSQRpHa5VDNZ4iLwxi5crpRWb3TR1" }) }], links: [link("on-ramp-integration-guide")] });
      if (dirs.includes("off")) ph.steps.push({ title: "Crypto to dollars", html: `<p>Give the customer a deposit address (<span class="ep">POST /deposits/digital_asset_addresses</span>). When it lands, price the sale with <span class="ep">POST /liquidity/rfq</span> and confirm with <span class="ep">POST /liquidity/execute</span>.</p>`, code: [{ lang: "bash", label: "POST /liquidity/rfq (sell)", text: curl("POST", "/liquidity/rfq", { participant_code: "CUST01", side: "sell", underlying: first, quoted_currency: "USD", quantity: "1" }) }], links: [link("off-ramp-integration-guide")] });
      ph.config.push("your markup (a spread) or a flat fee per conversion", "how long quotes stay valid (30 seconds is typical)");
      return ph;
    },
    staking(a, { link, ref }) {
      const asset = a.asset || "ETH";
      const ph = { title: "Staking", intro: `Customers stake ${asset} through zerohash-run validators and earn rewards, less the fee you set.`, steps: [], config: [] };
      ph.steps.push({ title: "Show the rate", html: `<p><span class="ep">GET /assets/${asset}/staking_info</span> gives the current yield (after your fee), how long activation takes, and the unstaking wait. Customers must be approved, hold enough ${asset}, have accepted the staking agreement, and not live in CA, MD, NJ or WA.</p>`, code: [{ lang: "bash", label: `GET /assets/${asset}/staking_info`, text: curl("GET", `/assets/${asset}/staking_info`) }], links: [link("staking")] });
      ph.steps.push({ title: "Stake and follow along", html: `<p><span class="ep">POST /stakes</span> with the amount. Stakes are broadcast once a day and can be cancelled until then; after that, unstaking has a network-defined waiting period. Webhooks report each stage.</p>`, code: [{ lang: "bash", label: "POST /stakes", text: curl("POST", "/stakes", { participant_code: "CUST01", asset, amount: "0.5" }) + "\n# see the reference for the full request schema" }], links: [ref("post_stakes", "POST /stakes"), link("staking-faqs", "Staking FAQs")] });
      ph.config.push("your fee on rewards (zerohash suggests 25–35%)");
      return ph;
    },
    saas(a, { link, ref }) {
      const syms = a.tokens || ["BTC"], first = syms[0], sym = first.split(".")[0];
      const ph = { title: "Settlements as a Service", intro: `You ${a.model === "principal" ? "trade as the counterparty" : "match buyers and sellers"}; zerohash settles ${list(syms, "and")} trades so both sides deliver at once.`, steps: [], config: [] };
      ph.steps.push({ title: "Give the receiver a deposit address", html: `<p><span class="ep">POST /deposits/digital_asset_addresses</span> for whoever receives the asset. The deposit must match the trade amount exactly.</p>`, code: [{ lang: "bash", label: "POST /deposits/digital_asset_addresses", text: curl("POST", "/deposits/digital_asset_addresses", { participant_code: "CUST01", platform_code: "PLAT01", asset: first, account_label: "general" }) }], links: [link("settlements-as-a-service-integration-guide")] });
      ph.steps.push({ title: "Submit the trade", html: `<p><span class="ep">POST /trades</span> with both sides. Check <span class="ep">GET /trades/{id}</span> shows <code>settled</code> before anyone withdraws.</p>`, code: [{ lang: "bash", label: "POST /trades", text: curl("POST", "/trades", { symbol: `${sym}/USD`, trade_price: "7000.00000", product_type: "spot", trade_type: "regular", trade_reporter: "reporter@platform.com", platform_code: "PLAT01", client_trade_id: "test1", physical_delivery: true, parties_anonymous: false, transaction_timestamp: 1569014063570, parties: [{ participant_code: "ABCDEF", asset: sym, amount: "0.5", side: "buy", settling: true }, { participant_code: "PLAT01", asset: "USD", amount: "3500.0000", side: "sell", settling: false }] }) }], links: [ref("post_trades", "POST /trades")] });
      ph.config.push("onboarding your trading counterparties");
      return ph;
    },
    token(a, { link, ref }) {
      const chains = a.chains || ["ETH"];
      const ph = { title: "Tokenization Engine", intro: `${a.kind === "nft" ? "Unique tokens" : "A currency-like token"} on ${list(chains, "and")}; zerohash runs the contracts and covers gas.`, steps: [], config: [] };
      ph.steps.push(a.kind === "nft"
        ? { title: "Mint, move and redeem", html: `<p>Each token is minted once (<span class="ep">POST /token/mint</span>) and linked to your asset ID; transfer with <span class="ep">POST /v1/token/transfer</span>, redeem with <span class="ep">POST /token/burn</span>.</p>`, links: [link("non-fungible-token-nft-integration", "NFT guide")] }
        : { title: "Mint tokens", html: `<p><span class="ep">POST /v1/token/mint</span> with the amount, your token symbol and the receiving wallet. Burn, transfer, pause and freeze have their own endpoints.</p>`, code: [{ lang: "bash", label: "POST /v1/token/mint", text: curl("POST", "/v1/token/mint", { amount: "1.56", token_symbol: `USDFI.${chains[0]}`, client_request_id: "22b6cbea-1c77-415f-b866-2987b0b869ab", participant_code: "SB5LRL", receiver: "0x45D9A0Ee3a917Eccd6182C030dC9f18897eCf79E" }) }], links: [link("fungible-token-11-stablecoin-integration", "Fungible token guide")] });
      ph.config.push("contract deployment and who pays network fees");
      return ph;
    },
  };

  function highlight(text, lang) {
    let h = esc(text);
    if (lang === "json" || lang === "bash") h = h.replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="k">$1</span>$2').replace(/:\s*(&quot;[^&]*?&quot;)/g, (m, s) => m.replace(s, `<span class="s">${s}</span>`)).replace(/:\s*(\d+(\.\d+)?|true|false|null)(?=[,\s\n}])/g, (m, v) => m.replace(v, `<span class="n">${v}</span>`));
    if (lang === "bash") h = h.replace(/(^|\n)(#[^\n]*)/g, '$1<span class="c">$2</span>');
    if (lang === "javascript") h = h.replace(/(\/\/[^\n]*)/g, '<span class="c">$1</span>').replace(/('[^'\n]*')/g, '<span class="s">$1</span>');
    return h;
  }
  function codeBlock(c) {
    const w = el(`<div class="codewrap collapsed"><div class="codebar"><span class="lbl">${esc(c.label)}</span><span class="acts"><button type="button" class="show">Show code</button><button type="button" class="copy">Copy</button></span></div><pre><code>${highlight(c.text, c.lang)}</code></pre></div>`);
    const show = w.querySelector(".show");
    show.onclick = () => { const open = w.classList.toggle("collapsed"); show.textContent = open ? "Show code" : "Hide code"; };
    w.querySelector(".copy").onclick = () => copy(c.text, "Copied");
    return w;
  }
  function copy(text, msg) { navigator.clipboard.writeText(text).then(() => toast(msg || "Copied")).catch(() => toast("Couldn't copy — select the text instead")); }
  let toastT; function toast(m) { const t = $(".toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1600); }

  /* Chips inside a guide phase: adding or removing an asset rewrites that phase's text and code. */
  function assetPanel(pid) {
    const a = ans(pid), fields = assetFields(pid, a);
    if (!fields.length) return null;
    const box = el(`<div class="assets"><p class="assets-title">Assets in this phase<span class="assets-hint">Add or remove to rewrite the steps and code below. Only combinations zerohash supports appear here.</span></p></div>`);
    for (const f of fields) {
      const row = el(`<div class="afield"><p class="alabel">${esc(f.label)}</p><div class="chips"></div></div>`);
      const chips = row.querySelector(".chips");
      // A network reads as its name; an asset reads as its ticker, which is what the code uses,
      // with the full name on hover for anyone who doesn't recognise it.
      const isNetwork = ["networks", "network", "chains"].includes(f.key);
      const onCount = f.kind === "single" ? 1 : f.options.filter(([v]) => (a[f.key] || []).includes(v)).length;
      for (const [val, label] of f.options) {
        const on = f.kind === "single" ? a[f.key] === val : (a[f.key] || []).includes(val);
        const last = on && onCount === 1;
        const text = isNetwork ? label : val;
        const named = text !== label;
        const tip = [named ? label : "", last ? "keep at least one" : ""].filter(Boolean).join(" \u00b7 ");
        const c = el(`<button type="button" class="chip ${on ? "on" : ""} ${last ? "locked" : ""}" aria-pressed="${on}"${tip ? ` title="${esc(tip)}"` : ""}${named ? ` aria-label="${esc(label)}"` : ""}>${esc(text)}</button>`);
        c.onclick = () => {
          if (last) return;
          if (f.kind === "single") { if (a[f.key] === val) return; a[f.key] = val; }
          else {
            const cur = a[f.key] || [];
            a[f.key] = cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val];
          }
          save(); refreshGuide();
        };
        chips.append(c);
      }
      box.append(row);
    }
    return box;
  }

  /* Rebuild the guide without losing the reader's place or the code blocks they opened. */
  function refreshGuide() {
    const main = $(".main"), old = main.querySelector("section");
    if (!old) { render(); return; }
    const opened = [...main.querySelectorAll(".codewrap")].map(w => !w.classList.contains("collapsed"));
    const y = window.scrollY;
    main.replaceChild(viewGuide(), old);
    const wraps = [...main.querySelectorAll(".codewrap")];
    if (wraps.length === opened.length) wraps.forEach((w, i) => { if (opened[i]) w.querySelector(".show").click(); });
    window.scrollTo({ top: y });
  }

  /* A deep link carries a short brief, not the whole guide: the schemes below are URLs, and a
     full guide is far too long for one. The agent reads /agents.md for the grounding it needs. */
  function agentPrompt(phases) {
    const host = location.host;
    // the guide talks to the reader ("you build the screens"); the brief is the reader talking
    const ours = (t) => t.replace(/\byourself\b/gi, "ourselves").replace(/\bYou\b/g, "We").replace(/\byou\b/g, "we").replace(/\byour\b/gi, "our");
    const lines = phases.filter(ph => ph.pid).map(ph => `- ${ph.title}: ${ours(strip(ph.intro || "").replace(/\s+/g, " "))}`);
    const head = `Use curl to read ${host}/agents.md, then help me build this zerohash integration.\n\nRegion: ${REG().name} (start in Cert). Customer verification: ${S.kyc === "sdk" ? "zerohash does KYC with its ready-made screen" : "we verify customers ourselves and pass zerohash the results"}.\n\nWhat I am building:\n`;
    const tail = `\nWork through agents.md in order. Stop and tell me when something needs zerohash to provision access or approve a key.`;
    const full = head + lines.join("\n") + tail;
    if (full.length <= 4000) return full;
    return head + phases.filter(ph => ph.pid).map(ph => `- ${ph.title}`).join("\n") + tail;
  }

  function agentButton(phases) {
    const box = el(`<div class="agentbtn">
      <button type="button" class="btn small agent-main" title="Copy this guide as Markdown"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span class="agent-label">Copy as Markdown</span><span class="agent-icons" aria-hidden="true"><img src="/images/agents/claude.png" alt="" width="15" height="15"><img src="/images/agents/codex.svg" alt="" width="15" height="15"><img src="/images/agents/cursor.png" alt="" width="15" height="15"></span></button>
      <button type="button" class="btn small agent-more" aria-haspopup="menu" aria-expanded="false" aria-label="Open this guide in an agent"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
      <div class="agent-menu" role="menu" hidden>
        <a role="menuitem" class="agent-item" data-agent="claude" href="/agents"><img src="/images/agents/claude.png" alt="" width="17" height="17"><span>Open in Claude Code</span><i>↗</i></a>
        <a role="menuitem" class="agent-item" data-agent="codex" href="/agents"><img src="/images/agents/codex.svg" alt="" width="17" height="17"><span>Open in Codex</span><i>↗</i></a>
        <a role="menuitem" class="agent-item" data-agent="cursor" href="/agents"><img src="/images/agents/cursor.png" alt="" width="17" height="17"><span>Open in Cursor</span><i>↗</i></a>
        <a role="menuitem" class="agent-item agent-view" href="/agents" target="_blank" rel="noopener"><span>View agents.md</span><i>↗</i></a>
      </div>
    </div>`);
    const enc = encodeURIComponent(agentPrompt(phases));
    const links = { claude: `claude-cli://open?q=${enc}`, codex: `codex://new?prompt=${enc}`, cursor: `cursor://anysphere.cursor-deeplink/prompt?text=${enc}` };
    box.querySelectorAll("[data-agent]").forEach(a => { a.href = links[a.dataset.agent]; });
    const main = box.querySelector(".agent-main"), more = box.querySelector(".agent-more"), menu = box.querySelector(".agent-menu");
    const open = (on) => { menu.hidden = !on; more.setAttribute("aria-expanded", String(on)); };
    main.onclick = () => { copy(toMarkdown(phases), "Guide copied as Markdown"); box.classList.add("is-copied"); setTimeout(() => box.classList.remove("is-copied"), 1600); };
    more.onclick = (e) => { e.stopPropagation(); open(menu.hidden); };
    menu.onclick = () => open(false);
    document.addEventListener("click", (e) => { if (!box.contains(e.target)) open(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") open(false); });
    return box;
  }

  function viewGuide() {
    const phases = buildGuide(), R = REG();
    const v = el(`<section>
      <div class="guide-head"><div><p class="eyebrow">Your guide</p><p class="h1">Here's what to build</p></div></div>
      <p class="lede">${phases.length} phases, in the order you'll do them. Read the steps first; the code is there when you're ready — tap <b>Show code</b>. Where zerohash needs to set something up for you, the step says so. Change the assets in a phase and its steps and code follow.</p>
      <div class="summary"></div><div class="phases"></div></section>`);
    v.querySelector(".guide-head").append(agentButton(phases));
    const sum = v.querySelector(".summary");
    [["Region", R.name], ["Sandbox", host().replace("https://", "")], ["Verification", S.kyc === "sdk" ? "by zerohash" : "your own"], ...S.products.map(p => ["Product", PRODUCTS.find(x => x.id === p).name])].forEach(([k, val]) => sum.append(el(`<span class="pill">${esc(k)} <b>${esc(val)}</b></span>`)));
    const box = v.querySelector(".phases");
    phases.forEach((ph) => {
      const sec = el(`<section class="phase"><p class="phase-eyebrow">${esc(ph.eyebrow)}</p><p class="h2">${esc(ph.title)}</p>${ph.intro ? `<p class="intro">${ph.intro}</p>` : ""}</section>`);
      if (ph.pid) { const panel = assetPanel(ph.pid); if (panel) sec.append(panel); }
      ph.steps.forEach((st, i) => {
        const g = el(`<div class="gstep"><div class="n">${i + 1}</div><div><p class="h3">${esc(st.title)}</p>${st.html || ""}</div></div>`);
        const body = g.children[1];
        (st.code || []).forEach(c => body.append(codeBlock(c)));
        if (st.links && st.links.length) body.append(el(`<p class="links">${st.links.map(([l, u]) => `<a href="${u}"${u.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(l)} ↗</a>`).join("")}</p>`));
        sec.append(g);
      });
      if (ph.config && ph.config.length) sec.append(el(`<p class="setup-note">Your zerohash contact sets this up with you: ${esc(sentence(ph.config))}.</p>`));
      box.append(sec);
    });
    return v;
  }
  const strip = (h) => h.replace(/<br\s*\/?>/g, "\n").replace(/<li>/g, "\n- ").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\n{3,}/g, "\n\n").trim();

  function toMarkdown(phases) {
    let md = `# zerohash setup guide\n\nRegion: ${REG().name} · Sandbox: ${host()}\nProducts: ${S.products.map(p => PRODUCTS.find(x => x.id === p).name).join(", ")}\n\n`;
    for (const ph of phases) {
      md += `## ${ph.eyebrow} — ${ph.title}\n\n${ph.intro ? strip(ph.intro) + "\n\n" : ""}`;
      ph.steps.forEach((st, i) => { md += `### ${i + 1}. ${st.title}\n\n${strip(st.html || "")}\n\n`; (st.code || []).forEach(c => { md += `**${c.label}**\n\n\`\`\`${c.lang}\n${c.text}\n\`\`\`\n\n`; }); if (st.links && st.links.length) md += st.links.map(([l, u]) => `- [${l}](${u.startsWith("http") ? u : location.origin + u})`).join("\n") + "\n\n"; });
      if (ph.config && ph.config.length) md += `Your zerohash contact sets this up with you: ${sentence(ph.config)}.\n\n`;
    }
    return md;
  }

  /* ---------------- mounting ---------------- */
  function mountWizard() {
    const root = document.getElementById("zh-wizard-root");
    if (!root || root.dataset.mounted) return;
    root.dataset.mounted = "1"; ROOT = root;
    const pre = new URLSearchParams(location.search).get("products");
    if (pre) { const ids = pre.split(",").map(s => s.trim()).filter(id => PRODUCT_IDS.includes(id)); if (ids.length) { S.products = ids; S.step = 1; } }  // products already chosen on the landing page: start at "About you"
    root.innerHTML = `<nav class="rail" aria-label="Wizard steps"><p class="rail-title">Your setup</p><ol class="steps"></ol><p class="rail-note">Everything here comes from these docs — each section links to its source page. Your choices are saved in this browser.</p></nav><main class="main"></main><div class="toast" role="status" aria-live="polite"></div>`;
    render();
  }

  

  /* Animated cover for the hero card: soft orbs drifting over a breathing dot lattice. */
  function paintCover(canvas, reduced) {
    const ctx = canvas.getContext("2d");
    const orbs = [
      { x: 0.22, y: 0.30, r: 0.55, c: "rgba(62, 207, 142, 0.75)", dx: 0.00016, dy: 0.00011, ph: 0 },
      { x: 0.80, y: 0.70, r: 0.60, c: "rgba(11, 122, 84, 0.85)", dx: -0.00013, dy: 0.00009, ph: 2 },
      { x: 0.65, y: 0.15, r: 0.40, c: "rgba(204, 255, 208, 0.55)", dx: 0.0001, dy: -0.00014, ph: 4 },
    ];
    let raf = null, t0 = performance.now();
    const size = () => { const r = canvas.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = Math.max(1, r.width * dpr); canvas.height = Math.max(1, r.height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); return r; };
    const frame = (now) => {
      const r = size(), w = r.width, h = r.height, t = now - t0;
      ctx.fillStyle = "#0b3d2b"; ctx.fillRect(0, 0, w, h);
      for (const o of orbs) {
        const x = (0.5 + (o.x - 0.5) * Math.cos(t * o.dx + o.ph)) * w, y = (0.5 + (o.y - 0.5) * Math.sin(t * o.dy + o.ph)) * h, rad = o.r * Math.max(w, h);
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, o.c); g.addColorStop(1, "rgba(11, 61, 43, 0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      }
      // dot lattice that breathes with a travelling wave
      const step = 22; ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
      for (let y = 14; y < h; y += step) for (let x = 14; x < w; x += step) {
        const s = 0.9 + 0.9 * Math.sin(t * 0.0012 + x * 0.045 + y * 0.03);
        ctx.beginPath(); ctx.arc(x, y, Math.max(0.3, s), 0, Math.PI * 2); ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    frame(t0);
    // pause when the card is off-screen
    if (!reduced && "IntersectionObserver" in window) new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(frame); } else if (raf) { cancelAnimationFrame(raf); raf = null; } })).observe(canvas);
  }

  /* The landing page belongs to no tab, but Mintlify still marks the first one current.
     The underline and weight are dropped in CSS; the colour is copied from a sibling tab so it
     matches exactly in either theme. Runs on every boot, so a theme switch refreshes it. */
  let themeWatch = false;
  function resetTabState() {
    if (!document.querySelector(".zh-landing")) return;
    const tabs = [...document.querySelectorAll(".nav-tabs-item")];
    const current = tabs.find(t => t.hasAttribute("aria-current"));
    const sibling = tabs.find(t => !t.hasAttribute("aria-current"));
    if (current && sibling) {
      current.style.removeProperty("color");
      current.style.color = getComputedStyle(sibling).color;
    }
    if (!themeWatch) {                     // the copied colour is per theme, and switching
      themeWatch = true;                   // themes only changes an attribute, which the
      new MutationObserver(resetTabState)  // boot observer does not watch
        .observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    }
  }

  /* ---------------- landing page: product filter ----------------
     One category at a time: picking a chip releases the others, and picking the pressed chip
     again clears the filter so every card shows. Categories match the docs' own sections. */
  function mountProductFilter() {
    const bar = document.getElementById("zh-prod-filter");
    if (!bar || bar.dataset.mounted) return;
    bar.dataset.mounted = "1";
    const chips = [...bar.querySelectorAll(".zh-chip")];
    const cards = [...document.querySelectorAll(".zh-products .zh-card[data-cat]")];
    const select = (cat) => {
      chips.forEach(c => c.setAttribute("aria-pressed", String(c.dataset.cat === cat)));
      cards.forEach(card => card.classList.toggle("is-off", Boolean(cat) && card.dataset.cat !== cat));
    };
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        select(chip.getAttribute("aria-pressed") === "true" ? null : chip.dataset.cat);
      });
    });
    select(null);
  }

  /* ---------------- landing page: FAQ ----------------
     Five rows expand in place. The last one takes a question and answers it from the docs:
     scripts/build_faq_index.py ships a passage per heading as /faq-index.txt, fetched the first
     time someone asks, scored here in the browser. A Mintlify assistant key would let this call
     https://api.mintlify.com/discovery/v1/search/<domain> for semantic hits instead. */
  const STOPWORDS = new Set("a an the is are was do does did how what when where which who why i my me we our you your can could should would will shall to of for in on at by with from and or but if then than that this these those it its as be been being have has had not no do i".split(" "));
  let FAQ_INDEX = null;

  // "stake" has to find "staking", so each word also matches on a crude stem
  const stem = (w) => w.length > 4 ? w.replace(/(ings?|ed|es|s|e)$/, "") : w;

  function scoreDocs(question) {
    const words = (question.toLowerCase().match(/[a-z0-9./_-]{3,}/g) || []).filter(w => !STOPWORDS.has(w));
    if (!words.length || !FAQ_INDEX) return [];
    const terms = words.map(w => ({ w, s: stem(w) }));
    const count = (hay, term) => {
      const exact = hay.split(term.w).length - 1;
      if (exact) return { n: exact, exact: true };
      if (term.s !== term.w && term.s.length > 2) { const n = hay.split(term.s).length - 1; if (n) return { n, exact: false }; }
      return { n: 0, exact: false };
    };
    const hits = [];
    for (const page of FAQ_INDEX.pages) {
      const title = page.t.toLowerCase(), desc = (page.d || "").toLowerCase(), url = page.u.toLowerCase();
      let base = 0;
      for (const term of terms) {
        const inTitle = count(title, term);
        if (inTitle.n) base += inTitle.exact ? 7 : 5;
        if (count(desc, term).n) base += 3;
        if (count(url, term).n) base += 2;
      }
      // a short title the question covers entirely ("Staking") beats one long title that
      // happens to contain the word ("Preparing for the Ethereum Proof of Stake Merge Event")
      const titleWords = title.split(/[^a-z0-9]+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
      if (titleWords.length && titleWords.every(tw => terms.some(term => tw.includes(term.s) || term.w.includes(tw)))) base += 9;
      let best = null;
      for (const passage of page.p || []) {
        const h = (passage.h || "").toLowerCase(), t = passage.t.toLowerCase();
        let sc = 0;
        for (const term of terms) {
          const inHead = count(h, term);
          if (inHead.n) sc += inHead.exact ? 4 : 3;
          const inText = count(t, term);
          if (inText.n) sc += Math.min(inText.n, 3) * (inText.exact ? 2 : 1.5);
        }
        if (sc && (!best || sc > best.sc)) best = { sc, passage };
      }
      const total = base + (best ? best.sc : 0);
      if (total >= 7 && best) hits.push({ page, passage: best.passage, score: total });
    }
    return hits.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  // the page title and the heading often repeat each other; show one of them
  const sameish = (title, heading) => {
    if (!heading) return true;
    const a = title.toLowerCase(), b = heading.toLowerCase();
    return a.includes(b) || b.includes(a.split(" ")[0] + " " + (a.split(" ")[1] || ""));
  };

  function mountFaq() {
    const list = document.getElementById("zh-faq");
    if (!list || list.dataset.mounted) return;
    list.dataset.mounted = "1";

    list.querySelectorAll(".zh-faq-q").forEach(btn => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        if (panel) panel.hidden = open;
      });
    });

    const row = document.getElementById("zh-faq-ask");
    if (!row) return;
    row.innerHTML = `<form class="zh-faq-form" novalidate>
      <input class="zh-faq-input" type="text" autocomplete="off" placeholder="Ask anything else about building with zerohash" aria-label="Ask anything else about building with zerohash" />
      <button class="zh-faq-send" type="submit" disabled aria-label="Get an answer from the docs"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>
    </form>`;
    const form = row.querySelector("form"), input = row.querySelector(".zh-faq-input"), send = row.querySelector(".zh-faq-send");
    input.addEventListener("input", () => {
      const ready = input.value.trim().length > 2;
      send.disabled = !ready;
      send.classList.toggle("on", ready);
    });

    const answer = el(`<div class="zh-faq-answer" hidden></div>`);
    row.append(answer);

    const handoffs = (question) => {
      const prompt = `Answer this using ${location.host}/llms.txt and the zerohash docs it lists as your only source: ${question}`;
      const q = encodeURIComponent(prompt);
      return `<div class="zh-faq-more"><span>Want it written up?</span>
        <a href="https://claude.ai/new?q=${q}" target="_blank" rel="noopener"><img src="/images/agents/claude.png" alt="" width="15" height="15" />Claude</a>
        <a href="https://chatgpt.com/?q=${q}" target="_blank" rel="noopener"><img src="/images/agents/codex.svg" alt="" width="15" height="15" />ChatGPT</a>
        <a href="https://www.perplexity.ai/search?q=${q}" target="_blank" rel="noopener">Perplexity</a></div>`;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const question = input.value.trim();
      if (question.length < 3) return;
      answer.hidden = false;
      answer.innerHTML = `<p class="zh-faq-qline">Looking through the docs…</p>`;
      if (!FAQ_INDEX) {
        try { FAQ_INDEX = await fetch("/faq-index.txt").then(r => r.json()); }
        catch (err) { FAQ_INDEX = { pages: [] }; }
      }
      const hits = scoreDocs(question);
      if (!hits.length) {
        answer.innerHTML = `<p>Nothing in the docs matched that closely enough to quote. Try naming the endpoint or product, or take the question to an assistant with the docs as its source.</p>
          ${handoffs(question)}`;
        return;
      }
      const main = hits[0];
      const strong = hits.slice(1).filter(h => h.score >= hits[0].score * 0.6);
      const others = strong.map(h => `<a href="${h.page.u}">${esc(h.page.t)}${h.passage.h ? " · " + esc(h.passage.h) : ""}</a>`).join(" ");
      answer.innerHTML = `<h4>${esc(sameish(main.page.t, main.passage.h) ? main.page.t : main.page.t + (main.passage.h ? ": " + main.passage.h : ""))}</h4>
        <p>${esc(main.passage.t)}…</p>
        <p class="zh-faq-cite"><a href="${main.page.u}">Read the page${'\u00a0'}→</a></p>
        ${others ? `<p class="zh-faq-cite">Also relevant: ${others}</p>` : ""}
        ${handoffs(question)}`;
    });
  }

  /* ---------------- landing page: "Build with agent" ----------------
     One prompt, three ways to use it: copy it, or open it straight in Claude Code, Codex or Cursor
     through their deep links. The prompt points the agent at this site's /agents.md. */
  function mountAgentButton() {
    const box = document.getElementById("zh-agent");
    if (!box || box.dataset.mounted) return;
    box.dataset.mounted = "1";
    const prompt = `Use curl to read ${location.host}/agents.md and perform the setup to get started with zerohash`;
    const enc = encodeURIComponent(prompt);
    const links = { claude: `claude-cli://open?q=${enc}`, codex: `codex://new?prompt=${enc}`, cursor: `cursor://anysphere.cursor-deeplink/prompt?text=${enc}` };
    box.querySelectorAll("[data-agent]").forEach(a => { a.href = links[a.dataset.agent]; });
    const main = box.querySelector(".zh-agent-main"), more = box.querySelector(".zh-agent-more"), menu = box.querySelector(".zh-agent-menu"), label = box.querySelector(".zh-agent-label");
    let t = null;
    const open = (on) => { menu.hidden = !on; more.setAttribute("aria-expanded", String(on)); };
    main.addEventListener("click", () => {
      navigator.clipboard.writeText(prompt).then(() => {
        box.classList.add("is-copied"); label.textContent = "Prompt copied";
        clearTimeout(t); t = setTimeout(() => { box.classList.remove("is-copied"); label.textContent = "Build with agent"; }, 1800);
      }).catch(() => open(true));
    });
    more.addEventListener("click", (e) => { e.stopPropagation(); open(menu.hidden); });
    document.addEventListener("click", (e) => { if (!box.contains(e.target)) open(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") open(false); });
    menu.addEventListener("click", () => open(false));
  }

  /* ---------------- landing page: backgrounds that follow the cursor ----------------
     Each .zh-spot eases two CSS variables (--mx/--my, the light's position) toward the pointer,
     and drifts its grid lines the other way (--px/--py). When the pointer leaves, the light stays put. */
  function mountSpotlights() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(hover: none)").matches) return;
    document.querySelectorAll(".zh-spot:not([data-spot])").forEach((box) => {
      box.dataset.spot = "1";
      const rest = (box.dataset.rest || "0.5,0.5").split(",").map(Number);
      let w = 1, h = 1, cx = 0, cy = 0, tx = 0, ty = 0, raf = null;
      const measure = () => { const r = box.getBoundingClientRect(); w = r.width; h = r.height; return r; };
      const restPoint = () => { measure(); return [rest[0] * w, rest[1] * h]; };
      const paint = () => {
        box.style.setProperty("--mx", cx.toFixed(1) + "px");
        box.style.setProperty("--my", cy.toFixed(1) + "px");
        box.style.setProperty("--px", ((w / 2 - cx) * 0.06).toFixed(1) + "px");
        box.style.setProperty("--py", ((h / 2 - cy) * 0.06).toFixed(1) + "px");
      };
      const tick = () => {
        cx += (tx - cx) * 0.11; cy += (ty - cy) * 0.11;
        if (Math.abs(tx - cx) < 0.25 && Math.abs(ty - cy) < 0.25) { cx = tx; cy = ty; paint(); raf = null; return; }
        paint(); raf = requestAnimationFrame(tick);
      };
      const go = () => { if (!raf) raf = requestAnimationFrame(tick); };
      box.addEventListener("pointermove", (e) => { const r = measure(); tx = e.clientX - r.left; ty = e.clientY - r.top; box.classList.add("is-hot"); go(); });
      // leaving keeps the light where the cursor last was; only the brighter hover state fades
      box.addEventListener("pointerleave", () => { box.classList.remove("is-hot"); });
      [cx, cy] = restPoint(); [tx, ty] = [cx, cy]; paint();
    });
  }

  /* ---------------- landing page: hero chat card (the whole wizard, one question at a time) ---------------- */
  function mountHeroChat() {
    const box = document.getElementById("zh-hero-chat");
    if (!box || box.dataset.mounted) return;
    box.dataset.mounted = "1";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Two faces: a painted cover on the front, the chat on the back. Hovering flips the card;
    // once the reader starts answering it stays open. Tapping the cover flips it on touch screens.
    box.innerHTML = `<div class="zh-flip">
      <div class="zh-face zh-front"><canvas class="zh-cover"></canvas>
        <div class="zh-cover-copy"><p class="zh-cover-kicker">Setup wizard</p><p class="zh-cover-title">Get a customized guide based on what you're building</p><p class="zh-cover-hint">Hover to start <span aria-hidden="true">→</span></p></div>
      </div>
      <div class="zh-face zh-back"></div>
    </div>`;
    const back = box.querySelector(".zh-back");
    box.querySelector(".zh-front").addEventListener("click", () => box.classList.add("is-open"));
    box.addEventListener("focusin", () => box.classList.add("is-open"));
    paintCover(box.querySelector(".zh-cover"), reduced);

    // The card keeps its own answers, so nothing a past visit saved is ever preselected here.
    // They are copied into the shared wizard state only on the hand-off to /setup-wizard.
    let H = JSON.parse(JSON.stringify(DEFAULT));
    const hAns = (pid) => H.answers[pid] || (H.answers[pid] = {});
    const hVisible = (pid) => { const a = hAns(pid); return QUESTIONS[pid].filter(q => !q.when || q.when(a)); };
    const done = [];            // question keys answered in this visit, in order
    let typing = false, timer = null;
    const labelOf = (opts, vals) => { const arr = Array.isArray(vals) ? vals : [vals]; const names = arr.map(v => (opts.find(o => o[0] === v) || [v, v])[1]); return names.length > 3 ? `${names.slice(0, 3).join(", ")} +${names.length - 3} more` : names.join(", "); };

    // The ordered questions, recomputed each render because later ones depend on earlier answers.
    function queue() {
      const qs = [
        { key: "products", kind: "multi", title: "Which products are you interested in?", opts: PRODUCTS.map(p => [p.id, p.name]), get: () => H.products, set: v => { H.products = v; } },
        { key: "region", kind: "single", title: "Where is your platform based?", opts: [["us", "United States"], ["eu", "European Union"]], get: () => H.region, set: v => { H.region = v; } },
        { key: "customers", kind: "multi", title: "Who are your customers?", opts: [["individuals", "People"], ["businesses", "Businesses"]], get: () => H.customers, set: v => { H.customers = v; } },
        { key: "kyc", kind: "single", title: "Who do you expect to verify your customer's identity?", hint: "Most platforms let zerohash do it with a ready-made screen.", opts: [["sdk", "zerohash"], ["api", "Ourselves"]], get: () => H.kyc, set: v => { H.kyc = v; } },
      ];
      for (const pid of PRODUCT_IDS.filter(id => H.products.includes(id))) {
        const p = PRODUCTS.find(x => x.id === pid), a = hAns(pid);
        for (const q of hVisible(pid)) {
          const opts = q.groups ? q.groups.flatMap(g => g.items.map(([v, l]) => [v, l])) : q.opts.map(([v, l]) => [v, l]);
          qs.push({ key: `${pid}.${q.id}`, product: p.name, kind: q.type === "single" ? "single" : "multi", title: q.title, hint: q.plain || q.help || "", opts, selectAll: !!q.selectAll, get: () => a[q.id], set: v => { a[q.id] = v; } });
        }
      }
      return qs;
    }
    const answered = (q) => done.includes(q.key);

    const HEAD = (label, pct) => `
      <div class="zh-chat-head"><span class="zh-chat-avatar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg></span><span class="zh-chat-title">Setup wizard</span><span class="zh-chat-step" aria-label="${label}"></span></div>
      <div class="zh-chat-progress"><span style="width:${pct}%"></span></div>`;

    /* The card's frame is built once and then updated in place. Re-rendering the whole thing on
       every answer replayed the entrance animation on every message, which looked like a reload. */
    function shell(label, pct) {
      let log = back.querySelector(".zh-chat-log");
      if (!log) {
        back.innerHTML = HEAD(label, pct) + `
        <div class="zh-chat-log" role="log" aria-live="polite"></div>
        <div class="zh-chat-composer"></div>`;
        log = back.querySelector(".zh-chat-log");
      }
      back.querySelector(".zh-chat-step").setAttribute("aria-label", label);
      back.querySelector(".zh-chat-progress > span").style.width = `${pct}%`;
      return { log, composer: back.querySelector(".zh-chat-composer") };
    }

    // The products question is a plain question with a card per product, not a chat exchange.
    function renderPicker(q, total, k) {
      back.innerHTML = HEAD(`Question ${k + 1} of ${total}`, Math.round((k / total) * 100)) + `
        <div class="zh-pick">
          <p class="zh-pick-q">Which products are you interested in?</p>
          <p class="zh-pick-hint">Pick as many as you like.</p>
          <div class="zh-pick-list" role="group" aria-label="Products"></div>
        </div>
        <div class="zh-chat-composer"></div>`;
      const listEl = back.querySelector(".zh-pick-list"), composer = back.querySelector(".zh-chat-composer");
      let sel = Array.isArray(q.get()) ? q.get().slice() : [];
      const actions = el(`<div class="zh-chat-actions"><span></span><button type="button" class="zh-btn zh-btn-primary">Continue →</button></div>`);
      const go = actions.querySelector(".zh-btn");
      const paint = () => { listEl.querySelectorAll(".zh-pcard").forEach(c => { const on = sel.includes(c.dataset.v); c.classList.toggle("on", on); c.setAttribute("aria-checked", on); }); go.disabled = sel.length === 0; };
      for (const prod of PRODUCTS) {
        const c = el(`<button type="button" class="zh-pcard" role="checkbox" aria-checked="false" data-v="${esc(prod.id)}"><span class="zh-pcard-check" aria-hidden="true"></span>${productIcon(prod.id, "zh-pcard-ico")}<span class="zh-pcard-txt"><span class="zh-pcard-t">${esc(prod.name)}</span><span class="zh-pcard-d">${esc(prod.short)}</span></span></button>`);
        c.onclick = () => { sel = sel.includes(prod.id) ? sel.filter(x => x !== prod.id) : [...sel, prod.id]; paint(); };
        listEl.append(c);
      }
      go.onclick = () => { q.set(sel); advance(q.key); };
      composer.append(actions); paint();
    }

    function render() {
      const qs = queue(), current = qs.find(q => !answered(q)), total = qs.length, k = Math.min(done.length, total);
      box.classList.toggle("is-active", done.length > 0);
      if (done.length) box.classList.add("is-open");
      if (current && current.key === "products" && !typing) { renderPicker(current, total, k); return; }
      const { log, composer } = shell(current ? `Question ${k + 1} of ${total}` : "Done", current ? Math.round((k / total) * 100) : 100);
      composer.innerHTML = "";
      // A message carrying a data-key belongs to the transcript and stays between renders; the
      // rest (the open question, the typing dots, the closing note) is rebuilt each time.
      // The question just answered is already on screen, so that node is adopted into the
      // transcript rather than dropped and animated straight back in.
      const fresh = done.find(key => !log.querySelector(`[data-key="${key}"]`));
      if (fresh) {
        const q = qs.find(x => x.key === fresh), node = [...log.querySelectorAll(".zh-msg.bot.is-transient")].pop();
        if (q && node && node.textContent.startsWith(q.title)) {
          node.classList.remove("is-transient");
          node.dataset.key = fresh;
          node.innerHTML = esc(q.title);   // the hint only applies while the question is open
        }
      }
      log.querySelectorAll(".is-transient").forEach(n => n.remove());
      const add = (cls, html, key) => {
        const n = el(`<div class="zh-msg ${cls}${key ? "" : " is-transient"}">${html}</div>`);
        if (key) n.dataset.key = key;
        log.append(n); return n;
      };
      const bot = (html, hint, key) => { const hints = (Array.isArray(hint) ? hint : [hint]).filter(Boolean); return add("bot", html + hints.map(h => `<span class="hint">${h}</span>`).join(""), key); };
      const user = (text, key) => add("user", esc(text), key);

      // transcript of what's been answered so far: only what's new is appended, so nothing
      // already on screen moves or replays its entrance animation
      log.querySelectorAll("[data-key]").forEach(n => { if (!done.includes(n.dataset.key)) n.remove(); });
      for (const key of done) {
        const q = qs.find(x => x.key === key); if (!q) continue;
        const have = log.querySelectorAll(`[data-key="${key}"]`).length;
        if (!have) bot(esc(q.title), null, key);
        if (have < 2) user(labelOf(q.opts, q.get()), key);
      }

      if (!current) {
        bot(`That's everything. Your guide is ready.`, `Directions and code for ${list(H.products.map(id => PRODUCTS.find(p => p.id === id).name), "and")}, in the order you'll do them.`);
        const actions = el(`<div class="zh-chat-actions"><button type="button" class="zh-chat-back">Start over</button><a class="zh-btn zh-btn-primary" href="/setup-wizard">See my guide →</a></div>`);
        actions.querySelector("a").onclick = () => { S = JSON.parse(JSON.stringify(H)); S.step = stepList().length - 1; save(); };
        actions.querySelector(".zh-chat-back").onclick = () => { done.length = 0; H = JSON.parse(JSON.stringify(DEFAULT)); box.classList.remove("is-open", "is-active"); render(); };
        composer.append(actions);
      } else if (typing) {
        add("bot typing", `<i></i><i></i><i></i>`).setAttribute("aria-label", "Typing");
      } else {
        bot(esc(current.title), [current.hint, current.kind === "multi" ? "Pick as many as you like." : ""]);
        const opts = el(`<div class="zh-chat-options"></div>`);
        if (current.kind === "single") {
          for (const [val, label] of current.opts) {
            const b = el(`<button type="button" class="zh-opt ${current.get() === val ? "on" : ""}">${esc(label)}</button>`);
            b.onclick = () => { current.set(val); advance(current.key); };
            opts.append(b);
          }
          composer.append(opts, el(`<div class="zh-chat-actions">${done.length ? '<button type="button" class="zh-chat-back">← Back</button>' : "<span></span>"}<span></span></div>`));
        } else {
          let sel = Array.isArray(current.get()) ? current.get().slice() : [];
          const all = current.opts.map(o => o[0]);
          const paint = () => { opts.querySelectorAll(".zh-opt[data-v]").forEach(b => b.classList.toggle("on", sel.includes(b.dataset.v))); const sa = opts.querySelector(".zh-opt.all"); if (sa) { const on = all.every(v => sel.includes(v)); sa.classList.toggle("on", on); sa.textContent = on ? "Clear all" : "Select all"; } go.disabled = sel.length === 0; };
          if (current.selectAll) { const sa = el(`<button type="button" class="zh-opt all">Select all</button>`); sa.onclick = () => { sel = all.every(v => sel.includes(v)) ? [] : all.slice(); paint(); }; opts.append(sa); }
          for (const [val, label] of current.opts) {
            const b = el(`<button type="button" class="zh-opt" data-v="${esc(val)}">${esc(label)}</button>`);
            b.onclick = () => { sel = sel.includes(val) ? sel.filter(x => x !== val) : [...sel, val]; paint(); };
            opts.append(b);
          }
          const actions = el(`<div class="zh-chat-actions">${done.length ? '<button type="button" class="zh-chat-back">← Back</button>' : "<span></span>"}<button type="button" class="zh-btn zh-btn-primary">Continue →</button></div>`);
          const go = actions.querySelector(".zh-btn");
          go.onclick = () => { current.set(sel); advance(current.key); };
          composer.append(opts, actions); paint();
        }
        const backBtn = composer.querySelector(".zh-chat-back");
        if (backBtn) backBtn.onclick = () => { done.pop(); render(); };
      }
      log.scrollTo({ top: log.scrollHeight, behavior: "instant" });
    }

    function advance(key) {
      if (!done.includes(key)) done.push(key);
      if (reduced) { render(); return; }
      typing = true; render();
      clearTimeout(timer); timer = setTimeout(() => { typing = false; render(); }, 420);
    }

    render();
  }

  const boot = () => { mountWizard(); mountHeroChat(); mountSpotlights(); mountAgentButton(); mountFaq(); mountProductFilter(); resetTabState(); };
  boot();
  new MutationObserver(boot).observe(document.documentElement, { childList: true, subtree: true });
})();
