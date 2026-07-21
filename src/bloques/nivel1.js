/* =============================================================
   NIVEL 1 - ROMPECABEZAS
   Cada pieza es una imagen del tamaño completo del tablero
   (936x681) con el resto transparente, ya recortada en su
   posición correcta. Por eso, para "armar" el rompecabezas
   basta con soltar cada pieza sobre el tablero: todas se
   superponen exactamente en (0,0) y forman la imagen completa.
   ============================================================= */

window.Nivel1 = (function () {

  const RATIO_ANCHO = 936;
  const RATIO_ALTO = 681;

  let board = null;
  let boardWrap = null;
  let tray = null;
  let guiaImg = null;

  let total = 0;
  let colocadas = 0;

  let onProgress = null;
  let onComplete = null;

  function ajustarTablero() {
    if (!board || !boardWrap) return;

    const anchoDisponible = boardWrap.clientWidth;
    const altoDisponible = boardWrap.clientHeight;
    if (anchoDisponible <= 0 || altoDisponible <= 0) return;

    const ratio = RATIO_ANCHO / RATIO_ALTO;
    let ancho = anchoDisponible;
    let alto = ancho / ratio;

    if (alto > altoDisponible) {
      alto = altoDisponible;
      ancho = alto * ratio;
    }

    board.style.width = Math.floor(ancho) + 'px';
    board.style.height = Math.floor(alto) + 'px';
  }

  function barajar(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function limpiar() {
    if (tray) tray.innerHTML = '';
    if (board) {
      board.querySelectorAll('.puzzle-pieza-colocada').forEach((el) => el.remove());
    }
  }

  function colocarPiezaEnTablero(src) {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'puzzle-pieza-colocada';
    img.draggable = false;
    board.appendChild(img);
  }

  function crearPiezaArrastrable(src) {
    const pieza = document.createElement('div');
    pieza.className = 'puzzle-pieza';

    const img = document.createElement('img');
    img.src = src;
    img.draggable = false;
    pieza.appendChild(img);

    tray.appendChild(pieza);

    let arrastrando = false;
    let offsetX = 0;
    let offsetY = 0;

    pieza.addEventListener('pointerdown', (e) => {
      arrastrando = true;
      pieza.setPointerCapture(e.pointerId);

      const rect = pieza.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      pieza.style.width = rect.width + 'px';
      pieza.style.height = rect.height + 'px';
      pieza.style.left = rect.left + 'px';
      pieza.style.top = rect.top + 'px';
      pieza.classList.add('arrastrando');
    });

    pieza.addEventListener('pointermove', (e) => {
      if (!arrastrando) return;
      pieza.style.left = (e.clientX - offsetX) + 'px';
      pieza.style.top = (e.clientY - offsetY) + 'px';
    });

    function soltar(e) {
      if (!arrastrando) return;
      arrastrando = false;

      // Medir la posición ANTES de quitar la clase 'arrastrando', ya que
      // esa clase es la que aplica position:fixed durante el arrastre.
      const boardRect = board.getBoundingClientRect();
      const piezaRect = pieza.getBoundingClientRect();
      const centroX = piezaRect.left + piezaRect.width / 2;
      const centroY = piezaRect.top + piezaRect.height / 2;

      pieza.classList.remove('arrastrando');

      const margen = 30;
      const dentro =
        centroX >= boardRect.left - margen &&
        centroX <= boardRect.right + margen &&
        centroY >= boardRect.top - margen &&
        centroY <= boardRect.bottom + margen;

      if (dentro) {
        colocarPiezaEnTablero(src);
        pieza.remove();
        colocadas++;
        if (onProgress) onProgress(colocadas, total);
        if (colocadas >= total && onComplete) {
          onComplete();
        }
      } else {
        pieza.style.left = '';
        pieza.style.top = '';
        pieza.style.width = '';
        pieza.style.height = '';
      }
    }

    pieza.addEventListener('pointerup', soltar);
    pieza.addEventListener('pointercancel', soltar);
  }

  let resizeListenerListo = false;

  function cargarActividad(config, callbacks) {
    board = document.getElementById('puzzle-board');
    boardWrap = document.getElementById('puzzle-board-wrap');
    tray = document.getElementById('puzzle-tray');
    guiaImg = document.getElementById('puzzle-guia');

    guiaImg.src = config.guia;

    onProgress = (callbacks && callbacks.onProgress) || null;
    onComplete = (callbacks && callbacks.onComplete) || null;

    limpiar();
    ajustarTablero();

    if (!resizeListenerListo) {
      window.addEventListener('resize', ajustarTablero);
      window.addEventListener('orientationchange', ajustarTablero);
      resizeListenerListo = true;
    }

    total = config.piezas.length;
    colocadas = 0;
    if (onProgress) onProgress(colocadas, total);

    const orden = barajar(config.piezas);
    orden.forEach((src) => crearPiezaArrastrable(src));
  }

  return {
    cargarActividad,
    ajustarTablero
  };
})();
