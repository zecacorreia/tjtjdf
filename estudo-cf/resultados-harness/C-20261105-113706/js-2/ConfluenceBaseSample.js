// Sample.js – translation of ConfluenceBaseSample from Java to Node.js (no external libraries)

class ConfluenceBaseSample {
    constructor() {
        // Fields corresponding to the Java private members
        this.text = undefined;   // not used in this sample
        this.words = undefined;  // will hold a number
        this.spaces = undefined; // will hold a number
    }

    // Replicates the Java method countFixes()
    countFixes() {
        // Create a fresh instance, exactly as the Java code does
        const confluenceBaseSample = new ConfluenceBaseSample();

        // The three method calls are kept in the same order
        confluenceBaseSample.countDupWhitespace(); // LEFT
        confluenceBaseSample.countComments();
        confluenceBaseSample.countDupWords();      // RIGHT

        // Return the sum of the two fields (both are numbers)
        return confluenceBaseSample.spaces + confluenceBaseSample.words;
    }

    // Private‑like methods (Java's private) – we keep them public in JS for simplicity
    countDupWords() {
        // In Java: this.words = new Integer(2);
        this.words = 2;
    }

    countComments() {
        // Empty method, mirrors the Java stub
    }

    countDupWhitespace() {
        // In Java: this.spaces = new Integer(1);
        this.spaces = 1;
    }

    // Static main method analogue
    static main() {
        // Java's System.out.println adds a newline; console.log does the same
        console.log(new ConfluenceBaseSample().countFixes());
    }
}

// Invoke the entry point when the script is executed
ConfluenceBaseSample.main();
