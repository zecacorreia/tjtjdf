// ===== Collector.js =====
/* Generated from Java with JSweet 3.1.0 - http://www.jsweet.org */
var quickstart;
(function (quickstart) {
    var dataflow;
    (function (dataflow) {
        class Collector {
            constructor() {
                this.conflicts = ([]);
            }
            static instance() {
                if (Collector.__instance == null) {
                    Collector.__instance = new Collector();
                }
                return Collector.__instance;
            }
            addConflict(conflict) {
                /* add */ ((s, e) => { if (s.findIndex(x => x.equals(e)) == -1) {
                    s.push(e);
                    return true;
                }
                else {
                    return false;
                } })(this.conflicts, conflict);
            }
            getConflicts() {
                return this.conflicts;
            }
            clear() {
                this.conflicts = ([]);
            }
        }
        Collector.__instance = null;
        dataflow.Collector = Collector;
        Collector["__class"] = "quickstart.dataflow.Collector";
    })(dataflow = quickstart.dataflow || (quickstart.dataflow = {}));
})(quickstart || (quickstart = {}));

// ===== Conflict.js =====
/* Generated from Java with JSweet 3.1.0 - http://www.jsweet.org */
var quickstart;
(function (quickstart) {
    var dataflow;
    (function (dataflow) {
        /**
         * A detected merge conflict: a tainted value flowing from a source
         * statement to a sink statement.
         * @param {number} sourceLine
         * @param {number} sinkLine
         * @class
         */
        class Conflict {
            constructor(sourceLine, sinkLine) {
                if (this.sourceLine === undefined) {
                    this.sourceLine = 0;
                }
                if (this.sinkLine === undefined) {
                    this.sinkLine = 0;
                }
                this.sourceLine = sourceLine;
                this.sinkLine = sinkLine;
            }
            getSourceLine() {
                return this.sourceLine;
            }
            getSinkLine() {
                return this.sinkLine;
            }
            /**
             *
             * @param {*} o
             * @return {boolean}
             */
            equals(o) {
                if (this === o)
                    return true;
                if (!(o != null && o instanceof quickstart.dataflow.Conflict))
                    return false;
                const that = o;
                return this.sourceLine === that.sourceLine && this.sinkLine === that.sinkLine;
            }
            /**
             *
             * @return {number}
             */
            hashCode() {
                return (Math.imul(this.sourceLine, 31) + this.sinkLine) | 0;
            }
            /**
             *
             * @return {string}
             */
            toString() {
                return "source(line " + this.sourceLine + ") => sink(line " + this.sinkLine + ")";
            }
        }
        dataflow.Conflict = Conflict;
        Conflict["__class"] = "quickstart.dataflow.Conflict";
    })(dataflow = quickstart.dataflow || (quickstart.dataflow = {}));
})(quickstart || (quickstart = {}));

// ===== Stmt.js =====
/* Generated from Java with JSweet 3.1.0 - http://www.jsweet.org */
var quickstart;
(function (quickstart) {
    var dataflow;
    (function (dataflow) {
        /**
         * Stands in for a Soot Unit: one statement in a hand-authored CFG,
         * with the def/use variable names Soot would normally compute from
         * compiled bytecode.
         * @param {number} line
         * @param {string[]} defs
         * @param {string[]} uses
         * @class
         */
        class Stmt {
            constructor(line, defs, uses) {
                if (this.line === undefined) {
                    this.line = 0;
                }
                if (this.defs === undefined) {
                    this.defs = null;
                }
                if (this.uses === undefined) {
                    this.uses = null;
                }
                this.line = line;
                this.defs = defs;
                this.uses = uses;
            }
            getLine() {
                return this.line;
            }
            getDefs() {
                return this.defs;
            }
            getUses() {
                return this.uses;
            }
            /**
             *
             * @return {string}
             */
            toString() {
                return "line " + this.line;
            }
        }
        dataflow.Stmt = Stmt;
        Stmt["__class"] = "quickstart.dataflow.Stmt";
    })(dataflow = quickstart.dataflow || (quickstart.dataflow = {}));
})(quickstart || (quickstart = {}));

// ===== DataFlowAbstraction.js =====
/* Generated from Java with JSweet 3.1.0 - http://www.jsweet.org */
var quickstart;
(function (quickstart) {
    var dataflow;
    (function (dataflow) {
        /**
         * Information kept while traversing the control flow: a tainted
         * variable name paired with the statement where the taint originated.
         * @param {string} local
         * @param {quickstart.dataflow.Stmt} sourceStmt
         * @class
         */
        class DataFlowAbstraction {
            constructor(local, sourceStmt) {
                if (this.local === undefined) {
                    this.local = null;
                }
                if (this.sourceStmt === undefined) {
                    this.sourceStmt = null;
                }
                this.local = local;
                this.sourceStmt = sourceStmt;
            }
            getLocal() {
                return this.local;
            }
            getSourceStmt() {
                return this.sourceStmt;
            }
            /**
             *
             * @param {*} o
             * @return {boolean}
             */
            equals(o) {
                if (this === o)
                    return true;
                if (!(o != null && o instanceof quickstart.dataflow.DataFlowAbstraction))
                    return false;
                const that = o;
                return (this.local === that.local) && this.sourceStmt === that.sourceStmt;
            }
            /**
             *
             * @return {number}
             */
            hashCode() {
                return (Math.imul(/* hashCode */ ((o) => { if (o.hashCode) {
                    return o.hashCode();
                }
                else {
                    return o.toString().split('').reduce((prevHash, currVal) => (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
                } })(this.local), 31) + /* hashCode */ ((o) => { if (o.hashCode) {
                    return o.hashCode();
                }
                else {
                    return o.toString().split('').reduce((prevHash, currVal) => (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
                } })(this.sourceStmt)) | 0;
            }
            /**
             *
             * @return {string}
             */
            toString() {
                return "DataFlowAbstraction{" + this.local + " from " + this.sourceStmt + "}";
            }
        }
        dataflow.DataFlowAbstraction = DataFlowAbstraction;
        DataFlowAbstraction["__class"] = "quickstart.dataflow.DataFlowAbstraction";
    })(dataflow = quickstart.dataflow || (quickstart.dataflow = {}));
})(quickstart || (quickstart = {}));

// ===== MergeConflictDefinition.js =====
/* Generated from Java with JSweet 3.1.0 - http://www.jsweet.org */
var quickstart;
(function (quickstart) {
    var dataflow;
    (function (dataflow) {
        /**
         * Simplified stand-in for AbstractMergeConflictDefinition: the original
         * scans every loaded Soot class/method for statements at given line
         * numbers. Here we only ever analyze one hand-built statement list, so
         * source/sink line membership is all that's needed.
         * @param {number[]} sourceLines
         * @param {number[]} sinkLines
         * @class
         */
        class MergeConflictDefinition {
            constructor(sourceLines, sinkLines) {
                if (this.sourceLines === undefined) {
                    this.sourceLines = null;
                }
                if (this.sinkLines === undefined) {
                    this.sinkLines = null;
                }
                this.sourceLines = sourceLines;
                this.sinkLines = sinkLines;
            }
            isSource(stmt) {
                return /* contains */ (this.sourceLines.indexOf((stmt.getLine())) >= 0);
            }
            isSink(stmt) {
                return /* contains */ (this.sinkLines.indexOf((stmt.getLine())) >= 0);
            }
        }
        dataflow.MergeConflictDefinition = MergeConflictDefinition;
        MergeConflictDefinition["__class"] = "quickstart.dataflow.MergeConflictDefinition";
    })(dataflow = quickstart.dataflow || (quickstart.dataflow = {}));
})(quickstart || (quickstart = {}));

// ===== ReachDefinitionAnalysis.js =====
/* Generated from Java with JSweet 3.1.0 - http://www.jsweet.org */
var quickstart;
(function (quickstart) {
    var dataflow;
    (function (dataflow) {
        /**
         * Port of br.unb.cic.analysis.df.ReachDefinitionAnalysis, ported off Soot's
         * ForwardFlowAnalysis onto a hand-authored, linear (branch-free) statement
         * list. A single forward pass is exact here because the CFG has no joins
         * or loops (loop bodies are collapsed into one statement by whoever builds
         * the CFG) - Soot's fixed-point worklist algorithm would converge to the
         * same result in one iteration too.
         * @param {quickstart.dataflow.Stmt[]} statements
         * @param {quickstart.dataflow.MergeConflictDefinition} definition
         * @class
         */
        class ReachDefinitionAnalysis {
            constructor(statements, definition) {
                if (this.statements === undefined) {
                    this.statements = null;
                }
                if (this.definition === undefined) {
                    this.definition = null;
                }
                this.statements = statements;
                this.definition = definition;
                this.doAnalysis();
            }
            doAnalysis() {
                let inSet = ([]);
                for (let index = 0; index < this.statements.length; index++) {
                    let stmt = this.statements[index];
                    {
                        this.detectConflict(inSet, stmt);
                        inSet = this.flowThrough(inSet, stmt);
                    }
                }
            }
            flowThrough(inSet, stmt) {
                const killSet = this.kill(stmt);
                const out = ([]);
                for (let index = 0; index < inSet.length; index++) {
                    let item = inSet[index];
                    {
                        if (!(killSet.indexOf((item.getLocal())) >= 0)) {
                            /* add */ ((s, e) => { if (s.findIndex(x => x.equals(e)) == -1) {
                                s.push(e);
                                return true;
                            }
                            else {
                                return false;
                            } })(out, item);
                        }
                    }
                }
                /* addAll */ ((l1, l2) => { l2.forEach(e => { if (l1.findIndex(x => x.equals(e)) == -1) l1.push(e); }); return true; })(out, this.gen(stmt, inSet));
                return out;
            }
            kill(stmt) {
                return (stmt.getDefs().slice(0));
            }
            gen(stmt, inSet) {
                const res = ([]);
                if (this.definition.isSource(stmt)) {
                    {
                        let array = stmt.getDefs();
                        for (let index = 0; index < array.length; index++) {
                            let local = array[index];
                            {
                                /* add */ ((s, e) => { if (s.findIndex(x => x.equals(e)) == -1) {
                                    s.push(e);
                                    return true;
                                }
                                else {
                                    return false;
                                } })(res, new quickstart.dataflow.DataFlowAbstraction(local, stmt));
                            }
                        }
                    }
                }
                return res;
            }
            detectConflict(inSet, stmt) {
                if (this.definition.isSink(stmt)) {
                    {
                        let array = stmt.getUses();
                        for (let index = 0; index < array.length; index++) {
                            let use = array[index];
                            {
                                for (let index1 = 0; index1 < inSet.length; index1++) {
                                    let item = inSet[index1];
                                    {
                                        if (item.getLocal() === use) {
                                            quickstart.dataflow.Collector.instance().addConflict(new quickstart.dataflow.Conflict(item.getSourceStmt().getLine(), stmt.getLine()));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            getConflicts() {
                return quickstart.dataflow.Collector.instance().getConflicts();
            }
            clear() {
                quickstart.dataflow.Collector.instance().clear();
            }
        }
        dataflow.ReachDefinitionAnalysis = ReachDefinitionAnalysis;
        ReachDefinitionAnalysis["__class"] = "quickstart.dataflow.ReachDefinitionAnalysis";
    })(dataflow = quickstart.dataflow || (quickstart.dataflow = {}));
})(quickstart || (quickstart = {}));

// ===== TaintedAnalysis.js =====
/* Generated from Java with JSweet 3.1.0 - http://www.jsweet.org */
var quickstart;
(function (quickstart) {
    var dataflow;
    (function (dataflow) {
        /**
         * Port of br.unb.cic.analysis.df.TaintedAnalysis: same as
         * ReachDefinitionAnalysis, but taint also propagates through assignment
         * chains (if a statement assigns from an already-tainted variable, its
         * targets become tainted too, keeping the original source statement).
         * @param {quickstart.dataflow.Stmt[]} statements
         * @param {quickstart.dataflow.MergeConflictDefinition} definition
         * @class
         * @extends quickstart.dataflow.ReachDefinitionAnalysis
         */
        class TaintedAnalysis extends quickstart.dataflow.ReachDefinitionAnalysis {
            constructor(statements, definition) {
                super(statements, definition);
            }
            /**
             *
             * @param {quickstart.dataflow.Stmt} stmt
             * @param {quickstart.dataflow.DataFlowAbstraction[]} inSet
             * @return {quickstart.dataflow.DataFlowAbstraction[]}
             */
            gen(stmt, inSet) {
                const res = ([]);
                if (this.definition.isSource(stmt)) {
                    {
                        let array = stmt.getDefs();
                        for (let index = 0; index < array.length; index++) {
                            let local = array[index];
                            {
                                /* add */ ((s, e) => { if (s.findIndex(x => x.equals(e)) == -1) {
                                    s.push(e);
                                    return true;
                                }
                                else {
                                    return false;
                                } })(res, new quickstart.dataflow.DataFlowAbstraction(local, stmt));
                            }
                        }
                    }
                }
                else if (!(stmt.getDefs().length == 0)) {
                    {
                        let array = stmt.getUses();
                        for (let index = 0; index < array.length; index++) {
                            let use = array[index];
                            {
                                for (let index1 = 0; index1 < inSet.length; index1++) {
                                    let sourceDef = inSet[index1];
                                    {
                                        if (sourceDef.getLocal() === use) {
                                            {
                                                let array1 = stmt.getDefs();
                                                for (let index2 = 0; index2 < array1.length; index2++) {
                                                    let def = array1[index2];
                                                    {
                                                        /* add */ ((s, e) => { if (s.findIndex(x => x.equals(e)) == -1) {
                                                            s.push(e);
                                                            return true;
                                                        }
                                                        else {
                                                            return false;
                                                        } })(res, new quickstart.dataflow.DataFlowAbstraction(def, sourceDef.getSourceStmt()));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return res;
            }
        }
        dataflow.TaintedAnalysis = TaintedAnalysis;
        TaintedAnalysis["__class"] = "quickstart.dataflow.TaintedAnalysis";
    })(dataflow = quickstart.dataflow || (quickstart.dataflow = {}));
})(quickstart || (quickstart = {}));

// ===== ArrayTaintedAnalysisOneConflictDemo.js =====
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

quickstart.dataflow.ArrayTaintedAnalysisOneConflictDemo.main(null);
