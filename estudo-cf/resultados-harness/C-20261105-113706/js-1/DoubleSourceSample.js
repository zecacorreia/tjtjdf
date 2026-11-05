// Sample.js – translation of DoubleSourceSample.java to Node.js (no external libraries)

function javaArrayToString(arr) {
    // Simulate Java's default toString for a String[]:
    // class name "[Ljava.lang.String;" followed by '@' and a hex hash code.
    // The hash is derived from the contents to be deterministic across runs.
    let hash = 0;
    for (let i = 0; i < arr.length; i++) {
        const s = String(arr[i]);
        for (let j = 0; j < s.length; j++) {
            hash = ((hash * 31) + s.charCodeAt(j)) | 0; // 32‑bit signed overflow like Java's int
        }
    }
    // Convert to unsigned 32‑bit and then to hex, matching Java's positive hash representation.
    hash = hash >>> 0;
    return "[Ljava.lang.String;@" + hash.toString(16);
}

// Main function replicating DoubleSourceSample.main
function main() {
    // Simulate Java's String[] args (skip node executable and script name)
    const args = process.argv.slice(2);

    // int x = 10; int y = 20;
    let x = 10;
    let y = 20;

    // x = x + 1;   // left
    x = x + 1;

    // System.out.println(args);
    // println adds a newline, so we use process.stdout.write
    process.stdout.write(javaArrayToString(args) + "\n");

    // y = y - 1;   // right
    y = y - 1;

    // System.out.println(x + y);
    // console.log adds a newline automatically
    console.log(x + y);
}

// Invoke main when the script is executed
main();
