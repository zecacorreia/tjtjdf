// Sample.js – translation of InterproceduralConfluenceSample (Java) to ES5 JavaScript (Node.js)

function InterproceduralConfluenceSample() {
    // private field counter, initialized to 0
    this.counter = 0;
}

// method: interproceduralSample
InterproceduralConfluenceSample.prototype.interproceduralSample = function () {
    var x = 0;
    var y = 0;

    x = x + 1; // source
    y = y + 2; // sink

    this.incrementCounter(x);
    this.incrementCounter(y);
};

// method: incrementCounter
InterproceduralConfluenceSample.prototype.incrementCounter = function (value) {
    this.counter += value;
};

// static-like main function
function main(args) {
    new InterproceduralConfluenceSample().interproceduralSample();
}

// invoke main (args are ignored, matching Java's signature)
main([]);
