/*

    Nombre del Script: main.js
    ---------------------------------------
    Descripción: 
    Juego web de destruir naves enemigas
    ---------------------------------------
    Autor: 
    Mario Morales Ortega (1745008) 
    ---------------------------------------
    Fecha de Creación: 
    20 de noviembre de 2023
    ---------------------------------------
    Última Modificación: 
    30 de enero de 2024
    ---------------------------------------
    Versión: 
    0.9.2
    ---------------------------------------
    Notas de la Versión:
    - Algunas optimizaciones
    - Corregido error que no bloqueaba el botón de empezar partida si después de escribir un nombre, este se borraba
    - Eliminado preventDefault() de las teclas ENTER y F11
        Al haber desactivado el autofocus de la ventana modal, ya no se actualiza la página al pulsar ENTER
        preventDefault() en F11 parece no hacer ningún cambio, ya que se puede seguir activando/desactivando la pantalla completa

    Observaciones:
    - Si el juego se pausa nada mas empezar, los enemigos se seguirán generando uno encima de otro
    - Si el jugador pulsa CapsLock mientras se mueve, esa tecla nunca se salia del Mapa y no se podría volver a mover, 
        o no pararía de moverse hacia ese lado hasta que vuelva a pulsar CapsLock y la tecla que estaba pulsando antes
    - Al perder, si la nave enemiga colisiona con el jugador cerca del borde inferior, al quitar la pantalla completa (automáticamente)
        esa nave enemiga (o las que estén cerca del borde en ese momento) se quedaran pilladas y no se moverán de la parte inferior
    
    Fuentes (ctrl + click para abrir enlace):
    - Obtener el viewport del cliente para poner limite al body y que las naves no se salgan de la pantalla
        https://stackoverflow.com/questions/16776764/move-div-with-javascript-inside-bodys-limits
        // http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript
        - Enlace caído

    - Iterar 2 NodeList para hacer la comprobación de impacto de misiles
        https://stackoverflow.com/questions/40095117/looping-over-two-arrays-with-different-length-and-correctly-sorting-the-output
    
    - Distinguir el navegador usando navigator.userAgent
        https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent

    - Reproducir audio SIN ESPERAR A QUE TERMINE EL MISMO AUDIO ANTERIOR
        https://stackoverflow.com/questions/66989726/audio-play-without-waiting-for-previous-sound-to-end

    - Método reload (Simplemente busqué reload js, y es lo que encontré para "volver a jugar" aunque solamente refresca la página)
        https://developer.mozilla.org/en-US/docs/Web/API/Location/reload

    - Quitar el autofocus de la ventana modal
        https://stackoverflow.com/questions/72466624/prevent-html-dialog-from-grabbing-focus

*/

/* ---- Variables necesarias ---------- */

// Variable para pausar el juego
let pausa = false;
// Variable para que no se pueda pausar al terminar la partida
let partida = true;

// Variables para crear elementos HTML
const ventanaModal = document.createElement("dialog"); // Ventana modal
const crearPropulsorIMG = document.createElement("img"); // Propulsor nave jugador
// crearPropulsorIMG extra
crearPropulsorIMG.setAttribute("class", "propulsor");
crearPropulsorIMG.setAttribute("src", "./images/fuegoPropulsor.png");
crearPropulsorIMG.setAttribute("hidden", "true");
document.body.appendChild(crearPropulsorIMG);

// Punteros de elementos HTML
const naveJugador = document.getElementById("naveJugador"); // Nave del jugador
const misiles = document.getElementsByClassName("misiles"); // NodeList misiles
const lienzo = document.getElementById("lienzo"); // div donde se generaran las naves enemigas
const navesEnemigas = document.getElementsByClassName("naveEnemiga"); // NodeList naves enemigas
const navesExplotadas = document.getElementsByClassName("boom"); // NodeList explosiones

// Arrays/Mapas
const teclasPulsadas = new Map(); // Mapa para almacenar las teclas pulsadas
const coordenadasMisiles = []; // Array para almacenar las coordenadas de los misiles
const coordenadasEnemigos = []; // Array para almacenar las coordenadas de los enemigos

// Variables del jugador/misiles/enemigos
let dificultad; // Dificultad elegida por el jugador
let puntuacionEnemigo; // Puntos que dará cada enemigo según la dificultad
let puntuacion = 0; // Puntuación del jugador
let duracionPartida = 0; // Duración de la partida
let coordenadaX = naveJugador.offsetLeft; // Ajuste horizontal del jugador
let coordenadaY = naveJugador.offsetTop; // Ajuste vertical del jugador
let velocidadJugador; // Pixeles que se moverá la nave del jugador
let velocidadMisiles; // Velocidad de los misiles

let numeroEnemigos;

/*
    La velocidad (pixeles) varia entre algunos navegadores (Chrome y Firefox que yo haya comprobado)
    Así que necesito cambiar la velocidad dependiendo de que navegador se este utilizando
*/
let browserSpeed; // Velocidad según el navegador
if (navigator.userAgent.includes("Chrome")) {
	velocidadJugador = 5;
	velocidadMisiles = 8;
	browserSpeed = 4;
} else if (navigator.userAgent.includes("Firefox")) {
	velocidadJugador = 15;
	velocidadMisiles = 20;
	browserSpeed = 12;
}

// Intervals
let intervalMover = setInterval(mover, 8); // Mover naves enemigas .2seg
let intervalMoverMisiles = setInterval(moverMisiles, 2); // Mover naves enemigas .2seg
let intervalColisiones = setInterval(comprobarColision, 2); // Comprobar colisiones enemigos/misiles cada .2seg
let intervalJugador = setInterval(moverJugador, 5); // Movimiento fluido del jugador 0.5seg -Eloy
let intervalDuracion; // Contador para saber cuanto dura la partida

// Agrego el código HTML necesario a la ventana modal
ventanaModal.innerHTML = `
    <h1>Juego Marcianos</h1>
    <p>
        ¡Elimina a todos los enemigos <span class="sub">en el menor tiempo posible</span>!
    </p>
    <form>
        <label for="nombre">Nombre de jugador</label><br />
        <input type="text" id="nombre" placeholder="Introduce un nombre" disabled/>
        <br />
        <label>Dificultad:</label>

        <input type="radio" name="dificultad" value="facil" id="easy" />
        <label for="easy">Fácil</label>

        <input type="radio" name="dificultad" value="normal" id="normal" checked />
        <label for="normal" id="normal">Normal</label>

        <input type="radio" name="dificultad" value="dificil" id="dificil" />
        <label for="dificil">Difícil</label>

        <br />
        <label for="guardarPuntuacion">Guardar puntuación</label>
        <input type="checkbox" id="guardarPuntuacion" />
        <br />
        <input type="button" id="leaderboard" value="Ver puntuaciones" disabled/>
        <input type="button" id="startGame" value="Empezar partida"/>
    </form>
    <h2 id="info">CONTROLES</h2>
    <p class="infoIzq">
        Mover nave jugador: W-A-S-D | Flechas del teclado<br />
        Disparar misiles: Espacio<br />
        Pausar/Reanudar : P
    </p>
`;
document.body.appendChild(ventanaModal); // Añado la ventana modal al body
ventanaModal.inert = true; // Para quitar el autofocus, es necesario
ventanaModal.showModal(); // Muestro la ventana modal
ventanaModal.inert = false; // Para quitar el autofocus, es necesario

let nombreJugador = document.getElementById("nombre"); // Puntero al input nombre
const botonEmpezar = document.getElementById("startGame"); // Botón para empezar la partida
/*
    Si el jugador no quiere guardar su puntuación, podrá empezar la partida sin introducir nombre,
    en el caso contrario, necesitara introducir un nombre para poder empezar la partida
*/
document.getElementById("guardarPuntuacion").addEventListener("change", () => {
	if (document.getElementById("guardarPuntuacion").checked) {
		nombreJugador.removeAttribute("disabled");
		botonEmpezar.setAttribute("disabled", "true");
		nombreJugador.focus();
	} else {
		nombreJugador.value = "";
		nombreJugador.setAttribute("disabled", "true");
		botonEmpezar.removeAttribute("disabled");
	}
});
nombreJugador.addEventListener("change", () => {
    nombreJugador.value === "" ? botonEmpezar.setAttribute("disabled", "true") : botonEmpezar.removeAttribute("disabled");
});

/* ---- EMPEZAR EL JUEGO ---------- */
botonEmpezar.addEventListener("click", () => {
	intervalDuracion = setInterval(() => {
		duracionPartida++;
	}, 1000);
	fullScreenOn();
	// Recojo el nombre del jugador, si no ha introducido nada, sera 'Jugador 1'
	nombreJugador = document.getElementById("nombre").value;
	if (nombreJugador === "") {
		nombreJugador = "Jugador 1";
	}

	// Obtengo el valor del radio 'dificultad', para saber cuantos enemigos crear
	dificultad = document.querySelector('input[name="dificultad"]:checked').value;
	// Según la dificultad seleccionada, creo X numero de enemigos
	if (dificultad === "facil") {
		numeroEnemigos = 4;
		puntuacionEnemigo = 1;
	}
	if (dificultad === "normal") {
		numeroEnemigos = 7;
		puntuacionEnemigo = 2;
	}
	if (dificultad === "dificil") {
		numeroEnemigos = 10;
		puntuacionEnemigo = 4;
	}
	// Cierro la ventana modal
	ventanaModal.close();
	crearEnemigos();

	// Evento para registrar las teclas pulsadas
	document.addEventListener("keydown", (e) => {
		// Compruebo si la tecla pulsada esta dentro de 'teclasPulsadas', si no es asi, lo añado
		if (!teclasPulsadas.has(e.key)) {
			teclasPulsadas.set(e.key);
		}
	});
	// Evento para registrar las teclas que se dejan de pulsar
	document.addEventListener("keyup", (e) => {
		// Borro la tecla del mapa
		teclasPulsadas.delete(e.key);
	});
	// Evento para disparar misiles
	document.addEventListener("keyup", dispararMisiles);
	// Evento para pausar el juego
	document.addEventListener("keydown", comprobarEstado);
});

function crearEnemigos() {
	// Bucle para crear las naves enemigas
	for (let i = 0; i < numeroEnemigos; i++) {
		// Timeout para que no se creen todos a la vez, ya que se solaparían
		setTimeout(() => {
			const crearElementoIMG = document.createElement("img");
			crearElementoIMG.setAttribute("class", "naveEnemiga");
			crearElementoIMG.setAttribute("src", "./images/naves/enemigo.png");
			document.getElementById("lienzo").appendChild(crearElementoIMG);
			// Dentro del array creado al principio, añado un objeto con las propiedades 'X' e Y'
			// para que cada enemigo tenga coordenadas independientes
			coordenadasEnemigos.push({
				x: 0, // Coordenada X
				y: 0, // Coordenada Y
				dx: Math.random() > 0.5 ? 1 : -1, // Dirección aleatoria en X
				dy: Math.random() > 0.5 ? 1 : -1, // Dirección aleatoria en Y
				velocidadX: Math.random() * browserSpeed + 1, // Velocidad aleatoria en X
				velocidadY: Math.random() * browserSpeed + 1, // Velocidad aleatoria en Y
			});
		}, 300 * i);
	}
}
function comprobarEstado(e) {
	if (e.key === "p" && pausa === false && partida === true) {
		pausarPartida();
	} else if (e.key === "p" && pausa === true && partida === true) {
		reanudarPartida();
	}
}

function reanudarPartida() {
	intervalMover = setInterval(mover, 8); // Mover naves enemigas .2seg
	intervalMoverMisiles = setInterval(moverMisiles, 2); // Mover naves enemigas .2seg
	intervalColisiones = setInterval(comprobarColision, 2); // Comprobar colisiones enemigos/misiles cada .2seg
	intervalJugador = setInterval(moverJugador, 5); // Movimiento fluido del jugador 0.5seg -Eloy
	pausa = false;
	ventanaModal.close();
}

function pausarPartida() {
	clearInterval(intervalMover);
	clearInterval(intervalMoverMisiles);
	clearInterval(intervalColisiones);
	clearInterval(intervalJugador);
	pausa = true;
	ventanaModal.innerHTML = "Juego pausado";
	ventanaModal.showModal();
}

// Función para mover la nave del jugador
function moverJugador() {
	/*
    Cada 'if' comprueba si la nueva posición choca con el borde, si es asi, dejaría el valor en 0 (para dejarlo en el borde)
    o en el caso de que sea derecha/abajo, dejaría el valor en el Height/Width de la ventana

    Hay que comprobar Mayúsculas y minúsculas, o la nave no se moverá si CapsLock esta activado
    */
	if (
		// MOVER ARRIBA DERECHA (W || ArrowUp) & (D || ArrowRight)
		(teclasPulsadas.has("w") ||
			teclasPulsadas.has("W") ||
			teclasPulsadas.has("ArrowUp")) &&
		(teclasPulsadas.has("d") ||
			teclasPulsadas.has("D") ||
			teclasPulsadas.has("ArrowRight"))
	) {
		// EJEMPLO
		//Obtengo la coordenadaY del jugador
		coordenadaY = naveJugador.offsetTop;
		// Y aquí le digo que la nueva coordenadaY sera 0 (en el caso de que se pase del borde superior)
		// o coordenadaY (su coordenada actual) - velocidadJugador (los pixeles que se moverá hacia arriba)
		coordenadaY = Math.max(0, coordenadaY - velocidadJugador);
		naveJugador.style.top = `${coordenadaY}px`;

		coordenadaX = naveJugador.offsetLeft;
		coordenadaX = Math.min(
			document.body.clientWidth - naveJugador.offsetWidth,
			coordenadaX + velocidadJugador,
		);
		naveJugador.style.left = `${coordenadaX}px`;
	} else if (
		// MOVER ARRIBA IZQUIERDA (W || ArrowUp) & (A || ArrowLeft)
		(teclasPulsadas.has("w") ||
			teclasPulsadas.has("W") ||
			teclasPulsadas.has("ArrowUp")) &&
		(teclasPulsadas.has("a") ||
			teclasPulsadas.has("A") ||
			teclasPulsadas.has("ArrowLeft"))
	) {
		coordenadaY = naveJugador.offsetTop;
		coordenadaY = Math.max(0, coordenadaY - velocidadJugador);
		naveJugador.style.top = `${coordenadaY}px`;

		coordenadaX = naveJugador.offsetLeft;
		coordenadaX = Math.max(0, coordenadaX - velocidadJugador);
		naveJugador.style.left = `${coordenadaX}px`;
	} else if (
		teclasPulsadas.has("w") ||
		teclasPulsadas.has("W") ||
		teclasPulsadas.has("ArrowUp")
	) {
		// MOVER ARRIBA (W || ArrowUp)
		coordenadaY = naveJugador.offsetTop;
		coordenadaY = Math.max(0, coordenadaY - velocidadJugador);
		naveJugador.style.top = `${coordenadaY}px`;
	} else if (
		// MOVER ABAJO DERECHA (S || ArrowDown) & (D || ArrowRight)
		(teclasPulsadas.has("s") ||
			teclasPulsadas.has("S") ||
			teclasPulsadas.has("ArrowDown")) &&
		(teclasPulsadas.has("d") ||
			teclasPulsadas.has("D") ||
			teclasPulsadas.has("ArrowRight"))
	) {
		coordenadaY = naveJugador.offsetTop;
		coordenadaY = Math.min(
			document.body.clientHeight - naveJugador.offsetHeight,
			coordenadaY + velocidadJugador,
		);
		naveJugador.style.top = `${coordenadaY}px`;

		coordenadaX = naveJugador.offsetLeft;
		coordenadaX = Math.min(
			document.body.clientWidth - naveJugador.offsetWidth,
			coordenadaX + velocidadJugador,
		);
		naveJugador.style.left = `${coordenadaX}px`;
	} else if (
		// MOVER ABAJO IZQUIERDA (S || ArrowDown) & (A || ArrowLeft)
		(teclasPulsadas.has("s") ||
			teclasPulsadas.has("S") ||
			teclasPulsadas.has("ArrowDown")) &&
		(teclasPulsadas.has("a") ||
			teclasPulsadas.has("A") ||
			teclasPulsadas.has("ArrowLeft"))
	) {
		coordenadaY = naveJugador.offsetTop;
		coordenadaY = Math.min(
			document.body.clientHeight - naveJugador.offsetHeight,
			coordenadaY + velocidadJugador,
		);
		naveJugador.style.top = `${coordenadaY}px`;

		coordenadaX = naveJugador.offsetLeft;
		coordenadaX = Math.max(0, coordenadaX - velocidadJugador);
		naveJugador.style.left = `${coordenadaX}px`;
	} else if (
		teclasPulsadas.has("s") ||
		teclasPulsadas.has("S") ||
		teclasPulsadas.has("ArrowDown")
	) {
		// MOVER ABAJO (S || ArrowDown)
		coordenadaY = naveJugador.offsetTop;
		coordenadaY = Math.min(
			document.body.clientHeight - naveJugador.offsetHeight,
			coordenadaY + velocidadJugador,
		);
		naveJugador.style.top = `${coordenadaY}px`;
	} else if (
		teclasPulsadas.has("d") ||
		teclasPulsadas.has("D") ||
		teclasPulsadas.has("ArrowRight")
	) {
		// MOVER DERECHA (D || ArrowRight)
		coordenadaX = naveJugador.offsetLeft;
		coordenadaX = Math.min(
			document.body.clientWidth - naveJugador.offsetWidth,
			coordenadaX + velocidadJugador,
		);
		naveJugador.style.left = `${coordenadaX}px`;
	} else if (
		teclasPulsadas.has("a") ||
		teclasPulsadas.has("A") ||
		teclasPulsadas.has("ArrowLeft")
	) {
		// MOVER IZQUIERDA (A || ArrowLeft)
		coordenadaX = naveJugador.offsetLeft;
		coordenadaX = Math.max(0, coordenadaX - velocidadJugador);
		naveJugador.style.left = `${coordenadaX}px`;
	}

	if (
		teclasPulsadas.has("a") ||
		teclasPulsadas.has("A") ||
		teclasPulsadas.has("w") ||
		teclasPulsadas.has("W") ||
		teclasPulsadas.has("s") ||
		teclasPulsadas.has("S") ||
		teclasPulsadas.has("d") ||
		teclasPulsadas.has("D") ||
		teclasPulsadas.has("ArrowLeft") ||
		teclasPulsadas.has("ArrowUp") ||
		teclasPulsadas.has("ArrowRight") ||
		teclasPulsadas.has("ArrowDown")
	) {
		crearPropulsorIMG.style.top = `${
			naveJugador.offsetTop + naveJugador.offsetHeight / 1.2
		}px`;
		crearPropulsorIMG.style.left = `${
			naveJugador.offsetLeft + naveJugador.offsetWidth / 2.35
		}px`;
		crearPropulsorIMG.removeAttribute("hidden");
	} else {
		crearPropulsorIMG.setAttribute("hidden", "true");
	}
}

function dispararMisiles(e) {
	// CREAR MISILES (Espacio)
	if (e.key === " ") {
		const crearElementoIMG = document.createElement("img");
		crearElementoIMG.setAttribute("class", "misiles");
		crearElementoIMG.setAttribute("src", "./images/Lasers/laserJugador.png");
		document.body.appendChild(crearElementoIMG);
		// Le pongo el estilo al misil creado para que aparezca donde yo quiero
		// La posición donde aparecerá varia de la imagen que se use
		crearElementoIMG.style.top = `${
			naveJugador.offsetTop - naveJugador.offsetHeight / 1.2
		}px`;
		crearElementoIMG.style.left = `${
			naveJugador.offsetLeft + naveJugador.offsetWidth / 3.3
		}px`;
		/*
        Dentro del array creado al principio, añado un objeto con las propiedades para controlar
        las coordenadas de los misiles
        */
		coordenadasMisiles.push({
			y: parseInt(crearElementoIMG.style.top),
			x: parseInt(crearElementoIMG.style.left),
		});
		const audioLanzarMisil = new Audio("./sounds/sfx_laser1.ogg").play(); // Sonido al lanzar un misil
	}
}

// Función que moverá todos los enemigos
function mover() {
	// Bucle para comprobar y mover la posición de los enemigos y ver si chocan (o no) con el borde
	for (let i = 0; i < navesEnemigas.length; i++) {
		// Obtener las coordenadas actuales de la nave enemiga
		const coordenadas = coordenadasEnemigos[i];

		// Actualizar la posición X e Y basándose en la velocidad y dirección
		coordenadas.x += coordenadas.velocidadX * coordenadas.dx;
		coordenadas.y += coordenadas.velocidadY * coordenadas.dy;

		// Revisar los límites del área de juego y cambiar la dirección si es necesario
		if (
			coordenadas.x < 0 ||
			coordenadas.x > lienzo.offsetWidth - navesEnemigas[i].offsetWidth
		) {
			coordenadas.dx *= -1; // Invierte la dirección en el eje X
		}
		if (
			coordenadas.y < 0 ||
			coordenadas.y > lienzo.offsetHeight - navesEnemigas[i].offsetHeight
		) {
			coordenadas.dy *= -1; // Invierte la dirección en el eje Y
		}

		// Aplicar las nuevas coordenadas a la nave enemiga
		navesEnemigas[i].style.left = `${coordenadas.x}px`;
		navesEnemigas[i].style.top = `${coordenadas.y}px`;
	}
}

// Función que moverá todos los misiles
function moverMisiles() {
	// Bucle que comprobara la 'coordenada Y' de los misiles existentes y los moverá o eliminara
	for (let i = 0; i < misiles.length; i++) {
		// Le doy una nueva coordenada al misil
		coordenadasMisiles[i].y -= velocidadMisiles;
		// Compruebo si el misil toca el borde superior, en caso de que si, borro el misil del DOM, y su objeto del Array
		if (coordenadasMisiles[i].y <= 0 - misiles[i].offsetHeight) {
			misiles[i].remove();
			coordenadasMisiles.splice([i], 1);
		} else {
			// Si no se ha borrado, muevo el misil a la nueva coordenada
			misiles[i].style.top = `${String(coordenadasMisiles[i].y)}px`;
		}
	}
}

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
			naveJugador.setAttribute("src", "./images/explosion.gif"); // Gif explosion
			partidaPerdida(); // Termino la partida
			// Timeout para que el gif no se reproduzca infinitamente
			const timeoutExplosion = setTimeout(() => {
				naveJugador.remove();
			}, 1000);
		}
	}
	// Comprobar si un misil ha impactado
	for (let i = 0; i < misiles.length; i++) {
		for (let j = 0; j < navesEnemigas.length; j++) {
			if (
				coordenadasMisiles[i].x <
					coordenadasEnemigos[j].x + navesEnemigas[j].offsetWidth &&
				coordenadasMisiles[i].x + misiles[i].offsetWidth >
					coordenadasEnemigos[j].x &&
				coordenadasMisiles[i].y <
					coordenadasEnemigos[j].y + navesEnemigas[j].offsetHeight &&
				coordenadasMisiles[i].y + misiles[i].offsetHeight >
					coordenadasEnemigos[j].y
			) {
				coordenadasEnemigos.splice(j, 1); // Elimino sus coordenadas
				// Reemplazo las naves por un gif de explosion y le cambio la clase para que no se mueva
				navesEnemigas[j].setAttribute("src", "./images/explosion.gif");
				navesEnemigas[j].setAttribute("class", "boom");
				const audioExplosion = new Audio("./sounds/boom.wav").play(); // Sonido al explotar una nave enemiga
				// Quito el elemento para que no se siga viendo la explosion
				const eliminarExplosion = setTimeout(() => {
					navesExplotadas[0].remove();
				}, 1000);
				misiles[i].remove(); // Elimino el elemento misil del HTML
				coordenadasMisiles.splice(i, 1); // Elimino sus coordenadas
				puntuacion = puntuacion + puntuacionEnemigo; // Sumo la puntuación
				comprobarPartida(); // Compruebo si quedan mas enemigos
			}
		}
	}
}

// Función para comprobar si quedan enemigos, en el caso que no queden, se termina la partida
function comprobarPartida() {
	if (navesEnemigas.length <= 0) {
		partidaGanada();
	}
}
// Función para eliminar los intervals y mostrar una ventana con información al ganar
function partidaGanada() {
	// Uso esto para que no se pueda pausar al terminar la partida
	partida = false;
	fullScreenOff(); // Quito la pantalla completa
	clearInterval(intervalColisiones); // Parar el interval que comprueba colisiones
	clearInterval(intervalDuracion); // Cancelo el interval que aumenta la duración de la partida
	ventanaModal.innerHTML = `

        <h1>¡VICTORIA!</h1>
        <p>
            ¡Enhorabuena!, <span class="sub">has destruido a todos los enemigos</span>, ${nombreJugador}<br />
            <span class="izquierda">Has obtenido <span class="puntuacionFinal">[${puntuacion}]</span> puntos en modo <span class="puntuacionFinal">[${dificultad}]</span>.</span>
            <br /><span class="izquierda">Duración de partida: ${duracionPartida} segundos.</span>
            </p>
        <br />
        <input type="button" value="Volver a jugar" class="derecha" id="replay">
    `;
	ventanaModal.inert = true; // Para quitar el autofocus, es necesario
	ventanaModal.showModal(); // Muestro la ventana modal
	ventanaModal.inert = false; // Para quitar el autofocus, es necesario
	// Evento para volver a jugar (recargar la página)
	replay.addEventListener("click", volverJugar);

	// Prefiero bajar la velocidad y que parezca cámara lenta a bloquear el movimiento
	velocidadJugador = 1;
	velocidadMisiles = 2;
}
// Función para eliminar los intervals y mostrar una ventana con información al perder
function partidaPerdida() {
	// Uso esto para que no se pueda pausar al terminar la partida
	partida = false;
	fullScreenOff(); // Quito la pantalla completa
	document.removeEventListener("keyup", dispararMisiles); // Remuevo el evento para disparar misiles
	clearInterval(intervalJugador); // Cancelo el interval que mueve al jugador
	clearInterval(intervalColisiones); // Cancelo el interval que comprueba las colisiones
	clearInterval(intervalDuracion); // Cancelo el interval que aumenta la duración de la partida
	crearPropulsorIMG.remove(); // Remuevo el (img) propulsor del DOM
	const audioPerder = new Audio("./sounds/sfx_lose.ogg").play(); // Reproduzco un audio
	// Cambio el código HTML de la ventana modal
	ventanaModal.innerHTML = `
        <h1>DERROTA...</h1>
        <p>
            ¡Han destruido tu nave!, <span class="sub">intenta tener mas cuidado la proxima vez</span>, ${nombreJugador}.<br />
            <span class="izquierda">Has obtenido <span class="puntuacionFinal">[${puntuacion}]</span> puntos en modo <span class="puntuacionFinal">[${dificultad}]</span>.</span>
            <br /><span class="izquierda">Duración de partida: ${duracionPartida} segundos.</span>
        </p>
        <br />
        <input type="button" value="Volver a jugar" class="derecha" id="replay">
    `;
	ventanaModal.inert = true; // Para quitar el autofocus, es necesario
	ventanaModal.showModal(); // Muestro la ventana modal
	ventanaModal.inert = false; // Para quitar el autofocus, es necesario
	// Evento para volver a jugar (recargar la página)
	replay.addEventListener("click", volverJugar);
	// Prefiero bajar la velocidad y que parezca cámara lenta a bloquear el movimiento
	for (let i = 0; i < navesEnemigas.length; i++) {
		coordenadasEnemigos[i].velocidad = coordenadasEnemigos[i].velocidad / 10;
	}
}

// Función para recargar la página
function volverJugar() {
	location.reload();
}

// Funciones para poner y quitar pantalla completa automáticamente
function fullScreenOn() {
	if (
		document.fullScreenElement !== null || // método alternativo
		(!document.mozFullScreen && !document.webkitIsFullScreen)
	) {
		// métodos actuales
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

function fullScreenOff() {
	if (document.fullscreenElement != null) {
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	}
}
