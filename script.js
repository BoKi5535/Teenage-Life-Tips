const seedTips = [
  {id:"s1",title:"Two-Notebook Study Hack",body:"One for messy notes, one for clean summaries right after class. You review while rewriting.",tags:["study","productivity"]},
  {id:"s2",title:"Phone Parking",body:"Drop your phone in another room for 25-minute focus blocks. Timer on a laptop tab.",tags:["focus","study"]},
  {id:"s3",title:"Snack Swap",body:"Swap sugary snacks with nuts or yogurt on weekdays; save sweets for weekends.",tags:["health","food"]},
  {id:"s4",title:"Bedtime Wind-Down",body:"10 minutes of low-light reading or stretching before bed; screens off 30 minutes earlier.",tags:["sleep","health"]},
  {id:"s5",title:"Micro-Budget",body:"Track only 3 categories: food, fun, gifts. Use a weekly cap and stop when it’s spent.",tags:["money","simplicity"]},
  {id:"s6",title:"Group Project Roles",body:"Assign roles at the start (leader, checker, slides, research) to avoid last-minute chaos.",tags:["school","collab"]},
  {id:"s7",title:"Teacher Office Hours",body:"Ask one prepared question weekly. Builds rapport and raises clarity fast.",tags:["school","study"]},
  {id:"s8",title:"Water Trigger",body:"Every time you enter your room, take 5 sips. Simple cue = more hydration.",tags:["health","habit"]},
  {id:"s9",title:"Confidence Lift",body:"List 3 wins from the day before you sleep. Tiny journal, big mood shift.",tags:["mindset","mental"]},
  {id:"s10",title:"Event Photos Folder",body:"Share a single cloud folder link after events so everyone drops pics in one place.",tags:["social","organization"]},
  {id:"s11",title:"Pomodoro Walks",body:"After each 25-min study block, stand and stretch or walk for 2 minutes.",tags:["study","focus"]},
  {id:"s12",title:"Shared Playlist",body:"Make a collaborative playlist with friends for study or workouts.",tags:["social","fun"]},
  {id:"s13",title:"Sunday Reset",body:"Spend 30 minutes planning outfits, homework, and 3 goals for the week.",tags:["organization","mindset"]},
  {id:"s14",title:"Digital Clean-Up",body:"Delete old screenshots and unused apps for 10 minutes once a month.",tags:["tech","organization"]},
  {id:"s15",title:"2-Minute Rule",body:"If something takes under 2 minutes, do it now.",tags:["productivity","habit"]},
  {id:"s16",title:"Study Soundtrack",body:"Use instrumental/game OSTs to block noise without lyrics.",tags:["study","focus"]},
  {id:"s17",title:"Quick Prep Box",body:"Keep spare pens, charger, gum, and a snack in one pouch.",tags:["school","organization"]},
  {id:"s18",title:"Watermark Notes",body:"Put page numbers and dates on every note page for easy review.",tags:["study","organization"]},
  {id:"s19",title:"Morning Sun Hack",body:"Open your curtains as soon as you wake up to reset your body clock.",tags:["sleep","health"]},
  {id:"s20",title:"Homework First 10",body:"Do 10 minutes of the hardest homework first to beat procrastination.",tags:["study","productivity"]},
  {id:"s21",title:"No-Zero Days",body:"Do at least one tiny thing daily for a goal, even 5 minutes.",tags:["mindset","habit"]},
  {id:"s22",title:"Micro-Reward",body:"After finishing a task, give yourself a small reward—stretch, snack, song.",tags:["motivation","productivity"]}
];
const $ = s => document.querySelector(s);
const tipsEl = $("#tips"), emptyEl = $("#empty");
const searchEl = $("#search"), randomBtn = $("#randomBtn"), clearFiltersBtn=$("#clearFilters");
const addForm = $("#addForm"), tipTitle=$("#tipTitle"), tipBody=$("#tipBody"), tipTags=$("#tipTags");
const LS_KEY = "tlt_user_tips", LIKE_KEY="tlt_likes";
let state = {query:"", tips:[], likes:new Set()};

function load() {
  const userTips = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  const likes = new Set(JSON.parse(localStorage.getItem(LIKE_KEY) || "[]"));
  state.tips = [...seedTips, ...userTips];
  state.likes = likes;
  applyFilters();
}

function applyFilters() {
  const q = (searchEl.value||"").trim().toLowerCase();
  const filtered = state.tips.filter(t=>{
    const text = (t.title+" "+t.body+" "+(t.tags||[]).join(" ")).toLowerCase();
    return !q || text.includes(q);
  });
  renderTips(filtered);
}

function renderTips(list) {
  tipsEl.innerHTML = "";
  if(!list.length){ emptyEl.style.display="block"; return }
  emptyEl.style.display="none";
  list.forEach(t=>{
    const card = document.createElement("article");
    card.className = "tip";
    card.innerHTML = `
      <div class="txt">
        <h3>${escapeHTML(t.title)}</h3>
        <p>${escapeHTML(t.body)}</p>
      </div>
      <div class="meta">
        <div class="chip">${(t.tags||[]).map(x=>"#"+x).join(" ")}</div>
        <button class="like ${state.likes.has(t.id)?"liked":""}" title="Like">★</button>
      </div>
    `;
    card.querySelector(".like").onclick = ()=>{
      toggleLike(t.id);
      card.querySelector(".like").classList.toggle("liked", state.likes.has(t.id));
    };
    tipsEl.appendChild(card);
  });
}

function toggleLike(id){
  state.likes.has(id)? state.likes.delete(id) : state.likes.add(id);
  localStorage.setItem(LIKE_KEY, JSON.stringify([...state.likes]));
}

function randomTip(){
  const cards = tipsEl.querySelectorAll(".tip");
  if(!cards.length) return;
  const idx = Math.floor(Math.random()*cards.length);
  cards[idx].scrollIntoView({behavior:"smooth", block:"center"});
  cards[idx].style.outline="2px solid var(--acc)";
  setTimeout(()=>cards[idx].style.outline="none",1400);
}

function addTip(e){
  e.preventDefault();
  const t = tipTitle.value.trim(), b = tipBody.value.trim(), tg = tipTags.value.toLowerCase().split(",").map(s=>s.trim()).filter(Boolean);
  if(!t || !b) return;
  const newTip = {id:"u_"+Date.now(), title:t, body:b, tags:tg};
  const userTips = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  userTips.unshift(newTip);
  localStorage.setItem(LS_KEY, JSON.stringify(userTips));
  tipTitle.value=""; tipBody.value=""; tipTags.value="";
  state.tips.unshift(newTip);
  applyFilters();
  tipsEl.firstElementChild?.scrollIntoView({behavior:"smooth",block:"center"});
}

function resetFilters(){ state.query=""; searchEl.value=""; applyFilters(); }

function escapeHTML(s){ return s.replace(/[&<>"']/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m])) }

document.addEventListener("input", e=>{
  if(e.target===searchEl){ applyFilters(); }
});
randomBtn.onclick = randomTip;
clearFiltersBtn.onclick = resetFilters;
addForm.addEventListener("submit", addTip);
document.getElementById("yr").textContent = new Date().getFullYear();
load();
