// Shared chrome + enquiry list + floating engine for every page
const WA='918802395525',$=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const FLOAT=[3,6,9,11,32,40,44,56,57,60,61,69,84,92,94,169,171,174,187,188,193,117]; // ids with cut-outs in media/f
const fimg=id=>`media/f/${id}.webp`;
const esc=s=>s.replace(/"/g,'&quot;');
const page=document.body.dataset.page;

// ---------- chrome ----------
const WAICON='<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>';
document.body.insertAdjacentHTML('afterbegin',`
<div class="alert">✦ ${P.length}+ nail products · wholesale rates · all-India delivery <a href="shop.html">Shop now →</a></div>
<nav><div class="wrap">
 <a href="index.html" class="logo">Nail<i>.</i>Mart</a>
 <div class="nl"><a href="index.html" class="${page==='home'?'on':''}">Home</a><a href="shop.html" class="${page==='shop'?'on':''}">Shop</a><a href="index.html#reels">Reels</a><a href="index.html#visit">Visit</a></div>
 <div class="nr"><a class="shopbtn" href="shop.html">Shop now</a><button class="listbtn" data-open>List <b class="lc">0</b></button></div>
</div></nav>`);
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
const listMsg=()=>`Hi Nail Mart!\nPlease share wholesale rates for:\n${list.map((id,i)=>`${i+1}. ${P[id].n}`).join('\n')}`;
$('#send').onclick=()=>{if(!list.length)return toast('Add a product first');open(`https://wa.me/${WA}?text=${encodeURIComponent(listMsg())}`,'_blank')};

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
