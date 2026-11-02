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
                    class SourceSinkVariableAttributionWithAutoIncrement {
                        foo() {
                            let x = 0;
                            let y = 0;
                            const z = 10;
                            x = 10;
                            x++;
                            y = z + 2;
                            this.addThese(x, y);
                        }
                        /*private*/ addThese(a0, a1) {
                            return a0 + a1;
                        }
                        static main(args) {
                            new SourceSinkVariableAttributionWithAutoIncrement().foo();
                        }
                    }
                    samples.SourceSinkVariableAttributionWithAutoIncrement = SourceSinkVariableAttributionWithAutoIncrement;
                    SourceSinkVariableAttributionWithAutoIncrement["__class"] = "br.unb.cic.analysis.samples.SourceSinkVariableAttributionWithAutoIncrement";
                })(samples = analysis.samples || (analysis.samples = {}));
            })(analysis = cic.analysis || (cic.analysis = {}));
        })(cic = unb.cic || (unb.cic = {}));
    })(unb = br.unb || (br.unb = {}));
})(br || (br = {}));
br.unb.cic.analysis.samples.SourceSinkVariableAttributionWithAutoIncrement.main(null);
