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
                    class MultipleConfluenceSample {
                        multipleConfluencesToTheSameLine() {
                            let x = 0;
                            let y = 0;
                            let z = 0;
                            x = x + 1;
                            y = y + 1;
                            z = z + 1;
                            console.info(x);
                            console.info(y);
                            console.info(z);
                            console.info(x + y + z);
                        }
                        static main(args) {
                            new MultipleConfluenceSample().multipleConfluencesToTheSameLine();
                        }
                    }
                    samples.MultipleConfluenceSample = MultipleConfluenceSample;
                    MultipleConfluenceSample["__class"] = "br.unb.cic.analysis.samples.MultipleConfluenceSample";
                })(samples = analysis.samples || (analysis.samples = {}));
            })(analysis = cic.analysis || (cic.analysis = {}));
        })(cic = unb.cic || (unb.cic = {}));
    })(unb = br.unb || (br.unb = {}));
})(br || (br = {}));
br.unb.cic.analysis.samples.MultipleConfluenceSample.main(null);
