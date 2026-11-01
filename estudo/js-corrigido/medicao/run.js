const fs=require('fs'),vm=require('vm'),path=require('path');
const kind=process.argv[2]; const base=path.join(__dirname,'..',kind,'dataflow');
const dep=['Collector','Conflict','Stmt','DataFlowAbstraction','MergeConflictDefinition','ReachDefinitionAnalysis','TaintedAnalysis'];
const mode=process.argv[3];
const rd=f=>fs.readFileSync(path.join(base,f+'.js'),'utf8');
if(mode==='rand'){ // lê cenarios e imprime "tainted|reach"
  const ctx=vm.createContext({console}); dep.forEach(f=>vm.runInContext(rd(f),ctx));
  const sc=fs.readFileSync(process.argv[4],'utf8').trim().split('\n'); const D=vm.runInContext('quickstart.dataflow',ctx);
  const list=s=>s?s.split(','):[]; const nums=s=>list(s).map(Number);
  for(const line of sc){ const p=line.split(';');
    const cfg=p[2].split('/').map(x=>{const q=x.split(':');return new D.Stmt(+q[0],list(q[1]),list(q[2]));});
    const def=new D.MergeConflictDefinition(nums(p[0]),nums(p[1]));
    const f=A=>{D.Collector.instance().clear(); return new A(cfg,def).getConflicts().map(String).sort().join(',');};
    console.log(f(D.TaintedAnalysis)+'|'+f(D.ReachDefinitionAnalysis)); }
} else if(mode==='demo'){ // executa o demo como o usuario faria
  const out=[]; const cons={info:(...a)=>out.push(a.map(x=>typeof x==='string'?x:require('util').inspect(x)).join(' ')),log:(...a)=>cons.info(...a)};
  const ctx=vm.createContext({console:cons});
  if(fs.existsSync(path.join(base,'dataflow.bundle.js'))) vm.runInContext(fs.readFileSync(path.join(base,'dataflow.bundle.js'),'utf8'),ctx);
  else [...dep,'ArrayTaintedAnalysisOneConflictDemo'].forEach(f=>vm.runInContext(rd(f),ctx));
  console.log(out.join('\n'));
} else if(mode==='alpha'){ // carga em ordem alfabetica, depois roda main
  const ctx=vm.createContext({console:{info:()=>{},log:()=>{}}}); let res='OK';
  try{ for(const f of fs.readdirSync(base).filter(f=>/^[A-Z].*\.js$/.test(f)&&!/bundle/.test(f)).sort()) vm.runInContext(fs.readFileSync(path.join(base,f),'utf8'),ctx);
       const outl=[]; ctx.console.info=(...a)=>outl.push(a.join(' ')); vm.runInContext('quickstart.dataflow.ArrayTaintedAnalysisOneConflictDemo.main(null)',ctx);
       res=outl.some(l=>/PASS/.test(l))?'OK':'FALHA: sem PASS'; }catch(e){res='ERRO: '+e.constructor.name+': '+e.message;}
  console.log(res);
} else if(mode==='hash'){ const ctx=vm.createContext({console}); dep.forEach(f=>vm.runInContext(rd(f),ctx)); console.log(vm.runInContext('new quickstart.dataflow.Conflict(100000000,1).hashCode()',ctx)); }
