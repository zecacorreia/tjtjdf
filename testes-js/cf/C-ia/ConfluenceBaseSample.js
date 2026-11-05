class ConfluenceBaseSample {
  constructor() {
    this.text = undefined;
    this.words = undefined;
    this.spaces = undefined;
  }

  countFixes() {
    const confluenceBaseSample = new ConfluenceBaseSample();
    confluenceBaseSample.countDupWhitespace(); // LEFT
    confluenceBaseSample.countComments();
    confluenceBaseSample.countDupWords(); // RIGHT
    return confluenceBaseSample.spaces + confluenceBaseSample.words;
  }

  countDupWords() {
    this.words = 2;
  }

  countComments() {
    // intentionally empty, mirrors Java method
  }

  countDupWhitespace() {
    this.spaces = 1;
  }

  static main() {
    // System.out.println adds a newline
    console.log(new ConfluenceBaseSample().countFixes());
  }
}

// Execute the program
ConfluenceBaseSample.main();
