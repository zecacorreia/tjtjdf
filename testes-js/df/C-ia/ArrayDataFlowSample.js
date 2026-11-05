// Sample.js – translated from Sample.java (Java → Node.js)

class ArrayDataFlowSample {
    static main(args) {
        // int[] arr = {0,0,0,0,0};
        let arr = [0, 0, 0, 0, 0];

        // arr = populate(arr.length); //source 1
        arr = this.populate(arr.length);

        // arr[4] = 10;        //source 2
        arr[4] = 10;

        // int b = arr[4];     //sink 2
        const b = arr[4]; // (unused, kept for parity)

        // for(int a : arr) System.out.println(a); //sink 1
        for (const a of arr) {
            console.log(a); // println adds a line break
        }
    }

    static populate(size) {
        // int[] res = new int[size];
        const res = new Array(size);

        // for(int i = 0; i < size; i++) res[i] = i+1;
        for (let i = 0; i < size; i++) {
            res[i] = i + 1;
        }

        // return res;
        return res;
    }
}

// invoke main when the script is run
ArrayDataFlowSample.main(process.argv.slice(2));
