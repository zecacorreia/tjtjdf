// Sample.js – translation of ConfluenceBaseSample from Java to ES5 JavaScript (Node.js)

function ConfluenceBaseSample() {
    this.text = null;
    this.words = null;
    this.spaces = null;
}

// public int countFixes()
ConfluenceBaseSample.prototype.countFixes = function () {
    var confluenceBaseSample = new ConfluenceBaseSample();
    confluenceBaseSample.countDupWhitespace(); // LEFT
    confluenceBaseSample.countComments();
    confluenceBaseSample.countDupWords(); // RIGHT
    // In Java the Integer objects are unboxed; here we store plain numbers.
    return confluenceBaseSample.spaces + confluenceBaseSample.words;
};

// private void countDupWords()
ConfluenceBaseSample.prototype.countDupWords = function () {
    this.words = 2; // new Integer(2) → 2
};

// private void countComments()
ConfluenceBaseSample.prototype.countComments = function () {
    // intentionally empty
};

// private void countDupWhitespace()
ConfluenceBaseSample.prototype.countDupWhitespace = function () {
    this.spaces = 1; // new Integer(1) → 1
};

// public static void main(String[] args)
function main(args) {
    // System.out.println adds a line break; console.log does the same.
    console.log(new ConfluenceBaseSample().countFixes());
}

// invoke main as the program entry point
main([]);
