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
