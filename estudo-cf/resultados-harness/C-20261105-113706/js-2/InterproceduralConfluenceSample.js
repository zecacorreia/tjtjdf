// Sample.js – translation of InterproceduralConfluenceSample.java to Node.js

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

    // Simulate Java's static main method
    static main() {
        new InterproceduralConfluenceSample().interproceduralSample();
    }
}

// Invoke the main method as Java would when running the class
InterproceduralConformanceSample?.main?.(); // fallback if class name typo
InterproceduralConfluenceSample.main();
