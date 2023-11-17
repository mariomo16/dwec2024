/*

  Nombre del archivo: crudClientesV2.js
  Autor: Mario Morales Ortega (1745008)
  Fecha de creación: 06 de noviembre de 2023

  Descripción:
  Esta aplicación web maneja una lista de clientes (CRUD: crear, leer, actualizar, y borrar) con el modelo DOM (Document Object Model) en RAM

  Modificaciones:
  - 06/11/2023: Creación del script
  - 07/11/2023: Optimizaciones de código y creación de funciones para "limpiar" los datos en pantalla
  - 12/11/2023: Optimizaciones de código y cambiado la forma en la que se formatea la fecha

  !Avisos:
  - Al crear un 'cliente' LITERAL con la fecha en formato dd/MM/yyyy, se lee como mm/DD/yyyy, y puede causar errores
    Ej: "26/09/1995" mostrara "Invalid date"

  TODOs:
  - Un botón para comprobar datos introducidos

  Fuente:
  - Para mostrar la fecha de nacimiento he usado el método .toLocaleDateString() con formato es-ES y pasándole un objeto como opción
    https://www.aprenderaprogramar.com/index.php?option=com_content&view=article&id=846:formato-fechas-javascript-tostring-tolocaledatestring-tolocaletimestrig-totimestring-ejemplo-cu01163e&catid=78&Itemid=206

*/

// Array para almacenar los clientes
let clientes = [];

/*
  Creo un objeto para poder mostrar la fecha en el formato que yo quiera.
  Si solamente uso .toLocaleDateString("es-ES"), mostrara: "03/10/2002 0:00:00",
  si solamente uso .toLocaleDateString(fecha), muestra exactamente lo mismo.
*/
let fecha = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
};

// Objetos literales para no tener que introducir un nuevo cliente al hacer pruebas
let cliente = {
  nombre: "Mario Morales Ortega",
  edad: "21",
  fechaNacimiento: new Date("2002-10-03").toLocaleDateString("es-ES", fecha),
};
clientes.push(cliente);

cliente = {
  nombre: "Alberto Ortega",
  edad: "28",
  fechaNacimiento: new Date("1995-09-26").toLocaleDateString("es-ES", fecha),
};
clientes.push(cliente);

// Función para crear un cliente
function CrearCliente() {
  // Recojo los datos del nuevo cliente introducidos en el formulario
  let nombreCompleto = document.getElementById("nombreCompleto").value;
  let edad = parseInt(document.getElementById("edad").value);
  let fechaNacimiento = document.getElementById("fechaNacimiento").value;

  // Creo el objeto cliente con los datos introducidos
  let cliente = {
    nombre: nombreCompleto,
    edad: edad,
    fechaNacimiento: new Date(fechaNacimiento).toLocaleString("es-ES", fecha),
  };
  // Añado el objeto cliente que acabo de crear a clientes[]
  clientes.push(cliente);
  // Limpio los campos del formulario
  document.getElementById("crearClientes").reset();
}

// Función para listar todos los clientes
function listarClientes() {
  let tablaHTML = crearTabla(); // Le asigno la función para crear una tabla HTML
  let listaClientes = ""; // Le asigno un valor para poder concatenar mas tarde

  // En el caso de que clientes[] tenga 1/+ objetos
  if (clientes.length > 0) {
    // Bucle para obtener todos los datos de los objetos dentro de clientes[], y mostrarlos dentro de una tabla HTML
    clientes.forEach((cliente) => {
      listaClientes += `
        <tr>
          <td>${cliente.nombre}</td>
          <td>${cliente.edad}</td>
          <td>${cliente.fechaNacimiento}</td>
          <td>${clientes.indexOf(cliente)}</td>
        </tr>
      `;
    });
    // Muestro la tabla con los resultados
    document.getElementById("tabla").innerHTML = tablaHTML + listaClientes;
  } else {
    // En el caso de que clientes[] este vacío
    document.getElementById("contenido").innerHTML =
      "<span>No hay clientes para mostrar</span>";
  }
}

// Función para buscar un cliente por nombre
function buscarCliente() {
  // Recojo el valor introducido en el campo "nombre" del formulario "manejarClientes"
  let nombreBusqueda = document.getElementById("nombre").value;

  // Uso el método .includes() para obtener todos los resultados que contengan el valor introducido anteriormente
  // Y se lo paso al método .filter para crear otro Array con los objetos que .includes() ha obtenido
  let resultado = clientes.filter((clientes) =>
    clientes.nombre.toLowerCase().includes(nombreBusqueda.toLowerCase())
  );

  let tablaHTML = crearTabla(); // Le asigno la función para crear una tabla HTML
  let listaClientes = ""; // Le asigno un valor para poder concatenar mas tarde

  // Bucle para obtener todos los datos de los objetos dentro de resultado[],
  // y concatenar a la variable creada anteriormente para poder mostrarlos por pantalla dentro de una tabla mas tarde
  resultado.forEach(
    (cliente) =>
      (listaClientes += `
      <tr>
        <td>${cliente.nombre}</td>
        <td>${cliente.edad}</td>
        <td>${cliente.fechaNacimiento}</td>
        <td>${clientes.indexOf(cliente)}</td>
      </tr>
      `)
  );

  // Si no se ha introducido ningún valor
  if (nombreBusqueda == "") {
    document.getElementById("datos").innerHTML =
      "<br/><b>¡Introduce un nombre para buscar un cliente!</b>";
  } else if (resultado.length > 0) {
    // Si hay 1/+ objeto dentro de resultado[]
    document.getElementById("tabla").innerHTML = tablaHTML + listaClientes;
    // Y limpio el campo "nombre" para que no necesite borrar antes de buscar otro cliente
    limpiarDatos();
  } else {
    // En el caso de que resultado[] este vacío
    document.getElementById("datos").innerHTML =
      "<br/>No se ha encontrado ningún cliente con ese nombre";
  }
}

// Función para ordenar los clientes por nombre
function ordenarClientes() {
  // Comparo la propiedad "nombre" de los objetos dentro de clientes[] y los ordeno
  clientes.sort((a, b) => a.nombre.localeCompare(b.nombre));

  // En el caso de que clientes[] tenga 1/+ objetos
  if (clientes.length > 0) {
    // Llamo a la función listarClientes(), para (volver a) listar todos los clientes, pero ya ordenados
    listarClientes();
    // Agrego una linea al HTML para informar que los clientes han sido ordenados
    document.getElementById("tabla").innerHTML +=
      "<p>Los clientes han sido ordenados alfabeticamente.</p>";
  } else {
    // En el caso de que clientes[] este vacío
    document.getElementById("datos").innerHTML =
      "<span>No hay clientes para ordenar.</span>";
  }
}

// Función para modificar los clientes
function modificarCliente() {
  // Recojo el valor introducido en el campo "nombre"
  let idBusqueda = document.getElementById("nombre").value;

  // Si no se ha introducido ningún valor
  if (idBusqueda == "") {
    document.getElementById("datos").innerHTML =
      "<br/><b>¡Introduce un ID para modificar un cliente!</b>";
  } else if (clientes[idBusqueda] !== undefined) {
    /*
      Si el ID (indice) existe dentro de clientes[], muestro un formulario para rellenarlo con los nuevos datos,
      en el caso de que no se introduzcan nuevos datos en cualquiera de los campos, ese valor en concreto se quedara sin modificar.
      
      Se creara un botón para poder llamar a la función guardarDatos(newNombre, newEdad, newFechaNacimiento, idBusqueda)
    */
    document.getElementById("datos").innerHTML = `
      <br/>
      <form>
        <fieldset>
          <legend>Datos del cliente a modificar</legend>
          <table id="tabla">
            <tr>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Fecha de nacimiento</th>
              <th>ID</th>
            </tr>
            <tr>
              <td>${clientes[idBusqueda].nombre}</td>
              <td>${clientes[idBusqueda].edad}</td>
              <td>${clientes[idBusqueda].fechaNacimiento}</td>
              <td>${clientes.indexOf(clientes[idBusqueda])}</td>
            </tr>
          </table>
        </fieldset>
        <br/>
        <fieldset>
          <legend class="legendDatos">Introduce solamente los datos que quieres cambiar</legend>
          <label for="nombre">Nombre completo: </label>
          <input type="text" id="newNombre" /><br />
          <label for="edad">Edad: </label>
          <input type="number" id="newEdad" /><br />
          <label for="fechaNacimiento">Fecha de nacimiento: </label>
          <input type="date" id="newFechaNacimiento" />
          <br/><br/>
          <input type="button" value="Guardar datos" onclick="guardarDatos(document.getElementById('newNombre').value, document.getElementById('newEdad').value, document.getElementById('newFechaNacimiento').value, '${idBusqueda}')" />
        </fieldset>
      </form>
    `;
  } else {
    // Si no existe ningún objeto con ese ID (indice)
    document.getElementById(
      "datos"
    ).innerHTML = `<br/>No se ha encontrado ningún cliente con ID: ${idBusqueda}`;
  }
  limpiarDatos();
}

function guardarDatos(nombreCompleto, edad, fechaNacimiento, idBusqueda) {
  // Le asigno a las variables los nuevos datos, en el caso de que no se haya escrito nada, se obtiene ""
  nombreCompleto = document.getElementById("newNombre").value;
  edad = document.getElementById("newEdad").value;
  fechaNacimiento = document.getElementById("newFechaNacimiento").value;

  // Compruebo si había introducido algún dato en el campo nombre
  if (nombreCompleto === "") {
    // En el caso de que no se haya introducido nada (se envía ""), le asigno nombre que tiene actualmente para que no cambie luego
    nombreCompleto = clientes[idBusqueda].nombre;
  }
  // Cambio el nombre del cliente
  clientes[idBusqueda].nombre = nombreCompleto;

  if (edad === "") {
    // En el caso de que no se haya introducido nada (se envía ""), le asigno la edad que tiene actualmente para que no cambie luego
    edad = clientes[idBusqueda].edad;
  }
  // Cambio la edad del cliente
  clientes[idBusqueda].edad = edad;

  if (fechaNacimiento === "") {
    // En el caso de que no se haya introducido nada (se envía ""), le asigno la fecha de nacimiento que tiene actualmente para que no cambie luego
    fechaNacimiento = clientes[idBusqueda].fechaNacimiento;
  }
  // Cambio la fecha de nacimiento del cliente
  clientes[idBusqueda].fechaNacimiento = fechaNacimiento;

  // Muestro los nuevos datos que tiene el cliente modificado
  document.getElementById("datos").innerHTML = `
    <br/>
    <form>
      <fieldset>
        <legend>Nuevos datos del cliente modificado</legend>
        <table id="tabla">
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Fecha de nacimiento</th>
            <th>ID</th>
          </tr>
          <tr>
            <td>${clientes[idBusqueda].nombre}</td>
            <td>${clientes[idBusqueda].edad}</td>
            <td>${clientes[idBusqueda].fechaNacimiento}</td>
            <td>${clientes.indexOf(clientes[idBusqueda])}</td>
          </tr>
        </table>
      </fieldset>
      <br/>
    `;

  // Limpio el campo "nombre" para que no sea necesario borrar antes de modificar otro cliente
  limpiarDatos();
}

// Función para borrar un cliente
function borrarCliente() {
  let clienteBorrado; // Creo una variable para almacenar los datos del cliente borrado, y poder mostrar su nombre una ultima vez
  let idBusqueda = document.getElementById("nombre").value; // Recojo el valor introducido en el campo "nombre"

  // En el caso de que no se introduzca ningún valor
  if (idBusqueda == "") {
    document.getElementById(
      "datos"
    ).innerHTML = `<br/s><b>¡Introduce un ID para borrar un cliente!</b>`;
  } else if (clientes[idBusqueda] != undefined) {
    // Si el ID (indice) existe dentro de clientes[], saco ese objeto de clientes[] y lo meto en la variable creada anteriormente para poder mostrar su nombre
    clienteBorrado = clientes.splice(idBusqueda, 1);
    document.getElementById(
      "datos"
    ).innerHTML = `<br/>Se ha borrado el cliente: <span id="textoClienteBorrado">${clienteBorrado[0].nombre}</span> <br/>¡Recuerda revisar los IDs antes de volver a borrar o modificar otro cliente!`;
  } else {
    // En el caso de que no se encuentre/exista un cliente con ese ID (indice)
    document.getElementById(
      "datos"
    ).innerHTML = `<br/>No se ha encontrado ningún cliente con ID: ${idBusqueda}`;
  }
  // Limpio el campo "nombre" para que no sea necesario borrar el texto antes de borrar otro cliente
  limpiarDatos();
}

// Función para crear la tabla HTML
function crearTabla() {
  // Le asigno el código HTML a la variable crearTabla
  let tablaHTML = `
    <table id="tabla" class="listaClientes">
      <tr>
        <th>Nombre</th>
        <th>Edad</th>
        <th>Fecha de nacimiento</th>
        <th>ID</th>
      </tr>
    </table>
  `;
  // Modifico el HTML que este dentro de <div id="datos"> para agregar la tabla
  document.getElementById("datos").innerHTML = tablaHTML;
  // Devuelvo la variable con el código HTML
  return tablaHTML;
}

// Función para limpiar todo lo que haya dentro del <div> donde se generan los campos (y el capo de buscar/modificar/borrar cliente)
function limpiarPantalla() {
  // Borro todo lo que haya dentro del <div> con id="datos"
  document.getElementById("datos").innerHTML = "";
}

// Función para limpiar el campo de buscar/modificar/borrar cliente
function limpiarDatos() {
  // Borro el valor que este escrito dentro del campo "nombre" del formulario "manejarClientes"
  document.getElementById("manejarClientes").reset();
}
