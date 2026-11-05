// Translated from SourceSinkVariableAttributionSample.java to Node.js (no external libraries)

class SourceSinkVariableAttributionSample {
  foo() {
    let x = 0;
    let y = 0;
    let z = 10;

    x = 10;               // left
    y = z + 2;            // right

    this.addThese(x, y);  // Confluence Line
  }

  addThese(a0, a1) {
    return a0 + a1;
  }
}

function main() {
  new SourceSinkVariableAttributionSample().foo();
}

main();
