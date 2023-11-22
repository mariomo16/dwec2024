## v0.1.0 Creación del juego
 - Aparece una ventana modal para mostrar un formulario al usuario
   - Le pide al usuario elegir dificultad (que cambiara el número de enemigos), entre otras cosas
 - La nave enemiga se mueve rebotando contra los margenes de la pantalla
 - La nave del jugador se mueve (solamente arriba, derecha, izquierda, abajo)
   - La nave del jugador puede salirse de los limites de la pantalla
## v0.1.2 
 - Al mover la nave ahora comprueba los margenes de la pantalla para no salirse
   - Corregido error que hacia que los margenes no fueran correctos
     - Corregido error que hacia que los margenes laterales no fueran correctos
   - Corregido un error con los margenes si se ejecuta con la consola de desarrollador abierta
## v0.2.1
 - Ahora la nave se puede mover en diagonal
 - Agregado auto focus al campo nombre del formulario
 - Centrado la nave del jugador para todas las resoluciones
 - Optimizado creación de enemigos
 - Creado Evento para crear misiles (tecla: 'space')
 - Corregido otro error con los margenes de la pantalla, al haber cambiado el CSS