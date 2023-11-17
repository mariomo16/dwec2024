/*
  Nombre del archivo: tablaDinamicaV1.1.js
  Autor: Mario Morales Ortega (1745008)
  Fecha de creación: 14 de noviembre de 2023

  Descripción:
  Script para hacer los campos de una tabla HTML editable con 'contenteditable'.

  Los botones antes los hice con span, asi que pude ser que algún comentario/variable
  se llame "span" en vez de boton
*/

let botonGuardar = document.getElementById("botonGuardarCambios");
let botonDescartar = document.getElementById("botonDescartarCambios");
// Creo una variable vacía para poder guardar el contenido de la tabla
let tablaSinModificar = ""; 

function editarFila(nodo) {
  /*
    Aquí hago una comprobación, para saber si la variable global esta vacía o no,
    en las funciones guardar/descartarCambios, vuelvo a vaciar la variable para que solamente guarde datos
    después de haber guardado o descartados los cambios
  */
  if (tablaSinModificar == "") {
    tablaSinModificar = document.getElementById("tabla1").innerHTML;
  }
  // Cambio el texto del boton seleccionado
  nodo.value = "Editando";
  // Deshabilito el botón pulsado
  nodo.setAttribute("disabled", "true");
  // Muestro los botones para guardar/descartar cambios
  botonGuardar.removeAttribute("hidden");
  botonDescartar.removeAttribute("hidden");
  // Obtengo el padre del boton seleccionado
  let nodoTd = nodo.parentNode; // Nodo: TD
  // Obtengo el padre del nodo <td/> seleccionado
  let nodoTr = nodoTd.parentNode; // Nodo: TR
  // Bucle para hacer los campos de la fila seleccionada editable
  for (let i = 1; i < nodoTr.children.length - 1; i++) {
    nodoTr.children[i].setAttribute("contenteditable", "true");
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
  // Escondo nuevamente los botones para guardar/descartar cambios
  botonGuardar.setAttribute("hidden", "true");
  botonDescartar.setAttribute("hidden", "true");

  // Obtengo los nodos (botones) que tienen la clase editar
  let botonEditar = document.getElementsByClassName("botonEditar");
  // Cambio el texto "Editando" a "Editar"
  for (let i = 0; i < botonEditar.length; i++) {
    botonEditar[i].removeAttribute("disabled");
    botonEditar[i].value = "Editar";
  }
  tablaSinModificar = "";
}

function descartarCambios() {
  // Sobrescribo el HTML con el que estaba guardado en la variable
  document.getElementById("tabla1").innerHTML = tablaSinModificar;
  // Escondo nuevamente los botones para guardar/descartar cambios
  botonGuardar.setAttribute("hidden", "true");
  botonDescartar.setAttribute("hidden", "true");
  // Cambio los botones de editar a como estaban
  let botonEditar = document.getElementsByClassName("botonEditar");
  for (let i = 0; i < botonEditar.length; i++) {
    botonEditar[i].removeAttribute("disabled");
    botonEditar[i].value = "Editar";
  }
  // Vacío el String donde se guarda el html de la tabla sin modificar
  tablaSinModificar = "";
}
