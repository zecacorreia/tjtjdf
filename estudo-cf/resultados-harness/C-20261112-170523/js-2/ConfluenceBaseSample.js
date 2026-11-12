// Sample.js – translation of ConfluenceBaseSample (Java) to ES5 JavaScript (Node.js)

function ConfluenceBaseSample() {
    // private fields (simulated)
    this.text = null;
    this.words = null;
    this.spaces = null;
}

// countFixes method
ConfluenceBaseSample.prototype.countFixes = function () {
    var confluenceBaseSample = new ConfluenceBaseSample();
    confluenceBaseSample.countDupWhitespace(); // LEFT
    confluenceBaseSample.countComments();
    confluenceBaseSample.countDupWords();      // RIGHT
    return confluenceBaseSample.spaces + confluenceBaseSample.words;
};

// countDupWords method
ConfluenceBaseSample.prototype.countDupWords = function () {
    // In Java: this.words = new Integer(2);
    this.words = 2;
};

// countComments method (empty)
ConfluenceBaseSample.prototype.countComments = function () {
    // no operation
};

// countDupWhitespace method
ConfluenceBaseSample.prototype.countDupWhitespace = function () {
    // In Java: this.spaces = new Integer(1);
    this.spaces = 1;
};

// main function – mimics Java's public static void main(String[] args)
function main(args) {
    var result = new ConfluenceBaseSample().countFixes();
    // System.out.println adds a line break; use process.stdout.write to control it
    process.stdout.write(String(result) + "\n");
}

// invoke main
main([]);
