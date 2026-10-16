// Shared chrome + enquiry list + floating engine for every page
const WA='918802395525',$=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const FLOAT=[3,6,9,11,32,40,44,56,57,60,61,69,84,92,94,169,171,174,187,188,193,117]; // ids with cut-outs in media/f
const fimg=id=>`media/f/${id}.webp`;
const esc=s=>s.replace(/"/g,'&quot;');
const page=document.body.dataset.page;
const NAV=[['index.html','Home','home'],['shop.html','Shop','shop'],['wholesale.html','Wholesale','wholesale'],['about.html','About','about'],['faq.html','FAQ','faq'],['track.html','Track order','track']];

// ---------- chrome ----------
const WAICON='<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>';
document.body.insertAdjacentHTML('afterbegin',`
<a class="skip" href="#content">Skip to content</a>
<div class="alert" role="status">✦ ${P.length}+ nail products · wholesale rates · all-India delivery <a href="shop.html">Shop now →</a></div>
<nav aria-label="Main"><div class="wrap">
 <button class="burger" data-menu aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
 <a href="index.html" class="logo" aria-label="Nail Mart home">Nail<i>.</i>Mart</a>
 <div class="nl">${NAV.map(([h,t,k])=>`<a href="${h}" class="${page===k?'on':''}"${page===k?' aria-current="page"':''}>${t}</a>`).join('')}</div>
 <div class="nr"><button class="sbtn" data-search aria-label="Search products"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span>Search</span><kbd>Ctrl K</kbd></button><a class="shopbtn" href="shop.html">Shop now</a><button class="listbtn" data-open aria-label="Open enquiry list">List <b class="lc">0</b></button></div>
</div></nav>
<div class="menu" id="menu" aria-hidden="true"><div class="wrap">${NAV.map(([h,t],k)=>`<a href="${h}" style="--k:${k}">${t}</a>`).join('')}<p class="mono" style="margin-top:30px;opacity:.6">+91 88023 95525 · Mahavir Enclave, New Delhi</p></div></div>
<div class="sov" id="sov" role="dialog" aria-modal="true" aria-label="Search" aria-hidden="true"><div class="sbox">
 <div class="sin"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input id="gq" type="search" placeholder="Search 200+ products, brands, counters…" autocomplete="off" aria-label="Search"><button data-sclose aria-label="Close search">Esc</button></div>
 <div class="sres" id="sres" role="listbox"></div>
</div></div>
<div id="content"></div>`);
const rise=[...FLOAT].sort((a,b)=>a%7-b%7).slice(0,12).map((id,k)=>`<a class="rise" href="product.html?id=${id}" style="left:${(k*8.3+2)%96}%;--s:${70+(k*37)%70}px;--d:${11+(k*5)%9}s;--dl:-${(k*2.3)%14}s;--r:${(k%2?1:-1)*(10+k*4)}deg"><img src="${fimg(id)}" alt="" loading="lazy"></a>`).join('');
document.body.insertAdjacentHTML('beforeend',`
<footer>
 <div class="fcta">${rise}
  <div><p class="mono" style="opacity:.6;margin:0 0 16px">The counter is open</p>
  <h2>Your next set<br>starts <em>here.</em></h2>
  <p>Build a list, send it on WhatsApp, get wholesale rates in minutes.</p>
  <div class="btns"><a class="btn p" href="shop.html">Shop now →</a><a class="btn w" href="https://wa.me/${WA}" target="_blank" rel="noopener">${WAICON} WhatsApp</a></div></div>
 </div>
 <div class="wrap"><div class="fbig">Nail Mart</div>
 <div class="flinks">${NAV.map(([h,t])=>`<a href="${h}">${t}</a>`).join('')}<a href="https://wa.me/${WA}" target="_blank" rel="noopener">WhatsApp</a></div>
 <div class="fbar"><span>RZ-7 &amp; 8B, Gurudwara Road, Mahavir Enclave, New Delhi 110045</span><a href="tel:+918802395525">+91 88023 95525</a><a href="https://www.instagram.com/nail_mart_india/" target="_blank" rel="noopener">Instagram ↗</a></div></div>
</footer>
<div class="mbar"><a class="c" href="shop.html">Shop</a><a class="w" href="https://wa.me/${WA}?text=${encodeURIComponent('Hi Nail Mart! Please share your wholesale rate list.')}" target="_blank" rel="noopener">WhatsApp</a><button class="l" data-open>List <b class="lc">0</b></button></div>
<div class="dw" id="dw"><div class="bg" data-close></div><div class="pn" role="dialog" aria-label="Enquiry list">
 <header><b class="serif" style="font-size:22px">Your list</b><button data-close aria-label="Close" style="font-size:26px">×</button></header>
 <ul id="dl"></ul>
 <div class="ft"><button class="btn w" id="send">Send list on WhatsApp →</button><a class="btn g" href="shop.html">Keep shopping</a></div>
</div></div><div class="toast" id="toast"></div>`);

// ---------- enquiry list ----------
let list=[];try{list=JSON.parse(localStorage.nmList||'[]').filter(i=>P[i])}catch(e){}
const save=()=>{try{localStorage.nmList=JSON.stringify(list)}catch(e){}};
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),1600)}
function sync(){$$('.lc').forEach(x=>x.textContent=list.length);
 $('#dl').innerHTML=list.length?list.map(id=>`<li><img src="${P[id].i}" alt=""><a href="product.html?id=${id}">${P[id].n}</a><button data-rm="${id}" aria-label="Remove">×</button></li>`).join(''):'<li style="display:block;color:var(--mute)">Nothing yet. Tap “+ Add” on products.</li>';
 $$('.add[data-id]').forEach(b=>{const on=list.includes(+b.dataset.id);b.classList.toggle('on',on);b.textContent=on?'✓ In list':(b.dataset.label||'+ Add')});save();document.dispatchEvent(new Event('listchange'))}
function toggle(id){const k=list.indexOf(id);if(k<0){list.push(id);toast('Added · '+list.length+' in list')}else list.splice(k,1);sync()}
document.addEventListener('click',e=>{const a=e.target.closest('.add[data-id]');if(a){e.preventDefault();toggle(+a.dataset.id);return}
 const r=e.target.closest('[data-rm]');if(r){toggle(+r.dataset.rm);return}
 if(e.target.closest('[data-open]'))$('#dw').classList.add('on');
 if(e.target.closest('[data-close]'))$('#dw').classList.remove('on')});
// ---------- orders: every enquiry gets a ref (NM-YYMMDD-XXXX) saved on this device for Track order ----------
// ponytail: no backend — status lives on the device + WhatsApp; wire to Airtable/Sheets when the client says yes
const getOrders=()=>{try{return JSON.parse(localStorage.nmOrders||'[]')}catch(e){return[]}};
function placeOrder(items,who=''){const d=new Date(),r='NM-'+String(d.getFullYear()).slice(2)+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
 const o={ref:r,t:d.getTime(),items:items.map(([id,q])=>[id,q||1]),who};const all=getOrders();all.unshift(o);try{localStorage.nmOrders=JSON.stringify(all.slice(0,30))}catch(e){}
 const msg=`Hi Nail Mart!${who?' '+who:''}\nOrder enquiry ${r}\nPlease share wholesale rates for:\n${o.items.map(([id,q],i)=>`${i+1}. ${P[id].n} × ${q}`).join('\n')}`;
 open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank');return r}
$('#send').onclick=()=>{if(!list.length)return toast('Add a product first');const r=placeOrder(list.map(id=>[id,1]));list=[];sync();$('#dw').classList.remove('on');setTimeout(()=>location.href='track.html?ref='+r,400)};

// ---------- global search (Ctrl/⌘K or "/") ----------
const sov=$('#sov'),gq=$('#gq');
function openS(){sov.classList.add('on');sov.setAttribute('aria-hidden','false');setTimeout(()=>gq.focus(),50);runS()}
function closeS(){sov.classList.remove('on');sov.setAttribute('aria-hidden','true')}
function runS(){const t=gq.value.trim().toLowerCase(),words=t.split(/\s+/).filter(Boolean);
 const hits=words.length?P.filter(p=>words.every(w=>(p.n+' '+p.b+' '+p.c).toLowerCase().includes(w))).slice(0,8):P.filter((p,i)=>FLOAT.includes(i)).slice(0,6);
 const cats=[...new Set(P.map(p=>p.c))].filter(c=>words.length&&c.toLowerCase().includes(words[0]));
 $('#sres').innerHTML=(words.length?'':'<p class="mono sl">Popular</p>')+cats.map(c=>`<a class="sr cat" href="shop.html?c=${encodeURIComponent(c)}" role="option"><b>Counter</b>${c} →</a>`).join('')+
  hits.map(p=>`<a class="sr" href="product.html?id=${p.id}" role="option"><img src="${p.i}" alt="" loading="lazy"><span><small>${p.b||p.c}</small>${p.n}</span></a>`).join('')+
  (words.length?`<a class="sr all" href="shop.html?q=${encodeURIComponent(gq.value.trim())}">See all results for “${esc(gq.value.trim())}” →</a>`:'')+
  (words.length&&!hits.length?`<p class="sl">No match. <a href="https://wa.me/${WA}?text=${encodeURIComponent('Hi Nail Mart! Do you have: '+gq.value)}" style="color:var(--lac);font-weight:700">Ask us on WhatsApp</a></p>`:'')}
gq.oninput=runS;
gq.onkeydown=e=>{if(e.key==='Enter'){const a=$('#sres a');if(a)location.href=a.href}};
addEventListener('keydown',e=>{if((e.key==='k'&&(e.ctrlKey||e.metaKey))||(e.key==='/'&&!/input|textarea/i.test(e.target.tagName))){e.preventDefault();openS()}
 if(e.key==='Escape'){closeS();$('#dw').classList.remove('on');closeM()}});
document.addEventListener('click',e=>{if(e.target.closest('[data-search]'))openS();if(e.target.closest('[data-sclose]')||e.target===sov)closeS();if(e.target.closest('[data-menu]'))$('#menu').classList.contains('on')?closeM():openM()});
// mobile menu
function openM(){$('#menu').classList.add('on');$('[data-menu]').setAttribute('aria-expanded','true');document.body.style.overflow='hidden'}
function closeM(){$('#menu').classList.remove('on');$('[data-menu]').setAttribute('aria-expanded','false');document.body.style.overflow=''}
addEventListener('pageshow',closeM); // bfcache: never come back to a locked page

// page transition: fade out on internal links
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||a.target||e.ctrlKey||e.metaKey)return;const h=a.getAttribute('href');
 if(!/^[a-z]+\.html/.test(h)||h.includes('#'))return;e.preventDefault();document.body.classList.add('leave');setTimeout(()=>location.href=h,220)});
addEventListener('pageshow',()=>document.body.classList.remove('leave'));

// count-up numbers: <b data-count="203">
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);const el=e.target,n=+el.dataset.count,suf=el.dataset.suf||'',t0=performance.now();
 (function f(t){const k=Math.min(1,(t-t0)/1400);el.textContent=Math.round(n*(1-Math.pow(1-k,3)))+suf;if(k<1)requestAnimationFrame(f)})(t0)}));
$$('[data-count]').forEach(el=>cio.observe(el));

const card=p=>`<article class="pc"><a class="im" href="product.html?id=${p.id}"><img src="${p.i}" alt="${esc(p.n)}" loading="lazy" decoding="async" width="480" height="480"></a><div class="tx"><span class="br">${p.b||p.c}</span><h3><a href="product.html?id=${p.id}">${p.n}</a></h3><button class="add" data-id="${p.id}">+ Add</button></div></article>`;
P.forEach((p,i)=>p.id=i);

// ---------- floating engine: one rAF, transform-only, sleeps when off-screen ----------
// .fl elements: data-z = depth (scroll parallax), data-a = bob amplitude, data-r = base rotation
const scenes=[...$$('[data-float]')].map(el=>({el,items:[...el.querySelectorAll('.fl')].map((f,k)=>({f,z:+f.dataset.z||.5,a:+f.dataset.a||14,r:+f.dataset.r||0,ph:k*1.7})),vis:false}));
let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
const sio=new IntersectionObserver(es=>es.forEach(e=>{const s=scenes.find(s=>s.el===e.target);if(s)s.vis=e.isIntersecting}));
scenes.forEach(s=>sio.observe(s.el));
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
function tick(t){if(!document.hidden)for(const s of scenes){if(!s.vis)continue;const r=s.el.getBoundingClientRect(),p=(r.top+r.height/2-innerHeight/2)/innerHeight;
 for(const it of s.items){const y=Math.sin(t/1100+it.ph)*it.a+p*it.z*-260+my*it.z*-30,x=Math.cos(t/1500+it.ph)*it.a*.5+mx*it.z*-50;
  it.f.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${(it.r+Math.sin(t/1800+it.ph)*4+p*it.z*20).toFixed(2)}deg)`}}
 requestAnimationFrame(tick)}
if(!still&&scenes.length)requestAnimationFrame(tick);

// reveals + lazy videos
const rio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
function watch(){$$('.rv:not(.in)').forEach(el=>rio.observe(el))}
const vio=new IntersectionObserver(es=>es.forEach(({target:v,isIntersecting:on})=>{if(on){if(!v.src)v.src=v.dataset.src;v.play().catch(()=>{})}else v.pause()}),{threshold:.25});
addEventListener('DOMContentLoaded',()=>{sync();watch();$$('video[data-src]').forEach(v=>vio.observe(v))});
