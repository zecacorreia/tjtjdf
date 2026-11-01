package quickstart.dataflow;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Port of br.unb.cic.analysis.df.ReachDefinitionAnalysis, ported off Soot's
 * ForwardFlowAnalysis onto a hand-authored, linear (branch-free) statement
 * list. A single forward pass is exact here because the CFG has no joins
 * or loops (loop bodies are collapsed into one statement by whoever builds
 * the CFG) - Soot's fixed-point worklist algorithm would converge to the
 * same result in one iteration too.
 */
public class ReachDefinitionAnalysis {

    protected List<Stmt> statements;
    protected MergeConflictDefinition definition;

    public ReachDefinitionAnalysis(List<Stmt> statements, MergeConflictDefinition definition) {
        this.statements = statements;
        this.definition = definition;
        doAnalysis();
    }

    protected void doAnalysis() {
        Set<DataFlowAbstraction> inSet = new HashSet<>();
        for (Stmt stmt : statements) {
            detectConflict(inSet, stmt);
            inSet = flowThrough(inSet, stmt);
        }
    }

    protected Set<DataFlowAbstraction> flowThrough(Set<DataFlowAbstraction> inSet, Stmt stmt) {
        Set<String> killSet = kill(stmt);
        Set<DataFlowAbstraction> out = new HashSet<>();
        for (DataFlowAbstraction item : inSet) {
            if (!killSet.contains(item.getLocal())) {
                out.add(item);
            }
        }
        out.addAll(gen(stmt, inSet));
        return out;
    }

    protected Set<String> kill(Stmt stmt) {
        return new HashSet<>(stmt.getDefs());
    }

    protected Set<DataFlowAbstraction> gen(Stmt stmt, Set<DataFlowAbstraction> inSet) {
        Set<DataFlowAbstraction> res = new HashSet<>();
        if (definition.isSource(stmt)) {
            for (String local : stmt.getDefs()) {
                res.add(new DataFlowAbstraction(local, stmt));
            }
        }
        return res;
    }

    protected void detectConflict(Set<DataFlowAbstraction> inSet, Stmt stmt) {
        if (definition.isSink(stmt)) {
            for (String use : stmt.getUses()) {
                for (DataFlowAbstraction item : inSet) {
                    if (item.getLocal().equals(use)) {
                        Collector.instance().addConflict(
                                new Conflict(item.getSourceStmt().getLine(), stmt.getLine()));
                    }
                }
            }
        }
    }

    public Set<Conflict> getConflicts() {
        return Collector.instance().getConflicts();
    }

    public void clear() {
        Collector.instance().clear();
    }
}
