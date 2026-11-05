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
                    class IntraproceduralIndirectSource {
                        m() {
                            let x = 1000;
                            x = this.random();
                            console.info(x);               // println equivalent
                            const y = x + 1;
                            process.stdout.write(String(y)); // print equivalent (no newline)
                        }
                        /*private*/ random() {
                            return 0;
                        }
                        a() {
                            const mock = new br.unb.cic.analysis.samples.MockClass();
                            mock.setA(1);
                            const y = mock.getA() + 1;
                            console.info(y);               // println equivalent
                        }
                        static main(args) {
                            const o = new IntraproceduralIndirectSource();
                            o.m();
                            o.a();
                        }
                    }
                    samples.IntraproceduralIndirectSource = IntraproceduralIndirectSource;
                    IntraproceduralIndirectSource["__class"] = "br.unb.cic.analysis.samples.IntraproceduralIndirectSource";
                    class MockClass {
                        constructor() {
                            if (this.a === undefined) {
                                this.a = 0;
                            }
                        }
                        setA(a) {
                            this.a = a;
                        }
                        getA() {
                            return this.a;
                        }
                    }
                    samples.MockClass = MockClass;
                    MockClass["__class"] = "br.unb.cic.analysis.samples.MockClass";
                })(samples = analysis.samples || (analysis.samples = {}));
            })(analysis = cic.analysis || (cic.analysis = {}));
        })(cic = unb.cic || (unb.cic = {}));
    })(unb = br.unb || (br.unb = {}));
})(br || (br = {}));
br.unb.cic.analysis.samples.IntraproceduralIndirectSource.main(null);
