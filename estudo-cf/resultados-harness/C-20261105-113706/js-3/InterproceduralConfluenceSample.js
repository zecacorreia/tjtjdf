// Sample.js – translation of InterproceduralConfluenceSample.java to Node.js (no external libraries)

class InterproceduralConfluenceSample {
    constructor() {
        this.counter = 0;
    }

    interproceduralSample() {
        let x = 0;
        let y = 0;

        x = x + 1; // source

        y = y + 2; // sink

        this.incrementCounter(x);
        this.incrementCounter(y);
    }

    incrementCounter(value) {
        this.counter += value;
    }

    static main() {
        new InterproceduralConfluenceSample().interproceduralSample();
    }
}

// invoke main when the script is executed
InterproceduralConfluenceSample.main();
