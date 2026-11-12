// Sample.js - translation of ConfluenceBaseSample2 from Java to ES5 JavaScript (Node.js)

function ConfluenceBaseSample2() {
    // constructor (no initialization needed)
}

// method m replicates the Java method logic
ConfluenceBaseSample2.prototype.m = function () {
    var x = 1;      // LEFT
    var base = 1;
    var y = 1;      // RIGHT
    var z;
    if (x + y > 1) {
        z = 1;
    } else {
        z = 0;
    }
    // No output required
};

// main function equivalent to Java's public static void main
function main(args) {
    // args is ignored, matching Java signature
    new ConfluenceBaseSample2().m();
}

// invoke main when the script is run
main([]);
