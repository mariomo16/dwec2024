/*

  Nombre del archivo: crudClientesV1.js
  Autor: Mario Morales Ortega (1745008)
  Fecha de creación: 24 de octubre de 2023

  Descripción:
  Esta aplicación web maneja una lista de clientes (CRUD: crear, leer, actualizar, y borrar) usando .prompt() en RAM

  Modificaciones:
  - 24/10/2023: Creación del script
  - 25/10/2023: Modificado función buscarCliente() y creado expresiones regulares para los datos
  - 26/10/2023: Creado funciones para modificar/borrar clientes por ID (indice)
  - 30/10/2023: Correcciones de código

  Fuente:
  - Para la expresión regular de la fecha de nacimiento he buscado una ya hecha
    https://stackoverflow.com/questions/22061723/regex-date-validation-for-yyyy-mm-dd

  - Para mostrar la fecha de nacimiento he usado el método .toISOString()
    https://stackoverflow.com/questions/34053715/how-to-output-date-in-javascript-in-iso-8601-without-milliseconds-and-with-z

*/

// Array para almacenar los clientes
let clientes = [];

// Expresiones regulares
let expNombre = new RegExp(/^[A-Za-z ñ]+$/); // Solamente letras de A-Z incluyendo Ñ (obligatorio)
let expEdad = new RegExp(/^[\d]+$/); // Solamente números (obligatorio)
let expFechaNacimiento = new RegExp(
  /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
); // ? Solamente deja poner cifras validas para una fecha (incluyendo - para separar)

// Función para crear un cliente
function CrearCliente() {
  // Pido los datos del nuevo cliente por prompt y compruebo con expresiones regulares
  let nombreCompleto = prompt("Introduce el nombre completo del cliente:");
  while (expNombre.test(nombreCompleto) === false) {
    nombreCompleto = prompt(
      "Introduce el nombre completo del cliente: \n¡Recuerda que solamente puede contener letras (incluyendo ñ)!"
    );
  }

  let edad = prompt(`Introduce la edad de: ${nombreCompleto}`);
  while (expEdad.test(edad) === false) {
    edad = prompt(
      `Introduce la edad de: ${nombreCompleto} \n¡Recuerda que solamente puede contener dígitos!`
    );
  }

  let fechaNacimiento = prompt(
    `Introduce la fecha de nacimiento de: ${nombreCompleto} \n(FORMATO: yyyy-MM-dd)`
  );
  while (expFechaNacimiento.test(fechaNacimiento) === false) {
    fechaNacimiento = prompt(
      `Introduce la fecha de nacimiento de: ${nombreCompleto} \n¡Recuerda que el formato es: (yyyy-MM-dd)!`
    );
  }

  // Creo el objeto cliente con los datos introducidos
  let cliente = {
    nombre: nombreCompleto,
    edad: edad,
    fechaNacimiento: new Date(fechaNacimiento).toISOString().split("T")[0],
  };
  // Añado el objeto cliente que acabo de crear al Array 'clientes'
  clientes.push(cliente);
}

// Función para listar todos los clientes
function listarClientes() {
  // Creo la variable listaClientes con 2 saltos de linea al final para que se separe del texto siguiente
  let listaClientes = "Lista de clientes:\n";
  // Concateno (+=) la variable listaClientes y todos los datos de los clientes en el forEach(callback)
  // Le paso una función callback para añadir la información de todos los clientes a la variable
  clientes.forEach(
    (cliente) =>
      (listaClientes += `\nNombre: ${cliente.nombre} \nEdad: ${
        cliente.edad
      } \nFecha de nacimiento: ${
        cliente.fechaNacimiento
      } \nID: ${clientes.indexOf(cliente)}\n`)
  );
  if (clientes.length > 0) {
    alert(listaClientes);
    // Si esta función se hace sin concatenar la variable en el forEach, se muestra
    // cada cliente por separado, y hasta que no aceptes no se muestra el siguiente
  } else {
    // En el caso de que no haya clientes, se mostrara un mensaje
    alert("No hay clientes para mostrar.");
  }
}

// Función para buscar un cliente por nombre
function buscarCliente() {
  // Pido el nombre del cliente a buscar
  let nombreBusqueda = prompt("Ingrese el nombre del cliente a buscar:");
  /*
    Uso el método .filter para crear otro array con los resultados de la búsqueda
    Si uso .find, solamente me devuelve el primer resultado que encuentre, y
    uso .includes, para que pueda encontrar a un cliente sin necesidad de escribir el nombre completo

    Esta función no usa includes, necesita escribir el nombre completo

    let resultado = clientes.filter(
        clientes => clientes.nombre.toLowerCase() === nombreBusqueda.toLowerCase()
    );
  */
  let resultado = clientes.filter((clientes) =>
    clientes.nombre.toLowerCase().includes(nombreBusqueda.toLowerCase())
  );

  // Concateno la variable listaClientes y todos los datos de los clientes que se
  // han encontrado y guardado en el nuevo array con el forEach(callback)
  let listaClientes = "Lista de clientes:\n";
  resultado.forEach(
    (cliente) =>
      (listaClientes += `\nNombre: ${cliente.nombre} \nEdad: ${
        cliente.edad
      } \nFecha de nacimiento: ${
        cliente.fechaNacimiento
      } \nID: ${clientes.indexOf(cliente)}\n`)
  );
  // Si se han encontrado 1 o mas resultados, los muestro por pantalla
  if (resultado.length > 0) {
    alert(listaClientes);
  } else {
    // En el caso de que no se encuentre/exista un cliente con ese nombre muestro un mensaje
    alert("No se ha encontrado ningún cliente con ese nombre.");
  }
}

// Función para ordenar los clientes por nombre
function ordenarClientes() {
  // Le paso una función flecha al método sort para comparar el valor ASCII de 2 valores 'a' y 'b', y ordena según el resultado
  // en este caso compara a.nombre y b.nombre para ordenarlos
  clientes.sort((a, b) => a.nombre.localeCompare(b.nombre));
  alert("Clientes ordenados por nombre.");
}

// Función para modificar los clientes
function modificarCliente() {
  let idBusqueda = prompt("Introduce el ID del cliente que quieres borrar:");
  if (idBusqueda < clientes.length && clientes.length > 0) {
    // Pido los datos modificados del cliente por prompt y compruebo con expresiones
    // regulares, si es null (Cancelar), el nombre se quedara como esta, sin modificar
    let nombreCompleto = prompt(
      "Introduce el nuevo nombre completo del cliente: \n(Cancelar para dejar como es" +
        "ta)"
    );
    while (
      expNombre.test(nombreCompleto) === false &&
      nombreCompleto !== null
    ) {
      nombreCompleto = prompt(
        "Introduce el nuevo nombre completo del cliente: \n¡Recuerda que solamente puede" +
          "contener letras (incluyendo ñ)! \n(Cancelar para dejar como esta)"
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
        `Introduce la edad de: ${nombreCompleto} \n¡Recuerda que solamente puede contener dígitos! \n(Cancelar para dejar como esta)`
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
      expFechaNacimiento.test(fechaNacimiento) === false &&
      fechaNacimiento !== null
    ) {
      fechaNacimiento = prompt(
        `Introduce la fecha de nacimiento de: ${nombreCompleto} \n¡Recuerda que el formato es: (yyyy-MM-dd)! \n(Cancelar para dejar como esta)`
      );
    }
    if (fechaNacimiento === null) {
      fechaNacimiento = clientes[idBusqueda].fechaNacimiento;
    }
    clientes[idBusqueda].fechaNacimiento = fechaNacimiento;
  } else {
    // En el caso de que no se encuentre/exista un cliente con ese ID, muestro un mensaje
    alert(`No se ha encontrado ningún cliente con ID: ${idBusqueda}`);
  }
}

// Función para borrar un cliente
function borrarCliente() {
  // Creo una variable para almacenar los datos del cliente borrado, y poder mostrar sus datos una ultima vez
  let clienteBorrado;
  let idBusqueda = prompt("Introduce el ID del cliente que quieres borrar:");
  if (idBusqueda < clientes.length && idBusqueda > -1) {
    clienteBorrado = clientes.splice(idBusqueda, 1);
    alert(
      `Se ha borrado el cliente: ${clienteBorrado[0].nombre} \n¡Recuerda revisar los IDs antes de volver a borrar y/o modificar otro cliente!`
    );
  } else {
    // En el caso de que no se encuentre/exista un cliente con ese ID, muestro un mensaje
    alert(`No se ha encontrado ningún cliente con ID: ${idBusqueda}`);
  }
}

// Objetos literales para no tener que introducir un nuevo cliente al hacer pruebas
let cliente = {
  nombre: "Mario Morales Ortega",
  edad: "21",
  fechaNacimiento: new Date("2002-10-03").toISOString().split("T")[0],
};
clientes.push(cliente);

cliente = {
  nombre: "Alberto Ortega",
  edad: "28",
  fechaNacimiento: new Date("1995-09-26").toISOString().split("T")[0],
};
clientes.push(cliente);

// Menú
let opcion;
do {
  opcion = prompt(
    "¿Que quieres hacer? (cancelar para salir)\n \n1. Crear cliente \n2. Listar todos los clientes" +
      "\n3. Buscar un cliente \n4. Ordenar clientes por nombre" +
      "\n5. Modificar cliente \n6. Borrar clientes"
  );
  switch (opcion) {
    case "1":
      CrearCliente();
      break;
    case "2":
      listarClientes();
      break;
    case "3":
      buscarCliente();
      break;
    case "4":
      ordenarClientes();
      break;
    case "5":
      modificarCliente();
      break;
    case "6":
      borrarCliente();
      break;
    default:
      if (opcion !== null) {
        alert("Selecciona una opción");
      }
      break;
  }
} while (opcion !== null);
