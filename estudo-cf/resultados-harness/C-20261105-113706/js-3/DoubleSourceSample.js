// Sample.js – translation of DoubleSourceSample.java to Node.js (no external libraries)

function javaIdentityHashCode(obj) {
    // Deterministic hash similar to Java's identityHashCode for the purpose of this translation
    const str = JSON.stringify(obj);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // keep as 32‑bit integer
    }
    // Convert to unsigned and then to hexadecimal, matching Java's toHexString output
    return (hash >>> 0).toString(16);
}

function javaArrayToString(arr) {
    // Mimic Java's default toString for a String[]: "[Ljava.lang.String;@<hash>"
    return "[Ljava.lang.String;@" + javaIdentityHashCode(arr);
}

function main(args) {
    // Replicate the Java variables and operations
    let x = 10;
    let y = 20;

    x = x + 1; // left

    // System.out.println(args);
    console.log(javaArrayToString(args));

    y = y - 1; // right

    // System.out.println(x + y);
    console.log(x + y);
}

// Obtain the command‑line arguments as Java would (excluding the script name)
const javaArgs = process.argv.slice(2);

// Invoke the translated main method
main(javaArgs);
