# Builds the inner pages from one shared head. Run: python tools/pages.py
import pathlib
R = pathlib.Path(__file__).resolve().parent.parent
HEAD = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{t} — Nail Mart · Nail Art Products Delhi</title>
<meta name="description" content="{d}">
<meta name="theme-color" content="#b3122e">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter+Tight:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<link rel="stylesheet" href="css/site.css">
</head>
<body data-page="{p}">
'''
TAIL = '''<script src="products.js"></script>
<script src="js/site.js"></script>
{js}
</body>
</html>
'''
def fl(a, b, c):
    return (f'<span class="fl" data-z="1" data-r="-12" style="right:6%;top:14%;width:clamp(80px,10vw,150px)"><img src="media/f/{a}.webp" alt=""></span>'
            f'<span class="fl" data-z="1.4" data-r="10" style="right:24%;top:54%;width:clamp(70px,8vw,120px)"><img src="media/f/{b}.webp" alt=""></span>'
            f'<span class="fl" data-z=".7" data-r="16" style="right:38%;top:10%;width:clamp(50px,6vw,90px)"><img src="media/f/{c}.webp" alt=""></span>')
def head(kick, h1, p, ids):
    return f'<header class="phead" data-float><div class="wrap"><p class="mono" style="color:var(--lac);margin-bottom:14px;position:relative;z-index:2">{kick}</p><h1>{h1}</h1><p>{p}</p></div>{fl(*ids)}</header>\n'

PAGES = {}

PAGES['track.html'] = ('Track order', 'Track your Nail Mart order enquiry by reference number.', 'track',
head('Track order', "Where's my <em>order?</em>", 'Enter the reference from your WhatsApp message (like NM-261016-AB12).', (193, 69, 171)) + r'''
<main class="wrap" style="padding:40px 16px 90px">
 <form id="tf" style="display:flex;gap:10px;flex-wrap:wrap;max-width:620px"><label class="field" style="flex:1;min-width:220px">Order reference<input id="tr" placeholder="NM-YYMMDD-XXXX" autocomplete="off" style="text-transform:uppercase"></label><button class="btn k" style="align-self:end">Track →</button></form>
 <div id="tout" aria-live="polite" style="margin-top:34px"></div>
 <h2 style="font-size:clamp(28px,4vw,48px);margin:60px 0 18px">Orders from this device</h2><div id="mine"></div>
</main>
<style>
.ord{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:22px;margin-bottom:14px}
.ord h3{font:400 26px Fraunces,Georgia,serif}
.steps{display:grid;grid-template-columns:repeat(4,1fr);margin:24px 0 18px;position:relative}
.steps:before{content:"";position:absolute;left:12%;right:12%;top:15px;height:3px;background:var(--line)}
.steps .bar{position:absolute;left:12%;top:15px;height:3px;background:var(--lac);width:0;transition:width 1.2s cubic-bezier(.2,.8,.2,1)}
.st{text-align:center;font-size:12.5px;position:relative;color:var(--mute)}
.st i{display:grid;place-items:center;width:33px;height:33px;margin:0 auto 8px;border-radius:50%;background:var(--paper);border:2px solid var(--line);font-style:normal;font-weight:700;transition:.4s}
.st.on{color:var(--ink);font-weight:600}.st.on i{background:var(--lac);border-color:var(--lac);color:#fff}
.oi{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 16px}.oi img{width:48px;height:48px;border-radius:10px;object-fit:cover}
</style>''', r'''<script>
const S=['Enquiry sent','Rate confirmed','Packed','Dispatched'];
// ponytail: status is estimated on-device from order age; swap for the shop's real status feed when they have one
const stage=o=>{const h=(Date.now()-o.t)/36e5;return h<2?0:h<24?1:h<48?2:3};
const askS=r=>`https://wa.me/${WA}?text=${encodeURIComponent('Hi Nail Mart! What is the status of my order '+r+'?')}`;
const view=o=>{const s=stage(o);return `<div class="ord"><p class="mono" style="color:var(--mute)">${new Date(o.t).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}</p><h3>${o.ref}</h3>
<div class="steps"><div class="bar" data-w="${s/3*76}%"></div>${S.map((x,i)=>`<div class="st${i<=s?' on':''}"><i>${i<=s?'✓':i+1}</i>${x}</div>`).join('')}</div>
<div class="oi">${o.items.slice(0,8).map(([id])=>P[id]?`<a href="product.html?id=${id}"><img src="${P[id].i}" alt="${esc(P[id].n)}"></a>`:'').join('')}</div>
<p style="font-size:14px;color:var(--mute);margin-bottom:14px">${o.items.length} item(s) · estimated status, confirmed by the shop on WhatsApp</p>
<a class="btn w" target="_blank" rel="noopener" href="${askS(o.ref)}">Ask status on WhatsApp →</a></div>`};
const grow=()=>setTimeout(()=>$$('.steps .bar').forEach(b=>b.style.width=b.dataset.w),80);
function find(r){r=r.trim().toUpperCase();if(!r)return;const o=getOrders().find(x=>x.ref===r);
 $('#tout').innerHTML=o?view(o):`<div class="ord"><h3>${esc(r)}</h3><p style="margin:10px 0 16px;color:#3b3033">This order was placed on another phone. Message us and we'll share the live status.</p><a class="btn w" target="_blank" rel="noopener" href="${askS(r)}">Ask on WhatsApp →</a></div>`;grow()}
$('#tf').onsubmit=e=>{e.preventDefault();find($('#tr').value)};
const mine=getOrders();$('#mine').innerHTML=mine.length?mine.map(view).join(''):'<p style="color:var(--mute)">No orders yet. <a href="shop.html" style="color:var(--lac);font-weight:700">Start shopping →</a></p>';
const ref=new URLSearchParams(location.search).get('ref');if(ref){$('#tr').value=ref;find(ref);toast('Order '+ref+' sent on WhatsApp')}grow();
</script>''')

PAGES['about.html'] = ('About', 'Nail Mart is a nail art products wholesaler in Mahavir Enclave, New Delhi, supplying salons, nail artists and academies across India.', 'about',
head('About Nail Mart', 'Built for the <em>artists.</em>', 'A Delhi counter that stocks what nail artists actually use, and ships it across India.', (94, 40, 84)) + r'''
<section><div class="wrap">
 <div class="cards3">
  <div class="box rv"><b class="n" data-count="200" data-suf="+">0</b><h3>Products</h3><p>Gel, cat-eye, builder, tips, art, tools and machines under one roof.</p></div>
  <div class="box rv"><b class="n">5.0★</b><h3>Google rating</h3><p>Rated by the salons and artists who restock with us.</p></div>
  <div class="box rv"><b class="n" data-count="689" data-suf="+">0</b><h3>Products posted</h3><p>Every new arrival swatched on Instagram before it goes on sale.</p></div>
 </div>
 <div class="prose" style="margin-top:60px">
  <h3>The counter</h3><p>Nail Mart is a counter on Gurudwara Road, Mahavir Enclave, for salons tired of guessing colours from a catalogue. New arrivals are swatched on video and posted on Instagram, so you see the real shade first.</p>
  <h3>Who we supply</h3><p>Nail studios and salons, freelance nail artists, nail academies and their students, and resellers across India. Order a single bottle or a full studio setup.</p>
  <h3>How ordering works</h3><p>Build a list on this site, send it on WhatsApp, and a real person confirms price and stock. Pay by UPI or bank transfer, and we dispatch. Every order gets a reference you can follow on the <a href="track.html" style="color:var(--lac);font-weight:700">Track order</a> page.</p>
 </div>
</div></section>
<section style="padding-top:0"><div class="wrap"><div class="eyebrow mono"><span>Visit</span><span>Call before visiting</span></div>
 <h2 class="rv">Come see the <em>wall.</em></h2><p style="margin:18px 0 24px;line-height:1.6">RZ-7 &amp; 8B, Gurudwara Road, Mahavir Enclave, New Delhi 110045 · <a href="tel:+918802395525" style="color:var(--lac);font-weight:700">+91 88023 95525</a></p>
 <a class="btn k" href="https://www.google.com/maps/search/?api=1&query=Nail+Mart+Mahavir+Enclave+New+Delhi" target="_blank" rel="noopener">Get directions ↗</a></div></section>''', '')

PAGES['wholesale.html'] = ('Wholesale', 'Wholesale nail art supplies for salons, academies and resellers. Bulk rates, student kits, all-India dispatch from Nail Mart Delhi.', 'wholesale',
head('Wholesale &amp; bulk', 'Stock your studio <em>for less.</em>', "Tiered rates for salons, academies and resellers. Tell us what you need and we'll quote fast.", (11, 6, 117)) + r'''
<section><div class="wrap">
 <div class="eyebrow mono"><span>Who it's for</span><span>Rates on WhatsApp</span></div>
 <div class="cards3">
  <div class="box rv"><b class="n">01</b><h3>Salons &amp; studios</h3><p>Monthly restock of gels, tips and consumables. Keep a standing list and reorder in one message.</p></div>
  <div class="box rv"><b class="n">02</b><h3>Academies</h3><p>Student kits in bulk: lamp, gels, tips, files and brushes, packed per student.</p></div>
  <div class="box rv"><b class="n">03</b><h3>Resellers</h3><p>Carton quantities on fast movers like cat-eye sets and sandwich tips.</p></div>
 </div>
</div></section>
<section style="padding-top:0"><div class="wrap" style="display:grid;gap:40px;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
 <div><h2 class="rv">Get a <em>bulk quote.</em></h2><p style="margin-top:16px;line-height:1.6;color:#3b3033">Fill this in and it opens WhatsApp with everything we need. You'll get an order reference to track.</p></div>
 <form id="wf" class="box" style="display:grid;gap:14px">
  <label class="field">Business name<input name="n" required autocomplete="organization"></label>
  <label class="field">City<input name="c" required autocomplete="address-level2"></label>
  <label class="field">Type<select name="t"><option>Salon / studio</option><option>Academy</option><option>Reseller</option><option>Freelance artist</option></select></label>
  <label class="field">Monthly budget<select name="b"><option>Under ₹10,000</option><option>₹10,000 – ₹50,000</option><option>₹50,000+</option></select></label>
  <label class="field">What do you need?<textarea name="m" rows="3" placeholder="e.g. 20 student kits, 50 cat-eye sets"></textarea></label>
  <p id="wl" style="font-size:13px;color:var(--mute)"></p>
  <button class="btn w">Get quote on WhatsApp →</button>
 </form>
</div></section>''', r'''<script>
const L=()=>$('#wl').textContent=list.length?'+ your list of '+list.length+' product(s) will be attached':'';L();document.addEventListener('listchange',L);
$('#wf').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const r=placeOrder(list.map(id=>[id,1]),`I'm ${f.get('n')} (${f.get('t')}, ${f.get('c')}), budget ${f.get('b')}. ${f.get('m')}`);list=[];sync();setTimeout(()=>location.href='track.html?ref='+r,400)};
</script>''')

PAGES['faq.html'] = ('FAQ', 'Answers on ordering, payment, delivery, returns and wholesale at Nail Mart, New Delhi.', 'faq',
head('Help', 'Questions, <em>answered.</em>', "Can't find it? Search above or message us on WhatsApp.", (57, 92, 3)) + r'''
<main class="wrap" style="padding:50px 16px 90px;max-width:860px">
 <label class="field" style="margin-bottom:24px">Search the FAQ<input id="fq" type="search" placeholder="delivery, payment, returns…"></label>
 <div id="faq"></div>
</main>
<style>
details{border-bottom:1px solid var(--line)}
summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:16px;padding:20px 0;font:400 clamp(19px,2.4vw,24px) Fraunces,Georgia,serif}
summary::-webkit-details-marker{display:none}
summary:after{content:"+";color:var(--lac);transition:transform .3s;font-size:28px;line-height:1}
details[open] summary:after{transform:rotate(45deg)}
details p{padding:0 0 20px;color:#3b3033;line-height:1.65;max-width:680px;animation:pin .4s}
</style>''', r'''<script>
// ponytail: return/delivery/payment answers are demo copy — confirm with the shop
const F=[['How do I place an order?','Add products to your list with the + Add button, then tap “Send list on WhatsApp”. You get an order reference, and we reply with rates and stock.'],
['Why are there no prices on the site?','Gel and tool prices move with stock and quantity. We confirm the current wholesale rate for your exact list on WhatsApp.'],
['Is there a minimum order?','No. Single pieces are fine. Bigger orders get better rates, see the Wholesale page.'],
['How do I pay?','UPI or bank transfer once your rate is confirmed. Cash at the counter.'],
['Do you deliver outside Delhi?','Yes, all over India by courier. Delhi NCR orders can also be picked up from Mahavir Enclave.'],
['How long does delivery take?','Usually 1–2 days in Delhi NCR and 3–6 days elsewhere after dispatch.'],
['How do I track my order?','Open Track order and enter the reference from your WhatsApp message (NM-…). Orders placed on this phone show up there automatically.'],
['Can I return a product?','Products with a manufacturing defect can be exchanged. Message us within 48 hours of delivery with a photo or video.'],
['Can I see the colour before buying?','Yes. New arrivals are swatched on video on our Instagram @nail_mart_india, and we can send swatches on WhatsApp.'],
['Do you supply academies?','Yes, student kits in bulk, packed per student. Use the quote form on the Wholesale page.']];
const r=t=>$('#faq').innerHTML=F.filter(([q,a])=>(q+a).toLowerCase().includes(t)).map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')||'<p style="color:var(--mute)">No match. Ask us on WhatsApp.</p>';
r('');$('#fq').oninput=e=>r(e.target.value.toLowerCase());
</script>''')

for f, (t, d, p, body, js) in PAGES.items():
    (R / f).write_text(HEAD.format(t=t, d=d, p=p) + body + '\n' + TAIL.format(js=js), encoding='utf8')
print('built', list(PAGES))
