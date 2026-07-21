/* =============================================================
   NIVEL 2 - A COLOREAR
   Relleno de áreas (flood fill) sobre un canvas. El niño elige
   un color de la paleta y toca una zona del dibujo para
   pintarla.
   ============================================================= */

window.Nivel2 = (function () {

  const COLORES = [
    '#E63946', '#FF7A3D', '#FFD4B2', '#FCE94F',
    '#8BD450', '#3FA796', '#4FA8E8', '#5E4483',
    '#C179C1', '#F7A6C4', '#8D5A44', '#4A4458',
    '#B77D55'
  ];

  const TOLERANCIA = 55;

  let canvas = null;
  let ctx = null;
  let paletaEl = null;

  let colorSeleccionado = COLORES[0];
  let imagenActualSrc = null;
  let paletaConstruida = false;
  let canvasListenerListo = false;

  function hexToRgb(hex) {
    const v = hex.replace('#', '');
    return {
      r: parseInt(v.substring(0, 2), 16),
      g: parseInt(v.substring(2, 4), 16),
      b: parseInt(v.substring(4, 6), 16)
    };
  }

  function coloresParecidos(r1, g1, b1, r2, g2, b2, tolerancia) {
    return (
      Math.abs(r1 - r2) <= tolerancia &&
      Math.abs(g1 - g2) <= tolerancia &&
      Math.abs(b1 - b2) <= tolerancia
    );
  }

  function construirPaleta() {
    if (paletaConstruida) return;
    paletaEl = document.getElementById('paleta-colores');
    paletaEl.innerHTML = '';

    COLORES.forEach((hex, i) => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.background = hex;
      if (i === 0) swatch.classList.add('seleccionado');
      swatch.addEventListener('click', () => {
        colorSeleccionado = hex;
        paletaEl.querySelectorAll('.color-swatch').forEach((s) => s.classList.remove('seleccionado'));
        swatch.classList.add('seleccionado');
      });
      paletaEl.appendChild(swatch);
    });

    paletaConstruida = true;
  }

  function obtenerCoordenadasCanvas(evt) {
    const rect = canvas.getBoundingClientRect();
    const escalaX = canvas.width / rect.width;
    const escalaY = canvas.height / rect.height;
    const x = Math.floor((evt.clientX - rect.left) * escalaX);
    const y = Math.floor((evt.clientY - rect.top) * escalaY);
    return { x, y };
  }

  function rellenar(startX, startY, hexColor) {
    const width = canvas.width;
    const height = canvas.height;

    if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const startPos = (startY * width + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];

    const fill = hexToRgb(hexColor);

    if (coloresParecidos(startR, startG, startB, fill.r, fill.g, fill.b, 12)) return;

    const visitado = new Uint8Array(width * height);
    const pila = [[startX, startY]];

    while (pila.length) {
      const [x, y] = pila.pop();
      if (x < 0 || x >= width || y < 0 || y >= height) continue;

      const idx = y * width + x;
      if (visitado[idx]) continue;

      const pos = idx * 4;
      const r = data[pos];
      const g = data[pos + 1];
      const b = data[pos + 2];

      if (!coloresParecidos(r, g, b, startR, startG, startB, TOLERANCIA)) continue;

      visitado[idx] = 1;
      data[pos] = fill.r;
      data[pos + 1] = fill.g;
      data[pos + 2] = fill.b;
      data[pos + 3] = 255;

      pila.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function configurarCanvasListener() {
    if (canvasListenerListo) return;
    canvas.addEventListener('pointerdown', (evt) => {
      const { x, y } = obtenerCoordenadasCanvas(evt);
      rellenar(x, y, colorSeleccionado);
    });
    canvasListenerListo = true;
  }

  function cargarImagen(src) {
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = src;
    imagenActualSrc = src;
  }

  function cargarActividad(config) {
    canvas = document.getElementById('color-canvas');
    ctx = canvas.getContext('2d', { willReadFrequently: true });

    construirPaleta();
    configurarCanvasListener();
    cargarImagen(config.imagen);
  }

  function reiniciar() {
    if (imagenActualSrc) cargarImagen(imagenActualSrc);
  }

  return {
    cargarActividad,
    reiniciar
  };
})();
