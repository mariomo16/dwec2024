/*

    Nombre del archivo: ocultarPalabrasV1.js
    Autor: Mario Morales Ortega (1745008)
    Fecha de creación: 03 de noviembre de 2023

    Descripción:
    Script para intentar adivinar palabras ocultas de una cadena de texto introducida por .prompt(),
    el usuario indica (también por .prompt()) el numero de palabras que quiere ocultar.

    Modificaciones:
    - 03/11/2023: Creación del script

    Observaciones:
    - A veces, en vez de ocultar una palabra entera, solamente oculta algunas letras
    - Al comprobar los aciertos, distingue entre mayúsculas y minúsculas

*/

function juego() {
    // Pido al usuario una cadena de texto
    let cadena = prompt("Introduce una cadena de texto:");
    // Guardo las palabras (separadas por espacios) en un Array
    const palabras = cadena.split(" ");

    // Pido al usuario un numero entre 0 y nº palabras introducidas para saber cuantas palabras ocultar
    let numPalabrasOcultar = prompt(
        `Introduce un numero comprendido entre 0 y ${palabras.length}:`
    );

    const palabrasOcultas = []; // Array para almacenar las palabras que se oculten
    // Genero X números aleatorios que usare como indice para modificar la palabra y ocultarla
    do {
        // Variable donde guardare el indice a modificar
        let indiceAleatorio = Math.floor(Math.random() * palabras.length);
        // Guardo la palabra a ocultar en el Array según el numero aleatorio (indice)
        // que se haya generado, siempre y cuando esa palabra no exista ya dentro del Array
        while (!palabrasOcultas.includes(palabras[indiceAleatorio])) {
            palabrasOcultas.push(palabras[indiceAleatorio]);
        }
    } while (palabrasOcultas.length < numPalabrasOcultar);
    let textoAdivinar = palabras.join(" "); // String que guardara el texto con las palabras ocultas
    // Bucle para reemplazar las palabras ocultas por "*" según cuantas letras tenga la palabra
    for (let i = 0; i < palabrasOcultas.length; i++) {
        textoAdivinar = textoAdivinar.replace(
            palabrasOcultas[i],
            "*".repeat(palabrasOcultas[i].length)
        );
    }

    // Muestro el texto con las palabras ocultas para poder intentar adivinar
    let respuesta = prompt(
        `Intenta adivinar que palabras estan ocultas:\n${textoAdivinar}`
    );

    let aciertos = 0; // Variable para guardar los aciertos que tenga
    // Compruebo los aciertos que ha tenido
    for (let i = 0; i < numPalabrasOcultar; i++) {
        if (palabrasOcultas.includes(respuesta.split(" ")[i])) {
            aciertos++;
        }
    }
    // Muestro el resultado
    alert(
        "El texto original es:\n" +
            palabras.join(" ") +
            "\n\nHas introducido las palab" +
            "ras:\n" +
            respuesta.split(", ") +
            "\n\nHas acertado " +
            aciertos +
            " de " +
            palabrasOcultas.length
    );
}
juego();
