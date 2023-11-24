/*

    EVENTO DE EMPEZAR EL JUEGO
    EVENTO DE MOVERSE
    FUNCIÓN TERMINAR PARTIDA

*/

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
        numeroEnemigos = 3;
    }
    if (dificultad == "normal") {
        numeroEnemigos = 6;
    }
    if (dificultad == "dificil") {
        numeroEnemigos = 9;
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
    });

    document.addEventListener("keyup", (e) => {
        // CREAR MISILES (Espacio)
        if (teclasPulsadas.has(" ")) {
            crearElementoIMG = document.createElement("img");
            crearElementoIMG.setAttribute("class", "misiles");
            crearElementoIMG.setAttribute(
                "src",
                "./images/Lasers/laserRed07.png"
            );
            document.body.appendChild(crearElementoIMG);
            // Le pongo el estilo al misil creado para que aparezca donde yo quiero
            crearElementoIMG.style.top = naveJugador.offsetTop + "px";
            crearElementoIMG.style.left = naveJugador.offsetLeft + "px";
            /*
            Dentro del array creado al principio, añado un objeto con la propiedad 'Y'
            (que sera la única necesaria aquí), para que cada misil tenga coordenadas independientes
            y le asigno como 'coordenada Y' por defecto que sea la parte superior de la nave del jugador y se empiece a mover desde ahí
            */
            coordenadasMisiles.push({
                y: parseInt(crearElementoIMG.style.top),
                x: parseInt(crearElementoIMG.style.left),
            });
        }
    });

    // Eliminar tecla del mapa 'teclasPulsadas' al dejar de pulsarla
    document.addEventListener("keyup", (e) => {
        teclasPulsadas.delete(e.key);
    });
});

/* Add: Start a "throttle" timer that prevents next keyboard processing
    until timer completed */
throttle = setTimeout(() => {
    throttle = null;

    /* Your throttle interval - reduce/increase this number to suit you needs */
}, 1000);

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
