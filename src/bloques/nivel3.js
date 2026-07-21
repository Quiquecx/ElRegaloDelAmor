/* =============================================================
   NIVEL 3 - "¿CUÁL NO PERTENECE?"
   Se muestran 3 ilustraciones por grupo; el niño debe tocar la
   que expresa algo diferente a las otras dos. Respuesta correcta
   suena "correcto.mp3" y avanza; respuesta incorrecta suena
   "error.mp3" y permite reintentar.
   ============================================================= */

window.Nivel3 = (function () {

  let contenedor = null;
  let bloqueado = false;

  function limpiar() {
    if (contenedor) contenedor.innerHTML = '';
  }

  function crearTarjeta(src, esCorrecta, callbacks) {
    const tarjeta = document.createElement('button');
    tarjeta.type = 'button';
    tarjeta.className = 'n3-tarjeta';

    const img = document.createElement('img');
    img.src = src;
    img.draggable = false;
    tarjeta.appendChild(img);

    tarjeta.addEventListener('click', () => {
      if (bloqueado) return;

      if (esCorrecta) {
        bloqueado = true;
        tarjeta.classList.add('n3-correcta');
        if (callbacks && callbacks.onCorrecto) callbacks.onCorrecto();
      } else {
        tarjeta.classList.add('n3-incorrecta');
        setTimeout(() => tarjeta.classList.remove('n3-incorrecta'), 500);
        if (callbacks && callbacks.onIncorrecto) callbacks.onIncorrecto();
      }
    });

    return tarjeta;
  }

  function barajarConIndice(imagenes, indiceCorrecta) {
    const items = imagenes.map((src, i) => ({ src, esCorrecta: i === indiceCorrecta }));
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function cargarGrupo(config, callbacks) {
    contenedor = document.getElementById('n3-tablero');
    bloqueado = false;
    limpiar();

    const items = barajarConIndice(config.imagenes, config.indiceCorrecta);

    items.forEach(({ src, esCorrecta }) => {
      const tarjeta = crearTarjeta(src, esCorrecta, callbacks);
      contenedor.appendChild(tarjeta);
    });
  }

  return {
    cargarGrupo
  };
})();
