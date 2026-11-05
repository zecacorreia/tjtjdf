// Sample.js – translation of br.unb.cic.analysis.samples.SourceSinkVariableAttributionWithAutoIncrement

class SourceSinkVariableAttributionWithAutoIncrement {
    foo() {
        let x = 0;
        let y = 0;
        let z = 10;

        x = 10;      // left
        x++;        // base (post‑increment)
        y = z + 2;   // right

        this.addThese(x, y); // Confluence Line
    }

    addThese(a0, a1) {
        return a0 + a1;
    }
}

// Emulate the Java static main method
function main() {
    new SourceSinkVariableAttributionWithAutoIncrement().foo();
}

main();
