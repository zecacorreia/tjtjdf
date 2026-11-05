class ArrayIndirectDataFlowSample {
    static main(args) {
        // equivalente a: int[] arr = {0,0,0,0,0};
        const arr = [0, 0, 0, 0, 0];

        // arr[4] = 10;        //source 1
        arr[4] = 10;

        // int b = arr[3];     //sink 1
        const b = arr[3];

        // System.out.println(b); //sink 2
        // console.log always appends a newline, matching println
        console.log(b);
    }
}

// chama o main, passando os argumentos da linha de comando (se houver)
ArrayIndirectDataFlowSample.main(process.argv.slice(2));
