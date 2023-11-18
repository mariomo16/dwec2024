/*

  Nombre del archivo: ocultarPalabrasV2.js
  Autor: Mario Morales Ortega (1745008)
  Fecha de creación: 10 de noviembre de 2023

  Descripción:
  Script para intentar adivinar palabras ocultas de una cadena de texto introducida por el usuario,
  a la vez que también indicara el número de palabras que quiere ocultar.

  Modificaciones:
  - 10/11/2023: Creación del script
  - 11/11/2023: Completado, revisado, y documentado el código
  - 12/11/2023: Cambiado <input id="numeroPalabrasOcultar"/> a tipo 'number'
  - 18/11/2023: Optimizaciones de código

  Observaciones:
  - Al comprobar los aciertos, distingue entre mayúsculas y minúsculas

*/

// Función para comprobar que datos ha introducido
function guardarDatos() {
    // Recojo el texto introducido para el juego
    let cadena = document.getElementById("texto").value;
    // Recojo el numero introducido para saber cuantas palabras ocultar
    let numeroPalabrasOcultar = parseInt(
        document.getElementById("numeroPalabrasOcultar").value
    );

    // En el caso de que no haya introducido ningún texto
    if (cadena == "") {
        // Muestro un mensaje en un <span/> creado después del <form/>
        document.getElementById("alerta").innerHTML =
            "<b>¡Debes introducir una texto para poder jugar!</b>";
        // Pongo un return para sacarle de la función, asi no hace falta un else
        return false;
    }
    // Separo las palabras del texto y las guardo dentro de palabras[]
    const palabras = cadena.split(" ");

    // En el caso de que no haya introducido un número de palabras a ocultar, o sea un número no valido
    if (
        !numeroPalabrasOcultar ||
        numeroPalabrasOcultar <= 0 ||
        numeroPalabrasOcultar > palabras.length
    ) {
        // Muestro un mensaje en un <span/> creado después del <form/>
        document.getElementById("alerta").innerHTML =
            "<b>¡Comprueba el número de palabras a ocultar que has introducido!</b>";
        // Pongo un return para sacarle de la función, asi no hace falta un else
        return false;
    }

    // Hago varios campos 'readonly' para que no se puedan modificar
    document
        .getElementById("numeroPalabrasOcultar")
        .setAttribute("readonly", "true");
    document.getElementById("texto").setAttribute("readonly", "true");
    // Vacío el <span/> por si acaso hay alguna alerta
    document.getElementById("alerta").innerHTML = "";

    ocultarPalabras(palabras, numeroPalabrasOcultar);
}

// Función para ocultar las palabras y mostrar el texto para adivinar
function ocultarPalabras(palabras, numeroPalabrasOcultar) {
    palabrasOcultas = [];
    // Bucle donde se generaran x indices aleatorios para elegir palabras,
    // el numero mas alto no sera mayor al numero de palabras introducidas
    do {
        let indiceAleatorio = Math.floor(Math.random() * palabras.length);
        while (!palabrasOcultas.includes(palabras[indiceAleatorio])) {
            palabrasOcultas.push(palabras[indiceAleatorio]);
        }
    } while (palabrasOcultas.length < numeroPalabrasOcultar);

    // Variable que guardara el texto con las palabras ocultas
    let textoAdivinar = palabras.join(" ");

    /*
    Bucle para cambiar las palabras de la variable textoAdivinar que estén dentro de palabrasOcultas[]
    Esas palabras las cambiara por tantas "*" como letras tenga la palabra
    */
    for (let i = 0; i < palabrasOcultas.length; i++) {
        textoAdivinar = textoAdivinar.replace(
            palabrasOcultas[i],
            "*".repeat(palabrasOcultas[i].length)
        );
    }
    // Escondo el cuadro de texto donde el usuario ha escrito, para que no pueda verlo
    document.getElementById("texto").setAttribute("hidden", "true");
    // Deshabilito el botón de ocultar las palabras
    document
        .getElementById("ocultarPalabrasBoton")
        .setAttribute("disabled", "true");
    // Muestro un cuadro de texto donde mostrare el texto con las palabras que debe intentar adivinar
    document.getElementById("textoAdivinar").removeAttribute("hidden");
    // Escribo dentro el texto para que pueda verlo
    document.getElementById("textoAdivinar").textContent = textoAdivinar;
    // Muestro un cuadro de texto para que el usuario pueda escribir las palabras ocultas
    document.getElementById("respuesta").removeAttribute("hidden");
    // Quito el atributo readonly para que el usuario pueda escribir una respuesta
    document.getElementById("respuesta").removeAttribute("readonly");
    // Esto lo uso para poder comprobar los aciertos mas tarde, guardo las palabras ocultas dentro de un cuadro de texto que nunca se mostrara al usuario
    document.getElementById("almacenPalabrasOcultar").value = palabrasOcultas;
    // Desbloqueo el botón para comprobar los aciertos
    document.getElementById("comprobarRespuesta").removeAttribute("disabled");
}

// Función para comprobar los aciertos
//! Si escribía comprobarRespuesta con una sola "a", daba error al intentar llamar la función
function comprobarRespuestaa(numeroPalabrasOcultar, palabrasOcultas, palabras) {
    // Recojo el texto que haya escrito el usuario como respuesta
    let respuesta = document.getElementById("respuesta").value;
    let aciertos = 0; // Contador de aciertos
    /*
    Aquí he cogido las palabras que estaban ocultas del cuadro de texto que he creado antes, y que esta invisible al usuario,
    como se han sacado de un Array, se han escrito separadas por ",", 
    asi que hago un split(",") para que la "," no cuente como otra palabra
    */
    palabrasOcultas = palabrasOcultas.split(",");
    // Bucle para comprobar si la palabra introducida es igual que la palabra oculta
    for (let i = 0; i < numeroPalabrasOcultar; i++) {
        if (palabrasOcultas.includes(respuesta.split(" ")[i])) {
            aciertos++;
        }
    }
    // Escondo el cuadro de texto donde ha escrito la respuesta
    document.getElementById("respuesta").setAttribute("hidden", "true");
    // Deshabilito el botón de comprobar respuesta
    document
        .getElementById("comprobarRespuesta")
        .setAttribute("disabled", "true");
    // Muestro el cuadro de texto con el resultado del juego
    document.getElementById("resultado").removeAttribute("hidden");
    document.getElementById("resultado").innerHTML =
        `El texto original es: ${palabras}\n` +
        `Has introducido las palabras: ${respuesta.split(", ")}\n` +
        `Has acertado: ${aciertos} de ${palabrasOcultas.length}`;
    // Habilito el botón para volver a empezar el juego
    document.getElementById("reset").removeAttribute("disabled");
}

// Función para reiniciar los campos e iniciar de nuevo
//! Por algún motivo, .reset() daba un error
function resetear() {
    let numeroPalabrasOcultar = document.getElementById(
        "numeroPalabrasOcultar"
    );
    // Reinicio el valor de "Número de palabras a ocultar"
    numeroPalabrasOcultar.value = "";
    // Y le quito el atributo readonly para que se pueda escribir
    numeroPalabrasOcultar.removeAttribute("readonly");

    // Habilito de nuevo el botón para ocultar las palabras
    document.getElementById("ocultarPalabrasBoton").removeAttribute("disabled");

    // Deshabilito el botón de volver a jugar
    document.getElementById("reset").setAttribute("disabled", "true");

    let texto = document.getElementById("texto");
    // Reinicio el valor del cuadro de texto donde se escribe el texto para jugar
    texto.value = "";
    // Lo muestro de nuevo
    texto.removeAttribute("hidden");
    // Y le quito el atributo readonly
    texto.removeAttribute("readonly");

    // Escondo el cuadro de texto donde aparece el texto con palabras ocultas
    document.getElementById("textoAdivinar").setAttribute("hidden", "true");

    let respuesta = document.getElementById("respuesta");
    // Escondo el cuadro de texto donde se escribe la respuesta del usuario
    respuesta.setAttribute("hidden", "true");
    // Reinicio su valor
    respuesta.value = "";

    // Escondo el cuadro de texto donde aparece el resultado del juego
    document.getElementById("resultado").setAttribute("hidden", "true");
}
