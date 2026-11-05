// Sample.js – translation of InterproceduralConfluenceSample.java to Node.js

class InterproceduralConfluenceSample {
  constructor() {
    this.counter = 0; // private int counter = 0;
  }

  interproceduralSample() {
    // int x = 0; int y = 0;
    let x = 0;
    let y = 0;

    x = x + 1; // source
    y = y + 2; // sink

    this.incrementCounter(x);
    this.incrementCounter(y);
  }

  incrementCounter(value) {
    // counter += value;
    this.counter += value;
  }
}

// Simulate the static main method
function main() {
  new InterproceduralConfluenceSample().interproceduralSample();
}

// Invoke main when the script is executed
main();
