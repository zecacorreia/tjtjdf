class MultipleConfluenceSample {
    multipleConfluencesToTheSameLine() {
        let x = 0;
        let y = 0;
        let z = 0;

        x = x + 1; // source
        y = y + 1; // source
        z = z + 1; // sink

        console.log(x);
        console.log(y);
        console.log(z);
        console.log(x + y + z);
    }

    static main(args) {
        new MultipleConfluenceSample().multipleConfluencesToTheSameLine();
    }
}

// Call the main method to produce the output
MultipleConfluenceSample.main(process.argv.slice(2));
