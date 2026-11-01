// gera N cenarios de CFG linear pseudo-aleatorios (semente fixa), com defs/uses repetidos
let s=20261101; const rnd=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;}; const ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
const V=['a','b','c']; const N=+process.argv[2]||1000; const out=[];
for(let k=0;k<N;k++){ const n=ri(4,8); let line=ri(1,5); const st=[];
  for(let i=0;i<n;i++){ line+=ri(1,3); const d=Array.from({length:rnd()<0.8?ri(1,2):0},()=>V[ri(0,2)]); const u=Array.from({length:rnd()<0.85?ri(1,3):0},()=>V[ri(0,2)]); st.push([line,d,u]); }
  const withD=st.filter(x=>x[1].length), withU=st.filter(x=>x[2].length); if(!withD.length||!withU.length){k--;continue;}
  const pk=a=>a[ri(0,a.length-1)][0];
  const src=[...new Set(Array.from({length:ri(1,2)},()=>pk(withD)))]; const snk=[...new Set(Array.from({length:ri(1,2)},()=>pk(withU)))];
  out.push(src.join(',')+';'+snk.join(',')+';'+st.map(x=>x[0]+':'+x[1].join(',')+':'+x[2].join(',')).join('/')); }
console.log(out.join('\n'));
