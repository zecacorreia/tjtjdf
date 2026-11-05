// Sample.js – translation of ConfluenceBaseSample2 from Java to Node.js

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
        // No output required, matching the Java program's behavior
    }
}

// Simulate the Java static main method
function main() {
    new ConfluenceBaseSample2().m();
}

// Invoke main when the script is executed
main();
