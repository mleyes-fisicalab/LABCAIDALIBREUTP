/* ============================================================================
   PAGINAS.JS — Construcción del contenido de cada página del cuaderno
   ========================================================================== */

const CLAVES = {};

function esc(s){
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function campo(o){
  CLAVES[o.id] = { resp:o.resp || [], modo:o.modo || 'texto', nota:o.nota || '',
                   modelo:o.modelo || '', tol:o.tol };
  const cls = 'campo' + (o.modo === 'simbolo' || o.modo === 'numero' ? '' : ' campo--texto')
            + (o.clase ? ' ' + o.clase : '');
  return `<input type="text" class="${cls}" id="${o.id}" data-campo="${o.id}"
            inputmode="${o.modo === 'numero' ? 'decimal' : 'text'}"
            placeholder="${esc(o.ph || '')}" autocomplete="off" spellcheck="false"
            aria-label="${esc(o.et || o.ph || o.id)}">
          <span class="pista" id="pista-${o.id}"></span>`;
}

function area(o){
  CLAVES[o.id] = { resp:[], modo:'libre', nota:o.guia || '', modelo:o.modelo || '' };
  /* El «eco» es una copia del texto que solo aparece al imprimir: un textarea
     conserva su altura en papel y recortaría las respuestas largas. */
  return `<textarea class="campo" id="${o.id}" data-campo="${o.id}" rows="${o.filas || 5}"
            placeholder="${esc(o.ph || 'Escribe aquí tu respuesta…')}"
            aria-label="${esc(o.et || o.id)}"></textarea>
          <div class="eco" id="eco-${o.id}" aria-hidden="true"></div>`;
}

function num(o){
  o.modo = 'numero'; o.clase = (o.clase || '') + ' campo--num'; o.ph = o.ph || '0,00';
  return campo(o);
}

/* Dato del estudiante: no se verifica, pero el autocompletado lo rellena con el
   valor del conjunto de datos de referencia. */
function dato(o){
  CLAVES[o.id] = { resp:[], modo:'libre', nota:'', modelo:o.modelo || '' };
  return `<input type="text" class="campo campo--num${o.clase ? ' ' + o.clase : ''}"
            id="${o.id}" data-campo="${o.id}" inputmode="decimal"
            placeholder="${esc(o.ph || '0,00')}" autocomplete="off" spellcheck="false"
            aria-label="${esc(o.et || o.id)}">`;
}

function accionesPagina(){
  return `<div class="acciones-pag">
      <button class="btn-papel btn-papel--clave" data-accion="autopag">Autocompletar esta página</button>
      <button class="btn-papel" data-accion="verificarpag">Verificar</button>
      <button class="btn-papel btn-papel--fantasma" data-accion="limpiarpag">Limpiar</button>
    </div>`;
}

function enunciado(n, texto){
  return `<div class="punto">
      <div class="punto__num" aria-hidden="true">${n}</div>
      <div class="punto__texto"><p>${texto}</p></div>
    </div>`;
}

/* ==========================================================================
   PÁGINAS
   ========================================================================== */
const PAGINAS = [];

/* --- 0 · Portada -------------------------------------------------------- */
PAGINAS.push(() => `
  <div class="portada">
    <img class="portada__img" src="imagenesUTP/portada.png"
         alt="Portada del cuaderno interactivo: Práctica 4, Caída libre. Universidad Tecnológica de Pereira, Facultad de Ciencias Básicas.">
    <div>
      <span class="portada__sello">${esc(META.universidad)}</span>
      <h1>Cuaderno<br>interactivo<em>${esc(META.asignatura)}</em></h1>
      <p class="portada__practica">${esc(META.practica)} · ${esc(META.titulo)}</p>
      <div class="si-fila" aria-label="Magnitudes de la práctica">
        <span class="si-chip">h</span><span class="si-chip">t</span><span class="si-chip">a</span>
        <span class="si-chip">g</span><span class="si-chip">m/s²</span>
      </div>
      <ul class="portada__meta">
        <li><b>Facultad</b><span>Ciencias Básicas · ${esc(META.departamento)}</span></li>
        <li><b>Asignatura</b><span>${esc(META.asignatura)}</span></li>
        <li><b>Docente</b><span>${campo({id:'docente', modo:'libre', ph:'Escribe el nombre de tu docente', et:'Docente', clase:'campo--ancho'})}</span></li>
        <li><b>Grupo</b><span>${campo({id:'grupo', modo:'libre', ph:'Número o código del grupo', et:'Grupo', clase:'campo--ancho'})}</span></li>
        <li><b>Fecha</b><span>${campo({id:'fecha', modo:'libre', ph:'dd / mm / aaaa', et:'Fecha', clase:'campo--ancho'})}</span></li>
      </ul>
      <button class="btn-grande" data-ir="1">Abrir el cuaderno →</button>
    </div>
  </div>
`);

/* --- 1 · Índice --------------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Navegación</span>
  <h1 class="titulo">Índice del cuaderno</h1>
  <p class="plomo">Veintiséis secciones: el fundamento y el procedimiento, el preinforme, las seis
  tablas de datos, el resumen de promedios, la gráfica con su ajuste, la determinación de la
  aceleración, el simulador, las preguntas y los anexos. Tu trabajo se guarda solo en este
  navegador cada vez que escribes.</p>
  <ol class="indice">
    ${SECCIONES.map((s,i) => `
      <li><button class="indice__btn" data-ir="${i}">
        <span class="indice__n">${String(i).padStart(2,'0')}</span>
        <span class="indice__t">${esc(s.t)}<br><span class="indice__d">${esc(s.d)}</span></span>
        <span class="indice__p">pág. ${i+1}</span>
      </button></li>`).join('')}
  </ol>
`);

/* --- 2 · Presentación --------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe de laboratorio</span>
  <h1 class="titulo">Presentación de la práctica</h1>
  <p class="plomo">Dejar caer una bolita y cronometrarla. El experimento más sencillo del
  laboratorio esconde el que quizá sea el resultado más famoso de la física: todos los cuerpos
  caen con la misma aceleración.</p>

  <p>En esta práctica estudiarás el movimiento de un <b>balín</b> que se deja caer desde el
  reposo bajo la acción de la gravedad. Con una torre vertical, un mecanismo de liberación
  electromagnético y el cronómetro del laboratorio, medirás el <b>tiempo de caída</b> desde
  <b>seis alturas distintas</b>, repitiendo tres veces cada medida.</p>

  <p>Con esas parejas de altura y tiempo construirás una <b>gráfica experimental</b>, obtendrás la
  <b>ecuación</b> que describe el movimiento y, a partir de ella, determinarás el
  <b>valor experimental de la aceleración</b> del balín, para compararlo después con el valor
  conocido de la aceleración de la gravedad.</p>

  <p>El detalle interesante es que la aceleración <b>no se mide con ningún instrumento</b>. No hay
  un aparato que la lea. Lo que se mide son longitudes y tiempos; la aceleración aparece después,
  escondida en la forma de la curva que relacionan esas dos magnitudes. Esa es la idea de fondo de
  toda la práctica: <span class="dato">h = ½·a·t²</span>, y si los datos siguen esa ley, el
  coeficiente que multiplica a t² vale justamente la mitad de la aceleración.</p>

  <div class="tarjetas">
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Lo que necesitas</h3>
      <p>El montaje de caída libre del laboratorio y este cuaderno abierto al lado para registrar
      cada medida en el momento de tomarla.</p>
    </div>
    <div class="tarjeta tarjeta--azul">
      <h3 class="tarjeta__tit">Lo que entregas</h3>
      <p>El informe completo: resumen, marco teórico, Tablas 1 a 7, la gráfica con su ecuación, el
      valor de la aceleración, las tres preguntas y tres conclusiones propias.</p>
    </div>
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Cómo se evalúa</h3>
      <p>Coherencia de los datos, correcta obtención de la ecuación de ajuste y justificación
      física de cada respuesta.</p>
    </div>
  </div>

  <div class="nota">
    <strong>El ajuste va incluido.</strong> La guía pide trazar la gráfica y obtener de ella la
    ecuación experimental. Este cuaderno hace ese ajuste solo, por mínimos cuadrados, a partir de
    lo que escribas en las tablas: te entrega la ecuación, el coeficiente de determinación, la
    aceleración que se deduce y el error frente al valor de referencia. Puedes usarlo para
    comprobar tu hoja de cálculo.
  </div>
`);

/* --- 3 · Objetivos ------------------------------------------------------ */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 2</span>
  <h1 class="titulo">Objetivos</h1>

  <div class="tarjetas">
    <div class="tarjeta tarjeta--azul">
      <h3 class="tarjeta__tit">Objetivo general</h3>
      <p>Estudiar experimentalmente el movimiento uniformemente acelerado de un cuerpo que cae
      bajo la acción de la gravedad, a partir de mediciones de altura y tiempo.</p>
    </div>
  </div>

  <h2 class="sub">Objetivos específicos</h2>
  <div class="tarjetas">
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Medir</h3>
      <p>Registrar el tiempo de caída del balín desde seis alturas distintas, repitiendo tres
      veces cada medida y promediando.</p>
    </div>
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Graficar</h3>
      <p>Representar la altura frente al tiempo promedio y reconocer en la forma de la gráfica el
      tipo de relación que une a las dos magnitudes.</p>
    </div>
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Ajustar</h3>
      <p>Obtener la ecuación experimental del movimiento mediante un ajuste por mínimos cuadrados
      y evaluar su calidad.</p>
    </div>
    <div class="tarjeta">
      <h3 class="tarjeta__tit">Comparar</h3>
      <p>Calcular el valor experimental de la aceleración y contrastarlo con el valor conocido de
      la aceleración de la gravedad mediante el error relativo.</p>
    </div>
  </div>

  <div class="nota">
    <strong>Al terminar deberías poder responder sin dudar:</strong> ¿qué función relaciona la
    altura con el tiempo?, ¿qué valor tiene la aceleración que obtuviste? y ¿qué tipo de
    movimiento describe el balín?
  </div>
`);

/* --- 4 · Materiales ----------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 3</span>
  <h1 class="titulo">Materiales e instrumentos</h1>
  <p class="plomo">Tres elementos bastan para esta práctica: algo que mida longitudes, algo que
  mida tiempos y algo que caiga. El resto del montaje existe para que esas tres cosas se usen
  siempre del mismo modo.</p>

  <div class="tarjetas">
    ${MATERIALES.map((m,i) => `
      <div class="tarjeta${i < 3 ? ' tarjeta--azul' : ''}">
        <h3 class="tarjeta__tit">${esc(m.n)}</h3>
        <p>${esc(m.f)}</p>
      </div>`).join('')}
  </div>

  <h2 class="sub">Qué se mide directamente y qué no</h2>
  <div class="tabla-caja">
    <table class="tabla">
      <thead><tr><th style="width:26%">Magnitud</th><th style="width:20%">¿Se mide?</th><th>De dónde sale</th></tr></thead>
      <tbody>
        <tr><td class="col-fija">Altura h</td><td class="td-centro"><span class="dato">directa</span></td>
            <td>Se lee en la cinta métrica, entre el punto de liberación y el sensor de impacto.</td></tr>
        <tr><td class="col-fija">Tiempo t</td><td class="td-centro"><span class="dato">directa</span></td>
            <td>Lo entrega el cronómetro. Se repite tres veces por altura.</td></tr>
        <tr><td class="col-fija">Tiempo promedio t̄</td><td class="td-centro"><span class="dato">calculada</span></td>
            <td>Media aritmética de los tres tiempos de una misma altura.</td></tr>
        <tr><td class="col-fija">Aceleración a</td><td class="td-centro"><span class="dato">indirecta</span></td>
            <td>No se mide: se deduce del coeficiente de t² en el ajuste de las seis parejas.</td></tr>
      </tbody>
    </table>
    <caption>Tabla de apoyo. El objetivo de la práctica es una magnitud que ningún instrumento lee.</caption>
  </div>

  <div class="nota nota--aviso">
    <strong>Antes de empezar, comprueba dos cosas.</strong> Que la torre esté vertical —si está
    inclinada, el balín no cae libremente y los tiempos salen largos— y que decidas desde qué dos
    puntos vas a medir la altura. Ese criterio debe ser el mismo en las seis tablas: cambiarlo a
    mitad de la práctica introduce un error que luego no se nota en los datos pero sí desplaza el
    resultado final.
  </div>
`);

/* --- 5 · Fundamento físico ---------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 4</span>
  <h1 class="titulo">Fundamento físico</h1>
  <p class="plomo">Una sola fórmula gobierna toda la práctica, y conviene entender por qué el
  tiempo aparece elevado al cuadrado.</p>

  <h2 class="sub">Qué es la caída libre</h2>
  <p>Un cuerpo está en <b>caída libre</b> cuando la única fuerza apreciable que actúa sobre él es
  su propio peso. Como esa fuerza es constante, también lo es la aceleración, y el movimiento
  resulta <b>uniformemente acelerado</b>: la velocidad aumenta siempre la misma cantidad en cada
  segundo que pasa.</p>

  <p>El balín de esta práctica es pequeño y denso, y recorre poco más de un metro. En esas
  condiciones la resistencia del aire es despreciable frente al peso, de modo que tratar su
  movimiento como caída libre no introduce error apreciable.</p>

  <h2 class="sub">La relación entre la altura y el tiempo</h2>
  <p>Si el balín parte del <b>reposo</b> y cae una altura <i>h</i> en un tiempo <i>t</i> con
  aceleración constante <i>a</i>, la cinemática del movimiento rectilíneo uniformemente acelerado
  conduce a:</p>

  <div class="formula">
    <div class="formula__ec">h = ½ · a · t²</div>
    <div class="formula__pie">Con h en metros, t en segundos y a en m/s².</div>
  </div>

  <div class="datos-ejer">
    <span>h : altura recorrida (m)</span>
    <span>t : tiempo de caída (s)</span>
    <span>a : aceleración (m/s²)</span>
  </div>

  <p>La altura <b>no crece en proporción al tiempo</b>, sino al <b>cuadrado</b> del tiempo. La
  consecuencia es contundente: si el tiempo de caída se duplica, la distancia recorrida se
  multiplica por cuatro; si se triplica, por nueve. Representada en unos ejes h frente a t, la
  relación no es una recta sino una parábola que pasa por el origen.</p>

  <div class="tabla-caja">
    <table class="tabla">
      <thead><tr><th style="width:34%">Si el tiempo se multiplica por…</th>
                 <th style="width:33%">la altura se multiplica por…</th>
                 <th>Ejemplo partiendo de 0,30 m</th></tr></thead>
      <tbody>
        <tr><td class="col-mag">2</td><td class="td-centro"><span class="dato">4</span></td><td>0,30 m → 1,20 m</td></tr>
        <tr><td class="col-mag">3</td><td class="td-centro"><span class="dato">9</span></td><td>0,30 m → 2,70 m</td></tr>
        <tr><td class="col-mag">1,41 (√2)</td><td class="td-centro"><span class="dato">2</span></td><td>0,30 m → 0,60 m</td></tr>
      </tbody>
    </table>
    <caption>Tabla de apoyo. Esta es la firma de una dependencia cuadrática, y se reconoce en los datos sin necesidad de graficar.</caption>
  </div>

  <h2 class="sub">Cómo se mide la aceleración con esa ley</h2>
  <p>Si se ajustan las parejas experimentales al modelo <span class="dato">h = k·t²</span>, el
  coeficiente <i>k</i> que devuelve el ajuste debe coincidir con ½·a. Comparando ambas
  expresiones:</p>

  <div class="formulario">
    <div class="f-carta">
      <div class="f-carta__n">Modelo teórico</div>
      <div class="f-carta__ec">h = ½·a·t²</div>
      <div class="f-carta__p">Lo que predice la física para un cuerpo que parte del reposo.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">Ajuste experimental</div>
      <div class="f-carta__ec">h = k·t²</div>
      <div class="f-carta__p">Lo que devuelven tus datos al ajustarlos por mínimos cuadrados.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">Comparación</div>
      <div class="f-carta__ec">a = 2 · k</div>
      <div class="f-carta__p">La aceleración es el doble del coeficiente de t².</div>
    </div>
  </div>

  <h2 class="sub">Otras magnitudes que se deducen</h2>
  <div class="formulario">
    <div class="f-carta">
      <div class="f-carta__n">Tiempo de caída</div>
      <div class="f-carta__ec">t = √(2h / g)</div>
      <div class="f-carta__p">Despejado de la ley anterior.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">Velocidad de impacto</div>
      <div class="f-carta__ec">v = √(2·g·h)</div>
      <div class="f-carta__p">Rapidez con la que el balín llega al sensor.</div>
    </div>
    <div class="f-carta">
      <div class="f-carta__n">Velocidad en el instante t</div>
      <div class="f-carta__ec">v = g · t</div>
      <div class="f-carta__p">Crece linealmente, aunque la posición no lo haga.</div>
    </div>
  </div>

  <div class="nota nota--aviso">
    <strong>El error en el tiempo pesa el doble.</strong> Como el tiempo entra al cuadrado, un
    error del 1 % en la medida de <i>t</i> se traduce en un error de alrededor del 2 % en la
    aceleración. Por eso se repite tres veces cada medida y por eso conviene trabajar con alturas
    grandes: cuanto más dura la caída, menos pesan los retardos del equipo.
  </div>

  <div class="nota">
    <strong>g no es una constante universal.</strong> Depende de la latitud, porque la Tierra no
    es exactamente esférica y además rota, y disminuye con la altitud. En Pereira, a unos 4,8° de
    latitud norte y 1411 m sobre el nivel del mar, el valor local estimado es de
    <span class="dato">${f3(G_PEREIRA)} m/s²</span>, algo menor que los
    <span class="dato">${f2(G_REF)} m/s²</span> que se usan como referencia en el curso. La
    diferencia queda por debajo de la incertidumbre de esta práctica, de modo que el experimento
    no permite distinguir entre los dos valores.
  </div>
`);

/* --- 6 · Montaje experimental -------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 5</span>
  <h1 class="titulo">Montaje experimental</h1>
  <p class="plomo">Este es el equipo con el que vas a trabajar. Toca o haz clic sobre cada punto
  naranja para leer qué función cumple esa parte y por qué importa.</p>

  <div class="instr">
    <h3 class="instr__tit">Torre de caída libre <span>interactiva</span></h3>
    <div class="montaje" id="montaje-host"></div>
  </div>

  <div class="nota">
    <strong>Así funciona.</strong> El balín queda sujeto al electroimán del mecanismo de
    liberación. Al accionarlo, la corriente se corta: el balín se suelta y, en ese mismo instante,
    arranca el cronómetro. El balín cae a lo largo de la torre y, al golpear el sensor de la base,
    detiene la cuenta. El número que aparece en la unidad de control es el tiempo que tardó en
    recorrer la altura h.
  </div>
`);

/* --- 7 · Procedimiento --------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 6</span>
  <h1 class="titulo">Procedimiento</h1>
  <p class="plomo">Los cinco pasos de la guía. Los marcados en naranja son aquellos en los que
  debes registrar datos en el cuaderno.</p>

  <div class="pasos">
    ${PASOS.map((p,i) => `
      <div class="paso${p.clave ? ' paso--clave' : ''}">
        <div class="paso__n" aria-hidden="true">${i+1}</div>
        <div class="paso__t">
          <h3 class="sub3" style="margin:0 0 4px">${esc(p.t)}</h3>
          <p>${p.d}</p>
        </div>
      </div>`).join('')}
  </div>

  <div class="nota nota--aviso">
    <strong>Dieciocho lecturas en total.</strong> Tres tiempos por cada una de las seis alturas.
    Conviene completar una tabla entera, con su promedio, antes de mover el mecanismo de
    liberación a la siguiente altura.
  </div>

  <div class="nota">
    <strong>Cómo elegir las seis alturas.</strong> La guía pide que los tiempos de caída sean
    distintos entre sí. Reparte las alturas por todo el recorrido útil de la torre en lugar de
    concentrarlas: seis alturas repartidas entre 0,30 m y 1,80 m, por ejemplo, dan tiempos entre
    0,25 s y 0,61 s, suficientemente separados para que la curvatura de la gráfica se aprecie. Si
    las seis alturas quedan muy juntas, los puntos se amontonan y el ajuste pierde fiabilidad.
  </div>
`);

/* --- 8 · Encabezado del informe ------------------------------------------ */
PAGINAS.push(() => `
  <div class="cab-informe">
    <div class="cab-informe__txt">
      <span class="eyebrow">Informe · Encabezado</span>
      <h1 class="titulo" style="margin-bottom:0">Resumen y grupo de trabajo</h1>
    </div>
    <div class="casilla-nota">
      <span class="casilla-nota__et">Nota</span>
      ${campo({id:'nota', modo:'libre', ph:'—', et:'Nota asignada por el docente', clase:'campo--num'})}
      <span class="casilla-nota__pie">Espacio reservado para el docente</span>
    </div>
  </div>

  <h2 class="sub">Resumen</h2>
  <p style="font-size:.86rem;color:var(--tinta-3);margin:0 0 7px">
    Un párrafo que diga qué se hizo, cómo se hizo y qué se obtuvo. Se escribe al final, cuando ya
    conoces los resultados, aunque aparezca al principio del informe.</p>
  ${area({id:'resumen', filas:8, modelo:RESUMEN_MODELO, et:'Resumen del informe'})}

  <h2 class="sub">Estudiantes</h2>
  <div class="tabla-caja">
    <table class="tabla">
      <thead><tr><th class="col-num">#</th><th style="width:58%">Nombre completo</th><th style="width:34%">Código</th></tr></thead>
      <tbody>
        ${[0,1,2].map(i => `
          <tr>
            <td class="col-num">${i+1}</td>
            <td>${campo({id:'est'+i, modo:'libre', ph:'nombre y apellidos', et:'Estudiante '+(i+1)})}</td>
            <td>${campo({id:'cod'+i, modo:'libre', ph:'código', et:'Código '+(i+1), clase:'campo--num'})}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <caption>Integrantes del grupo de laboratorio.</caption>
  </div>

  <div class="nota">
    <strong>Estos campos son tuyos.</strong> El autocompletado no inventa nombres, códigos ni
    calificaciones: la casilla de nota, la tabla de estudiantes y el docente quedan siempre en
    blanco. El resumen sí trae un modelo de redacción.
  </div>
  ${accionesPagina()}
`);

/* --- 9 · Marco teórico --------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Punto 1</span>
  <h1 class="titulo">Marco teórico</h1>
  ${enunciado(1, 'Redacte el marco teórico de la práctica.')}

  <p>Debe cubrir, con tus propias palabras y citando las fuentes que consultes: qué es la caída
  libre y bajo qué condiciones puede aplicarse esa descripción; por qué el movimiento resulta
  uniformemente acelerado; de dónde sale la relación entre la altura y el tiempo y por qué el
  tiempo aparece elevado al cuadrado; cómo se obtiene la aceleración a partir de esa relación; y
  qué papel cumple promediar tres medidas por cada altura.</p>

  ${area({id:'marco', filas:16, modelo:MARCO_MODELO, et:'Marco teórico',
          ph:'Desarrolla aquí el marco teórico…'})}

  <div class="nota">
    <strong>El autocompletado carga un texto de referencia.</strong> Sirve para que veas la
    profundidad y la estructura esperadas, no para copiarlo: el marco teórico se califica por la
    comprensión que demuestra, y esa tiene que ser tuya.
  </div>
  ${accionesPagina()}
`);

/* --- 10 · Preinforme ----------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Preinforme</span>
  <h1 class="titulo">Predicciones antes de medir</h1>
  <p class="plomo">Cinco cálculos que puedes hacer con la teoría, antes de tocar el montaje. Si
  después tus medidas se parecen a estas predicciones, el experimento va bien; si se alejan
  mucho, algo hay que revisar. Estos sí tienen respuesta correcta: el botón
  <em>Verificar</em> la contrasta.</p>

  <div class="datos-ejer">
    <span>g = ${f2(G_REF)} m/s²</span>
    <span>v₀ = 0 (parte del reposo)</span>
    <span>h = ½·g·t²</span>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>1.</b> ¿Cuánto tiempo tarda el balín en caer desde una altura de
    <b>1,20 m</b>?</p>
    <div class="ejer__r">
      <label for="pre-t120">tiempo de caída</label>
      ${num({id:'pre-t120', resp:[f3(tCaida(1.20))], tol:0.006, ph:'0,000',
             et:'Tiempo de caída desde 1,20 m',
             nota:`t = √(2h/g) = √(2 × 1,20 / ${f2(G_REF)}) = ${f3(tCaida(1.20))} s.`})}
      <span class="ejer__u">s</span>
    </div>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>2.</b> Si una altura es el <b>doble</b> de otra, ¿por qué factor queda
    multiplicado el tiempo de caída?</p>
    <div class="ejer__r">
      <label for="pre-factor">factor</label>
      ${num({id:'pre-factor', resp:['1,41'], tol:0.02, ph:'0,00',
             et:'Factor por el que se multiplica el tiempo',
             nota:'Como h es proporcional a t², el tiempo va con la raíz de la altura: al duplicar h, t queda multiplicado por √2 ≈ 1,41. No se duplica.'})}
      <span class="ejer__u">×</span>
    </div>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>3.</b> ¿Desde qué altura habría que soltar el balín para que el tiempo
    de caída fuera exactamente <b>0,50 s</b>?</p>
    <div class="ejer__r">
      <label for="pre-h050">altura</label>
      ${num({id:'pre-h050', resp:[f3(0.5*G_REF*0.25)], tol:0.02, ph:'0,000',
             et:'Altura para un tiempo de caída de 0,50 s',
             nota:`h = ½·g·t² = 0,5 × ${f2(G_REF)} × 0,50² = ${f3(0.5*G_REF*0.25)} m.`})}
      <span class="ejer__u">m</span>
    </div>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>4.</b> ¿Con qué rapidez llega el balín al sensor si se suelta desde
    <b>1,80 m</b>?</p>
    <div class="ejer__r">
      <label for="pre-v180">velocidad de impacto</label>
      ${num({id:'pre-v180', resp:[f2(Math.sqrt(2*G_REF*1.80))], tol:0.05, ph:'0,00',
             et:'Velocidad de impacto desde 1,80 m',
             nota:`v = √(2·g·h) = √(2 × ${f2(G_REF)} × 1,80) = ${f2(Math.sqrt(2*G_REF*1.80))} m/s.`})}
      <span class="ejer__u">m/s</span>
    </div>
  </div>

  <div class="ejer">
    <p class="ejer__q"><b>5.</b> Si los datos se ajustan al modelo <span class="dato">h = k·t²</span>,
    ¿qué valor debería tener el coeficiente <i>k</i>?</p>
    <div class="ejer__r">
      <label for="pre-k">coeficiente k</label>
      ${num({id:'pre-k', resp:[f2(G_REF/2)], tol:0.05, ph:'0,00',
             et:'Valor teórico del coeficiente k',
             nota:`Comparando h = k·t² con h = ½·g·t² resulta k = g/2 = ${f2(G_REF/2)} m/s². Es el número que deberías obtener del ajuste.`})}
      <span class="ejer__u">m/s²</span>
    </div>
  </div>

  <div class="nota">
    <strong>Guarda estos números.</strong> El de la pregunta 5 es el que vas a comparar
    directamente con el coeficiente que salga de tu ajuste. Si tu k experimental se aleja mucho de
    ${f2(G_REF/2)}, revisa antes la medida de las alturas que la del tiempo: un error constante en
    la altura desplaza las seis parejas por igual y es el más difícil de ver.
  </div>
  ${accionesPagina()}
`);

/* --- 11 a 16 · Las seis tablas de datos ---------------------------------- */
const ORDINALES = ['primera','segunda','tercera','cuarta','quinta','sexta'];

for (let n = 0; n < N_TABLAS; n++){
  PAGINAS.push(() => `
    <span class="eyebrow">Informe · Punto 2 · Datos experimentales</span>
    <h1 class="titulo">Tabla ${n+1} · ${ORDINALES[n].charAt(0).toUpperCase() + ORDINALES[n].slice(1)} altura</h1>
    ${enunciado(2, `Registre la altura elegida y los <b>tres tiempos de caída</b> medidos desde ella. Es la ${ORDINALES[n]} de las seis alturas de la práctica.`)}

    <div class="datos-ejer">
      <span>altura n.º ${n+1} de ${N_TABLAS}</span>
      <span>3 mediciones del tiempo</span>
      <span>t̄ = (t₁ + t₂ + t₃) / 3</span>
    </div>

    <p style="margin-top:14px"><b>Altura de caída h =</b>
      ${dato({id:'h-'+(n+1), modelo:f2(ALTURAS_MODELO[n]), ph:'0,00',
              et:'Altura de la tabla '+(n+1), clase:'campo--ancho'})}
      <span class="ejer__u">m</span></p>

    <div class="tabla-caja">
      <table class="tabla">
        <thead>
          <tr><th colspan="3" class="th-grupo">Tabla ${n+1} · tiempo de caída desde esa altura</th></tr>
          <tr><th style="width:26%">Medición n.º</th><th style="width:40%">t (s)</th><th>Observaciones</th></tr>
        </thead>
        <tbody>
          ${[0,1,2].map(j => `
            <tr>
              <td class="col-mag">${j+1}</td>
              <td class="td-centro">${dato({id:`t-${n+1}-${j}`, modelo:f3(tModelo(n,j)), ph:'0,000',
                        et:`Tiempo ${j+1} de la tabla ${n+1}`})}</td>
              <td>${campo({id:`obs-${n+1}-${j}`, modo:'libre', ph:'incidencias, si las hubo',
                        et:`Observaciones de la medición ${j+1} de la tabla ${n+1}`})}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      <caption>Tabla ${n+1}. Tres medidas de la misma magnitud, no tres experimentos distintos.</caption>
    </div>

    <h2 class="sub">Cálculo del tiempo promedio</h2>
    <div class="nota" id="prom-${n+1}"></div>

    <div class="nota nota--aviso">
      <strong>Escribe los tiempos con tres decimales.</strong> El cronómetro resuelve milésimas de
      segundo, así que redondear a dos decimales tira información que después se echa de menos en
      el ajuste. Usa coma o punto decimal, como prefieras: el cuaderno entiende las dos formas.
    </div>
    ${accionesPagina()}
  `);
}

/* --- 17 · Tabla 7 · Resumen experimental --------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Punto 3 · Análisis de resultados</span>
  <h1 class="titulo">Tabla 7 · Resumen experimental</h1>
  ${enunciado(3, 'Reúna en una sola tabla las seis alturas con sus respectivos tiempos promedio.')}

  <p class="plomo">Esta tabla se completa <b>sola</b> con lo que escribiste en las Tablas 1 a 6.
  Si corriges un dato y vuelves aquí, los promedios se recalculan.</p>

  <div class="formula">
    <div class="formula__ec">t̄ = (t₁ + t₂ + t₃) / 3</div>
    <div class="formula__pie">El promedio reduce el efecto de los errores aleatorios del cronómetro.</div>
  </div>

  <div id="tabla-promedios"></div>

  <h2 class="sub">Lectura de los datos</h2>
  <p>Cada barra representa una altura; al lado aparece el tiempo promedio con el que cayó el balín
  desde ella. Observa que las barras crecen mucho más deprisa que los tiempos.</p>
  <div id="barras-datos"></div>

  <div class="nota">
    <strong>Para pensar antes de graficar.</strong> ¿Qué le ocurre al tiempo de caída cuando la
    altura aumenta? Si una altura es el doble de otra, ¿el tiempo también se duplica o cambia de
    otra manera? ¿Los datos sugieren una línea recta o una curva? La columna t̄² de la tabla es
    una pista: compárala con la columna de alturas y fíjate en si el cociente entre ambas se
    mantiene más o menos constante.
  </div>
  ${accionesPagina()}
`);

/* --- 18 · Gráfica y ecuación experimental -------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Punto 4</span>
  <h1 class="titulo">Gráfica y ecuación experimental</h1>
  ${enunciado(4, 'Trace la gráfica de la altura en función del tiempo promedio y obtenga de ella la ecuación experimental del movimiento.')}

  <p class="plomo">Altura <i>h</i> en el eje vertical, tiempo promedio t̄ en el horizontal. La
  gráfica y el ajuste se recalculan solos cada vez que cambias un dato en las tablas.</p>

  <div class="grafica" id="graf-ht"></div>

  <h2 class="sub">Modelo de ajuste</h2>
  <p>El modelo de caída libre es el primero. Los otros dos están para comparar: fíjate en cómo
  cambia el coeficiente de determinación y en si la recta consigue o no seguir a los puntos.</p>

  <div class="ejer__r" style="margin:12px 0 4px">
    <label for="tipo-ajuste">Ajuste de los datos</label>
    <select class="campo campo--texto" id="tipo-ajuste" data-campo="tipo-ajuste"
            aria-label="Tipo de ajuste de los datos" style="min-width:270px">
      <option value="kt2">h = k·t²  ·  modelo de caída libre</option>
      <option value="quad">h = A·t² + B·t + C  ·  parábola general</option>
      <option value="lin">h = m·t + b  ·  recta, para comparar</option>
    </select>
  </div>

  <div id="resultado-ajuste"></div>

  <h2 class="sub">Cómo se interpreta</h2>
  <p>Si el ajuste corresponde a una <b>relación cuadrática</b>, significa que la altura recorrida
  crece con el cuadrado del tiempo, exactamente como predice el modelo de caída libre para un
  cuerpo que parte del reposo. El número que multiplica a <i>t²</i> —el <b>coeficiente
  cuadrático</b>— es el que contiene la información sobre la aceleración, y es lo que se usa en
  la página siguiente.</p>

  <p>Observa también qué tan cerca pasan los puntos experimentales de la curva: pequeñas
  separaciones son normales y provienen de la incertidumbre de las medidas. Lo que no sería normal
  es que los puntos quedaran sistemáticamente por encima en un extremo y por debajo en el otro:
  eso delataría un error de método, no de medida.</p>

  <h2 class="sub">Transcribe aquí los resultados para tu informe</h2>
  <div class="tabla-caja">
    <table class="tabla">
      <thead><tr>
        <th style="width:46%">Ecuación experimental</th>
        <th style="width:27%">Coeficiente de t² (m/s²)</th>
        <th style="width:27%">R²</th>
      </tr></thead>
      <tbody>
        <tr>
          <td>${campo({id:'ec-exp', modo:'libre', ph:'h = k·t²', et:'Ecuación experimental obtenida'})}</td>
          <td class="td-centro">${campo({id:'k-exp', modo:'libre', clase:'campo--num', ph:'0,0000', et:'Coeficiente cuadrático del ajuste'})}</td>
          <td class="td-centro">${campo({id:'r2-exp', modo:'libre', clase:'campo--num', ph:'0,0000', et:'Coeficiente de determinación'})}</td>
        </tr>
      </tbody>
    </table>
    <caption>Estas casillas se autocompletan con lo que el cuaderno acaba de calcular.</caption>
  </div>
  ${accionesPagina()}
`);

/* --- 19 · Determinación de la aceleración -------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Punto 5</span>
  <h1 class="titulo">Determinación de la aceleración</h1>
  ${enunciado(5, 'A partir de la ecuación experimental, determine el valor de la aceleración del balín.')}

  <p class="plomo">Cuatro pasos: el modelo teórico, tu ecuación, la comparación de los
  coeficientes y el resultado. Los pasos 2 y 4 se completan con tus datos.</p>

  <div class="pasos" id="pasos-aceleracion"></div>

  <h2 class="sub">Transcribe el resultado</h2>
  <div class="ejer">
    <p class="ejer__q"><b>Aceleración experimental del balín.</b> Escríbela con dos decimales, tal
    como la usarás en la comparación de la página siguiente.</p>
    <div class="ejer__r">
      <label for="a-exp">a experimental</label>
      ${campo({id:'a-exp', modo:'libre', clase:'campo--num', ph:'0,00', et:'Aceleración experimental'})}
      <span class="ejer__u">m/s²</span>
    </div>
  </div>

  <div class="nota nota--aviso">
    <strong>Un ajuste lineal no sirve aquí.</strong> Si en la página anterior seleccionaste la
    recta <span class="dato">h = m·t + b</span>, no hay término en t² y por tanto no hay de dónde
    despejar la aceleración. Vuelve y elige un modelo cuadrático: ese es, de hecho, uno de los
    resultados de la práctica —no cualquier función describe estos datos—.
  </div>
  ${accionesPagina()}
`);

/* --- 20 · Comparación con la gravedad ------------------------------------ */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Punto 6</span>
  <h1 class="titulo">Comparación con la gravedad</h1>
  ${enunciado(6, 'Compare el valor experimental de la aceleración con el valor conocido de la aceleración de la gravedad.')}

  <p class="plomo">¿Qué tan cerca quedó tu resultado del valor de referencia? El cuaderno calcula
  la diferencia y el error relativo en cuanto tengas tu aceleración.</p>

  <div class="ejer">
    <p class="ejer__q"><b>Valor de referencia.</b> El que se usa en el curso es
    ${f2(G_REF)} m/s². Puedes cambiarlo por el valor local estimado para Pereira,
    ${f3(G_PEREIRA)} m/s², y ver cómo varía el error.</p>
    <div class="ejer__r">
      <label for="g-ref">g de referencia</label>
      ${campo({id:'g-ref', modo:'libre', clase:'campo--num', ph:f2(G_REF),
               modelo:f2(G_REF), et:'Valor de referencia de la gravedad'})}
      <span class="ejer__u">m/s²</span>
    </div>
  </div>

  <div id="comparacion-host"></div>

  <div class="formula">
    <div class="formula__ec">E<sub>r</sub> (%) = |a<sub>exp</sub> − g| / g × 100</div>
    <div class="formula__pie">Error relativo del valor experimental respecto al de referencia.</div>
  </div>

  <h2 class="sub">Transcribe los resultados para tu informe</h2>
  <div class="tabla-caja">
    <table class="tabla">
      <thead><tr>
        <th style="width:25%">a experimental (m/s²)</th>
        <th style="width:25%">g de referencia (m/s²)</th>
        <th style="width:25%">Diferencia (m/s²)</th>
        <th style="width:25%">Error relativo (%)</th>
      </tr></thead>
      <tbody>
        <tr>
          <td class="td-centro">${campo({id:'cmp-a', modo:'libre', clase:'campo--num', ph:'0,00', et:'Aceleración experimental transcrita'})}</td>
          <td class="td-centro">${campo({id:'cmp-g', modo:'libre', clase:'campo--num', ph:'0,00', et:'Gravedad de referencia transcrita'})}</td>
          <td class="td-centro">${campo({id:'cmp-dif', modo:'libre', clase:'campo--num', ph:'0,00', et:'Diferencia'})}</td>
          <td class="td-centro">${campo({id:'cmp-err', modo:'libre', clase:'campo--num', ph:'0,00', et:'Error relativo'})}</td>
        </tr>
      </tbody>
    </table>
    <caption>Tabla final de resultados. Las casillas se autocompletan con lo que el cuaderno calculó.</caption>
  </div>

  <div class="nota">
    <strong>El valor experimental no se reemplaza por el teórico.</strong> El objetivo no es
    «acertar» 9,8 sino medir y después comparar. Si tu resultado difiere, la pregunta correcta no
    es cómo corregirlo, sino de dónde viene la diferencia: la resolución del cronómetro, los
    retardos del mecanismo de liberación y del sensor, la lectura de la altura o la verticalidad
    de la torre. Un informe que explica bien una diferencia del 3 % vale más que uno que la
    esconde.
  </div>
  ${accionesPagina()}
`);

/* --- 21 · Simulador ------------------------------------------------------ */
PAGINAS.push(() => `
  <span class="eyebrow">Sección 7</span>
  <h1 class="titulo">Simulador de caída libre</h1>
  <p class="plomo">El mismo experimento, dentro del cuaderno y en cámara lenta. Sirve para
  anticipar lo que vas a ver en el laboratorio y para comprobar los tiempos que predijiste en el
  preinforme.</p>

  <div class="instr">
    <h3 class="instr__tit">Balín en caída <span>cámara lenta ×4</span></h3>
    <p class="instr__ayuda">Mueve el deslizador para fijar la altura de liberación y pulsa
    <b>Soltar balín</b>. Las marcas que va dejando corresponden a <b>intervalos iguales de
    tiempo</b>: fíjate en cómo se separan cada vez más conforme el balín baja. Eso, y no otra
    cosa, es lo que significa que el movimiento sea acelerado.</p>
    <div id="simulador-host"></div>
  </div>

  <div class="nota">
    <strong>Prueba esto.</strong> Fija la altura en 0,30 m, suelta el balín y anota el tiempo.
    Después fija 1,20 m, cuatro veces mayor, y vuelve a soltarlo. El tiempo no se multiplica por
    cuatro: se duplica. Esa es exactamente la relación que vas a encontrar en tus datos
    experimentales.
  </div>

  <div class="nota nota--aviso">
    <strong>El simulador es ideal, el laboratorio no.</strong> Aquí el balín cae con
    ${f2(G_REF)} m/s² exactos, sin rozamiento, sin retardo en la liberación y con un cronómetro
    perfecto. Tus medidas reales tendrán dispersión; esa diferencia entre el modelo y la medida es
    justamente el objeto del análisis de las últimas páginas.
  </div>
`);

/* --- 22 · Preguntas ------------------------------------------------------ */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Punto 7</span>
  <h1 class="titulo">Preguntas</h1>
  ${enunciado(7, 'Responda y justifique cada pregunta con los datos y la ecuación que obtuvo.')}

  ${PREGUNTAS.map((q,i) => `
    <h3 class="sub3">${i+1}. ${esc(q.texto)}</h3>
    <p style="font-size:.86rem;color:var(--tinta-3);margin:0 0 7px">${esc(q.guia)}</p>
    ${area({id:q.id, guia:q.guia, modelo:q.modelo, et:'Respuesta '+(i+1), filas:7})}
  `).join('')}

  <div class="nota">
    <strong>Se califica la justificación, no la extensión.</strong> Una respuesta corta que cite
    un valor concreto de tus tablas y lo explique con la ley h = ½·a·t² vale más que un párrafo
    largo y genérico.
  </div>
  ${accionesPagina()}
`);

/* --- 23 · Conclusiones --------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Informe · Punto 8</span>
  <h1 class="titulo">Conclusiones</h1>
  ${enunciado(8, 'Escriba 3 conclusiones con respecto a la práctica.')}
  <p class="plomo">Cada conclusión debe apoyarse en algo que mediste: una pareja de la Tabla 7, la
  ecuación del ajuste o el error relativo de la última página.</p>

  <div class="datos-ejer">
    <span>datos experimentales</span><span>relación altura–tiempo</span>
    <span>aceleración obtenida</span><span>fuentes de error</span>
  </div>

  ${CONCLUSIONES.map((c,i) => `
    <h3 class="sub3">Conclusión ${i+1}</h3>
    <p style="font-size:.86rem;color:var(--tinta-3);margin:0 0 7px">${esc(c.guia)}</p>
    ${area({id:c.id, guia:c.guia, modelo:c.modelo, et:'Conclusión '+(i+1), filas:6})}
  `).join('')}
  ${accionesPagina()}
`);

/* --- 24 · Glosario ------------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Anexo</span>
  <h1 class="titulo">Glosario</h1>
  <p class="plomo">Toca cada término para desplegar su definición.</p>

  <div class="glosario">
    ${GLOSARIO.map((g,i) => `
      <div class="glos-item">
        <button class="glos-btn" data-glos="${i}" aria-expanded="false" aria-controls="glos-${i}">
          <span class="glos-term">${esc(g.t)}</span>
          <span class="glos-mas" aria-hidden="true">+</span>
        </button>
        <div class="glos-def" id="glos-${i}" hidden>
          ${esc(g.d)} ${g.f ? `<em>(${esc(g.f)})</em>` : ''}
        </div>
      </div>`).join('')}
  </div>
`);

/* --- 25 · Referencias ---------------------------------------------------- */
PAGINAS.push(() => `
  <span class="eyebrow">Anexo</span>
  <h1 class="titulo">Referencias</h1>
  <p class="plomo">Fuentes que sustentan el marco teórico y el procedimiento. Formato APA,
  7.ª edición.</p>

  <div style="margin-top:18px">
    ${REFERENCIAS.map(r => `
      <p style="padding-left:2.2em;text-indent:-2.2em;margin-bottom:14px;font-size:.95rem">${r}</p>
    `).join('')}
  </div>

  <div class="nota">
    <strong>Cómo citar este cuaderno.</strong> Departamento de Física, Universidad Tecnológica de
    Pereira. <i>Cuaderno interactivo de Laboratorio de Física I: caída libre</i>
    [Recurso educativo digital].
  </div>

  <h2 class="sub">Tu trabajo</h2>
  <p>Todo lo que escribiste se guarda únicamente en este navegador y en este dispositivo. Usa
  <em>Imprimir</em> en la barra superior para generar el PDF de entrega con todas las páginas, o
  <em>Reiniciar</em> para vaciar el cuaderno y empezar de nuevo.</p>
`);
