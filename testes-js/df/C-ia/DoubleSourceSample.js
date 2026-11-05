// Sample.js – translation of DoubleSourceSample.java to Node.js (no external libraries)

const args = process.argv.slice(2); // Java's String[] args

// Simulate Java's System.identityHashCode for objects
const _identityMap = new WeakMap();
let _nextId = 0x123456; // arbitrary start value

function identityHashCode(obj) {
  if (!_identityMap.has(obj)) {
    // assign a new incremental id
    _identityMap.set(obj, ++_nextId);
  }
  return _identityMap.get(obj);
}

// Simulate Java's default toString for a String[] array
function javaArrayToString(arr) {
  // class descriptor for a String array in Java
  const className = "[Ljava.lang.String;";
  const hashHex = identityHashCode(arr).toString(16);
  return className + "@" + hashHex;
}

// Main method equivalent
function main() {
  let x = 10;
  let y = 20;

  x = x + 1; // left

  // System.out.println(args);
  process.stdout.write(javaArrayToString(args) + "\n");

  y = y - 1; // right

  // System.out.println(x + y);
  process.stdout.write(String(x + y) + "\n");
}

// Invoke main
main();
