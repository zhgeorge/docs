/* zerohash docs — setup wizard (/setup-wizard) and the landing page's "Generate custom guide" mode.
   Mintlify injects this file on every page; it only acts when its elements are present.
   Every direction and payload below is drawn from the guides in docs/ — each section links to its source. */
(function () {
  if (window.__zhWizardBooted) return;
  window.__zhWizardBooted = true;

  const DOCS = "/docs/";
  const REF = "https://docs.zerohash.com/reference/";
  const REGIONS = {
    us: { name: "United States", entity: "zerohash LLC", cert: "https://api.cert.zerohash.com", prod: "https://api.zerohash.com", sdk: "https://web-sdk.zerohash.com", portalCert: "https://portal.cert.zerohash.com", portalProd: "https://portal.zerohash.com" },
    eu: { name: "European Union", entity: "zerohash europe B.V. (licensed by the Dutch AFM)", cert: "https://api.cert.zerohash.eu", prod: "https://api.zerohash.eu", sdk: "https://web-sdk.zerohash.eu", portalCert: "https://portal.cert.zerohash.eu", portalProd: "https://portal.zerohash.eu" },
  };
  const STABLES = [
    { g: "USDC", items: [["USDC.BASE","USDC on Base"],["USDC.ETH","USDC on Ethereum"],["USDC.SOL","USDC on Solana"],["USDC.POLYGON","USDC on Polygon"],["USDC.ARBITRUM","USDC on Arbitrum"],["USDC.OPTIMISM","USDC on Optimism"],["USDC.AVAX","USDC on Avalanche"],["USDC.BSC","USDC on BNB Chain"],["USDC.XLM","USDC on Stellar"],["USDC.SUI","USDC on Sui"]] },
    { g: "Other stablecoins", items: [["USDT.TRX","USDT on Tron"],["USDT.ARBITRUM","USDT on Arbitrum"],["USDT.OPTIMISM","USDT on Optimism"],["USDT.BSC","USDT on BNB Chain"],["PYUSD.ETH","PayPal USD on Ethereum"],["PYUSD.SOL","PayPal USD on Solana"],["EURC.ETH","EURC on Ethereum"]] },
    { g: "Crypto", items: [["BTC","Bitcoin"],["ETH","Ethereum"],["SOL","Solana"],["XRP","XRP"],["DOGE","Dogecoin"],["ADA","Cardano"],["AVAX","Avalanche"],["LTC","Litecoin"]] },
  ];

  const PRODUCTS = [
    { id: "fund", name: "Account Funding", tag: "Transact", short: "Let customers top up their balance with stablecoins or crypto — and, if you want, turn it into U.S. dollars automatically.",
      plain: "Your customer sends USDC (or another asset) from their wallet or exchange to an address you show them. zerohash sees it land on-chain and, if you choose, converts it to dollars right away so their balance updates instantly. It sits next to card, wire and ACH as one more way to fund an account. Available for US and EU platforms.", src: "fund-overview" },
    { id: "trade", name: "Buy / Sell", tag: "Trade", short: "Offer crypto buying and selling with pricing from top market makers.",
      plain: "zerohash gives you one place to buy and sell crypto for your customers. You can ask for a firm price and accept it (Request For Quote), or place orders into an order book (CLOB). zerohash handles the liquidity relationships, so you don't have to.", src: "buysell" },
    { id: "payouts", name: "Payouts", tag: "Transact", short: "Send stablecoins or crypto to people's own wallets — contractors, sellers, creators — anywhere, any time.",
      plain: "Instead of a bank transfer that takes days, you pay someone in USDC (or another asset) straight to their wallet in minutes, 24/7. Works for gig payouts, marketplace sellers, cross-border payroll and affiliate payments.", src: "payouts" },
    { id: "payins", name: "Payins", tag: "Transact", short: "Accept stablecoin and crypto payments at checkout.",
      plain: "A shopper pays for something in your app using USDC or crypto from their wallet. zerohash gives you a deposit address and a locked-in dollar amount, then tells you when the payment lands. You can be the merchant yourself, or onboard other merchants if you're a payment provider.", src: "payins-api-integration-guide" },
    { id: "bank", name: "Bank Rails (ACH + RTP)", tag: "Transact", short: "Move U.S. dollars in and out of customer bank accounts to buy, sell or cash out.",
      plain: "Connect a customer's bank account (through Plaid) and pull dollars in via ACH to buy crypto, or push dollars out via ACH, RTP or FedNow when they sell. You choose how quickly funds become usable, which decides whether you need a float balance.", src: "fiat" },
    { id: "va", name: "Virtual Accounts", tag: "Transact", short: "Give each customer their own account and routing number for incoming dollars.",
      plain: "Each customer gets a real U.S. account and routing number in their own name. They (or their employer) can push money to it by ACH, wire, RTP or FedNow. When it arrives, zerohash either holds the dollars or converts them to a stablecoin and sends them to a wallet you've whitelisted.", src: "virtual-accounts" },
    { id: "ramps", name: "On & Off Ramps", tag: "Transact", short: "Turn dollars into crypto delivered to an external wallet, or crypto into dollars.",
      plain: "An on-ramp lets a customer buy crypto with dollars and have it sent straight to their own wallet. An off-ramp is the reverse: they deposit crypto and you convert it to dollars. Just three endpoints are needed; you can price in a spread or a flat fee.", src: "on-off-ramps" },
    { id: "staking", name: "Staking", tag: "Trade", short: "Let customers earn rewards on ETH by staking through zerohash-run validators.",
      plain: "Customers lock up ETH to help run the network and earn rewards. zerohash operates the validators and handles the queueing, so your users start earning without the usual new-validator wait. You set the fee you keep from rewards. API only today.", src: "staking" },
    { id: "saas", name: "Settlements as a Service", tag: "Trade", short: "Settle trades executed elsewhere — OTC deals, swaps, on-ramps — with delivery-versus-payment finality.",
      plain: "You match the trade (on your venue, by phone, wherever). zerohash then moves the money and the crypto only once both sides have delivered, under its own licenses, so neither counterparty is exposed to the other.", src: "settlements-as-a-service" },
    { id: "token", name: "Tokenization Engine", tag: "Tokenize", short: "Mint, move and redeem tokens that represent real-world assets on Ethereum-compatible chains or Solana.",
      plain: "Issue your own fungible token (a stablecoin or security) or NFTs, with compliance controls like pause, freeze and lawful-order enforcement built in. zerohash abstracts the gas fees and runs the smart contracts across 7 EVM networks and Solana.", src: "tokenization-engine" },
  ];
  const PRODUCT_IDS = PRODUCTS.map(p => p.id);

  const QUESTIONS = {
    fund: [
      { id: "dir", type: "single", title: "Which direction of money movement do you need?", help: "You can add the other direction later — they are separate integrations.",
        opts: [["deposits","Deposits only","Customers put stablecoins or crypto into their account."],["withdrawals","Withdrawals only","Customers take money out to their wallet or exchange."],["both","Deposits and withdrawals",""]] },
      { id: "convert", type: "single", title: "When a deposit arrives, what should happen to it?", when: s => s.dir !== "withdrawals",
        plain: "<b>Convert to dollars</b> means the moment 100 USDC lands, zerohash sells it 1:1 for USD (less fees) and credits a dollar balance — the customer never holds crypto. <b>Keep it as crypto</b> means the USDC stays USDC in their account, for platforms where customers trade or hold assets.",
        opts: [["usd","Convert it to U.S. dollars","The Account Funding product. Deposits auto-convert to USD."],["crypto","Keep it as crypto","Crypto Deposits: the asset stays in its original form."]], src: "sdk-index" },
      { id: "ledger", type: "single", title: "Where should the converted dollars land?", when: s => s.dir !== "withdrawals" && s.convert === "usd",
        plain: "This is a platform-level configuration zerohash sets for you.",
        opts: [["sweep","Swept to my platform's account (Option 1)","The USD moves from the customer's ledger to yours automatically, and zerohash wires you the day's total once a day. Recommended, and required if you use the SDK."],["customer","Stays in the customer's account (Option 2)","USD sits in the customer's zerohash account; you initiate fiat withdrawals from it yourself. Not recommended with the SDK."]], src: "fund-overview" },
      { id: "fee", type: "single", title: "Who pays the conversion fee?", when: s => s.dir !== "withdrawals" && s.convert === "usd",
        opts: [["platform","My platform","The customer isn't charged on conversion (stablecoin issuer fees may still apply)."],["customer","The customer","The fee is taken out of the deposit when it converts."]], src: "fund-overview" },
      { id: "style", type: "single", title: "How do you want to build the customer experience?",
        plain: "The <b>SDK</b> is a drop-in screen zerohash hosts (web, iOS, Android) that shows the deposit address, QR code, agreements and receipts for you. The <b>API</b> gives you the raw deposit address so you design every screen yourself. Withdrawals are SDK-based in the docs.",
        opts: [["sdk","Use the zerohash SDK","Fastest. Handles agreements, disclosures and receipts. Customizable colors and fonts."],["api","Use the API and build my own UI","Full control; you show the address and handle the flow."]], src: "fund-overview" },
      { id: "auth", type: "single", title: "Do you want AUTH?",
        plain: "<b>AUTH</b> lets a customer connect their exchange account (Gemini, Robinhood…) or wallet (MetaMask, Phantom…) from inside your app, so the transfer starts with a tap instead of copying an address around. It also adds compliance checks on where the money came from. Without it, customers send from any wallet to the address you show — the classic transfer.",
        opts: [["off","No AUTH — classic transfers","Customers send from any wallet to a deposit address. Simplest."],["lite","AUTH Lite","Connectivity to exchanges and wallets, without matching the account owner's name."],["validate","AUTH Validate","Connectivity plus name matching between the KYC'd customer and the external account — for compliance-driven setups."]], src: "auth" },
      { id: "assets", type: "multi", title: "Which assets and networks will you accept?", help: "Asset symbols on zerohash are network-qualified, e.g. USDC.BASE. Account Funding supports all major stablecoins and 50+ other assets. Pick at least one.", groups: STABLES, src: "fund-overview" },
    ],
    trade: [
      { id: "model", type: "single", title: "Which execution model fits your product?",
        plain: "<b>RFQ</b>: you ask \"what's the price for 500 USDC?\", get a firm quote good for 5 or 30 seconds, and accept it — simple, fixed pricing, great for retail buy/sell. <b>CLOB</b>: you place limit and market orders into an order book matched by price and time — for trading platforms and high volume, connected over FIX.",
        opts: [["rfq","Request For Quote (RFQ)","REST API, two calls: get a quote, execute it. Best for retail apps and simple buy/sell."],["clob","Central Limit Order Book (CLOB)","FIX 5.0 and REST. Order types and time-in-force. Best for trading platforms and high volume."],["both","Both",""]], src: "buysell" },
      { id: "liq", type: "single", title: "Whose dollars fund a customer's buy?",
        plain: "In the <b>Float account model</b> you keep customer dollar balances on your own books; zerohash fronts trades from a float you keep topped up and you settle the net once a day. In the <b>Customer pre-funded model</b> each customer's dollars live on the zerohash ledger and their own balance is checked before a trade.",
        opts: [["float","Float account model","Customers' USD is on your ledger. Buys are pre-funded from your float; daily settlement replenishes it."],["prefunded","Customer pre-funded model","Customers' USD balances are on the zerohash ledger; credit checks run against each customer's account."]], src: "account-setup-1" },
      { id: "quote", type: "single", title: "Quote trades in dollars or in USDC?", when: s => s.model !== "clob",
        plain: "With <b>USDC-quoted pairs</b> a customer holding USDC can buy BTC straight from that balance — no USDC→USD conversion step and no doubled fees.",
        opts: [["USD","U.S. dollars (USD)","Standard pairs like BTC/USD."],["USDC.ETH","USDC on Ethereum (USDC.ETH)","Quotes, trades and balances all in USDC. 16 instruments at launch, US only."]], src: "usdc-trading-pairs" },
      { id: "expiry", type: "single", title: "How long should a quote stay valid?", when: s => s.model !== "clob", opts: [["5s","5 seconds",""],["30s","30 seconds",""]], src: "submit-and-execute-quotes" },
      { id: "spread", type: "fields", title: "Your markup on each trade", when: s => s.model !== "clob", help: "Fees are collected by widening the quoted price by a spread in basis points (100 bps = 1%), so customers see one all-in price. You can also send a custom spread per request.", fields: [["bps","Spread (basis points)","25"]], src: "spreads-and-fees" },
      { id: "assets", type: "multi", title: "Which assets will customers trade?", help: "Query GET /assets for anything with rfq_liquidity_enabled = true. A few common ones:", groups: [{ g: "Crypto", items: [["BTC","Bitcoin"],["ETH","Ethereum"],["SOL","Solana"],["XRP","XRP"],["DOGE","Dogecoin"],["ADA","Cardano"],["AVAX","Avalanche"],["USDC.ETH","USDC on Ethereum"]] }], src: "supported-instruments-1" },
    ],
    payouts: [
      { id: "type", type: "single", title: "How much of the payout flow do you want to control?",
        plain: "<b>Modular</b> is four steps you drive one at a time — register the payer, register the recipient, link their wallet, send — so you can build your own screens and keep state. <b>Single API call</b> is two steps: register the payer once, then one call per payout with everything inside; zerohash does the rest.",
        opts: [["single","Single API Call Payouts","One call per payout, recipient details inline. Stateless. Good for licensed institutions and simple flows."],["modular","Modular Payouts","Four explicit steps with full transparency. API, SDK or no-code options."]], src: "payouts" },
      { id: "how", type: "single", title: "Modular Payouts — how will you integrate?", when: s => s.type === "modular", opts: [["api","API","Own every screen."],["sdk","SDK","Drop-in payout screens hosted by zerohash."],["nocode","No-code","Operate payouts with zero engineering."]], src: "modular-payouts" },
      { id: "bene", type: "single", title: "Who receives the payouts?", opts: [["individual","Individuals","Contractors, creators, sellers."],["entity","Businesses","Companies and LLCs."],["both","Both",""]], src: "new-payouts-api-integration-guide" },
      { id: "assets", type: "multi", title: "Which assets will you pay out in?", help: "USDC is supported across 15 networks, USDT across 4, plus PYUSD, RLUSD, Bitcoin, Ethereum, Solana and 30+ more. Payouts reach the US, most of the EU and other supported regions.", groups: STABLES, src: "payouts" },
    ],
    payins: [
      { id: "role", type: "single", title: "Who is the merchant?", plain: "If you sell your own goods, you are the merchant. If you're a payment provider serving other businesses, you onboard each merchant and pass its code with every payment.",
        opts: [["self","My platform is the merchant",""],["psp","I serve other merchants (PSP)","Onboard merchants as business participants; include merchant_participant_code on each quote."]], src: "payins-api-integration-guide" },
      { id: "style", type: "single", title: "How will shoppers pay?", opts: [["api","API — I build the checkout screen","You show the deposit address and amount from the quote."],["sdk","SDK — zerohash hosts the payment screen","Shopper accepts terms, picks asset and network, and pays inside a drop-in flow."]], src: "payins-integration-guide" },
      { id: "assets", type: "multi", title: "Which assets can shoppers pay with?", groups: STABLES, src: "payins-api-integration-guide" },
    ],
    bank: [
      { id: "model", type: "single", title: "How quickly should ACH money become usable?",
        plain: "ACH takes 1–3 business days to actually settle and can be reversed. <b>Pre-funded</b> waits for that (no float needed). <b>On-demand</b> lets the trade happen the instant the debit is approved, fronted by a float you maintain. <b>Instant USD</b> credits the dollar balance immediately, also fronted by your float. All three require a loss reserve for ACH returns.",
        opts: [["prefunded","Pre-funded","Customers fund first; trade after settlement plus a short hold. No float. Works with RFQ (not CLOB)."],["ondemand","On-demand","Trades execute when the ACH debit is approved. Needs a float. Works with CLOB and RFQ Direct."],["instant","Instant USD","USD balance credited on debit approval; trade before settlement. Needs a float. Works with CLOB and RFQ Direct."]], src: "funding-models" },
      { id: "plaid", type: "single", title: "How will customers link their bank account?", plain: "Bank linking runs on Plaid either way. The question is whether you already have a Plaid contract.",
        opts: [["reseller","zerohash-powered Plaid Link","No Plaid contract of your own; zerohash handles Plaid onboarding and customers link through the zerohash SDK. The simpler path."],["processor","Self-service Plaid Link","You contract with Plaid directly (Auth, Balance, Identity, Identity Match), run Plaid Link yourself and hand zerohash a processor token."]], src: "bank-account-linking" },
      { id: "rails", type: "multi", title: "Which rails do you need?", groups: [{ g: "US rails", items: [["ach","ACH — debit & credit, 1–3 business days"],["rtp","RTP / FedNow — instant payouts, 24/7"],["wire","FedWire — same-day, higher value"]] }], src: "fiat" },
    ],
    va: [
      { id: "policy", type: "single", title: "What should happen when money arrives in a virtual account?",
        opts: [["convert","Convert it and send it on-chain (AUTO_CONVERT_AND_WITHDRAW)","Dollars auto-convert to a stablecoin or crypto and go to a wallet you've whitelisted for that customer."],["hold","Hold the dollars (HOLD)","USD is credited and sits in the account until the customer buys crypto or withdraws."]], src: "create-a-virtual-account" },
      { id: "asset", type: "multi", title: "Convert into which asset?", when: s => s.policy === "convert", max: 1, groups: [{ g: "Stablecoins", items: [["USDC","USDC"],["USDT","USDT"],["PYUSD","PayPal USD"]] }], src: "create-a-virtual-account" },
      { id: "network", type: "single", title: "…on which network?", when: s => s.policy === "convert", opts: [["SOL","Solana",""],["ETH","Ethereum",""],["BASE","Base",""],["POLYGON","Polygon",""]], src: "create-a-virtual-account" },
    ],
    ramps: [
      { id: "dir", type: "single", title: "Which way?", opts: [["on","On-ramp: dollars → crypto to a wallet",""],["off","Off-ramp: crypto → dollars",""],["both","Both",""]], src: "on-off-ramps" },
      { id: "expiry", type: "single", title: "How long should a quote stay valid?", help: "zerohash supports 5 s, 30 s, 1, 5 and 15 minutes. 30 seconds is typical for on-ramps.", opts: [["5s","5 seconds",""],["30s","30 seconds",""],["1m","1 minute",""],["5m","5 minutes",""],["15m","15 minutes",""]], src: "on-off-ramps" },
      { id: "money", type: "single", title: "How will you earn on each conversion?", opts: [["spread","A spread","A percentage baked into the price; zerohash pre-configures it."],["fee","An explicit fee","A flat amount sent in the fees object on the quote."],["both","Both",""]], src: "off-ramp-integration-guide" },
      { id: "assets", type: "multi", title: "Which assets?", groups: [{ g: "Crypto", items: [["BTC","Bitcoin"],["ETH","Ethereum"],["SOL","Solana"],["USDC.ETH","USDC on Ethereum"],["USDC.SOL","USDC on Solana"],["USDC.BASE","USDC on Base"]] }], src: "on-ramp-integration-guide" },
    ],
    staking: [
      { id: "asset", type: "single", title: "Which asset?", help: "ETH is live today. SOL is slated for Q4 2026.", opts: [["ETH","Ethereum (ETH)",""],["SOL","Solana (SOL) — coming Q4 2026",""]], src: "staking" },
      { id: "fee", type: "fields", title: "Your platform fee on rewards", help: "Rewards are shown to users net of your fee. zerohash recommends 25–35% (users keep 65–75%).", fields: [["pct","Platform fee (%)","30"]], src: "staking" },
    ],
    saas: [
      { id: "model", type: "single", title: "Which role do you play in the trade?", opts: [["agency","Agency / broker-exchange","You match counterparties and take no principal risk."],["principal","Principal dealer","You are the counterparty to every trade, buying and selling as principal."]], src: "settlements-as-a-service" },
      { id: "assets", type: "multi", title: "Which assets will you settle?", groups: [{ g: "Crypto", items: [["BTC","Bitcoin"],["ETH","Ethereum"],["SOL","Solana"],["USDC.ETH","USDC on Ethereum"]] }], src: "settlements-as-a-service-integration-guide" },
    ],
    token: [
      { id: "kind", type: "single", title: "What kind of token?", opts: [["fungible","Fungible token","A stablecoin or security: minted many times, 6 decimals typical, token ID 0."],["nft","Non-fungible token","Unique assets like loans: each ID minted once, amount 1, linked to an off-chain identifier."]], src: "tokenization-engine" },
      { id: "chains", type: "multi", title: "Which networks?", groups: [{ g: "Supported", items: [["ETH","Ethereum"],["AVAX","Avalanche"],["APT","Aptos"],["ARBITRUM","Arbitrum"],["OPTIMISM","Optimism"],["POLYGON","Polygon"],["CELO","Celo"],["SOL","Solana"]] }], src: "tokenization-engine" },
    ],
  };
  const PAGE_TITLES = { "fund-overview": "Account Funding", "sdk-index": "Available SDKs", "auth": "AUTH", "buysell": "Buy/Sell", "account-setup-1": "Account Setup & Funding Models", "usdc-trading-pairs": "USDC Trading Pairs", "submit-and-execute-quotes": "Request and Execute Quotes", "spreads-and-fees": "Spreads and Fees", "supported-instruments-1": "Supported Instruments (RFQ)", "payouts": "Payouts", "modular-payouts": "Modular Payouts", "new-payouts-api-integration-guide": "Single API Call Payouts guide", "payins-api-integration-guide": "Payins API guide", "payins-integration-guide": "Payins SDK guide", "funding-models": "Funding Models", "bank-account-linking": "Bank Account Linking", "fiat": "Bank Rails", "create-a-virtual-account": "Create and Use Virtual Accounts", "on-off-ramps": "On & Off Ramps", "off-ramp-integration-guide": "Off Ramp guide", "on-ramp-integration-guide": "On Ramp guide", "staking": "Staking", "settlements-as-a-service": "Settlements as a Service", "settlements-as-a-service-integration-guide": "Settlements as a Service guide", "tokenization-engine": "Tokenization Engine" };

  /* ---------------- state ---------------- */
  const KEY = "zh-wizard-v2";
  const DEFAULT = { region: "us", customers: "individuals", kyc: "sdk", products: [], answers: {}, step: 0 };
  let S = load();
  function load() { try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign({}, DEFAULT, JSON.parse(raw)); } catch (e) {} return JSON.parse(JSON.stringify(DEFAULT)); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  const ans = (pid) => S.answers[pid] || (S.answers[pid] = {});
  const host = () => REGIONS[S.region].cert;

  function stepList() {
    const list = [{ id: "products", label: "Products", meta: S.products.length ? `${S.products.length} selected` : "Pick one or more" }, { id: "basics", label: "Basics", meta: "Region, customers, KYC" }];
    for (const pid of PRODUCT_IDS.filter(id => S.products.includes(id))) list.push({ id: "p:" + pid, label: PRODUCTS.find(p => p.id === pid).name, meta: "Customize" });
    list.push({ id: "guide", label: "Your setup guide", meta: "Directions and code" });
    return list;
  }
  const visibleQuestions = (pid) => { const a = ans(pid); return QUESTIONS[pid].filter(q => !q.when || q.when(a)); };
  const productComplete = (pid) => { const a = ans(pid); return visibleQuestions(pid).every(q => q.type === "fields" || (q.type === "multi" ? (a[q.id] && a[q.id].length) : a[q.id] !== undefined)); };
  function stepComplete(i) { const st = stepList()[i]; if (!st) return false; if (st.id === "basics") return true; if (st.id === "products") return S.products.length > 0; if (st.id.startsWith("p:")) return productComplete(st.id.slice(2)); return false; }
  function canGo(i) { for (let k = 0; k < i; k++) if (!stepComplete(k)) return false; return true; }

  /* ---------------- helpers ---------------- */
  const el = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstElementChild; };
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const srcLink = (slug, label) => `<p class="src">Source: <a href="${DOCS}${slug}">${esc(label || PAGE_TITLES[slug] || slug)}</a></p>`;
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
    const wrap = el(`<div class="navbar"><button type="button" class="btn ghost" ${S.step === 0 ? "disabled" : ""}>← Back</button><span class="hint"></span><button type="button" class="btn primary">${last ? "Start over" : (S.step === steps.length - 2 ? "Generate my guide →" : "Continue →")}</button></div>`);
    const [back, hint, next] = wrap.children;
    back.onclick = () => { S.step--; render(); };
    if (!last && !stepComplete(S.step)) { next.disabled = true; hint.textContent = steps[S.step].id === "products" ? "Choose at least one product to continue." : "Answer each question to continue."; }
    next.onclick = () => { if (last) { if (confirm("Clear all your choices and start over?")) { S = JSON.parse(JSON.stringify(DEFAULT)); render(); } } else { S.step++; render(); } };
    return wrap;
  }

  function viewProducts() {
    const v = el(`<section><p class="eyebrow">Step 1 · Products</p><p class="h1">Select one or multiple products you want to integrate</p><p class="lede">Pick everything you're considering — each one gets its own short set of questions, and the guide stitches them into one plan. Plain-language explanations first; endpoints later.</p><div class="cards" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))"></div></section>`);
    const box = v.querySelector(".cards");
    for (const p of PRODUCTS) {
      const on = S.products.includes(p.id);
      const c = el(`<button type="button" class="card multi ${on ? "on" : ""}" role="checkbox" aria-checked="${on}"><span class="check"></span><div class="t">${esc(p.name)}<span class="tag">${esc(p.tag)}</span></div><div class="d">${esc(p.short)}</div><div class="d" style="margin-top:8px;color:var(--w-ink);font-size:13px">${esc(p.plain)}</div></button>`);
      c.onclick = () => { S.products = on ? S.products.filter(x => x !== p.id) : [...S.products, p.id]; render(); };
      box.append(c);
    }
    return v;
  }

  function viewBasics() {
    const v = el(`<section>
      <p class="eyebrow">Step 2 · Basics</p>
      <p class="h1">Tell us about your platform</p>
      <p class="lede">Three choices that shape every code sample in your guide: which zerohash entity you integrate with, who your customers are, and how they get verified. Samples target the Cert sandbox; the guide shows the Prod host too.</p>
      <div class="q"><p class="h2">Where are you integrating?</p><p class="q-help">Same product, same endpoints — only the host changes. Pointing at the EU host routes you to zerohash europe B.V.; SDK screens and agreements re-brand automatically.</p><div class="cards" data-q="region"></div>${srcLink("fund-overview", "Regional availability: US vs. EU")}</div>
      <div class="q"><p class="h2">Who are your customers?</p><p class="q-help">People are onboarded as "natural persons", businesses as "non-natural persons" (entities) — different endpoints and data.</p><div class="cards" data-q="customers"></div>${srcLink("fund-integration-guide-api", "Natural vs. non-natural person")}</div>
      <div class="q"><p class="h2">How will customers get verified (KYC)?</p><div class="plain"><b>Onboarding SDK</b>: zerohash's own hosted identity check — collects the ID, address and SSN so you never touch that data, and handles manual reviews. <b>Your own KYC (API "Reliance")</b>: you already verify customers with another provider and simply pass zerohash the results; requires approval.</div><div class="cards" data-q="kyc"></div>${srcLink("onboarding-experience-sample", "Onboarding SDK")}</div>
    </section>`);
    const groups = {
      region: [["us","United States","zerohash LLC · api.zerohash.com"],["eu","European Union","zerohash europe B.V. · api.zerohash.eu"]],
      customers: [["individuals","Individuals","Natural persons — POST /participants/customers/new"],["businesses","Businesses","Entities — POST /participants/entity/new"],["both","Both",""]],
      kyc: [["sdk","zerohash Onboarding SDK","Hosted KYC widget. Low-code, zerohash handles reviews."],["api","My own KYC, passed via API","\"Reliance\" model — for approved platforms with an existing KYC provider."]],
    };
    for (const [key, opts] of Object.entries(groups)) {
      const box = v.querySelector(`[data-q="${key}"]`);
      for (const [val, t, d] of opts) {
        const c = el(`<button type="button" class="card ${S[key] === val ? "on" : ""}" role="radio" aria-checked="${S[key] === val}"><span class="check"></span><div class="t">${esc(t)}</div><div class="d">${esc(d)}</div></button>`);
        c.onclick = () => { S[key] = val; render(); };
        box.append(c);
      }
    }
    return v;
  }

  function viewProduct(pid) {
    const p = PRODUCTS.find(x => x.id === pid), a = ans(pid);
    const v = el(`<section><p class="eyebrow">Customize · ${esc(p.tag)}</p><p class="h1">${esc(p.name)}</p><p class="lede">${esc(p.plain)}</p><div class="qs"></div></section>`);
    const qs = v.querySelector(".qs");
    for (const q of visibleQuestions(pid)) {
      const w = el(`<div class="q"><p class="h2">${esc(q.title)}</p>${q.help ? `<p class="q-help">${esc(q.help)}</p>` : ""}${q.plain ? `<div class="plain">${q.plain}</div>` : ""}<div class="body"></div>${q.src ? srcLink(q.src) : ""}</div>`);
      const body = w.querySelector(".body");
      if (q.type === "single") {
        body.className = "body cards";
        for (const [val, t, d] of q.opts) {
          const c = el(`<button type="button" class="card ${a[q.id] === val ? "on" : ""}" role="radio" aria-checked="${a[q.id] === val}"><span class="check"></span><div class="t">${esc(t)}</div>${d ? `<div class="d">${esc(d)}</div>` : ""}</button>`);
          c.onclick = () => { a[q.id] = val; render(); };
          body.append(c);
        }
      } else if (q.type === "multi") {
        const sel = a[q.id] || (a[q.id] = []);
        for (const g of q.groups) {
          const grp = el(`<div class="chip-group"><p class="g">${esc(g.g)}</p><div class="chips"></div></div>`);
          for (const [sym, label] of g.items) {
            const on = sel.includes(sym);
            const ch = el(`<button type="button" class="chip ${on ? "on" : ""}" aria-pressed="${on}">${esc(label)}<span class="sym">${esc(sym)}</span></button>`);
            ch.onclick = () => { a[q.id] = on ? sel.filter(x => x !== sym) : (q.max === 1 ? [sym] : [...sel, sym]); render(); };
            grp.querySelector(".chips").append(ch);
          }
          body.append(grp);
        }
      } else if (q.type === "fields") {
        body.className = "body field";
        for (const [k, label, def] of q.fields) {
          if (a[k] === undefined) a[k] = def;
          const f = el(`<label>${esc(label)}<input type="text" inputmode="decimal" value="${esc(a[k])}"></label>`);
          f.querySelector("input").oninput = (e) => { a[k] = e.target.value; save(); };
          body.append(f);
        }
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
    const list = [];
    if (S.products.includes("fund") && ans("fund").convert === "usd" && ans("fund").dir !== "withdrawals") list.push({ type: "fund_auto_convert", region: S.region, signed_timestamp: 1712008721000 });
    if (S.products.includes("staking")) list.push({ type: "staking", region: S.region, signed_timestamp: 1712008721000 });
    if (S.products.includes("payins")) list.push({ type: "ACCOUNT_FUNDING_PAY", region: S.region, signed_timestamp: 1712008721000 });
    if (!list.length) list.push({ type: "user_agreement", region: S.region, signed_timestamp: 1712008721000 });
    return list;
  }
  const customerPayload = () => ({ first_name: "John", last_name: "Smith", email: "jsmith@example.com", phone_number: "9545551234", address_one: "1 Main St.", address_two: "Suite 1000", city: "Chicago", state: "IL", zip: "12345", country: "United States", date_of_birth: "1985-09-02", citizenship: "United States", tax_id: "123456789", risk_rating: "low", kyc: "pass", kyc_timestamp: 1630623005000, sanction_screening: "pass", sanction_screening_timestamp: 1630623005000, idv: "pass", liveness_check: "pass", signed_timestamp: 1630623005000, metadata: {}, signed_agreements: signedAgreements() });
  const entityPayload = () => ({ request_id: "a1b2c3d4-5678-90ab-cdef-1234567890ab", platform_code: "PLAT01", legal_name: "Entity A", contact_number: "15553765432", address_one: "1 Main St.", address_two: "Suite 1000", city: "Chicago", postal_code: "12345", jurisdiction_code: "US-IL", tax_id: "883987654", id_issuing_authority: "United States", sanction_screening: "pass", sanction_screening_timestamp: 1603378501286, signed_agreements: signedAgreements() });

  function buildGuide() {
    const R = REGIONS[S.region], h = host(), phases = [];
    const link = (slug, label) => [label || PAGE_TITLES[slug] || slug, DOCS + slug];
    const ref = (slug, label) => [label, REF + slug];
    phases.push({ eyebrow: "Phase 1", title: "Get access and make your first call", intro: `You'll integrate with ${R.entity}. Start in the Cert sandbox at ${h}; when you're approved for production the same calls go to ${R.prod}.`,
      steps: [
        { title: "Get your Cert platform, then apply for Prod", html: `<p>After you've talked to zerohash sales or solutions engineering, they create a Cert Platform for you and add your teammates as users; confirm the email, set a password and register 2FA, and you're in the Cert Client Portal at <a href="${R.portalCert}">${R.portalCert.replace("https://", "")}</a>. For production you sign up yourself at <a href="${R.portalProd}">${R.portalProd.replace("https://", "")}</a>, complete the business application, and zerohash's Compliance and Sales Engineering teams approve your flow of funds before any live API keys are issued.</p>`, links: [link("get-platform-access")] },
        { title: "Generate an API key and allowlist your IPs", html: `<p>In the Client Portal go to <b>Administration → API Keys → Add API Key</b>. Give it a nickname, passphrase and expiry. Record the public key, private key and passphrase immediately — the private key and passphrase are shown once. New keys start as <em>Created</em> and need two approvals before they work. Send zerohash every static IP you'll call from (corporate VPNs are fine; public VPNs and personal IPs aren't); you can then pin IPs to specific keys in the Portal.</p>`, links: [link("generate-api-keys"), link("api-security", "API Security"), link("whitelist-ip-addresses", "Whitelist IP Addresses")] },
        { title: "Confirm connectivity with GET /time", html: `<p>The only endpoint that needs no authentication. A 200 with a current timestamp means your base URL and TLS are right.</p>`, code: [{ lang: "bash", label: "Health check", text: `curl --request GET \\\n  --url ${h}/time \\\n  --header 'accept: application/json'` }], links: [link("submit-first-api-call")] },
        { title: "Sign every other request with HMAC-SHA256", html: `<p>Four headers on each call: <span class="ep">X-SCX-API-KEY</span>, <span class="ep">X-SCX-SIGNED</span>, <span class="ep">X-SCX-TIMESTAMP</span> (seconds) and <span class="ep">X-SCX-PASSPHRASE</span>. The signature is Base64(HMAC-SHA256(private key, timestamp + METHOD + path-with-query + body)) — use <code>{}</code> as the body for GETs and keep query parameters in the same order you send them. Rate limit: 2,000 requests per rolling 10 seconds per IP.</p>`,
          code: [{ lang: "javascript", label: "Node.js signing helper", text: `const crypto = require("crypto");\n\nfunction zhHeaders(method, path, body = null) {\n  const timestamp = Math.floor(Date.now() / 1000).toString();\n  const bodyStr = body ? JSON.stringify(body) : "{}";\n  const message = timestamp + method.toUpperCase() + path + bodyStr;\n  const signature = crypto\n    .createHmac("sha256", process.env.ZH_PRIVATE_KEY)\n    .update(message)\n    .digest("base64");\n  return {\n    "X-SCX-API-KEY": process.env.ZH_PUBLIC_KEY,\n    "X-SCX-SIGNED": signature,\n    "X-SCX-TIMESTAMP": timestamp,\n    "X-SCX-PASSPHRASE": process.env.ZH_PASSPHRASE,\n    "Content-Type": "application/json",\n  };\n}\n\n// Example: request a quote\n// fetch("${h}/liquidity/rfq", { method: "POST", headers: zhHeaders("POST", "/liquidity/rfq", body), body: JSON.stringify(body) })` }], links: [link("authentication", "API Authentication"), link("request-ids", "Request IDs and Idempotency")] },
      ],
      config: ["Get a Cert platform created (sales / solutions engineering)", "Send zerohash the static IP addresses you'll call from", "Give zerohash a webhook callback URL — every product below reports status by webhook"] });

    const onb = { eyebrow: "Phase 2", title: "Onboard your customers", intro: "Every product needs the end customer to exist as an approved zerohash participant first. Onboarding returns a participant_code (e.g. CUST01) that you'll pass on every later call.", steps: [], config: [] };
    const agreements = signedAgreements().map(a => a.type);
    if (S.kyc === "sdk") {
      onb.steps.push({ title: "Open the Onboarding SDK for each new customer", html: `<p>Mint an onboarding access token from your server with <span class="ep">POST /client_auth_token</span>, hand it to your front end and open the zerohash Onboarding module from the <code>zh-web-sdk</code> package. zerohash collects the ID, address and SSN directly (you never store it), asks for more only when a check is inconclusive, and shows the required agreements. Colors and fonts are customizable. Listen for the participant-status webhook to learn when the customer is <code>approved</code>.</p>`,
        code: [{ lang: "javascript", label: "Front end — open the Onboarding module", text: `import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';\n\nconst sdk = new ZeroHashSDK({\n  zeroHashAppsURL: '${R.sdk}',\n  env: 'cert',         // 'cert' | 'prod'\n  theme: 'auto',       // 'light' | 'dark' | 'auto'\n});\n\n// jwt = the onboarding access token your server minted via POST /client_auth_token\nsdk.openModal({ appIdentifier: AppIdentifier.USER_ONBOARDING, jwt });\n// ← USER_ONBOARDING is illustrative: use the Onboarding module identifier from the SDK reference (linked below)` }],
        links: [link("onboarding-experience-sample", "Onboarding SDK"), ref("sdk-modules-user-onboarding", "SDK modules — User Onboarding"), ref("post_client-auth-token", "POST /client_auth_token"), ref("participant-status-updates", "Participant status webhooks")] });
      if (agreements.some(a => a !== "user_agreement")) onb.steps.push({ title: "Make sure product agreements are captured", html: `<p>The products you chose require the customer to accept specific agreements: <code>${agreements.join("</code>, <code>")}</code>. The SDK embeds them in the flow; if you onboard some customers by API instead, include them in <code>signed_agreements</code> as shown in the API variant.</p>`, links: [link("fund-integration-guide-api", "signed_agreements example")] });
    } else {
      if (S.customers !== "businesses") onb.steps.push({ title: "Submit each verified individual", html: `<p>You've already run KYC with your own provider, so you pass zerohash the results — pass/fail for KYC, sanctions screening, ID verification and liveness — plus the agreements they accepted. The response contains the <code>participant_code</code>. If the customer lives somewhere your platform isn't permitted, you'll get a descriptive 4xx; best practice is to block those sign-ups on your side first.</p>`,
        code: [{ lang: "bash", label: "POST /participants/customers/new", text: curl("POST", "/participants/customers/new", customerPayload()) }], links: [ref("post_participants-customers-new", "POST /participants/customers/new"), link("permitted-and-restricted-jurisdictions", "Permitted jurisdictions"), ...(S.region === "eu" ? [link("eu-participant-creation", "EU participant creation")] : [])] });
      if (S.customers !== "individuals") onb.steps.push({ title: "Submit each verified business", html: `<p>Businesses go through <span class="ep">POST /participants/entity/new</span>. Approved platforms (typically licensed financial institutions) may send a stripped-down "partial" KYB packet like the one below; the default "full" packet adds entity type, website, control persons and beneficial owners. Use <code>request_id</code> to make the call idempotent.</p>`,
        code: [{ lang: "bash", label: "POST /participants/entity/new (partial KYB)", text: curl("POST", "/participants/entity/new", entityPayload()) }], links: [ref("post_participants-entity-new", "POST /participants/entity/new"), link("fund-integration-guide-api", "Full non-natural person example")] });
      onb.config.push("Reliance (bring-your-own KYC) is granted per platform — confirm approval with zerohash");
    }
    phases.push(onb);

    let n = 3;
    for (const pid of PRODUCT_IDS.filter(id => S.products.includes(id))) { const ph = PRODUCT_PHASE[pid](ans(pid), { h, R, link, ref }); ph.eyebrow = `Phase ${n++}`; phases.push(ph); }
    return phases;
  }

  const PRODUCT_PHASE = {
    fund(a, { R, link, ref }) {
      const assets = a.assets || ["USDC.BASE"], first = assets[0];
      const ph = { title: "Account Funding", intro: "", steps: [], config: [] };
      const doDep = a.dir !== "withdrawals", doWd = a.dir !== "deposits", conv = a.convert === "usd";
      const desc = [];
      if (doDep) desc.push(conv ? `deposits in ${assets.join(", ")} that auto-convert to USD${a.ledger === "sweep" ? " and sweep to your platform account" : " and stay in the customer's account"}` : `deposits in ${assets.join(", ")} kept as crypto`);
      if (doWd) desc.push("withdrawals to the customer's wallet or exchange");
      ph.intro = `Your setup: ${desc.join("; ")}, built with the ${a.style === "sdk" ? "zerohash SDK" : "API"}, ${a.auth === "off" ? "without AUTH (classic transfers)" : a.auth === "lite" ? "with AUTH Lite" : "with AUTH Validate"}.`;
      if (doDep && conv) {
        if (a.style === "api") ph.steps.push({ title: `Create a ${first} deposit address that auto-converts`, html: `<p>Call <span class="ep">POST /fund/rfq</span> with the customer's <code>participant_code</code> and the network-qualified asset. The response is the address to show the customer (with fee and limit details). <b>Every deposit to it converts to USD automatically</b>${a.ledger === "sweep" ? " and transfers to your platform's ledger" : ""}. The customer must have accepted the <code>fund_auto_convert</code> agreement or this call fails. Repeat per asset: ${assets.map(x => `<code>${x}</code>`).join(", ")}.</p>`,
          code: [{ lang: "bash", label: "POST /fund/rfq", text: curl("POST", "/fund/rfq", { participant_code: "CUST01", fund_asset: first, client_fund_id: "abc123" }) }, { lang: "json", label: "Response", text: J({ message: { request_id: "14f8ebb8-7530-4aa4-bef9-9d73d56313f3", participant_code: "CUST01", fund_asset: first, rate: "1", quoted_currency: "USD", expiry_timestamp: null, deposit_address: first.includes("SOL") ? "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU" : "0x5f59B625036ccB4f7aD27Ca4Cb896e4452AfFDAF", deposit_fee_bps: 100, first_deposit_fee_floor: "1.00", subsequent_deposit_fee_floor: "1.00", minimum_deposit: "1", maximum_deposit: "250000", reference_id: "abc123" } }) }],
          links: [ref("post_fund-rfq", "POST /fund/rfq"), link("fund-integration-guide-api", "Onboarding API + Fund API guide")] });
        else ph.steps.push({ title: "Mint an Account Funding token and open the Fund SDK", html: `<p>From your server, call <span class="ep">POST /client_auth_token</span> for an <code>approved</code> customer with the <code>fwc</code> permission. Optionally add <code>reference_id</code> (it's echoed on every webhook) or preset the amount with <code>deposit_amount</code> + <code>denominated_currency</code>${a.auth !== "off" ? " (AUTH + Fund SDK only)" : ""}. Hand the JWT to your front end and open the Account Funding module — it shows the address and QR code, agreements and the platform's deposit limits (by default $1 to $250,000 per deposit), and emails the receipt.</p>`,
          code: [{ lang: "bash", label: "POST /client_auth_token", text: curl("POST", "/client_auth_token", { participant_code: "CUST01", permissions: ["fwc"], reference_id: "5fc7d17d-53d4-480a-a30d-426e29c2ac65" }) }, { lang: "javascript", label: "Front end — open the Account Funding module", text: `import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';\n\nconst sdk = new ZeroHashSDK({\n  zeroHashAppsURL: '${R.sdk}',\n  env: 'cert',\n  theme: 'auto',\n});\n\nsdk.openModal({ appIdentifier: AppIdentifier.ACCOUNT_FUNDING, jwt });\n// ← ACCOUNT_FUNDING is illustrative: use the Fund module identifier from the Fund SDK reference (linked below)` }],
          links: [ref("post_client-auth-token", "POST /client_auth_token"), ref("fund-sdk", "Fund SDK reference"), link("fund-integration-guide-sdk", "Onboarding API + Fund SDK guide")] });
        ph.steps.push({ title: "Handle the DEPOSIT_FUND_COMPLETE webhook", html: `<p>Once the deposit has enough on-chain confirmations (one, for USDC), zerohash records three ledger movements automatically — the deposit, the conversion to USD (a trade with movement type <code>final_settlement</code>)${a.ledger === "sweep" ? ", and the transfer of USD to your platform account" : ""} — and sends you this webhook. Failure variants use the same shape with <code>success: false</code> and a <code>reason</code> (deposit above maximum, customer not approved, stablecoin depegged, deposits over $500k pending settlement).</p>`,
          code: [{ lang: "json", label: "Webhook payload", text: J({ participant_code: "CUST01", fund_asset: first, rate: "1", quoted_currency: "USD", source_address: "0xA32A6aA6a3B87b49BeaB01393e2020C3C191CD61", deposit_address: "0x5f59B625036ccB4f7aD27Ca4Cb896e4452AfFDAF", quantity: "500", notional: "495.00", fund_id: "a1b2c3d4-5678-9012-abcd-ef1234567890", fund_timestamp: 1745262000000000000, deposit_timestamp: 1745261950000000000, transaction_id: "ec963207-69f4-44d0-9251-2977dda86fcd", account_label: "general", success: true, reason: "Deposit processed", reference_id: "abc123", raw_fee_bps: "100", deposit_fee_bps: "100", raw_fee_notional: "5.00", deposit_fee_notional: "5.00" }) }], links: [ref("fund-transaction-update", "Account Funding webhooks")] });
        ph.steps.push({ title: "Show history and reconcile", html: `<p>Query <span class="ep">GET /fund/transactions</span> for a customer's completed funding events (paginated), and <span class="ep">GET /movements?parent_link_id=&lt;fund_id&gt;</span> to see every ledger movement behind one deposit.${a.ledger === "sweep" ? " Once a day zerohash wires you the sum of all converted deposits from the prior session (Mon–Thu sessions settle next business day EOD; Friday's settles Monday)." : ""}</p>`,
          code: [{ lang: "bash", label: "GET /fund/transactions", text: curl("GET", "/fund/transactions?participant_code=CUST01&page=1&page_size=50") }], links: [ref("get_fund-transactions", "GET /fund/transactions"), link("account-funding-reconciliation", "Reconciliation guide")] });
        ph.config.push("Enable the Account Funding product for your platform", `Ledgering: ${a.ledger === "sweep" ? "Option 1 — auto-transfer converted USD to the platform" : "Option 2 — USD stays in the customer account"}`, `Fees: ${a.fee === "customer" ? "charged to the customer on conversion" : "borne by the platform (customer pays nothing at conversion)"}`, "Deposit limits if you want something other than the $1 minimum / $250,000 maximum defaults", "Confirm you'll send email receipts for every funding transaction, or have zerohash send them", "Register your webhook URL for Onboarding and Account Funding events");
      }
      if (doDep && !conv) {
        if (a.style === "sdk") ph.steps.push({ title: "Open the Crypto Deposits SDK", html: `<p>Mint a token with the <code>crypto-deposits</code> permission for an <code>approved</code> customer and open the Crypto Deposits module. The asset stays as ${assets.join(", ")} in the customer's account — nothing is converted. Deposit-status webhooks tell you when it lands; <span class="ep">GET /fund/transactions</span> lists history.</p>`, code: [{ lang: "bash", label: "POST /client_auth_token", text: curl("POST", "/client_auth_token", { participant_code: "CUST01", permissions: ["crypto-deposits"] }) }], links: [link("crypto-deposits-sdk-guide", "Crypto Deposits SDK Guide"), ref("deposit-status-updates", "Deposit status webhooks")] });
        else ph.steps.push({ title: `Create a plain ${first} deposit address`, html: `<p>Use <span class="ep">POST /deposits/digital_asset_addresses</span> to get an address per asset. Deposits credit the customer's balance in the same asset and you receive an account-balance webhook with the movement.</p>`, code: [{ lang: "bash", label: "POST /deposits/digital_asset_addresses", text: curl("POST", "/deposits/digital_asset_addresses", { participant_code: "CUST01", asset: first }) }], links: [ref("post_deposits-digital-asset-addresses", "POST /deposits/digital_asset_addresses"), link("retail-digital-asset-deposits-faq", "Retail Crypto Deposits FAQ")] });
        ph.config.push("Deposit returns must go to an address you confirm with the customer — never the source address");
      }
      if (doWd) ph.steps.push({ title: conv ? "Withdrawals that convert dollars back to crypto" : "Withdrawals of crypto the customer holds", html: conv
          ? `<p>Two SDK modules: the <b>Account Link SDK</b> (permission <code>crypto-account-link</code>) lets the customer register a destination wallet or exchange${a.auth !== "off" ? " — with AUTH they connect the exchange directly" : ""}; then the <b>Withdraw SDK</b> (permission <code>crypto-withdrawals</code>) takes a dollar amount, converts it to the asset and sends it. You top up your float account for the day's withdrawals at end of day.</p>`
          : `<p>Mint a token with <code>crypto-withdrawals</code> and open the <b>Crypto Withdrawals</b> module; the customer picks asset, network, destination${a.auth !== "off" ? " (or a connected exchange via AUTH)" : ""} and amount, reviews the network fee, and confirms. Status moves submitted → posted → settled by webhook (<code>payment_status_changed</code>). Requires zh-web-sdk ≥ 3.5.0 for AUTH.</p>`,
        code: [{ lang: "bash", label: "POST /client_auth_token", text: curl("POST", "/client_auth_token", conv ? { participant_code: "CUST01", permissions: ["crypto-withdrawals"], withdrawal_details: { quoted_asset: "USD", withdrawal_request_amount: "100", external_account_id: "cda673db-0334-4151-a80e-8a87015493a4" }, reference_id: "5fc7d17d-53d4-480a-a30d-426e29c2ac65" } : { participant_code: "CUST01", permissions: ["crypto-withdrawals"], reference_id: "0bd7f7f0-cf26-495f-b2df-e8afe8481ba3" }) }, { lang: "javascript", label: "Front end — Crypto Withdrawals module", text: `import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';\n\nconst sdk = new ZeroHashSDK({ zeroHashAppsURL: '${R.sdk}', env: 'cert', theme: 'auto' });\nsdk.openModal({ appIdentifier: AppIdentifier.CRYPTO_WITHDRAWALS, jwt });` }],
        links: conv ? [link("wallet-link-sdk-integration-guide", "Account Link SDK + Withdraw SDK guide"), ...(a.auth !== "off" ? [link("auth-withdrawals-sdk", "Fund Withdrawals SDK with AUTH")] : [])] : [link("crypto-withdrawals-guide", "Crypto Withdrawals SDK Guide"), ref("payments-status-changes", "Payment status webhooks")] });
      if (a.auth !== "off") {
        ph.steps.push({ title: `Configure AUTH ${a.auth === "validate" ? "Validate" : "Lite"}`, html: `<p>AUTH is switched on per platform by zerohash — there's no separate endpoint; once enabled, the Fund and Withdrawal SDK tokens above simply gain a "connect your exchange or wallet" step. Decide: custodial sources (exchanges like Gemini, Robinhood), non-custodial (MetaMask, Phantom) or both; which of ${assets.join(", ")} to allow; per-transaction and daily limits; and whether to <b>block deposits not initiated through AUTH</b>.${a.auth === "validate" ? " With Validate, zerohash matches the KYC'd customer's name to the external account (Jaro-Winkler similarity, default threshold 0.75) — either post-crediting with a daily exceptions report, or pre-crediting, where deposits over $3,000 stay \"Processing\" until Travel Rule data confirms the match." : ""} Mobile needs the native iOS/Android SDKs.</p>`, links: [link("auth", "AUTH"), link("adk-sdk-integration-guide", "AUTH SDK Integration Guide"), link("auth-validate", "AUTH Controls"), link("auth-network", "AUTH Network — supported exchanges and wallets")] });
        ph.config.push(`AUTH ${a.auth === "validate" ? "Validate (name matching)" : "Lite"}: connection sources, allowed assets/networks, limits, and a public key for signature validation`, "Decide whether to block non-AUTH deposits");
      } else if (doDep) ph.config.push("Classic transfers only — non-AUTH deposit blocking does not apply");
      return ph;
    },
    trade(a, { link, ref }) {
      const ph = { title: "Buy / Sell", intro: "", steps: [], config: [] }, assets = a.assets || ["BTC"], quote = a.quote || "USD";
      ph.intro = `${a.model === "both" ? "RFQ and CLOB" : a.model === "clob" ? "CLOB over FIX" : "RFQ over REST"}, ${a.liq === "float" ? "float account model (customer USD on your ledger)" : "customer pre-funded model (customer USD on the zerohash ledger)"}${a.model !== "clob" ? `, quotes in ${quote}, ${a.expiry || "30s"} validity, ${a.bps || 25} bps spread` : ""}.`;
      if (a.model !== "clob") {
        ph.steps.push({ title: "Request a quote", html: `<p><span class="ep">POST /liquidity/rfq</span> with side, the asset (<code>underlying</code>), <code>quoted_currency</code> ${quote === "USD" ? "USD" : "USDC.ETH — the customer trades straight from their USDC balance"}, and either <code>quantity</code> (in the asset) or <code>total</code> (in ${quote}, buys only). The response includes an all-in <code>price</code> with your spread baked in, a <code>quote_id</code>, and <code>expire_ts</code>. No credit check happens yet.</p>`, code: [{ lang: "bash", label: "POST /liquidity/rfq", text: curl("POST", "/liquidity/rfq", { side: "buy", participant_code: "CUST01", account_label: "general", underlying: assets[0], quoted_currency: quote, quantity: 0.01, spread: String(a.bps || 25), quote_expiry: a.expiry || "30s" }) }], links: [link("submit-and-execute-quotes"), link("spreads-and-fees"), ...(quote !== "USD" ? [link("usdc-trading-pairs")] : [])] });
        ph.steps.push({ title: "Execute it before it expires", html: `<p><span class="ep">POST /liquidity/execute</span> with the <code>quote_id</code>. zerohash checks the quote is still valid and that ${a.liq === "float" ? "your float account" : "the customer's account"} can cover it, then returns the <code>trade_id</code> with status <code>Completed</code>. Pull details any time with <span class="ep">GET /trades</span>.</p>`, code: [{ lang: "bash", label: "POST /liquidity/execute", text: curl("POST", "/liquidity/execute", { quote_id: "1f998343-d9f1-4b1d-bed7-df3aa8265bdb" }) }, { lang: "bash", label: "GET /trades", text: curl("GET", "/trades?participant_code=CUST01&page=1") }], links: [ref("post_liquidity-execute", "POST /liquidity/execute"), ref("get_trades", "GET /trades")] });
        ph.steps.push({ title: "Discover tradable assets programmatically", html: `<p><span class="ep">GET /assets</span> returns every asset; RFQ-tradable ones have <code>rfq_liquidity_enabled: true</code>. Minimum trade is $0.02 notional; maximum $500,000 per quote on most instruments. Set your own min/max within those bounds.</p>`, code: [{ lang: "bash", label: "GET /assets", text: curl("GET", "/assets") }], links: [link("supported-instruments-1"), ref("get_assets", "GET /assets")] });
      }
      if (a.model !== "rfq") { ph.steps.push({ title: "Connect to the CLOB over FIX 5.0", html: `<p>The order book is reached through a FIX session that zerohash configures with you (REST is available too). Activate trading accounts with <span class="ep">POST /accounts</span> and <span class="ep">PATCH /clob/accounts/{account_id}</span>, then place limit, market-to-limit, stop and stop-limit orders with GTC, IOC, GTD, FOK or DAY time-in-force (DAY orders cancel at 4 PM EST daily, weekends included). Start by contacting <a href="mailto:support@zerohash.com">support@zerohash.com</a> to become a CLOB member.</p>`, links: [link("central-limit-order-book-3"), link("account-setup", "Account Activation & Funding Models (CLOB)"), link("supported-orders", "Order Management"), link("supported-instruments", "Supported Instruments (CLOB)"), ref("central-limit-order-book", "FIX specification")] }); ph.config.push("Request CLOB membership and a FIX session"); }
      ph.config.push(`Liquidity model: ${a.liq === "float" ? "Float account — fund 00SCXM/[PlatformCode]/general and settle daily" : "Customer pre-funded — credit checks on [ParticipantCode]/[PlatformCode]/general"}`, `Default spread ${a.bps || 25} bps and quote validity ${a.expiry || "30s"} (Client Services sets platform defaults)`);
      if (quote !== "USD") ph.config.push("Enable USDC-quoted pairs (US only) — trades are recorded at 1:1 par for reporting");
      return ph;
    },
    payouts(a, { link, ref }) {
      const ph = { title: "Payouts", intro: "", steps: [], config: [] }, assets = a.assets || ["USDC.SOL"], first = assets[0], [sym, net] = first.includes(".") ? first.split(".") : [first, first];
      ph.intro = `${a.type === "single" ? "Single API Call Payouts" : `Modular Payouts via ${a.how === "sdk" ? "the SDK" : a.how === "nocode" ? "the no-code portal" : "the API"}`} to ${a.bene === "both" ? "individuals and businesses" : a.bene === "entity" ? "businesses" : "individuals"} in ${assets.join(", ")}.`;
      ph.steps.push({ title: "Register the payor and fund your float", html: `<p>The payor (usually your platform or your business customer) is onboarded once as an entity with <span class="ep">POST /participants/entity/new</span>${a.type === "single" ? " — or inline on the first payout" : ""}. Payouts are pre-funded: keep USD in your float account (in Cert it's pre-funded for you).</p>`, links: [link("new-payouts-api-integration-guide"), link("payouts-integration-guide", "Modular Payouts API guide")] });
      if (a.type === "single") ph.steps.push({ title: "Send a payout in one call", html: `<p><span class="ep">POST /payouts</span> carries the payor reference, the beneficiary's identity (created automatically if new), their wallet, and the payment. zerohash runs verification, compliance and account linking internally and returns the payout id; track it with <span class="ep">GET /payouts</span> and webhooks. Ultimate payors must be entities; beneficiaries can be individuals or entities. For US beneficiaries send <code>tax_id</code> (SSN/ITIN); elsewhere send <code>id_number_type</code> + <code>id_number</code>.</p>`, code: [{ lang: "bash", label: "POST /payouts — individual beneficiary", text: curl("POST", "/payouts", { account_model: "fully_disclosed", payor: { participant_code: "PAYOR1" }, beneficiary: { info: { individual: { onboarding_profile: "payouts_beneficiary", first_name: "Jane", last_name: "Smith", date_of_birth: "1990-01-01", address_one: "123 Main St", city: "New York", zip: "10001", jurisdiction_code: "US-NY", tax_id: "123456789", id_issuing_authority: "US" } }, external_account: { info: { network: net, crypto_address: "ab123...", supported_symbols: [sym] } } }, payment: { asset: first, quoted_asset: "USD", total: "100.00", description: "Contractor payout" }, metadata: { client_ref: "your-internal-ref-id" } }) }], links: [link("new-payouts-api-integration-guide"), link("supported-regions", "Supported regions")] });
      else if (a.how === "api") ph.steps.push({ title: "Four steps, in order", html: `<ul><li><b>Onboard the beneficiary</b> — <span class="ep">POST /participants/beneficiaries/new</span> (entities via <span class="ep">POST /participants/entity/new</span>).</li><li><b>Link their wallet</b> — <span class="ep">POST /payments/external_accounts</span> with type <code>crypto</code>, network and address; wait for status <code>approved</code>.</li><li><b>Initiate the payout</b> — <span class="ep">POST /payments</span> referencing the <code>external_account_id</code>.</li><li><b>Track</b> — <span class="ep">GET /payments/{id}</span> and payment-status webhooks (submitted → posted → settled).</li></ul>`, code: [{ lang: "bash", label: "POST /payments/external_accounts", text: curl("POST", "/payments/external_accounts", { participant_code: "BENE01", type: "crypto", details: { network: net, supported_assets: [sym], address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } }) }], links: [link("payouts-integration-guide", "Modular Payouts API Integration Guide")] });
      else if (a.how === "sdk") ph.steps.push({ title: "Use the Payouts SDK", html: `<p>Drop-in screens hosted by zerohash handle beneficiary onboarding and wallet linking; you mint a client token per session and initiate payouts.</p>`, links: [link("payouts-sdk-integration-guide", "Modular Payouts SDK Integration Guide")] });
      else ph.steps.push({ title: "Operate payouts without code", html: `<p>Use the no-code integration to onboard beneficiaries and initiate payouts from the portal.</p>`, links: [link("enterprise-settlements-no-code-integration-guide", "Modular Payouts No-Code Integration Guide")] });
      ph.config.push("Enable Payouts and register your webhook URL", "Confirm beneficiary regions are supported (US, most of the EU, and others)");
      return ph;
    },
    payins(a, { link, ref }) {
      const ph = { title: "Payins", intro: "", steps: [], config: [] }, assets = a.assets || ["USDC.BASE"], first = assets[0];
      ph.intro = `${a.role === "psp" ? "You onboard merchants and their shoppers" : "Your platform is the merchant"}, accepting ${assets.join(", ")} through the ${a.style === "sdk" ? "Payins SDK" : "Payins API"}.`;
      if (a.role === "psp") ph.steps.push({ title: "Onboard each merchant", html: `<p>Merchants are business participants: <span class="ep">POST /participants/entity/new</span>, then documents via <span class="ep">POST /participants/entity/documents</span>; check status with <span class="ep">GET /participants</span>. Fund a refund account for each.</p>`, links: [link("merchant-onboarding-guide", "Merchant Onboarding Guide")] });
      ph.steps.push({ title: "Onboard shoppers at the right tier", html: `<p>Shoppers are individuals created with <span class="ep">POST /participants/customers/new</span> (or the SDK). How much identity data you need depends on what they're buying — non-transferables, transferables or perishables — and the amount; <span class="ep">GET /pay/limits</span> tells you a shopper's remaining limits. If a quote fails for missing data, the error lists exactly which fields to add with <span class="ep">PATCH /participants/customers/{participant_code}</span>.</p>`, links: [link("onboard-shoppers", "Shopper Onboarding Guide")] });
      ph.steps.push({ title: "Quote the payment and show the address", html: `<p><span class="ep">POST /pay/rfq</span> locks the dollar amount and returns a <code>deposit_address</code> on the chosen network${a.role === "psp" ? " (pass <code>merchant_participant_code</code>)" : ""}. ${a.style === "sdk" ? "With the SDK, the shopper accepts terms, picks asset and network and sees the address inside the hosted flow." : "Show the shopper the address and amount; they pay from their wallet."} A webhook confirms when the exact amount lands (over/under-payments have their own statuses). Transactions of $500,000+ need manual approval.</p>`, code: [{ lang: "bash", label: "POST /pay/rfq", text: curl("POST", "/pay/rfq", Object.assign({ participant_code: "SHOPP1", pay_asset: first, quoted_total: "100.00", quoted_currency: "USD", account_label: "pay", client_reference_id: "order-12345" }, a.role === "psp" ? { merchant_participant_code: "MERCH01" } : {})) }], links: [link(a.style === "sdk" ? "payins-integration-guide" : "payins-api-integration-guide"), ref("payins-transaction-updates", "Payins webhooks")] });
      ph.config.push("Enable the Pay product (otherwise POST /pay/rfq returns 401)", "Shoppers must sign the ACCOUNT_FUNDING_PAY agreement", "API key needs Pay READ_AND_WRITE permission", "Fund a refund account");
      return ph;
    },
    bank(a, { link, ref }) {
      const ph = { title: "Bank Rails (ACH + RTP)", intro: "", steps: [], config: [] }, rails = a.rails || ["ach"];
      ph.intro = `${a.model === "prefunded" ? "Pre-funded" : a.model === "instant" ? "Instant USD" : "On-demand"} funding model, bank linking via ${a.plaid === "processor" ? "your own Plaid contract (processor tokens)" : "zerohash-powered Plaid Link"}, rails: ${rails.map(r => ({ ach: "ACH", rtp: "RTP/FedNow", wire: "FedWire" })[r]).join(", ")}.`;
      if (a.plaid === "processor") ph.steps.push({ title: "Link a bank account with a Plaid processor token", html: `<p>Run Plaid Link yourself (Auth, Balance, Identity, Identity Match), create a processor token for zerohash, and register the account with <span class="ep">POST /payments/external_accounts</span>. Manage with <span class="ep">GET /payments/external_accounts</span> and <span class="ep">POST /payments/external_accounts/{id}/close</span>.</p>`, code: [{ lang: "bash", label: "POST /payments/external_accounts", text: curl("POST", "/payments/external_accounts", { participant_code: "CUST01", account_nickname: "Chase", plaid_processor_token: "db884a3e-7eb7-4253-92ee-04ff5efbc365" }) }], links: [link("bank-account-linking")] });
      else ph.steps.push({ title: "Link a bank account through the zerohash SDK", html: `<p>No Plaid contract needed — a zerohash relationship manager handles Plaid onboarding, and your customers verify and link their bank inside the zerohash Fiat Account Link module. Manage linked accounts via the SDK or <span class="ep">GET /payments/external_accounts</span>.</p>`, links: [link("bank-account-linking"), ref("sdk-modules-fiat-account-link", "SDK — Fiat Account Link")] });
      if (a.model === "prefunded") ph.steps.push({ title: "Pull dollars in, then trade", html: `<p>Request the ACH deposit with <span class="ep">POST /fund/deposit</span>. Funds become available after ACH settles plus a short hold for return risk. Once the customer has a USD balance, buy crypto with <span class="ep">POST /liquidity/rfq</span> → <span class="ep">POST /liquidity/execute</span>. Sells credit USD, which the customer can then withdraw to the linked bank.</p>`, links: [link("funding-models", "Funding Models — Pre-funded")] });
      else ph.steps.push({ title: "Quote and execute an ACH-funded trade", html: `<p><span class="ep">POST /payments/rfq</span> quotes the trade (buys debit the bank; sells credit it) — a one-minute quote is recommended to fit authorization checks — then <span class="ep">POST /payments/execute</span> with the <code>quote_id</code> and the customer's <code>external_account_id</code>. ${a.model === "instant" ? "With Instant USD the customer's dollar balance is credited as soon as the debit is approved." : "The trade executes as soon as the debit is approved, fronted by your float."} Poll <span class="ep">GET /payments/status</span> or use webhooks.</p>`, code: [{ lang: "bash", label: "POST /payments/rfq", text: curl("POST", "/payments/rfq", { side: "buy", underlying_currency: "BTC", quoted_currency: "USD", total: "100", participant_code: "CUST01", account_label: "general", quote_expiry: "1m" }) }], links: [link("funding-models", "Funding Models — On-demand / Instant USD")] });
      if (rails.includes("rtp")) ph.steps.push({ title: "Pay out instantly with RTP / FedNow", html: `<p>Credits to US bank accounts arrive in seconds, 24/7/365, under the <code>rtp</code> network type — FedNow is used automatically where RTP isn't available.</p>`, links: [link("fiat")] });
      ph.config.push("Loss reserve (required whenever ACH is enabled)", a.model === "prefunded" ? "No float needed for Pre-funded" : "Float balance — it caps how much your customers can trade before ACH settles", a.plaid === "processor" ? "Enable the zerohash integration in your Plaid dashboard" : "zerohash arranges Plaid (reseller) onboarding", "ACH limits and velocity controls for your platform", `Compatibility: ${a.model === "prefunded" ? "Pre-funded works with RFQ (Novated or Direct), not CLOB" : "works with CLOB and RFQ Direct, not RFQ Novated"}`);
      return ph;
    },
    va(a, { link, ref }) {
      const ph = { title: "Virtual Accounts", intro: "", steps: [], config: [] }, asset = (a.asset || ["USDC"])[0], net = a.network || "SOL";
      ph.intro = a.policy === "convert" ? `Each customer gets an account and routing number; arriving dollars auto-convert to ${asset} on ${net} and go to their whitelisted wallet.` : "Each customer gets an account and routing number; arriving dollars are held as a USD balance.";
      if (a.policy === "convert") ph.steps.push({ title: "Whitelist the customer's destination wallet", html: `<p><span class="ep">POST /payments/external_accounts</span> with the wallet address; zerohash screens it and moves it to <code>approved</code>.</p>`, code: [{ lang: "bash", label: "POST /payments/external_accounts", text: curl("POST", "/payments/external_accounts", { participant_code: "CUST01", type: "crypto", details: { network: net, supported_assets: [asset], address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" } }) }], links: [link("create-a-virtual-account")] });
      ph.steps.push({ title: "Open the virtual account", html: `<p><span class="ep">POST /virtual_accounts</span> returns <code>PENDING</code>, then a <code>virtual_account.created</code> webhook when it's <code>ACTIVE</code> with the account and routing number (issued at Cross River Bank). Share those with the customer — they can push ACH, wire, RTP or FedNow from any bank with no further integration.</p>`, code: [{ lang: "bash", label: "POST /virtual_accounts", text: curl("POST", "/virtual_accounts", a.policy === "convert" ? { participant_code: "CUST01", settlement_policy: { type: "AUTO_CONVERT_AND_WITHDRAW", asset, external_account_id: "7c1e2c3a-4b5d-4e6f-8a9b-0c1d2e3f4a5b" } } : { participant_code: "CUST01", settlement_policy: { type: "HOLD" } }) }], links: [link("create-a-virtual-account"), ref("virtual-account-updates", "Virtual account webhooks")] });
      ph.steps.push({ title: "React to deposits", html: a.policy === "convert" ? `<p><code>deposit_received</code> → <code>account_balance.changed</code> → conversion and on-chain payout webhooks (<code>payout_initiated</code>, <code>payout_completed</code>).</p>` : `<p><code>deposit_received</code> then <code>account_balance.changed</code> — the USD then sits there. Use <span class="ep">POST /liquidity/rfq</span> + <span class="ep">/execute</span> to buy crypto, or link a wallet or bank and <span class="ep">POST /payments</span> to pay out.</p>`, links: [link("virtual-accounts")] });
      ph.config.push("Confirm eligibility and non-permitted jurisdictions for Virtual Accounts", "Customers must be onboarded first (see Virtual Accounts Setup)");
      return ph;
    },
    ramps(a, { link, ref }) {
      const ph = { title: "On & Off Ramps", intro: "", steps: [], config: [] }, assets = a.assets || ["BTC"], first = assets[0];
      ph.intro = `${a.dir === "both" ? "On-ramp and off-ramp" : a.dir === "on" ? "On-ramp" : "Off-ramp"} for ${assets.join(", ")}, ${a.expiry || "30s"} quotes, monetized by ${a.money === "both" ? "spread and fees" : a.money === "fee" ? "explicit fees" : "a spread"}.`;
      if (a.dir !== "off") ph.steps.push({ title: "On-ramp: quote, execute, deliver to the wallet", html: `<p><span class="ep">POST /convert_withdraw/rfq</span> with side <code>buy</code>, the dollar <code>total</code> and the customer's <code>withdrawal_address</code>; the response includes the network fee (set <code>fee_inclusive: true</code> so the customer never spends more than <code>total</code>). Then <span class="ep">POST /convert_withdraw/execute</span> with the <code>quote_id</code>; the crypto is sent on-chain and you track it via <span class="ep">GET /withdrawals/requests/{id}</span>. Fund your fiat accounts first (pre-funded in Cert).</p>`, code: [{ lang: "bash", label: "POST /convert_withdraw/rfq", text: curl("POST", "/convert_withdraw/rfq", { participant_code: "CUST01", side: "buy", underlying: first, quoted_currency: "USD", total: 20, withdrawal_address: "2N8PYGKSQRpHa5VDNZ4iLwxi5crpRWb3TR1", quote_expiry: a.expiry || "30s" }) }], links: [link("on-ramp-integration-guide")] });
      if (a.dir !== "on") ph.steps.push({ title: "Off-ramp: deposit, then sell for dollars", html: `<p>Create an address with <span class="ep">POST /deposits/digital_asset_addresses</span>; when the deposit lands you get an account-balance webhook. Quote the sale with <span class="ep">POST /liquidity/rfq</span> (side <code>sell</code>${a.money !== "spread" ? ", adding a <code>fees</code> array for explicit fees" : ""}) and execute with <span class="ep">POST /liquidity/execute</span>.</p>`, code: [{ lang: "bash", label: "POST /liquidity/rfq — sell", text: curl("POST", "/liquidity/rfq", Object.assign({ participant_code: "CUST01", side: "sell", underlying: first, quoted_currency: "USD", quantity: "1" }, a.money !== "spread" ? { fees: [{ amount: "2.50", name: "processing-1" }] } : {})) }], links: [link("off-ramp-integration-guide")] });
      ph.config.push(`Quote length ${a.expiry || "30s"}`, a.money !== "fee" ? "Pre-configure your spread percentage" : "Fees are sent per request", "Email receipts are required for on-ramp transactions");
      return ph;
    },
    staking(a, { link, ref }) {
      const ph = { title: "Staking", intro: "", steps: [], config: [] }, asset = a.asset || "ETH";
      ph.intro = `${asset} staking through zerohash-operated validators, with a ${a.pct || 30}% platform fee on rewards. API only — no SDK.`;
      ph.steps.push({ title: "Check eligibility and show the terms", html: `<p>The customer must be <code>approved</code>, live outside CA, MD, NJ and WA, hold enough ${asset} in their <code>available</code> balance, and have a <code>staking</code> agreement on file (one acceptance covers all assets). <span class="ep">GET /assets/{asset}/staking_info</span> gives the net APY (already after your fee), activation time and unstake period to display.</p>`, code: [{ lang: "bash", label: `GET /assets/${asset}/staking_info`, text: curl("GET", `/assets/${asset}/staking_info`) }], links: [link("staking")] });
      ph.steps.push({ title: "Stake, then track the lifecycle", html: `<p><span class="ep">POST /stakes</span> takes the <code>amount</code> to stake; store the returned <code>stake_id</code> and show <code>estimated_active_at</code>. Requests can be cancelled with <span class="ep">POST /stakes/{stake_id}/cancel</span> only while <code>submitted</code> or <code>queued</code> — batches broadcast once daily, and after that the user must wait to unstake. Watch the <code>stake.submitted</code> and later webhooks; consensus rewards compound into the stake, MEV rewards land in <code>available</code>.</p>`, code: [{ lang: "bash", label: "POST /stakes", text: curl("POST", "/stakes", { participant_code: "CUST01", asset, amount: "0.5" }) + "\n# see the reference for the full request schema" }], links: [ref("post_stakes", "POST /stakes"), link("staking-faqs", "Staking FAQs")] });
      ph.config.push(`Platform fee on gross rewards: ${a.pct || 30}% (zerohash recommends 25–35%)`, "Signature-verified webhook endpoint for staking events", ...(asset === "SOL" ? ["SOL staking is slated for Q4 2026 — confirm availability"] : []));
      return ph;
    },
    saas(a, { link, ref }) {
      const ph = { title: "Settlements as a Service", intro: "", steps: [], config: [] }, assets = a.assets || ["BTC"], first = assets[0], sym = first.split(".")[0];
      ph.intro = `${a.model === "principal" ? "Principal dealer" : "Agency / broker-exchange"} model; zerohash acts as calculation and settlement agent for ${assets.join(", ")} trades with DVP finality.`;
      ph.steps.push({ title: "Create the deposit address for the receiving side", html: `<p>Both counterparties must be approved participants. Create an address with <span class="ep">POST /deposits/digital_asset_addresses</span> for the party receiving the asset. The deposit must equal the trade quantity exactly — don't net out network fees.</p>`, code: [{ lang: "bash", label: "POST /deposits/digital_asset_addresses", text: curl("POST", "/deposits/digital_asset_addresses", { participant_code: "CUST01", platform_code: "PLAT01", asset: first, account_label: "general" }) }], links: [link("settlements-as-a-service-integration-guide")] });
      ph.steps.push({ title: "Submit the trade, wait for settled", html: `<p><span class="ep">POST /trades</span> describes both legs${a.model === "principal" ? " — your platform is one of the parties" : ""}. Trades process immediately; confirm with <span class="ep">GET /trades/{trade_id}</span> showing <code>trade_state: terminated</code> and <code>settlement_state: settled</code> before withdrawing via <span class="ep">POST /withdrawals/requests</span>.</p>`, code: [{ lang: "bash", label: "POST /trades", text: curl("POST", "/trades", { symbol: `${sym}/USD`, trade_price: "7000.00000", product_type: "spot", trade_type: "regular", trade_reporter: "reporter@platform.com", platform_code: "PLAT01", client_trade_id: "test1", physical_delivery: true, parties_anonymous: false, transaction_timestamp: 1569014063570, parties: [{ participant_code: "ABCDEF", asset: sym, amount: "0.5", side: "buy", settling: true }, { participant_code: "PLAT01", asset: "USD", amount: "3500.0000", side: "sell", settling: false }] }) }], links: [ref("post_trades", "POST /trades"), link("settlements-as-a-service")] });
      ph.config.push("Onboard trading counterparties (zerohash legal and compliance can help)");
      return ph;
    },
    token(a, { link, ref }) {
      const ph = { title: "Tokenization Engine", intro: "", steps: [], config: [] }, chains = a.chains || ["ETH"];
      ph.intro = `${a.kind === "nft" ? "Non-fungible tokens" : "A fungible token"} on ${chains.join(", ")}, with zerohash operating the contracts and abstracting gas.`;
      if (a.kind === "nft") ph.steps.push({ title: "Mint, transfer and redeem NFTs", html: `<p>Each token ID is minted once with amount 1 and can be linked to an off-chain asset identifier, with metadata via a URI you configure. <span class="ep">POST /token/mint</span>, <span class="ep">POST /v1/token/transfer</span>, <span class="ep">POST /token/burn</span>; poll <span class="ep">GET /token/{token_request_id}</span> for status.</p>`, links: [link("non-fungible-token-nft-integration", "Non-Fungible Tokens (NFT)")] });
      else ph.steps.push({ title: "Mint after collateral is locked", html: `<p><span class="ep">POST /v1/token/mint</span> with the amount (up to 6 decimals), your network-qualified token symbol, an idempotent <code>client_request_id</code> and the receiving wallet. Burn with <span class="ep">POST /v1/token/burn</span>, batch-transfer with <span class="ep">POST /v1/token/transfer</span>, and watch status at <span class="ep">GET /token/{token_request_id}</span>. Compliance operations — pause/unpause, freeze, wipe — have their own endpoints.</p>`, code: [{ lang: "bash", label: "POST /v1/token/mint", text: curl("POST", "/v1/token/mint", { amount: "1.56", token_symbol: `USDFI.${chains[0]}`, client_request_id: "22b6cbea-1c77-415f-b866-2987b0b869ab", participant_code: "SB5LRL", receiver: "0x45D9A0Ee3a917Eccd6182C030dC9f18897eCf79E" }) }], links: [link("fungible-token-11-stablecoin-integration", "Fungible Tokens")] });
      ph.config.push("Contract deployment and role configuration with zerohash", "Choose who pays network fees and in which currency (USD or crypto)");
      return ph;
    },
  };

  function highlight(text, lang) {
    let h = esc(text);
    if (lang === "json" || lang === "bash") {
      h = h.replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="k">$1</span>$2')
           .replace(/:\s*(&quot;[^&]*?&quot;)/g, (m, s) => m.replace(s, `<span class="s">${s}</span>`))
           .replace(/:\s*(\d+(\.\d+)?|true|false|null)(?=[,\s\n}])/g, (m, v) => m.replace(v, `<span class="n">${v}</span>`));
    }
    if (lang === "bash") h = h.replace(/(^|\n)(#[^\n]*)/g, '$1<span class="c">$2</span>');
    if (lang === "javascript") h = h.replace(/(\/\/[^\n]*)/g, '<span class="c">$1</span>').replace(/('[^'\n]*')/g, '<span class="s">$1</span>');
    return h;
  }
  function codeBlock(c) {
    const w = el(`<div class="codewrap"><div class="codebar"><span>${esc(c.label)}</span><button type="button">Copy</button></div><pre><code>${highlight(c.text, c.lang)}</code></pre></div>`);
    w.querySelector("button").onclick = () => copy(c.text, "Copied");
    return w;
  }
  function copy(text, msg) { navigator.clipboard.writeText(text).then(() => toast(msg || "Copied")).catch(() => toast("Couldn't copy — select the text instead")); }
  let toastT; function toast(m) { const t = $(".toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1600); }

  function viewGuide() {
    const phases = buildGuide(), R = REGIONS[S.region];
    const v = el(`<section>
      <div class="guide-head"><div><p class="eyebrow">Your setup guide</p><p class="h1">Here's how to build it</p></div><button type="button" class="btn small copymd">Copy guide as Markdown</button></div>
      <p class="lede">Directions and code for ${S.products.length} product${S.products.length > 1 ? "s" : ""}, in the order you'll actually do them. Placeholders like <code>$ZH_PUBLIC_KEY</code> and <code>CUST01</code> are yours to fill in. Items marked for zerohash are platform settings their team configures with you.</p>
      <div class="summary"></div><div class="phases"></div></section>`);
    const sum = v.querySelector(".summary");
    [["Region", R.name], ["Sandbox", host().replace("https://", "")], ["Customers", S.customers], ["KYC", S.kyc === "sdk" ? "Onboarding SDK" : "Own KYC via API"], ...S.products.map(p => ["Product", PRODUCTS.find(x => x.id === p).name])].forEach(([k, val]) => sum.append(el(`<span class="pill">${esc(k)} <b>${esc(val)}</b></span>`)));
    const box = v.querySelector(".phases");
    phases.forEach((ph) => {
      const sec = el(`<section class="phase"><p class="phase-eyebrow">${esc(ph.eyebrow)}</p><p class="h2">${esc(ph.title)}</p>${ph.intro ? `<p class="intro">${esc(ph.intro)}</p>` : ""}</section>`);
      ph.steps.forEach((st, i) => {
        const g = el(`<div class="gstep"><div class="n">${i + 1}</div><div><p class="h3">${esc(st.title)}</p>${st.html || ""}</div></div>`);
        const body = g.children[1];
        (st.code || []).forEach(c => body.append(codeBlock(c)));
        if (st.links && st.links.length) body.append(el(`<p class="links">${st.links.map(([l, u]) => `<a href="${u}"${u.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${esc(l)} ↗</a>`).join("")}</p>`));
        sec.append(g);
      });
      if (ph.config && ph.config.length) sec.append(el(`<div class="note"><span class="i">Ask zerohash</span><div><b>Platform settings to arrange with your zerohash team</b><ul class="checklist">${ph.config.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div></div>`));
      box.append(sec);
    });
    v.querySelector(".copymd").onclick = () => copy(toMarkdown(phases), "Guide copied as Markdown");
    return v;
  }
  function toMarkdown(phases) {
    const strip = (h) => h.replace(/<br\s*\/?>/g, "\n").replace(/<li>/g, "\n- ").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\n{3,}/g, "\n\n").trim();
    let md = `# zerohash setup guide\n\nRegion: ${REGIONS[S.region].name} · Sandbox host: ${host()}\nProducts: ${S.products.map(p => PRODUCTS.find(x => x.id === p).name).join(", ")}\n\n`;
    for (const ph of phases) {
      md += `## ${ph.eyebrow} — ${ph.title}\n\n${ph.intro ? ph.intro + "\n\n" : ""}`;
      ph.steps.forEach((st, i) => { md += `### ${i + 1}. ${st.title}\n\n${strip(st.html || "")}\n\n`; (st.code || []).forEach(c => { md += `**${c.label}**\n\n\`\`\`${c.lang}\n${c.text}\n\`\`\`\n\n`; }); if (st.links && st.links.length) md += st.links.map(([l, u]) => `- [${l}](${u.startsWith("http") ? u : location.origin + u})`).join("\n") + "\n\n"; });
      if (ph.config && ph.config.length) md += `**Ask zerohash to configure**\n\n${ph.config.map(c => `- [ ] ${c}`).join("\n")}\n\n`;
    }
    return md;
  }

  /* ---------------- mounting ---------------- */
  function mountWizard() {
    const root = document.getElementById("zh-wizard-root");
    if (!root || root.dataset.mounted) return;
    root.dataset.mounted = "1"; ROOT = root;
    // products handed over from the landing page: /setup-wizard?products=fund,trade
    const pre = new URLSearchParams(location.search).get("products");
    if (pre) { const ids = pre.split(",").map(s => s.trim()).filter(id => PRODUCT_IDS.includes(id)); if (ids.length) { S.products = ids; S.step = 0; } }
    root.innerHTML = `<nav class="rail" aria-label="Wizard steps"><p class="rail-title">Your setup</p><ol class="steps"></ol><p class="rail-note">Every direction and payload here comes from these docs — each section links to the page it was drawn from. Your choices are saved in this browser.</p></nav><main class="main"></main><div class="toast" role="status" aria-live="polite"></div>`;
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
      if (sec.classList.contains("is-select")) {
        toggle.textContent = selected.size ? `Continue with ${selected.size} product${selected.size > 1 ? "s" : ""} →` : "Select products to continue";
        toggle.disabled = selected.size === 0;
      } else { toggle.textContent = "Generate custom guide"; toggle.disabled = false; }
    };
    toggle.addEventListener("click", () => {
      if (!sec.classList.contains("is-select")) { sec.classList.add("is-select"); sync(); return; }
      if (selected.size) location.href = `/setup-wizard?products=${[...selected].join(",")}`;
    });
    cancel && cancel.addEventListener("click", () => { sec.classList.remove("is-select"); selected.clear(); sync(); });
    cards.forEach(c => c.addEventListener("click", (e) => {
      if (!sec.classList.contains("is-select")) return;              // normal mode: follow the link
      e.preventDefault();
      selected.has(c.dataset.product) ? selected.delete(c.dataset.product) : selected.add(c.dataset.product);
      c.setAttribute("aria-pressed", selected.has(c.dataset.product));
      sync();
    }));
    sync();
  }

  const boot = () => { mountWizard(); mountLanding(); };
  boot();
  new MutationObserver(boot).observe(document.documentElement, { childList: true, subtree: true });
})();
