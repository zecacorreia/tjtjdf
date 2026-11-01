package quickstart.dataflow;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Port of br.unb.cic.analysis.df.TaintedAnalysis: same as
 * ReachDefinitionAnalysis, but taint also propagates through assignment
 * chains (if a statement assigns from an already-tainted variable, its
 * targets become tainted too, keeping the original source statement).
 */
public class TaintedAnalysis extends ReachDefinitionAnalysis {

    public TaintedAnalysis(List<Stmt> statements, MergeConflictDefinition definition) {
        super(statements, definition);
    }

    @Override
    protected Set<DataFlowAbstraction> gen(Stmt stmt, Set<DataFlowAbstraction> inSet) {
        Set<DataFlowAbstraction> res = new HashSet<>();
        if (definition.isSource(stmt)) {
            for (String local : stmt.getDefs()) {
                res.add(new DataFlowAbstraction(local, stmt));
            }
        } else if (!stmt.getDefs().isEmpty()) {
            for (String use : stmt.getUses()) {
                for (DataFlowAbstraction sourceDef : inSet) {
                    if (sourceDef.getLocal().equals(use)) {
                        for (String def : stmt.getDefs()) {
                            res.add(new DataFlowAbstraction(def, sourceDef.getSourceStmt()));
                        }
                    }
                }
            }
        }
        return res;
    }
}
