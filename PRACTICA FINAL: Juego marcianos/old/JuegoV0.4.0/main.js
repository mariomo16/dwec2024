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
    24 de noviembre de 2023
    ---------------------------------------
    Versión: 
    0.4.0
    ---------------------------------------
    Notas de la Versión: 
    - Optimizaciones de código:
        - Sustituido variables crearMisil/crearEnemigo por crearElementoIMG
        - Sustituido variables viewportWidth/viewportHeight, ahora se lee directamente el valor de document.body.clientWidth/document.body.clientHeight
            Esto hace que no sea necesario que el interval que reasignaba su valor se ejecute constantemente cada 0.2seg
        - Sustituido métodos evento.keyCode (deprecado) por evento.key
    - Los enemigos ya no comparten las variables controlX/Y, y ahora tienen movimientos COMPLETAMENTE independientes.
        Para que no tengan el mismo recorrido durante toda la duración del juego, al crear cada enemigo, se le asigna una velocidad entre 6 y 10
    * Ahora se detectan las colisiones entre el jugador y cualquier enemigo
        !Si el jugador no se mueve hacia abajo/arriba al menos 1 vez, no se detectara su colisión en ningún momento.
    - Al colisionar con un enemigo, se terminara la partida (Se eliminaran los eventos, y se mostrara una ventana con información)
    - Los misiles se eliminaran al desaparecer de la pantalla, en vez de al tocar el borde superior
    
    !Avisos:
    - Al pulsar EXTREMADAMENTE rápido A y D, la nave solamente se mueve hacia la derecha (No ocurre con las flechas)
        Al ser la A (izquierda) el ultimo 'if', si pulsas rápido, no llega a hacer esa comprobación
    - Aunque los enemigos tengan distinta velocidad, tarda un poco en variar su recorrido
    - Al lanzar 1 solo misil, si estabas en movimiento, la nave se quedara quieta hasta que pulses otro botón 
        (Solo te moverá mientras sigas pulsando ese mismo botón)
    
    Fuentes:
    - Obtener el viewport del cliente para poner limite al body y que las naves no se salgan de la pantalla
        https://stackoverflow.com/questions/16776764/move-div-with-javascript-inside-bodys-limits

    - Para poder mover la nave del jugador en diagonal
        https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript
    
    - Para obtener los códigos de cada tecla necesaria
        https://www.toptal.com/developers/keycode

    - Por algún motivo, la función de colisiones de MDN no me funcionaba, encontré un video con exactamente la misma función explicándola y me funciono
        https://www.youtube.com/watch?v=r0sy-Cr6WHY&t

*/

// ---------- Variables necesarias ---------- //

// Para crear la ventana modal y el formulario que estará dentro de esta
let ventanaModal = document.createElement("dialog");
let formulario = document.createElement("form");

// Opciones del jugador
let nombreJugador;
let dificultad;
let puntuacion = 0;

// Comprobar el tamaño de la ventana del usuario

// Ajustes de la nave del jugador
let naveJugador = document.getElementById("naveJugador"); // Puntero a la imagen de la nave
let coordenadaX; // Ajuste horizontal
let coordenadaY; // Ajuste vertical
let velocidadJugador = 30; // Pixeles que se moverá la nave

const teclasPulsadas = new Map(); // Mapa donde se guardaran las teclas pulsadas para el movimiento

let crearElementoIMG; // Variable para crear los elementos img necesarios (naves enemigas, misiles...)

// Ajustes de los misiles
let misiles; // Variable para guardar el NodeList de los misiles
let velocidadMisiles = 15; // Velocidad del misil
const coordenadasMisiles = []; // Array para guardar las coordenadas de los misiles

// Ajustes de las naves enemigas
let lienzo = document.getElementById("lienzo"); // div donde se generaran los enemigos
let navesEnemigas = document.getElementsByClassName("naveEnemiga"); // NodeList con todas las naves enemigas existentes
const coordenadasEnemigos = []; // Array para almacenar las coordenadas de los enemigos

// Intervals usados
let intervaloMover; // Interval para mover enemigos y misiles cada .2 seg
let intervalColisiones; // Interval para comprobar si existe colisión con los enemigos

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
    <label for="dificultad" class="sub">Dificultad</label>:
    <input type="radio" name="dificultad" value="facil" /><label for="" id="easy">Fácil</label>
    <input type="radio" name="dificultad" value="normal" checked /><label for="" id="normal">Normal</label>
    <input type="radio" name="dificultad" value="dificil" /><label for="" id="hard">Dificil</label>
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
    // Recojo el nombre del jugador
    nombreJugador = document.getElementById("nombre").value;
    // Obtengo el valor del radio "dificultad", para saber cuantos enemigos crear
    dificultad = document.querySelector(
        'input[name="dificultad"]:checked'
    ).value;
    // Según la dificultad seleccionada, creo X numero de enemigos
    let numeroEnemigos;
    if (dificultad == "facil") {
        numeroEnemigos = 5;
    }
    if (dificultad == "normal") {
        numeroEnemigos = 7;
    }
    if (dificultad == "dificil") {
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
            crearElementoIMG = document.createElement("img");
            crearElementoIMG.setAttribute("class", "naveEnemiga");
            crearElementoIMG.setAttribute("src", "./images/naves/enemigo.png");
            document.getElementById("lienzo").appendChild(crearElementoIMG);
            // Dentro del array creado al principio, añado un objeto con las propiedades 'X' e Y'
            // para que cada enemigo tenga coordenadas independientes
            coordenadasEnemigos.push({
                x: 0,
                y: 0,
                controlY: 1,
                controlX: 1,
                velocidad: (Math.random() + 6) * 1.7,
            });
        }, 400 * i);
    }
    // Evento para mover la nave del jugador, con W-A-S-D o con las flechas
    document.addEventListener("keydown", (e) => {
        // Compruebo si la tecla pulsada esta dentro de 'teclasPulsadas', si no es asi, lo añado
        if (!teclasPulsadas.has(e.key)) {
            teclasPulsadas.set(e.key);
        }
        /*
        Cada 'if' comprueba si la nueva posición choca con el borde, si es asi, dejaría el valor en 0 (para dejarlo en el borde)
        o en el caso de que sea derecha/abajo, dejaría el valor en el Height/Width de la ventana
        */
        if (
            // MOVER ARRIBA DERECHA (W || ArrowUp) & (D || ArrowRight)
            (teclasPulsadas.has("w") || teclasPulsadas.has("ArrowUp")) &&
            (teclasPulsadas.has("d") || teclasPulsadas.has("ArrowRight"))
        ) {
            coordenadaY = naveJugador.offsetTop;
            coordenadaY = Math.max(0, coordenadaY - velocidadJugador);
            naveJugador.style.top = coordenadaY + "px";

            coordenadaX = naveJugador.offsetLeft;
            coordenadaX = Math.min(
                document.body.clientWidth - naveJugador.offsetWidth,
                coordenadaX + velocidadJugador
            );
            naveJugador.style.left = coordenadaX + "px";
        } else if (
            // MOVER ARRIBA IZQUIERDA (W || ArrowUp) & (A || ArrowLeft)
            (teclasPulsadas.has("w") || teclasPulsadas.has("ArrowUp")) &&
            (teclasPulsadas.has("a") || teclasPulsadas.has("ArrowLeft"))
        ) {
            coordenadaY = naveJugador.offsetTop;
            coordenadaY = Math.max(0, coordenadaY - velocidadJugador);
            naveJugador.style.top = coordenadaY + "px";

            coordenadaX = naveJugador.offsetLeft;
            coordenadaX = Math.max(0, coordenadaX - velocidadJugador);
            naveJugador.style.left = coordenadaX + "px";
        } else if (teclasPulsadas.has("w") || teclasPulsadas.has("ArrowUp")) {
            // MOVER ARRIBA (W || ArrowUp)
            coordenadaY = naveJugador.offsetTop;
            coordenadaY = Math.max(0, coordenadaY - velocidadJugador);
            naveJugador.style.top = coordenadaY + "px";
        } else if (
            // MOVER ABAJO DERECHA (S || ArrowDown) & (D || ArrowRight)
            (teclasPulsadas.has("s") || teclasPulsadas.has("ArrowDown")) &&
            (teclasPulsadas.has("d") || teclasPulsadas.has("ArrowRight"))
        ) {
            coordenadaY = naveJugador.offsetTop;
            coordenadaY = Math.min(
                document.body.clientHeight - naveJugador.offsetHeight,
                coordenadaY + velocidadJugador
            );
            naveJugador.style.top = coordenadaY + "px";

            coordenadaX = naveJugador.offsetLeft;
            coordenadaX = Math.min(
                document.body.clientWidth - naveJugador.offsetWidth,
                coordenadaX + velocidadJugador
            );
            naveJugador.style.left = coordenadaX + "px";
        } else if (
            // MOVER ABAJO IZQUIERDA (S || ArrowDown) & (A || ArrowLeft)
            (teclasPulsadas.has("s") || teclasPulsadas.has("ArrowDown")) &&
            (teclasPulsadas.has("a") || teclasPulsadas.has("ArrowLeft"))
        ) {
            coordenadaY = naveJugador.offsetTop;
            coordenadaY = Math.min(
                document.body.clientHeight - naveJugador.offsetHeight,
                coordenadaY + velocidadJugador
            );
            naveJugador.style.top = coordenadaY + "px";

            coordenadaX = naveJugador.offsetLeft;
            coordenadaX = Math.max(0, coordenadaX - velocidadJugador);
            naveJugador.style.left = coordenadaX + "px";
        } else if (teclasPulsadas.has("s") || teclasPulsadas.has("ArrowDown")) {
            // MOVER ABAJO (S || ArrowDown)
            coordenadaY = naveJugador.offsetTop;
            coordenadaY = Math.min(
                document.body.clientHeight - naveJugador.offsetHeight,
                coordenadaY + velocidadJugador
            );
            naveJugador.style.top = coordenadaY + "px";
        } else if (
            teclasPulsadas.has("d") ||
            teclasPulsadas.has("ArrowRight")
        ) {
            // MOVER DERECHA (D || ArrowRight)
            coordenadaX = naveJugador.offsetLeft;
            coordenadaX = Math.min(
                document.body.clientWidth - naveJugador.offsetWidth,
                coordenadaX + velocidadJugador
            );
            naveJugador.style.left = coordenadaX + "px";
        } else if (teclasPulsadas.has("a") || teclasPulsadas.has("ArrowLeft")) {
            // MOVER IZQUIERDA (A || ArrowLeft)
            coordenadaX = naveJugador.offsetLeft;
            coordenadaX = Math.max(0, coordenadaX - velocidadJugador);
            naveJugador.style.left = coordenadaX + "px";
        }
        // CREAR MISILES (Espacio)
        if (teclasPulsadas.has(" ")) {
            crearElementoIMG = document.createElement("img");
            crearElementoIMG.setAttribute("class", "misiles");
            crearElementoIMG.setAttribute(
                "src",
                "./images/Lasers/laserRed07.png"
            );
            document.body.appendChild(crearElementoIMG);
            // Estas 3 lineas son mi orgullo, se me ocurrieron porque aun me quedaban 5 neuronas vivas
            crearElementoIMG.style.top = naveJugador.offsetTop + "px";
            crearElementoIMG.style.left = naveJugador.offsetLeft + "px";
            /*
            Dentro del array creado al principio, añado un objeto con la propiedad 'Y'
            (que sera la única necesaria aquí), para que cada misil tenga coordenadas independientes
            y le asigno como 'coordenada Y' por defecto que sea la parte superior de la nave del jugador y se empiece a mover desde ahí
            */
            coordenadasMisiles.push({
                y: parseInt(crearElementoIMG.style.top),
            });
        }
    });

    // Eliminar tecla del mapa 'teclasPulsadas' al dejar de pulsarla
    document.addEventListener("keyup", (e) => {
        teclasPulsadas.delete(e.key);
    });
});

//la función que moverá todos los enemigos y misiles existentes
function mover() {
    // MOVER LOS ENEMIGOS
    // Bucle para comprobar la posición de los enemigos y ver si chocan (o no) con el borde
    for (let i = 0; i < navesEnemigas.length; i++) {
        //Eje de las X
        if (coordenadasEnemigos[i].controlX == 1) {
            coordenadasEnemigos[i].x += coordenadasEnemigos[i].velocidad;
        } else {
            coordenadasEnemigos[i].x -= coordenadasEnemigos[i].velocidad;
        }
        if (coordenadasEnemigos[i].x <= 0) {
            coordenadasEnemigos[i].controlX = 1;
            coordenadasEnemigos[i].x = 0;
        } else if (
            coordenadasEnemigos[i].x >=
            lienzo.offsetWidth - navesEnemigas[i].offsetWidth
        ) {
            // Esto significa que si es mayor o igual a el ancho que tiene el lienzo menos el tamaño de la imagen se le da un nuevo valor a x
            coordenadasEnemigos[i].controlX = 0;
            coordenadasEnemigos[i].x =
                lienzo.offsetWidth - navesEnemigas[i].offsetWidth;
        }
        //Eje de las Y
        if (coordenadasEnemigos[i].controlY == 1) {
            coordenadasEnemigos[i].y += coordenadasEnemigos[i].velocidad;
        } else {
            coordenadasEnemigos[i].y -= coordenadasEnemigos[i].velocidad;
        }
        if (coordenadasEnemigos[i].y <= 0) {
            coordenadasEnemigos[i].controlY = 1;
            coordenadasEnemigos[i].y = 0;
        } else if (
            coordenadasEnemigos[i].y >=
            lienzo.offsetHeight - navesEnemigas[i].offsetHeight
        ) {
            // Esto significa que si es mayor o igual a la altura que tiene el lienzo menos el tamaño de la imagen se le dará un nuevo valor a y
            coordenadasEnemigos[i].controlY = 0;
            coordenadasEnemigos[i].y =
                lienzo.offsetHeight - navesEnemigas[i].offsetHeight;
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
        if (coordenadasMisiles[i].y <= 0 - misiles[i].offsetHeight) {
            misiles[i].remove();
            coordenadasMisiles.splice([i], 1);
        }
        // Si no se ha borrado, muevo el misil a la nueva coordenada
        misiles[i].style.top = String(coordenadasMisiles[i].y) + "px";
    }
}
// Cada 2 mili-segundos se va a ejecutar la función para mover a los enemigos y misiles
intervaloMover = setInterval(mover, 2);

// Función para comprobar si existe colisión entre el jugador y algún enemigo
function comprobarColision() {
    // Bucle para comprobar si alguna de todas las naves existentes hace colisión
    for (let i = 0; i < navesEnemigas.length; i++) {
        if (
            coordenadaX <
                coordenadasEnemigos[i].x + navesEnemigas[i].offsetWidth &&
            coordenadaX + naveJugador.offsetWidth > coordenadasEnemigos[i].x &&
            coordenadaY <
                coordenadasEnemigos[i].y + navesEnemigas[i].offsetHeight &&
            coordenadaY + naveJugador.offsetHeight > coordenadasEnemigos[i].y
        ) {
            terminarPartida();
        }
    }
}
// Cada 2 mili-segundos se va a ejecutar la función para comprobar colisiones
intervalColisiones = setInterval(comprobarColision, 2);

// Función que eliminara todos los eventos, intervalos, y mostrara información al usuario
function terminarPartida() {
    clearInterval(intervaloMover); // Parar el movimiento de los enemigos
    clearInterval(intervalColisiones); // Parar el interval que comprueba colisiones
    // Muestro una ventana modal con la información de la partida
    ventanaModal.innerHTML = `
        <h1>Juego Marcianos</h1>
        <p>
            ¡Han destruido tu nave!, <span class = "sub" >intenta tener mas cuidado la proxima vez</span>, ${nombreJugador}.<br />
            Has tenido una puntuacion de: ${puntuacion} en modo ${dificultad}. 
        </p>`;
    ventanaModal.setAttribute("open", "true");
    document.body.appendChild(ventanaModal);
}
