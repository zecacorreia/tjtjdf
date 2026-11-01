const fs=require('fs'),path=require('path'),cp=require('child_process');
const kind=process.argv[2]; const base=path.join(__dirname,'..',kind,'samples');
const javaRef=JSON.parse(fs.readFileSync(path.join(__dirname,'samples.java.json'),'utf8'));
let ok=0,vac=0; const rows=[];
for(const f of Object.keys(javaRef).sort()){
  const r=cp.spawnSync('node',[path.join(base,f+'.js')],{encoding:'utf8'}); const js=r.stdout+(r.status?'[ERRO '+r.stderr.split('\n')[0]+']':'');
  const j=javaRef[f]; const same=js===j; if(same){ok++; if(j==='')vac++;} rows.push([f,same?'igual':'diferente',JSON.stringify(j).slice(0,40),JSON.stringify(js).slice(0,40)]); }
console.log(JSON.stringify({ok,vazias:vac,total:rows.length,rows}));
