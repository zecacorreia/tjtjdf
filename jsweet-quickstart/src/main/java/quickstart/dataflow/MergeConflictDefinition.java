package quickstart.dataflow;

import java.util.List;

/**
 * Simplified stand-in for AbstractMergeConflictDefinition: the original
 * scans every loaded Soot class/method for statements at given line
 * numbers. Here we only ever analyze one hand-built statement list, so
 * source/sink line membership is all that's needed.
 */
public class MergeConflictDefinition {

    private List<Integer> sourceLines;
    private List<Integer> sinkLines;

    public MergeConflictDefinition(List<Integer> sourceLines, List<Integer> sinkLines) {
        this.sourceLines = sourceLines;
        this.sinkLines = sinkLines;
    }

    public boolean isSource(Stmt stmt) {
        return sourceLines.contains(stmt.getLine());
    }

    public boolean isSink(Stmt stmt) {
        return sinkLines.contains(stmt.getLine());
    }
}
