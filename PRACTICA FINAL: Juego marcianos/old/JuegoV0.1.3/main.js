/*

    Nombre del Script: main.js
    ---------------------------------------
    Descripción: 
    Juego web.
    ---------------------------------------
    Autor: 
    Mario Morales Ortega (1745008)
    ---------------------------------------
    Fecha de Creación: 
    20 de noviembre de 2023
    ---------------------------------------
    Última Modificación: 
    22 de noviembre de 2023
    ---------------------------------------
    Versión: 
    0.1.2
    ---------------------------------------
    Notas de la Versión: 
    - Al mover la nave ahora comprueba los margenes de la pantalla para no salirse
      - Corregido error que hacia que los margenes no fueran correctos
      - Corregido error que hacia que los margenes laterales no fueran correctos
      - Corregido un error con los margenes si se ejecuta con la consola de desarrollador abierta

    Fuentes:
    - Obtener el viewport del cliente para poner limite al body y que las naves no se salgan de la pantalla
        https://stackoverflow.com/questions/16776764/move-div-with-javascript-inside-bodys-limits

    - Para poder mover la nave del jugador en diagonal
        https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript
    
    - Para obtener los códigos de cada tecla necesaria
        https://www.toptal.com/developers/keycode

*/

// Variables necesarias
let ventanaModal = document.createElement("dialog");
let formulario = document.createElement("form");

let nombreJugador;
let dificultad;

let viewportWidth = document.body.clientWidth; // Anchura del cliente
let viewportHeight = document.body.clientHeight; // Altura del cliente

let naveJugador = document.getElementById("naveJugador"); // Puntero a la imagen de la nave
let coordenadaX; // Ajuste horizontal
let coordenadaY; // Ajuste vertical
let velocidadJugador = 30; // Pixeles que se moverá la nave
const teclasPulsadas = new Map(); // Mapa donde se guardaran las teclas pulsadas para el movimiento

let lienzo = document.getElementById("lienzo"); // div donde se generaran los enemigos

// Creo y muestro la ventana modal con un texto y el formulario
ventanaModal.setAttribute("open", "true");
ventanaModal.innerHTML = `
    <h1>Juego Marcianos</h1>
    <p>
        ¡Elimina a todos los enemigos
        <span class="sub">en el menor tiempo posible</span>!
    </p>`;

formulario.innerHTML = `
    <label for="nombre">Nombre de jugador</label><br />
    <input type="text" id="nombre" placeholder="Introduce un nombre"/>
    <br />
    <label for="dificultad" class="su">Dificultad:</label>
    <input type="radio" name="dificultad" value="easy" /><label for="" id="easy">Fácil</label>
    <input type="radio" name="dificultad" value="normal" checked /><label for="" id="normal">Normal</label>
    <input type="radio" name="dificultad" value="hard" /><label for="" id="hard">Dificil</label>
    <br />
    <label for="guardarPuntuacion">Guardar puntuación</label>
    <input type="checkbox" id="guardarPuntuacion" checked />
    <br />
    <input type="button" id="startGame" value="Empezar partida" disabled />`;

document.body.appendChild(ventanaModal);
ventanaModal.appendChild(formulario);

nombreJugador = document.getElementById("nombre");
// Evento para comprobar si se ha introducido o no un nombre, y asi desbloquear el botón para empezar (crear los enemigos)
nombreJugador.addEventListener("change", (e) => {
    if (nombreJugador == "") {
        document.getElementById("startGame").setAttribute("disabled", "true");
    } else {
        document.getElementById("startGame").removeAttribute("disabled");
    }
});
document.getElementById("startGame").addEventListener("click", (e) => {
    // Obtengo el valor del radio "dificultad"
    dificultad = document.querySelector(
        'input[name="dificultad"]:checked'
    ).value;
    // Según la dificultad seleccionada, creo X numero de enemigos
    let numeroEnemigos;
    if (dificultad == "easy") {
        numeroEnemigos = 3;
    }
    if (dificultad == "normal") {
        numeroEnemigos = 8;
    }
    if (dificultad == "hard") {
        numeroEnemigos = 12;
    }
    // Quito la ventana modal y el evento del botón
    document.getElementById("startGame").removeEventListener;
    ventanaModal.remove();
    for (let i = 0; i < numeroEnemigos; i++) {
        let crearEnemigo;
        setTimeout(() => {
            crearEnemigo = document.createElement("img");
            crearEnemigo.setAttribute("class", "naveEnemiga");
            crearEnemigo.setAttribute("src", "./images/Naves/enemigo.png");
            document.getElementById("lienzo").appendChild(crearEnemigo);
        }, 900 * i);
    }
});

// EVENTO PARA MOVER LA NAVE DEL JUGADOR
document.addEventListener("keydown", (e) => {
    // Compruebo si la tecla pulsada esta dentro de 'teclasPulsadas', si no es asi, lo añado
    if (!teclasPulsadas.has(e.keyCode)) {
        teclasPulsadas.set(e.keyCode, e.key); // keyCode esta deprecado
    }

    if (
        // MOVER ARRIBA DERECHA (W || ArrowUp) & (D || ArrowRight)
        (teclasPulsadas.has(87) || teclasPulsadas.has(38)) &&
        (teclasPulsadas.has(68) || teclasPulsadas.has(39))
    ) {
        coordenadaY = naveJugador.offsetTop;
        coordenadaY = Math.max(0, coordenadaY - velocidadJugador);
        naveJugador.style.top = coordenadaY + "px";

        coordenadaX = naveJugador.offsetLeft;
        coordenadaX = Math.min(
            viewportWidth - naveJugador.offsetWidth / 2,
            coordenadaX + velocidadJugador
        );
        naveJugador.style.left = coordenadaX + "px";
    } else if (
        // MOVER ARRIBA IZQUIERDA (W || ArrowUp) & (A || ArrowLeft)
        (teclasPulsadas.has(87) || teclasPulsadas.has(38)) &&
        (teclasPulsadas.has(65) || teclasPulsadas.has(37))
    ) {
        coordenadaY = naveJugador.offsetTop;
        coordenadaY = Math.max(0, coordenadaY - velocidadJugador);
        naveJugador.style.top = coordenadaY + "px";

        coordenadaX = naveJugador.offsetLeft;
        // En este caso le pongo naveJugador.offsetWidth/2 porque se comía media nave al poner 0
        coordenadaX = Math.max(
            naveJugador.offsetWidth / 2,
            coordenadaX - velocidadJugador
        );
        naveJugador.style.left = coordenadaX + "px";
    } else if (teclasPulsadas.has(87) || teclasPulsadas.has(38)) {
        // MOVER ARRIBA (W || ArrowUp)
        coordenadaY = naveJugador.offsetTop;
        coordenadaY = Math.max(0, coordenadaY - velocidadJugador);
        naveJugador.style.top = coordenadaY + "px";
    } else if (
        // MOVER ABAJO DERECHA (S || ArrowDown) & (D || ArrowRight)
        (teclasPulsadas.has(83) || teclasPulsadas.has(40)) &&
        (teclasPulsadas.has(68) || teclasPulsadas.has(39))
    ) {
        coordenadaY = naveJugador.offsetTop;
        coordenadaY = Math.min(
            viewportHeight - naveJugador.offsetHeight,
            coordenadaY + velocidadJugador
        );
        naveJugador.style.top = coordenadaY + "px";

        coordenadaX = naveJugador.offsetLeft;
        // En este caso le pongo naveJugador.offsetWidth/2 porque la nave se paraba antes de tocar el borde,
        // concretamente se paraba el 50% del width de la nave antes
        coordenadaX = Math.min(
            viewportWidth - naveJugador.offsetWidth / 2,
            coordenadaX + velocidadJugador
        );
        naveJugador.style.left = coordenadaX + "px";
    } else if (
        // MOVER ABAJO IZQUIERDA (S || ArrowDown) & (A || ArrowLeft)
        (teclasPulsadas.has(83) || teclasPulsadas.has(40)) &&
        (teclasPulsadas.has(65) || teclasPulsadas.has(37))
    ) {
        coordenadaY = naveJugador.offsetTop;
        coordenadaY = Math.min(
            viewportHeight - naveJugador.offsetHeight,
            coordenadaY + velocidadJugador
        );
        naveJugador.style.top = coordenadaY + "px";

        coordenadaX = naveJugador.offsetLeft;
        // En este caso le pongo naveJugador.offsetWidth/2 porque se comía media nave al poner 0
        coordenadaX = Math.max(
            naveJugador.offsetWidth / 2,
            coordenadaX - velocidadJugador
        );
        naveJugador.style.left = coordenadaX + "px";
    } else if (teclasPulsadas.has(83) || teclasPulsadas.has(40)) {
        coordenadaY = naveJugador.offsetTop;
        coordenadaY = Math.min(
            viewportHeight - naveJugador.offsetHeight,
            coordenadaY + velocidadJugador
        );
        naveJugador.style.top = coordenadaY + "px";
    } else if (teclasPulsadas.has(68) || teclasPulsadas.has(39)) {
        // MOVER DERECHA (D || ArrowRight)
        coordenadaX = naveJugador.offsetLeft;
        // En este caso le pongo naveJugador.offsetWidth/2 porque la nave se paraba antes de tocar el borde,
        // concretamente se paraba el 50% del width de la nave antes
        coordenadaX = Math.min(
            viewportWidth - naveJugador.offsetWidth / 2,
            coordenadaX + velocidadJugador
        );
        naveJugador.style.left = coordenadaX + "px";
    } else if (teclasPulsadas.has(65) || teclasPulsadas.has(37)) {
        // MOVER IZQUIERDA (A || ArrowLeft)
        coordenadaX = naveJugador.offsetLeft;
        // En este caso le pongo naveJugador.offsetWidth/2 porque se comía media nave al poner 0
        coordenadaX = Math.max(
            naveJugador.offsetWidth / 2,
            coordenadaX - velocidadJugador
        );
        naveJugador.style.left = coordenadaX + "px";
    }
});
// Eliminar tecla del mapa 'teclasPulsadas' al dejar de pulsarla
document.addEventListener("keyup", (e) => {
    teclasPulsadas.delete(e.keyCode);
});

/*
Esta función reasignara la variable cada vez que la nave se mueva.
En el caso de que se abra la consola de desarrollador al empezar, si no vuelvo a asignar los valores,
el viewportHeight (en caso de tener la consola abajo), 
sera el espacio entre la consola y la parte superior del document, y aunque se esconda de nuevo
el tamaño seguirá siendo el que había con la consola abierta
*/
function comprobarPantalla() {
    viewportWidth = document.body.clientWidth;
    viewportHeight = document.body.clientHeight;
}
setInterval(comprobarPantalla, 2);

//Definimos e iniciamos las variables necesarias
var y = 0; // coordenada y inicial enemigos
var x = 0; // coordenada x inicial enemigos
var controlY = 1;
var controlX = 1;
var velocidadEnemigos = 10; // velocidad a la q se mueven los enemigos

// Cada 5 mili-segundos se va a ejecutar la función mover que comprueba
// las colisiones de la pelota
let intervalo = setInterval("mover()", 2);

//la función mover, que hace el idem con el objeto
function mover() {
    //Eje de las X
    if (controlX == 1) {
        x += velocidadEnemigos;
    } else {
        x -= velocidadEnemigos;
    }
    if (x <= 0) {
        controlX = 1;
        x = 0;
    } else if (x >= lienzo.offsetWidth - 120) {
        // Esto significa que si es mayor o igual a el ancho que tiene el lienzo menos el tamaño de la imagen se le da un nuevo valor a x
        controlX = 0;
        x = lienzo.offsetWidth - 120;
    }

    //Eje de las Y
    if (controlY == 1) {
        y += velocidadEnemigos;
    } else {
        y -= velocidadEnemigos;
    }
    if (y <= 0) {
        controlY = 1;
        y = 0;
    } else if (y >= lienzo.offsetHeight - 120) {
        // Esto significa que si es mayor o igual a la altura que tiene el lienzo menos el tamaño de la imagen se le dará un nuevo valor a y
        controlY = 0;
        y = lienzo.offsetHeight - 120;
    }

    // Bucle para mover las naves enemiga
    let navesEnemigas = document.getElementsByClassName("naveEnemiga");
    for (let i = 0; i < navesEnemigas.length; i++) {
        navesEnemigas[i].style.left = String(x) + "px";
        navesEnemigas[i].style.top = String(y) + "px";
    }
}
