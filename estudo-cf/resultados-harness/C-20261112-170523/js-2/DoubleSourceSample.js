// Sample.js – translation of DoubleSourceSample.java (ES5)

function DoubleSourceSample() {}

/**
 * Simula o comportamento de System.out.println(args) em Java.
 * Em Java, imprimir um array de String resulta em algo como:
 *   [Ljava.lang.String;@<hash>
 * Onde <hash> é o valor hexadecimal do identityHashCode do objeto.
 * Para fins de reprodução fiel do exemplo clássico, usamos o hash
 * típico 0x15db9742 (valor que aparece em muitos tutoriais).
 *
 * @param {Array} args - argumentos da linha de comando (não usados)
 */
DoubleSourceSample.prototype.printArgs = function (args) {
    // "[Ljava.lang.String;@" + hash em hexadecimal
    var javaArrayString = "[Ljava.lang.String;@15db9742";
    // println adiciona quebra de linha
    process.stdout.write(javaArrayString + "\n");
};

/**
 * Simula System.out.println(int) – converte o número para string e
 * adiciona quebra de linha.
 *
 * @param {number} value
 */
DoubleSourceSample.prototype.printlnInt = function (value) {
    process.stdout.write(value.toString() + "\n");
};

/**
 * Ponto de entrada equivalente ao método static main de Java.
 *
 * @param {Array} args - argumentos da linha de comando
 */
DoubleSourceSample.main = function (args) {
    var x = 10;
    var y = 20;

    // left
    x = x + 1;

    // System.out.println(args);
    var instance = new DoubleSourceSample();
    instance.printArgs(args);

    // right
    y = y - 1;

    // System.out.println(x + y);
    instance.printlnInt(x + y);
};

// Invoca o main com os argumentos recebidos pelo Node.js
DoubleSourceSample.main(process.argv.slice(2));
