/*

    Nombre del archivo: main.js
    Autor: Mario Morales Ortega (1745008)
    Fecha de creación: 20 de noviembre de 2023

    Fuente:
    - Obtener el viewport del cliente para poner limite al body y que las naves no se salgan de la pantalla
        https://stackoverflow.com/questions/16776764/move-div-with-javascript-inside-bodys-limits
        https://jsfiddle.net/pas9y/
    - Para poder modificar el CSS sin que se me reinicie la posición de la nave
        https://developer.mozilla.org/es/docs/Web/API/Window/getComputedStyle
    - Colisiones
        https://developer.mozilla.org/es/docs/Games/Techniques/2D_collision_detection
        https://jsfiddle.net/jlr7245/217jrozd/3/

        https://www.toptal.com/developers/keycode
*/

// Variables necesarias
let dificultad;

let viewportWidth = document.body.clientWidth;
let viewportHeight = document.body.clientHeight;

let lienzo = document.getElementById("lienzo");

// Creo y muestro la ventana modal con un texto y el formulario
let ventanaModal = document.createElement("dialog");
ventanaModal.setAttribute("open", "true");
ventanaModal.innerHTML = `
    <h1>Juego Marcianos</h1>
    <p>
        ¡Elimina a todos los enemigos
        <span class="sub">en el menor tiempo posible</span>!
    </p>`;

let formulario = document.createElement("form");
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

let nombreJugador = document.getElementById("nombre");
// Evento para comprobar si se ha introducido o no un nombre, y asi desbloquear el boton para empezar
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
    // Quito la ventana modal y el evento del boton
    document.getElementById("startGame").removeEventListener;
    ventanaModal.remove();
    for (let i = 0; i < numeroEnemigos; i++) {
        let crearEnemigo;
        setTimeout(() => {
            crearEnemigo = document.createElement("img");
            crearEnemigo.setAttribute("class", "naveEnemiga");
            crearEnemigo.setAttribute("src", "./images/ufoRed.png");
            document.getElementById("lienzo").appendChild(crearEnemigo);
        }, 900 * i);
    }
});

let naveJugador = document.getElementById("naveJugador"); // Puntero a la imagen de la nave
let coordenadaX; // Ajuste horizontal
let coordenadaY; // Ajuste vertical
let velocidadJugador = 20; // Pixeles que se moverá la nave

document.addEventListener("keydown", (e) => {
    if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
        coordenadaY = naveJugador.offsetTop;
        coordenadaY = Math.max(0, coordenadaY - velocidadJugador);
        naveJugador.style.top = coordenadaY + "px";
    }
    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        coordenadaX = naveJugador.offsetLeft;
        coordenadaX = Math.max(0, coordenadaX - velocidadJugador);
        naveJugador.style.left = coordenadaX + "px";
    }
    if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
        coordenadaY = naveJugador.offsetTop;
        coordenadaY = Math.min(viewportHeight - naveJugador.offsetHeight, coordenadaY + velocidadJugador);
        naveJugador.style.top = coordenadaY + "px";
    }
    if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        coordenadaX = naveJugador.offsetLeft;
        coordenadaX = Math.min(viewportWidth - naveJugador.offsetWidth, coordenadaX + velocidadJugador);
        naveJugador.style.left = coordenadaX + "px";
    }
});

/*
document.addEventListener("keydown", (e) => {
    /*
    Antes de asignar las nuevas "coordenadas", las compruebo para que no se salgan de la pantalla
    Garantiza que coordenadaX/Y no sea menor que 0 ni mayor que bodyWidth/Height - naveJugador.width/height

    Si coordenadaX/Y es menor que 0, se establecerá en 0.
    Si coordenadaX/Y es mayor que bodyWidth/Height - nave.width/height, se establecerá en bodyWidth/Height - nave.width/height




    if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
        coordenadaY = parseInt(getComputedStyle(naveJugador).bottom); // Obtengo el style.bottom de naveJugador
        coordenadaY = Math.max(
            0,
            Math.min(coordenadaY, viewportHeight - naveJugador.height)
        );
        // Le asigno la nueva "coordenada" Y
        naveJugador.style.bottom = coordenadaY + velocidadJugador + "px";
    }
    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        coordenadaX = parseInt(getComputedStyle(naveJugador).left); // Obtengo el style.left de naveJugador
        coordenadaX = Math.max(
            0,
            Math.min(coordenadaX, viewportWidth - naveJugador.width)
        );
        // Le asigno la nueva "coordenada" X
        naveJugador.style.left = coordenadaX - velocidadJugador + "px";
    }
    if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
        coordenadaY = parseInt(getComputedStyle(naveJugador).bottom); // Obtengo el style.bottom de naveJugador
        coordenadaY = Math.max(
            0,
            Math.min(coordenadaY, viewportHeight - naveJugador.height)
        );
        // Le asigno la nueva "coordenada" Y
        naveJugador.style.bottom = coordenadaY - velocidadJugador + "px";
    }
    if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        coordenadaX = parseInt(getComputedStyle(naveJugador).left); // Obtengo el style.left de naveJugador
        coordenadaX = Math.max(
            0,
            Math.min(coordenadaX, viewportWidth - naveJugador.width)
        );
        // Le asigno la nueva "coordenada" X
        naveJugador.style.left = coordenadaX + velocidadJugador + "px";
    }
});
*/

// coordenadaY = parseInt(getComputedStyle(naveJugador).bottom);

/*
meter los enemigos con sus coordenadas en arrays y hacer que se muevan


function obtenerCoordenadasDesdeEstilo(elemento) {
  let estilo = window.getComputedStyle(elemento);
  let left = parseInt(estilo.left) || 0;
  let top = parseInt(estilo.bottom) || 0;
  return { x: left, y: top };
}

var coordenadas = [];

// Establecer las coordenadas mediante style.left y style.top para la primera imagen
img1.style.position = "absolute";  
img1.style.left = "100px";
img1.style.top = "50px";
coordenadas.push(obtenerCoordenadasDesdeEstilo(img1));

// Establecer las coordenadas mediante style.left y style.top para la segunda imagen
img2.style.position = "absolute";  
img2.style.left = "200px";
img2.style.top = "100px";
coordenadas.push(obtenerCoordenadasDesdeEstilo(img2));

// Mostrar las coordenadas en la consola
console.log(coordenadas);
*/

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

    /*
    //movemos la imagen en el eje x e y asignando un valor en px
    document.getElementById("imagen").style.left=String(x)+"px";
    document.getElementById("imagen").style.top=String(y)+"px";
    */
    // Bucle para mover las naves enemiga
    let navesEnemigas = document.getElementsByClassName("naveEnemiga");
    for (let i = 0; i < navesEnemigas.length; i++) {
        navesEnemigas[i].style.left = String(x) + "px";
        navesEnemigas[i].style.top = String(y) + "px";
    }
}

// Funciones para poner/quitar pantalla completa
function fullscreen() {
    if (
        document.fullScreenElement !== null || // método alternativo
        (!document.mozFullScreen && !document.webkitIsFullScreen)
    ) {
        // métodos actuales
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        }
        if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        }
        if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(
                Element.ALLOW_KEYBOARD_INPUT
            );
        }
    }
}

function exitFullscreen() {
    if (document.cancelFullScreen) {
        document.cancelFullScreen();
    }
    if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
}

/*     ----------COMENTARIOS IMPORTANTES ----------     */

// Comprobar el tamaño de la pantalla del usuario, en el caso de que el otro no funcione en algún navegador
/*
let viewportWidth;
let viewportHeight;

// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight

if (typeof window.innerWidth != "undefined") {
    (viewportWidth = window.innerWidth), (viewportHeight = window.innerHeight);
}

// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
else if (
    typeof document.documentElement != "undefined" &&
    typeof document.documentElement.clientWidth != "undefined" &&
    document.documentElement.clientWidth != 0
) {
    (viewportWidth = document.documentElement.clientWidth),
        (viewportHeight = document.documentElement.clientHeight);
}

// older versions of IE
else {
    (viewportWidth = document.getElementsByTagName("body")[0].clientWidth),
        (viewportHeight =
            document.getElementsByTagName("body")[0].clientHeight);
}
*/

/*     -----------------------------------------------------------------     */

// Mover la imagen de la nave
/*
// Objeto que guardara las "coordenadas" X e Y de la nave
let currentPosition = { x: 0, y: 0 };
let moveAmount = 10; // Pixeles que se moverá la nave

// Evento para mover la nave con las flechas y WASD
window.addEventListener("keydown", (ev) => {
    switch (ev.key) {
        case "ArrowUp":
            currentPosition.y -= moveAmount;
            break;
        case "ArrowDown":
            currentPosition.y += moveAmount;
            break;
        case "ArrowLeft":
            currentPosition.x -= moveAmount;
            break;
        case "ArrowRight":
            currentPosition.x += moveAmount;
            break;
        case "w":
            currentPosition.y -= moveAmount;
            break;
        case "a":
            currentPosition.x -= moveAmount;
            break;
        case "s":
            currentPosition.y += moveAmount;
            break;
        case "d":
            currentPosition.x += moveAmount;
            break;
    }

    naveJugador.style.left = currentPosition.x + "px";
    naveJugador.style.top = currentPosition.y + "px";
});
*/

/*
function comprobarColision(
    naveJugador,
    coordenadaX,
    coordenadaY,
    navesEnemigas,
    x,
    y
) {
    for (let i = 0; i < navesEnemigas.length; i++) {
        if (
            coordenadaX < x + navesEnemigas[i].width &&
            coordenadaX + naveJugador.width > x &&
            coordenadaY < y + navesEnemigas[i].height &&
            naveJugador.height + coordenadaY > y
        ) {
            return true;
        }
        return false;
    }
}
*/
