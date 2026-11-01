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
