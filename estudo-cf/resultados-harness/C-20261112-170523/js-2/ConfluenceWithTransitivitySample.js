// Sample.js – translation of ConfluenceWithTransitivitySample.java (ES5)

function ConfluenceWithTransitivitySample() {
    // constructor – no fields to initialize
}

ConfluenceWithTransitivitySample.prototype.foo = function () {
    var x = 1;
    var y = 2;
    var z = 3;

    x = 10; // left

    z = x + 1;

    y++; // right

    // addThese(z, y);
    console.log(z + y); // System.out.println adds a line break
};

/* ConfluenceWithTransitivitySample.prototype.addThese = function (a1, a2) {
    return a1 + a2;
}; */

function main(args) {
    new ConfluenceWithTransitivitySample().foo();
}

// invoke main (args not used)
main([]);
