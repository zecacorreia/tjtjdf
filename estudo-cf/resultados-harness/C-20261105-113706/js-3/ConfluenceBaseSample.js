// Sample.js – translation of ConfluenceBaseSample from Java to Node.js

class ConfluenceBaseSample {
    constructor() {
        // fields correspond to the Java private members
        this.text = undefined;
        this.words = undefined;
        this.spaces = undefined;
    }

    // public method countFixes()
    countFixes() {
        // create a fresh instance, exactly as in the Java version
        const confluenceBaseSample = new ConfluenceBaseSample();

        // invoke the three helper methods in the same order
        confluenceBaseSample.countDupWhitespace(); // LEFT
        confluenceBaseSample.countComments();
        confluenceBaseSample.countDupWords();      // RIGHT

        // return the sum of the two Integer fields (spaces + words)
        // In Java they are Integer objects; here we just use numbers.
        return confluenceBaseSample.spaces + confluenceBaseSample.words;
    }

    // private void countDupWords()
    countDupWords() {
        // Java does: this.words = new Integer(2);
        this.words = 2;
    }

    // private void countComments()
    countComments() {
        // No operation – matches the empty Java method.
    }

    // private void countDupWhitespace()
    countDupWhitespace() {
        // Java does: this.spaces = new Integer(1);
        this.spaces = 1;
    }

    // static main method equivalent
    static main() {
        // System.out.println adds a line break; console.log does the same.
        console.log(new ConfluenceBaseSample().countFixes());
    }
}

// invoke the main entry point when the script is executed
ConfluenceBaseSample.main();
