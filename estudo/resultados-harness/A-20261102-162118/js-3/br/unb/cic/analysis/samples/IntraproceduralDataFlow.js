/* Generated from Java with JSweet 3.1.0 - http://www.jsweet.org */
var br;
(function (br) {
    var unb;
    (function (unb) {
        var cic;
        (function (cic) {
            var analysis;
            (function (analysis) {
                var samples;
                (function (samples) {
                    class IntraproceduralDataFlow {
                        foo() {
                            const x = this.random();
                            const y = x * 10;
                            console.info(y);
                            this.blah(x);
                        }
                        /*private*/ random() {
                            return 10;
                        }
                        /*private*/ blah(z) {
                            let x = this.random();
                            const y = z * x;
                            console.info(y);
                            x = 10;
                            console.info(x);
                        }
                        static main(args) {
                            new IntraproceduralDataFlow().foo();
                        }
                    }
                    samples.IntraproceduralDataFlow = IntraproceduralDataFlow;
                    IntraproceduralDataFlow["__class"] = "br.unb.cic.analysis.samples.IntraproceduralDataFlow";
                })(samples = analysis.samples || (analysis.samples = {}));
            })(analysis = cic.analysis || (cic.analysis = {}));
        })(cic = unb.cic || (unb.cic = {}));
    })(unb = br.unb || (br.unb = {}));
})(br || (br = {}));
br.unb.cic.analysis.samples.IntraproceduralDataFlow.main(null);
