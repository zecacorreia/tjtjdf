// Sample.js - translation of br.unb.cic.analysis.samples.MultipleConfluenceSample
function MultipleConfluenceSample() {
    // constructor (no fields needed)
}

// method definition using prototype
MultipleConfluenceSample.prototype.multipleConfluencesToTheSameLine = function () {
    var x = 0;
    var y = 0;
    var z = 0;

    // source statements
    x = x + 1;
    y = y + 1;

    // sink statement
    z = z + 1;

    // System.out.println equivalents (each adds a newline)
    console.log(x);
    console.log(y);
    console.log(z);
    console.log(x + y + z);
};

// main function to mimic Java's static main
function main(args) {
    new MultipleConfluenceSample().multipleConfluencesToTheSameLine();
}

// invoke main when the script is run
main([]);
