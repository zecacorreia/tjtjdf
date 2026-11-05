// Sample.js – translation of IntraproceduralDataFlow.java to Node.js (no external libraries)

class IntraproceduralDataFlow {
    foo() {
        // int x = random(); // source
        const x = this.random();

        // int y = x * 10;
        const y = x * 10;

        // System.out.println(y);
        console.log(y);

        // blah(x); // sink
        this.blah(x);
    }

    random() {
        // return 10;
        return 10;
    }

    blah(z) {
        // int x = random(); // source
        let x = this.random();

        // int y = z * x;
        const y = z * x;

        // System.out.println(y);
        console.log(y);

        // x = 10;
        x = 10;

        // System.out.println(x); // sink
        console.log(x);
    }

    // Simulate the static main method
    static main() {
        new IntraproceduralDataFlow().foo();
    }
}

// Invoke the main entry point, matching the Java execution model
IntraproceduralDataFlow.main();
