/* Flour & Fire — scroll-directed cinematic bakery prototype.
   No build tools, API keys, frameworks or video required. */
(() => {
  'use strict';
  const $ = (s, context = document) => context.querySelector(s);
  const $$ = (s, context = document) => Array.from(context.querySelectorAll(s));
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const money = n => `€${Number(n).toFixed(2)}`;
  const photo = id => `${id}.webp`;

  const products = {
    croissant: {
      id: 'croissant', name: 'Butter croissant', price: 3.80, badge: 'THE MORNING RITUAL',
      description: 'Delicate, crisp layers folded around cultured butter. Shatteringly light on the outside, soft and golden in the middle.',
      image: photo('product-croissant')
    },
    sourdough: {
      id: 'sourdough', name: 'Country sourdough', price: 7.50, badge: 'OUR DAILY LOAF',
      description: 'Our long-fermented signature loaf, with a bold crackling crust, tender open crumb and a gentle, balanced tang.',
      image: photo('product-sourdough')
    },
    chocolate: {
      id: 'chocolate', name: 'Pain au chocolat', price: 4.20, badge: 'A LITTLE INDULGENCE',
      description: 'Flaky French-style pastry wrapped around rich dark chocolate. Warm it slightly and let the centre melt.',
      image: photo('product-chocolate')
    },
    cinnamon: {
      id: 'cinnamon', name: 'Cinnamon knot', price: 4.50, badge: 'SWEET & SPICED',
      description: 'Soft, hand-twisted dough with brown sugar, fragrant cinnamon and a light glossy finish.',
      image: photo('product-cinnamon')
    }
  };
  const information = {
    fermentation: { name: 'A slower rise', badge: 'THE SECRET IS TIME', description: 'Our dough rests slowly so flavour and texture can develop naturally. Gentle handling and a long fermentation make all the difference.', image: products.sourdough.image },
    oven: { name: 'The perfect bake', badge: 'THE HEART OF THE BAKERY', description: 'Intense heat gives a beautiful lift, a thin crisp crust and that unmistakable fresh-from-the-oven aroma.', image: photo('scene-oven') }
  };

  const journey = $('#journey');
  const stage = $('#stage');
  const scenes = $$('.scene');
  const copies = $$('.scene-copy');
  const hotspots = $$('.hotspot');
  const timeline = $$('.timeline-point');
  const chapter = $('#chapterNumber');
  const percentage = $('#scrollPercent');
  const nav = $('#nav');
  const canvas = $('#particles');
  const ctx = canvas.getContext('2d', {alpha:true});
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let target = 0, displayed = 0, currentAct = 0, phase = 0, dots = [], W = 0, H = 0, dpr = 1;
  let pointerX = 0, pointerY = 0, hasFocus = false;

  function positionFor(progress) {
    const top = journey.getBoundingClientRect().top + window.scrollY;
    const max = Math.max(1, journey.offsetHeight - window.innerHeight);
    return top + max * progress;
  }
  function goTo(progress) { window.scrollTo({top:positionFor(progress),behavior:reduced.matches ? 'auto' : 'smooth'}); }
  function updateTarget() {
    const rect = journey.getBoundingClientRect();
    target = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateTarget, {passive:true});
  window.addEventListener('resize', () => {updateTarget(); resizeCanvas();}, {passive:true});
  stage.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    pointerX = (e.clientX / window.innerWidth - .5) * 2;
    pointerY = (e.clientY / window.innerHeight - .5) * 2;
  }, {passive:true});
  stage.addEventListener('pointerleave', () => {pointerX=0;pointerY=0;});
  $('#startScroll').addEventListener('click', () => goTo(.3));
  $('#jumpCollection').addEventListener('click', () => $('#collection').scrollIntoView({behavior:reduced.matches ? 'auto' : 'smooth'}));
  timeline.forEach(b => b.addEventListener('click', () => goTo(Number(b.dataset.target))));

  function resizeCanvas() {
    W = Math.max(1, stage.clientWidth); H = Math.max(1, stage.clientHeight);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W*dpr); canvas.height = Math.round(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = reduced.matches ? 0 : (W < 700 ? 50 : 100);
    dots = Array.from({length:count}, (_,i) => ({
      x:Math.random()*W, y:Math.random()*H, r: .55+Math.random()*2.2,
      speed:.25+Math.random()*.85, drift:(Math.random()-.5)*.6, alpha:.2+Math.random()*.68,
      phase:Math.random()*Math.PI*2, light:Math.random()
    }));
  }
  function renderParticles(p, t) {
    if (!ctx) return;
    ctx.clearRect(0,0,W,H);
    if (reduced.matches) return;
    const isFlour = 1-smooth(.43,.62,p);
    const isEmber = smooth(.42,.62,p)*(1-smooth(.72,.87,p));
    const density = .45 + isFlour*.35 + isEmber*.25;
    for (const d of dots) {
      const drift = Math.sin(t*.00023*d.speed + d.phase)*13;
      const x = (d.x + drift + t*d.drift*.008 + W*2)%W;
      const y = (d.y - t*d.speed*.013 + H*8)%H;
      const opacity = (Math.sin(t*.001*d.speed + d.phase)*.2+.8)*d.alpha*density;
      ctx.beginPath(); ctx.arc(x,y,d.r*(1+isEmber*.1),0,Math.PI*2);
      ctx.fillStyle = isEmber>.48 && d.light>.53 ? `rgba(255,153,59,${opacity*.8})` : `rgba(251,221,180,${opacity*.55})`;
      ctx.fill();
    }
  }
  function render(p, t) {
    const fade1=smooth(.17,.33,p), fade2=smooth(.45,.59,p), fade3=smooth(.72,.85,p);
    const weights=[1-fade1,fade1*(1-fade2),fade2*(1-fade3),fade3];
    let strongest = 0;
    weights.forEach((w,i) => {
      if (w > weights[strongest]) strongest = i;
      const opacity = clamp(w);
      scenes[i].style.opacity = opacity.toFixed(4);
      scenes[i].classList.toggle('is-visible',opacity>.002);
      copies[i].style.opacity = clamp((opacity-.16)/.7).toFixed(3);
      copies[i].style.pointerEvents = opacity > .55 ? 'auto' : 'none';
      copies[i].style.transform = window.innerWidth < 601
        ? `translate3d(0,${(1-opacity)*28}px,0)`
        : `translate3d(0,calc(-43% + ${(1-opacity)*30}px),0)`;
      // Four linked camera moves, not independently scrolling sections.
      const local = i===0 ? clamp(p/.28) : i===1 ? clamp((p-.17)/.4) : i===2 ? clamp((p-.46)/.39) : clamp((p-.73)/.27);
      const zoom = (i===3 ? 1.12 : 1.1) + local*(i===2 ? .24 : .19);
      const x = (i%2 ? -1 : 1)*local*2.7 + pointerX*.65;
      const y = (i===2 ? -3 : 2)*local + pointerY*.45;
      const image = $('.scene-photo', scenes[i]);
      image.style.transform = `translate3d(${x.toFixed(2)}%,${y.toFixed(2)}%,0) scale(${zoom.toFixed(3)})`;
    });
    if (strongest !== currentAct) {currentAct=strongest; chapter.textContent=String(currentAct+1).padStart(2,'0');}
    percentage.textContent=String(Math.round(p*100)).padStart(2,'0');
    $('#scrollInstruction').style.opacity = (1-smooth(.02,.12,p)).toFixed(3);
    hotspots.forEach(h=>{
      const visible=p >= Number(h.dataset.from) && p <= Number(h.dataset.to);
      h.classList.toggle('active',visible);
      h.tabIndex=visible?0:-1;
      h.setAttribute('aria-hidden',String(!visible));
    });
    const breaks=[0,.28,.56,.84,1];
    timeline.forEach((b,i)=>{
      const fill=clamp((p-breaks[i])/(breaks[i+1]-breaks[i]))*100;
      $('span', $('.timeline-track',b)).style.width = fill.toFixed(1)+'%';
      b.classList.toggle('selected',i===currentAct);
    });
    renderParticles(p,t);
  }
  function frame(t) {
    displayed += (target-displayed)*(reduced.matches ? 1 : .24);
    if (Math.abs(target-displayed)<.00003) displayed=target;
    render(displayed,t);
    requestAnimationFrame(frame);
  }

  const backdrop = $('#modalBackdrop');
  const productPanel = $('#productPanel');
  const basketPanel = $('#basket');
  const toast = $('#toast');
  let toastTimer, selectedProduct = null, lastButton = null;
  let bag = {};
  try { bag = JSON.parse(localStorage.getItem('flour-fire-bag') || '{}') || {}; } catch(e) { bag={}; }
  // Ignore invalid/corrupt old cart entries.
  Object.keys(bag).forEach(k=>{if(!products[k] || !Number.isInteger(bag[k]) || bag[k] < 1) delete bag[k];});
  function rememberBag(){try{localStorage.setItem('flour-fire-bag',JSON.stringify(bag));}catch(e){}}
  function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2800);}
  function setModal(kind){
    const isPanel=kind==='product',isBasket=kind==='bag';
    productPanel.hidden=!isPanel; basketPanel.hidden=!isBasket; backdrop.hidden=!(isPanel||isBasket);
    document.body.classList.toggle('dialog-open',isPanel||isBasket);
    if(isPanel) $('#closePanel').focus({preventScroll:true});
    if(isBasket) $('#closeBag').focus({preventScroll:true});
    if(!kind && lastButton && document.contains(lastButton))lastButton.focus({preventScroll:true});
  }
  function openProduct(id, initiator){
    const item=products[id]||information[id];if(!item)return;
    lastButton=initiator||document.activeElement;
    selectedProduct=products[id] ? id : null;
    $('#panelOverline').textContent=item.badge;
    $('#panelNumber').textContent=selectedProduct?'A LITTLE SOMETHING SPECIAL':'HOW WE MAKE IT';
    $('#panelTitle').textContent=item.name;
    $('#panelDescription').textContent=item.description;
    $('#panelImage').style.backgroundImage=`linear-gradient(0deg,rgba(29,17,9,.12),rgba(29,17,9,0)),url("${item.image}")`;
    $('#panelImageFallback').style.opacity='0';
    $('#panelPrice').textContent=selectedProduct?money(item.price):'OUR CRAFT';
    $('#panelPrice').style.fontSize=selectedProduct?'34px':'17px';
    $('#addPanelToBag').hidden=!selectedProduct;
    setModal('product');
  }
  hotspots.forEach(b=>b.addEventListener('click',()=>openProduct(b.dataset.product||b.dataset.info,b)));
  $('#closePanel').addEventListener('click',()=>setModal(null));
  $('#closeBag').addEventListener('click',()=>setModal(null));
  backdrop.addEventListener('click',()=>setModal(null));
  window.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&!backdrop.hidden){e.preventDefault();setModal(null);}
    if(e.key==='Tab'&&!backdrop.hidden){
      const pane = !productPanel.hidden ? productPanel : basketPanel;
      const buttons=$$('button:not([disabled]):not([hidden]),a[href]',pane).filter(b=>b.getClientRects().length);
      if(!buttons.length)return;
      const first=buttons[0],last=buttons[buttons.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  function addToBag(id){
    if(!products[id])return;
    bag[id]=(bag[id]||0)+1;rememberBag();refreshBag();notify(`${products[id].name} added to your basket`);
  }
  $('#addPanelToBag').addEventListener('click',()=>{if(selectedProduct)addToBag(selectedProduct);});
  $('#openBag').addEventListener('click',e=>{lastButton=e.currentTarget;refreshBag();setModal('bag');});
  function refreshBag(){
    let count=0,total=0;
    for(const id of Object.keys(bag)){count+=bag[id];total+=products[id].price*bag[id];}
    $('#bagCount').textContent=count;
    $('#basketTotal').textContent=money(total);
    $('#copyOrder').disabled=count===0;
    $('#copyOrder').style.opacity=count===0?'.45':'1';
    const target=$('#basketItems');
    if(count===0){target.innerHTML='<p class="empty-basket">Nothing in your basket yet. Explore the story or choose something lovely from the collection.</p>';return;}
    target.innerHTML=Object.entries(bag).map(([id,qty])=>{
      const x=products[id];
      return `<div class="basket-row"><div class="basket-thumb" style="background-image:url('${x.image}')"></div><div><div class="basket-item-name">${x.name}</div><div class="basket-item-price">${money(x.price)} each</div></div><div class="qty-controls"><button type="button" data-qty="-1" data-id="${id}" aria-label="Remove one ${x.name}">−</button><span>${qty}</span><button type="button" data-qty="1" data-id="${id}" aria-label="Add one ${x.name}">+</button></div></div>`;
    }).join('');
  }
  $('#basketItems').addEventListener('click',e=>{
    const button=e.target.closest('button[data-qty]');if(!button)return;
    const id=button.dataset.id, delta=Number(button.dataset.qty);
    if(!products[id])return;
    bag[id]=(bag[id]||0)+delta;
    if(bag[id]<=0)delete bag[id];
    rememberBag();refreshBag();
  });
  $('#copyOrder').addEventListener('click',async()=>{
    const lines=['Flour & Fire — concept bakery selection', ...Object.entries(bag).map(([id,q])=>`${products[id].name} × ${q} — ${money(q*products[id].price)}`),'',`Total: ${money(Object.entries(bag).reduce((sum,[id,q])=>sum+products[id].price*q,0))}`,'Demo only — not a real order.'];
    const content=lines.join('\n');
    try {await navigator.clipboard.writeText(content);notify('Order summary copied');}
    catch(e) {window.prompt('Copy your order summary:',content);}
  });

  const grid=$('#productGrid');
  grid.innerHTML=Object.values(products).map((p,i)=>`<article class="product-tile"><button class="product-image" type="button" data-grid-product="${p.id}" aria-label="View ${p.name}"><span class="product-image-photo" style="background-image:url('${p.image}')"></span><span class="tile-number">0${i+1} / THE COLLECTION</span><span class="tile-plus">+</span></button><div class="tile-label"><h3>${p.name}</h3><span>${money(p.price)}</span></div></article>`).join('');
  grid.addEventListener('click',e=>{const b=e.target.closest('[data-grid-product]');if(b)openProduct(b.dataset.gridProduct,b);});
  refreshBag();resizeCanvas();updateTarget();render(displayed,0);requestAnimationFrame(frame);
})();
