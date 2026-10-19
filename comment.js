/* Shared comments for Dave Keyz Premiere (uses Supabase). Loads after script.js and search.js. */

const SUPABASE_URL="https://vcymyylndtgancblamtu.supabase.co";
const SUPABASE_KEY="sb_publishable_3m6wE5jbPH374vUZiwRV0Q_7F35pic7";

(function(){
 if(!SUPABASE_URL||!SUPABASE_KEY)return;
 const H={apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY,'Content-Type':'application/json'};
 const store={
  get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
 };
 let owner=store.get('dkp-owner',null);
 if(!owner){owner=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():String(Math.random()).slice(2)+Date.now();store.set('dkp-owner',owner)}
 const mine=()=>store.get('dkp-mine',[]);
 const key=()=>{const m=known[cur];return m&&m.id?'tmdb:'+m.id:cur};
 const when=iso=>new Date(iso).toLocaleString([],{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});
 let last=0;

 const st=document.createElement('style');
 st.textContent='.cdel{background:none;border:0;color:var(--muted);cursor:pointer;font:600 12px Inter,sans-serif;margin-left:10px;padding:0}.cdel:hover{color:#e5707a}';
 document.head.appendChild(st);

 async function del(id){
  if(!confirm('Delete this comment?'))return;
  try{
   const r=await fetch(SUPABASE_URL+'/rest/v1/rpc/delete_my_comment',{method:'POST',headers:H,body:JSON.stringify({cid:id,tok:owner})});
   const ok=r.ok&&await r.json();
   if(ok)store.set('dkp-mine',mine().filter(x=>x!==id));
   else alert('Could not delete that comment.');
  }catch(e){alert('Could not delete that comment.')}
  renderC();
 }

 renderC=async function(){
  const k=key();cmH.textContent='Comments';cmList.textContent='Loading comments\u2026';
  try{
   const r=await fetch(SUPABASE_URL+'/rest/v1/comments?movie=eq.'+encodeURIComponent(k)+'&select=id,name,body,created_at&order=created_at.desc&limit=100',{headers:H});
   if(!r.ok)throw 0;
   const a=await r.json();
   if(k!==key())return;
   cmList.innerHTML='';
   cmH.textContent=a.length?'Comments ('+a.length+')':'Comments';
   if(!a.length){const p=document.createElement('p');p.className='cme';p.textContent='No comments yet. Be the first to share what you thought.';cmList.appendChild(p);return}
   const my=mine();
   a.forEach(c=>{const d=document.createElement('div');d.className='cmi';
    const b=document.createElement('b');b.textContent=c.name;
    const s=document.createElement('small');s.textContent=when(c.created_at);
    d.append(b,s);
    if(my.includes(c.id)){const x=document.createElement('button');x.className='cdel';x.textContent='Delete';x.onclick=()=>del(c.id);d.appendChild(x)}
    const p=document.createElement('p');p.textContent=c.body;
    d.appendChild(p);cmList.appendChild(d)});
  }catch(e){cmList.textContent='Could not load comments right now.'}
 };

 cmPost.onclick=async()=>{
  const t=cmText.value.trim();
  if(!t){cmText.focus();return}
  if(Date.now()-last<15000){alert('Please wait a few seconds before posting again.');return}
  cmPost.disabled=true;
  try{
   const r=await fetch(SUPABASE_URL+'/rest/v1/comments?select=id',{method:'POST',headers:{...H,Prefer:'return=representation'},
    body:JSON.stringify({movie:key(),name:(cmName.value.trim()||'Guest').slice(0,30),body:t.slice(0,300),owner_token:owner})});
   if(!r.ok)throw 0;
   const row=await r.json();
   if(row&&row[0]&&row[0].id!==undefined)store.set('dkp-mine',[...mine(),row[0].id]);
   last=Date.now();cmText.value='';await renderC();
  }catch(e){alert('Could not post your comment. Please try again.')}
  cmPost.disabled=false;
 };
})();
