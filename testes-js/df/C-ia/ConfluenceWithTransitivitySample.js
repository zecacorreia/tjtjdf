// Sample.js – translation of ConfluenceWithTransitivitySample.java to Node.js

class ConfluenceWithTransitivitySample {
    foo() {
        let x = 1;
        let y = 2;
        let z = 3;

        x = 10; // left

        z = x + 1;

        y++; // right

        // addThese(z, y);
        console.log(z + y); // System.out.println adds a newline
    }

    // private addThese(a1, a2) {
    //     return a1 + a2;
    // }
}

// main equivalent
new ConfluenceWithTransitivitySample().foo();
