// Sample.js – translation of ConfluenceWithTransitivitySample.java to ES5 JavaScript

function ConfluenceWithTransitivitySample() {
    // constructor (no initialization needed)
}

// Instance method foo replicating the Java logic
ConfluenceWithTransitivitySample.prototype.foo = function () {
    var x = 1;
    var y = 2;
    var z = 3;

    x = 10;               // left

    z = x + 1;            // z becomes 11

    y++;                  // y becomes 3

    // addThese(z, y);    // method is commented out in the original source

    // System.out.println adds a line break; console.log does the same
    console.log(z + y);
};

/* The original Java class had a private method addThese that was commented out.
   It is omitted here because it is not used. */

// Simulated static main method
function main(args) {
    new ConfluenceWithTransitivitySample().foo();
}

// Invoke main when the script is executed
main([]);
