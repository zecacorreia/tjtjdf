package quickstart.dataflow;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * JSweet-transpilable port of conflict-static-analysis's
 * ArrayTaintedAnalysisOneConflictTest, analyzing this method:
 *
 *   int[] arr = {0,0,0,0,0};
 *   arr = populate(arr.length);  // line 12
 *   arr[4] = 10;                 // line 14 (source)
 *   int b = arr[4];              // line 16 (sink)
 *   for (int a : arr)
 *       System.out.println(a);   // line 19 (sink)
 *
 * Soot would compute the def/use chains below from compiled bytecode;
 * since JSweet can't run Soot, they're hand-authored here. The for-each
 * loop's implicit "a = arr[i]" read is collapsed into the line-19
 * statement, so it shows up as a direct use of "arr".
 */
public class ArrayTaintedAnalysisOneConflictDemo {

    public static void main(String[] args) {
        Collector.instance().clear();

        List<Stmt> cfg = buildArrayDataFlowSampleCfg();
        MergeConflictDefinition definition = new MergeConflictDefinition(
                Arrays.asList(14), Arrays.asList(16, 19));

        TaintedAnalysis analysis = new TaintedAnalysis(cfg, definition);

        System.out.println("Conflicts found: " + analysis.getConflicts().size());
        for (Conflict c : analysis.getConflicts()) {
            System.out.println(c);
        }
        System.out.println("Expected 2 conflicts: "
                + (analysis.getConflicts().size() == 2 ? "PASS" : "FAIL"));
    }

    private static List<Stmt> buildArrayDataFlowSampleCfg() {
        List<Stmt> stmts = new ArrayList<>();
        stmts.add(new Stmt(10, Arrays.asList("arr"), new ArrayList<>()));
        stmts.add(new Stmt(12, Arrays.asList("arr"), Arrays.asList("arr")));
        stmts.add(new Stmt(14, Arrays.asList("arr"), Arrays.asList("arr")));
        stmts.add(new Stmt(16, Arrays.asList("b"), Arrays.asList("arr")));
        stmts.add(new Stmt(19, new ArrayList<>(), Arrays.asList("arr")));
        return stmts;
    }
}
