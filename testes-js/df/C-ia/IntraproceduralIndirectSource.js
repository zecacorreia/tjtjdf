// Sample.js – translation of IntraproceduralIndirectSource.java to Node.js

class IntraproceduralIndirectSource {
    m() {
        let x = 1000;
        x = this.random();               // source (left)
        process.stdout.write(x + "\n");  // System.out.println(x)

        const y = x + 1;
        process.stdout.write(String(y)); // System.out.print(y) – no newline
    }

    random() {
        return 0;
    }

    a() {
        const mock = new MockClass();

        mock.setA(1);                     // source

        const y = mock.getA() + 1;
        process.stdout.write(y + "\n");  // System.out.println(y)
    }

    static main() {
        const o = new IntraproceduralIndirectSource();
        o.m();
        o.a();
    }
}

class MockClass {
    constructor() {
        this.a = 0;
    }

    setA(a) {
        this.a = a;
    }

    getA() {
        return this.a;
    }
}

// Execute the program
IntraproceduralIndirectSource.main();
