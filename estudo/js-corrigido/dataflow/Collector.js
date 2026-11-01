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
