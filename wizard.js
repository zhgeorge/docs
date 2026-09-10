/* zerohash docs — setup wizard (/setup-wizard) and the landing page's "Generate custom guide" mode.
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
  const TOKENS_Q = { id: "tokens", type: "multi", title: "Which tokens?", help: "Stablecoins are digital dollars (or euros) that hold a fixed value. Crypto assets move with the market.", selectAll: true, groups: [{ g: "Stablecoins", items: STABLE }, { g: "Crypto", items: CRYPTO }] };
  const NETWORKS_Q = { id: "networks", type: "multi", title: "On which networks?", help: "A network is the blockchain a stablecoin travels on. Fees and speed differ; USDC on Base is a popular low-cost choice. Only the combinations zerohash supports will appear in your guide.", when: hasStable, selectAll: true, groups: [{ g: "Networks", items: NETWORKS }] };
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
    { id: "fund", name: "Account Funding", tag: "Move money in", short: "Customers add money to their account by sending stablecoins or crypto.", plain: "Show a customer an address, they send USDC (or another asset) to it, and their balance updates within minutes — as dollars if you want. A funding method that sits next to cards, wires and ACH.", src: "fund-overview" },
    { id: "trade", name: "Buy / Sell", tag: "Trade", short: "Let customers buy and sell crypto at prices from top market makers.", plain: "You ask zerohash for a firm price, show it to the customer, and confirm. zerohash handles liquidity, custody and compliance behind the scenes.", src: "buysell" },
    { id: "payouts", name: "Payouts", tag: "Move money out", short: "Pay people in stablecoins or crypto, straight to their wallet, any time.", plain: "Contractors, sellers and creators get paid in minutes instead of days — across borders, without bank wires.", src: "payouts" },
    { id: "payins", name: "Payins", tag: "Get paid", short: "Accept stablecoin and crypto payments at checkout.", plain: "A shopper pays from their wallet; you get a locked-in dollar amount and a notification when the money lands.", src: "payins-api-integration-guide" },
    { id: "bank", name: "Bank Rails (ACH + RTP)", tag: "Move money in & out", short: "Connect customers' U.S. bank accounts to move dollars in and out.", plain: "Pull dollars in by ACH to buy crypto, and send dollars out by ACH, RTP or FedNow when customers cash out. Bank linking is handled through Plaid.", src: "fiat" },
    { id: "va", name: "Virtual Accounts", tag: "Move money in", short: "Give each customer their own account and routing number.", plain: "Customers (or their employers) push dollars to it like any bank account. When money arrives, zerohash holds it or converts it to a stablecoin.", src: "virtual-accounts" },
    { id: "ramps", name: "On & Off Ramps", tag: "Convert", short: "Turn dollars into crypto sent to a wallet, or crypto into dollars.", plain: "The simplest conversion product: a quote, a confirmation, and the asset moves. Three endpoints in total.", src: "on-off-ramps" },
    { id: "staking", name: "Staking", tag: "Earn", short: "Let customers earn rewards on their ETH.", plain: "Customers lock up ETH to help run the network and earn rewards. zerohash runs the validators; you set the fee you keep.", src: "staking" },
    { id: "saas", name: "Settlements as a Service", tag: "Settle", short: "Settle trades you've matched elsewhere, safely.", plain: "You agree the trade (on your venue or over the phone); zerohash moves the money and the crypto only once both sides have delivered.", src: "settlements-as-a-service" },
    { id: "token", name: "Tokenization Engine", tag: "Issue", short: "Issue your own tokens on Ethereum-compatible chains or Solana.", plain: "Mint, move and redeem a stablecoin, security or NFT, with compliance controls built in and gas fees handled for you.", src: "tokenization-engine" },
  ];
  const PRODUCT_IDS = PRODUCTS.map(p => p.id);

  /* ---- the essential questions only ---- */
  const QUESTIONS = {
    fund: [
      { id: "dir", type: "multi", title: "What do customers need to do?", opts: [["deposits","Add money (deposits)","Send stablecoins or crypto into their account."],["withdrawals","Take money out (withdrawals)","Send stablecoins or crypto to their own wallet or exchange."]], src: "fund-overview" },
      { id: "convert", type: "single", title: "When money arrives, what should the customer see?", when: a => (a.dir || []).includes("deposits"), plain: "Most platforms choose dollars: the customer never has to think about crypto, and their balance is just a number in USD.",
        opts: [["usd","Dollars","zerohash converts the deposit to USD the moment it lands (1 USDC → $1, minus a small fee)."],["crypto","The asset itself","The deposit stays as the stablecoin or crypto they sent."]], src: "sdk-index" },
      { id: "style", type: "single", title: "How do you want to build the screens?", opts: [["sdk","Use zerohash's ready-made screens","Fastest. A drop-in flow that shows the address, QR code and receipts, in your colors."],["api","Build my own screens","You call the API and design every step yourself."]], src: "fund-overview" },
      { id: "auth", type: "single", title: "Should customers be able to connect their exchange or wallet?", plain: "This is called <b>AUTH</b>. Instead of copying an address into Coinbase or MetaMask, the customer connects their account and the transfer starts from inside your app. It also adds checks on where the money came from.",
        opts: [["off","No — keep it simple","Customers send from any wallet to the address you show."],["on","Yes, add AUTH","Connect exchanges and wallets in-app."]], src: "auth" },
      TOKENS_Q, NETWORKS_Q,
    ],
    trade: [
      { id: "model", type: "multi", title: "How should trades be priced?", plain: "Start with a quote if you're unsure — it's the simpler integration and the right fit for most consumer apps.",
        opts: [["rfq","Firm quote (RFQ)","Ask for a price, show it, confirm within 30 seconds. Two API calls."],["clob","Order book (CLOB)","Place limit and market orders into a live order book. For trading platforms and high volume."]], src: "buysell" },
      { id: "tokens", type: "multi", title: "Which assets can customers trade?", selectAll: true, groups: [{ g: "Crypto", items: CRYPTO }, { g: "Stablecoins", items: [["USDC","USDC"]] }], src: "supported-instruments-1" },
    ],
    payouts: [
      { id: "type", type: "single", title: "How much do you want to manage yourself?", opts: [["single","Keep it simple","One API call per payout; zerohash handles verification and wallet linking."],["modular","Control each step","Register the recipient, link their wallet and send as separate steps — for custom screens."]], src: "payouts" },
      { id: "bene", type: "multi", title: "Who will you pay?", opts: [["individual","People","Contractors, creators, sellers."],["entity","Businesses","Companies and LLCs."]], src: "new-payouts-api-integration-guide" },
      TOKENS_Q, NETWORKS_Q,
    ],
    payins: [
      { id: "role", type: "single", title: "Who is selling?", opts: [["self","We are","Your platform sells its own goods or services."],["psp","Other businesses on our platform","You're a payment provider; each merchant is registered separately."]], src: "payins-api-integration-guide" },
      TOKENS_Q, NETWORKS_Q,
    ],
    bank: [
      { id: "model", type: "single", title: "How fast should bank deposits be usable?", plain: "Bank transfers (ACH) take 1–3 business days to settle. Faster options mean you front the money from a float balance you keep with zerohash.",
        opts: [["prefunded","When the transfer settles","Simplest; no float needed."],["ondemand","Immediately, for a purchase","The customer's buy happens as soon as the debit is approved."],["instant","Immediately, as a balance","Dollars appear in their balance right away."]], src: "funding-models" },
      { id: "rails", type: "multi", title: "Which ways should money move?", selectAll: true, opts: [["ach","ACH","In and out. 1–3 business days. Low cost."],["rtp","RTP / FedNow","Out only. Arrives in seconds, 24/7."],["wire","Wire","In and out, same day. For larger amounts."]], src: "fiat" },
    ],
    va: [
      { id: "policy", type: "single", title: "When dollars arrive, what happens?", opts: [["hold","Hold them as a balance","The customer decides later whether to buy crypto or withdraw."],["convert","Convert and send on-chain","Dollars become a stablecoin and go to a wallet you've approved for that customer."]], src: "create-a-virtual-account" },
      { id: "token", type: "single", title: "Convert into which stablecoin?", when: a => a.policy === "convert", opts: [["USDC","USDC",""],["USDT","USDT",""],["PYUSD","PayPal USD",""]], src: "create-a-virtual-account" },
      { id: "network", type: "single", title: "On which network?", when: a => a.policy === "convert", opts: [["SOL","Solana",""],["ETH","Ethereum",""],["BASE","Base",""],["POLYGON","Polygon",""]], src: "create-a-virtual-account" },
    ],
    ramps: [
      { id: "dir", type: "multi", title: "Which way should money go?", opts: [["on","Dollars → crypto (on-ramp)","Customer pays in dollars; crypto lands in their own wallet."],["off","Crypto → dollars (off-ramp)","Customer sends crypto; they get dollars."]], src: "on-off-ramps" },
      { id: "tokens", type: "multi", title: "Which assets?", selectAll: true, groups: [{ g: "Crypto", items: CRYPTO }, { g: "Stablecoins", items: [["USDC","USDC"]] }], src: "on-ramp-integration-guide" },
    ],
    staking: [
      { id: "asset", type: "single", title: "Which asset?", opts: [["ETH","Ethereum (ETH)","Available now."],["SOL","Solana (SOL)","Coming Q4 2026."]], src: "staking" },
    ],
    saas: [
      { id: "model", type: "single", title: "What's your role in the trade?", opts: [["agency","Middleman","You match a buyer and a seller and take no risk yourself."],["principal","Counterparty","You buy and sell with your own balance sheet."]], src: "settlements-as-a-service" },
      { id: "tokens", type: "multi", title: "Which assets will you settle?", selectAll: true, groups: [{ g: "Crypto", items: CRYPTO }, { g: "Stablecoins", items: [["USDC","USDC"]] }], src: "settlements-as-a-service-integration-guide" },
    ],
    token: [
      { id: "kind", type: "single", title: "What kind of token?", opts: [["fungible","A currency-like token","A stablecoin or security. Many identical units."],["nft","Unique tokens (NFTs)","Each token represents one specific asset, like a loan."]], src: "tokenization-engine" },
      { id: "chains", type: "multi", title: "On which networks?", selectAll: true, opts: [["ETH","Ethereum",""],["AVAX","Avalanche",""],["APT","Aptos",""],["ARBITRUM","Arbitrum",""],["OPTIMISM","Optimism",""],["POLYGON","Polygon",""],["CELO","Celo",""],["SOL","Solana",""]], src: "tokenization-engine" },
    ],
  };
  const PAGE_TITLES = { "fund-overview": "Account Funding", "sdk-index": "Available SDKs", "auth": "AUTH", "buysell": "Buy/Sell", "usdc-trading-pairs": "USDC Trading Pairs", "submit-and-execute-quotes": "Request and Execute Quotes", "spreads-and-fees": "Spreads and Fees", "supported-instruments-1": "Supported Instruments (RFQ)", "payouts": "Payouts", "modular-payouts": "Modular Payouts", "new-payouts-api-integration-guide": "Single API Call Payouts guide", "payins-api-integration-guide": "Payins API guide", "payins-integration-guide": "Payins SDK guide", "funding-models": "Funding Models", "bank-account-linking": "Bank Account Linking", "fiat": "Bank Rails", "create-a-virtual-account": "Create and Use Virtual Accounts", "on-off-ramps": "On & Off Ramps", "off-ramp-integration-guide": "Off Ramp guide", "on-ramp-integration-guide": "On Ramp guide", "staking": "Staking", "settlements-as-a-service": "Settlements as a Service", "settlements-as-a-service-integration-guide": "Settlements as a Service guide", "tokenization-engine": "Tokenization Engine", "account-setup-1": "Account Setup & Funding Models" };

  /* ---------------- state ---------------- */
  const KEY = "zh-wizard-v3";
  const DEFAULT = { region: "us", customers: ["individuals"], kyc: "sdk", products: [], answers: {}, step: 0 };
  let S = load();
  function load() { try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign({}, DEFAULT, JSON.parse(raw)); } catch (e) {} return JSON.parse(JSON.stringify(DEFAULT)); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  const ans = (pid) => S.answers[pid] || (S.answers[pid] = {});
  const host = () => REGIONS[S.region].cert;
  const optItems = (q) => q.groups ? q.groups.flatMap(g => g.items.map(([v]) => v)) : q.opts.map(([v]) => v);

  function stepList() {
    const list = [{ id: "products", label: "Products", meta: S.products.length ? `${S.products.length} selected` : "Pick one or more" }, { id: "basics", label: "About you", meta: "Region, customers, verification" }];
    for (const pid of PRODUCT_IDS.filter(id => S.products.includes(id))) list.push({ id: "p:" + pid, label: PRODUCTS.find(p => p.id === pid).name, meta: "A few choices" });
    list.push({ id: "guide", label: "Your guide", meta: "Steps and code" });
    return list;
  }
  const visibleQuestions = (pid) => { const a = ans(pid); return QUESTIONS[pid].filter(q => !q.when || q.when(a)); };
  const productComplete = (pid) => { const a = ans(pid); return visibleQuestions(pid).every(q => q.type === "multi" ? (a[q.id] && a[q.id].length) : a[q.id] !== undefined); };
  function stepComplete(i) { const st = stepList()[i]; if (!st) return false; if (st.id === "basics") return S.customers.length > 0; if (st.id === "products") return S.products.length > 0; if (st.id.startsWith("p:")) return productComplete(st.id.slice(2)); return false; }
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
    save(); window.scrollTo({ top: 0 });
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
    for (const [val, t, d] of opts) {
      const c = el(`<button type="button" class="card single ${current === val ? "on" : ""}" role="radio" aria-checked="${current === val}"><div class="t">${esc(t)}</div>${d ? `<div class="d">${esc(d)}</div>` : ""}</button>`);
      c.onclick = () => onPick(val); box.append(c);
    }
    return box;
  }
  function multiCards(opts, selected, onChange) {
    const box = el(`<div class="cards"></div>`);
    for (const [val, t, d] of opts) {
      const on = selected.includes(val);
      const c = el(`<button type="button" class="card multi ${on ? "on" : ""}" role="checkbox" aria-checked="${on}"><span class="check"></span><div class="t">${esc(t)}</div>${d ? `<div class="d">${esc(d)}</div>` : ""}</button>`);
      c.onclick = () => onChange(on ? selected.filter(x => x !== val) : [...selected, val]); box.append(c);
    }
    return box;
  }
  function chipGroups(q, selected, onChange) {
    const wrap = el(`<div></div>`);
    const all = optItems(q), allOn = all.every(v => selected.includes(v));
    if (q.selectAll) {
      const sa = el(`<button type="button" class="chip select-all ${allOn ? "on" : ""}" aria-pressed="${allOn}">${allOn ? "Clear all" : "Select all"}</button>`);
      sa.onclick = () => onChange(allOn ? [] : all.slice());
      const saGroup = el(`<div class="chip-group"><div class="chips"></div></div>`);
      saGroup.querySelector(".chips").append(sa);
      wrap.append(saGroup);
    }
    for (const g of q.groups) {
      const grp = el(`<div class="chip-group"><p class="g">${esc(g.g)}</p><div class="chips"></div></div>`);
      for (const [sym, label] of g.items) {
        const on = selected.includes(sym);
        const ch = el(`<button type="button" class="chip ${on ? "on" : ""}" aria-pressed="${on}">${esc(label)}${label !== sym ? `<span class="sym">${esc(sym)}</span>` : ""}</button>`);
        ch.onclick = () => onChange(on ? selected.filter(x => x !== sym) : [...selected, sym]);
        grp.querySelector(".chips").append(ch);
      }
      wrap.append(grp);
    }
    return wrap;
  }

  function viewProducts() {
    const v = el(`<section><p class="eyebrow">Step 1 · Products</p><p class="h1">Select one or multiple products you want to integrate</p><p class="lede">zerohash is the regulated plumbing behind crypto and stablecoin features: custody, compliance, liquidity and settlement. You pick what you want to offer your customers; this guide shows you what to build, in plain language, with the code ready when you need it.</p><div class="cards" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))"></div></section>`);
    const box = v.querySelector(".cards");
    for (const p of PRODUCTS) {
      const on = S.products.includes(p.id);
      const c = el(`<button type="button" class="card multi ${on ? "on" : ""}" role="checkbox" aria-checked="${on}"><span class="check"></span><div class="t">${esc(p.name)}</div><div class="d">${esc(p.short)}</div></button>`);
      c.onclick = () => { S.products = on ? S.products.filter(x => x !== p.id) : [...S.products, p.id]; render(); };
      box.append(c);
    }
    return v;
  }

  function viewBasics() {
    const v = el(`<section>
      <p class="eyebrow">Step 2 · About you</p>
      <p class="h1">Three quick questions about your platform</p>
      <p class="lede">These decide which zerohash entity you work with and how your customers get verified. Everything else has sensible defaults.</p>
      <div class="q"><p class="h2">Where are you based?</p><div class="body"></div></div>
      <div class="q"><p class="h2">Who are your customers?</p><p class="q-help">Pick both if you serve both.</p><div class="body"></div></div>
      <div class="q"><p class="h2">Who verifies your customers' identity (KYC)?</p><p class="q-help">Every customer must be identity-checked before they can transact. Most platforms let zerohash do it.</p><div class="body"></div></div>
    </section>`);
    const bodies = v.querySelectorAll(".body");
    bodies[0].replaceWith(singleCards([["us","United States","zerohash LLC"],["eu","European Union","zerohash europe B.V., licensed by the Dutch AFM"]], S.region, (val) => { S.region = val; render(); }));
    bodies[1].replaceWith(multiCards([["individuals","People",""],["businesses","Businesses",""]], S.customers, (sel) => { S.customers = sel; render(); }));
    bodies[2].replaceWith(singleCards([["sdk","zerohash does it","A ready-made verification screen you drop into your app. zerohash handles the checks and any manual review."],["api","We already verify customers","You pass zerohash the results. Needs approval from zerohash."]], S.kyc, (val) => { S.kyc = val; render(); }));
    return v;
  }

  function viewProduct(pid) {
    const p = PRODUCTS.find(x => x.id === pid), a = ans(pid);
    const v = el(`<section><p class="eyebrow">Step ${S.step + 1}</p><p class="h1">${esc(p.name)}</p><p class="lede">${esc(p.plain)}</p><div class="qs"></div></section>`);
    const qs = v.querySelector(".qs");
    for (const q of visibleQuestions(pid)) {
      const w = el(`<div class="q"><p class="h2">${esc(q.title)}</p>${q.plain ? `<p class="q-help">${q.plain}</p>` : ""}${q.help ? `<p class="q-help">${esc(q.help)}</p>` : ""}<div class="body"></div></div>`);
      const body = w.querySelector(".body");
      const set = (val) => { a[q.id] = val; render(); };
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
    if (S.products.includes("fund") && (ans("fund").dir || []).includes("deposits") && ans("fund").convert === "usd") l.push({ type: "fund_auto_convert", region: S.region, signed_timestamp: 1712008721000 });
    if (S.products.includes("staking")) l.push({ type: "staking", region: S.region, signed_timestamp: 1712008721000 });
    if (S.products.includes("payins")) l.push({ type: "ACCOUNT_FUNDING_PAY", region: S.region, signed_timestamp: 1712008721000 });
    if (!l.length) l.push({ type: "user_agreement", region: S.region, signed_timestamp: 1712008721000 });
    return l;
  }
  const customerPayload = () => ({ first_name: "John", last_name: "Smith", email: "jsmith@example.com", phone_number: "9545551234", address_one: "1 Main St.", address_two: "Suite 1000", city: "Chicago", state: "IL", zip: "12345", country: "United States", date_of_birth: "1985-09-02", citizenship: "United States", tax_id: "123456789", risk_rating: "low", kyc: "pass", kyc_timestamp: 1630623005000, sanction_screening: "pass", sanction_screening_timestamp: 1630623005000, idv: "pass", liveness_check: "pass", signed_timestamp: 1630623005000, metadata: {}, signed_agreements: signedAgreements() });
  const entityPayload = () => ({ request_id: "a1b2c3d4-5678-90ab-cdef-1234567890ab", platform_code: "PLAT01", legal_name: "Entity A", contact_number: "15553765432", address_one: "1 Main St.", address_two: "Suite 1000", city: "Chicago", postal_code: "12345", jurisdiction_code: "US-IL", tax_id: "883987654", id_issuing_authority: "United States", sanction_screening: "pass", sanction_screening_timestamp: 1603378501286, signed_agreements: signedAgreements() });
  const sdkSnippet = (R, module, comment) => `import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';\n\nconst sdk = new ZeroHashSDK({\n  zeroHashAppsURL: '${R.sdk}',\n  env: 'cert',        // 'cert' | 'prod'\n  theme: 'auto',      // 'light' | 'dark' | 'auto'\n});\n\n// jwt = the access token your server minted with POST /client_auth_token\nsdk.openModal({ appIdentifier: AppIdentifier.${module}, jwt });${comment ? `\n// ${comment}` : ""}`;

  function buildGuide() {
    const R = REGIONS[S.region], h = host(), phases = [];
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
    for (const pid of PRODUCT_IDS.filter(id => S.products.includes(id))) { const ph = PRODUCT_PHASE[pid](ans(pid), { h, R, link, ref }); ph.eyebrow = `Phase ${n++}`; phases.push(ph); }
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

  function viewGuide() {
    const phases = buildGuide(), R = REGIONS[S.region];
    const v = el(`<section>
      <div class="guide-head"><div><p class="eyebrow">Your guide</p><p class="h1">Here's what to build</p></div><button type="button" class="btn small copymd">Copy as Markdown</button></div>
      <p class="lede">${phases.length} phases, in the order you'll do them. Read the steps first; the code is there when you're ready — tap <b>Show code</b>. Where zerohash needs to set something up for you, the step says so.</p>
      <div class="summary"></div><div class="phases"></div></section>`);
    const sum = v.querySelector(".summary");
    [["Region", R.name], ["Sandbox", host().replace("https://", "")], ["Verification", S.kyc === "sdk" ? "by zerohash" : "your own"], ...S.products.map(p => ["Product", PRODUCTS.find(x => x.id === p).name])].forEach(([k, val]) => sum.append(el(`<span class="pill">${esc(k)} <b>${esc(val)}</b></span>`)));
    const box = v.querySelector(".phases");
    phases.forEach((ph) => {
      const sec = el(`<section class="phase"><p class="phase-eyebrow">${esc(ph.eyebrow)}</p><p class="h2">${esc(ph.title)}</p>${ph.intro ? `<p class="intro">${ph.intro}</p>` : ""}</section>`);
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
    v.querySelector(".copymd").onclick = () => copy(toMarkdown(phases), "Guide copied as Markdown");
    return v;
  }
  function toMarkdown(phases) {
    const strip = (h) => h.replace(/<br\s*\/?>/g, "\n").replace(/<li>/g, "\n- ").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\n{3,}/g, "\n\n").trim();
    let md = `# zerohash setup guide\n\nRegion: ${REGIONS[S.region].name} · Sandbox: ${host()}\nProducts: ${S.products.map(p => PRODUCTS.find(x => x.id === p).name).join(", ")}\n\n`;
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

  /* ---------------- landing page: "Generate custom guide" mode ---------------- */
  function mountLanding() {
    const sec = document.querySelector(".zh-products");
    if (!sec || sec.dataset.mounted) return;
    sec.dataset.mounted = "1";
    const toggle = sec.querySelector(".zh-guide-toggle"), cancel = sec.querySelector(".zh-guide-cancel"), cards = [...sec.querySelectorAll(".zh-card[data-product]")];
    const selected = new Set();
    const sync = () => {
      cards.forEach(c => c.classList.toggle("on", selected.has(c.dataset.product)));
      if (sec.classList.contains("is-select")) { toggle.textContent = selected.size ? `Continue with ${selected.size} product${selected.size > 1 ? "s" : ""} →` : "Select products to continue"; toggle.disabled = selected.size === 0; }
      else { toggle.textContent = "Generate custom guide"; toggle.disabled = false; }
    };
    toggle.addEventListener("click", () => { if (!sec.classList.contains("is-select")) { sec.classList.add("is-select"); sync(); return; } if (selected.size) location.href = `/setup-wizard?products=${[...selected].join(",")}`; });
    cancel && cancel.addEventListener("click", () => { sec.classList.remove("is-select"); selected.clear(); sync(); });
    cards.forEach(c => c.addEventListener("click", (e) => { if (!sec.classList.contains("is-select")) return; e.preventDefault(); selected.has(c.dataset.product) ? selected.delete(c.dataset.product) : selected.add(c.dataset.product); c.setAttribute("aria-pressed", selected.has(c.dataset.product)); sync(); }));
    sync();
  }

  const boot = () => { mountWizard(); mountLanding(); };
  boot();
  new MutationObserver(boot).observe(document.documentElement, { childList: true, subtree: true });
})();
