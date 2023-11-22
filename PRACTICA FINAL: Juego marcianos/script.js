/*      COMENTARIOS DE ALGUNAS COSAS QUE HABÍA USADO Y NO QUIERO PERDER     */


// MOVER LA NAVE (SOLAMENTE ARRIBA, ABAJO, DERECHA, IZQUIERDA)
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

// MOVER LA NAVE (SOLAMENTE ARRIBA, ABAJO, DERECHA, IZQUIERDA)
/*
document.addEventListener("keydown", (e) => {
    // console.log(e);
    if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
        coordenadaY = parseInt(getComputedStyle(naveJugador).bottom);
        naveJugador.style.bottom = coordenadaY + velocidadJugador + "px";
    }
    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        coordenadaX = parseInt(getComputedStyle(naveJugador).left);
        naveJugador.style.left = coordenadaX - velocidadJugador + "px";
    }
    if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
        coordenadaY = parseInt(getComputedStyle(naveJugador).bottom);
        naveJugador.style.bottom = coordenadaY - velocidadJugador + "px";
    }
    if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        coordenadaX = parseInt(getComputedStyle(naveJugador).left);
        naveJugador.style.left = coordenadaX + velocidadJugador + "px";
    }
});
*/

// MOVER LA NAVE (SOLAMENTE ARRIBA, ABAJO, DERECHA, IZQUIERDA) COMPROBANDO LOS BORDES DE LA PANTALLA
/*
document.addEventListener("keydown", (e) => {
    // MOVER ARRIBA
    if (e.key === "w" || e.key === "W" || e.key === "ArrowUp") {
        coordenadaY = naveJugador.offsetTop;
        coordenadaY = Math.max(0, coordenadaY - velocidadJugador);
        naveJugador.style.top = coordenadaY + "px";
    }
    // MOVER ABAJO
    if (e.key === "s" || e.key === "S" || e.key === "ArrowDown") {
        coordenadaY = naveJugador.offsetTop;
        coordenadaY = Math.min(
            viewportHeight - naveJugador.offsetHeight,
            coordenadaY + velocidadJugador
        );
        naveJugador.style.top = coordenadaY + "px";
    }
    // MOVER IZQUIERDA
    if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft") {
        coordenadaX = naveJugador.offsetLeft;
        // En este caso le pongo naveJugador.offsetWidth/2 porque se comía media nave al poner 0
        coordenadaX = Math.max(
            naveJugador.offsetWidth / 2,
            coordenadaX - velocidadJugador
        );
        naveJugador.style.left = coordenadaX + "px";
    }
    // MOVER DERECHA
    if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
        coordenadaX = naveJugador.offsetLeft;
        // En este caso le pongo naveJugador.offsetWidth/2 porque la nave se paraba antes de tocar el borde,
        // concretamente se paraba el 50% del width de la nave antes
        coordenadaX = Math.min(
            viewportWidth - naveJugador.offsetWidth / 2,
            coordenadaX + velocidadJugador
        );
        naveJugador.style.left = coordenadaX + "px";
    }
});
*/

// COMPROBAR TAMAÑO PANTALLA PARA DISTINTOS NAVEGADORES
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

// FUNCIÓN PARA COMPROBAR COLISIONES
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