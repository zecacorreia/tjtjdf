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
                    class ArrayIndirectDataFlowSample {
                        static main(args) {
                            const arr = [0, 0, 0, 0, 0];
                            arr[4] = 10;
                            const b = arr[3];
                            console.info(b);
                        }
                    }
                    samples.ArrayIndirectDataFlowSample = ArrayIndirectDataFlowSample;
                    ArrayIndirectDataFlowSample["__class"] = "br.unb.cic.analysis.samples.ArrayIndirectDataFlowSample";
                })(samples = analysis.samples || (analysis.samples = {}));
            })(analysis = cic.analysis || (cic.analysis = {}));
        })(cic = unb.cic || (unb.cic = {}));
    })(unb = br.unb || (br.unb = {}));
})(br || (br = {}));
br.unb.cic.analysis.samples.ArrayIndirectDataFlowSample.main(null);
