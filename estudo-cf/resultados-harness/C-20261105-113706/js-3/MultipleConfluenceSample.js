// Sample.js – translation of br.unb.cic.analysis.samples.MultipleConfluenceSample
class MultipleConfluenceSample {
    multipleConfluencesToTheSameLine() {
        let x = 0;
        let y = 0;
        let z = 0;

        x = x + 1; // source

        y = y + 1; // source

        z = z + 1; // sink

        // System.out.println → console.log (adds newline)
        console.log(x);
        console.log(y);
        console.log(z);
        console.log(x + y + z);
    }

    static main() {
        new MultipleConfluenceSample().multipleConfluencesToTheSameLine();
    }
}

// invoke the main method, as Java would do
MultipleConfluenceSample.main();
