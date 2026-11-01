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
