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
