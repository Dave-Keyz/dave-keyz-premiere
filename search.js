/* Search for Dave Keyz Premiere. Loads after script.js. */
(function(){
const box=document.querySelector('header input');if(!box)return;
const v=document.createElement('div');v.className='view';v.id='search';
v.innerHTML='<div class="ph"><h2 id="srTitle">Search</h2><p id="srSub"></p></div><div class="grid" id="srGrid"></div><div class="empty" id="srEmpty" style="display:none"><p>No movies found</p><div>Try a different title.</div></div><div class="more"><button class="btn ghost" id="srMore" style="display:none">Load more</button></div>';
document.querySelector('main').appendChild(v);
const srTitle=v.querySelector('#srTitle'),srSub=v.querySelector('#srSub'),srGrid=v.querySelector('#srGrid'),srEmpty=v.querySelector('#srEmpty'),srMore=v.querySelector('#srMore');
let q='',page=0,token=0,timer;
async function run(reset){
 if(reset){page=0;srGrid.innerHTML=''}
 const my=++token;srTitle.textContent='Results for \u201C'+q+'\u201D';srEmpty.style.display='none';
 let items=[],more=false;
 try{
  if(TMDB_KEY){const d=await api('/search/movie?query='+encodeURIComponent(q)+'&page='+(page+1));
   items=(d.results||[]).filter(m=>m.poster_path);more=d.page<d.total_pages}
  else{const all=[...new Set(Object.values(rows).flat())];
   items=all.filter(x=>x.toLowerCase().includes(q.toLowerCase())).map(title=>({title}))}
 }catch(e){}
 if(my!==token)return;
 items.forEach(m=>srGrid.appendChild(mkCard(m)));page++;
 srMore.style.display=more?'':'none';
 srEmpty.style.display=srGrid.children.length?'none':'block';
 srSub.textContent=srGrid.children.length?srGrid.children.length+' shown. Tap any poster for the trailer.':'';
}
function start(){const val=box.value.trim();if(val.length<2)return;q=val;go('search');run(true)}
box.addEventListener('input',()=>{clearTimeout(timer);
 if(!box.value.trim()){if(v.classList.contains('on'))go('home');return}
 timer=setTimeout(start,400)});
box.addEventListener('keydown',e=>{if(e.key==='Enter'){clearTimeout(timer);start()}});
srMore.onclick=()=>run(false);
})();
