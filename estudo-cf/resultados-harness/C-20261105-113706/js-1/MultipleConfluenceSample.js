// Sample.js – translation of br.unb.cic.analysis.samples.MultipleConfluenceSample
// Node.js (no external libraries)

class MultipleConfluenceSample {
    multipleConfluencesToTheSameLine() {
        let x = 0;
        let y = 0;
        let z = 0;

        x = x + 1; // source
        y = y + 1; // source
        z = z + 1; // sink

        // System.out.println adds a line break → use console.log
        console.log(x);
        console.log(y);
        console.log(z);
        console.log(x + y + z);
    }

    // static main equivalent
    static main(args) {
        new MultipleConfluenceSample().multipleConfluencesToTheSameLine();
    }
}

// invoke main when the script is run
MultipleConfluenceSample.main(process.argv.slice(2));
