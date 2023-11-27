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
    27 de noviembre de 2023
    ---------------------------------------
    Versión: 
    0.6.3
    ---------------------------------------
    Notas de la Versión: 
    - Los misiles destruirán la nave enemiga que impacten
    - Al eliminar a todos los enemigos, o al morir, saldrá una ventana con información
    - Cambiado evento de disparar "keydown" -> "keyup" para evitar que se mantenga la pulsación y que no deje de disparar
    - Los misiles desaparecerán al destruir la nave enemiga
    - El movimiento de la nave ahora es fluido
      - Corregido el error al pulsar rápidamente "A" y "D" (la nave solamente se movía a la izquierda)
      - Corregido el error que no permitía moverse sin volver a pulsar la tecla después de disparar un misil
    - Ya no se podrá mover la nave al terminar la partida
    - Corregido el fallo de colisiones si el jugador no se movía al principio
    - Centrado la posición iniciar del misil al lanzarlo
    - El juego iniciara en pantalla completa, y se quitara automáticamente al terminar

    !Avisos:
    - Aunque los enemigos tengan distinta velocidad, tarda un poco en variar su recorrido
    !- Al lanzar muchos misiles en poco tiempo, la detección de impacto no funciona bien
        ?Solamente funciona por la parte superior de la ventana
    
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

//la función que moverá todos los enemigos y misiles existentes
function mover() {
	// MOVER LOS ENEMIGOS
	// Bucle para comprobar la posición de los enemigos y ver si chocan (o no) con el borde
	for (let i = 0; i < navesEnemigas.length; i++) {
		//Eje de las X
		if (coordenadasEnemigos[i].controlX === 1) {
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
		if (coordenadasEnemigos[i].controlY === 1) {
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
		navesEnemigas[i].style.left = `${String(coordenadasEnemigos[i].x)}px`;
		navesEnemigas[i].style.top = `${String(coordenadasEnemigos[i].y)}px`;
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
		misiles[i].style.top = `${String(coordenadasMisiles[i].y)}px`;
	}
}
// Cada 2 mili-segundos se va a ejecutar la función para mover a los enemigos y misiles
intervaloMover = setInterval(mover, 2);

// Función para comprobar si existe colisión entre el jugador y algún enemigo
function comprobarColision() {
	// Bucle para comprobar si alguna de todas las naves existentes hace colisión
	for (let i = 0; i < navesEnemigas.length; i++) {
		if (
			coordenadaX < coordenadasEnemigos[i].x + navesEnemigas[i].offsetWidth &&
			coordenadaX + naveJugador.offsetWidth > coordenadasEnemigos[i].x &&
			coordenadaY < coordenadasEnemigos[i].y + navesEnemigas[i].offsetHeight &&
			coordenadaY + naveJugador.offsetHeight > coordenadasEnemigos[i].y
		) {
			partidaPerdida();
		}
	}
    // Comprobar si un misil ha impactado
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
			misiles[i].remove();
			coordenadasMisiles.splice([i], 1);
			puntuacion = puntuacion + puntuacionEnemigo;
			comprobarPartida();
		}
	}
}
// Cada 2 mili-segundos se va a ejecutar la función para comprobar colisiones
intervalColisiones = setInterval(comprobarColision, 2);
/*
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
*/

// Función que eliminara todos los eventos, intervalos, y mostrara información al usuario
function partidaPerdida() {
	clearInterval(intervaloMover); // Parar el movimiento de los enemigos
	clearInterval(intervalColisiones); // Parar el interval que comprueba colisiones
	clearInterval(moverNave); // Parar el interval que comprueba para mover la nave
	// Muestro una ventana modal con la información de la partida
	ventanaModal.innerHTML = `
        <h1>Juego Marcianos</h1>
        <p>
            ¡Han destruido tu nave!, <span class="sub">intenta tener mas cuidado la proxima vez</span>, ${nombreJugador}.<br />
            <span class="izquierda">Has tenido una puntuacion de: ${puntuacion} en modo ${dificultad}.</span><br />
            <span class="izquierda">Duración de partida: ${duracionPartida} segundos.</span>
        </p>
        <br />
        <span class="derecha"><input type="button" value="Volver a jugar" disabled></span>`;

	ventanaModal.setAttribute("open", "true");
	document.body.appendChild(ventanaModal);
    offFullscreen();
}

function comprobarPartida() {
	if (navesEnemigas.length <= 0) {
		partidaGanada();
	}
}

function partidaGanada() {
	clearInterval(intervaloMover); // Parar el movimiento de los enemigos
	clearInterval(intervalColisiones); // Parar el interval que comprueba colisiones
	clearInterval(moverNave); // Parar el interval que comprueba para mover la nave
	// Muestro una ventana modal con la información de la partida
	ventanaModal.innerHTML = `
        <h1>Juego Marcianos</h1>
        <p>
            ¡Enohabuena, <span class="sub">has destruido a todos los enemigos</span>! ${nombreJugador}<br />
            <span class="izquierda">Has tenido una puntuacion de: ${puntuacion} en modo ${dificultad}.</span><br />
            <span class="izquierda">Duración de partida: ${duracionPartida} segundos.</span>
            </p>
        <br />
        <span class="derecha"><input type="button" value="Volver a jugar" disabled></span>`;

	ventanaModal.setAttribute("open", "true");
	document.body.appendChild(ventanaModal);
    offFullscreen();
}

function onFullscreen() {
	if (
		document.fullScreenElement !== null || // metodo alternativo
		(!document.mozFullScreen && !document.webkitIsFullScreen)
	) {
		// metodos actuales
		if (document.documentElement.requestFullScreen) {
			document.documentElement.requestFullScreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullScreen) {
			document.documentElement.webkitRequestFullScreen(
				Element.ALLOW_KEYBOARD_INPUT,
			);
		}
	}
}

function offFullscreen() {
	if (document.cancelFullScreen) {
		document.cancelFullScreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	}
}
