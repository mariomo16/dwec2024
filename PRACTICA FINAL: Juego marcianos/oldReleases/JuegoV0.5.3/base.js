/*

    TODAS LAS VARIABLES
    VENTANA MODAL y EVENTO BOTÓN PARA EMPEZAR

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

// Comprobar el tamaño de la ventana del usuario

// Ajustes de la nave del jugador
const naveJugador = document.getElementById("naveJugador"); // Puntero a la imagen de la nave
let coordenadaX; // Ajuste horizontal
let coordenadaY; // Ajuste vertical
const velocidadJugador = 10; // Pixeles que se moverá la nave

const teclasPulsadas = new Map(); // Mapa donde se guardaran las teclas pulsadas para el movimiento

let crearElementoIMG; // Variable para crear los elementos img necesarios (naves enemigas, misiles...)

// Ajustes de los misiles
let misiles; // Variable para guardar el NodeList de los misiles
const velocidadMisiles = 15; // Velocidad del misil
const coordenadasMisiles = []; // Array para guardar las coordenadas de los misiles

// Ajustes de las naves enemigas
const lienzo = document.getElementById("lienzo"); // div donde se generaran los enemigos
const navesEnemigas = document.getElementsByClassName("naveEnemiga"); // NodeList con todas las naves enemigas existentes
const coordenadasEnemigos = []; // Array para almacenar las coordenadas de los enemigos
let puntuacionEnemigo; // Para definir que puntuacion dara cada enemigo en X dificultad

// Intervals usados
let intervalDuracion; // Interval para contar los segundos en partida
let intervaloMover; // Interval para mover enemigos y misiles cada .2 seg
let intervalColisiones; // Interval para comprobar si existe colisión con los enemigos
let intervalMisiles; // Interval para comprobar si un misil ha impactado
let moverNave;

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
