## v0.1.0 Creación del juego
 - Aparece una ventana modal para mostrar un formulario al usuario
   - Le pide al usuario elegir dificultad (que cambiara el número de enemigos), entre otras cosas
 - La nave enemiga se mueve rebotando contra los margenes de la pantalla
 - La nave del jugador se mueve (solamente arriba, derecha, izquierda, abajo)
   - La nave del jugador puede salirse de los limites de la pantalla
## v0.2.0 
 - Al mover la nave ahora comprueba los margenes de la pantalla para no salirse
## v0.2.1 
 - Corregido error que hacia que los margenes no fueran correctos
## v0.2.2
 - Corregido error que hacia que los margenes laterales no fueran correctos
 - Corregido un error que hacia que al ejecutar el juego en una ventana con tamaño distinto al "normal", los margenes se quedarían con los definidos al principio aunque cambie el tamaño mas tarde
   - EJ: Al ejecutar con la consola de desarrollador abierta, los margenes serian EN TODO MOMENTO, el espacio entre la consola y el margen contrario
## v0.3.0
 - Ahora la nave se puede mover en diagonal
## v0.3.1
 - Agregado auto focus al campo nombre del formulario
 - Centrado la nave del jugador para todas las resoluciones
 - Optimizado creación de enemigos
 - Creado Evento para crear misiles (tecla: 'space')
   - Por ahora se quedan en la esquina de la pantalla sin moverse