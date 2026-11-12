// Sample.js – translation of DoubleSourceSample.java (ES5)

function DoubleSourceSample() {}

// Simula o hashCode usado por Java para representar o array na saída de println
function javaArrayToString(arr) {
    // Calcula um hash simples baseado no conteúdo (determinístico)
    var h = 0;
    for (var i = 0; i < arr.length; i++) {
        var s = arr[i];
        for (var j = 0; j < s.length; j++) {
            h = ((31 * h) + s.charCodeAt(j)) | 0; // overflow como em Java (int 32‑bits)
        }
    }
    // Converte para hexadecimal sem sinal
    var hex = (h >>> 0).toString(16);
    return "[Ljava.lang.String;@" + hex;
}

// método main equivalente
DoubleSourceSample.main = function (args) {
    var x = 10;
    var y = 20;

    x = x + 1; // left

    // System.out.println(args);
    process.stdout.write(javaArrayToString(args) + "\n");

    y = y - 1; // right

    // System.out.println(x + y);
    console.log(x + y);
};

// chama o main com os argumentos da linha de comando (excluindo node e o script)
DoubleSourceSample.main(process.argv.slice(2));
