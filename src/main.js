/* =============================================================
   MAIN.JS - Controlador general del juego
   Maneja la navegación entre pantallas y coordina los tres
   niveles (rompecabezas, colorear, ¿cuál no pertenece?) junto
   con la narración y efectos de sonido.
   ============================================================= */

(function () {

  /* -------------------- Rutas de audio -------------------- */

  const AUDIO = {
    narrativaInicio: 'src/sonidos/inicio/narrativa_inicio.mp3',

    n1Inicio: 'src/sonidos/nivel1/inicio_nivel1.mp3',
    n1FinalRompecabezas1: 'src/sonidos/nivel1/final_rompecabezas1.mp3',
    n1FinalRompecabezas2: 'src/sonidos/nivel1/final_rompecabezas2.mp3',
    n1FinalNivel: 'src/sonidos/nivel1/final_nivel1.mp3',

    n2Inicio: 'src/sonidos/nivel2/inicio_nivel2.mp3',
    n2FinalDibujo1: 'src/sonidos/nivel2/final_dibujo1.mp3',
    n2FinalDibujo2: 'src/sonidos/nivel2/final_dibujo2.mp3',
    n2FinalNivel: 'src/sonidos/nivel2/final_nivel2.mp3',

    n3Inicio: 'src/sonidos/nivel3/inicio_nivel3.mp3',
    n3Instrucciones: 'src/sonidos/nivel3/instrucciones_nivel3.mp3',
    n3Correcto: 'src/sonidos/nivel3/correcto.mp3',
    n3Error: 'src/sonidos/nivel3/error.mp3'
  };

  /* -------------------- Config de actividades -------------------- */

  const ACTIVIDADES_NIVEL1 = [
    {
      guia: 'src/imgs/nivel1/rompecabezas_6pzs/guia.png',
      piezas: [
        'src/imgs/nivel1/rompecabezas_6pzs/pieza_1.png',
        'src/imgs/nivel1/rompecabezas_6pzs/pieza_2.png',
        'src/imgs/nivel1/rompecabezas_6pzs/pieza_3.png',
        'src/imgs/nivel1/rompecabezas_6pzs/pieza_4.png',
        'src/imgs/nivel1/rompecabezas_6pzs/pieza_5.png',
        'src/imgs/nivel1/rompecabezas_6pzs/pieza_6.png'
      ],
      frase: '¡Papá Dios me hizo único y me ama, así como soy!',
      audioFinal: AUDIO.n1FinalRompecabezas1
    },
    {
      guia: 'src/imgs/nivel1/rompecabezas_9pzs/guia.png',
      piezas: [
        'src/imgs/nivel1/rompecabezas_9pzs/pieza_1.png',
        'src/imgs/nivel1/rompecabezas_9pzs/pieza_2.png',
        'src/imgs/nivel1/rompecabezas_9pzs/pieza_3.png',
        'src/imgs/nivel1/rompecabezas_9pzs/pieza_4.png',
        'src/imgs/nivel1/rompecabezas_9pzs/pieza_5.png',
        'src/imgs/nivel1/rompecabezas_9pzs/pieza_6.png',
        'src/imgs/nivel1/rompecabezas_9pzs/pieza_7.png',
        'src/imgs/nivel1/rompecabezas_9pzs/pieza_8.png',
        'src/imgs/nivel1/rompecabezas_9pzs/pieza_9.png'
      ],
      frase: 'Dios me llama por mi nombre, porque me ama.',
      audioFinal: AUDIO.n1FinalRompecabezas2
    }
  ];

  const ACTIVIDADES_NIVEL2 = [
    {
      imagen: 'src/imgs/nive2/colorear_1.png',
      frase: 'Todos somos diferentes.',
      audioFinal: AUDIO.n2FinalDibujo1
    },
    {
      imagen: 'src/imgs/nive2/colorear_2.png',
      frase: 'Tengo un corazón para amar, perdonar y ser amable con todos.',
      audioFinal: AUDIO.n2FinalDibujo2
    }
  ];

  const IMG3 = 'src/imgs/nivel3/';

  const ACTIVIDADES_NIVEL3 = [
    {
      imagenes: [IMG3 + 'retrato_amigos.png', IMG3 + 'hoja_dibujo_familia.png', IMG3 + 'caja_regalo.png'],
      indiceCorrecta: 2
    },
    {
      imagenes: [IMG3 + 'nino_comiendo.png', IMG3 + 'nino_descansa.png', IMG3 + 'ninos_peleando.png'],
      indiceCorrecta: 2
    },
    {
      imagenes: [IMG3 + 'ninos_abrazo.png', IMG3 + 'ninas_abrazo.png', IMG3 + 'nino_enojado.png'],
      indiceCorrecta: 2
    },
    {
      imagenes: [IMG3 + 'nino_orando.png', IMG3 + 'nino_orando_84.png', IMG3 + 'nina_orando_hincada.png'],
      indiceCorrecta: 2
    },
    {
      imagenes: [IMG3 + 'carta.png', IMG3 + 'celular.png', IMG3 + 'biblia.png'],
      indiceCorrecta: 2
    }
  ];

  /* -------------------- Navegación de pantallas -------------------- */

  function mostrarPantalla(id) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  /* -------------------- Confeti sencillo -------------------- */

  function lanzarConfeti() {
    const emojis = ['🎉', '✨', '🌟', '❤️', '🎈'];
    for (let i = 0; i < 16; i++) {
      const span = document.createElement('span');
      span.className = 'confeti';
      span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      span.style.left = Math.random() * 100 + 'vw';
      span.style.animationDuration = (1.6 + Math.random() * 1.2) + 's';
      span.style.animationDelay = (Math.random() * 0.4) + 's';
      document.body.appendChild(span);
      setTimeout(() => span.remove(), 3200);
    }
  }

  /* -------------------- Estado Nivel 1 -------------------- */

  let indiceActividadN1 = 0;

  function iniciarNivel1() {
    indiceActividadN1 = 0;
    Sonido.reproducirNarracion(AUDIO.n1Inicio);
    cargarActividadN1(indiceActividadN1);
  }

  function cargarActividadN1(indice) {
    const config = ACTIVIDADES_NIVEL1[indice];
    const progresoEl = document.getElementById('n1-progreso');

    Nivel1.cargarActividad(config, {
      onProgress: (colocadas, total) => {
        progresoEl.textContent = `Piezas: ${colocadas}/${total}`;
      },
      onComplete: () => {
        lanzarConfeti();
        Sonido.reproducirNarracion(config.audioFinal);
        setTimeout(() => mostrarCompletadoN1(indice), 400);
      }
    });
  }

  function mostrarCompletadoN1(indice) {
    const overlay = document.getElementById('n1-overlay-completado');
    const titulo = document.getElementById('n1-overlay-titulo');
    const texto = document.getElementById('n1-overlay-texto');
    const boton = document.getElementById('btn-n1-siguiente');
    const config = ACTIVIDADES_NIVEL1[indice];

    const esUltimo = indice >= ACTIVIDADES_NIVEL1.length - 1;

    titulo.textContent = '¡Muy bien!';
    texto.textContent = config.frase;
    boton.textContent = esUltimo ? 'Continuar ➡️' : 'Siguiente rompecabezas ➡️';

    overlay.classList.remove('oculto');

    boton.onclick = () => {
      overlay.classList.add('oculto');
      if (esUltimo) {
        Sonido.reproducirNarracion(AUDIO.n1FinalNivel);
        mostrarPantalla('screen-nivel1-outro');
      } else {
        indiceActividadN1++;
        cargarActividadN1(indiceActividadN1);
      }
    };
  }

  /* -------------------- Estado Nivel 2 -------------------- */

  let indiceActividadN2 = 0;

  function iniciarNivel2() {
    indiceActividadN2 = 0;
    Sonido.reproducirNarracion(AUDIO.n2Inicio);
    cargarActividadN2(indiceActividadN2);
  }

  function cargarActividadN2(indice) {
    const config = ACTIVIDADES_NIVEL2[indice];
    Nivel2.cargarActividad(config);
  }

  function enviarDibujoN2() {
    const indice = indiceActividadN2;
    const config = ACTIVIDADES_NIVEL2[indice];

    lanzarConfeti();
    Sonido.reproducirNarracion(config.audioFinal);

    const overlay = document.getElementById('n2-overlay-completado');
    const texto = document.getElementById('n2-overlay-texto');
    const boton = document.getElementById('btn-n2-siguiente');
    const esUltimo = indice >= ACTIVIDADES_NIVEL2.length - 1;

    texto.textContent = config.frase;
    boton.textContent = esUltimo ? 'Continuar ➡️' : 'Siguiente dibujo ➡️';

    overlay.classList.remove('oculto');

    boton.onclick = () => {
      overlay.classList.add('oculto');
      if (esUltimo) {
        Sonido.reproducirNarracion(AUDIO.n2FinalNivel);
        mostrarPantalla('screen-nivel2-outro');
      } else {
        indiceActividadN2++;
        cargarActividadN2(indiceActividadN2);
      }
    };
  }

  /* -------------------- Estado Nivel 3 -------------------- */

  let indiceActividadN3 = 0;

  function iniciarNivel3() {
    indiceActividadN3 = 0;
    Sonido.reproducirNarracion(AUDIO.n3Instrucciones);
    cargarActividadN3(indiceActividadN3);
  }

  function cargarActividadN3(indice) {
    const config = ACTIVIDADES_NIVEL3[indice];
    const progresoEl = document.getElementById('n3-progreso');
    progresoEl.textContent = `Grupo ${indice + 1}/${ACTIVIDADES_NIVEL3.length}`;

    Nivel3.cargarGrupo(config, {
      onCorrecto: () => {
        Sonido.reproducirNarracion(AUDIO.n3Correcto);
        lanzarConfeti();
        setTimeout(() => {
          const esUltimo = indice >= ACTIVIDADES_NIVEL3.length - 1;
          if (esUltimo) {
            mostrarPantalla('screen-final');
            lanzarConfeti();
          } else {
            indiceActividadN3++;
            cargarActividadN3(indiceActividadN3);
          }
        }, 900);
      },
      onIncorrecto: () => {
        Sonido.reproducirEfecto(AUDIO.n3Error);
      }
    });
  }

  /* -------------------- Eventos de botones -------------------- */

  document.getElementById('btn-jugar').addEventListener('click', () => {
    Sonido.reproducirNarracion(AUDIO.narrativaInicio);
    mostrarPantalla('screen-nivel1-intro');
  });

  document.getElementById('btn-como-jugar').addEventListener('click', () => {
    mostrarPantalla('screen-como-jugar');
  });

  document.getElementById('btn-volver-portada').addEventListener('click', () => {
    mostrarPantalla('screen-portada');
  });

  document.getElementById('btn-empezar-nivel1').addEventListener('click', () => {
    mostrarPantalla('screen-nivel1-game');
    iniciarNivel1();
  });

  document.getElementById('btn-ir-nivel2').addEventListener('click', () => {
    mostrarPantalla('screen-nivel2-intro');
  });

  document.getElementById('btn-empezar-nivel2').addEventListener('click', () => {
    mostrarPantalla('screen-nivel2-game');
    iniciarNivel2();
  });

  document.getElementById('btn-n2-borrar').addEventListener('click', () => {
    Nivel2.reiniciar();
  });

  document.getElementById('btn-n2-enviar').addEventListener('click', () => {
    enviarDibujoN2();
  });

  document.getElementById('btn-ir-nivel3').addEventListener('click', () => {
    mostrarPantalla('screen-nivel3-intro');
    Sonido.reproducirNarracion(AUDIO.n3Inicio);
  });

  document.getElementById('btn-empezar-nivel3').addEventListener('click', () => {
    mostrarPantalla('screen-nivel3-game');
    iniciarNivel3();
  });

  document.getElementById('btn-volver-inicio').addEventListener('click', () => {
    Sonido.detenerNarracion();
    mostrarPantalla('screen-portada');
  });

  /* -------------------- Inicio -------------------- */

  mostrarPantalla('screen-portada');

})();
