// Executa o demo no Node carregando os arquivos na ordem de dependência (alternativa ao bundle).
const fs=require('fs'),vm=require('vm'),path=require('path');
const ordem=['Collector','Conflict','Stmt','DataFlowAbstraction','MergeConflictDefinition','ReachDefinitionAnalysis','TaintedAnalysis','ArrayTaintedAnalysisOneConflictDemo'];
const ctx=vm.createContext({console});
ordem.forEach(f=>vm.runInContext(fs.readFileSync(path.join(__dirname,f+'.js'),'utf8'),ctx));
vm.runInContext('quickstart.dataflow.ArrayTaintedAnalysisOneConflictDemo.main(null)',ctx);
