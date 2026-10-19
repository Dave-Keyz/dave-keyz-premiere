// STEP 1: get a free key at themoviedb.org/settings/api and paste it between the quotes.
const TMDB_KEY="5cea8f6a7a218ebb7874639f55bae76e";
// STEP 2 (optional): TMDB movie IDs for Dave’s Picks, for example [278,238,550].
const DAVES_PICKS=[];
let playing=false,pvEl=null,muted=true;
// CONTACT PAGE: edit these two lines.
const CONTACT_EMAIL="irinyemidavid1@gmail.com";
const FORMSPREE_URL="https://formspree.io/f/xbgdbzrp"; // optional: paste your Formspree link, like https://formspree.io/f/xxxx
const palettes=[["#7a1f2b","#2b0d12"],["#1f4a7a","#0d1b2b"],["#2f6b4a","#0d2b1b"],["#7a5a1f","#2b200d"],["#5a1f7a","#1b0d2b"],["#7a3a1f","#2b150d"],["#1f6b7a","#0d252b"],["#6b6b6b","#1b1b1b"]];
const rows={
"Trending":["Midnight Harbor","Ember Road","The Last Reel","Glass Kingdom","Paper Moons","Northern Lights","Echo Valley","Red Carpet Blues"],
"New Releases":["Crown of Dust","Velvet Hour","Skyline Run","The Quiet Year","Neon Tide","Final Curtain","Open Roads","Gold Rush Town"],
"Top Rated":["The Long Goodbye","Starlit Court","Iron Orchard","Summer of 84","Harbor Lights","Silent Bells","Old Hollywood","Rain City"],
"Action":["Breakpoint","Overdrive","Steel Rain","Redline","Hard Target","Last Stand","Blackout","Afterburn"],
"Comedy":["Wedding Crashers Inc.","Game Night Out","Lucky Break","Family Plot","Office Hours","Road Trip Club","Odd Couple Now","Big Day"],
"Horror":["The Hollow","Night Shift","Dead Quiet","Whisper Lane","Cellar Door","Moonless","The Vigil","Black Chapel"],
"Sci-Fi":["Orbit Nine","Static Sky","Lunar Gate","Neural Drift","Deep Signal","Terraform","Quantum Heist","Starfall"],
"Dave’s Picks":["Dave’s Favorite","Weekend Classic","Hidden Gem","Cult Pick","Feel-Good Pick","Date Night","Rewatch Forever","Underrated"]};
const home=document.getElementById('home');let n=0;const list=new Set();
for(const [name,titles] of Object.entries(rows)){
  const s=document.createElement('section');
  s.innerHTML=`<h2>${name}</h2><div class="row"></div>`;
  const r=s.querySelector('.row');
  titles.forEach((t,i)=>{const p=palettes[(n+i)%8];
    const c=document.createElement('div');c.className='card';c.tabIndex=0;
    c.style.background=`linear-gradient(160deg,${p[0]},${p[1]})`;
    c.innerHTML=`<span>${t}<small>★ ${(6.5+((n*7+i*3)%30)/10).toFixed(1)}</small></span>`;
    c.onclick=()=>openM(t);c.onkeydown=e=>{if(e.key==='Enter')openM(t)};
    r.appendChild(c);});
  home.appendChild(s);n+=3;
}
let feat=[
 {t:"Midnight Harbor",d:"A retired detective returns to the docks for one last case, and the city has not forgotten him.",c:["#7a1f2b","#121212"]},
 {t:"Orbit Nine",d:"Nine strangers, one failing station, and a signal from Earth that should not exist.",c:["#1f4a7a","#121212"]},
 {t:"Crown of Dust",d:"An epic of rival families fighting over the last water in the desert kingdom.",c:["#7a5a1f","#121212"]},
 {t:"Skyline Run",d:"A courier races across a sleeping city to deliver one package before sunrise.",c:["#7a3a1f","#121212"]},
 {t:"Ember Road",d:"Two sisters drive the last open highway after the lights go out.",c:["#7a1f2b","#121212"]},
 {t:"Glass Kingdom",d:"A young heir discovers her palace walls hide a very old secret.",c:["#5a1f7a","#121212"]},
 {t:"The Last Reel",d:"A projectionist fights to save the final cinema in town.",c:["#7a5a1f","#121212"]},
 {t:"Neon Tide",d:"A hacker, a smuggler and a storm that will not stop rising.",c:["#1f6b7a","#121212"]},
 {t:"Starlit Court",d:"Love, rivalry and one very long summer at a tennis club.",c:["#2f6b4a","#121212"]},
 {t:"Iron Orchard",d:"A farming family guards their land against a secret that grows beneath it.",c:["#6b6b6b","#121212"]}];
let fi=0,timer;const hero=document.getElementById('hero'),dots=document.getElementById('dots');
feat.forEach((_,i)=>{const d=document.createElement('i');d.onclick=()=>{fi=i;show();};dots.appendChild(d)});
function show(){const f=feat[fi];hero.style.background=f.bg?`url(${f.bg}) center/cover`:`linear-gradient(135deg,${f.c[0]},${f.c[1]})`;
 hT.textContent=f.t;hD.textContent=f.d;[...dots.children].forEach((d,i)=>d.className=i===fi?'on':'');heroPreview();}
function rotate(){clearInterval(timer);timer=setInterval(()=>{if(modal.classList.contains('on')||playing)return;fi=(fi+1)%feat.length;show()},5000)}
show();rotate();
let cur="";
function openM(t,d){cur=t;mT.textContent=t;mD.textContent=d||"Synopsis, cast, runtime and rating will load from TMDB for every movie.";
 mAdd.textContent=list.has(t)?"Remove from List":"Add to List";renderC();modal.classList.add('on');}
function toggle(t){list.has(t)?list.delete(t):list.add(t);renderList();}
hPlay.onclick=()=>openM(feat[fi].t,feat[fi].d);
hAdd.onclick=()=>{toggle(feat[fi].t);hAdd.textContent=list.has(feat[fi].t)?"Added":"Add to List"};
mAdd.onclick=()=>{toggle(cur);mAdd.textContent=list.has(cur)?"Remove from List":"Add to List"};
mClose.onclick=()=>modal.classList.remove('on');
let comments={};
try{comments=JSON.parse(localStorage.getItem('dkp-comments')||'{}')}catch(e){comments={}}
function renderC(){const a=comments[cur]||[];cmH.textContent=a.length?`Comments (${a.length})`:'Comments';cmList.innerHTML='';
 if(!a.length){const p=document.createElement('p');p.className='cme';p.textContent='No comments yet. Be the first to share what you thought.';cmList.appendChild(p);return}
 a.slice().reverse().forEach(c=>{const d=document.createElement('div');d.className='cmi';
  const b=document.createElement('b');b.textContent=c.n;const s=document.createElement('small');s.textContent=c.w;
  const p=document.createElement('p');p.textContent=c.t;d.append(b,s,p);cmList.appendChild(d)})}
cmPost.onclick=()=>{const t=cmText.value.trim();if(!t){cmText.focus();return}
 (comments[cur]=comments[cur]||[]).push({n:cmName.value.trim()||'Guest',t,w:new Date().toLocaleDateString()});
 try{localStorage.setItem('dkp-comments',JSON.stringify(comments))}catch(e){}
 cmText.value='';renderC()};
cmText.onkeydown=e=>{if(e.key==='Enter')cmPost.click()};
modal.onclick=e=>{if(e.target===modal)modal.classList.remove('on')};
document.onkeydown=e=>{if(e.key==='Escape')modal.classList.remove('on')};
nav.onclick=e=>{const v=e.target.dataset.v;if(v)go(v)};

/* ---------- Live TMDB mode (runs only when TMDB_KEY is filled in) ---------- */
const IMG="https://image.tmdb.org/t/p/";
async function api(p){const r=await fetch(`https://api.themoviedb.org/3${p}${p.includes('?')?'&':'?'}api_key=${TMDB_KEY}`);return r.json()}
async function many(p,count){const a=[];for(let pg=1;a.length<count&&pg<=3;pg++){const d=await api(`${p}${p.includes('?')?'&':'?'}page=${pg}`);a.push(...(d.results||[]))}return a.filter(m=>m.poster_path).slice(0,count)}
function closeM(){modal.classList.remove('on');document.querySelector('.player').innerHTML=''}
async function openT(m){known[m.title]=m;cur=m.title;mT.textContent=m.title;mD.textContent=m.overview||'No synopsis yet.';
 mAdd.textContent=list.has(cur)?'Remove from List':'Add to List';renderC();modal.classList.add('on');
 const pl=document.querySelector('.player');pl.textContent='Loading trailer…';
 try{const v=await api(`/movie/${m.id}/videos`);const t=(v.results||[]).find(x=>x.site==='YouTube'&&x.type==='Trailer');
  if(t){pl.innerHTML=`<iframe width="100%" height="100%" style="border:0" src="https://www.youtube.com/embed/${t.key}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen></iframe>`}
  else pl.textContent='No trailer available for this movie yet.'}catch(e){pl.textContent='Trailer could not load.'}}
function buildRow(name,items){const s=document.createElement('section');s.innerHTML=`<h2>${name}</h2><div class="row"></div>`;const r=s.querySelector('.row');
 items.forEach(m=>{const c=document.createElement('div');c.className='card';c.tabIndex=0;c.style.background=`#222 url(${IMG}w342${m.poster_path}) center/cover`;
  c.innerHTML=`<span>${m.title}<small>★ ${(m.vote_average||0).toFixed(1)}</small></span>`;
  c.onclick=()=>openT(m);c.onkeydown=e=>{if(e.key==='Enter')openT(m)};r.appendChild(c)});home.appendChild(s)}
async function loadTMDB(){if(!TMDB_KEY)return;
 try{const sets={"Trending":"/trending/movie/day","New Releases":"/movie/now_playing","Top Rated":"/movie/top_rated","Action":"/discover/movie?with_genres=28","Comedy":"/discover/movie?with_genres=35","Horror":"/discover/movie?with_genres=27","Sci-Fi":"/discover/movie?with_genres=878"};
  const tr=await many('/trending/movie/day',20);
  feat=tr.filter(m=>m.backdrop_path).slice(0,10).map(m=>({t:m.title,d:m.overview,bg:IMG+'w1280'+m.backdrop_path,m}));
  fi=0;dots.innerHTML='';feat.forEach((_,i)=>{const d=document.createElement('i');d.onclick=()=>{fi=i;show()};dots.appendChild(d)});show();rotate();
  hPlay.onclick=()=>openT(feat[fi].m);
  mClose.onclick=closeM;modal.onclick=e=>{if(e.target===modal)closeM()};document.onkeydown=e=>{if(e.key==='Escape')closeM()};
  home.innerHTML='';
  for(const [name,p] of Object.entries(sets))buildRow(name,await many(p,25));
  if(DAVES_PICKS.length){const picks=await Promise.all(DAVES_PICKS.map(id=>api(`/movie/${id}`)));buildRow('Dave’s Picks',picks.filter(m=>m.poster_path))}
 }catch(e){console.error('TMDB failed, keeping sample data',e)}}
loadTMDB();

/* ---------- Movies, Trailers and My List pages ---------- */
const known={};
function hash(t){let h=0;for(const ch of t)h=(h*31+ch.charCodeAt(0))>>>0;return h}
function pal(t){return palettes[hash(t)%8]}
function showM(m){known[m.title]=known[m.title]||m;m.id?openT(m):openM(m.title)}
function mkCard(m,rm){const c=document.createElement('div');c.className='card';c.tabIndex=0;
 if(m.poster_path)c.style.background=`#222 url(${IMG}w342${m.poster_path}) center/cover`;
 else{const p=pal(m.title);c.style.background=`linear-gradient(160deg,${p[0]},${p[1]})`}
 const r=m.vote_average||6.5+(hash(m.title)%30)/10;
 const s=document.createElement('span');s.textContent=m.title;const sm=document.createElement('small');sm.textContent='★ '+r.toFixed(1);s.appendChild(sm);c.appendChild(s);
 if(rm){const x=document.createElement('button');x.className='x';x.textContent='×';x.setAttribute('aria-label','Remove '+m.title);x.onclick=e=>{e.stopPropagation();toggle(m.title)};c.appendChild(x)}
 c.onclick=()=>showM(m);c.onkeydown=e=>{if(e.key==='Enter')showM(m)};return c}

// Movies page
let mvKey='All',mvPage=0;
const GEN={'All':'/discover/movie?sort_by=popularity.desc','Action':'/discover/movie?with_genres=28','Comedy':'/discover/movie?with_genres=35','Horror':'/discover/movie?with_genres=27','Sci-Fi':'/discover/movie?with_genres=878','Top Rated':'/movie/top_rated','New Releases':'/movie/now_playing'};
async function mvFetch(){
 if(TMDB_KEY){const p=GEN[mvKey];const d=await api(`${p}${p.includes('?')?'&':'?'}page=${mvPage+1}`);return(d.results||[]).filter(m=>m.poster_path)}
 const src=mvKey==='All'?[...new Set(Object.entries(rows).filter(([k])=>k!=='Dave’s Picks').flatMap(([,v])=>v))]:rows[mvKey];
 return src.slice(mvPage*12,mvPage*12+12).map(title=>({title}))}
async function mvLoad(reset){if(reset){mvPage=0;mvGrid.innerHTML=''}
 try{const items=await mvFetch();items.forEach(m=>mvGrid.appendChild(mkCard(m)));mvPage++;mvMore.style.display=items.length>=(TMDB_KEY?15:12)?'':'none'}catch(e){mvMore.style.display='none'}}
Object.keys(GEN).forEach(k=>{const b=document.createElement('button');b.className='chip'+(k==='All'?' on':'');b.textContent=k;
 b.onclick=()=>{mvKey=k;[...mvChips.children].forEach(x=>x.classList.toggle('on',x===b));mvLoad(true)};mvChips.appendChild(b)});
mvMore.onclick=()=>mvLoad(false);mvLoad(true);

// Trailers page
async function loadTr(){let items=[];
 if(TMDB_KEY){try{items=(await many('/trending/movie/week',60)).filter(m=>m.backdrop_path).slice(0,48)}catch(e){}}
 else items=[...rows['Trending'],...rows['New Releases']].map(title=>({title}));
 items.forEach(m=>{const t=document.createElement('div');t.className='tile';t.tabIndex=0;
  if(m.backdrop_path)t.style.background=`#222 url(${IMG}w780${m.backdrop_path}) center/cover`;
  else{const p=pal(m.title);t.style.background=`linear-gradient(135deg,${p[0]},${p[1]})`}
  const pl=document.createElement('div');pl.className='pl';pl.textContent='▶';
  const s=document.createElement('span');s.textContent=m.title;t.append(pl,s);
  t.onclick=()=>showM(m);t.onkeydown=e=>{if(e.key==='Enter')showM(m)};trGrid.appendChild(t)})}
loadTr();

// My List page
function renderList(){listGrid.innerHTML='';
 [...list].forEach(t=>listGrid.appendChild(mkCard(known[t]||(feat.find(f=>f.t===t)||{}).m||{title:t},true)));
 listCount.textContent=list.size?`${list.size} saved`:'';listEmpty.style.display=list.size?'none':'block'}
goMovies.onclick=()=>nav.querySelector('[data-v="movies"]').click();
renderList();


/* ---------- Banner trailers, About and Contact ---------- */
async function ytKey(m){if(m._k!==undefined)return m._k;
 try{const v=await api(`/movie/${m.id}/videos`);const t=(v.results||[]).find(x=>x.site==='YouTube'&&x.type==='Trailer');m._k=t?t.key:null}catch(e){m._k=null}return m._k}
function mkFrame(k,mute){const d=document.createElement('div');d.className='hv';
 d.innerHTML=`<iframe src="https://www.youtube.com/embed/${k}?autoplay=1&mute=${mute?1:0}&controls=${mute?0:1}&start=${mute?10:0}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1" allow="autoplay; fullscreen" allowfullscreen title="Trailer"></iframe>`;return d}
function clearPv(){if(pvEl){pvEl.remove();pvEl=null}hero.classList.remove('pv');muted=true;hS.textContent='\uD83D\uDD07'}
async function heroPreview(){clearPv();if(!TMDB_KEY||playing)return;const f=feat[fi],my=fi;if(!f||!f.m)return;
 const k=await ytKey(f.m);if(!k||my!==fi||playing)return;
 pvEl=mkFrame(k,true);hero.prepend(pvEl);hero.classList.add('pv');requestAnimationFrame(()=>pvEl&&pvEl.classList.add('on'))}
async function bannerPlay(){clearInterval(timer);playing=true;clearPv();hero.classList.add('playing');
 if(TMDB_KEY&&feat[fi].m){const k=await ytKey(feat[fi].m);if(k){pvEl=mkFrame(k,false);hero.prepend(pvEl);pvEl.classList.add('on');return}}
 const d=document.createElement('div');d.className='hv on mock';d.textContent=TMDB_KEY?'No trailer available for this movie.':'The trailer plays here, right inside the banner.';pvEl=d;hero.prepend(d)}
function closeBanner(){playing=false;clearPv();hero.classList.remove('playing');rotate();heroPreview()}
hFull.onclick=bannerPlay;hX.onclick=closeBanner;
hS.onclick=()=>{const fr=hero.querySelector('.hv iframe');if(!fr)return;muted=!muted;
 fr.contentWindow.postMessage(JSON.stringify({event:'command',func:muted?'mute':'unMute',args:[]}),'*');hS.textContent=muted?'\uD83D\uDD07':'\uD83D\uDD0A'};
hero.onmouseenter=()=>clearInterval(timer);
hero.onmouseleave=()=>{if(!playing&&!modal.classList.contains('on'))rotate()};

function go(v){[...nav.children].forEach(b=>b.classList.toggle('on',b.dataset.v===v));
 document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id===v));
 hero.style.display=v==='home'?'flex':'none';
 if(v==='home'){rotate();heroPreview()}else{if(playing)closeBanner();clearPv();clearInterval(timer)}
 window.scrollTo(0,0)}
logo.onclick=()=>go('about');logo.onkeydown=e=>{if(e.key==='Enter')go('about')};
aboutContact.onclick=()=>go('contact');
cMail.href='mailto:'+CONTACT_EMAIL;cMail.textContent=CONTACT_EMAIL;
cForm.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(cForm));
 if(!FORMSPREE_URL){location.href=`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(d.subject||'Message from the website')}&body=${encodeURIComponent(d.message+'\n\nFrom: '+d.name+' ('+d.email+')')}`;cStat.textContent='Opening your email app\u2026';return}
 cStat.textContent='Sending\u2026';
 try{const r=await fetch(FORMSPREE_URL,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(d)});
  if(!r.ok)throw 0;cStat.textContent='Thanks! Your message was sent.';cForm.reset()}catch(x){cStat.textContent='Something went wrong. Please try again.'}};
