//* Comprobar si es palindromo usando Strings
/*
let cadena;
let cadenaLC;

cadena = prompt("Escribe la frase para comprobar: ");
cadenaLC = cadena.toLocaleLowerCase().replace(/ /g, '');
fraseRevert = cadenaLC.split('').reverse().join('');

if (cadenaLC == fraseRevert) {
    document.write("La cadena introducida es un palindromo");
} else {
    document.write("La cadena introducida no es un palindromo")
}
*/

//* Comprobar si es palindromo usando Arrays 
//! Da false si tiene 'puntos', 'comas' u otros simbolos
let cadena;
// Pedir cadena de texto por prompt
cadena = prompt("Introduce una cadena de texto:")
function esPalindromo(cadena) {
    // Convertir la cadena a minúsculas y quitar espacios
    let cadenaSinEspacios = cadena
        .toLowerCase()
        .replace(/ /g, '');

    // Convertir la cadena sin espacios a un array de caracteres
    let caracteres = cadenaSinEspacios.split('');

    // Crear un array inverso de los caracteres
    let caracteresInversos = caracteres
        .slice()
        .reverse();

    // Verificar si la cadena original y la inversa son iguales
    return cadenaSinEspacios === caracteresInversos.join('');
}

if (esPalindromo(cadena) === true) {
    document.write("La cadena introducida es un palindromo.");
} else {
    document.write("La cadena introducida no es un palindromo.")
}