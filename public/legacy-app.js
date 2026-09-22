/* Button classes: keep in sync with lib/legacy-button-classes.ts + globals.css */
var PB_BTN_CTA = 'pb-btn-cta';
var PB_BTN_CTA_W = 'pb-btn-cta w-full';
var PB_BTN_CTA_SM = 'pb-btn-cta-sm';
var PB_BTN_CTA_SM_W = 'pb-btn-cta-sm w-full';
var PB_BTN_OUTLINE = 'pb-btn-outline';
var PB_BTN_OUTLINE_W = 'pb-btn-outline w-full';
var PB_BTN_OUTLINE_SM = 'pb-btn-outline-sm';

  /* ============== GENERIC CUSTOM DROPDOWN (opaque + high z-index) ============== */
  function ddMarkup(id, options, selectedValue){
    const sel = options.find(o=>o.value===selectedValue) || options[0];
    const optionsHtml = options.map(o=>
      '<div class="dd-option cursor-pointer rounded-sm px-3 py-2 text-sm leading-snug text-white/90 transition-colors duration-150 hover:bg-white/[0.08] [&.active]:bg-white/[0.12] [&.active]:text-white ' + (o.value===sel.value?'active':'') + '" data-value="' + o.value + '" onclick="selectDropdown(\'' + id + '\',\'' + o.value + '\',event)">' + o.label + '</div>'
    ).join('');
    return '<div class="dd relative [&.open]:z-[100]" id="' + id + '" data-value="' + sel.value + '">' +
        '<button type="button" class="dd-trigger flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-sm border border-white/[0.09] bg-white/[0.065] px-3 py-2 text-left text-sm font-medium text-white shadow-none backdrop-blur-[10px] transition-all duration-200 hover:bg-white/[0.09] focus-visible:border-magenta/30 focus-visible:bg-white/[0.12] focus-visible:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] focus-visible:outline-none [.open_&]:border-magenta/30 [.open_&]:bg-white/[0.12] [.open_&]:shadow-[0_0_0_2px_rgba(232,56,255,0.4)]" onclick="toggleDropdown(\'' + id + '\',event)">' +
          '<span class="dd-value truncate">' + sel.label + '</span><span class="dd-chevron shrink-0 text-xs text-mist transition-transform duration-200 [.open_&]:rotate-180">▾</span></button>' +
        '<div class="dd-panel absolute top-[calc(100%+6px)] left-0 right-0 z-[100] max-h-[280px] overflow-y-auto rounded-sm border border-white/[0.12] bg-dd-panel p-1 opacity-0 pointer-events-none -translate-y-1 scale-[0.99] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)] transition-all duration-200 [&.open]:pointer-events-auto [&.open]:translate-y-0 [&.open]:scale-100 [&.open]:opacity-100">' + optionsHtml + '</div></div>';
  }
  function mountDropdown(mountId, ddId, options, selectedValue){ document.getElementById(mountId).innerHTML = ddMarkup(ddId, options, selectedValue); }
  function closeAllDropdowns(){
    document.querySelectorAll('.dd').forEach(d=>{
      d.classList.remove('open');
      const panel = d.querySelector('.dd-panel');
      if(panel) panel.classList.remove('open');
    });
  }
  function toggleDropdown(id, e){
    e.stopPropagation();
    const root = document.getElementById(id);
    if(!root) return;
    const panel = root.querySelector('.dd-panel');
    if(!panel) return;
    const isOpen = panel.classList.contains('open');
    closeAllDropdowns();
    if(!isOpen){ root.classList.add('open'); panel.classList.add('open'); }
  }
  function selectDropdown(id, value, e){
    if(e && e.stopPropagation) e.stopPropagation();
    const root = document.getElementById(id);
    let label = value;
    root.querySelectorAll('.dd-option').forEach(o=>{ const active = o.dataset.value === value; o.classList.toggle('active', active); if(active) label = o.textContent; });
    root.dataset.value = value;
    root.querySelector('.dd-value').textContent = label;
    root.classList.remove('open');
    root.querySelector('.dd-panel').classList.remove('open');
    onDropdownChange(id, value);
  }
  document.addEventListener('click', (e)=>{
    if(e.target instanceof Element && e.target.closest('.dd')) return;
    closeAllDropdowns();
  });
  function onDropdownChange(id, value){ if(id === 'dd-platform' || id === 'dd-category' || id === 'dd-license'){ applyFilters(); } }

  const platformOptions = [
    {value:'all', label:'Všechny formáty'}, {value:'ig-story', label:'Instagram Story'}, {value:'ig-reel', label:'Instagram Reel'},
    {value:'tiktok', label:'TikTok Video'}, {value:'yt-shorts', label:'YouTube Shorts'}, {value:'ugc', label:'UGC do reklamy'},
  ];
  const categoryOptions = [
    {value:'all', label:'Všechny obory'}, {value:'fitness', label:'Fitness & Health'}, {value:'fashion', label:'Móda & Beauty'},
    {value:'gaming', label:'Gaming & E-sports'}, {value:'gastro', label:'Gastro & Jídlo'}, {value:'tech', label:'Tech & Gadgets'}, {value:'lifestyle', label:'Lifestyle'},
  ];
  const licenseOptions = [
    {value:'30', label:'30 dní'}, {value:'60', label:'60 dní'}, {value:'90', label:'90 dní'}, {value:'unlimited', label:'Neomezeně'},
  ];
  const licenseFilterOptions = [ {value:'all', label:'Jakákoliv délka'} ].concat(licenseOptions);
  function licenseLabel(val){ const o = licenseOptions.find(x=>x.value===val); return o ? o.label : val; }

  mountDropdown('dd-platform-mount','dd-platform', platformOptions, 'all');
  mountDropdown('dd-category-mount','dd-category', categoryOptions, 'all');
  mountDropdown('dd-license-mount','dd-license', licenseFilterOptions, 'all');
  const categoryOptionsNoAll = categoryOptions.filter(o=>o.value!=='all');
  mountDropdown('dd-profile-category-mount','dd-profile-category', categoryOptionsNoAll, 'fitness');
  mountDropdown('dd-job-category-mount','dd-job-category', categoryOptionsNoAll, 'fitness');

  const pkgFormatOptions = [ {value:'tiktok', label:'TikTok Video'}, {value:'ig-reel', label:'IG Reel'}, {value:'ig-story', label:'IG Story'}, {value:'yt-shorts', label:'YouTube Shorts'}, {value:'ugc', label:'UGC do reklamy'} ];
  const pkgDeliveryOptions = [ {value:'3', label:'3 dny'}, {value:'7', label:'7 dní'}, {value:'14', label:'14 dní'} ];
  mountDropdown('dd-pkg-format-mount','dd-pkg-format', pkgFormatOptions, 'ig-reel');
  mountDropdown('dd-pkg-delivery-mount','dd-pkg-delivery', pkgDeliveryOptions, '7');
  mountDropdown('dd-pkg-license-mount','dd-pkg-license', licenseOptions, '30');

  mountDropdown('dd-staging-format-mount','dd-staging-format', pkgFormatOptions, 'ig-reel');
  mountDropdown('dd-staging-delivery-mount','dd-staging-delivery', pkgDeliveryOptions, '7');
  mountDropdown('dd-staging-license-mount','dd-staging-license', licenseOptions, '30');

  /* ============== VIEW SWITCHER ============== */
  function switchView(view){
    const firms = document.getElementById('view-firms'), creators = document.getElementById('view-creators');
    const navFirms = document.getElementById('nav-firms'), navCreators = document.getElementById('nav-creators');
    const ctaFirms = document.getElementById('nav-cta-firms'), ctaCreators = document.getElementById('nav-cta-creators');
    const switchFirms = document.getElementById('switch-firms'), switchCreators = document.getElementById('switch-creators');
    const switchFirmsM = document.getElementById('switch-firms-m'), switchCreatorsM = document.getElementById('switch-creators-m');
    if(view === 'creators'){
      firms.classList.add('hidden'); creators.classList.remove('hidden');
      navFirms.classList.add('view-hidden'); navCreators.classList.remove('view-hidden');
      if(ctaFirms && ctaCreators){ ctaFirms.classList.add('hidden'); ctaCreators.classList.remove('hidden'); }
      switchFirms?.classList.remove('active'); switchCreators?.classList.add('active');
      switchFirmsM?.classList.remove('active'); switchCreatorsM?.classList.add('active');
    } else {
      creators.classList.add('hidden'); firms.classList.remove('hidden');
      navCreators.classList.add('view-hidden'); navFirms.classList.remove('view-hidden');
      if(ctaFirms && ctaCreators){ ctaCreators.classList.add('hidden'); ctaFirms.classList.remove('hidden'); }
      switchCreators?.classList.remove('active'); switchFirms?.classList.add('active');
      switchCreatorsM?.classList.remove('active'); switchFirmsM?.classList.add('active');
    }
    window.scrollTo({top:0, behavior:'smooth'});
  }
  function scrollToId(id){ setTimeout(()=>{ const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth'}); }, 60); }

  /* ============== DATA — tvůrci v tržišti =============
     Prázdné pole: žádní vymyšlení lidé. Skuteční tvůrci se sem přidávají
     výhradně přes tlačítko "Vygenerovat profil do tržiště" v sekci Propojení
     (funkce generateRealProfile), případně načtením z databáze (viz TODO
     u DataService.fetchCreators níže). */
  const creators = [];

  const platformLabels = { 'ig-story':'IG Story', 'ig-reel':'IG Reel', 'tiktok':'TikTok', 'yt-shorts':'YT Shorts', 'ugc':'UGC' };
  const grid = document.getElementById('grid'), resultCount = document.getElementById('result-count'), emptyState = document.getElementById('empty-state');
  function minPrice(c){ return Math.min(...c.packages.map(p=>p.price)); }
  function packagesSummary(c){ return c.packages.map(p=>p.name).join(' · '); }
  function bestLicenseLabel(c){
    const p = c.packages.slice().sort((a,b)=>a.price-b.price)[0];
    return licenseLabel(p.license || '30');
  }

  function avatarHtml(c, size){
    if(c.avatarUrl){ return '<img src="' + c.avatarUrl + '" class="w-' + size + ' h-' + size + ' rounded-full object-cover">'; }
    return '<div class="w-' + size + ' h-' + size + ' rounded-full bg-gradient-to-br ' + c.grad + ' flex items-center justify-center font-display font-bold text-white text-sm">' + c.initials + '</div>';
  }

  function cardTemplate(c, i){
    return '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_60px_-20px_rgba(124,58,237,0.5)] hover:border-magenta/40 flex flex-col animate-fade-up" style="animation-delay:' + ((i%8)*0.04) + 's' + (c.isPro ? '; border-color:rgba(99,102,241,0.45);' : '') + '">' +
        (c.isPro ? '<span class="inline-flex items-center gap-1 self-start mb-3 px-2.5 py-1 rounded-md text-[10px] font-mono text-[11px] tracking-wide font-semibold text-white" style="background:linear-gradient(92deg,#6366f1,#8b5cf6);">⭐ PRO Tvůrce</span>' : '') +
        '<div class="flex items-center gap-3 mb-4"><div class="rounded-full bg-gradient-to-br from-violet via-magenta to-cyan p-[2.5px] shrink-0">' + avatarHtml(c,14) + '</div>' +
          '<div class="min-w-0"><p class="font-semibold leading-tight truncate">' + c.name + '</p><p class="text-zinc-200 text-xs truncate">' + c.categoryLabel + '</p></div></div>' +
        '<div class="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-[11px] tracking-wide text-mist mb-3"><span>👥 <span class="text-white font-semibold">' + c.followers + '</span> sledujících</span><span>📈 <span class="text-white font-semibold">' + c.reach + '</span> dosah/30 dní</span></div>' +
        '<p class="text-[11px] font-mono text-[11px] tracking-wide text-zinc-200 mb-3">🎯 publikum ' + c.audienceAge + '</p>' +
        '<div class="flex flex-wrap gap-1.5 mb-3">' + c.platforms.map(p=>'<span class="font-mono text-[11px] tracking-wide px-2 py-1 rounded-md bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-[10px] text-cyan-200">' + platformLabels[p] + '</span>').join('') + '</div>' +
        '<span class="font-mono text-[11px] tracking-wide inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-[10px] text-cyan-200 self-start mb-3">🏷 licence od ' + bestLicenseLabel(c) + '</span>' +
        '<p class="text-sm text-zinc-200 mb-4">' + packagesSummary(c) + '</p>' +
        '<div class="mt-auto flex items-center justify-between pt-4 border-t border-white/10"><div><p class="text-[10px] font-mono text-[11px] tracking-wide text-zinc-200 uppercase">od</p><p class="font-display font-bold text-lg bg-gradient-to-r from-accent-soft via-magenta to-cyan bg-clip-text text-transparent">' + minPrice(c).toLocaleString('cs-CZ') + ' Kč</p></div>' +
          '<button onclick="openDetail(' + i + ')" class="pb-btn-cta-sm">Detail a balíčky</button></div></div>';
  }
  const emptyStateIcon = document.getElementById('empty-state-icon');
  const emptyStateCtaCreator = document.getElementById('empty-state-cta-creator');
  const emptyStateCtaReset = document.getElementById('empty-state-cta-reset');
  const emptyIconUsers =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  const emptyIconSearch =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';

  function renderGrid(list){
    if(list.length === 0){
      grid.classList.add('hidden'); emptyState.classList.remove('hidden');
      if(creators.length === 0){
        document.getElementById('empty-state-title').textContent = 'Zatím tu nejsou žádní tvůrci';
        document.getElementById('empty-state-subtitle').textContent = 'Jsi influencer nebo UGC tvůrce? Vytvoř si profil a buď tu první — značky tě pak najdou podle platformy, oboru a ceny.';
        if(emptyStateIcon) emptyStateIcon.innerHTML = emptyIconUsers;
        emptyStateCtaCreator?.classList.remove('hidden');
        emptyStateCtaReset?.classList.add('hidden');
      } else {
        document.getElementById('empty-state-title').textContent = 'Žádný tvůrce neodpovídá filtru';
        document.getElementById('empty-state-subtitle').textContent = 'Zkus zvýšit rozpočet nebo změnit platformu, obor nebo licenci.';
        if(emptyStateIcon) emptyStateIcon.innerHTML = emptyIconSearch;
        emptyStateCtaCreator?.classList.add('hidden');
        emptyStateCtaReset?.classList.remove('hidden');
      }
    }
    else { grid.classList.remove('hidden'); emptyState.classList.add('hidden'); grid.innerHTML = list.map((c)=>cardTemplate(c, creators.indexOf(c))).join(''); }
    resultCount.textContent = list.length + ' ' + plural(list.length) + ' odpovídá filtru';
  }
  function resetMarketplaceFilters(){
    selectDropdown('dd-platform', 'all', {stopPropagation:function(){}});
    selectDropdown('dd-category', 'all', {stopPropagation:function(){}});
    selectDropdown('dd-license', 'all', {stopPropagation:function(){}});
    const budgetReset = document.getElementById('f-budget');
    if(budgetReset){
      budgetReset.value = 30000;
      const label = document.getElementById('f-budget-label');
      if(label) label.textContent = '30 000 Kč';
      syncBudgetRangeFill(budgetReset);
    }
    applyFilters();
  }
  function plural(n){ if(n === 1) return 'tvůrce'; if(n >= 2 && n <= 4) return 'tvůrci'; return 'tvůrců'; }
  function applyFilters(){
    const platform = document.getElementById('dd-platform').dataset.value;
    const category = document.getElementById('dd-category').dataset.value;
    const license = document.getElementById('dd-license').dataset.value;
    const budget = parseInt(document.getElementById('f-budget').value, 10);
    const filtered = creators.filter(c=>{
      const platformOk = platform === 'all' || c.platforms.includes(platform);
      const categoryOk = category === 'all' || c.category === category;
      const licenseOk = license === 'all' || c.packages.some(p=>(p.license || '30') === license);
      const budgetOk = minPrice(c) <= budget;
      return platformOk && categoryOk && licenseOk && budgetOk;
    });
    // Topování na tržišti — Creator PRO profily se řadí vždy první
    filtered.sort((a,b)=> (b.isPro?1:0) - (a.isPro?1:0));
    renderGrid(filtered);
  }
  function syncBudgetRangeFill(el){
    el = el || document.getElementById('f-budget');
    if(!el) return;
    const min = parseInt(el.min, 10);
    const max = parseInt(el.max, 10);
    const val = parseInt(el.value, 10);
    el.style.setProperty('--range-fill', ((val - min) / (max - min)) * 100 + '%');
  }
  const budgetInput = document.getElementById('f-budget');
  if(budgetInput){
    syncBudgetRangeFill(budgetInput);
    budgetInput.addEventListener('input', (e)=>{
      document.getElementById('f-budget-label').textContent = parseInt(e.target.value,10).toLocaleString('cs-CZ') + ' Kč';
      syncBudgetRangeFill(e.target);
      applyFilters();
    });
  }
  document.getElementById('search-btn').addEventListener('click', ()=>{ applyFilters(); document.getElementById('marketplace').scrollIntoView({behavior:'smooth'}); });
  renderGrid(creators);

  /* ============== MODAL BASE ============== */
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  function showModal(){ modal.classList.remove('hidden'); modal.classList.add('flex'); document.body.style.overflow = 'hidden'; }
  function closeModal(){ modal.classList.add('hidden'); modal.classList.remove('flex'); document.body.style.overflow = ''; }
  modal.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

  function securityBadge(){
    return '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-2xl p-4 flex gap-3 items-start mb-6" style="border-color: rgba(0,229,255,0.3);"><span class="text-xl">🛡️</span>' +
      '<p class="text-xs text-zinc-200 leading-relaxed"><span class="text-white font-semibold">Garance bezpečnosti promobazar.cz:</span> Vaše platba je držena v úschově a tvůrci je vyplácena až po schválení hotového videa. Obchodování mimo platformu ruší záruku vracení peněz.</p></div>';
  }
  /* Portfolio / Ukázky práce — vychází z reálných odkazů, které si tvůrce
     přidá v Nastavení účtu (creators[i].portfolio). Prázdný slot ukazuje
     čestný "zatím bez ukázky" stav, žádná předstíraná videa. */
  function detectPortfolioPlatform(url){
    if(/tiktok\.com/i.test(url)) return '🎵 TikTok';
    if(/instagram\.com/i.test(url)) return '📸 Instagram';
    if(/youtu\.?be/i.test(url)) return '▶️ YouTube';
    return '🔗 Odkaz';
  }
  function portfolioPreview(c){
    const grads = ['from-violet-600 to-fuchsia-600','from-cyan-600 to-blue-600','from-fuchsia-600 to-violet-600'];
    const items = ((c && c.portfolio) || []).filter(Boolean).slice(0,3);
    let html = '<p class="text-sm text-zinc-200 mb-3 font-mono text-[11px] tracking-wide uppercase">Portfolio · ukázky práce</p><div class="grid grid-cols-3 gap-3 mb-6">';
    for(let i=0;i<3;i++){
      const url = items[i];
      if(url){
        html += '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="group relative flex aspect-[9/16] cursor-pointer items-center justify-center overflow-hidden rounded-[14px] no-underline bg-gradient-to-br ' + grads[i] + '">' +
          '<div class="z-[2] flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">▶</div>' +
          '<span class="font-mono text-[11px] tracking-wide absolute top-2 left-2 bg-black/40 px-1.5 py-0.5 rounded text-[9px]">' + detectPortfolioPlatform(url) + '</span>' +
        '</a>';
      } else {
        html += '<div class="group relative flex aspect-[9/16] cursor-pointer items-center justify-center overflow-hidden rounded-[14px] border-2 border-dashed border-white/10 flex items-center justify-center bg-white/[0.03]">' +
          '<span class="text-mist text-[10px] font-mono text-[11px] tracking-wide px-2 text-center leading-relaxed">Zatím bez ukázky</span>' +
        '</div>';
      }
    }
    html += '</div>'; return html;
  }

  /* platform tab price switcher inside detail modal */
  function priceTabIcon(format){ return {tiktok:'🎵 TT', 'ig-reel':'📸 IG Reel', 'ig-story':'📸 IG Story', 'yt-shorts':'▶️ YT', ugc:'🎬 UGC'}[format] || format; }
  function renderPriceTabContent(ci, p){
    return '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-5 mt-4">' +
      '<div class="flex items-start justify-between gap-4 mb-2"><p class="font-semibold text-sm">' + p.name + '</p><p class="font-display font-bold text-xl bg-gradient-to-r from-accent-soft via-magenta to-cyan bg-clip-text text-transparent whitespace-nowrap">' + p.price.toLocaleString('cs-CZ') + ' Kč</p></div>' +
      '<p class="text-zinc-200 text-xs mb-3">' + platformLabels[p.format] + ' · doručení ' + p.delivery + ' dní · ' + p.revisions + '× revize</p>' +
      '<p class="text-white/70 text-xs mb-3">' + p.description + '</p>' +
      '<span class="font-mono text-[11px] tracking-wide inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-[10px] text-cyan-200 mb-4">🏷 Licence pro placenou reklamu (Meta/TikTok Ads): ' + licenseLabel(p.license || '30') + '</span>' +
      '<button onclick="openOrderForPackage(' + ci + ',' + p.id + ')" class="pb-btn-cta-sm w-full">Objednat balíček</button></div>';
  }
  function selectPriceTab(ci, pkgId){
    const c = creators[ci];
    document.querySelectorAll('.price-tab').forEach(t=> t.classList.toggle('active', parseInt(t.dataset.pkg,10) === pkgId));
    const p = c.packages.find(x=>x.id === pkgId);
    document.getElementById('price-tab-content').innerHTML = renderPriceTabContent(ci, p);
  }

  function openDetail(i){
    const c = creators[i];
    c.viewCount = (c.viewCount || 0) + 1;
    const tabs = c.packages.map(p=>'<button class="price-tab transition-all duration-300 [&.active]:border-transparent [&.active]:bg-gradient-to-r [&.active]:from-violet [&.active]:via-magenta [&.active]:to-cyan [&.active]:text-white ' + (p.id===c.packages[0].id?'active':'') + ' bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-xs font-semibold px-3.5 py-2 rounded-lg" data-pkg="' + p.id + '" onclick="selectPriceTab(' + i + ',' + p.id + ')">' + priceTabIcon(p.format) + '</button>').join('');
    modalContent.innerHTML =
      (c.isPro ? '<span class="inline-flex items-center gap-1 mb-3 px-2.5 py-1 rounded-md text-[10px] font-mono text-[11px] tracking-wide font-semibold text-white" style="background:linear-gradient(92deg,#6366f1,#8b5cf6);">⭐ PRO Tvůrce</span>' : '') +
      '<div class="flex items-center gap-4 mb-6"><div class="rounded-full bg-gradient-to-br from-violet via-magenta to-cyan p-[2.5px] shrink-0">' + avatarHtml(c,20) + '</div>' +
        '<div><h3 class="font-display font-bold text-xl">' + c.name + '</h3><p class="text-zinc-200 text-sm">' + c.categoryLabel + ' · publikum ' + c.audienceAge + '</p></div></div>' +
      socialHandleLinksHtml(c) +
      '<div class="grid grid-cols-3 gap-3 mb-6"><div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 text-center"><p class="font-display font-bold text-lg">' + c.followers + '</p><p class="text-zinc-200 text-[11px] font-mono text-[11px] tracking-wide mt-1">sledujících</p></div>' +
        '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 text-center"><p class="font-display font-bold text-lg">' + (c.avgViews || '—') + '</p><p class="text-zinc-200 text-[11px] font-mono text-[11px] tracking-wide mt-1">zhlédnutí / video</p></div>' +
        '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 text-center"><p class="font-display font-bold text-lg">' + c.reach + '</p><p class="text-zinc-200 text-[11px] font-mono text-[11px] tracking-wide mt-1">dosah / 30 dní</p></div></div>' +
      portfolioPreview(c) + securityBadge() +
      '<p class="text-sm text-zinc-200 mb-3 font-mono text-[11px] tracking-wide uppercase">Cena podle platformy (klikni na formát)</p>' +
      '<div class="flex flex-wrap gap-2">' + tabs + '</div>' +
      '<div id="price-tab-content">' + renderPriceTabContent(i, c.packages[0]) + '</div>';
    showModal();
  }

  function openOrderForPackage(ci, pkgId){
    requireAuth('brand', ()=> renderOrderForPackageForm(ci, pkgId));
  }
  function renderOrderForPackageForm(ci, pkgId){
    const c = creators[ci]; const p = c.packages.find(x=>x.id === pkgId);
    modalContent.innerHTML =
      '<button onclick="openDetail(' + ci + ')" class="text-mist text-xs mb-5 hover:text-white transition">← Zpět na profil ' + c.name + '</button>' +
      '<h3 class="font-display font-bold text-xl mb-1">Objednat balíček</h3>' +
      '<p class="text-zinc-200 text-sm mb-1">' + p.name + ' · ' + p.price.toLocaleString('cs-CZ') + ' Kč · doručení do ' + p.delivery + ' dní</p>' +
      '<p class="font-mono text-[11px] tracking-wide text-[11px] text-zinc-200 mb-6">Krok 1 ze 2 · přihlášen/a jako ' + currentUser.email + '</p>' +
      '<form onsubmit="goToBriefStep(event, ' + ci + ', ' + pkgId + ')" class="space-y-4">' +
        '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">URL e-shopu</label><input type="text" id="checkout-url" class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03]" placeholder="www.tvojeznacka.cz" required></div>' +
        '<button type="submit" class="pb-btn-cta w-full">Pokračovat k zadání →</button>' +
      '</form>';
    showModal();
  }
  function goToBriefStep(e, ci, pkgId){
    e.preventDefault();
    const c = creators[ci]; const p = c.packages.find(x=>x.id === pkgId);
    const email = currentUser.email;
    const shopUrl = document.getElementById('checkout-url').value.trim();
    modalContent.innerHTML =
      '<p class="font-mono text-[11px] tracking-wide text-[11px] text-zinc-200 mb-2">Krok 2 ze 2 · ' + email + '</p>' +
      '<h3 class="font-display font-bold text-xl mb-1">Poslat zadání / poptat promo</h3>' +
      '<p class="text-zinc-200 text-sm mb-6">' + p.name + ' · ' + p.price.toLocaleString('cs-CZ') + ' Kč · doručení do ' + p.delivery + ' dní</p>' +
      securityBadge() +
      '<form onsubmit="submitOrder(event, ' + ci + ', ' + pkgId + ', \'' + email.replace(/'/g,"") + '\', \'' + shopUrl.replace(/'/g,"") + '\')" class="space-y-4">' +
        '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Zadání pro tvůrce</label><textarea class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03] resize-none" rows="4" placeholder="Popiš produkt, tón komunikace a co má video zdůraznit..." required></textarea></div>' +
        '<button type="submit" class="pb-btn-cta w-full">Odeslat poptávku (bezpečná platba)</button>' +
        '<p class="text-center text-[11px] text-zinc-200 font-mono text-[11px] tracking-wide">Peníze se strhnou z tvého účtu až po schválení hotového videa.</p></form>';
  }

  function openConcierge(){
    requireAuth('brand', renderConciergeForm);
  }
  function renderConciergeForm(){
    modalContent.innerHTML =
      '<h3 class="font-display font-bold text-xl mb-1">Nech výběr na nás</h3>' +
      '<p class="text-zinc-200 text-sm mb-6">Popiš, co potřebuješ propagovat — do 24 hodin ti návrh 2–3 tvůrců z balíčku Growth nebo Scale pošleme na <span class="text-white">' + currentUser.email + '</span>.</p>' +
      '<form onsubmit="submitConcierge(event)" class="space-y-4">' +
        '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Přibližný rozpočet</label><input type="text" placeholder="např. 15 000 Kč / měsíc" class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03]" required></div>' +
        '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Co potřebuješ propagovat?</label><textarea rows="3" class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03] resize-none" placeholder="Produkt, cílovka, preferovaná platforma..." required></textarea></div>' +
        '<button type="submit" class="pb-btn-cta w-full">Odeslat požadavek</button>' +
      '</form>';
    showModal();
  }
  function submitConcierge(e){
    e.preventDefault();
    modalContent.innerHTML = successBlock('Požadavek odeslán', 'Do 24 hodin ti pošleme návrh 2–3 tvůrců z balíčku Growth/Scale přesně na míru tvému rozpočtu.');
  }

  function openOrderIntent(planName){
    requireAuth('brand', ()=> renderOrderIntentConfirm(planName));
  }
  function renderOrderIntentConfirm(planName){
    modalContent.innerHTML = '<h3 class="font-display font-bold text-xl mb-2">Balíček ' + planName + '</h3>' +
      '<p class="text-zinc-200 text-sm mb-6">Necháme ti zavolat ze zákaznické podpory na <span class="text-white">' + currentUser.email + '</span> a nastavíme účet přesně podle tvého rozpočtu.</p>' +
      '<button onclick="submitPlan(\'' + planName + '\')" class="pb-btn-cta w-full">Odeslat poptávku</button>';
    showModal();
  }

  /* ==============================================================
     AUTH — Supabase struktura
     ------------------------------------------------------------
     Google OAuth je napojený na reálný Supabase projekt (viz níže).
     E-mail+kód a Facebook zatím zůstávají jako mock (AuthService) —
     stejný vzor jako u Google, jen zatím bez skutečného volání.
  ============================================================== */
  const SUPABASE_URL = 'https://semynsirrzaiivtgmiia.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_4__dsz0Yl4tL8NatxLz1ig_B9CZB_WC';
  let supabaseClient = null;
  try {
    if(window.supabase && typeof window.supabase.createClient === 'function'){
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
      console.warn('Supabase JS se nenačetlo z CDN — Google přihlášení bude nedostupné, zbytek stránky funguje dál.');
    }
  } catch(err){
    console.warn('Supabase client se nepodařilo vytvořit:', err);
  }

  const AuthService = {
    async sendEmailCode(email){
      // TODO Supabase: const { error } = await supabaseClient.auth.signInWithOtp({ email });
      return new Promise(resolve => setTimeout(()=> resolve({ success:true }), 700));
    },
    async verifyEmailCode(email, code, role){
      // TODO Supabase: const { data, error } = await supabaseClient.auth.verifyOtp({ email, token: code, type:'email' });
      return new Promise(resolve => setTimeout(()=> resolve({ success:true, user:{ email, role } }), 700));
    },
    signOut(){
      if(supabaseClient) supabaseClient.auth.signOut();
      currentUser = null;
      refreshGates();
    }
  };

  let currentUser = null;
  let authRole = 'creator';
  let pendingAfterLogin = null;
  let pendingAuthEmail = null;

  function openAuth(role, afterCallback){
    authRole = role === 'brand' ? 'brand' : 'creator';
    pendingAfterLogin = afterCallback || null;
    modalContent.innerHTML = authStep1Markup();
    showModal();
  }

  /* ==============================================================
     JEDNOTNÁ KONTROLA PŘIHLÁŠENÍ — requireAuth()
     ------------------------------------------------------------
     Použij tuhle funkci VŠUDE, kde akce vyžaduje přihlášení (chat,
     odpověď na poptávku, dashboard, nastavení...), místo ručních
     "if(!currentUser)" kontrol na různých místech kódu. Sjednocuje
     chování v celé aplikaci a řeší nekonzistence, kdy různé části
     stránky reagovaly na auth stav jinak.
     - Pokud je uživatel přihlášený se správnou rolí, callback se
       spustí okamžitě.
     - Pokud přihlášený není, otevře se login/registrace a po
       úspěšném přihlášení se uživatel vrátí přesně tam, kde skončil
       (callback se spustí automaticky).
     - Pokud JE přihlášený, ale s OPAČNOU rolí, dostane jasné
       vysvětlení (ne obecnou výzvu k přihlášení) a možnost přepnout účet.
  ============================================================== */
  function requireAuth(role, callback){
    if(currentUser && (!role || currentUser.role === role)){ callback(); return true; }
    if(currentUser && role && currentUser.role !== role){ showRoleSwitchPrompt(role, callback); return false; }
    openAuth(role || 'creator', callback);
    return false;
  }
  function showRoleSwitchPrompt(role, callback){
    const neededLabel = role === 'creator' ? 'tvůrce' : 'značka';
    const currentLabel = currentUser.role === 'creator' ? 'tvůrce' : 'značka';
    window.__pendingRoleSwitchCb = callback;
    modalContent.innerHTML =
      '<div class="text-center py-6">' +
        '<div class="w-14 h-14 rounded-2xl bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] flex items-center justify-center mx-auto mb-5 text-2xl">🔒</div>' +
        '<h3 class="font-display font-bold text-xl mb-2">Tahle akce je pro účty typu „' + neededLabel + '"</h3>' +
        '<p class="text-zinc-200 text-sm max-w-sm mx-auto mb-6">Jsi přihlášen/a jako <span class="text-white font-semibold">' + currentLabel + '</span> (' + currentUser.email + '). Pro pokračování se přihlas účtem typu ' + neededLabel + '.</p>' +
        '<button onclick="handleLogout(); openAuth(\'' + role + '\', window.__pendingRoleSwitchCb);" class="pb-btn-cta">Přihlásit se jako ' + neededLabel + '</button>' +
      '</div>';
    showModal();
  }
  function authStep1Markup(){
    return '' +
      '<h3 class="font-display font-bold text-xl mb-1">Přihlášení / Registrace</h3>' +
      '<p class="text-zinc-200 text-sm mb-6">Bez hesla — stačí e-mail a ověřovací kód, nebo se přihlas přes Google.</p>' +
      '<div class="mb-6"><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-2">Jsem</label>' +
        '<div class="flex gap-2"><button type="button" id="role-creator" onclick="setAuthRole(\'creator\')" class="transition-all duration-200 [&.selected]:border-transparent [&.selected]:bg-gradient-to-r [&.selected]:from-violet [&.selected]:via-magenta [&.selected]:to-cyan [&.selected]:text-white ' + (authRole==='creator'?'selected':'') + ' bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] flex-1 py-2.5 rounded-xl text-sm font-semibold">Tvůrce</button>' +
        '<button type="button" id="role-brand" onclick="setAuthRole(\'brand\')" class="transition-all duration-200 [&.selected]:border-transparent [&.selected]:bg-gradient-to-r [&.selected]:from-violet [&.selected]:via-magenta [&.selected]:to-cyan [&.selected]:text-white ' + (authRole==='brand'?'selected':'') + ' bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] flex-1 py-2.5 rounded-xl text-sm font-semibold">Značka / E-shop</button></div></div>' +
      '<button id="google-auth-btn" onclick="authGoogle()" class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-3 mb-5 hover:bg-white/10 transition">' +
        '<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.5l6.6-6.6C35.4 2.5 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.7 6C12.2 13 17.6 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-2.8-.4-4H24v8h12.7c-.3 2.1-1.6 5.3-4.6 7.4l7.1 5.5c4.2-3.9 6.3-9.6 6.3-16.9z"/><path fill="#FBBC05" d="M10.3 19.2c-.5 1.4-.8 2.9-.8 4.8s.3 3.4.8 4.8l-7.7 6C1 31.4 0 27.9 0 24s1-7.4 2.6-10.8l7.7 6z"/><path fill="#34A853" d="M24 48c6.1 0 11.4-2 15.2-5.5l-7.1-5.5c-2 1.4-4.7 2.3-8.1 2.3-6.4 0-11.8-3.5-13.7-8.7l-7.7 6C6.5 42.6 14.6 48 24 48z"/></svg>' +
        '<span>Pokračovat přes Google</span></button>' +
      '<div class="flex items-center gap-3 mb-5"><div class="h-px bg-white/10 flex-1"></div><span class="text-mist text-xs font-mono text-[11px] tracking-wide">NEBO E-MAILEM</span><div class="h-px bg-white/10 flex-1"></div></div>' +
      '<form onsubmit="authSendCode(event)" class="space-y-4">' +
        '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">E-mail</label><input type="email" id="auth-email" class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03]" placeholder="jmeno@email.cz" required></div>' +
        '<button type="submit" id="send-code-btn" class="pb-btn-cta w-full">Poslat ověřovací kód</button>' +
      '</form>' +
      '<button onclick="fakeTestLogin()" class="w-full mt-5 text-xs text-mist hover:text-white underline transition">🧪 Testovací přihlášení bez ověření (jen pro vývoj)</button>';
  }
  function authStep2Markup(email){
    return '' +
      '<button onclick="openAuth(authRole, pendingAfterLogin)" class="text-mist text-xs mb-5 hover:text-white transition">← Zpět</button>' +
      '<h3 class="font-display font-bold text-xl mb-1">Zadej ověřovací kód</h3>' +
      '<p class="text-zinc-200 text-sm mb-6">Poslali jsme 6místný kód na <span class="text-white">' + email + '</span>. (V demu funguje jakýkoli kód.)</p>' +
      '<form onsubmit="authVerifyCode(event)" class="space-y-4">' +
        '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Ověřovací kód</label><input type="text" id="auth-code" inputmode="numeric" maxlength="6" class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03] text-center tracking-[0.4em] font-semibold" placeholder="123456" required></div>' +
        '<button type="submit" class="pb-btn-cta w-full">Ověřit a přihlásit</button>' +
      '</form>';
  }
  function setAuthRole(role){
    authRole = role;
    document.getElementById('role-creator').classList.toggle('selected', role==='creator');
    document.getElementById('role-brand').classList.toggle('selected', role==='brand');
  }
  async function authGoogle(){
    const btn = document.getElementById('google-auth-btn');
    if(!supabaseClient){
      btn.innerHTML = '<span>Google přihlášení není dostupné (Supabase se nenačetlo)</span>';
      return;
    }
    btn.disabled = true; btn.innerHTML = '<span>Přesměrování na Google...</span>';
    // Stránka se teď kompletně přenačte na accounts.google.com a zpět —
    // veškerý JS stav (proměnná authRole) se ztratí, proto si zvolenou
    // roli (tvůrce/značka) uložíme do localStorage a přečteme ji zpátky
    // až po návratu (viz handleAuthCallback níže).
    localStorage.setItem('pb_pending_role', authRole);
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Návrat rovnou na kořen appky — žádná samostatná /auth/callback
        // routa není potřeba, protože jde o jeden statický HTML soubor.
        // POZOR: tohle funguje spolehlivě jen pokud je tento soubor nasazený
        // jako index.html přímo na kořeni domény. Pokud ho hostuješ na jiné
        // cestě, nahraď window.location.origin za plnou URL k tomuto souboru.
        redirectTo: window.location.origin
      }
    });
    if(error){
      btn.disabled = false;
      btn.innerHTML = '<span>Přihlášení se nezdařilo, zkus to znovu</span>';
      console.error('Google OAuth error:', error);
    }
    // Při úspěchu prohlížeč hned odchází na Google — sem se kód nikdy nedostane.
  }
  /* Zpracuje návrat z Google OAuth. Supabase JS v prohlížeči si sám všimne
     tokenu/kódu v URL (hash #access_token=... nebo ?code=...) a jakmile ho
     zpracuje, spustí přes onAuthStateChange event "SIGNED_IN" — na to tu
     jen čekáme a napojíme to na náš vlastní currentUser/session systém.
     getSession() navíc hned na startu odchytí session, pokud už zpracování
     proběhlo dřív, než se tenhle listener stihl zaregistrovat. */
  async function handleAuthCallback(){
    if(!supabaseClient) return;
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if(event === 'SIGNED_IN' && session && session.user && !currentUser){
        finishSupabaseLogin(session);
      }
    });
    const { data: { session } } = await supabaseClient.auth.getSession();
    if(session && session.user && !currentUser){
      finishSupabaseLogin(session);
    }
  }
  /* Uloží/aktualizuje řádek v tabulce "profiles" podle user.id (upsert) —
     spouští se pokaždé po přihlášení přes Google, ať uživatel klikl na
     "Přihlásit se" nebo na "Registrace" (obě tlačítka vedou na stejný
     authGoogle() → stejný finishSupabaseLogin() → stejný upsert).
     Nutná tabulka v Supabase, viz SQL v komentáři pod touto funkcí. */
  async function upsertUserProfile(user){
    if(!supabaseClient) return;
    const meta = user.user_metadata || {};
    const payload = {
      id: user.id,
      email: user.email,
      full_name: meta.full_name || meta.name || null,
      avatar_url: meta.avatar_url || meta.picture || null,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabaseClient.from('profiles').upsert(payload, { onConflict: 'id' });
    if(error) console.warn('Uložení profilu do tabulky "profiles" selhalo:', error.message);
  }
  /* SQL pro Supabase SQL Editor (spustit jednou, před prvním přihlášením):

    create table if not exists public.profiles (
      id uuid references auth.users on delete cascade primary key,
      email text,
      username text,
      full_name text,
      avatar_url text,
      tiktok_handle text,
      instagram_handle text,
      youtube_handle text,
      updated_at timestamptz default now()
    );

    alter table public.profiles enable row level security;

    create policy "Users can view own profile" on public.profiles
      for select using (auth.uid() = id);

    create policy "Users can upsert own profile" on public.profiles
      for insert with check (auth.uid() = id);

    create policy "Users can update own profile" on public.profiles
      for update using (auth.uid() = id);

  Bez těchto RLS policies upsert()/update() z klienta (anon klíč) tiše
  selže — Supabase ho zamítne, protože nikdo nemá povolení do tabulky
  zapisovat. */

  /* Uloží nové zobrazované jméno do Supabase (tabulka profiles, podle
     user.id) — voláno z submitAccountSettings() při změně jména. */
  async function updateProfileName(newName){
    if(!supabaseClient || !currentUser || !currentUser.id) return;
    const { error } = await supabaseClient.from('profiles')
      .update({ username: newName, full_name: newName })
      .eq('id', currentUser.id);
    if(error) console.warn('Uložení jména do Supabase selhalo:', error.message);
  }
  /* Uloží @handle na TikTok/Instagram/YouTube do Supabase — voláno při
     vygenerování profilu i při jejich pozdější úpravě v nastavení. */
  async function saveSocialHandles(handles){
    if(!supabaseClient || !currentUser || !currentUser.id) return;
    const { error } = await supabaseClient.from('profiles')
      .update({
        tiktok_handle: handles.tiktok || null,
        instagram_handle: handles.instagram || null,
        youtube_handle: handles.youtube || null
      })
      .eq('id', currentUser.id);
    if(error) console.warn('Uložení social handles do Supabase selhalo:', error.message);
  }
  function finishSupabaseLogin(session){
    const role = localStorage.getItem('pb_pending_role') || localStorage.getItem('pb_userRole') || 'creator';
    localStorage.removeItem('pb_pending_role');
    // Google účet posílá jméno/avatar v user_metadata — pole se občas
    // liší (full_name vs. name, avatar_url vs. picture), zkusíme obě varianty.
    const meta = session.user.user_metadata || {};
    const googleName = meta.full_name || meta.name || null;
    const googleAvatarUrl = meta.avatar_url || meta.picture || null;
    upsertUserProfile(session.user);
    onAuthSuccess({ email: session.user.email, role: role, name: googleName, avatarUrl: googleAvatarUrl, id: session.user.id });
    // Uklidíme OAuth parametry (#access_token=..., ?code=...) z adresního
    // řádku, ať tam nezůstanou viset po dokončeném přihlášení.
    if(window.location.hash || window.location.search){
      window.history.replaceState(null, '', window.location.pathname);
    }
  }
  async function authSendCode(e){
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    if(!email) return;
    const btn = document.getElementById('send-code-btn');
    btn.disabled = true; btn.textContent = 'Odesílám kód...';
    const res = await AuthService.sendEmailCode(email);
    if(res.success){
      pendingAuthEmail = email;
      modalContent.innerHTML = authStep2Markup(email);
    }
  }
  async function authVerifyCode(e){
    e.preventDefault();
    const code = document.getElementById('auth-code').value.trim();
    if(!code) return;
    const res = await AuthService.verifyEmailCode(pendingAuthEmail, code, authRole);
    if(res.success) onAuthSuccess(res.user);
  }
  function onAuthSuccess(user){
    currentUser = user;
    persistSession(user);
    if(user.role === 'creator'){ myCreatorIndex = findMyCreatorIndex(user.email); }
    refreshGates();
    updateHeaderAuthUI();
    const roleLabel = user.role === 'creator' ? 'tvůrce' : 'značka';
    modalContent.innerHTML = successBlock('Přihlášení úspěšné', 'Jsi přihlášen/a jako ' + roleLabel + ' (' + user.email + ').');
    if(pendingAfterLogin){
      const cb = pendingAfterLogin;
      pendingAfterLogin = null;
      setTimeout(()=>{ closeModal(); cb(); }, 900);
    }
  }
  function successBlock(title, subtitle){
    return '<div class="text-center py-10"><div class="w-16 h-16 rounded-full bg-gradient-to-r from-violet via-magenta to-cyan text-white shadow-[0_8px_30px_-6px_rgba(160,60,255,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-4px_rgba(232,56,255,0.65)] hover:brightness-105 active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center mx-auto mb-5 text-2xl">✓</div>' +
      '<h3 class="font-display font-bold text-xl mb-2">' + title + '</h3><p class="text-zinc-200 text-sm max-w-sm mx-auto">' + subtitle + '</p>' +
      '<button onclick="closeModal()" class="pb-btn-cta mt-7 px-6 py-3">Zavřít</button></div>';
  }

  /* ==============================================================
     DOČASNÝ FAKE LOGIN — pro testování bez Supabase.
     Až bude napojený Supabase, tenhle blok (i tlačítko v auth modalu)
     jednoduše smaž — session pak bude řídit výhradně AuthService.
  ============================================================== */
  function fakeTestLogin(){
    const user = { email: 'test@promobazar.cz', role: authRole };
    onAuthSuccess(user);
  }

  /* ==============================================================
     SESSION — perzistence přes localStorage (dočasná náhrada za
     Supabase session). Až bude Supabase napojený, nahraď tělo funkcí
     persistSession/clearSession/restoreSession voláním
     supabaseClient.auth.getSession() / onAuthStateChange(...).
  ============================================================== */
  function persistSession(user){
    localStorage.setItem('pb_isLoggedIn', 'true');
    localStorage.setItem('pb_userEmail', user.email);
    localStorage.setItem('pb_userRole', user.role);
    if(user.name) localStorage.setItem('pb_userName', user.name); else localStorage.removeItem('pb_userName');
    if(user.avatarUrl) localStorage.setItem('pb_userAvatar', user.avatarUrl); else localStorage.removeItem('pb_userAvatar');
    if(user.id) localStorage.setItem('pb_userId', user.id); else localStorage.removeItem('pb_userId');
  }
  function clearSession(){
    localStorage.removeItem('pb_isLoggedIn');
    localStorage.removeItem('pb_userEmail');
    localStorage.removeItem('pb_userRole');
    localStorage.removeItem('pb_userName');
    localStorage.removeItem('pb_userAvatar');
    localStorage.removeItem('pb_userId');
    // POZOR: pb_creator_pro se tady záměrně NEMAŽE. Předplatné patří k účtu,
    // ne k přihlašovací session — odhlášení nesmí zrušit Creator PRO stav.
    // (Tohle přesně byla kořenová příčina bugu, kdy po znovupřihlášení
    // vypadala karta "Zobrazení profilu" zamčená, i když měl uživatel PRO.)
  }
  /* Spolehlivé propojení přihlášeného tvůrce s jeho profilem přes e-mail —
     myCreatorIndex je jen dočasná proměnná v paměti (index do pole creators),
     která se BEZ TOHOTO vyhledávání po odhlášení/přihlášení nebo obnovení
     session ztrácela, i když profil (a jeho Creator PRO stav) v poli
     creators reálně existoval. Tohle byla kořenová příčina toho, že po
     znovupřihlášení vypadala karta "Zobrazení profilu" zamčená a chat
     s tvůrcem zmizel, i když měl uživatel Creator PRO / aktivní konverzaci. */
  function findMyCreatorIndex(email){
    if(!email) return null;
    const idx = creators.findIndex(c=>c.ownerEmail === email);
    return idx === -1 ? null : idx;
  }
  function restoreSession(){
    if(localStorage.getItem('pb_isLoggedIn') === 'true'){
      const email = localStorage.getItem('pb_userEmail');
      const role = localStorage.getItem('pb_userRole');
      if(email && role){
        currentUser = { email: email, role: role, name: localStorage.getItem('pb_userName') || null, avatarUrl: localStorage.getItem('pb_userAvatar') || null, id: localStorage.getItem('pb_userId') || null };
      }
    }
    isCreatorPro = localStorage.getItem('pb_creator_pro') === 'true';
    if(currentUser && currentUser.role === 'creator'){ myCreatorIndex = findMyCreatorIndex(currentUser.email); }
    refreshGates();
    updateHeaderAuthUI();
    renderCreatorProCta();
  }

  /* ============== HEADER — avatar / dropdown menu po přihlášení ============== */
  let brandProfile = { avatarUrl: null, bannerUrl: null, bio: '' };
  function getMyProfile(){
    const googleAvatar = currentUser ? currentUser.avatarUrl : null;
    const googleName = currentUser ? currentUser.name : null;
    if(currentUser && currentUser.role === 'creator' && myCreatorIndex !== null && creators[myCreatorIndex]){
      const c = creators[myCreatorIndex];
      return { avatarUrl: c.avatarUrl || googleAvatar || null, bannerUrl: c.bannerUrl || null, bio: c.bio || '', initials: c.initials, name: c.name || googleName || currentUser.email, portfolio: c.portfolio || [], socialHandles: c.socialHandles || {} };
    }
    const displayName = (currentUser && currentUser.name) || googleName || (currentUser ? currentUser.email : '');
    return { avatarUrl: brandProfile.avatarUrl || googleAvatar || null, bannerUrl: brandProfile.bannerUrl, bio: brandProfile.bio, initials: displayName ? displayName.slice(0,2).toUpperCase() : '?', name: displayName, portfolio: [], socialHandles: {} };
  }
  function updateHeaderAuthUI(){
    const loggedIn = !!currentUser;
    document.querySelectorAll('.auth-buttons-group').forEach(el=> el.classList.toggle('hidden', loggedIn));
    document.querySelectorAll('.user-menu-group').forEach(el=> el.classList.toggle('hidden', !loggedIn));
    if(loggedIn){
      const profile = getMyProfile();
      document.querySelectorAll('.user-avatar-initials').forEach(el=>{
        el.innerHTML = profile.avatarUrl ? '<img src="' + profile.avatarUrl + '" class="w-full h-full rounded-full object-cover">' : profile.initials;
      });
      document.querySelectorAll('.user-menu-email').forEach(el=> el.textContent = profile.name || currentUser.email);
    }
  }
  function toggleUserMenu(id, e){ toggleDropdown(id, e); }
  function goToMyDashboard(){
    if(currentUser && currentUser.role === 'creator'){ goToCreatorDashboard(); return; }
    if(currentUser && currentUser.role === 'brand'){ goToBrandDashboard(); return; }
  }
  function handleLogout(){
    if(supabaseClient) supabaseClient.auth.signOut();
    currentUser = null;
    myCreatorIndex = null;
    clearSession();
    refreshGates();
    updateHeaderAuthUI();
    renderCreatorProCta();
    switchView('firms');
    scrollToId('top');
  }

  /* ============== DASHBOARD GATING ============== */
  function refreshGates(){
    const creatorIn = currentUser && currentUser.role === 'creator';
    const brandIn = currentUser && currentUser.role === 'brand';
    document.querySelectorAll('.creator-gate-locked').forEach(el=> el.classList.toggle('hidden', creatorIn));
    document.querySelectorAll('.creator-gate-unlocked').forEach(el=> el.classList.toggle('hidden', !creatorIn));
    document.querySelectorAll('.brand-gate-locked').forEach(el=> el.classList.toggle('hidden', brandIn));
    document.querySelectorAll('.brand-gate-unlocked').forEach(el=> el.classList.toggle('hidden', !brandIn));
    renderProfileViewsStat();
    renderCreatorConversations();
    renderChatWidget();
  }
  function renderCreatorConversations(){
    const wrap = document.getElementById('creator-conversations-list');
    if(!wrap) return;
    if(!currentUser){ wrap.innerHTML = ''; return; }
    const mine = (typeof conversations !== 'undefined' ? conversations : []).filter(c=>c.creatorEmail === currentUser.email);
    if(mine.length === 0){ wrap.innerHTML = '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-5 text-center text-mist text-sm">Zatím žádné zprávy. Objeví se tu po odpovědi na poptávku.</div>'; return; }
    wrap.innerHTML = mine.map(c=>{
      const unread = c.creatorUnread || 0;
      return '<button onclick="openWidgetChat(' + c.id + ')" class="w-full text-left bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 flex items-center justify-between gap-3 hover:bg-white/10 transition">' +
        '<div class="min-w-0"><p class="font-semibold text-sm truncate">' + c.brandEmail + '</p><p class="text-zinc-200 text-xs truncate">' + c.jobTitle + '</p></div>' +
        (unread > 0 ? '<span class="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style="background:#ef4444;">' + unread + '</span>' : '<span class="font-mono text-[11px] tracking-wide text-[10px] text-mist whitespace-nowrap">' + c.messages.length + ' zpráv →</span>') +
      '</button>';
    }).join('');
  }
  function goToCreatorDashboard(){
    switchView('creators');
    requireAuth('creator', ()=>{ scrollToId('dashboard'); });
  }
  function goToBrandDashboard(){
    switchView('firms');
    scrollToId('job-board');
    switchJobTab('brand');
    requireAuth('brand', ()=>{ switchJobTab('brand'); });
  }
  /* Oprava: "Poptávky" v menu musí VŽDY otevřít veřejný přehled nabídek
     (tab "browse"), bez ohledu na to, na jaké záložce Tržiště poptávek
     předtím zůstalo (např. po předchozí návštěvě Panelu pro značky).
     Přehled poptávek je veřejný — přihlášení k němu není potřeba. */
  function goToJobBoardBrowse(){
    switchView('firms');
    switchJobTab('browse');
    scrollToId('job-board');
  }

  /* ============== BADGES — počítané z reálného stavu session, žádné natvrdo dané ============== */
  function computeBadges(){
    if(!currentUser) return [];
    if(currentUser.role === 'creator'){
      return [
        { label:'Ověřený tvůrce', icon:'✅', earned: myCreatorIndex !== null && !!creators[myCreatorIndex], hint:'Získáš vygenerováním profilu do tržiště.' },
        { label:'Top Earner', icon:'💎', earned: myOrders.length >= 1, hint:'Získáš první přijatou objednávkou.' },
        { label:'Aktivní tvůrce', icon:'⚡', earned: myCreatorIndex !== null && !!creators[myCreatorIndex] && creators[myCreatorIndex].packages.length >= 2, hint:'Získáš, když máš 2 a více aktivních balíčků.' }
      ];
    }
    const myJobsCount = jobs.filter(j=>j.company === currentUser.email).length;
    return [
      { label:'Ověřená značka', icon:'✅', earned: true, hint:'Aktivní po přihlášení jako značka.' },
      { label:'TOP Zadavatel', icon:'🏆', earned: myJobsCount >= 1, hint:'Získáš první zveřejněnou poptávkou.' },
      { label:'Stálý zákazník', icon:'🔁', earned: myJobsCount >= 3, hint:'Získáš zveřejněním 3 a více poptávek.' }
    ];
  }
  function badgeChipHtml(b){
    return '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-3 flex items-center gap-2.5 ' + (b.earned ? '' : 'opacity-40') + '" title="' + b.hint + '">' +
      '<span class="text-lg">' + b.icon + '</span>' +
      '<div class="min-w-0"><p class="text-xs font-semibold truncate">' + b.label + '</p><p class="text-[10px] text-zinc-200">' + (b.earned ? 'Získáno' : 'Zamčeno') + '</p></div>' +
    '</div>';
  }

  function openAccountSettings(){
    if(!currentUser){ openAuth('creator'); return; }
    const profile = getMyProfile();
    const roleLabel = currentUser.role === 'creator' ? 'Tvůrce' : 'Značka / E-shop';
    const badges = computeBadges();

    modalContent.innerHTML =
      '<h3 class="font-display font-bold text-xl mb-1">Nastavení účtu</h3>' +
      '<p class="text-zinc-200 text-sm mb-6">' + roleLabel + ' · ' + currentUser.email + '</p>' +

      '<div class="rounded-2xl overflow-hidden mb-[-32px] relative h-28 cursor-pointer" id="settings-banner-preview" onclick="document.getElementById(\'settings-banner-upload\').click()" ' +
        'style="background:' + (profile.bannerUrl ? 'url(' + profile.bannerUrl + ') center/cover' : 'linear-gradient(120deg, #7C3AED, #00E5FF)') + ';">' +
        '<div class="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 hover:opacity-100 transition"><span class="text-white text-xs font-semibold">Změnit banner</span></div>' +
      '</div>' +
      '<input id="settings-banner-upload" type="file" accept="image/*" class="hidden">' +

      '<div class="flex items-end gap-4 px-2 mb-6 relative">' +
        '<div class="flex h-[88px] w-[88px] cursor-pointer items-center justify-center overflow-hidden rounded-full rounded-full bg-gradient-to-br from-violet via-magenta to-cyan p-[2.5px] cursor-pointer" style="width:76px;height:76px;" onclick="document.getElementById(\'settings-avatar-upload\').click()">' +
          '<div id="settings-avatar-preview" class="w-full h-full rounded-full flex items-center justify-center font-display font-bold text-white text-xl" style="' + (profile.avatarUrl ? 'background:url(' + profile.avatarUrl + ') center/cover;' : 'background:linear-gradient(135deg,#7C3AED,#E838FF);') + '">' + (profile.avatarUrl ? '' : profile.initials) + '</div>' +
        '</div>' +
        '<input id="settings-avatar-upload" type="file" accept="image/*" class="hidden">' +
        '<p class="text-zinc-200 text-[11px] font-mono text-[11px] tracking-wide pb-2">Klikni na banner nebo avatar pro nahrání vlastní fotky</p>' +
      '</div>' +

      '<form onsubmit="submitAccountSettings(event)" class="space-y-4">' +
        '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Zobrazované jméno</label><input id="settings-display-name" type="text" value="' + (profile.name || '') + '" placeholder="' + (currentUser.role === 'creator' ? 'Jana K.' : 'Jméno / název značky') + '" class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03]"></div>' +
        '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Bio</label><textarea id="settings-bio" rows="3" placeholder="' + (currentUser.role === 'creator' ? 'Pár vět o tobě a tvém obsahu...' : 'Pár vět o vaší značce...') + '" class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03] resize-none">' + (profile.bio || '') + '</textarea></div>' +
        '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Aktuální e-mail</label><input type="email" value="' + currentUser.email + '" class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03]" disabled></div>' +
        '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Změnit e-mail</label>' +
          '<div class="flex flex-col sm:flex-row gap-2">' +
            '<input id="settings-new-email" type="email" placeholder="novy@email.cz" class="flex-1 bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03]">' +
            '<button type="button" onclick="sendEmailChangeVerification()" class="bg-white/[0.04] border border-white/[0.14] transition-all duration-300 hover:bg-white/[0.09] hover:border-white/[0.24] font-semibold text-xs px-4 py-3 rounded-xl text-white/90 whitespace-nowrap">Odeslat ověřovací odkaz</button>' +
          '</div>' +
          '<p id="email-change-status" class="text-zinc-200 text-[11px] font-mono text-[11px] tracking-wide mt-2 hidden"></p>' +
          '<button type="button" id="confirm-email-change-btn" onclick="confirmEmailChange()" class="hidden mt-2 text-[11px] underline" style="color:#a5b4fc;">🧪 Simulovat potvrzení odkazu z e-mailu (demo)</button>' +
        '</div>' +

        (currentUser.role === 'creator' ?
          '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-2">Sociální sítě</label>' +
          '<div class="space-y-2.5">' +
            '<input id="settings-handle-tiktok" type="text" value="' + ((profile.socialHandles && profile.socialHandles.tiktok) || '') + '" placeholder="🎵 TikTok @handle" class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03]">' +
            '<input id="settings-handle-instagram" type="text" value="' + ((profile.socialHandles && profile.socialHandles.instagram) || '') + '" placeholder="📸 Instagram @handle" class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03]">' +
            '<input id="settings-handle-youtube" type="text" value="' + ((profile.socialHandles && profile.socialHandles.youtube) || '') + '" placeholder="▶️ YouTube @handle" class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03]">' +
          '</div></div>'
        : '') +

        (currentUser.role === 'creator' ?
          '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-2">Portfolio · ukázky práce (odkazy na TikTok / Reels / YouTube Shorts)</label>' +
          '<div class="space-y-2.5">' +
            [0,1,2].map(idx=>'<input id="settings-portfolio-' + idx + '" type="url" value="' + ((profile.portfolio && profile.portfolio[idx]) || '') + '" placeholder="Ukázka ' + (idx+1) + ' — https://www.tiktok.com/@ucet/video/..." class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03]">').join('') +
          '</div>' +
          '<p class="text-zinc-200 text-[11px] font-mono text-[11px] tracking-wide mt-1.5">Tyto 3 odkazy se zobrazí jako Portfolio v tvém veřejném profilu na tržišti.</p></div>'
        : '') +

        '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-2">Odznaky</label>' +
        '<div class="grid grid-cols-3 gap-2.5">' + badges.map(badgeChipHtml).join('') + '</div></div>' +

        '<button type="submit" class="pb-btn-cta w-full mt-2">Uložit změny</button>' +
      '</form>';
    showModal();

    let pendingAvatarUrl = profile.avatarUrl;
    let pendingBannerUrl = profile.bannerUrl;
    document.getElementById('settings-avatar-upload').addEventListener('change', (e)=>{
      const file = e.target.files[0]; if(!file) return;
      pendingAvatarUrl = URL.createObjectURL(file);
      document.getElementById('settings-avatar-preview').style.background = 'url(' + pendingAvatarUrl + ') center/cover';
      document.getElementById('settings-avatar-preview').textContent = '';
    });
    document.getElementById('settings-banner-upload').addEventListener('change', (e)=>{
      const file = e.target.files[0]; if(!file) return;
      pendingBannerUrl = URL.createObjectURL(file);
      document.getElementById('settings-banner-preview').style.background = 'url(' + pendingBannerUrl + ') center/cover';
    });
    window.__pendingProfileUpload = ()=> ({ avatarUrl: pendingAvatarUrl, bannerUrl: pendingBannerUrl });
  }
  /* ==============================================================
     ZMĚNA E-MAILU S RE-VERIFIKACÍ
     ------------------------------------------------------------
     DB schéma (Supabase, budoucí): auth.users.email se mění až po
     potvrzení. Supabase toto řeší nativně přes
     supabaseClient.auth.updateUser({ email: newEmail }) — automaticky
     pošle ověřovací e-mail na NOVOU adresu a starý e-mail zůstává
     platný (a přihlašovací), dokud uživatel odkaz nepotvrdí.
     Zde jde o mock: pendingEmailChange drží e-mail čekající na
     potvrzení; confirmEmailChange() simuluje klik na odkaz z e-mailu.
  ============================================================== */
  let pendingEmailChange = null;
  function sendEmailChangeVerification(){
    const input = document.getElementById('settings-new-email');
    const newEmail = input.value.trim();
    const status = document.getElementById('email-change-status');
    if(!newEmail || newEmail === currentUser.email){
      status.textContent = 'Zadej platnou novou e-mailovou adresu, jiná než ta současná.';
      status.style.color = '#ff8fd6';
      status.classList.remove('hidden');
      return;
    }
    pendingEmailChange = newEmail;
    // TODO Supabase: await supabaseClient.auth.updateUser({ email: newEmail });
    status.style.color = '';
    status.textContent = '📧 Ověřovací odkaz byl odeslán na ' + newEmail + '. E-mail v účtu se změní až po potvrzení odkazu.';
    status.classList.remove('hidden');
    document.getElementById('confirm-email-change-btn').classList.remove('hidden');
  }
  function confirmEmailChange(){
    if(!pendingEmailChange) return;
    currentUser.email = pendingEmailChange;
    persistSession(currentUser);
    updateHeaderAuthUI();
    pendingEmailChange = null;
    modalContent.innerHTML = successBlock('E-mail změněn', 'Nová e-mailová adresa byla ověřena a je teď aktivní na tvém účtu.');
  }
  function submitAccountSettings(e){
    e.preventDefault();
    const nameInput = document.getElementById('settings-display-name');
    const bioInput = document.getElementById('settings-bio');
    const uploads = window.__pendingProfileUpload ? window.__pendingProfileUpload() : {avatarUrl:null, bannerUrl:null};
    const newName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : null;

    if(newName){
      // Aktualizuje se přímo v Supabase (tabulka profiles, podle user.id) —
      // po úspěchu se rovnou promítne do currentUser.name, aby hlavička i
      // profil ukázaly nové jméno okamžitě a nezůstal tam viset e-mail.
      updateProfileName(newName);
      currentUser.name = newName;
      persistSession(currentUser);
    }

    if(currentUser.role === 'creator' && myCreatorIndex !== null && creators[myCreatorIndex]){
      if(newName) creators[myCreatorIndex].name = newName;
      if(bioInput) creators[myCreatorIndex].bio = bioInput.value.trim();
      if(uploads.avatarUrl) creators[myCreatorIndex].avatarUrl = uploads.avatarUrl;
      if(uploads.bannerUrl) creators[myCreatorIndex].bannerUrl = uploads.bannerUrl;

      const handleTiktok = document.getElementById('settings-handle-tiktok');
      const handleInstagram = document.getElementById('settings-handle-instagram');
      const handleYoutube = document.getElementById('settings-handle-youtube');
      if(handleTiktok){
        const newHandles = {
          tiktok: normalizeHandle(handleTiktok.value),
          instagram: normalizeHandle(handleInstagram.value),
          youtube: normalizeHandle(handleYoutube.value)
        };
        creators[myCreatorIndex].socialHandles = newHandles;
        saveSocialHandles(newHandles);
      }

      const portfolioLinks = [0,1,2].map(idx=>{
        const el = document.getElementById('settings-portfolio-' + idx);
        return el ? el.value.trim() : '';
      }).filter(Boolean);
      creators[myCreatorIndex].portfolio = portfolioLinks;
      renderMyPackages();
      applyFilters();
    } else {
      if(bioInput) brandProfile.bio = bioInput.value.trim();
      if(uploads.avatarUrl) brandProfile.avatarUrl = uploads.avatarUrl;
      if(uploads.bannerUrl) brandProfile.bannerUrl = uploads.bannerUrl;
    }
    updateHeaderAuthUI();
    modalContent.innerHTML = successBlock('Nastavení uloženo', 'Změny se projeví okamžitě v tvém profilu i v katalogu.');
  }

  /* ============== OCHRANA DASHBOARDU — kontrola dle URL hashe ==============
     Pokud se někdo pokusí dostat na chráněnou sekci přímým odkazem
     (#dashboard, #balicky) nebo tlačítky zpět/vpřed v prohlížeči,
     aniž by byl přihlášený se správnou rolí, přesměruje ho to
     zpátky na homepage a nabídne přihlášení. */
  const protectedHashRoles = { 'dashboard':'creator', 'balicky':'creator' };
  function enforceDashboardAccess(){
    const hash = location.hash.replace('#','');
    const requiredRole = protectedHashRoles[hash];
    if(!requiredRole) return;
    if(currentUser && currentUser.role === requiredRole) return;
    history.replaceState(null, '', '#top');
    switchView('firms');
    window.scrollTo({top:0, behavior:'auto'});
    openAuth(requiredRole, ()=>{ switchView('creators'); scrollToId(hash); });
  }
  window.addEventListener('hashchange', enforceDashboardAccess);

  function submitOrder(e, ci, pkgId, buyerEmail, shopUrl){
    e.preventDefault();
    const c = creators[ci];
    const p = c.packages.find(x=>x.id === pkgId);
    const brief = e.target.querySelector('textarea').value.trim();

    const orderPayload = {
      creator_name: c.name,
      package_id: pkgId,
      package_name: p.name,
      price: p.price,
      buyer_email: buyerEmail,
      shop_url: shopUrl,
      brief: brief,
      status: 'pending_payment',
      created_at: new Date().toISOString()
    };
    // TODO Supabase: const { error } = await supabaseClient.from('orders').insert(orderPayload);
    console.log('order payload (ready for DB insert):', orderPayload);

    // V tomto testovacím prostředí (jeden prohlížeč, jedna session) se objednávka
    // reálně propíše do dashboardu tvůrce, pokud sis zrovna objednal/a vlastní
    // vygenerovaný profil — jinak by ji v produkci uviděl přihlášený majitel profilu.
    if(ci === myCreatorIndex){
      myOrders.push({ id: 'ORD-' + Date.now(), label: 'Objednávka od ' + (buyerEmail || 'neznámý e-shop'), packageName: p.name, status: 'Zadání doručeno' });
      renderCreatorOrders();
      renderUploadOrderPicker();
    }

    modalContent.innerHTML = successBlock('Poptávka odeslána', 'Tvůrce ' + c.name + ' dostane tvé zadání a ozve se do 24 hodin s potvrzením termínu. Peníze jsou zatím bezpečně v úschově.');
  }
  function submitPlan(planName){
    modalContent.innerHTML = successBlock('Díky za zájem o ' + planName, 'Ozveme se do jednoho pracovního dne na ' + currentUser.email + ' a nastavíme účet přesně podle tvého rozpočtu.');
  }
  function submitContact(e){
    e.preventDefault();
    const form = e.target;
    const box = document.createElement('p');
    box.className = 'text-cyan-300 text-sm mt-3 tag';
    box.textContent = '✓ Zpráva odeslána, ozveme se co nejdřív.';
    form.appendChild(box); form.reset();
  }

  /* ==============================================================
     SOCIÁLNÍ SÍTĚ — jednoduché @handle odkazy, žádné OAuth simulace
     ani generovaná čísla. Tvůrce zadá svůj handle, appka z něj postaví
     reálný odkaz na jeho veřejný profil dané sítě.
  ============================================================== */
  const SOCIAL_URL_BUILDERS = {
    tiktok: h => 'https://www.tiktok.com/@' + h,
    instagram: h => 'https://www.instagram.com/' + h,
    youtube: h => 'https://www.youtube.com/@' + h
  };
  const SOCIAL_ICONS = { tiktok: '🎵', instagram: '📸', youtube: '▶️' };
  function normalizeHandle(raw){
    if(!raw) return '';
    return raw.trim().replace(/^@/, '').replace(/^https?:\/\/[^/]+\//, '').replace(/\/$/, '');
  }
  function readHandleInputs(){
    return {
      tiktok: normalizeHandle(document.getElementById('handle-tiktok').value),
      instagram: normalizeHandle(document.getElementById('handle-instagram').value),
      youtube: normalizeHandle(document.getElementById('handle-youtube').value)
    };
  }
  function socialHandleLinksHtml(c){
    const handles = c.socialHandles || {};
    const chips = Object.keys(handles).filter(k=>handles[k]).map(k=>
      '<a href="' + SOCIAL_URL_BUILDERS[k](handles[k]) + '" target="_blank" rel="noopener noreferrer" class="font-mono text-[11px] tracking-wide inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-[11px] text-cyan-200 hover:text-white transition">' + SOCIAL_ICONS[k] + ' @' + handles[k] + '</a>'
    );
    if(chips.length === 0) return '';
    return '<div class="flex flex-wrap gap-2 mb-6">' + chips.join('') + '</div>';
  }

  /* ============== AVATAR UPLOAD ============== */
  let uploadedAvatarUrl = null;
  document.getElementById('avatar-upload').addEventListener('change', (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    uploadedAvatarUrl = URL.createObjectURL(file);
    document.getElementById('avatar-preview').outerHTML = '<img id="avatar-preview" src="' + uploadedAvatarUrl + '" class="w-full h-full rounded-full object-cover">';
  });

  /* ============== STAGING PACKAGES — neomezený počet balíčků pro nový profil ============== */
  const gradPool = ['from-violet-500 to-fuchsia-500','from-cyan-400 to-blue-500','from-pink-500 to-violet-500','from-fuchsia-500 to-cyan-400','from-blue-500 to-violet-600'];
  const categoryLabelsDemo = { fitness:'Fitness & Health', fashion:'Móda & Beauty', gaming:'Gaming & E-sports', gastro:'Gastro & Jídlo', tech:'Tech & Gadgets', lifestyle:'Lifestyle' };
  let stagingPackages = [];

  function renderStagingPackages(){
    document.getElementById('staging-count').textContent = stagingPackages.length;
    const list = document.getElementById('staging-packages-list');
    if(stagingPackages.length === 0){ list.innerHTML = '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-5 text-center text-mist text-xs">Zatím žádný balíček. Přidej první vlevo.</div>'; return; }
    list.innerHTML = stagingPackages.map(p=>
      '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4"><div class="flex items-start justify-between gap-3 mb-1.5"><p class="font-semibold text-sm">' + p.name + '</p><p class="font-display font-bold text-sm bg-gradient-to-r from-accent-soft via-magenta to-cyan bg-clip-text text-transparent whitespace-nowrap">' + p.price.toLocaleString('cs-CZ') + ' Kč</p></div>' +
      '<p class="text-zinc-200 text-[11px] mb-2">' + platformLabels[p.format] + ' · ' + p.delivery + ' dní · licence ' + licenseLabel(p.license) + '</p>' +
      '<button onclick="removeStagingPackage(' + p.id + ')" class="text-[11px] text-white/60 hover:text-white underline">Odebrat</button></div>'
    ).join('');
  }
  function addStagingPackage(){
    if(!canAddMorePackages()){ showUpgradePrompt(); return; }
    const name = document.getElementById('staging-name').value.trim();
    const format = document.getElementById('dd-staging-format').dataset.value;
    const delivery = parseInt(document.getElementById('dd-staging-delivery').dataset.value, 10);
    const license = document.getElementById('dd-staging-license').dataset.value;
    const revisions = parseInt(document.getElementById('staging-revisions').value, 10) || 1;
    const price = parseInt(document.getElementById('staging-price').value, 10);
    const description = document.getElementById('staging-description').value.trim();
    if(!name || !price){ alert('Vyplň alespoň název a cenu balíčku.'); return; }
    stagingPackages.push({ id: Date.now() + Math.floor(Math.random()*1000), name, format, delivery, revisions, price, license, description: description || (name + ', vytvořeno přes propojený profil.') });
    document.getElementById('staging-name').value = '';
    document.getElementById('staging-price').value = '';
    document.getElementById('staging-description').value = '';
    document.getElementById('staging-revisions').value = 1;
    renderStagingPackages();
  }
  function removeStagingPackage(id){
    stagingPackages = stagingPackages.filter(p=>p.id !== id);
    renderStagingPackages();
  }

  /* ============== REAL PROFILE GENERATION → KATALOG ============== */
  function generateRealProfile(){
    const name = document.getElementById('profile-display-name').value.trim();
    const errorEl = document.getElementById('profile-error');
    const successEl = document.getElementById('profile-success');
    const viewBtn = document.getElementById('profile-view-btn');

    if(!name || stagingPackages.length === 0){ errorEl.classList.remove('hidden'); successEl.classList.add('hidden'); viewBtn.classList.add('hidden'); return; }
    errorEl.classList.add('hidden');

    const category = document.getElementById('dd-profile-category').dataset.value;
    // Statistiky zadává tvůrce sám (self-reported) — žádná fabrikovaná čísla.
    const followers = parseInt(document.getElementById('stat-followers').value, 10) || 0;
    const avgViews = parseInt(document.getElementById('stat-avgviews').value, 10) || 0;
    const reach = parseInt(document.getElementById('stat-reach').value, 10) || 0;
    const socialHandles = readHandleInputs();

    const packages = stagingPackages.map(p=>({ id: p.id, name: p.name, format: p.format, delivery: p.delivery, revisions: p.revisions, price: p.price, license: p.license, description: p.description }));
    const platforms = [...new Set(packages.map(p=>p.format))];
    const initials = name.replace(/[^A-Za-zÀ-ž]/g,'').slice(0,2).toUpperCase() || 'TV';
    const grad = gradPool[Math.floor(Math.random()*gradPool.length)];

    const newCreator = {
      name: name, category: category, categoryLabel: categoryLabelsDemo[category],
      audienceAge: '18–34 let (přibližně)', platforms: platforms,
      followers: (followers/1000).toFixed(followers>=1000?0:1) + 'K', reach: (reach/1000).toFixed(reach>=1000?0:1) + 'K', avgViews: (avgViews/1000).toFixed(avgViews>=1000?0:1) + 'K',
      initials: initials, grad: grad, avatarUrl: uploadedAvatarUrl, packages: packages, portfolio: [], socialHandles: socialHandles,
      isPro: isCreatorPro, viewCount: 0, ownerEmail: currentUser ? currentUser.email : null
    };
    creators.push(newCreator);
    myCreatorIndex = creators.length - 1;
    saveSocialHandles(socialHandles);
    stagingPackages = [];
    renderStagingPackages();
    renderMyPackages();
    refreshGates();
    updateHeaderAuthUI();

    selectDropdown('dd-platform', 'all', {stopPropagation:()=>{}});
    selectDropdown('dd-category', 'all', {stopPropagation:()=>{}});
    selectDropdown('dd-license', 'all', {stopPropagation:()=>{}});
    const budgetReset = document.getElementById('f-budget');
    budgetReset.value = 30000;
    document.getElementById('f-budget-label').textContent = '30 000 Kč';
    syncBudgetRangeFill(budgetReset);
    renderGrid(creators);

    successEl.textContent = '✓ Profil "' + name + '" byl přidán do tržiště s ' + packages.length + ' balíčkem/y.';
    successEl.classList.remove('hidden');
    viewBtn.classList.remove('hidden');
  }
  renderStagingPackages();

  /* ============== OBJEDNÁVKY TVŮRCE ==============
     Prázdné pole — žádné vymyšlené objednávky (#A812 apod.). Skutečné
     objednávky sem přibudou, až firma/značka přijme nabídku (po napojení
     Supabase půjde o řádky z tabulky "orders" filtrované na aktuálního
     přihlášeného tvůrce). */
  let myOrders = [];
  function renderCreatorOrders(){
    const wrap = document.getElementById('creator-orders-list');
    if(!wrap) return;
    if(myOrders.length === 0){
      wrap.innerHTML = '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-5 text-center text-mist text-sm">Zatím žádné objednávky. Jakmile ti někdo pošle poptávku, objeví se tady.</div>';
      return;
    }
    wrap.innerHTML = myOrders.map(o=>
      '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 flex items-center justify-between gap-3"><div><p class="font-semibold text-sm">' + o.label + '</p><p class="text-zinc-200 text-xs mt-0.5">' + o.packageName + '</p></div><span class="rounded-full px-2.5 py-1 font-mono text-[10.5px] bg-cyan-500/15 text-cyan-300">' + o.status + '</span></div>'
    ).join('');
  }
  function renderUploadOrderPicker(){
    const mount = document.getElementById('dd-upload-order-mount');
    if(!mount) return;
    if(myOrders.length === 0){
      mount.innerHTML = '<p class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl px-4 py-3 text-xs text-zinc-200">Zatím nemáš žádnou aktivní objednávku k nahrání videa.</p>';
      return;
    }
    mountDropdown('dd-upload-order-mount','dd-upload-order', myOrders.map(o=>({value:o.id, label:o.label})), myOrders[0].id);
  }

  /* ============== DROPZONE ============== */
  const dropzone = document.getElementById('dropzone'), fileInput = document.getElementById('file-input');
  const dzEmpty = document.getElementById('dropzone-empty'), dzFile = document.getElementById('dropzone-file');
  function handleFile(file){
    if(!file) return;
    if(!/\.(mp4|mov)$/i.test(file.name)){ alert('Nahraj prosím soubor ve formátu MP4 nebo MOV.'); return; }
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('file-size').textContent = (file.size/1024/1024).toFixed(1) + ' MB';
    dzEmpty.classList.add('hidden'); dzFile.classList.remove('hidden');
  }
  fileInput.addEventListener('change', (e)=> handleFile(e.target.files[0]));
  ['dragenter','dragover'].forEach(evt=> dropzone.addEventListener(evt, (e)=>{ e.preventDefault(); e.stopPropagation(); dropzone.classList.add('drag-over'); }));
  ['dragleave','drop'].forEach(evt=> dropzone.addEventListener(evt, (e)=>{ e.preventDefault(); e.stopPropagation(); dropzone.classList.remove('drag-over'); }));
  dropzone.addEventListener('drop', (e)=>{ handleFile(e.dataTransfer.files[0]); });
  function submitUpload(){
    const msg = document.getElementById('upload-msg');
    if(myOrders.length === 0){ msg.textContent = 'Zatím nemáš žádnou objednávku, ke které by šlo video přiřadit.'; msg.style.color = '#ff8fd6'; msg.classList.remove('hidden'); return; }
    if(dzFile.classList.contains('hidden')){ msg.textContent = '⚠ Nejdřív nahraj video soubor.'; msg.style.color = '#ff8fd6'; msg.classList.remove('hidden'); return; }
    msg.textContent = '✓ Video odesláno značce ke schválení. Po schválení přijde platba do 48 hodin.'; msg.style.color = '#00E5FF'; msg.classList.remove('hidden');
  }
  renderCreatorOrders();
  renderUploadOrderPicker();

  /* ==============================================================
     CHECKOUT / PLATEBNÍ BRÁNA — příprava na Stripe / GoPay
     ------------------------------------------------------------
     openCheckout() zobrazí přehled objednávky a až PO simulovaném
     "webhooku" se zavolá onSuccess (aktivace plánu). V produkci:
       1) "Zaplatit" vytvoří Stripe Checkout Session / GoPay platbu
          na serveru a přesměruje uživatele tam.
       2) Po zaplacení platební brána zavolá webhook
          (checkout.session.completed / GoPay callback).
       3) Teprve webhook (na serveru!) nastaví stav SUBSCRIBED v DB —
          klient nikdy sám neaktivuje placený plán.
  ============================================================== */
  /* ==============================================================
     handleCheckout(planId) — JEDNOTNÝ vstupní bod pro všechny placené
     balíčky (tlačítka u cen volají už jen tohle, ne přímo formuláře).
     TODO Stripe/Google Pay: v openCheckoutLoading() je přesné místo,
     kam patří reálné volání serveru pro vytvoření Checkout Session.
  ============================================================== */
  const CHECKOUT_PLANS = {
    growth: {
      title: 'Growth — měsíční předplatné', amount: 2990, requiredRole: 'brand',
      features: ['Neomezené souběžné objednávky', 'Prioritní odpovědi tvůrců', 'Poplatek jen 7 % z objednávky', 'Reporting dosahu, prokliků a export dat']
    },
    creatorPro: {
      title: 'Creator PRO — měsíční předplatné', amount: 99, requiredRole: 'creator',
      features: ['Neomezený počet inzerátů a nabídek', 'Topování na tržišti', 'Odznak „PRO Tvůrce"', 'Přehled zobrazení profilu', 'Prioritní notifikace o poptávkách']
    }
  };
  function handleCheckout(planId){
    const plan = CHECKOUT_PLANS[planId];
    if(!plan) return;
    requireAuth(plan.requiredRole, ()=> openCheckoutLoading(planId, plan));
  }
  function openCheckoutLoading(planId, plan){
    modalContent.innerHTML =
      '<div class="text-center py-10">' +
        '<div class="w-12 h-12 rounded-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] flex items-center justify-center mx-auto mb-5 text-xl">💳</div>' +
        '<p class="text-zinc-200 text-sm">Připravujeme platební bránu (Stripe / Google Pay)...</p>' +
      '</div>';
    showModal();
    // TODO Stripe/Google Pay: tady v produkci půjde server request, který vytvoří
    // Checkout Session a vrátí URL, na kterou se rovnou přesměruje — např.:
    //   const res = await fetch('/api/create-checkout-session', {
    //     method: 'POST', headers: {'Content-Type':'application/json'},
    //     body: JSON.stringify({ planId, email: currentUser.email })
    //   });
    //   const { url } = await res.json();
    //   window.location.href = url;  // -> Stripe/Google Pay hostovaná stránka
    // Server až po přijatém webhooku (checkout.session.completed) nastaví
    // v databázi SUBSCRIBED — klient si to nikdy neaktivuje sám.
    setTimeout(()=>{
      openCheckout({
        title: plan.title, amount: plan.amount, features: plan.features,
        onSuccess: planId === 'creatorPro' ? activateCreatorPro : activateGrowthPlan
      });
    }, 800);
  }
  function activateGrowthPlan(){
    // Growth zatím (na rozdíl od Creator PRO) v aplikaci nic reálně neodemyká —
    // stejný platební vzor, jen zatím bez navazující business logiky pro značky.
    modalContent.innerHTML = successBlock('Platba proběhla — Growth aktivní! 🎉', 'Stav účtu: SUBSCRIBED. Ozveme se s nastavením účtu podle tvého rozpočtu.');
  }

  function openCheckout(opts){
    window.__checkoutOnSuccess = opts.onSuccess;
    modalContent.innerHTML =
      '<h3 class="font-display font-bold text-xl mb-1">Dokončit platbu</h3>' +
      '<p class="text-zinc-200 text-sm mb-6">Bezpečná platební brána — zatím příprava/simulace pro Stripe a GoPay.</p>' +
      '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-5 mb-4">' +
        '<div class="flex items-center justify-between"><span class="text-sm text-white/85">' + opts.title + '</span><span class="font-display font-bold text-lg">' + opts.amount.toLocaleString('cs-CZ') + ' Kč</span></div>' +
        '<ul class="text-xs text-mist space-y-1.5 mt-3">' + opts.features.map(f=>'<li>✓ ' + f + '</li>').join('') + '</ul>' +
      '</div>' +
      '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 mb-5">' +
        '<p class="text-xs font-mono text-[11px] tracking-wide uppercase text-zinc-200 mb-2.5">Platební metoda</p>' +
        '<div class="grid grid-cols-2 gap-2">' +
          '<button type="button" class="payment-method-btn transition-all duration-200 [&.selected]:border-transparent [&.selected]:bg-gradient-to-r [&.selected]:from-brand-indigo [&.selected]:to-brand-purple [&.selected]:text-white selected bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-lg py-2.5 text-xs font-semibold" onclick="selectPaymentMethod(this)">💳 Platební karta</button>' +
          '<button type="button" class="payment-method-btn transition-all duration-200 [&.selected]:border-transparent [&.selected]:bg-gradient-to-r [&.selected]:from-brand-indigo [&.selected]:to-brand-purple [&.selected]:text-white bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-lg py-2.5 text-xs font-semibold" onclick="selectPaymentMethod(this)">📱 GoPay</button>' +
        '</div>' +
      '</div>' +
      '<button id="pay-btn" onclick="simulatePayment()" class="pb-btn-cta w-full">Zaplatit ' + opts.amount.toLocaleString('cs-CZ') + ' Kč</button>' +
      '<p class="text-center text-[11px] text-zinc-200 font-mono text-[11px] tracking-wide mt-3">🔒 Připraveno pro Stripe Checkout / GoPay — platba zatím není propojená s reálnou bránou</p>';
    showModal();
  }
  function selectPaymentMethod(btn){
    document.querySelectorAll('.payment-method-btn').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
  }
  function simulatePayment(){
    const btn = document.getElementById('pay-btn');
    btn.disabled = true; btn.textContent = 'Zpracovávám platbu...';
    // TODO Stripe/GoPay: místo tohoto setTimeoutu přesměruj na Stripe Checkout
    // Session / GoPay platbu vytvořenou na serveru.
    setTimeout(()=>{
      modalContent.innerHTML =
        '<div class="text-center py-6">' +
          '<div class="w-14 h-14 rounded-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] flex items-center justify-center mx-auto mb-5 text-2xl">⏳</div>' +
          '<h3 class="font-display font-bold text-lg mb-2">Čeká se na potvrzení platby</h3>' +
          '<p class="text-zinc-200 text-sm mb-6 max-w-xs mx-auto">V produkci teď čekáme na webhook z platební brány (checkout.session.completed), který teprve nastaví stav SUBSCRIBED.</p>' +
          '<button onclick="simulateWebhookSuccess()" class="pb-btn-cta">🧪 Simulovat úspěšnou platbu</button>' +
        '</div>';
    }, 900);
  }
  function simulateWebhookSuccess(){
    // TODO: v produkci tohle spouští server po přijetí webhooku, nikdy klient
    if(window.__checkoutOnSuccess) window.__checkoutOnSuccess();
  }

  /* ==============================================================
     CREATOR PRO — limity inzerátů pro bezplatný účet + upgrade flow
     ------------------------------------------------------------
     Bezplatný účet smí mít maximálně FREE_PACKAGE_LIMIT aktivních
     balíčků/inzerátů. Creator PRO (99 Kč/měsíc) tento limit odstraní.
     Klik na "Upgradovat" NIKDY neaktivuje plán natvrdo — vždy projde
     přes openCheckout() a aktivuje se až po (simulovaném) webhooku.
  ============================================================== */
  const FREE_PACKAGE_LIMIT = 2;
  let isCreatorPro = false;
  function canAddMorePackages(){
    if(isCreatorPro) return true;
    if(myCreatorIndex !== null && creators[myCreatorIndex]) return creators[myCreatorIndex].packages.length < FREE_PACKAGE_LIMIT;
    return stagingPackages.length < FREE_PACKAGE_LIMIT;
  }
  function showUpgradePrompt(){
    modalContent.innerHTML =
      '<div class="text-center py-4">' +
        '<div class="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);">⭐</div>' +
        '<h3 class="font-display font-bold text-xl mb-2">Dosáhl/a jsi limitu bezplatného účtu</h3>' +
        '<p class="text-zinc-200 text-sm max-w-sm mx-auto mb-6">Bezplatný účet umožňuje maximálně ' + FREE_PACKAGE_LIMIT + ' aktivní inzeráty/balíčky. Přejdi na <span class="text-white font-semibold">Creator PRO</span> za 99 Kč/měsíc a měj jich neomezeně.</p>' +
        '<button onclick="handleCheckout(\'creatorPro\')" class="pb-btn-cta">Upgradovat na Creator PRO — 99 Kč/měsíc</button>' +
        '<button onclick="closeModal()" class="block mx-auto mt-4 text-xs text-mist hover:text-white underline">Možná později</button>' +
      '</div>';
    showModal();
  }
  function activateCreatorPro(){
    // Sem by v produkci zapsal server stav SUBSCRIBED až po ověřeném webhooku.
    isCreatorPro = true;
    localStorage.setItem('pb_creator_pro', 'true');
    if(myCreatorIndex !== null && creators[myCreatorIndex]){
      creators[myCreatorIndex].isPro = true;
      applyFilters();
      renderMyPackages();
    }
    renderCreatorProCta();
    renderProfileViewsStat();
    modalContent.innerHTML = successBlock('Platba proběhla — Creator PRO aktivní! 🎉', 'Stav účtu: SUBSCRIBED. Teď máš neomezený počet inzerátů, topování na tržišti, odznak "PRO Tvůrce" a přehled zobrazení profilu.');
  }
  function renderProfileViewsStat(){
    const card = document.getElementById('profile-views-card');
    if(!card) return;
    if(isCreatorPro && myCreatorIndex !== null && creators[myCreatorIndex]){
      card.innerHTML = '<p class="text-zinc-200 text-xs font-mono text-[11px] tracking-wide uppercase mb-2">Zobrazení profilu</p><p class="font-display font-extrabold text-3xl bg-gradient-to-r from-accent-soft via-magenta to-cyan bg-clip-text text-transparent">' + (creators[myCreatorIndex].viewCount || 0) + '</p><p class="text-zinc-200 text-xs mt-2">kolikrát značky otevřely tvou kartu</p>';
    } else {
      card.innerHTML = '<p class="text-zinc-200 text-xs font-mono text-[11px] tracking-wide uppercase mb-2">Zobrazení profilu</p><p class="font-display font-extrabold text-3xl text-zinc-200">🔒</p><p class="text-zinc-200 text-xs mt-2">dostupné s <span class="text-white font-semibold">Creator PRO</span></p>';
    }
  }
  function renderCreatorProCta(){
    const btn = document.getElementById('creator-pro-btn');
    if(!btn) return;
    if(isCreatorPro){
      btn.textContent = '✓ Creator PRO aktivní';
      btn.disabled = true;
      btn.classList.add('cursor-default');
      btn.style.opacity = '0.7';
    } else {
      btn.textContent = 'Upgradovat na Creator PRO';
      btn.disabled = false;
      btn.classList.remove('cursor-default');
      btn.style.opacity = '1';
    }
  }

  /* ============== PACKAGE BUILDER (edituje profil, který sis vygeneroval/a v sekci Propojení) ============== */
  let myCreatorIndex = null;
  let editingPackageId = null;
  function renderMyPackages(){
    const list = document.getElementById('my-packages-list');
    if(myCreatorIndex === null || !creators[myCreatorIndex]){
      list.innerHTML = '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-6 text-center text-mist text-sm">Nejdřív si v sekci "Propoj účty a nastav si profil" vygeneruj profil do tržiště — pak tu uvidíš a upravíš jeho balíčky.</div>';
      return;
    }
    const pkgs = creators[myCreatorIndex].packages;
    if(pkgs.length === 0){ list.innerHTML = '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-6 text-center text-mist text-sm">Zatím nemáš žádný balíček. Vytvoř první vlevo.</div>'; return; }
    list.innerHTML = pkgs.map(p=>
      '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-5"><div class="flex items-start justify-between gap-3 mb-2"><p class="font-semibold text-sm">' + p.name + '</p><p class="font-display font-bold text-base bg-gradient-to-r from-accent-soft via-magenta to-cyan bg-clip-text text-transparent whitespace-nowrap">' + p.price.toLocaleString('cs-CZ') + ' Kč</p></div>' +
      '<p class="text-zinc-200 text-xs mb-3">' + platformLabels[p.format] + ' · doručení ' + p.delivery + ' dní · ' + p.revisions + '× revize</p><p class="text-white/70 text-xs mb-3">' + p.description + '</p>' +
      '<span class="font-mono text-[11px] tracking-wide inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-[9px] text-cyan-200 mb-4">🏷 Licence na reklamu: ' + licenseLabel(p.license || '30') + '</span>' +
      '<div class="flex gap-2"><button onclick="editPackage(' + p.id + ')" class="bg-white/[0.04] border border-white/[0.14] transition-all duration-300 hover:bg-white/[0.09] hover:border-white/[0.24] text-xs font-semibold px-3.5 py-2 rounded-lg text-white/85 flex-1">Upravit</button>' +
      '<button onclick="deletePackage(' + p.id + ')" class="bg-white/[0.04] border border-white/[0.14] transition-all duration-300 hover:bg-white/[0.09] hover:border-white/[0.24] text-xs font-semibold px-3.5 py-2 rounded-lg text-white/85 flex-1" style="border-color:rgba(255,80,120,0.35);">Smazat</button></div></div>'
    ).join('');
  }
  function submitPackageForm(e){
    e.preventDefault();
    if(myCreatorIndex === null || !creators[myCreatorIndex]){ alert('Nejdřív si vygeneruj profil do tržiště v sekci "Propoj účty a nastav si profil".'); return; }
    if(editingPackageId === null && !canAddMorePackages()){ showUpgradePrompt(); return; }
    const name = document.getElementById('pkg-name').value.trim();
    const format = document.getElementById('dd-pkg-format').dataset.value;
    const delivery = parseInt(document.getElementById('dd-pkg-delivery').dataset.value, 10);
    const license = document.getElementById('dd-pkg-license').dataset.value;
    const revisions = parseInt(document.getElementById('pkg-revisions').value, 10);
    const price = parseInt(document.getElementById('pkg-price').value, 10);
    const description = document.getElementById('pkg-description').value.trim();
    if(!name || !price || !description) return;
    const pkgs = creators[myCreatorIndex].packages;
    if(editingPackageId !== null){
      const idx = pkgs.findIndex(p=>p.id === editingPackageId);
      if(idx > -1) pkgs[idx] = { id: editingPackageId, name, format, delivery, revisions, price, license, description };
      editingPackageId = null;
    } else { pkgs.push({ id: Date.now(), name, format, delivery, revisions, price, license, description }); }
    resetPackageForm(); renderMyPackages(); applyFilters();
  }
  function editPackage(id){
    if(myCreatorIndex === null || !creators[myCreatorIndex]) return;
    const p = creators[myCreatorIndex].packages.find(x=>x.id === id);
    if(!p) return;
    editingPackageId = id;
    document.getElementById('pkg-name').value = p.name;
    document.getElementById('pkg-revisions').value = p.revisions;
    document.getElementById('pkg-price').value = p.price;
    document.getElementById('pkg-description').value = p.description;
    selectDropdown('dd-pkg-format', p.format, {stopPropagation:()=>{}});
    selectDropdown('dd-pkg-delivery', String(p.delivery), {stopPropagation:()=>{}});
    selectDropdown('dd-pkg-license', p.license || '30', {stopPropagation:()=>{}});
    document.getElementById('pkg-form-title').textContent = 'Upravit balíček';
    document.getElementById('pkg-submit-btn').textContent = 'Uložit změny';
    document.getElementById('pkg-cancel-btn').classList.remove('hidden');
    scrollToId('balicky');
  }
  function deletePackage(id){
    if(myCreatorIndex === null || !creators[myCreatorIndex]) return;
    const pkgs = creators[myCreatorIndex].packages;
    if(pkgs.length <= 1){ alert('Musíš mít alespoň jeden aktivní balíček.'); return; }
    creators[myCreatorIndex].packages = pkgs.filter(p=>p.id !== id);
    if(editingPackageId === id) cancelPackageEdit();
    renderMyPackages(); applyFilters();
  }
  function cancelPackageEdit(){ editingPackageId = null; resetPackageForm(); }
  function resetPackageForm(){
    document.getElementById('package-form').reset();
    document.getElementById('pkg-revisions').value = 1;
    selectDropdown('dd-pkg-format', 'ig-reel', {stopPropagation:()=>{}});
    selectDropdown('dd-pkg-delivery', '7', {stopPropagation:()=>{}});
    selectDropdown('dd-pkg-license', '30', {stopPropagation:()=>{}});
    document.getElementById('pkg-form-title').textContent = 'Nový balíček';
    document.getElementById('pkg-submit-btn').textContent = 'Přidat balíček';
    document.getElementById('pkg-cancel-btn').classList.add('hidden');
  }
  renderMyPackages();

  /* ============== JOB BOARD + BRAND PANEL ============== */
  /* Prázdné pole — žádné vymyšlené firmy. Poptávky přibývají jen reálně
     přes formulář v Panelu pro značky (viz submitNewJob / buildJobPayload). */
  let jobs = [];
  const jobGrid = document.getElementById('job-grid');
  const jobEmptyState = document.getElementById('job-empty-state');

  function jobCardTemplate(j){
    return '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_60px_-20px_rgba(124,58,237,0.5)] hover:border-magenta/40 flex flex-col">' +
      '<div class="flex items-center justify-between mb-3"><span class="font-mono text-[11px] tracking-wide text-[10px] px-2.5 py-1 rounded-md bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-cyan-200">' + (categoryLabelsDemo[j.category]||j.category) + '</span><span class="text-mist text-xs">' + j.company + '</span></div>' +
      '<h3 class="font-display font-semibold text-lg mb-2">' + j.title + '</h3>' +
      '<p class="text-white/70 text-sm mb-5 flex-1">' + j.description + '</p>' +
      '<div class="flex items-center justify-between pt-4 border-t border-white/10">' +
        '<div><p class="text-[10px] font-mono text-[11px] tracking-wide text-zinc-200 uppercase">rozpočet do</p><p class="font-display font-bold text-lg bg-gradient-to-r from-accent-soft via-magenta to-cyan bg-clip-text text-transparent">' + j.budget.toLocaleString('cs-CZ') + ' Kč</p></div>' +
        '<button onclick="openJobApply(' + j.id + ')" class="pb-btn-cta-sm whitespace-nowrap">Odeslat nabídku</button>' +
      '</div></div>';
  }
  function renderJobs(){
    if(jobs.length === 0){ jobGrid.classList.add('hidden'); jobEmptyState.classList.remove('hidden'); return; }
    jobGrid.classList.remove('hidden'); jobEmptyState.classList.add('hidden');
    jobGrid.innerHTML = jobs.map(jobCardTemplate).join('');
  }
  renderJobs();

  function openJobApply(jobId){
    requireAuth('creator', ()=> renderJobApplyForm(jobId));
  }
  function renderJobApplyForm(jobId){
    const j = jobs.find(x=>x.id === jobId);
    if(!j) return;
    modalContent.innerHTML = '<h3 class="font-display font-bold text-xl mb-1">' + j.title + '</h3><p class="text-zinc-200 text-sm mb-6">' + j.company + ' · rozpočet do ' + j.budget.toLocaleString('cs-CZ') + ' Kč</p>' +
      securityBadge() +
      '<form onsubmit="submitJobApplication(event, ' + j.id + ')" class="space-y-4">' +
        '<div><label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Proč jsi pro tuto poptávku vhodný tvůrce?</label><textarea class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03] resize-none" rows="4" placeholder="Krátce popiš svůj obsah, publikum a nápad na zpracování." required></textarea></div>' +
        '<button type="submit" class="pb-btn-cta w-full">Odpovědět na nabídku</button>' +
      '</form>';
    showModal();
  }
  function submitJobApplication(e, jobId){
    e.preventDefault();
    const message = e.target.querySelector('textarea').value.trim();
    const j = jobs.find(x=>x.id === jobId);
    const applicantLabel = (myCreatorIndex !== null && creators[myCreatorIndex]) ? creators[myCreatorIndex].name : (currentUser ? currentUser.email : 'Tvůrce');

    // Payload připravený pro DB (např. tabulka "job_applications" v Supabase)
    const applicationPayload = {
      job_id: jobId,
      applicant_email: currentUser ? currentUser.email : null,
      applicant_label: applicantLabel,
      message: message,
      created_at: new Date().toISOString()
    };
    // TODO Supabase: const { error } = await supabaseClient.from('job_applications').insert(applicationPayload);
    console.log('job application payload (ready for DB insert):', applicationPayload);

    if(j){
      j.applicants.push(applicantLabel);
      const conv = getOrCreateConversation(j, applicantLabel, myCreatorIndex, currentUser ? currentUser.email : null);
      conv.messages.push({ id: Date.now(), sender:'creator', type:'text', text: message, ts: new Date().toISOString() });
      renderCreatorConversations();
      renderChatWidget();
    }
    modalContent.innerHTML = successBlock('Odpověď odeslána', 'Značka dostane tvůj profil a zprávu k poptávce „' + (j ? j.title : '') + '“. Otevřela se ti soukromá konverzace v plovoucím chatu vpravo dole.');
  }

  /* ==============================================================
     CHAT SYSTÉM — soukromá konverzace mezi značkou a tvůrcem
     ------------------------------------------------------------
     DB schéma (Supabase, budoucí):
       conversations(id, job_id, brand_email, creator_email, creator_id, created_at)
       messages(id, conversation_id, sender_role, type['text'|'offer'],
                 text, amount, offer_status['pending'|'accepted'|'rejected'],
                 created_at)
     Zatím vše drženo v paměti (pole conversations) — po refreshi stránky
     se ztrácí, stejně jako ostatní mock data v této demo verzi.

     DŮLEŽITÉ: vlastnictví konverzace na straně tvůrce se pozná podle
     creatorEmail (stabilní přes celou session), NIKDY jen podle
     creatorIdx — ten je index do pole creators a po odhlášení/přihlášení
     se ztrácí. creatorIdx se používá jen pro zobrazení (avatar, statistiky),
     ne pro řízení přístupu. */
  let conversations = [];
  function getOrCreateConversation(job, creatorLabel, creatorIdx, creatorEmail){
    let conv = conversations.find(c=> c.jobId === job.id && c.creatorLabel === creatorLabel);
    if(!conv){
      conv = { id: Date.now() + Math.floor(Math.random()*1000), jobId: job.id, jobTitle: job.title, brandEmail: job.company, creatorLabel: creatorLabel, creatorIdx: creatorIdx, creatorEmail: creatorEmail || null, messages: [] };
      conversations.push(conv);
    } else {
      // Dorovnej creatorIdx/creatorEmail, pokud mezitím tvůrce vygeneroval profil nebo se přihlásil znovu
      if(creatorIdx !== null && creatorIdx !== undefined) conv.creatorIdx = creatorIdx;
      if(creatorEmail) conv.creatorEmail = creatorEmail;
    }
    return conv;
  }
  function isConversationParticipant(conv){
    if(!currentUser) return false;
    if(currentUser.role === 'brand') return currentUser.email === conv.brandEmail;
    if(currentUser.role === 'creator') return currentUser.email === conv.creatorEmail;
    return false;
  }
  function openChat(convId){
    requireAuth(null, ()=>{
      const conv = conversations.find(c=>c.id===convId);
      if(!conv) return;
      if(!isConversationParticipant(conv)){
        modalContent.innerHTML = successBlock('Nemáš přístup k téhle konverzaci', 'Tahle konverzace patří jiné značce nebo tvůrci — otevřít ji může jen firma, která poptávku zadala, a tvůrce, který na ni odpověděl.');
        showModal();
        return;
      }
      renderChatModal(conv);
    });
  }
  function renderChatModal(conv){
    const viewerRole = currentUser.role;
    if((conv.creatorIdx === null || conv.creatorIdx === undefined || !creators[conv.creatorIdx]) && conv.creatorEmail){
      const foundIdx = findMyCreatorIndex(conv.creatorEmail);
      if(foundIdx !== null) conv.creatorIdx = foundIdx;
    }
    const creator = (conv.creatorIdx !== null && creators[conv.creatorIdx]) ? creators[conv.creatorIdx] : null;
    const otherLabel = viewerRole === 'brand' ? conv.creatorLabel : conv.brandEmail;
    const otherAvatar = creator ? avatarHtml(creator,12) : '<div class="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-display font-bold text-white text-xs">' + (otherLabel||'?').slice(0,2).toUpperCase() + '</div>';
    modalContent.innerHTML =
      '<div class="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">' +
        '<div class="rounded-full bg-gradient-to-br from-violet via-magenta to-cyan p-[2.5px] shrink-0 cursor-pointer" onclick="openChatProfile(' + conv.id + ')" title="Zobrazit profil">' + otherAvatar + '</div>' +
        '<div class="min-w-0 flex-1"><p class="font-semibold text-sm truncate">' + otherLabel + '</p><p class="text-zinc-200 text-xs truncate">' + conv.jobTitle + '</p></div>' +
        (conv.approved ? '<span class="font-mono text-[11px] tracking-wide text-[10px] px-2 py-1 rounded-md shrink-0" style="background:rgba(99,102,241,0.22); color:#a5b4fc;">✓ Schváleno</span>' : '') +
      '</div>' +
      (conv.approved && !conv.completed ? '<button onclick="completeCollaboration(' + conv.id + ')" class="w-full mb-4 rounded-xl py-2.5 text-xs font-semibold text-white" style="background:linear-gradient(92deg,#6366f1,#8b5cf6);">✓ Dokončit spolupráci</button>' : '') +
      (conv.completed ? '<div class="w-full mb-4 rounded-xl py-2.5 text-xs font-semibold text-center bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px]" style="color:#a5b4fc;">🎉 Spolupráce dokončena</div>' : '') +
      '<div id="chat-messages" class="space-y-3 max-h-[38vh] overflow-y-auto pr-1 mb-4"></div>' +
      '<div id="chat-offer-form" class="hidden bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 mb-3">' +
        '<label class="block text-xs font-mono text-[11px] tracking-wide uppercase text-mist mb-1.5">Navrhni částku (Kč)</label>' +
        '<div class="flex gap-2"><input id="chat-offer-amount" type="number" min="0" step="100" placeholder="2500" class="flex-1 bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-3 py-2.5 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03]">' +
        '<button type="button" onclick="sendOffer(' + conv.id + ')" class="' + PB_BTN_CTA_SM + '">Poslat nabídku</button></div>' +
      '</div>' +
      '<form onsubmit="sendChatMessage(event, ' + conv.id + ')" class="flex items-center gap-2">' +
        '<button type="button" onclick="toggleOfferForm()" class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold shrink-0" title="Vyjednat cenu / poslat nabídku">+</button>' +
        '<input id="chat-input" type="text" class="flex-1 bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-4 py-3 text-sm border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03]" placeholder="Napiš zprávu...">' +
        '<button type="submit" class="pb-btn-cta shrink-0">Odeslat</button>' +
      '</form>';
    showModal();
    renderChatMessages(conv, viewerRole);
  }
  function renderChatMessages(conv, viewerRole){
    const wrap = document.getElementById('chat-messages');
    if(!wrap) return;
    if(conv.messages.length === 0){ wrap.innerHTML = '<p class="text-center text-zinc-200 text-xs py-6">Zatím žádné zprávy — napiš první.</p>'; return; }
    wrap.innerHTML = conv.messages.map(m=>{
      if(m.type === 'system'){
        return '<div class="text-center"><span class="font-mono text-[11px] tracking-wide text-[10px] px-3 py-1.5 rounded-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-mist inline-block">' + m.text + '</span></div>';
      }
      const isMe = m.sender === viewerRole;
      if(m.type === 'offer'){
        const statusBadge = m.offerStatus === 'accepted' ? '<span class="font-mono text-[11px] tracking-wide text-[10px] px-2 py-1 rounded-md bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-cyan-200">✓ Přijato</span>'
          : m.offerStatus === 'rejected' ? '<span class="font-mono text-[11px] tracking-wide text-[10px] px-2 py-1 rounded-md bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px]" style="color:#ff8fd6;">✕ Odmítnuto</span>'
          : '<span class="font-mono text-[11px] tracking-wide text-[10px] px-2 py-1 rounded-md bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-mist">Čeká na reakci</span>';
        const actions = (m.offerStatus === 'pending' && !isMe)
          ? '<div class="flex gap-2 mt-3"><button onclick="respondOffer(' + conv.id + ',' + m.id + ',\'accepted\')" class="pb-btn-cta-sm flex-1">Akceptovat nabídku</button><button onclick="respondOffer(' + conv.id + ',' + m.id + ',\'rejected\')" class="pb-btn-outline-sm flex-1">Odmítnout / Protinabídka</button></div>'
          : '';
        return '<div class="flex ' + (isMe?'justify-end':'justify-start') + '"><div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 max-w-[78%]" style="border-color:rgba(99,102,241,0.4);">' +
          '<p class="text-[10px] font-mono text-[11px] tracking-wide uppercase text-zinc-200 mb-1">Nabídka ceny</p>' +
          '<p class="font-display font-bold text-lg bg-gradient-to-r from-accent-soft via-magenta to-cyan bg-clip-text text-transparent mb-2">' + m.amount.toLocaleString('cs-CZ') + ' Kč</p>' +
          statusBadge + actions + '</div></div>';
      }
      return '<div class="flex ' + (isMe?'justify-end':'justify-start') + '"><div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl px-4 py-2.5 max-w-[78%] text-sm text-white/90">' + m.text + '</div></div>';
    }).join('');
    wrap.scrollTop = wrap.scrollHeight;
  }
  function approveApplicant(jobId, label){
    const conv = conversations.find(c=>c.jobId===jobId && c.creatorLabel===label);
    if(!conv) return;
    conv.approved = true;
    conv.creatorUnread = (conv.creatorUnread || 0) + 1;
    conv.messages.push({ id: Date.now(), sender:'system', type:'system', text:'✓ Nabídka byla schválena. Spolupráci teď domluvte přímo tady v chatu.', ts: new Date().toISOString() });
    renderMyJobs();
    renderChatWidget();
    openChat(conv.id);
  }
  function completeCollaboration(convId){
    const conv = conversations.find(c=>c.id===convId);
    if(!conv) return;
    conv.completed = true;
    if(currentUser.role === 'brand') conv.creatorUnread = (conv.creatorUnread || 0) + 1;
    conv.messages.push({ id: Date.now(), sender:'system', type:'system', text:'🎉 Spolupráce byla označena jako dokončená.', ts: new Date().toISOString() });
    renderChatModal(conv);
    renderChatWidget();
  }
  function toggleOfferForm(){ document.getElementById('chat-offer-form').classList.toggle('hidden'); }
  function sendChatMessage(e, convId){
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if(!text) return;
    const conv = conversations.find(c=>c.id===convId);
    conv.messages.push({ id: Date.now(), sender: currentUser.role, type:'text', text: text, ts: new Date().toISOString() });
    if(currentUser.role === 'brand') conv.creatorUnread = (conv.creatorUnread || 0) + 1;
    input.value = '';
    renderChatMessages(conv, currentUser.role);
    renderChatWidget();
  }
  function sendOffer(convId){
    const amount = parseInt(document.getElementById('chat-offer-amount').value, 10);
    if(!amount || amount <= 0) return;
    const conv = conversations.find(c=>c.id===convId);
    conv.messages.push({ id: Date.now(), sender: currentUser.role, type:'offer', amount: amount, offerStatus:'pending', ts: new Date().toISOString() });
    if(currentUser.role === 'brand') conv.creatorUnread = (conv.creatorUnread || 0) + 1;
    document.getElementById('chat-offer-amount').value = '';
    document.getElementById('chat-offer-form').classList.add('hidden');
    renderChatMessages(conv, currentUser.role);
    renderChatWidget();
  }
  function respondOffer(convId, msgId, status){
    const conv = conversations.find(c=>c.id===convId);
    const msg = conv.messages.find(m=>m.id===msgId);
    if(msg) msg.offerStatus = status;
    if(currentUser.role === 'brand') conv.creatorUnread = (conv.creatorUnread || 0) + 1;
    renderChatMessages(conv, currentUser.role);
    renderChatWidget();
  }
  function openChatProfile(convId){
    const conv = conversations.find(c=>c.id===convId);
    if(!conv) return;
    const backAction = (currentUser && currentUser.role === 'creator') ? ('closeModal(); openWidgetChat(' + convId + ');') : ('openChat(' + convId + ')');
    const creator = (conv.creatorIdx !== null && creators[conv.creatorIdx]) ? creators[conv.creatorIdx] : null;
    if(!creator){
      modalContent.innerHTML = '<button onclick="' + backAction + '" class="text-mist text-xs mb-5 hover:text-white transition">← Zpět do chatu</button>' +
        '<h3 class="font-display font-bold text-xl mb-2">' + conv.brandEmail + '</h3>' +
        '<p class="text-zinc-200 text-sm">Detail profilu značky zatím není k dispozici.</p>';
      showModal();
      return;
    }
    modalContent.innerHTML = '<button onclick="' + backAction + '" class="text-mist text-xs mb-5 hover:text-white transition">← Zpět do chatu</button>' +
      '<div class="flex items-center gap-4 mb-6"><div class="rounded-full bg-gradient-to-br from-violet via-magenta to-cyan p-[2.5px] shrink-0">' + avatarHtml(creator,20) + '</div>' +
        '<div><h3 class="font-display font-bold text-xl">' + creator.name + (creator.isPro ? ' <span class="text-xs align-middle">⭐</span>' : '') + '</h3><p class="text-zinc-200 text-sm">' + creator.categoryLabel + ' · publikum ' + creator.audienceAge + '</p></div></div>' +
      (creator.bio ? '<p class="text-zinc-200 text-sm mb-6">' + creator.bio + '</p>' : '') +
      '<div class="grid grid-cols-3 gap-3 mb-2"><div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 text-center"><p class="font-display font-bold text-lg">' + creator.followers + '</p><p class="text-zinc-200 text-[11px] font-mono text-[11px] tracking-wide mt-1">sledujících</p></div>' +
        '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 text-center"><p class="font-display font-bold text-lg">' + (creator.avgViews || '—') + '</p><p class="text-zinc-200 text-[11px] font-mono text-[11px] tracking-wide mt-1">zhlédnutí / video</p></div>' +
        '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 text-center"><p class="font-display font-bold text-lg">' + creator.reach + '</p><p class="text-zinc-200 text-[11px] font-mono text-[11px] tracking-wide mt-1">dosah / 30 dní</p></div></div>';
    showModal();
  }

  /* ==============================================================
     PLOVOUCÍ CHAT WIDGET (Messenger styl) — jen pro přihlášené tvůrce
     ------------------------------------------------------------
     Vlastní, na modalu nezávislé UI, aby šlo minimalizovat zpět do
     bubliny bez ztráty rozepsané zprávy (draft) a bez odchodu ze
     stránky. Rozepsané texty se drží v chatWidgetDrafts podle id
     konverzace a přežijí zavření/otevření i přepnutí konverzace.
  ============================================================== */
  let chatWidgetState = { open: false, view: 'list', activeConvId: null };
  let chatWidgetDrafts = {};

  function renderChatWidget(){
    const widget = document.getElementById('chat-widget');
    if(!widget) return;
    const show = !!(currentUser && currentUser.role === 'creator');
    widget.classList.toggle('hidden', !show);
    if(!show){ chatWidgetState.open = false; chatWidgetState.view = 'list'; chatWidgetState.activeConvId = null; return; }
    const avatarSlot = document.getElementById('chat-widget-avatar');
    const profile = getMyProfile();
    avatarSlot.innerHTML = profile.avatarUrl ? '<img src="' + profile.avatarUrl + '" alt="avatar">' : '💬';
    updateChatWidgetBadge();
    if(chatWidgetState.open) renderChatWidgetBody();
  }
  function updateChatWidgetBadge(){
    const badge = document.getElementById('chat-widget-badge');
    if(!badge) return;
    if(!currentUser || currentUser.role !== 'creator'){ badge.classList.add('hidden'); return; }
    const total = conversations.filter(c=>c.creatorEmail === currentUser.email).reduce((sum,c)=> sum + (c.creatorUnread || 0), 0);
    if(total > 0){ badge.textContent = total > 9 ? '9+' : String(total); badge.classList.remove('hidden'); }
    else { badge.classList.add('hidden'); }
  }
  function toggleChatWidget(){
    chatWidgetState.open = !chatWidgetState.open;
    document.getElementById('chat-widget-drawer').classList.toggle('open', chatWidgetState.open);
    if(chatWidgetState.open) renderChatWidgetBody();
  }
  function renderChatWidgetBody(){
    if(chatWidgetState.view === 'chat' && chatWidgetState.activeConvId !== null){
      const conv = conversations.find(c=>c.id === chatWidgetState.activeConvId);
      if(conv){ renderWidgetChatView(conv); return; }
    }
    renderWidgetConversationList();
  }
  function renderWidgetConversationList(){
    chatWidgetState.view = 'list';
    chatWidgetState.activeConvId = null;
    document.getElementById('chat-widget-title').textContent = 'Zprávy';
    const mine = currentUser ? conversations.filter(c=>c.creatorEmail === currentUser.email) : [];
    const body = document.getElementById('chat-widget-body');
    if(mine.length === 0){ body.innerHTML = '<div class="text-center text-mist text-xs py-10 px-3">Zatím žádné zprávy. Objeví se tu po odpovědi na poptávku.</div>'; return; }
    body.innerHTML = mine.map(c=>{
      const unread = c.creatorUnread || 0;
      return '<button onclick="openWidgetChat(' + c.id + ')" class="w-full text-left px-3 py-3 rounded-xl hover:bg-white/8 transition flex items-center justify-between gap-2 mb-1">' +
        '<div class="min-w-0"><p class="font-semibold text-sm truncate">' + c.brandEmail + '</p><p class="text-zinc-200 text-xs truncate">' + c.jobTitle + '</p></div>' +
        (unread > 0 ? '<span class="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style="background:#ef4444;">' + unread + '</span>' : '<span class="text-mist text-[10px] shrink-0 font-mono text-[11px] tracking-wide">' + c.messages.length + '</span>') +
      '</button>';
    }).join('');
  }
  function openWidgetChat(convId){
    const conv = conversations.find(c=>c.id === convId);
    if(!conv || !isConversationParticipant(conv)) return;
    conv.creatorUnread = 0;
    chatWidgetState.open = true;
    chatWidgetState.view = 'chat';
    chatWidgetState.activeConvId = convId;
    document.getElementById('chat-widget-drawer').classList.add('open');
    updateChatWidgetBadge();
    renderWidgetChatView(conv);
  }
  function renderWidgetChatView(conv){
    document.getElementById('chat-widget-title').innerHTML =
      '<button onclick="renderWidgetConversationList()" class="hover:text-white transition mr-1.5" title="Zpět na seznam">←</button>' +
      '<span class="cursor-pointer hover:underline" onclick="openChatProfile(' + conv.id + ')">' + conv.brandEmail + '</span>';
    const body = document.getElementById('chat-widget-body');
    body.innerHTML =
      (conv.approved ? '<span class="font-mono text-[11px] tracking-wide text-[9px] px-2 py-1 rounded-md inline-block mb-2" style="background:rgba(99,102,241,0.22); color:#a5b4fc;">✓ Schváleno</span>' : '') +
      (conv.approved && !conv.completed ? '<button onclick="completeCollaboration(' + conv.id + ')" class="w-full mb-3 rounded-lg py-2 text-xs font-semibold text-white" style="background:linear-gradient(92deg,#6366f1,#8b5cf6);">✓ Dokončit spolupráci</button>' : '') +
      (conv.completed ? '<div class="w-full mb-3 rounded-lg py-2 text-xs font-semibold text-center bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px]" style="color:#a5b4fc;">🎉 Spolupráce dokončena</div>' : '') +
      '<div id="widget-chat-messages" class="space-y-2.5 mb-3"></div>' +
      '<div id="widget-offer-form" class="hidden bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-3 mb-2.5">' +
        '<input id="widget-offer-amount" type="number" min="0" step="100" placeholder="Částka v Kč" class="w-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-3 py-2 text-xs border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03] mb-2">' +
        '<button type="button" onclick="sendWidgetOffer(' + conv.id + ')" class="pb-btn-cta-sm w-full">Poslat cenovou nabídku</button>' +
      '</div>' +
      '<div class="flex items-center gap-1.5">' +
        '<button type="button" onclick="toggleWidgetOfferForm()" class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] w-9 h-9 rounded-lg flex items-center justify-center text-base font-bold shrink-0" title="Vyjednat cenu">+</button>' +
        '<input id="widget-chat-input" type="text" class="flex-1 bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-sm px-3 py-2 text-xs border-none bg-white/[0.065] text-white outline-none transition-all duration-200 placeholder:text-white/40 focus:bg-white/[0.12] focus:shadow-[0_0_0_2px_rgba(232,56,255,0.4)] disabled:bg-white/[0.03]" placeholder="Napiš zprávu...">' +
        '<button onclick="sendWidgetMessage(' + conv.id + ')" class="pb-btn-cta-sm shrink-0">Odeslat</button>' +
      '</div>';
    const input = document.getElementById('widget-chat-input');
    if(chatWidgetDrafts[conv.id]) input.value = chatWidgetDrafts[conv.id];
    input.addEventListener('input', (e)=>{ chatWidgetDrafts[conv.id] = e.target.value; });
    input.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ e.preventDefault(); sendWidgetMessage(conv.id); } });
    renderWidgetMessages(conv);
  }
  function renderWidgetMessages(conv){
    const wrap = document.getElementById('widget-chat-messages');
    if(!wrap) return;
    if(conv.messages.length === 0){ wrap.innerHTML = '<p class="text-center text-zinc-200 text-xs py-6">Zatím žádné zprávy — napiš první.</p>'; return; }
    wrap.innerHTML = conv.messages.map(m=>{
      if(m.type === 'system'){
        return '<div class="text-center"><span class="font-mono text-[11px] tracking-wide text-[9px] px-2.5 py-1 rounded-full bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-mist inline-block">' + m.text + '</span></div>';
      }
      const isMe = m.sender === 'creator';
      if(m.type === 'offer'){
        const statusBadge = m.offerStatus === 'accepted' ? '<span class="font-mono text-[11px] tracking-wide text-[9px] px-1.5 py-0.5 rounded bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-cyan-200">✓ Přijato</span>'
          : m.offerStatus === 'rejected' ? '<span class="font-mono text-[11px] tracking-wide text-[9px] px-1.5 py-0.5 rounded bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px]" style="color:#ff8fd6;">✕ Odmítnuto</span>'
          : '<span class="font-mono text-[11px] tracking-wide text-[9px] px-1.5 py-0.5 rounded bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] text-mist">Čeká na reakci</span>';
        const actions = (m.offerStatus === 'pending' && !isMe)
          ? '<div class="flex gap-1.5 mt-2"><button onclick="respondWidgetOffer(' + conv.id + ',' + m.id + ',\'accepted\')" class="pb-btn-cta-sm text-[10px] px-2 py-1.5 rounded-md flex-1">Akceptovat nabídku</button><button onclick="respondWidgetOffer(' + conv.id + ',' + m.id + ',\'rejected\')" class="pb-btn-outline-sm text-[10px] px-2 py-1.5 rounded-md flex-1">Protinabídka</button></div>'
          : '';
        return '<div class="flex ' + (isMe?'justify-end':'justify-start') + '"><div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-lg p-3 max-w-[85%]" style="border-color:rgba(99,102,241,0.4);">' +
          '<p class="text-[9px] font-mono text-[11px] tracking-wide uppercase text-zinc-200 mb-1">Cenová nabídka</p>' +
          '<p class="font-display font-bold text-sm bg-gradient-to-r from-accent-soft via-magenta to-cyan bg-clip-text text-transparent mb-1.5">' + m.amount.toLocaleString('cs-CZ') + ' Kč</p>' +
          statusBadge + actions + '</div></div>';
      }
      return '<div class="flex ' + (isMe?'justify-end':'justify-start') + '"><div class="text-[0.8rem] bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-lg px-3 py-2 max-w-[85%] text-white/90">' + m.text + '</div></div>';
    }).join('');
    wrap.scrollTop = wrap.scrollHeight;
  }
  function toggleWidgetOfferForm(){
    const form = document.getElementById('widget-offer-form');
    if(form) form.classList.toggle('hidden');
  }
  function sendWidgetMessage(convId){
    const input = document.getElementById('widget-chat-input');
    const text = input.value.trim();
    if(!text) return;
    const conv = conversations.find(c=>c.id === convId);
    if(!conv) return;
    conv.messages.push({ id: Date.now(), sender:'creator', type:'text', text: text, ts: new Date().toISOString() });
    input.value = '';
    delete chatWidgetDrafts[convId];
    renderWidgetMessages(conv);
  }
  function sendWidgetOffer(convId){
    const amountInput = document.getElementById('widget-offer-amount');
    const amount = parseInt(amountInput.value, 10);
    if(!amount || amount <= 0) return;
    const conv = conversations.find(c=>c.id === convId);
    if(!conv) return;
    conv.messages.push({ id: Date.now(), sender:'creator', type:'offer', amount: amount, offerStatus:'pending', ts: new Date().toISOString() });
    amountInput.value = '';
    document.getElementById('widget-offer-form').classList.add('hidden');
    renderWidgetMessages(conv);
  }
  function respondWidgetOffer(convId, msgId, status){
    const conv = conversations.find(c=>c.id === convId);
    if(!conv) return;
    const msg = conv.messages.find(m=>m.id === msgId);
    if(msg) msg.offerStatus = status;
    renderWidgetMessages(conv);
  }


  function switchJobTab(tab){
    document.getElementById('subtab-browse').classList.toggle('active', tab==='browse');
    document.getElementById('subtab-brand').classList.toggle('active', tab==='brand');
    document.getElementById('jobs-browse').classList.toggle('hidden', tab!=='browse');
    document.getElementById('brand-panel').classList.toggle('hidden', tab!=='brand');
    if(tab==='brand' && currentUser && currentUser.role === 'brand') renderMyJobs();
  }

  /* Sestaví čistý JS objekt připravený k odeslání do databáze (viz TODO níže). */
  function buildJobPayload(){
    const title = document.getElementById('job-title').value.trim();
    const category = document.getElementById('dd-job-category').dataset.value;
    const budgetRaw = document.getElementById('job-budget').value;
    const description = document.getElementById('job-description').value.trim();
    const budget = parseInt(budgetRaw, 10);

    if(!title || !budgetRaw || isNaN(budget) || budget <= 0 || !description){
      return { valid:false, errors:['Vyplň prosím název, rozpočet i popis poptávky.'] };
    }
    return {
      valid: true,
      data: {
        title: title,
        category: category,
        budget: budget,
        description: description,
        company_email: currentUser ? currentUser.email : null,
        status: 'active',
        created_at: new Date().toISOString()
      }
    };
  }
  function submitNewJob(e){
    e.preventDefault();
    const result = buildJobPayload();
    if(!result.valid){ alert(result.errors.join('\\n')); return; }

    // TODO Supabase: const { data, error } = await supabaseClient.from('jobs').insert(result.data).select();
    console.log('job payload (ready for DB insert):', result.data);

    const companyLabel = currentUser ? currentUser.email : 'Neznámá značka';
    jobs.push({ id: Date.now(), title: result.data.title, company: companyLabel, category: result.data.category, budget: result.data.budget, description: result.data.description, applicants: [] });
    renderJobs();
    e.target.reset();
    renderMyJobs();
  }
  function renderMyJobs(){
    const companyLabel = currentUser ? currentUser.email : null;
    const mine = jobs.filter(j=>j.company === companyLabel);
    const wrap = document.getElementById('my-jobs-list');
    if(mine.length === 0){ wrap.innerHTML = '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-6 text-center text-mist text-sm">Zatím jsi nepublikoval/a žádnou poptávku.</div>'; return; }
    wrap.innerHTML = mine.map(j=>
      '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-5"><div class="flex items-start justify-between gap-3 mb-2"><p class="font-semibold text-sm">' + j.title + '</p><p class="font-display font-bold text-base bg-gradient-to-r from-accent-soft via-magenta to-cyan bg-clip-text text-transparent whitespace-nowrap">' + j.budget.toLocaleString('cs-CZ') + ' Kč</p></div>' +
      '<p class="text-zinc-200 text-xs mb-3">' + (categoryLabelsDemo[j.category]||j.category) + '</p>' +
      '<p class="text-white/70 text-xs mb-4">' + j.description + '</p>' +
      '<div class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-lg px-4 py-3"><p class="text-xs font-mono text-[11px] tracking-wide uppercase text-zinc-200 mb-2">' + j.applicants.length + ' ' + (j.applicants.length === 1 ? 'odpověď' : 'odpovědi') + '</p>' +
      (j.applicants.length ? '<div class="space-y-2">' + j.applicants.map(a=>{
        const conv = conversations.find(c=>c.jobId===j.id && c.creatorLabel===a);
        const approved = conv && conv.approved;
        return '<div class="flex items-center justify-between gap-2 bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-lg px-3 py-2.5">' +
          '<span class="text-xs font-medium truncate">' + a + (approved ? ' <span class="font-mono text-[11px] tracking-wide text-[9px] px-1.5 py-0.5 rounded ml-1" style="background:rgba(99,102,241,0.25); color:#a5b4fc;">✓ Schváleno</span>' : '') + '</span>' +
          '<div class="flex gap-1.5 shrink-0">' +
            (conv ? '<button onclick="openChat(' + conv.id + ')" class="text-[10px] font-mono text-[11px] tracking-wide bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] px-2.5 py-1.5 rounded-md hover:text-white transition">💬 Chat</button>' : '') +
            (conv && !approved ? '<button onclick="approveApplicant(' + j.id + ', \'' + a.replace(/'/g,"") + '\')" class="text-[10px] font-mono text-[11px] tracking-wide font-semibold px-2.5 py-1.5 rounded-md text-white" style="background:linear-gradient(92deg,#6366f1,#8b5cf6);">Schválit / Přijmout</button>' : '') +
          '</div></div>';
      }).join('') + '</div>' : '<p class="text-xs text-zinc-200">zatím nikdo</p>') +
      '</div></div>'
    ).join('');
  }

  restoreSession();
  enforceDashboardAccess();
  handleAuthCallback();

  /* ============== COOKIE BANNER — perzistence do localStorage ============== */
  const COOKIE_CONSENT_KEY = 'pb_cookie_consent';
  function cookieChoice(choice){
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    hideCookieBanner();
  }
  function hideCookieBanner(){
    const b = document.getElementById('cookie-banner');
    b.style.transform = 'translateY(150%)'; b.style.opacity = '0';
    setTimeout(()=> b.classList.add('hidden'), 550);
  }
  function initCookieBanner(){
    if(localStorage.getItem(COOKIE_CONSENT_KEY)){
      document.getElementById('cookie-banner').classList.add('hidden');
    }
  }
  initCookieBanner();
  function openCookieSettings(){
    modalContent.innerHTML = '<h3 class="font-display font-bold text-xl mb-2">Nastavení cookies</h3><p class="text-zinc-200 text-sm mb-6">Vyber, které kategorie cookies chceš povolit. Nezbytné cookies jsou vždy aktivní pro základní chod webu.</p>' +
      '<div class="space-y-3 mb-7"><label class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 flex items-center justify-between opacity-60"><span class="text-sm font-medium">Nezbytné cookies</span><input type="checkbox" checked disabled></label>' +
      '<label class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 flex items-center justify-between cursor-pointer"><span class="text-sm font-medium">Analytické cookies</span><input type="checkbox" checked></label>' +
      '<label class="bg-gradient-to-b from-white/[0.055] to-white/[0.02] border border-white/[0.09] backdrop-blur-[10px] rounded-xl p-4 flex items-center justify-between cursor-pointer"><span class="text-sm font-medium">Marketingové cookies</span><input type="checkbox"></label></div>' +
      '<button onclick="cookieChoice(\'custom\'); closeModal();" class="pb-btn-cta w-full">Uložit nastavení</button>';
    showModal();
  }
