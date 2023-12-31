## v0.5.3 (Los misiles pueden impactar, mejorado movimiento jugador)
 - Los misiles destruirán la nave enemiga que impacten
 - Al eliminar a todos los enemigos, o al morir, saldrá una ventana con información
 - Cambiado evento de disparar "keydown" -> "keyup" para evitar que se mantenga la pulsación y que no deje de disparar
 - Los misiles desaparecerán al destruir la nave enemiga
 - El movimiento de la nave ahora es fluido
   - Corregido el error al pulsar rápidamente "A" y "D" (la nave solamente se movía a la izquierda)
   - Corregido el error que no permitía moverse sin volver a pulsar la tecla después de disparar un misil
 - Ya no se podrá mover la nave al terminar la partida
 - Corregido el fallo de colisiones si el jugador no se movía al principio
 - Centrado la posición iniciar del misil al lanzarlo
 - El juego iniciara en pantalla completa, y se quitara automáticamente al terminar
## v0.4.0 (Colisiones con enemigos, y movimientos independientes)
 - Optimizaciones de código (mas información dentro de main.js)
 - Sustituido métodos evento.keyCode (deprecado) por evento.key
 - Los enemigos ya no comparten las variables controlX/Y, y ahora tienen movimientos COMPLETAMENTE independientes.
   - Para que no tengan el mismo recorrido durante toda la duración del juego, al crear cada enemigo, se le asigna una velocidad entre 6 y 10
 - Ahora se detectan las colisiones entre el jugador y cualquier enemigo
   - Si el jugador no se mueve hacia abajo/arriba al menos 1 vez, no se detectara su colisión en ningún momento.
 - Al colisionar con un enemigo, se terminara la partida (Se eliminaran los eventos, y se mostrara una ventana con información)
 - Los misiles se eliminaran al desaparecer de la pantalla, en vez de al tocar el borde superior
## v0.3.0 (Enemigos y misiles con distintas coordenadas)
 - Optimización de código
 - Ahora cada enemigo tiene su propia coordenada (BUG?)
 - Ahora cada misil tiene su propia coordenada y se mueve hacia arriba (al tocar el limite, se borran del DOM)
 - Ahora la nave no se podrá mover, ni se podrá lanzar misiles antes de empezar la partida
## v0.2.1 (Movimiento diagonal y lanzamiento misiles)
 - Ahora la nave se puede mover en diagonal
 - Agregado auto focus al campo nombre del formulario
 - Centrado la nave del jugador para todas las resoluciones
 - Optimizado creación de enemigos
 - Creado Evento para crear misiles (tecla: 'space')
   - Por ahora los misiles no hacen nada (no se mueven)
 - Corregido otro error con los margenes de la pantalla, al haber cambiado el CSS
## v0.1.3 (Bloqueados margenes para el jugador)
 - Al mover la nave ahora comprueba los margenes de la pantalla para no salirse
   - Corregido error que hacia que los margenes no fueran correctos
     - Corregido error que hacia que los margenes laterales no fueran correctos
   - Corregido un error con los margenes si se ejecuta con la consola de desarrollador abierta
## v0.1.0 (Creación del script)
 - Aparece una ventana modal para mostrar un formulario al usuario
   - Le pide al usuario elegir dificultad (que cambiara el número de enemigos), entre otras cosas
 - La nave enemiga se mueve rebotando contra los margenes de la pantalla
 - La nave del jugador se mueve (solamente arriba, derecha, izquierda, abajo)
   - La nave del jugador puede salirse de los limites de la pantalla