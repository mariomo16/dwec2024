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
    29 de noviembre de 2023
    ---------------------------------------
    Versión: 
    0.7.1
    ---------------------------------------
    Notas de la Versión: 
    - Las naves explotadas no se quedaran en pantalla con la animación
    - Ahora el audio del laser se reproducirá cada vez que se lance, sin esperar a que termine el (audio) anterior
    - Se reproducirá un sonido al impactar una nave enemiga (explosion)
    - Corregido posición inicial misiles
    - La nave ahora muestra un fuego propulsor al moverse

    !Avisos:
    - Tarda un poco en variar la ruta de los enemigos
    
    Fuentes:
    - Obtener el viewport del cliente para poner limite al body y que las naves no se salgan de la pantalla
        https://stackoverflow.com/questions/16776764/move-div-with-javascript-inside-bodys-limits

    - Para poder mover la nave del jugador en diagonal
        https://stackoverflow.com/questions/5203407/how-to-detect-if-multiple-keys-are-pressed-at-once-using-javascript
    
    - Para obtener los códigos de cada tecla necesaria
        https://www.toptal.com/developers/keycode

    - Por algún motivo, la función de colisiones de MDN no me funcionaba, encontré un video con exactamente la misma función explicándola y me funciono
        https://www.youtube.com/watch?v=r0sy-Cr6WHY&t

    - Iterar 2 "Arrays" (NodeList) para hacer la comprobación de impacto de misiles
        https://stackoverflow.com/questions/40095117/looping-over-two-arrays-with-different-length-and-correctly-sorting-the-output
    
    - Que información sale en cada navegador con navigator.userAgent
        https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent

        https://stackoverflow.com/questions/10258012/does-javascript-settimeout-stop-other-script-execution

    - Reproducir audio SIN ESPERAR A QUE TERMINE EL MISMO AUDIO ANTERIOR
        https://stackoverflow.com/questions/66989726/audio-play-without-waiting-for-previous-sound-to-end

*/

// ---------- Variables necesarias ---------- //

// Para crear la ventana modal y el formulario que estará dentro de esta
const ventanaModal = document.createElement("dialog");
const formulario = document.createElement("form");

// Opciones del jugador
let nombreJugador;
let dificultad;
let puntuacion = 0;
let duracionPartida = 0;

// Ajustes de la nave del jugador
const naveJugador = document.getElementById("naveJugador"); // Puntero a la imagen de la nave
let coordenadaX; // Ajuste horizontal
let coordenadaY; // Ajuste vertical
let velocidadJugador = 5; // Pixeles que se moverá la nave

const teclasPulsadas = new Map(); // Mapa donde se guardaran las teclas pulsadas para el movimiento

let crearElementoIMG; // Variable para crear los elementos img necesarios (naves enemigas, misiles...)
const crearPropulsorIMG = document.createElement("img");

// Ajustes de los misiles
let misiles; // Variable para guardar el NodeList de los misiles
let velocidadMisiles = 15; // Velocidad del misil
const coordenadasMisiles = []; // Array para guardar las coordenadas de los misiles

// Ajustes de las naves enemigas
const lienzo = document.getElementById("lienzo"); // div donde se generaran los enemigos
const navesEnemigas = document.getElementsByClassName("naveEnemiga"); // NodeList con todas las naves enemigas existentes
const coordenadasEnemigos = []; // Array para almacenar las coordenadas de los enemigos
let puntuacionEnemigo; // Para definir que puntuación dará cada enemigo en X dificultad
let randomSpeed; // Velocidad según el navegador
let navesExplotadas = document.getElementsByClassName("boom");

// Intervals usados
let intervalDuracion; // Interval para contar los segundos en partida
let intervaloMover; // Interval para mover enemigos y misiles cada .2 seg
let intervalColisiones; // Interval para comprobar si existe colisión con los enemigos cada .2 seg
let moverNave; // Interval para que el movimiento de la nave sea fluido (.5 seg) -Eloy
let intervalRandomize; // Interval para hacer aleatorio el movimiento de las naves

const audioPerderPartida = new Audio("./sounds/sfx_lose.ogg"); // Sonido al perder una partida

// Necesita estar en una función para que se pueda reproducir aunque el anterior no haya terminado
function audioLaser() {
	const audioLanzarMisil = new Audio("./sounds/sfx_laser1.ogg"); // Sonido al lanzar un misil
	audioLanzarMisil.play();
}
function audioExplosion() {
	const audioExplosion = new Audio("./sounds/boom.wav"); // Sonido al explotar una nave enemiga
	audioExplosion.play();
}

// Imagen "propulsor" que se mostrara al mover la nave del jugador
crearPropulsorIMG.setAttribute("class", "propulsor");
crearPropulsorIMG.setAttribute("src", "./images/fuegoPropulsor.png");
crearPropulsorIMG.setAttribute("hidden", "true");
document.body.appendChild(crearPropulsorIMG);

/*
?Por algún motivo, la velocidad varia entre Chrome y Firefox (los que yo uso normalmente), 
asi que necesito saber cual se esta usando para cambiar la velocidad según eso
*/
if (navigator.userAgent.includes("Chrome")) {
	velocidadJugador = 5;
	velocidadMisiles = 8;
	randomSpeed = (Math.random() + 1.6) * 1.7;
} else if (navigator.userAgent.includes("Firefox")) {
	velocidadJugador = 5;
	velocidadMisiles = 10;
	randomSpeed = (Math.random() + 2.5) * 1.7;
}

// Para que el usuario no pueda poner/quitar pantalla completa el solo
window.addEventListener("keydown", (e) => {
	if (e.key === "F11") {
		e.preventDefault();
	}
});

// Creo y muestro la ventana modal con un texto y el formulario
ventanaModal.setAttribute("open", "true");
ventanaModal.innerHTML = `
    <h1>Juego Marcianos</h1>
    <p>
        ¡Elimina a todos los enemigos <span class="sub">en el menor tiempo posible</span>!
    </p>`;

formulario.innerHTML = `
    <label for="nombre">Nombre de jugador</label><br />
    <input type="text" id="nombre" placeholder="Introduce un nombre"/>
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
    <input type="checkbox" id="guardarPuntuacion" checked />
    <br />
    <input type="button" id="fullScreen" value="Cambiar pantalla completa" />
    <input type="button" id="startGame" value="Empezar partida" disabled />`;

// Pongo la ventana modal en el body del HTML
document.body.appendChild(ventanaModal);
// Pongo el formulario dentro de la ventana modal
ventanaModal.appendChild(formulario);

// Evento para deshabilitar el enter
// Al pulsar enter mientras el formulario estaba activo, parecía que recargaba la página
ventanaModal.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		e.preventDefault();
	}
});

// Para que el usuario decida si quiere jugar o no en pantalla completa
document.getElementById("fullScreen").addEventListener("click", fullScreenMode);

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
	document
		.getElementById("fullScreen")
		.removeEventListener("click", fullScreenMode);
	// Recojo el nombre del jugador
	nombreJugador = document.getElementById("nombre").value;
	// Obtengo el valor del radio "dificultad", para saber cuantos enemigos crear
	dificultad = document.querySelector('input[name="dificultad"]:checked').value;
	// Según la dificultad seleccionada, creo X numero de enemigos
	let numeroEnemigos;
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
	// Elimino el evento del botón
	document.getElementById("startGame").removeEventListener;
	// Elimino la ventana modal
	ventanaModal.remove();
	/*
    Necesitaba darle valores a X e Y antes de mover la nave para que detectara las colisiones sin 
    necesidad de moverse al menos 1 vez previamente
    */
	coordenadaY = naveJugador.offsetTop;
	coordenadaX = naveJugador.offsetLeft;
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
				velocidad: randomSpeed,
			});
		}, 300 * i);
	}
	// Empiezo un contador para saber cuanto dura la partida
	intervalDuracion = setInterval(() => {
		duracionPartida++;
	}, 1000);

	// Evento para mover la nave del jugador, con W-A-S-D o con las flechas
	document.addEventListener("keydown", (e) => {
		// Compruebo si la tecla pulsada esta dentro de 'teclasPulsadas', si no es asi, lo añado
		if (!teclasPulsadas.has(e.key)) {
			teclasPulsadas.set(e.key);
		}
	});
	// Eliminar tecla del mapa 'teclasPulsadas' al dejar de pulsarla
	document.addEventListener("keyup", (e) => {
		teclasPulsadas.delete(e.key);
	});
	// EVENTO DISPARAR MISILES
	document.addEventListener(
		"keyup",
		(e) => {
			// CREAR MISILES (Espacio)
			if (e.key === " ") {
				crearElementoIMG = document.createElement("img");
				crearElementoIMG.setAttribute("class", "misiles");
				crearElementoIMG.setAttribute(
					"src",
					"./images/Lasers/laserJugador.png",
				);
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
				audioLaser(); // Reproduzco el audio al lanzar un misil
			}
		},
		5,
	);
});

moverNave = setInterval(() => {
	/*
    Cada 'if' comprueba si la nueva posición choca con el borde, si es asi, dejaría el valor en 0 (para dejarlo en el borde)
    o en el caso de que sea derecha/abajo, dejaría el valor en el Height/Width de la ventana
    */
	if (
		// MOVER ARRIBA DERECHA (W || ArrowUp) & (D || ArrowRight)
		(teclasPulsadas.has("w") || teclasPulsadas.has("ArrowUp")) &&
		(teclasPulsadas.has("d") || teclasPulsadas.has("ArrowRight"))
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
		(teclasPulsadas.has("w") || teclasPulsadas.has("ArrowUp")) &&
		(teclasPulsadas.has("a") || teclasPulsadas.has("ArrowLeft"))
	) {
		coordenadaY = naveJugador.offsetTop;
		coordenadaY = Math.max(0, coordenadaY - velocidadJugador);
		naveJugador.style.top = `${coordenadaY}px`;

		coordenadaX = naveJugador.offsetLeft;
		coordenadaX = Math.max(0, coordenadaX - velocidadJugador);
		naveJugador.style.left = `${coordenadaX}px`;
	} else if (teclasPulsadas.has("w") || teclasPulsadas.has("ArrowUp")) {
		// MOVER ARRIBA (W || ArrowUp)
		coordenadaY = naveJugador.offsetTop;
		coordenadaY = Math.max(0, coordenadaY - velocidadJugador);
		naveJugador.style.top = `${coordenadaY}px`;
	} else if (
		// MOVER ABAJO DERECHA (S || ArrowDown) & (D || ArrowRight)
		(teclasPulsadas.has("s") || teclasPulsadas.has("ArrowDown")) &&
		(teclasPulsadas.has("d") || teclasPulsadas.has("ArrowRight"))
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
		(teclasPulsadas.has("s") || teclasPulsadas.has("ArrowDown")) &&
		(teclasPulsadas.has("a") || teclasPulsadas.has("ArrowLeft"))
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
	} else if (teclasPulsadas.has("s") || teclasPulsadas.has("ArrowDown")) {
		// MOVER ABAJO (S || ArrowDown)
		coordenadaY = naveJugador.offsetTop;
		coordenadaY = Math.min(
			document.body.clientHeight - naveJugador.offsetHeight,
			coordenadaY + velocidadJugador,
		);
		naveJugador.style.top = `${coordenadaY}px`;
	} else if (teclasPulsadas.has("d") || teclasPulsadas.has("ArrowRight")) {
		// MOVER DERECHA (D || ArrowRight)
		coordenadaX = naveJugador.offsetLeft;
		coordenadaX = Math.min(
			document.body.clientWidth - naveJugador.offsetWidth,
			coordenadaX + velocidadJugador,
		);
		naveJugador.style.left = `${coordenadaX}px`;
	} else if (teclasPulsadas.has("a") || teclasPulsadas.has("ArrowLeft")) {
		// MOVER IZQUIERDA (A || ArrowLeft)
		coordenadaX = naveJugador.offsetLeft;
		coordenadaX = Math.max(0, coordenadaX - velocidadJugador);
		naveJugador.style.left = `${coordenadaX}px`;
	}

	if (
		teclasPulsadas.has("a") ||
		teclasPulsadas.has("w") ||
		teclasPulsadas.has("s") ||
		teclasPulsadas.has("d") ||
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
});

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
		} else {
			// Si no se ha borrado, muevo el misil a la nueva coordenada
			misiles[i].style.top = `${String(coordenadasMisiles[i].y)}px`;
		}
	}
}
// Cada 2 mili-segundos se va a ejecutar la función para mover a los enemigos y misiles
intervaloMover = setInterval(mover, 2);

/*
intervalRandomize = setInterval(() => {
	coordenadasEnemigos[0].controlX = Math.random() * 1.3;
	coordenadasEnemigos[0].controlY = Math.random() * 1.3;
}, 3000);
*/

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
			timeoutExplosion = setTimeout(() => {
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
				audioExplosion(); // Audio explosion nave enemiga
				// Quito el elemento para que no se siga viendo la explosion
				setTimeout(() => {
					navesExplotadas[0].remove();
				}, 1000);
				//navesEnemigas[j].remove(); // Elimino el elemento del HTML
				misiles[i].remove(); // Elimino el elemento misil del HTML
				coordenadasMisiles.splice(i, 1); // Elimino sus coordenadas
				puntuacion = puntuacion + puntuacionEnemigo; // Sumo la puntuación
				comprobarPartida(); // Compruebo si quedan mas enemigos
			}
		}
	}
}
// Cada 2 mili-segundos se va a ejecutar la función para comprobar colisiones
intervalColisiones = setInterval(comprobarColision, 2);

// Función para comprobar si quedan enemigos, en el caso que no queden, se termina la partida
function comprobarPartida() {
	if (navesEnemigas.length <= 0) {
		partidaGanada();
	}
}
// Función para eliminar los intervals y mostrar una ventana con información al ganar
function partidaGanada() {
	//clearInterval(intervaloMover); // Parar el movimiento de los enemigos
	clearInterval(intervalColisiones); // Parar el interval que comprueba colisiones
	//clearInterval(moverNave); // Parar el interval que comprueba para mover la nave
	// Muestro una ventana modal con la información de la partida
	ventanaModal.innerHTML = `
        <h1>Juego Marcianos</h1>
        <p>
            ¡Enhorabuena, <span class="sub">has destruido a todos los enemigos</span>! ${nombreJugador}<br />
            <span class="izquierda">Has obtenido <span class="puntuacionFinal">[${puntuacion}]</span> puntos en modo <span class="puntuacionFinal">[${dificultad}]</span>.</span><br />            <span class="izquierda">Duración de partida: ${duracionPartida} segundos.</span>
            </p>
        <br />
        <input type="button" id="fullScreen" value="Cambiar pantalla completa" class="izquierda" />
        <input type="button" value="Volver a jugar" class="derecha" disabled>`;

	ventanaModal.setAttribute("open", "true");
	document.body.appendChild(ventanaModal);
	document
		.getElementById("fullScreen")
		.addEventListener("click", fullScreenMode);
}
// Función para eliminar los intervals y mostrar una ventana con información al perder
function partidaPerdida() {
	clearInterval(intervaloMover); // Parar el movimiento de los enemigos
	clearInterval(intervalColisiones); // Parar el interval que comprueba colisiones
	clearInterval(moverNave); // Parar el interval que comprueba para mover la nave
	audioPerderPartida.play(); // Audio que se reproducirá al perder
	// Muestro una ventana modal con la información de la partida
	ventanaModal.innerHTML = `
        <h1>Juego Marcianos</h1>
        <p>
            ¡Han destruido tu nave!, <span class="sub">intenta tener mas cuidado la proxima vez</span>, ${nombreJugador}.<br />
            <span class="izquierda">Has obtenido <span class="puntuacionFinal">[${puntuacion}]</span> puntos en modo <span class="puntuacionFinal">[${dificultad}]</span>.</span><br />
            <span class="izquierda">Duración de partida: ${duracionPartida} segundos.</span>
        </p>
        <br />
        <input type="button" id="fullScreen" value="Cambiar pantalla completa" class="izquierda" />
        <input type="button" value="Volver a jugar" class="derecha" disabled>`;

	ventanaModal.setAttribute("open", "true");
	document.body.appendChild(ventanaModal);
	document
		.getElementById("fullScreen")
		.addEventListener("click", fullScreenMode);
}

function fullScreenMode() {
	// Si no esta en pantalla completa, se pondrá al pulsar el botón
	if (document.fullscreenElement == null) {
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
	// Si esta en pantalla completa, se quitara al pulsar el botón
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
