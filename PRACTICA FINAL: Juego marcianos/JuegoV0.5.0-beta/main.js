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
    0.5.0-beta
    ---------------------------------------
    Notas de la Versión: 
    - Los misiles destruyen las naves enemigas
    - Cuando no queden mas enemigos, saldrá una ventana para felicitar por la victoria
    - Cambiado evento para disparar "keydown" -> "keyup" para que no se pueda mantener presionado

    TODOs:
    *- Hacer que los misiles aparezcan un poco mas arriba de la nave, y CENTRADOS
    *- Eliminar el evento "keydown" y "keyup" al terminar el juego
    ?- Un botón para volver a jugar
    - Si borras el nombre después de haberlo introducido, que se vuelva a deshabilitar el botón
    *- Mejorar la detección de impactos de misiles
    - Hacer que pueda haber colisión sin necesidad de que el jugador se mueva hacia arriba/abajo al menos 1 vez
    *- Limitar los misiles que puedes lanzar en X tiempo
    ?- Hacer que los enemigos tengan movimientos aleatorios para que no sigan la misma ruta siempre

    TODOs extra:
    - Al destruir una nave enemiga, hacer que se muestre una explosion (gif o img) con sonido
    - Al colisionar con una nave enemiga, hacer que se muestre una explosion (gif o img) con sonido
    - Hacer que el juego inicie en pantalla completa
    - Poner sonido al lanzar un misil

    !Avisos:
    - Al pulsar EXTREMADAMENTE rápido A y D, la nave solamente se mueve hacia la derecha (No ocurre con las flechas)
        Al ser la A (izquierda) el ultimo 'if', si pulsas rápido, no llega a hacer esa comprobación
    - Aunque los enemigos tengan distinta velocidad, tarda un poco en variar su recorrido
    - Al lanzar 1 solo misil, si estabas en movimiento, la nave se quedara quieta hasta que pulses otro botón 
        (Solo te moverá mientras sigas pulsando ese mismo botón)
    !- Al lanzar muchos misiles en poco tiempo, la detección de impacto no funciona bien
    
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

intervalDuracion = setInterval(() => {
    duracionPartida++;
}, 1000);

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
            partidaPerdida();
        }
    }
}
// Cada 2 mili-segundos se va a ejecutar la función para comprobar colisiones
intervalColisiones = setInterval(comprobarColision, 2);

function comprobarMisiles() {
    for (let i = 0; i < misiles.length; i++) {
        if (
            coordenadasMisiles[i].x <
                coordenadasEnemigos[i].x + navesEnemigas[i].offsetWidth &&
            coordenadasMisiles[i].x + misiles[i].offsetWidth >
                coordenadasEnemigos[i].x &&
            coordenadasMisiles[i].y <
                coordenadasEnemigos[i].y + navesEnemigas[i].offsetHeight &&
            coordenadasMisiles[i].y + misiles[i].offsetHeight >
                coordenadasEnemigos[i].y
        ) {
            navesEnemigas[i].remove();
            coordenadasEnemigos.splice([i], 1);
            puntuacion++;
            comprobarPartida();
        }
    }
}
// Cada 2 mili-segundos se va a ejecutar la función para comprobar si los misiles han impactado
intervalMisiles = setInterval(comprobarMisiles, 2);

// Función que eliminara todos los eventos, intervalos, y mostrara información al usuario
function partidaPerdida() {
    clearInterval(intervaloMover); // Parar el movimiento de los enemigos
    clearInterval(intervalColisiones); // Parar el interval que comprueba colisiones
    // Muestro una ventana modal con la información de la partida
    ventanaModal.innerHTML = `
        <h1>Juego Marcianos</h1>
        <p>
            ¡Han destruido tu nave!, <span class = "sub" >intenta tener mas cuidado la proxima vez</span>, ${nombreJugador}.<br />
            <span class="izquierda">Has tenido una puntuacion de: ${puntuacion} en modo ${dificultad}.</span><br />
            <span class="izquierda">Duración de partida: ${duracionPartida} segundos.</span>
        </p>
        <br />
        <span class = "derecha"><input type ="button" value="Volver a jugar" disabled></span>
        <span id = "version">${version}</span>`;
    ventanaModal.setAttribute("open", "true");
    document.body.appendChild(ventanaModal);
}

function comprobarPartida() {
    if (navesEnemigas.length <= 0) {
        partidaGanada();
    }
}

function partidaGanada() {
    clearInterval(intervaloMover); // Parar el movimiento de los enemigos
    clearInterval(intervalColisiones); // Parar el interval que comprueba colisiones
    // Muestro una ventana modal con la información de la partida
    ventanaModal.innerHTML = `
        <h1>Juego Marcianos</h1>
        <p>
            ¡Enohabuena, <span class = "sub" >has destruido a todos los enemigos</span>! ${nombreJugador}<br />
            <span class="izquierda">Has tenido una puntuacion de: ${puntuacion} en modo ${dificultad}.</span><br />
            <span class="izquierda">Duración de partida: ${duracionPartida} segundos.</span>
            </p>
        <br />
        <span class = "derecha"><input type ="button" value="Volver a jugar" disabled></span>
        <span id = "version">${version}</span>`;
    ventanaModal.setAttribute("open", "true");
    document.body.appendChild(ventanaModal);
}
