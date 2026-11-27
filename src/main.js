// =========================================================================
// Bili Acoustic — page behaviour
// Ported 1:1 from the Claude Artifact version (same logic, split into a
// module and a data file). No external services are called.
// =========================================================================
import { CATS, HOT, DOCS, COURSES, NEWS, STATE_LABEL } from "./data.js";

const vnd = n => n.toLocaleString("vi-VN") + "₫";
const $ = s => document.querySelector(s);
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
let filter = "all", query = "";
const cart = [];

let tt;
function toast(msg){ const el=$("#toast"); el.textContent=msg; el.hidden=false; clearTimeout(tt); tt=setTimeout(()=>el.hidden=true, 2600); }

/* ---------- gold-foil cover marks ---------- */
const G = "#e6cf9c";
function foil(cat, seed){
  let s = "";
  if(cat==="aut"){ // frequency response with limit band
    let d="M6 44", u="M6 30", l="M6 56";
    for(let x=6;x<=114;x+=3){ const f=(x-6)/108; const y=44 - 14*Math.exp(-((f-.12)**2)/.004) + 6*Math.sin(f*9+seed)*f + (f>.85?(f-.85)*90:0); d+=` L${x} ${y.toFixed(1)}`; u+=` L${x} ${(y-12).toFixed(1)}`; l+=` L${x} ${(y+12).toFixed(1)}`; }
    s=`<path d="${u}" fill="none" stroke="${G}" stroke-width=".6" stroke-dasharray="2 2" opacity=".7"/><path d="${l}" fill="none" stroke="${G}" stroke-width=".6" stroke-dasharray="2 2" opacity=".7"/><path d="${d}" fill="none" stroke="${G}" stroke-width="1.3"/>`;
  } else if(cat==="loa"){ // speaker cone, concentric
    for(let r=6;r<=30;r+=6) s+=`<circle cx="60" cy="40" r="${r}" fill="none" stroke="${G}" stroke-width="${r===30?1.3:.6}"/>`;
    s+=`<circle cx="60" cy="40" r="3" fill="${G}"/>`;
  } else if(cat==="fix"){ // polar pattern
    let d=""; for(let a=0;a<=360;a+=4){ const t=a*Math.PI/180, r=26*(.5+.5*Math.cos(t)); d+=(a?" L":"M")+(60+r*Math.sin(t)).toFixed(1)+" "+(42-r*Math.cos(t)).toFixed(1); }
    [10,20,30].forEach(r=> s+=`<circle cx="60" cy="42" r="${r}" fill="none" stroke="${G}" stroke-width=".5" opacity=".6"/>`);
    s+=`<line x1="60" y1="10" x2="60" y2="74" stroke="${G}" stroke-width=".5" opacity=".6"/><line x1="28" y1="42" x2="92" y2="42" stroke="${G}" stroke-width=".5" opacity=".6"/><path d="${d}Z" fill="none" stroke="${G}" stroke-width="1.3"/>`;
  } else if(cat==="thd"){ // harmonics spectrum
    [[20,46],[40,26],[60,16],[80,10],[100,6]].forEach(([x,h],i)=> s+=`<line x1="${x}" x2="${x}" y1="70" y2="${70-h-(i?0:10)}" stroke="${G}" stroke-width="${i?1:2}"/>`);
    s+=`<line x1="8" x2="112" y1="70.5" y2="70.5" stroke="${G}" stroke-width=".6"/>`;
  } else { // distribution with spec limits
    let d="M10 70"; for(let x=10;x<=110;x+=2){ const y=70-44*Math.exp(-((x-58)**2)/260); d+=` L${x} ${y.toFixed(1)}`; }
    s=`<line x1="22" x2="22" y1="16" y2="72" stroke="${G}" stroke-width=".7" stroke-dasharray="2 2"/><line x1="98" x2="98" y1="16" y2="72" stroke="${G}" stroke-width=".7" stroke-dasharray="2 2"/><path d="${d}" fill="none" stroke="${G}" stroke-width="1.3"/><line x1="8" x2="112" y1="70.5" y2="70.5" stroke="${G}" stroke-width=".6"/>`;
  }
  return `<svg viewBox="0 0 120 80" aria-hidden="true">${s}</svg>`;
}

/* ---------- chips ---------- */
function counts(cat){ return cat==="news" ? NEWS.length : DOCS.filter(d=>d.cat===cat).length; }
function renderChips(){
  const order=["all","aut","loa","fix","thd","data","news"];
  $("#chips").innerHTML = order.map(c => `<button class="chip" data-cat="${c}" aria-pressed="${filter===c}">${c==="all"?"Toàn cảnh":"Quầy "+CATS[c].name}${c==="all"?"":`<span class="n num">${counts(c)}</span>`}</button>`).join("");
}
$("#chips").addEventListener("click", e => { const b=e.target.closest(".chip"); if(b) choose(b.dataset.cat); });

/* ---------- docs ---------- */
function renderDocs(){
  const q = query.trim().toLowerCase();
  const list = DOCS.filter(d => (filter==="all"||filter==="news"||d.cat===filter) && (!q || (d.t+" "+d.d+" "+CATS[d.cat].name).toLowerCase().includes(q)));
  $("#docGrid").innerHTML = list.length ? list.map(d => `
    <article class="doc">
      ${d.read ? `<button class="book real" data-read-doc="${d.id}" aria-label="Đọc tài liệu ${esc(d.t)}"><img src="${d.read.cover}" alt="" loading="lazy"><span class="ribbon">Đọc ngay</span></button>` : `<div class="book" style="background:linear-gradient(160deg, color-mix(in srgb, var(--leather-${d.cat}) 80%, #fff 6%), var(--leather-${d.cat}) 55%, color-mix(in srgb, var(--leather-${d.cat}) 70%, #000))">
        <span class="pub">BILI ACOUSTIC</span>
        ${foil(d.cat, +d.id.slice(1))}
        <span class="ct">${esc(d.t)}</span>
        <span class="pg num">${d.p} TRANG</span>
      </div>`}
      <p class="meta">${esc(CATS[d.cat].name)} · ${esc(d.x)}</p>
      <h3>${esc(d.t)}</h3>
      <p class="desc">${esc(d.d)}</p>
      ${d.read ? `<button class="readlink" data-read-doc="${d.id}">Đọc tài liệu · ${d.read.pages} trang →</button>` : ""}
      <div class="row"><span class="price num">${vnd(d.price)}</span><button class="btn sm line" data-add="${d.id}">Thêm vào giỏ</button></div>
    </article>`).join("") : `<p class="empty">Không có tài liệu khớp “${esc(query)}”. Thử từ khoá khác, ví dụ “THD” hoặc “GRR”.</p>`;
  const scope = (filter==="all"||filter==="news") ? "tất cả các quầy" : "Quầy "+CATS[filter].name;
  $("#docStatus").innerHTML = `Đang xem <b>${scope}</b> · <span class="num">${list.length}</span> tài liệu` + ((filter!=="all"&&filter!=="news")||q ? ` · <button class="linkish" id="resetF">Xem tất cả</button>` : "");
}
$("#docStatus").addEventListener("click", e => { if(e.target.id==="resetF"){ query=""; $("#q").value=""; choose("all", false); } });
$("#q").addEventListener("input", e => { query=e.target.value; renderDocs(); });

/* ---------- courses & news ---------- */
$("#courseGrid").innerHTML = COURSES.map(c => `
  <article class="course ${c.state==="ended"?"ended":""}">
    <span class="pill ${c.state}">${STATE_LABEL[c.state]}</span>
    <h3>${esc(c.t)}</h3>
    <p class="desc">${esc(c.d)}</p>
    <dl class="facts"><dt>Thời lượng</dt><dd>${c.dur}</dd><dt>Hình thức</dt><dd>${c.mode}</dd><dt>Khai giảng</dt><dd class="num">${c.start}</dd></dl>
    <div class="row">${c.price ? `<span class="price num">${vnd(c.price)}</span><button class="btn sm" data-add="${c.id}">Giữ chỗ</button>` : `<span class="status">Tư liệu khoá học</span><a class="btn sm line" href="#lien-he">Liên hệ</a>`}</div>
  </article>`).join("");
$("#newsList").innerHTML = NEWS.map(n => `<article><time class="num">${n.d}</time><div><h3>${esc(n.t)}${n.free?'<span class="tag">MIỄN PHÍ</span>':""}</h3><button class="more" data-read>Đọc tiếp →</button></div></article>`).join("");
$("#newsList").addEventListener("click", e => { if(e.target.closest("[data-read]")) toast("Bài viết mẫu: trang chi tiết sẽ mở ở đây khi làm thật."); });

/* ---------- cart ---------- */
function findItem(id){ return DOCS.find(d=>d.id===id) || COURSES.find(c=>c.id===id); }
function renderCart(){
  $("#cartCount").textContent = cart.length; $("#cartCount").hidden = !cart.length;
  $("#cartList").innerHTML = cart.length ? cart.map(id => { const it=findItem(id); return `<div class="ci"><span class="t">${esc(it.t)}</span><span class="p num">${vnd(it.price)}</span><span class="k">${id.startsWith("c")?"KHOÁ HỌC":"TÀI LIỆU PDF"}</span><button data-rm="${id}">Bỏ khỏi giỏ</button></div>`; }).join("") : `<p class="note">Giỏ đang trống. Chọn một tài liệu và bấm “Thêm vào giỏ”.</p>`;
  $("#cartTotal").textContent = vnd(cart.reduce((s,id)=>s+findItem(id).price,0));
  $("#checkout").disabled = !cart.length; $("#checkout").style.opacity = cart.length?1:.5;
}
document.addEventListener("click", e => {
  const a = e.target.closest("[data-add]"); if(a){ const id=a.dataset.add; if(cart.includes(id)) toast("Món này đã có trong giỏ."); else { cart.push(id); renderCart(); toast("Đã thêm: "+findItem(id).t); } }
  const r = e.target.closest("[data-rm]"); if(r){ cart.splice(cart.indexOf(r.dataset.rm),1); renderCart(); $("#checkoutNote").hidden=true; }
});
function openCart(o){ $("#drawer").hidden=!o; $("#scrim").hidden=!o; if(o) $("#closeCart").focus(); }
$("#cartBtn").onclick=()=>openCart(true); $("#closeCart").onclick=()=>openCart(false); $("#scrim").onclick=()=>openCart(false);
$("#checkout").onclick=()=>{ $("#checkoutNote").hidden=false; };
$("#loginBtn").onclick=()=>toast("Trang mẫu: chức năng đăng nhập sẽ nối khi làm thật.");
document.addEventListener("keydown", e => { if(e.key==="Escape"){ if(!$("#reader").hidden){ closeReader(); return; } openCart(false); $("#chatbox").hidden=true; } });

/* ---------- document reader ---------- */
let rdObs, rdLast;
function openReader(id){
  const d = DOCS.find(x=>x.id===id); if(!d || !d.read) return;
  rdLast = document.activeElement;
  $("#rdTitle").textContent = d.t; $("#rdPdf").href = d.read.pdf;
  const n = d.read.pages;
  $("#rdPages").innerHTML = Array.from({length:n}, (_,i)=>`<img src="${d.read.dir}p-${String(i+1).padStart(2,"0")}.jpg" alt="Trang ${i+1}" data-pg="${i+1}" loading="${i<2?"eager":"lazy"}" width="1000" height="1416">`).join("");
  $("#rdCount").textContent = `Trang 1 / ${n}`;
  $("#reader").hidden = false; document.body.style.overflow = "hidden"; $("#rdPages").scrollTop = 0; $("#rdClose").focus();
  rdObs && rdObs.disconnect();
  rdObs = new IntersectionObserver(es => es.forEach(en => { if(en.isIntersecting) $("#rdCount").textContent = `Trang ${en.target.dataset.pg} / ${n}`; }), {root:$("#rdPages"), threshold:.5});
  $("#rdPages").querySelectorAll("img").forEach(im => rdObs.observe(im));
}
function closeReader(){ $("#reader").hidden = true; document.body.style.overflow = ""; rdObs && rdObs.disconnect(); rdLast && rdLast.focus && rdLast.focus(); }
$("#rdClose").onclick = closeReader;
document.addEventListener("click", e => { const r = e.target.closest("[data-read-doc]"); if(r) openReader(r.dataset.readDoc); });
$("#menuBtn").onclick=()=>{ const n=$("#nav"); n.classList.toggle("open"); $("#menuBtn").setAttribute("aria-expanded", n.classList.contains("open")); };
$("#nav").addEventListener("click", e => { if(e.target.tagName==="A") $("#nav").classList.remove("open"); });
$("#fab").onclick=()=>{ const c=$("#chatbox"); c.hidden=!c.hidden; $("#fab").setAttribute("aria-expanded", !c.hidden); };

/* ---------- showroom hotspots ---------- */
const LABEL = k => k==="all" ? "Bàn trưng bày" : k==="desk" ? "Quầy tư vấn" : "Quầy "+CATS[k].name;
$("#hotspots").innerHTML = Object.entries(HOT).map(([k,poly]) =>
  `<polygon class="hot" data-cat="${k}" tabindex="0" role="button" aria-label="${LABEL(k)}" points="${poly.map(([x,y])=>(x*1800).toFixed(1)+","+(y*900).toFixed(1)).join(" ")}"/>`).join("");
const stage=$("#stage"), tip=$("#tip");
function act(k){ if(k==="desk"){ document.getElementById("dich-vu").scrollIntoView({block:"start"}); return; } choose(k, true); }
stage.addEventListener("click", e => { const h=e.target.closest(".hot"); if(h) act(h.dataset.cat); });
stage.addEventListener("keydown", e => { const h=e.target.closest(".hot"); if(h && (e.key==="Enter"||e.key===" ")){ e.preventDefault(); act(h.dataset.cat); } });
stage.addEventListener("mousemove", e => {
  const h=e.target.closest(".hot"); if(!h){ tip.hidden=true; return; }
  const k=h.dataset.cat;
  const sub = k==="all" ? `Xem tất cả ${DOCS.length} tài liệu` : k==="desk" ? "Dịch vụ kỹ thuật và đặt lịch khảo sát" : k==="news" ? `${NEWS.length} bài mới nhất` : `${counts(k)} tài liệu đang bán`;
  tip.innerHTML=`<b>${LABEL(k)}</b>${sub}`; tip.hidden=false;
  tip.style.left=Math.min(e.clientX+16, innerWidth-256)+"px"; tip.style.top=(e.clientY+18)+"px";
});
stage.addEventListener("mouseleave", ()=> tip.hidden=true);
requestAnimationFrame(()=>{ stage.scrollLeft=(stage.scrollWidth-stage.clientWidth)/2; });

function choose(cat, scroll=true){
  filter = cat; renderChips(); renderDocs();
  document.querySelectorAll(".hot").forEach(h => h.classList.toggle("active", h.dataset.cat===cat && cat!=="all"));
  if(scroll) document.getElementById(cat==="news" ? "tin-tuc" : "tai-lieu").scrollIntoView({block:"start"});
}
renderChips(); renderDocs(); renderCart();
