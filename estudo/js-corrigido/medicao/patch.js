const fs=require('fs'),path=require('path'); const root=path.join(__dirname,'..','fixed'); const log=[];
function patch(file,pairs){ const p=path.join(root,file); let t=fs.readFileSync(p,'utf8');
  for(const [id,from,to,all] of pairs){ const n=t.split(from).length-1; if(!n) throw new Error(file+': padrão não encontrado: '+id);
    t=all?t.split(from).join(to):t.replace(from,to); log.push({file,id,ocorrencias:all?n:1}); }
  fs.writeFileSync(p,t); }
const SET_OLD='s.indexOf(e) == -1', SET_NEW='s.findIndex(x => x.equals(e)) == -1';
// --- dataflow ---
patch('dataflow/Collector.js',[['C1',SET_OLD,SET_NEW,true]]);
patch('dataflow/ReachDefinitionAnalysis.js',[
 ['C1',SET_OLD,SET_NEW,true],
 ['C2','/* addAll */ ((l1, l2) => l1.push.apply(l1, l2))(out, this.gen(stmt, inSet));','/* addAll */ ((l1, l2) => { l2.forEach(e => { if (l1.findIndex(x => x.equals(e)) == -1) l1.push(e); }); return true; })(out, this.gen(stmt, inSet));',false]]);
patch('dataflow/TaintedAnalysis.js',[['C1',SET_OLD,SET_NEW,true]]);
patch('dataflow/ArrayTaintedAnalysisOneConflictDemo.js',[
 ['C3','console.info(c);','console.info(c.toString());',false],
 ['C5','\nquickstart.dataflow.ArrayTaintedAnalysisOneConflictDemo.main(null);','\n// (chamada de main removida do carregamento; veja dataflow.bundle.js e run.js)',false]]);
patch('dataflow/Conflict.js',[['C4','return this.sourceLine * 31 + this.sinkLine;','return (Math.imul(this.sourceLine, 31) + this.sinkLine) | 0;',false]]);
{ const p=path.join(root,'dataflow/DataFlowAbstraction.js'); let t=fs.readFileSync(p,'utf8');
  const a=t.indexOf('return /* hashCode */'), b=t.indexOf('})(this.sourceStmt);',a)+'})(this.sourceStmt);'.length; if(a<0||b<a) throw new Error('hash DFA');
  const expr=t.slice(a+'return '.length,b-1); const sp=expr.lastIndexOf('* 31 + '); const left=expr.slice(0,sp), right=expr.slice(sp+'* 31 + '.length);
  t=t.slice(0,a)+'return (Math.imul('+left.trim()+', 31) + '+right.trim()+') | 0;'+t.slice(b); fs.writeFileSync(p,t); log.push({file:'dataflow/DataFlowAbstraction.js',id:'C4',ocorrencias:1}); }
// bundle e runner
const dep=['Collector','Conflict','Stmt','DataFlowAbstraction','MergeConflictDefinition','ReachDefinitionAnalysis','TaintedAnalysis','ArrayTaintedAnalysisOneConflictDemo'];
const bundle=dep.map(f=>'// ===== '+f+'.js =====\n'+fs.readFileSync(path.join(root,'dataflow',f+'.js'),'utf8')).join('\n')+'\nquickstart.dataflow.ArrayTaintedAnalysisOneConflictDemo.main(null);\n';
fs.writeFileSync(path.join(root,'dataflow/dataflow.bundle.js'),bundle); log.push({file:'dataflow/dataflow.bundle.js',id:'C5',ocorrencias:1});
fs.writeFileSync(path.join(root,'dataflow/run.js'),"// Executa o demo no Node carregando os arquivos na ordem de dependência (alternativa ao bundle).\nconst fs=require('fs'),vm=require('vm'),path=require('path');\nconst ordem=['Collector','Conflict','Stmt','DataFlowAbstraction','MergeConflictDefinition','ReachDefinitionAnalysis','TaintedAnalysis','ArrayTaintedAnalysisOneConflictDemo'];\nconst ctx=vm.createContext({console});\nordem.forEach(f=>vm.runInContext(fs.readFileSync(path.join(__dirname,f+'.js'),'utf8'),ctx));\nvm.runInContext('quickstart.dataflow.ArrayTaintedAnalysisOneConflictDemo.main(null)',ctx);\n");
// --- samples ---
const NS='br.unb.cic.analysis.samples.';
patch('samples/IntraproceduralIndirectSource.js',[['S1',"const y = x + 1;\n                            console.info(y);","const y = x + 1;\n                            (typeof process !== 'undefined' && process.stdout) ? process.stdout.write(String(y)) : console.info(y);",false]]);
const mains={ConfluenceWithTransitivitySample:'foo',SourceSinkMethodCallSample:'foo',IntraproceduralDataFlow:'foo',SourceSinkVariableAttributionSample:'foo',SourceSinkVariableAttributionWithAutoIncrement:'foo'};
for(const [c,m] of Object.entries(mains)){ const p=path.join(root,'samples',c+'.js'); fs.appendFileSync(p,'new '+NS+c+'().'+m+'(); // main adicionado (passo 3 do estudo)\n'); log.push({file:'samples/'+c+'.js',id:'S2',ocorrencias:1}); }
{ const c='IntraproceduralIndirectSource'; fs.appendFileSync(path.join(root,'samples',c+'.js'),'{ const o = new '+NS+c+'(); o.m(); o.a(); } // main adicionado (passo 3 do estudo)\n'); log.push({file:'samples/'+c+'.js',id:'S2',ocorrencias:1}); }
fs.writeFileSync(path.join(__dirname,'patch.log.json'),JSON.stringify(log,null,1)); console.log(log.map(l=>l.file+' '+l.id+' x'+l.ocorrencias).join('\n'));
