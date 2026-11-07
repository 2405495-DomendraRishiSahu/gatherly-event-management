const events=[
{id:1,name:"CodeSprint Hackathon",cat:"Tech",date:"2026-12-05T09:00",venue:"Tech Park Auditorium, Bhubaneswar",img:"hack",short:"24 hours of building, mentoring and pizza.",desc:"Form a team, pick a problem and ship a working prototype in 24 hours. Mentors from industry will review your work and the top three teams win prizes and internship interviews."},
{id:2,name:"Winter Beats Live",cat:"Music",date:"2026-12-19T18:30",venue:"Open Air Arena, Cuttack",img:"concert",short:"An evening of indie bands under the stars.",desc:"Five bands, one stage and a food court that stays open late. Gates open at 5 PM. Bring a jacket, the evenings get cool."},
{id:3,name:"UI/UX Design Workshop",cat:"Workshop",date:"2027-01-10T10:00",venue:"Design Hub, Patia",img:"design",short:"Learn Figma and design a mobile app in a day.",desc:"A hands-on workshop that covers user research, wireframes and prototyping in Figma. Laptops required. Certificate provided."},
{id:4,name:"Startup Pitch Night",cat:"Business",date:"2027-01-24T17:00",venue:"Innovation Centre, KIIT Road",img:"pitch",short:"Ten founders pitch. You vote for the winner.",desc:"Watch early-stage startups pitch to a panel of investors, then network over coffee with founders and mentors."},
{id:5,name:"City Marathon 10K",cat:"Sports",date:"2027-02-07T05:30",venue:"Marine Drive Start Line",img:"run",short:"A scenic 10K run for all fitness levels.",desc:"Run along the city's best route with water stations every 2 km. Every finisher gets a medal and a breakfast pack."},
{id:6,name:"Odissi & Beyond Festival",cat:"Culture",date:"2027-02-20T16:00",venue:"Rabindra Mandap",img:"dance",short:"Classical dance meets contemporary performance.",desc:"Two evenings of Odissi recitals and fusion performances by renowned artists, with a craft bazaar in the lobby."},
{id:7,name:"AI for Everyone Summit",cat:"Tech",date:"2027-03-06T09:30",venue:"Convention Centre, Janpath",img:"ai",short:"Talks and demos on practical AI.",desc:"Speakers share how AI is used in healthcare, farming and education. Includes live demos and a Q&A panel."},
{id:8,name:"Street Photography Walk",cat:"Workshop",date:"2027-03-14T06:30",venue:"Old Town Heritage Lane",img:"photo",short:"Shoot the old city at sunrise with a pro.",desc:"A guided two-hour walk with tips on light, framing and candid portraits. Any camera, including phones, is welcome."},
{id:9,name:"Food Truck Carnival",cat:"Culture",date:"2027-03-28T12:00",venue:"Ekamra Kanan Grounds",img:"food",short:"30 food trucks, live music, zero diets.",desc:"Taste street food from across India, vote for your favourite truck and enjoy live acoustic sets all afternoon."}
];
const $=s=>document.querySelector(s);
const fmt=d=>new Date(d).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"});
const imgUrl=(e,w=640,h=400)=>`https://picsum.photos/seed/${e.img}/${w}/${h}`;
let cat="All",q="";

/* Theme */
const setTheme=t=>{document.documentElement.dataset.theme=t;$("#themeBtn").textContent=t==="dark"?"☀️":"🌙";try{localStorage.setItem("theme",t)}catch(e){}};
setTheme((()=>{try{return localStorage.getItem("theme")}catch(e){}})()||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"));
$("#themeBtn").onclick=()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark");
$("#burger").onclick=()=>$("#menu").classList.toggle("open");
$("#menu").onclick=()=>$("#menu").classList.remove("open");

/* Cards + filters */
function render(){
  const list=events.filter(e=>(cat==="All"||e.cat===cat)&&(e.name+e.venue+e.short+e.cat).toLowerCase().includes(q));
  $("#grid").innerHTML=list.map(e=>`<article class="card" data-id="${e.id}" tabindex="0">
    <div class="pic"><img src="${imgUrl(e)}" alt="${e.name}" loading="lazy" onerror="this.remove()"><span class="tag">${e.cat}</span></div>
    <div class="card-body"><h3>${e.name}</h3><div class="info">📅 ${fmt(e.date)}<br>📍 ${e.venue}</div><p>${e.short}</p><button class="btn primary">View details</button></div></article>`).join("");
  $("#empty").hidden=list.length>0;
}
$("#chips").innerHTML=["All",...new Set(events.map(e=>e.cat))].map(c=>`<button class="chip${c==="All"?" active":""}">${c}</button>`).join("");
$("#chips").onclick=e=>{if(!e.target.classList.contains("chip"))return;cat=e.target.textContent;document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c===e.target));render()};
$("#search").oninput=e=>{q=e.target.value.trim().toLowerCase();render()};
$("#grid").onclick=e=>{const c=e.target.closest(".card");if(c)openModal(+c.dataset.id)};
$("#grid").onkeydown=e=>{if(e.key==="Enter"){const c=e.target.closest(".card");if(c)openModal(+c.dataset.id)}};

/* Modal */
let current=null;
function openModal(id){
  const e=events.find(x=>x.id===id);current=e;
  $("#mImg").src=imgUrl(e,900,500);$("#mImg").alt=e.name;$("#mCat").textContent=e.cat;$("#mTitle").textContent=e.name;$("#mDesc").textContent=e.desc;
  $("#mMeta").innerHTML=`<li>📅 ${fmt(e.date)}</li><li>📍 ${e.venue}</li>`;
  $("#modal").hidden=false;document.body.style.overflow="hidden";$("#close").focus();
}
const closeModal=()=>{$("#modal").hidden=true;document.body.style.overflow=""};
$("#close").onclick=closeModal;
$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#mReg").onclick=()=>{$("#eventSel").value=current.id;closeModal();$("#register").scrollIntoView();$("#name").focus({preventScroll:true})};

/* Countdown */
function tick(){
  const next=events.map(e=>({e,t:new Date(e.date)-Date.now()})).filter(x=>x.t>0).sort((a,b)=>a.t-b.t)[0];
  if(!next){$("#nextName").textContent="Stay tuned for new events";$("#timer").innerHTML="";return}
  const s=Math.floor(next.t/1000),p=[["Days",Math.floor(s/86400)],["Hours",Math.floor(s%86400/3600)],["Min",Math.floor(s%3600/60)],["Sec",s%60]];
  $("#nextName").textContent=next.e.name;
  $("#timer").innerHTML=p.map(([l,v])=>`<div><b>${String(v).padStart(2,"0")}</b><span>${l}</span></div>`).join("");
}
tick();setInterval(tick,1000);

/* Registration */
$("#eventSel").innerHTML=`<option value="">Select an event</option>`+events.map(e=>`<option value="${e.id}">${e.name}</option>`).join("");
const load=()=>{try{return JSON.parse(localStorage.getItem("regs"))||[]}catch(e){return[]}};
const save=r=>{try{localStorage.setItem("regs",JSON.stringify(r))}catch(e){}};
function showRegs(){
  const r=load();
  $("#myRegs").innerHTML=r.length?r.map((x,i)=>`<li><span><b>${x.event}</b><br><small class="muted">${x.name} · ${x.email}</small></span><button data-i="${i}" aria-label="Cancel registration">Cancel</button></li>`).join(""):`<li class="none">Nothing yet. Your confirmed events will show up here.</li>`;
}
$("#myRegs").onclick=e=>{if(e.target.dataset.i===undefined)return;const r=load();r.splice(+e.target.dataset.i,1);save(r);showRegs()};
const rules={
  name:v=>/^[A-Za-z][A-Za-z .'-]{2,}$/.test(v)?"":"Enter your full name (letters only, at least 3 characters).",
  email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)?"":"Enter a valid email like name@example.com.",
  phone:v=>/^[6-9]\d{9}$/.test(v.replace(/[\s-]/g,""))?"":"Enter a valid 10-digit mobile number.",
  eventSel:v=>v?"":"Please choose an event."
};
const errId={name:"eName",email:"eEmail",phone:"ePhone",eventSel:"eEvent"};
function check(id){const el=$("#"+id),m=rules[id](el.value.trim());$("#"+errId[id]).textContent=m;el.classList.toggle("bad",!!m);return!m}
Object.keys(rules).forEach(id=>$("#"+id).addEventListener("input",()=>check(id)));
$("#form").addEventListener("submit",e=>{
  e.preventDefault();$("#ok").hidden=true;
  const valid=Object.keys(rules).map(check).every(Boolean);
  if(!valid)return;
  const ev=events.find(x=>x.id==$("#eventSel").value),r=load();
  if(r.some(x=>x.email===$("#email").value.trim()&&x.event===ev.name)){$("#eEmail").textContent="This email is already registered for this event.";return}
  r.push({name:$("#name").value.trim(),email:$("#email").value.trim(),phone:$("#phone").value.trim(),event:ev.name});save(r);
  $("#ok").textContent=`✅ You're in, ${$("#name").value.trim().split(" ")[0]}! Your seat for "${ev.name}" on ${fmt(ev.date)} is confirmed. A confirmation will be sent to ${$("#email").value.trim()}.`;
  $("#ok").hidden=false;$("#form").reset();showRegs();
});
render();showRegs();
