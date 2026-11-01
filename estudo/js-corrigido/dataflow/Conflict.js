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
