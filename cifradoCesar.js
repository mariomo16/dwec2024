let texto = prompt("Escriba el texto que desea cifrar o descifrar");
let clave = prompt("Escribe el código");
let opcion = confirm("Pulsa Aceptar para cifrar y Cancelar para descifrar");

if (opcion == true) {
    do {
        if (isNaN(parseInt(clave))) {
            alert("No has escrito un número");
        }
    } while (isNaN(parseInt(clave)));
    clave = parseInt(clave);
    for (let letra of texto) {
        let cifra = letra.charCodeAt(letra) + clave;
        document.write(String.fromCharCode(cifra));
    }
} else {
    do {
        if (isNaN(parseInt(clave))) {
            alert("No has escrito un número");
        }
    } while (isNaN(parseInt(clave)));
    clave = parseInt(clave);
    for (let letra of texto) {
        let cifra = letra.charCodeAt(letra) - clave;
        document.write(String.fromCharCode(cifra));
    }
}