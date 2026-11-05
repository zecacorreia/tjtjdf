// Sample.js – translation of ConfluenceBaseSample2.java to Node.js (no external libraries)

class ConfluenceBaseSample2 {
    m() {
        let x = 1; // LEFT
        let base = 1;
        let y = 1; // RIGHT
        let z;
        if (x + y > 1) {
            z = 1;
        } else {
            z = 0;
        }
        // No output required, matching the original Java program
    }
}

function main() {
    new ConfluenceBaseSample2().m();
}

// Invoke the main function to emulate Java's entry point
main();
