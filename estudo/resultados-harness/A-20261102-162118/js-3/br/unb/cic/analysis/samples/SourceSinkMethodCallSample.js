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
                    class SourceSinkMethodCallSample {
                        foo() {
                            let x = 10;
                            let y = 20;
                            x = this.one();
                            y = this.two();
                            console.info(x + y);
                        }
                        /*private*/ one() {
                            return 1;
                        }
                        /*private*/ two() {
                            return 2;
                        }
                        static main(args) {
                            new SourceSinkMethodCallSample().foo();
                        }
                    }
                    samples.SourceSinkMethodCallSample = SourceSinkMethodCallSample;
                    SourceSinkMethodCallSample["__class"] = "br.unb.cic.analysis.samples.SourceSinkMethodCallSample";
                })(samples = analysis.samples || (analysis.samples = {}));
            })(analysis = cic.analysis || (cic.analysis = {}));
        })(cic = unb.cic || (unb.cic = {}));
    })(unb = br.unb || (br.unb = {}));
})(br || (br = {}));
br.unb.cic.analysis.samples.SourceSinkMethodCallSample.main(null);
