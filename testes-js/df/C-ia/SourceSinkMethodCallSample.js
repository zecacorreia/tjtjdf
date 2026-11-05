// Sample.js – translation of br.unb.cic.analysis.samples.SourceSinkMethodCallSample

class SourceSinkMethodCallSample {
    foo() {
        let x = 10;
        let y = 20;

        x = this.one();   // right
        y = this.two();   // left

        console.log(x + y); // prints sum with newline
    }

    one() {
        return 1;
    }

    two() {
        return 2;
    }

    static main() {
        new SourceSinkMethodCallSample().foo();
    }
}

// invoke the program
SourceSinkMethodCallSample.main();
