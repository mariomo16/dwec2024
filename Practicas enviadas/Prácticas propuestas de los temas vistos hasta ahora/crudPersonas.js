/*

    * Para mostrar la fecha de nacimiento he usado el metodo .toISOString()
        * https://www.w3schools.com/js/js_date_formats.asp
        * https://stackoverflow.com/questions/34053715/how-to-output-date-in-javascript-in-iso-8601-without-milliseconds-and-with-z
            * BTW, this also works for getting just the date with a slight modification: new Date().toISOString().split('T')[0] – krowe2 Sep 10, 2018 at 20:43

    * Para la expresión regular de la fecha de nacimiento he buscado una ya hecha
        *https://stackoverflow.com/questions/22061723/regex-date-validation-for-yyyy-mm-dd
            * This will match yyyy-mm-dd and also yyyy-m-d
            * Vinod answered Feb 27, 2014 at 7:30
            * rboy edited Jul 31, 2018 at 22:06

    * Las funciones modificarCliente() y borrarCliente() usan un ID (El propio indice en este casi) para buscar y modificar/borrar el cliente, ya que asi no hace falta escribir el nombre completo
        * Si al salir el prompt para introducir los datos le da a 'Cancelar', ese dato concreto quedara como estaba, sin modificar

 */

// Array para almacenar los clientes
let clientes = [];

// Expresiones regulares
let expNombre = new RegExp(/^[A-Za-z ñ]+$/);
let expEdad = new RegExp(/^[\d]+$/);
let expFechaNacimiento = new RegExp(
    /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
);

// Funcion para crear un cliente
function crearCliente() {
    // Pido los datos del nuevo cliente por prompt y compruebo con expresiones
    // regulares
    let nombreCompleto = prompt("Introduce el nombre completo del cliente:")
    while (expNombre.test(nombreCompleto) === false) {
        nombreCompleto = prompt(
            "Introduce el nombre completo del cliente: \n¡Recuerda que solamente puede cont" +
            "ener letras (incluyendo ñ)!"
        );
    }

    let edad = prompt(`Introduce la edad de: ${nombreCompleto}`)
    while (expEdad.test(edad) === false) {
        edad = prompt(
            `Introduce la edad de: ${nombreCompleto} \n¡Recuerda que solamente puede contener digitos!`
        );
    }

    let fechaNacimiento = prompt(
        `Introduce la fecha de nacimiento de: ${nombreCompleto} \n(FORMATO: yyyy-MM-dd)`
    )
    while (expFechaNacimiento.test(fechaNacimiento) === false) {
        fechaNacimiento = prompt(
            `Introduce la fecha de nacimiento de: ${nombreCompleto} \n¡Recuerda que el formato es: (yyyy-MM-dd)!`
        );
    }

    // Creo el objeto cliente con los datos introducidos
    cliente = {
        nombre: nombreCompleto,
        edad: edad,
        fechaNacimiento: new Date(fechaNacimiento)
            .toISOString()
            .split('T')[0]
    }
    // Añado el objeto cliente que acabo de crear al Array 'clientes'
    clientes.push(cliente);
}

// Funcion para listar todos los clientes
function listarClientes() {
    // Creo la variable listaClientes con 2 saltos de linea al final para que se
    // separe del texto siguiente
    let listaClientes = "Lista de clientes:\n";
    // Concateno la variable listClientes y todos los datos de los clientes en el
    // forEach(callback)
    clientes.forEach(
        cliente => listaClientes += `\nNombre: ${cliente.nombre} \nEdad: ${cliente.edad} \nFecha de nacimiento: ${cliente.fechaNacimiento} \nID: ${clientes.indexOf(cliente)}\n`
    );
    if (clientes.length > 0) {
        alert(listaClientes);
        // Si esta funcion se hace sin concatenar la variable en el forEach, se muesta
        // cada cliente por separado, y hasta que no aceptes no se muestra el siguiente
    } else {
        // En el caso de que no haya clientes, se mostrara un mensaje
        alert("No hay clientes para mostrar.");
    }
}

// Funcion para buscar un cliente por nombre
function buscarCliente() {
    // Pido el nombre del cliente a buscar
    let nombreBusqueda = prompt("Ingrese el nombre del cliente a buscar:");
    // Uso el metodo .filter para crear otro array con los resultados de la busqueda
    // Si uso .find, solamente me devuelve el primer resultado que encuentre. Uso
    // .includes, para que pueda encontrar a un cliente solamente por el nombre, sin
    // necesidad de escribir los apellidos
    let resultado = clientes.filter(
        clientes => clientes.nombre.toLowerCase().includes(nombreBusqueda.toLowerCase())
    );

    // La funcion de abajo (v1) no usa filter, necesita escribir el nombre completo
    /*
    let resultado = clientes.filter(
        clientes => clientes.nombre.toLowerCase() === nombreBusqueda.toLowerCase()
    );
    */

    // Concateno la variable listClientes y todos los datos de los clientes que se
    // han encontrado y guardado en el nuevo array con el forEach(callback)
    let listaClientes = "Lista de clientes:\n";
    resultado.forEach(
        cliente => listaClientes += `\nNombre: ${cliente.nombre} \nEdad: ${cliente.edad} \nFecha de nacimiento: ${cliente.fechaNacimiento} \nID: ${clientes.indexOf(cliente)}\n`
    );
    // Si se han encontrado 1 o mas resultados, los muestro por pantalla, en el caso
    // de que no se haya encontrado nada, muestro un mensaje
    if (resultado.length > 0) {
        alert(listaClientes);
    } else {
        alert("No se ha encontrado ningún cliente con ese nombre.");
    }
}

// Funcion para ordenar los clientes por nombre
function ordenarClientes() {
    // Le paso una funcion flecha al metodo sort para comparar el valor ASCII de 2
    // valores, 'a' y 'b', y ordena segun el resultado
    clientes.sort((a, b) => a.nombre.localeCompare(b.nombre));
    alert("Clientes ordenados por nombre.");
}

// Funcion para modificar los clientes
function modificarCliente() {
    let idBusqueda = prompt("Introduce el ID del cliente que quieres borrar:");
    if (idBusqueda < clientes.length && clientes.length > 0) {
        // Pido los datos modificados del cliente por prompt y compruebo con expresiones
        // regulares, si es null (Cancelar), el nombre se quedara como esta
        let nombreCompleto = prompt(
            "Introduce el nuevo nombre completo del cliente: \n(Cancelar para dejar como es" +
            "ta)"
        );
        while (expNombre.test(nombreCompleto) === false && nombreCompleto !== null) {
            nombreCompleto = prompt(
                "Introduce el nuevo nombre completo del cliente: \n¡Recuerda que solamente pued" +
                "e contener letras (incluyendo ñ)! \n(Cancelar para dejar como esta)"
            );
        }
        if (nombreCompleto === null) {
            nombreCompleto = clientes[idBusqueda].nombre;
        }
        clientes[idBusqueda].nombre = nombreCompleto;

        let edad = prompt(
            `Introduce la edad de: ${nombreCompleto} \n(Cancelar para dejar como esta)`
        );
        while (expEdad.test(edad) === false && edad !== null) {
            edad = prompt(
                `Introduce la edad de: ${nombreCompleto} \n¡Recuerda que solamente puede contener digitos! \n(Cancelar para dejar como esta)`
            );
        }
        if (edad === null) {
            edad = clientes[idBusqueda].edad;
        }
        clientes[idBusqueda].edad = edad;

        let fechaNacimiento = prompt(
            `Introduce la fecha de nacimiento de: ${nombreCompleto} \n(FORMATO: yyyy-MM-dd) \n(Cancelar para dejar como esta)`
        );
        while (
            expFechaNacimiento.test(fechaNacimiento) === false && fechaNacimiento !== null
        ) {
            fechaNacimiento = prompt(
                `Introduce la fecha de nacimiento de: ${nombreCompleto} \n¡Recuerda que el formato es: (yyyy-MM-dd)! \n(Cancelar para dejar como esta)`
            );
        }
        if (fechaNacimiento === null) {
            fechaNacimiento = clientes[idBusqueda].fechaNacimiento
        }
        clientes[idBusqueda].fechaNacimiento = fechaNacimiento;
    } else {
        alert(`No se ha encontrado ningun cliente con ID: ${idBusqueda}`);
    }
}

// Funcion para borrar un cliente
function borrarCliente() {
    let idBusqueda = prompt("Introduce el ID del cliente que quieres borrar:");
    if (idBusqueda < clientes.length && idBusqueda > -1) {
        clienteBorrado = clientes.splice(idBusqueda, 1);
        alert(
            `Se ha borrado el cliente: ${clienteBorrado[0].nombre} \n¡Recuerda revisar los IDs antes de volver a borrar y/o modificar otro cliente!`
        );
    } else {
        alert(`No existe ningun cliente con ID: ${idBusqueda}`);
    }
}

// Objetos literales para no tener que introducir un nuevo cliente al hacer
// pruebas
cliente = {
    nombre: "Mario Morales Ortega",
    edad: "21",
    fechaNacimiento: new Date('2002-10-03')
        .toISOString()
        .split('T')[0]
}
clientes.push(cliente);

cliente = {
    nombre: "Alberto Ortega",
    edad: "28",
    fechaNacimiento: new Date('1995-09-26')
        .toISOString()
        .split('T')[0]
}
clientes.push(cliente);

// Menú
let opcion;
do {
    opcion = prompt(
        "¿Que quieres hacer? (Cancelar para salir)\n \n1. Crear cliente \n2. Listar tod" +
        "os los clientes \n3. Buscar un cliente \n4. Ordenar clientes por nombre \n5. M" +
        "odificar cliente \n6. Borrar clientes"
    )
    switch (opcion) {
        case '1':
            crearCliente();
            break;
        case '2':
            listarClientes();
            break;
        case '3':
            buscarCliente();
            break;
        case '4':
            ordenarClientes();
            break;
        case '5':
            modificarCliente();
            break;
        case '6':
            borrarCliente();
            break;
        default:
            if (opcion !== null) {
                alert("Selecciona una opcion");
            }
            break;
    }
} while (opcion !== null);