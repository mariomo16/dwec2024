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
    23 de noviembre de 2023
    ---------------------------------------
    Versión: 
    0.3.0
    ---------------------------------------
    Notas de la Versión: 
    - Optimización de código
    - Ahora cada enemigo tiene su propia coordenada (BUG?)
    - Ahora cada misil tiene su propia coordenada y se mueve hacia arriba (al tocar el limite, se borran del DOM)
    - Ahora la nave no se podrá mover, ni se podrá lanzar misiles antes de empezar la partida

    TODOs:
    *- Hacer que los misiles aparezcan un poco mas arriba de la nave, y CENTRADOS
    *- Comprobar colisiones (y misiles?)
    - Si borras el nombre después de haberlo introducido, que se vuelva a deshabilitar el botón

    !Avisos:
    - Al pulsar EXTREMADAMENTE rápido A y D, la nave solamente se mueve hacia la derecha (No ocurre con las flechas)
      ?Al ser la A (izquierda) el ultimo 'if', si pulsas rápido, no llega a hacer esa comprobación
    - Los enemigos tienen movimientos raros
      *Problema?: En el bucle, controlY y controlX se quedan guardados del anterior enemigo, lo que interfiere con los movimientos de los demás
    !- Al lanzar 1 solo misil, si estabas en movimiento, la nave se quedara quieta hasta que pulses otro botón 
      (Solo te moverá mientras sigas pulsando ese mismo botón)
    
    Fuentes:
    - Obtener el viewport del cliente para poner limite al body y que las naves no se salgan de la pantalla
        https://stackoverflow.com/questions/16776764/move-div-with-javascript-inside-bodys-limits

    - Para poder mover la nave del jugador en diagonal
        https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript
    
    - Para obtener los códigos de cada tecla necesaria
        https://www.toptal.com/developers/keycode

    copia = hasta disparar misiles que se mueven sin problema
    copia2= los misiles que llegan arriba del todo se borran

*/

// ---------- Variables necesarias ---------- //

// Para crear la ventana modal y el formulario que estará dentro de esta
let ventanaModal = document.createElement("dialog");
let formulario = document.createElement("form");

// Opciones del jugador
let nombreJugador;
let dificultad;

// Comprobar el tamaño de la ventana del usuario
let viewportWidth = document.body.clientWidth; // Anchura del cliente
let viewportHeight = document.body.clientHeight; // Altura del cliente

// Ajustes de la nave del jugador
let naveJugador = document.getElementById("naveJugador"); // Puntero a la imagen de la nave
let coordenadaX; // Ajuste horizontal
let coordenadaY; // Ajuste vertical
let velocidadJugador = 30; // Pixeles que se moverá la nave

const teclasPulsadas = new Map(); // Mapa donde se guardaran las teclas pulsadas para el movimiento

// Ajustes de los misiles
let crearMisil; // Variable para crear elemento img para los misiles (¿se puede hacer 1 variable para todas las img?)
let misiles; // Variable para guardar el NodeList de los misiles
let velocidadMisiles = 10; // Velocidad del misil
const coordenadasMisiles = []; // Array para guardar las coordenadas de los misiles

// Ajustes de las naves enemigas
let lienzo = document.getElementById("lienzo"); // div donde se generaran los enemigos
let crearEnemigo;
let navesEnemigas = document.getElementsByClassName("naveEnemiga");
const coordenadasEnemigos = []; // Array para almacenar las coordenadas de los enemigos

// Variables que usa la función encargada de mover los enemigos
let controlY = 1;
let controlX = 1;
let velocidadEnemigos = 7; // velocidad a la que se mueven los enemigos

// Intervals usados
let comprobarPantalla; // Interval para comprobar Width/Height del usuario cada .2 seg
let intervaloMover; // Interval para mover enemigos y misiles cada .2 seg

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

// Pongo la ventana modal en el body del HTML
document.body.appendChild(ventanaModal);
// Pongo el formulario dentro de la ventana modal
ventanaModal.appendChild(formulario);

// Evento para deshabilitar el enter
// Al pulsar enter mientras el formulario estaba activo, parecía que recargaba la página
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
    }
});
// Puntero al input donde se introduce el nombre del jugador
nombreJugador = document.getElementById("nombre");
// Focus para que pueda escribir sin necesidad de pulsar el cuadro de texto al cargar la página
nombreJugador.focus();

// Evento para comprobar si se ha introducido o no un nombre, y asi desbloquear el botón para empezar el juego
nombreJugador.addEventListener("change", () => {
    // Si no se ha introducido nada deshabilito el botón
    if (!nombreJugador) {
        document.getElementById("startGame").setAttribute("disabled", "true");
    } else {
        // Si el usuario ha escrito un nombre (u otra cosa) habilito el botón
        document.getElementById("startGame").removeAttribute("disabled");
    }
});
// Creo un evento al pulsar sobre el botón 'Empezar partida'
document.getElementById("startGame").addEventListener("click", (e) => {
    // Elimino el evento creado en el cuadro de texto del nombre de jugador
    nombreJugador.removeEventListener;
    // Obtengo el valor del radio "dificultad", para saber cuantos enemigos crear
    dificultad = document.querySelector(
        'input[name="dificultad"]:checked'
    ).value;
    // Según la dificultad seleccionada, creo X numero de enemigos
    let numeroEnemigos;
    if (dificultad == "easy") {
        numeroEnemigos = 5;
    }
    if (dificultad == "normal") {
        numeroEnemigos = 7;
    }
    if (dificultad == "hard") {
        numeroEnemigos = 10;
    }
    // Elimino el evento del botón
    document.getElementById("startGame").removeEventListener;
    // Elimino el evento creado para prevenir la recarga de página con el 'Enter'
    document.removeEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    });
    // Elimino la ventana modal
    ventanaModal.remove();
    // Bucle para crear las naves enemigas
    for (let i = 0; i < numeroEnemigos; i++) {
        // Timeout para que no se creen todos a la vez, ya que es posible que se solapen
        setTimeout(() => {
            crearEnemigo = document.createElement("img");
            crearEnemigo.setAttribute("class", "naveEnemiga");
            crearEnemigo.setAttribute("src", "./images/naves/enemigo.png");
            document.getElementById("lienzo").appendChild(crearEnemigo);
            // Dentro del array creado al principio, añado un objeto con las propiedades 'X' e Y'
            // para que cada enemigo tenga coordenadas independientes
            coordenadasEnemigos.push({ x: 0, y: 0 });
        }, 400 * i);
    }
    // Evento para mover la nave del jugador, con W-A-S-D o con las flechas
    document.addEventListener("keydown", (e) => {
        // Compruebo si la tecla pulsada esta dentro de 'teclasPulsadas', si no es asi, lo añado
        //! keyCode esta deprecado, pero no veo otra manera de hacerlo
        if (!teclasPulsadas.has(e.keyCode)) {
            teclasPulsadas.set(e.keyCode, e.key);
        }
        /*
        Cada 'if' comprueba si la nueva posición choca con el borde, si es asi, dejaría el valor en 0 (para dejarlo en el borde)
        o en el caso de que sea derecha/abajo, dejaría el valor en el Height/Width de la ventana
        */
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
                viewportWidth - naveJugador.offsetWidth,
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
            coordenadaX = Math.max(0, coordenadaX - velocidadJugador);
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
            coordenadaX = Math.min(
                viewportWidth - naveJugador.offsetWidth,
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
            coordenadaX = Math.max(0, coordenadaX - velocidadJugador);
            naveJugador.style.left = coordenadaX + "px";
        } else if (teclasPulsadas.has(83) || teclasPulsadas.has(40)) {
            // MOVER ABAJO (S || ArrowDown)
            coordenadaY = naveJugador.offsetTop;
            coordenadaY = Math.min(
                viewportHeight - naveJugador.offsetHeight,
                coordenadaY + velocidadJugador
            );
            naveJugador.style.top = coordenadaY + "px";
        } else if (teclasPulsadas.has(68) || teclasPulsadas.has(39)) {
            // MOVER DERECHA (D || ArrowRight)
            coordenadaX = naveJugador.offsetLeft;
            coordenadaX = Math.min(
                viewportWidth - naveJugador.offsetWidth,
                coordenadaX + velocidadJugador
            );
            naveJugador.style.left = coordenadaX + "px";
        } else if (teclasPulsadas.has(65) || teclasPulsadas.has(37)) {
            // MOVER IZQUIERDA (A || ArrowLeft)
            coordenadaX = naveJugador.offsetLeft;
            coordenadaX = Math.max(0, coordenadaX - velocidadJugador);
            naveJugador.style.left = coordenadaX + "px";
        }
        // CREAR MISILES (Espacio)
        if (teclasPulsadas.has(32)) {
            crearMisil = document.createElement("img");
            crearMisil.setAttribute("class", "misiles");
            crearMisil.setAttribute("src", "./images/Lasers/laserRed07.png");
            document.body.appendChild(crearMisil);
            // Estas 3 lineas son mi orgullo, se me ocurrieron porque aun me quedaban 5 neuronas vivas
            crearMisil.style.top = naveJugador.offsetTop + "px";
            crearMisil.style.left = naveJugador.offsetLeft + "px";
            /*
            Dentro del array creado al principio, añado un objeto con la propiedad 'Y'
            (que sera la única necesaria aquí), para que cada misil tenga coordenadas independientes
            y le asigno como 'coordenada Y' por defecto que sea la parte superior de la nave del jugador y se empiece a mover desde ahí
            */
            coordenadasMisiles.push({ y: parseInt(crearMisil.style.top) });
        }
    });

    // Eliminar tecla del mapa 'teclasPulsadas' al dejar de pulsarla
    document.addEventListener("keyup", (e) => {
        //! keyCode esta deprecado
        teclasPulsadas.delete(e.keyCode);
    });
});

// Cada 2 mili-segundos se va a ejecutar una función que reasignara el valor del Width/Height del usuario
/*
En el caso de que el script se ejecute con la consola de desarrollador abierta (por ejemplo), 
si no vuelvo a asignar los valores, el viewportHeight (en caso de tener la consola abajo/arriba), 
sera el espacio entre la consola y la parte superior (o inferior) del documento, y aunque se cierre la consola
el tamaño seguirá siendo el que había con la consola abierta y la nave no podrá bajar de ahí
*/
comprobarPantalla = setInterval(() => {
    viewportWidth = document.body.clientWidth;
    viewportHeight = document.body.clientHeight;
}, 2);

//la función que moverá todos los enemigos y misiles existentes
function mover() {
    // MOVER LOS ENEMIGOS
    // Bucle para comprobar la posición de los enemigos y ver si chocan (o no) con el borde
    for (let i = 0; i < navesEnemigas.length; i++) {
        //Eje de las X
        if (controlX == 1) {
            coordenadasEnemigos[i].x += velocidadEnemigos;
        } else {
            coordenadasEnemigos[i].x -= velocidadEnemigos;
        }
        if (coordenadasEnemigos[i].x <= 0) {
            controlX = 1;
            coordenadasEnemigos[i].x = 0;
        } else if (coordenadasEnemigos[i].x >= lienzo.offsetWidth - 120) {
            // Esto significa que si es mayor o igual a el ancho que tiene el lienzo menos el tamaño de la imagen se le da un nuevo valor a x
            controlX = 0;
            coordenadasEnemigos[i].x = lienzo.offsetWidth - 120;
        }
        //Eje de las Y
        if (controlY == 1) {
            coordenadasEnemigos[i].y += velocidadEnemigos;
        } else {
            coordenadasEnemigos[i].y -= velocidadEnemigos;
        }
        if (coordenadasEnemigos[i].y <= 0) {
            controlY = 1;
            coordenadasEnemigos[i].y = 0;
        } else if (coordenadasEnemigos[i].y >= lienzo.offsetHeight - 120) {
            // Esto significa que si es mayor o igual a la altura que tiene el lienzo menos el tamaño de la imagen se le dará un nuevo valor a y
            controlY = 0;
            coordenadasEnemigos[i].y = lienzo.offsetHeight - 120;
        }

        // Asigno nuevas coordenadas a los enemigos
        navesEnemigas[i].style.left = String(coordenadasEnemigos[i].x) + "px";
        navesEnemigas[i].style.top = String(coordenadasEnemigos[i].y) + "px";
    }
    // MOVER LOS MISILES
    misiles = document.getElementsByClassName("misiles");
    // Bucle que comprobara la 'coordenada Y' de los misiles existentes y los moverá o eliminara
    for (let i = 0; i < misiles.length; i++) {
        // Le doy una nueva coordenada al misil
        coordenadasMisiles[i].y -= velocidadMisiles;
        // Compruebo si el misil toca el borde superior, en caso de que si, borro el misil del DOM, y su objeto del Array
        if (coordenadasMisiles[i].y <= 0) {
            misiles[i].remove();
            coordenadasMisiles.splice([i], 1);
        }
        // Si no se ha borrado, muevo el misil a la nueva coordenada
        misiles[i].style.top = String(coordenadasMisiles[i].y) + "px";
    }
}
// Cada 2 mili-segundos se va a ejecutar la función para mover a los enemigos y misiles
intervaloMover = setInterval(mover, 2);
