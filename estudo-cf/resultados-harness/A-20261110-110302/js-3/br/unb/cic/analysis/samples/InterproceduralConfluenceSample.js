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
                    class InterproceduralConfluenceSample {
                        constructor() {
                            this.counter = 0;
                        }
                        interproceduralSample() {
                            let x = 0;
                            let y = 0;
                            x = x + 1;
                            y = y + 2;
                            this.incrementCounter(x);
                            this.incrementCounter(y);
                        }
                        incrementCounter(value) {
                            this.counter += value;
                        }
                        static main(args) {
                            new InterproceduralConfluenceSample().interproceduralSample();
                        }
                    }
                    samples.InterproceduralConfluenceSample = InterproceduralConfluenceSample;
                    InterproceduralConfluenceSample["__class"] = "br.unb.cic.analysis.samples.InterproceduralConfluenceSample";
                })(samples = analysis.samples || (analysis.samples = {}));
            })(analysis = cic.analysis || (cic.analysis = {}));
        })(cic = unb.cic || (unb.cic = {}));
    })(unb = br.unb || (br.unb = {}));
})(br || (br = {}));
br.unb.cic.analysis.samples.InterproceduralConfluenceSample.main(null);
