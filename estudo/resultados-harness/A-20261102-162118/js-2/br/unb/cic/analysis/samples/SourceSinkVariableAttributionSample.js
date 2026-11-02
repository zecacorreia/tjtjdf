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
                    /**
                     * with the current analysis setup Soot,
                     * when optimizing the code, ends up erasing
                     * variable references that have a constant
                     * attributed to them, preventing the conflict
                     * detection by the analyzer if such attribution
                     * happens to be a line of interest(source or sink).
                     *
                     * @class
                     */
                    class SourceSinkVariableAttributionSample {
                        foo() {
                            let x = 0;
                            let y = 0;
                            const z = 10;
                            x = 10;
                            y = z + 2;
                            this.addThese(x, y);
                        }
                        /*private*/ addThese(a0, a1) {
                            return a0 + a1;
                        }
                        static main(args) {
                            new SourceSinkVariableAttributionSample().foo();
                        }
                    }
                    samples.SourceSinkVariableAttributionSample = SourceSinkVariableAttributionSample;
                    SourceSinkVariableAttributionSample["__class"] = "br.unb.cic.analysis.samples.SourceSinkVariableAttributionSample";
                })(samples = analysis.samples || (analysis.samples = {}));
            })(analysis = cic.analysis || (cic.analysis = {}));
        })(cic = unb.cic || (unb.cic = {}));
    })(unb = br.unb || (br.unb = {}));
})(br || (br = {}));
br.unb.cic.analysis.samples.SourceSinkVariableAttributionSample.main(null);
