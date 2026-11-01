/* Generated from Java with JSweet 3.1.0 - http://www.jsweet.org */
var quickstart;
(function (quickstart) {
    var dataflow;
    (function (dataflow) {
        /**
         * JSweet-transpilable port of conflict-static-analysis's
         * ArrayTaintedAnalysisOneConflictTest, analyzing this method:
         *
         * int[] arr = {0,0,0,0,0};
         * arr = populate(arr.length);  // line 12
         * arr[4] = 10;                 // line 14 (source)
         * int b = arr[4];              // line 16 (sink)
         * for (int a : arr)
         * System.out.println(a);   // line 19 (sink)
         *
         * Soot would compute the def/use chains below from compiled bytecode;
         * since JSweet can't run Soot, they're hand-authored here. The for-each
         * loop's implicit "a = arr[i]" read is collapsed into the line-19
         * statement, so it shows up as a direct use of "arr".
         * @class
         */
        class ArrayTaintedAnalysisOneConflictDemo {
            static main(args) {
                quickstart.dataflow.Collector.instance().clear();
                const cfg = ArrayTaintedAnalysisOneConflictDemo.buildArrayDataFlowSampleCfg();
                const definition = new quickstart.dataflow.MergeConflictDefinition(/* asList */ [14], /* asList */ [16, 19]);
                const analysis = new quickstart.dataflow.TaintedAnalysis(cfg, definition);
                console.info("Conflicts found: " + /* size */ analysis.getConflicts().length);
                {
                    let array = analysis.getConflicts();
                    for (let index = 0; index < array.length; index++) {
                        let c = array[index];
                        {
                            console.info(c.toString());
                        }
                    }
                }
                console.info("Expected 2 conflicts: " + ( /* size */analysis.getConflicts().length === 2 ? "PASS" : "FAIL"));
            }
            /*private*/ static buildArrayDataFlowSampleCfg() {
                const stmts = ([]);
                /* add */ (stmts.push(new quickstart.dataflow.Stmt(10, /* asList */ ["arr"], ([]))) > 0);
                /* add */ (stmts.push(new quickstart.dataflow.Stmt(12, /* asList */ ["arr"], /* asList */ ["arr"])) > 0);
                /* add */ (stmts.push(new quickstart.dataflow.Stmt(14, /* asList */ ["arr"], /* asList */ ["arr"])) > 0);
                /* add */ (stmts.push(new quickstart.dataflow.Stmt(16, /* asList */ ["b"], /* asList */ ["arr"])) > 0);
                /* add */ (stmts.push(new quickstart.dataflow.Stmt(19, ([]), /* asList */ ["arr"])) > 0);
                return stmts;
            }
        }
        dataflow.ArrayTaintedAnalysisOneConflictDemo = ArrayTaintedAnalysisOneConflictDemo;
        ArrayTaintedAnalysisOneConflictDemo["__class"] = "quickstart.dataflow.ArrayTaintedAnalysisOneConflictDemo";
    })(dataflow = quickstart.dataflow || (quickstart.dataflow = {}));
})(quickstart || (quickstart = {}));
// (chamada de main removida do carregamento; veja dataflow.bundle.js e run.js)
