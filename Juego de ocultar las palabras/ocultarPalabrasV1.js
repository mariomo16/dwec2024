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
  // Pido al usuario una cadena de texto para almacenar las palabras separadas en un Array
  let cadena = prompt("Introduce una cadena de texto:");
  const palabras = cadena.split(" "); // Guardo las palabras (separadas por espacios) en un Array

  // Pido al usuario un numero entre 0 y palabras.length para saber cuantas palabras ocultar
  let numPalabrasOcultar = prompt(
    `Introduce un numero comprendido entre 0 y ${palabras.length}:`
  );

  const palabrasOcultas = []; // Array para almacenar las palabras que se oculten
  // Genero X números aleatorios que usare como indice para modificar la palabra y ocultarla
  do {
    let indiceAleatorio = Math.floor(Math.random() * palabras.length); // Variable donde guardare el indice a modificar
    // Guardo la palabra a ocultar en el Array según el numero aleatorio (indice) que se haya generado,
    // siempre y cuando se compruebe (dentro de este bucle), que esa palabra (indice) no exista ya
    while (!palabrasOcultas.includes(palabras[indiceAleatorio])) {
      palabrasOcultas.push(palabras[indiceAleatorio]);
    }
  } while (palabrasOcultas.length < numPalabrasOcultar);
  /*
  for (let i = 0; i < numPalabrasOcultar; i++) {
    indiceAleatorio = Math.floor(Math.random() * palabras.length);
    // Guardo la palabra a ocultar en el Array según el numero aleatorio (indice) que se haya generado
    // Bucle para que no puedan salir números repetidos
    while (!palabrasOcultas.includes(palabras[indiceAleatorio])) {
      palabrasOcultas.push(palabras[indiceAleatorio]);
    }
  }
  */
  let textoAdivinar = palabras.join(" "); // String que guardara el texto con las palabras ocultas
  // Bucle para reemplazar las palabras ocultas por "*" según cuantas letras tenga la palabra
  for (let i = 0; i < palabrasOcultas.length; i++) {
    textoAdivinar = textoAdivinar.replace(
      palabrasOcultas[i],
      "*".repeat(palabrasOcultas[i].length)
    );
  }

  let respuesta = prompt(
    `Intenta adivinar que palabras estan ocultas:\n${textoAdivinar}`
  );

  let aciertos = 0; // Creo una variable para guardar los aciertos que tenga
  for (let i = 0; i < numPalabrasOcultar; i++) {
    if (palabrasOcultas.includes(respuesta.split(" ")[i])) {
      aciertos++;
    }
  }

  // Necesitaba usar las comillas dobles, porque es un texto largo, y
  // los `backsticks` hacen cosas raras si escribo el código en varias lineas
  /* 
  alert(
    `El texto original es:\n${palabras.join(" ")}, has tenido ${aciertos} de ${
      palabrasOcultas.length
    }`
  );
  */
  alert(
    "El texto original es:\n" +
      palabras.join(" ") +
      "\n\nHas introducido las palabras:\n" +
      respuesta.split(", ") +
      "\n\nHas acertado " +
      aciertos +
      " de " +
      palabrasOcultas.length
  );
}
juego();
