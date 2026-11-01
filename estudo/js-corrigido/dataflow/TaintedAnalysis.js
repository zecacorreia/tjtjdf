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
