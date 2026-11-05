// Sample.js – translation of DoubleSourceSample.java (Node.js, no external libraries)

class DoubleSourceSample {
    static main(args) {
        // int x = 10;
        // int y = 20;
        let x = 10;
        let y = 20;

        // x = x + 1;   // left
        x = x + 1;

        // System.out.println(args);
        // In Java this prints the array object's toString; in Node we output the array itself.
        console.log(args);

        // y = y - 1;   // right
        y = y - 1;

        // System.out.println(x + y);
        console.log(x + y);
    }
}

// Call the main method with the command‑line arguments (excluding node and script name)
DoubleSourceSample.main(process.argv.slice(2));
