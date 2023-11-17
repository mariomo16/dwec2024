/*

  Nombre del archivo: tablaDinamicaV1.js
  Autor: Mario Morales Ortega (1745008)
  Fecha de creación: 14 de noviembre de 2023

  Descripción:
  Script para hacer los campos de una tabla HTML editable.

  Modificaciones:
  - 14/11/2023: Creado el script para hacer la tabla dinámica

  Observaciones:
  - Solamente puedes editar 1 tabla a la vez

*/

let botonGuardar = document.getElementById("botonGuardarCambios");
let botonDescartar = document.getElementById("botonDescartarCambios");

function editarFila(nodo) {
  // Necesito hacerlo asi :p
  tablaSinModificar = document.getElementById("tabla1").innerHTML;
  // Cambio el texto del <span/> seleccionado
  nodo.value = "Editando";
  // Muestro los botones para guardar/descartar cambios
  botonGuardar.removeAttribute("hidden");
  botonDescartar.removeAttribute("hidden");
  // Obtengo el padre del nodo <span/> seleccionado
  let nodoTd = nodo.parentNode; // Nodo: TD
  // Obtengo el padre del nodo <td/> seleccionado
  let nodoTr = nodoTd.parentNode; // Nodo: TR
  // Bucle para hacer los campos de la fila seleccionada editable
  for (let i = 1; i < nodoTr.children.length - 1; i++) {
    nodoTr.children[i].setAttribute("contenteditable", "true");
  }
  let botonEditar = document.getElementsByClassName("botonEditar");
  for (let i = 0; i < botonEditar.length; i++) {
    botonEditar[i].setAttribute("disabled", "true");
  }
}

function guardarCambios() {
  // Obtengo un NodeList con todos los <td/>
  let nodosTd = document.getElementsByTagName("td");
  let spanHTML;
  // Bucle para quitar el atributo 'contenteditable' de lodos los nodos <td/>
  for (let i = 0; i < nodosTd.length; i++) {
    nodosTd[i].removeAttribute("contenteditable");
    // Compruebo si el nodo tiene hijos para saber si es el <td/> con el <span/>
    // y en el caso de que sea, guardo su HTML para que no se borre después
    if (nodosTd[i].hasChildNodes) {
      spanHTML = nodosTd[i].innerHTML;
    }
    // Solamente cambio el valor para que no se quede ningún <br/> si das enter en el campo, aunque borres ese enter,
    // siempre se queda x1 <br/> en el HTML (aunque no se vea visualmente) si no cambias el textContent
    nodosTd[i].textContent = nodosTd[i].textContent;
    if (nodosTd[i].hasChildNodes) {
      nodosTd[i].innerHTML = spanHTML;
    }
  }
  // Obtengo los nodos que tienen la clase editar (todos los <span/>)
  let spanEditar = document.getElementsByClassName("botonEditar");
  // Cambio el texto "Editando" a "Editar"
  for (let i = 0; i < spanEditar.length; i++) {
    spanEditar[i].innerHTML = "Editar";
  }
  // Escondo nuevamente los botones para guardar/descartar cambios
  botonGuardar.setAttribute("hidden", "true");
  botonDescartar.setAttribute("hidden", "true");

  let botonEditar = document.getElementsByClassName("botonEditar");
  for (let i = 0; i < botonEditar.length; i++) {
    botonEditar[i].removeAttribute("disabled");
    botonEditar[i].value = "Editar";
  }
}

function descartarCambios() {
  document.getElementById("tabla1").innerHTML = tablaSinModificar;
  // Escondo nuevamente los botones para guardar/descartar cambios
  botonGuardar.setAttribute("hidden", "true");
  botonDescartar.setAttribute("hidden", "true");
  let botonEditar = document.getElementsByClassName("botonEditar");
  for (let i = 0; i < botonEditar.length; i++) {
    botonEditar[i].removeAttribute("disabled");
    botonEditar[i].value = "Editar";
  }
}
