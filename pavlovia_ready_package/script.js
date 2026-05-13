
const screen=document.getElementById('screen');
let data=[]; function save(o){data.push({...o,ts:Date.now()})}
async function upload(){
  const participant = 'P'+Math.random().toString(36).slice(2,8);
  const name = participant+'_data.json';
  try {
    // Pavlovia gitlab raw commit API via POST to same origin isn't available without psychoJS; fallback browser download.
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click();
  } catch(e){}
}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function show(t){screen.textContent=t}
function wait(keys){return new Promise(res=>{function h(e){if(keys.includes(e.key)){document.removeEventListener('keydown',h);res(e.key)}}document.addEventListener('keydown',h)})}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
async function block(reps,m=false){let base=[["HHHHH","l"],["AAAAA","l"],["HHAHH","s"],["AAHAA","s"]],t=[];for(let i=0;i<reps;i++)t.push(...base);shuffle(t);
for(const [stim,c] of t){show("+");await sleep(500);show(stim);let r=await wait(["s","l","Escape"]); if(r==="Escape") return false; let ok=r===c; let shown=ok; if(m&&ok&&Math.random()<0.25) shown=false; save({stimulus:stim,response:r,correct:c,actual:ok,shown}); show(shown?"richtig":"falsch"); await sleep(shown?500:1500); show(""); await sleep(500);} return true;}
async function rating(txt){show(txt); let r=await wait(["1","2","3","4","5","6","7","8","9","0"]); save({type:"rating",prompt:txt,value:r})}
(async()=>{show("Start\\nSpace");await wait([" "]); await block(1,false); await block(20,false); await rating("Rate 1-10"); await rating("Feeling 1-10"); await block(30,true); await rating("Rate 1-10"); await rating("Feeling 1-10"); await block(20,false); await rating("Rate 1-10"); await rating("Feeling 1-10"); await upload(); show("Done");})();
