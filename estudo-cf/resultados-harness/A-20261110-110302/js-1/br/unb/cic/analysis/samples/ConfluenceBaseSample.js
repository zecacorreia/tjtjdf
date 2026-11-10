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
                    class ConfluenceBaseSample {
                        constructor() {
                            if (this.text === undefined) {
                                this.text = null;
                            }
                            if (this.words === undefined) {
                                this.words = null;
                            }
                            if (this.spaces === undefined) {
                                this.spaces = null;
                            }
                        }
                        countFixes() {
                            const confluenceBaseSample = new ConfluenceBaseSample();
                            confluenceBaseSample.countDupWhitespace();
                            confluenceBaseSample.countComments();
                            confluenceBaseSample.countDupWords();
                            return confluenceBaseSample.spaces + confluenceBaseSample.words;
                        }
                        /*private*/ countDupWords() {
                            this.words = new Number(2).valueOf();
                        }
                        /*private*/ countComments() {
                        }
                        /*private*/ countDupWhitespace() {
                            this.spaces = new Number(1).valueOf();
                        }
                        static main(args) {
                            console.info(new ConfluenceBaseSample().countFixes());
                        }
                    }
                    samples.ConfluenceBaseSample = ConfluenceBaseSample;
                    ConfluenceBaseSample["__class"] = "br.unb.cic.analysis.samples.ConfluenceBaseSample";
                })(samples = analysis.samples || (analysis.samples = {}));
            })(analysis = cic.analysis || (cic.analysis = {}));
        })(cic = unb.cic || (unb.cic = {}));
    })(unb = br.unb || (br.unb = {}));
})(br || (br = {}));
br.unb.cic.analysis.samples.ConfluenceBaseSample.main(null);
