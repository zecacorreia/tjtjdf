// Sample.js – translation of ConfluenceWithTransitivitySample.java to Node.js

class ConfluenceWithTransitivitySample {
    foo() {
        let x = 1;
        let y = 2;
        let z = 3;

        x = 10;               // left

        z = x + 1;

        y++;                  // right

        // addThese(z, y);
        console.log(z + y);   // println → newline
    }

    // private int addThese(int a1, int a2){
    //     return a1 + a2;
    // }
}

// static main equivalent
function main() {
    new ConfluenceWithTransitivitySample().foo();
}

// invoke main when the script is executed
if (require.main === module) {
    main();
}
