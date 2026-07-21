/* =============================================================
   AUDIO.JS - Manejador de sonido del juego
   Controla la narración (un solo canal, se interrumpe si se
   pide otro audio) y los efectos cortos (correcto/error) que
   pueden sonar independientemente.
   ============================================================= */

window.Sonido = (function () {

  let narracionActual = null;
  let habilitado = true;

  function reproducirNarracion(src, opciones) {
    if (!habilitado || !src) return null;

    if (narracionActual) {
      narracionActual.pause();
      narracionActual.currentTime = 0;
    }

    const audio = new Audio(src);
    narracionActual = audio;

    if (opciones && typeof opciones.onEnded === 'function') {
      audio.addEventListener('ended', opciones.onEnded, { once: true });
    }

    audio.play().catch(() => {
      /* Los navegadores pueden bloquear autoplay sin gesto del
         usuario; como todos nuestros audios se disparan desde
         clics, esto normalmente no ocurre. Se ignora el error
         para no romper el flujo del juego. */
    });

    return audio;
  }

  function reproducirEfecto(src) {
    if (!habilitado || !src) return;
    const audio = new Audio(src);
    audio.play().catch(() => {});
  }

  function detenerNarracion() {
    if (narracionActual) {
      narracionActual.pause();
      narracionActual.currentTime = 0;
      narracionActual = null;
    }
  }

  function establecerHabilitado(valor) {
    habilitado = valor;
    if (!habilitado) detenerNarracion();
  }

  return {
    reproducirNarracion,
    reproducirEfecto,
    detenerNarracion,
    establecerHabilitado
  };
})();
