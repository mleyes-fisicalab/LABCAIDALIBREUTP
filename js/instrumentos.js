/* ============================================================================
   INSTRUMENTOS.JS — Componentes interactivos de la práctica
   1. Montaje    : torre de caída libre con puntos sensibles
   2. Simulador  : el balín cayendo en cámara lenta, con marcas de tiempo igual
   3. Analisis   : promedios, Tabla 7, gráfica, ajuste, aceleración y error
   ========================================================================== */

const SIN_MOVIMIENTO = window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function fmt(x, d){ return Number(x).toFixed(d).replace('.', ','); }

function leerNum(id){
  const el = document.getElementById(id);
  if (!el) return null;
  const n = parseFloat(String(el.value).replace(/\s/g, '').replace(',', '.'));
  return isFinite(n) ? n : null;
}

/* ==========================================================================
   1. TORRE DE CAÍDA LIBRE CON PUNTOS SENSIBLES
   ========================================================================== */
const Montaje = (() => {

  function svg(){
    return `
    <svg viewBox="128 26 512 440" role="img"
         aria-label="Esquema del montaje experimental de caída libre: torre, mecanismo de liberación, balín, sensor de impacto y cronómetro">

      <!-- mesa -->
      <path d="M 120 418 L 250 396 L 430 404 L 320 428 Z"
            fill="#C9C4B4" stroke="#1F1C17" stroke-width="2.6" stroke-linejoin="round"/>

      <!-- torre: dos perfiles -->
      <rect x="258" y="58" width="11" height="352" fill="#9A968A" stroke="#1F1C17" stroke-width="2.2"/>
      <rect x="276" y="58" width="11" height="352" fill="#BFBBAE" stroke="#1F1C17" stroke-width="2.2"/>
      <g stroke="#1F1C17" stroke-width="1" opacity=".45">
        ${Array.from({length:12}, (_,i) =>
          `<line x1="287" y1="${86 + i*28}" x2="296" y2="${86 + i*28}"/>`).join('')}
      </g>

      <!-- mecanismo de liberación -->
      <rect x="238" y="44" width="70" height="24" rx="4" fill="#0C2B52" stroke="#1F1C17" stroke-width="2"/>
      <circle cx="273" cy="70" r="6" fill="#C87020" stroke="#1F1C17" stroke-width="1.6"/>
      <text x="320" y="56" class="m-lab" text-anchor="start">mecanismo de liberación</text>
      <text x="320" y="70" class="m-et"  text-anchor="start">electroimán</text>

      <!-- punto de liberación -->
      <circle cx="273" cy="82" r="5" fill="none" stroke="#C87020" stroke-width="2.2" stroke-dasharray="3 3"/>

      <!-- trayectoria -->
      <line x1="273" y1="92" x2="273" y2="386" stroke="#C87020" stroke-width="2"
            stroke-dasharray="2 7"/>
      <path d="M 268 378 L 273 390 L 278 378" fill="none" stroke="#C87020" stroke-width="2.2"
            stroke-linejoin="round" stroke-linecap="round"/>

      <!-- balín cayendo, con estela -->
      <g>
        <line x1="273" y1="168" x2="273" y2="188" stroke="#8A8171" stroke-width="2" stroke-linecap="round"/>
        <line x1="265" y1="172" x2="266" y2="189" stroke="#8A8171" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="281" y1="172" x2="280" y2="189" stroke="#8A8171" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="273" cy="203" r="12" fill="#3F3A33" stroke="#1F1C17" stroke-width="2.4"/>
        <ellipse cx="268" cy="198" rx="4" ry="2.6" fill="#F3ECD9" opacity=".65"/>
      </g>
      <text x="300" y="207" class="m-lab" text-anchor="start">balín</text>
      <text x="318" y="336" class="m-lab" text-anchor="start">torre</text>

      <!-- sensor de impacto -->
      <ellipse cx="273" cy="400" rx="30" ry="9" fill="#C87020" stroke="#1F1C17" stroke-width="2.4"/>
      <line x1="252" y1="444" x2="266" y2="410" stroke="#8A8171" stroke-width="1.2"/>
      <text x="232" y="452" class="m-lab" text-anchor="middle">sensor de impacto</text>

      <!-- altura h -->
      <line x1="178" y1="82" x2="178" y2="400" stroke="#0C2B52" stroke-width="2.4"/>
      <path d="M 173 90 L 178 78 L 183 90" fill="none" stroke="#0C2B52" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M 173 392 L 178 404 L 183 392" fill="none" stroke="#0C2B52" stroke-width="2.2" stroke-linejoin="round"/>
      <line x1="170" y1="82"  x2="266" y2="82"  stroke="#8A8171" stroke-width="1.2" stroke-dasharray="4 3"/>
      <line x1="170" y1="400" x2="243" y2="400" stroke="#8A8171" stroke-width="1.2" stroke-dasharray="4 3"/>
      <rect x="148" y="228" width="34" height="30" rx="5" fill="#F3ECD9" stroke="#0C2B52" stroke-width="2"/>
      <text x="165" y="250" class="m-et" text-anchor="middle">h</text>

      <!-- cronómetro -->
      <path d="M 303 400 C 370 396 410 384 428 366" fill="none" stroke="#1F1C17"
            stroke-width="2" stroke-dasharray="5 4"/>
      <rect x="430" y="300" width="112" height="76" rx="8" fill="#F3ECD9" stroke="#1F1C17" stroke-width="2.6"/>
      <rect x="442" y="312" width="88" height="26" rx="3" fill="#0C2B52"/>
      <text x="486" y="331" class="m-visor" text-anchor="middle">0.000 s</text>
      <circle cx="452" cy="358" r="6" fill="#C87020" stroke="#1F1C17" stroke-width="1.4"/>
      <circle cx="476" cy="358" r="6" fill="#E5DBC1" stroke="#1F1C17" stroke-width="1.4"/>
      <circle cx="500" cy="358" r="6" fill="#E5DBC1" stroke="#1F1C17" stroke-width="1.4"/>
      <text x="486" y="394" class="m-lab" text-anchor="middle">cronómetro UTP</text>

      <!-- vector g -->
      <line x1="594" y1="96" x2="594" y2="178" stroke="#A62F26" stroke-width="3.4"/>
      <path d="M 586 168 L 594 184 L 602 168" fill="none" stroke="#A62F26" stroke-width="3.2"
            stroke-linejoin="round" stroke-linecap="round"/>
      <text x="612" y="140" class="m-et" text-anchor="start" fill="#A62F26">g</text>
      <text x="594" y="208" class="m-lab" text-anchor="middle">${fmt(G_REF,2)} m/s²</text>

      <!-- puntos sensibles -->
      <g class="punto-caliente" data-parte="tor" tabindex="0" role="button" aria-label="Torre o soporte vertical">
        <circle cx="292" cy="332" r="15" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="lib" tabindex="0" role="button" aria-label="Mecanismo de liberación">
        <circle cx="273" cy="56" r="15" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="bal" tabindex="0" role="button" aria-label="Balín">
        <circle cx="273" cy="203" r="18" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="alt" tabindex="0" role="button" aria-label="Altura h">
        <circle cx="165" cy="243" r="17" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="tra" tabindex="0" role="button" aria-label="Trayectoria vertical">
        <circle cx="273" cy="130" r="15" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="sen" tabindex="0" role="button" aria-label="Sensor de impacto">
        <circle cx="273" cy="400" r="16" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="cro" tabindex="0" role="button" aria-label="Cronómetro">
        <circle cx="486" cy="338" r="17" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
      <g class="punto-caliente" data-parte="gra" tabindex="0" role="button" aria-label="Aceleración de la gravedad">
        <circle cx="594" cy="138" r="16" fill="#C87020" fill-opacity=".18" stroke="#C87020" stroke-width="2"/>
      </g>
    </svg>
    <div class="montaje__leyenda" id="montaje-leyenda" role="status" aria-live="polite">
      <b>Toca un punto naranja</b> para leer qué función cumple cada parte del montaje.
    </div>`;
  }

  function montar(id){
    const host = document.getElementById(id);
    if (!host) return;
    host.innerHTML = svg();
    const leyenda = host.querySelector('#montaje-leyenda');
    const mostrar = clave => {
      const p = PARTES.find(x => x.id === clave);
      if (p) leyenda.innerHTML = `<b>${esc(p.n)}.</b> ${esc(p.d)}`;
    };
    host.querySelectorAll('.punto-caliente').forEach(g => {
      g.addEventListener('click', () => mostrar(g.dataset.parte));
      g.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' '){ mostrar(g.dataset.parte); e.preventDefault(); }
      });
    });
  }

  return { montar };
})();

/* ==========================================================================
   2. SIMULADOR DE CAÍDA LIBRE
   ========================================================================== */
const Simulador = (() => {
  const VW = 660, VH = 430;
  const LENTITUD = 4;          // cámara lenta ×4
  const N_MARCAS = 8;          // marcas a intervalos iguales de tiempo
  const H_MAX = 2.00;          // tope del deslizador y de la regla

  /* columna de caída */
  const COL = { x: 150, yTop: 46, ySuelo: 388 };
  const escala = () => (COL.ySuelo - COL.yTop) / H_MAX;     // px por metro

  /* gráfica y(t) */
  const G = { l: 318, r: 28, t: 46, b: 70 };

  let host, svg, h0 = 1.20, t = 0, estado = 'listo', anim = null, ultimo = 0;

  const tFin  = () => Math.sqrt(2 * h0 / G_REF);
  const yDe   = tt => Math.max(0, h0 - 0.5 * G_REF * tt * tt);
  const vDe   = tt => G_REF * Math.min(tt, tFin());
  const pyCol = y => COL.ySuelo - y * escala();

  function dibujar(){
    const tf = tFin();
    const yAct = yDe(t);

    /* --- regla de la columna --- */
    let regla = '';
    for (let m = 0; m <= H_MAX + 1e-9; m += 0.20){
      const y = pyCol(m);
      const fuerte = Math.abs(m * 5 - Math.round(m * 5)) < 1e-6 &&
                     Math.abs((m * 5) % 2.5) < 1e-6;
      regla += `<line x1="${COL.x - 46}" y1="${y.toFixed(1)}" x2="${COL.x - 36}" y2="${y.toFixed(1)}"
                  stroke="#8A8171" stroke-width="${fuerte ? 1.8 : 1.1}"/>
                <text class="g-num" x="${COL.x - 52}" y="${(y + 4).toFixed(1)}" text-anchor="end">${fmt(m,2)}</text>`;
    }

    /* --- marcas de tiempos iguales ya recorridas --- */
    let marcas = '';
    for (let k = 1; k <= N_MARCAS; k++){
      const tk = tf * k / N_MARCAS;
      if (t < tk - 1e-9) continue;
      const y = pyCol(yDe(tk));
      marcas += `<line x1="${COL.x - 26}" y1="${y.toFixed(1)}" x2="${COL.x + 26}" y2="${y.toFixed(1)}"
                   stroke="#C87020" stroke-width="1.6" opacity=".8"/>`;
    }

    /* --- curva y(t) --- */
    const anchoG = VW - G.r - G.l, altoG = VH - G.b - G.t;
    const pxG = tt => G.l + (tf > 0 ? tt / tf : 0) * anchoG;
    const pyG = y  => (VH - G.b) - (h0 > 0 ? y / h0 : 0) * altoG;

    let rej = '';
    for (let k = 0; k <= 4; k++){
      const tt = tf * k / 4;
      rej += `<line class="g-rejilla" x1="${pxG(tt).toFixed(1)}" y1="${G.t}"
                x2="${pxG(tt).toFixed(1)}" y2="${VH - G.b}"/>
              <text class="g-num" x="${pxG(tt).toFixed(1)}" y="${VH - G.b + 16}" text-anchor="middle">${fmt(tt,3)}</text>`;
    }
    for (let k = 0; k <= 4; k++){
      const y = h0 * k / 4;
      rej += `<line class="g-rejilla" x1="${G.l}" y1="${pyG(y).toFixed(1)}"
                x2="${VW - G.r}" y2="${pyG(y).toFixed(1)}"/>
              <text class="g-num" x="${G.l - 7}" y="${(pyG(y) + 4).toFixed(1)}" text-anchor="end">${fmt(y,2)}</text>`;
    }

    let curva = '';
    for (let k = 0; k <= 60; k++){
      const tt = tf * k / 60;
      curva += (k ? 'L' : 'M') + pxG(tt).toFixed(1) + ' ' + pyG(yDe(tt)).toFixed(1) + ' ';
    }
    let trazo = '';
    const kAct = tf > 0 ? Math.round(Math.min(t, tf) / tf * 60) : 0;
    for (let k = 0; k <= kAct; k++){
      const tt = tf * k / 60;
      trazo += (k ? 'L' : 'M') + pxG(tt).toFixed(1) + ' ' + pyG(yDe(tt)).toFixed(1) + ' ';
    }

    svg.innerHTML = `
      <!-- columna -->
      <rect x="${COL.x - 30}" y="${COL.yTop - 8}" width="60" height="${COL.ySuelo - COL.yTop + 8}"
            fill="rgba(229,219,193,.4)" stroke="var(--linea)" stroke-width="1"/>
      ${regla}
      <text class="g-tit" x="${COL.x - 52}" y="${COL.yTop - 16}" text-anchor="end">altura (m)</text>

      <!-- mecanismo de liberación en h0 -->
      <rect x="${COL.x - 34}" y="${(pyCol(h0) - 20).toFixed(1)}" width="68" height="15" rx="3"
            fill="#0C2B52"/>
      <line x1="${COL.x - 40}" y1="${pyCol(h0).toFixed(1)}" x2="${COL.x + 40}" y2="${pyCol(h0).toFixed(1)}"
            stroke="#0C2B52" stroke-width="1.6" stroke-dasharray="4 3"/>

      ${marcas}

      <!-- suelo y sensor -->
      <line x1="${COL.x - 52}" y1="${COL.ySuelo}" x2="${COL.x + 52}" y2="${COL.ySuelo}"
            stroke="#1F1C17" stroke-width="2.6"/>
      <ellipse cx="${COL.x}" cy="${COL.ySuelo}" rx="24" ry="6" fill="#C87020"
               stroke="#1F1C17" stroke-width="1.8"/>

      <!-- balín -->
      <circle cx="${COL.x}" cy="${pyCol(yAct).toFixed(1)}" r="11"
              fill="#3F3A33" stroke="#1F1C17" stroke-width="2.2"/>
      <ellipse cx="${(COL.x - 4).toFixed(1)}" cy="${(pyCol(yAct) - 4).toFixed(1)}" rx="3.6" ry="2.4"
               fill="#F3ECD9" opacity=".65"/>

      <!-- gráfica y(t) -->
      ${rej}
      <line class="g-eje" x1="${G.l}" y1="${VH - G.b}" x2="${VW - G.r}" y2="${VH - G.b}"/>
      <line class="g-eje" x1="${G.l}" y1="${G.t}" x2="${G.l}" y2="${VH - G.b}"/>
      <text class="g-tit" x="${((VW - G.r + G.l) / 2).toFixed(1)}" y="${VH - G.b + 36}" text-anchor="middle">tiempo t (s)</text>
      <text class="g-tit" x="${(-(VH - G.b + G.t) / 2).toFixed(1)}" y="${G.l - 42}" text-anchor="middle"
            transform="rotate(-90)">posición y (m)</text>
      <text class="g-tit" x="${G.l}" y="${G.t - 14}" text-anchor="start">posición del balín frente al tiempo</text>

      <path d="${curva}" fill="none" stroke="var(--linea)" stroke-width="2.4" stroke-dasharray="5 4"/>
      <path d="${trazo}" fill="none" stroke="#0C2B52" stroke-width="2.8" stroke-linejoin="round"/>
      <circle cx="${pxG(Math.min(t, tf)).toFixed(1)}" cy="${pyG(yAct).toFixed(1)}" r="5.5"
              fill="#C87020" stroke="#F3ECD9" stroke-width="1.8"/>`;
  }

  function refrescar(){
    dibujar();
    const tf = tFin(), yAct = yDe(t);
    host.querySelector('#sim-lecturas').innerHTML = `
      <div class="visor"><div class="visor__et">Tiempo transcurrido</div>
        <div class="visor__v">${fmt(t,3)} s</div></div>
      <div class="visor"><div class="visor__et">Posición y</div>
        <div class="visor__v" style="color:#8FE3A8">${fmt(yAct,3)} m</div></div>
      <div class="visor"><div class="visor__et">Rapidez</div>
        <div class="visor__v" style="color:#FF9E85">${fmt(vDe(t),2)} m/s</div></div>
      <div class="visor"><div class="visor__et">Tiempo total de caída</div>
        <div class="visor__v">${fmt(tf,3)} s</div></div>`;
    host.querySelector('#sim-cuenta').innerHTML =
      `t<sub>caída</sub> = √(2h/g) = √(2 × ${fmt(h0,2)} / ${fmt(G_REF,2)}) = <b>${fmt(tf,3)} s</b> · ` +
      `v<sub>impacto</sub> = √(2·g·h) = <b>${fmt(Math.sqrt(2*G_REF*h0),2)} m/s</b>`;
    host.querySelector('#out-h').textContent = fmt(h0,2) + ' m';
    host.querySelector('#sim-h').value = h0.toFixed(2);
    host.querySelector('#sim-soltar').textContent =
      estado === 'cayendo' ? '■ Detener' : '▶ Soltar balín';
    svg.setAttribute('aria-valuetext',
      `altura ${fmt(h0,2)} metros, tiempo ${fmt(t,3)} segundos, posición ${fmt(yAct,3)} metros`);
  }

  function bucle(ahora){
    if (!ultimo) ultimo = ahora;
    const dt = Math.min((ahora - ultimo) / 1000, 0.05);
    ultimo = ahora;
    t = Math.min(t + dt / LENTITUD, tFin());
    refrescar();
    if (t >= tFin() - 1e-9){ estado = 'fin'; anim = null; ultimo = 0; refrescar(); return; }
    anim = requestAnimationFrame(bucle);
  }

  function soltar(){
    if (estado === 'cayendo'){ detener(); return; }
    t = 0; estado = 'cayendo'; ultimo = 0;
    if (SIN_MOVIMIENTO){ t = tFin(); estado = 'fin'; refrescar(); return; }
    cancelAnimationFrame(anim);
    anim = requestAnimationFrame(bucle);
    refrescar();
  }

  function detener(){
    cancelAnimationFrame(anim); anim = null; ultimo = 0;
    estado = (t >= tFin() - 1e-9) ? 'fin' : 'listo';
    refrescar();
  }

  function reiniciar(){
    cancelAnimationFrame(anim); anim = null; ultimo = 0;
    t = 0; estado = 'listo';
    refrescar();
  }

  function montar(id){
    host = document.getElementById(id);
    if (!host) return;
    host.innerHTML = `
      <svg class="caida-svg" viewBox="0 0 ${VW} ${VH}" role="img"
           aria-label="Simulación de un balín en caída libre junto a la gráfica de su posición frente al tiempo"></svg>
      <div class="lectura-caja" id="sim-lecturas" style="margin-top:13px"></div>
      <p id="sim-cuenta" class="instr__ayuda"
         style="margin:12px 0 0;font-family:var(--mono);font-size:.86rem;color:var(--azul)"></p>
      <div class="controles">
        <div class="control">
          <label for="sim-h">Altura de liberación · <output id="out-h"></output></label>
          <input type="range" id="sim-h" min="0.20" max="${H_MAX}" step="0.05" value="${h0}">
        </div>
      </div>
      <div class="materiales" role="group" aria-label="Control de la simulación">
        <button class="chip" id="sim-soltar">▶ Soltar balín</button>
        <button class="chip" id="sim-reiniciar">↺ Reiniciar</button>
      </div>`;

    svg = host.querySelector('.caida-svg');
    host.querySelector('#sim-h').addEventListener('input', e => {
      h0 = parseFloat(e.target.value);
      reiniciar();
    });
    host.querySelector('#sim-soltar').addEventListener('click', soltar);
    host.querySelector('#sim-reiniciar').addEventListener('click', reiniciar);

    refrescar();
  }

  return { montar, reiniciar };
})();

/* ==========================================================================
   3. ANÁLISIS: PROMEDIOS, TABLA 7, GRÁFICA, AJUSTE Y ACELERACIÓN
   ========================================================================== */
const Analisis = (() => {

  /* ------------------------------------------------- Lectura de las tablas */
  function datosTabla(n){                       // n de 1 a N_TABLAS
    const h  = leerNum('h-' + n);
    const ts = [0,1,2].map(j => leerNum(`t-${n}-${j}`));
    const okT = ts.every(x => x !== null && x > 0);
    const okH = h !== null && h > 0;
    const prom = okT ? (ts[0] + ts[1] + ts[2]) / 3 : null;
    return { n, h, ts, prom, okT, okH, completa: okT && okH };
  }

  function pares(){
    const p = [];
    for (let n = 1; n <= N_TABLAS; n++){
      const d = datosTabla(n);
      if (d.completa) p.push({ tabla:n, h:d.h, t:d.prom });
    }
    return p;
  }

  /* ---------------------------------------- Cuadro de promedio por tabla */
  function pintarPromedios(){
    for (let n = 1; n <= N_TABLAS; n++){
      const caja = document.getElementById('prom-' + n);
      if (!caja) continue;
      const d = datosTabla(n);
      if (!d.okT){
        caja.innerHTML = '<strong>Faltan mediciones.</strong> Escribe los <b>tres tiempos</b> ' +
          'para que el cuaderno calcule el promedio de esta altura.';
        continue;
      }
      const suma = d.ts[0] + d.ts[1] + d.ts[2];
      caja.innerHTML =
        `<strong>Tiempo promedio de la Tabla ${n}</strong><br>` +
        `t₁ + t₂ + t₃ = ${fmt(d.ts[0],3)} s + ${fmt(d.ts[1],3)} s + ${fmt(d.ts[2],3)} s ` +
        `= <b>${fmt(suma,3)} s</b><br>` +
        `t̄ = ${fmt(suma,3)} / 3 = <span class="dato" style="font-size:1.08em">${fmt(d.prom,4)} s</span>` +
        (d.okH
          ? `<br>Con h = ${fmt(d.h,2)} m, esta pareja ya entra en la Tabla 7 y en la gráfica.`
          : `<br><b style="color:var(--err)">Falta la altura h:</b> sin ella la pareja no puede graficarse.`);
    }
  }

  /* ------------------------------------------------------ Tabla 7 y barras */
  function pintarTabla7(){
    const host = document.getElementById('tabla-promedios');
    if (!host) return;
    let filas = '';
    for (let n = 1; n <= N_TABLAS; n++){
      const d = datosTabla(n);
      const vacio = '<span style="color:var(--tinta-3);font-style:italic">pendiente</span>';
      filas += `<tr>
        <td class="col-mag">${n}</td>
        <td class="td-centro">${d.okH ? `<span class="dato">${fmt(d.h,2)}</span>` : vacio}</td>
        <td class="td-centro">${d.okT ? `<span class="dato">${fmt(d.ts[0],3)}</span>` : vacio}</td>
        <td class="td-centro">${d.okT ? `<span class="dato">${fmt(d.ts[1],3)}</span>` : vacio}</td>
        <td class="td-centro">${d.okT ? `<span class="dato">${fmt(d.ts[2],3)}</span>` : vacio}</td>
        <td class="td-centro">${d.okT ? `<span class="dato" style="color:var(--azul-2)">${fmt(d.prom,4)}</span>` : vacio}</td>
        <td class="td-centro">${d.okT ? `<span class="dato">${fmt(d.prom*d.prom,4)}</span>` : vacio}</td>
      </tr>`;
    }
    host.innerHTML = `<div class="tabla-caja">
      <table class="tabla" style="min-width:680px">
        <thead>
          <tr><th colspan="7" class="th-grupo">Tabla 7 · alturas y tiempos promedio</th></tr>
          <tr>
            <th style="width:9%">Tabla</th><th style="width:14%">h (m)</th>
            <th class="th-sub">t₁ (s)</th><th class="th-sub">t₂ (s)</th><th class="th-sub">t₃ (s)</th>
            <th style="width:16%">t̄ (s)</th><th style="width:16%">t̄² (s²)</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
      <caption>Tabla 7. Resumen de las seis alturas con sus tiempos promedio. Se completa sola.</caption>
    </div>`;
  }

  function pintarBarras(){
    const host = document.getElementById('barras-datos');
    if (!host) return;
    const P = pares();
    if (!P.length){
      host.innerHTML = '<p class="instr__ayuda" style="margin:10px 0 0">Aún no hay parejas ' +
        'completas. Llena la altura y los tres tiempos de alguna tabla para ver el resumen aquí.</p>';
      return;
    }
    const hMax = Math.max(...P.map(p => p.h));
    host.innerHTML = '<div class="barras">' + P.map(p => `
      <div class="barra-dato">
        <span class="barra-dato__et">Tabla ${p.tabla}</span>
        <span class="barra-dato__pista"><i style="width:${Math.max(3, p.h / hMax * 100).toFixed(1)}%"></i></span>
        <span class="barra-dato__v">h = ${fmt(p.h,2)} m · t̄ = ${fmt(p.t,3)} s</span>
      </div>`).join('') + '</div>';
  }

  /* ------------------------------------------- Ajustes por mínimos cuadrados */
  function fitKT2(P){                                   // h = k·t²  (por el origen)
    let s1 = 0, s2 = 0;
    P.forEach(p => { s1 += p.h * p.t * p.t; s2 += Math.pow(p.t, 4); });
    if (s2 === 0) return null;
    const k = s1 / s2;
    return { tipo:'kt2', k, f: t => k * t * t };
  }

  function fitLin(P){                                   // h = m·t + b
    const n = P.length;
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    P.forEach(p => { sx += p.t; sy += p.h; sxx += p.t * p.t; sxy += p.t * p.h; });
    const den = n * sxx - sx * sx;
    if (Math.abs(den) < 1e-14) return null;
    const m = (n * sxy - sx * sy) / den;
    return { tipo:'lin', m, b:(sy - m * sx) / n, f: t => m * t + (sy - m * sx) / n };
  }

  function fitQuad(P){                                  // h = A·t² + B·t + C
    const n = P.length;
    let s1 = 0, s2 = 0, s3 = 0, s4 = 0, sy = 0, sty = 0, st2y = 0;
    P.forEach(p => {
      const t = p.t;
      s1 += t; s2 += t*t; s3 += t*t*t; s4 += t*t*t*t;
      sy += p.h; sty += t * p.h; st2y += t * t * p.h;
    });
    const M = [[s4,s3,s2],[s3,s2,s1],[s2,s1,n]], V = [st2y, sty, sy];
    const det3 = m => m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])
                    - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])
                    + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
    const sust = (m,c,v) => m.map((fila,i) => fila.map((x,j) => j === c ? v[i] : x));
    const d = det3(M);
    if (Math.abs(d) < 1e-14) return null;
    const A = det3(sust(M,0,V))/d, B = det3(sust(M,1,V))/d, C = det3(sust(M,2,V))/d;
    return { tipo:'quad', A, B, C, f: t => A*t*t + B*t + C };
  }

  function coefR2(P, f){
    const ym = P.reduce((s,p) => s + p.h, 0) / P.length;
    let ssr = 0, sst = 0;
    P.forEach(p => { ssr += Math.pow(p.h - f(p.t), 2); sst += Math.pow(p.h - ym, 2); });
    return sst > 0 ? 1 - ssr / sst : 1;
  }

  function tipoAjuste(){
    const el = document.getElementById('tipo-ajuste');
    return (el && el.value) ? el.value : 'kt2';
  }

  function ajuste(P){
    if (P.length < 3) return null;
    const tipo = tipoAjuste();
    let f = null;
    if (tipo === 'lin')       f = fitLin(P);
    else if (tipo === 'quad') f = fitQuad(P) || fitKT2(P);
    else                      f = fitKT2(P);
    if (f) f.R2 = coefR2(P, f.f);
    return f;
  }

  function ecuacion(a){
    if (!a) return '—';
    const s = x => (x >= 0 ? '+ ' : '− ') + fmt(Math.abs(x), 4);
    if (a.tipo === 'kt2')  return `h = ${fmt(a.k,4)} · t²`;
    if (a.tipo === 'lin')  return `h = ${fmt(a.m,4)} · t ${s(a.b)}`;
    return `h = ${fmt(a.A,4)} · t² ${s(a.B)} · t ${s(a.C)}`;
  }

  const coefCuadratico = a => !a ? NaN : (a.tipo === 'kt2' ? a.k : a.tipo === 'quad' ? a.A : NaN);

  /* ------------------------------------------------------------- Gráfica */
  function pintarGrafica(P, a){
    const host = document.getElementById('graf-ht');
    if (!host) return;
    const W = 660, H = 360, M = { l: 58, r: 20, t: 18, b: 48 };
    const tMax = P.length ? Math.max(...P.map(p => p.t)) * 1.15 : 0.8;
    const hMax = P.length ? Math.max(...P.map(p => p.h)) * 1.15 : 2.0;
    const px = t => M.l + t / tMax * (W - M.l - M.r);
    const py = h => (H - M.b) - h / hMax * (H - M.b - M.t);

    let g = '';
    for (let k = 0; k <= 5; k++){
      const t = tMax * k / 5;
      g += `<line class="g-rejilla" x1="${px(t).toFixed(1)}" y1="${M.t}" x2="${px(t).toFixed(1)}" y2="${H - M.b}"/>
            <text class="g-num" x="${px(t).toFixed(1)}" y="${H - M.b + 16}" text-anchor="middle">${fmt(t,2)}</text>`;
    }
    for (let k = 0; k <= 5; k++){
      const h = hMax * k / 5;
      g += `<line class="g-rejilla" x1="${M.l}" y1="${py(h).toFixed(1)}" x2="${W - M.r}" y2="${py(h).toFixed(1)}"/>
            <text class="g-num" x="${M.l - 7}" y="${(py(h) + 4).toFixed(1)}" text-anchor="end">${fmt(h,2)}</text>`;
    }
    g += `<line class="g-eje" x1="${M.l}" y1="${H - M.b}" x2="${W - M.r}" y2="${H - M.b}"/>
          <line class="g-eje" x1="${M.l}" y1="${M.t}" x2="${M.l}" y2="${H - M.b}"/>
          <text class="g-tit" x="${((W + M.l)/2).toFixed(1)}" y="${H - 8}" text-anchor="middle">tiempo promedio t̄ (s)</text>
          <text class="g-tit" x="${(-((H - M.b + M.t)/2)).toFixed(1)}" y="14" text-anchor="middle" transform="rotate(-90)">altura h (m)</text>`;

    if (a){
      /* La curva se interrumpe donde se sale del recuadro en vez de aplanarse
         contra el borde, que daría una impresión falsa de los datos. */
      let d = '', dentro = false;
      for (let k = 0; k <= 120; k++){
        const t = tMax * k / 120;
        const h = a.f(t);
        if (h < -1e-9 || h > hMax){ dentro = false; continue; }
        d += (dentro ? 'L' : 'M') + px(t).toFixed(1) + ' ' + py(h).toFixed(1) + ' ';
        dentro = true;
      }
      if (d) g += `<path d="${d}" fill="none" stroke="#0C2B52" stroke-width="2.4" stroke-dasharray="7 5"/>`;
    }

    P.forEach(p => {
      g += `<circle cx="${px(p.t).toFixed(1)}" cy="${py(p.h).toFixed(1)}" r="5"
              fill="#C87020" stroke="#1F1C17" stroke-width="1.5"/>
            <title>Tabla ${p.tabla}: t̄ = ${fmt(p.t,3)} s, h = ${fmt(p.h,2)} m</title>`;
    });

    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img"
        aria-label="Gráfica de la altura frente al tiempo promedio con su curva de ajuste">${g}</svg>
      <div class="leyenda">
        <span><i class="punto" style="background:#C87020"></i>parejas experimentales (h, t̄)</span>
        <span><i style="background:#0C2B52"></i>curva de ajuste</span>
      </div>` +
      (P.length ? '' : '<p class="instr__ayuda" style="margin:10px 0 0">Completa las Tablas 1 a 6 para que aparezcan los puntos.</p>');
  }

  /* --------------------------------------------- Resultado del ajuste */
  function pintarResultado(P, a){
    const host = document.getElementById('resultado-ajuste');
    if (!host) return;
    if (P.length < 3){
      host.innerHTML = `<div class="nota nota--aviso"><strong>Faltan parejas.</strong> El ajuste
        necesita al menos <b>tres</b> parejas (h, t̄) completas. Llevas <b>${P.length}</b> de
        ${N_TABLAS}.</div>`;
      return;
    }
    const bueno = a.R2 >= 0.995;
    host.innerHTML = `<div class="formula">
        <div class="formula__ec" style="font-size:1.32rem">${ecuacion(a)}</div>
        <div class="formula__pie">Ajuste por mínimos cuadrados sobre ${P.length} parejas ·
          R² = <b style="color:${bueno ? 'var(--ok)' : 'var(--err)'}">${fmt(a.R2,4)}</b> ·
          con h en metros y t en segundos.</div>
      </div>`;
  }

  /* ------------------------------------------- Pasos de la aceleración */
  function pintarAceleracion(P, a){
    const host = document.getElementById('pasos-aceleracion');
    if (!host) return;
    const k = coefCuadratico(a);
    const hay = a && isFinite(k);

    let paso2, paso3, paso4;
    if (!a){
      paso2 = 'Aún no hay ecuación experimental: completa al menos tres de las Tablas 1 a 6.';
      paso3 = 'Al comparar ambas expresiones, el coeficiente que acompaña a <i>t²</i> debe ser igual a ½·a. Es decir, <b>½·a = k</b>, de donde <b>a = 2k</b>.';
      paso4 = '<div class="formula__ec">a = —</div>';
    } else if (!hay){
      paso2 = `Tu ajuste actual es una <b>recta</b>: ${ecuacion(a)}. Una recta no tiene término en t², así que no permite despejar la aceleración con el modelo h = ½·a·t².`;
      paso3 = 'Vuelve a la página anterior y elige un ajuste cuadrático. Compara además los dos coeficientes de determinación: verás que la recta describe peor los datos.';
      paso4 = '<div class="formula__ec">a = —</div><div class="formula__pie">Requiere un ajuste cuadrático.</div>';
    } else {
      const a2 = 2 * k;
      paso2 = a.tipo === 'kt2'
        ? `Tu ajuste dio <b>h = ${fmt(k,4)} · t²</b>, es decir, el coeficiente experimental de t² vale <b>k = ${fmt(k,4)} m/s²</b>.`
        : `Tu ajuste dio <b>${ecuacion(a)}</b>. El coeficiente que acompaña a t² es <b>A = ${fmt(k,4)} m/s²</b>; los términos en t y el independiente deberían ser pequeños si el balín partió del reposo.`;
      paso3 = `Comparando término a término: &nbsp; ½·a·t² = ${fmt(k,4)}·t² &nbsp;⟹&nbsp; ½·a = ${fmt(k,4)} &nbsp;⟹&nbsp; <b>a = 2 × ${fmt(k,4)}</b>`;
      paso4 = `<div class="formula__ec">a = ${fmt(a2,2)} m/s²</div>
               <div class="formula__pie">Aceleración experimental del balín, obtenida de ${P.length} parejas de datos.</div>`;
    }

    const paso = (i, tit, cuerpo, clave) => `
      <div class="paso${clave ? ' paso--clave' : ''}">
        <div class="paso__n" aria-hidden="true">${i}</div>
        <div class="paso__t">
          <h3 class="sub3" style="margin:0 0 4px">${tit}</h3>
          ${cuerpo}
        </div>
      </div>`;

    host.innerHTML =
      paso(1, 'Modelo teórico de caída libre',
        `<p>Para un cuerpo que parte del reposo con aceleración constante:</p>
         <div class="formula" style="margin:10px 0 2px"><div class="formula__ec">h = ½ · a · t²</div></div>`) +
      paso(2, 'Tu ecuación experimental', `<p>${paso2}</p>`) +
      paso(3, 'Igualamos los coeficientes de t²', `<p>${paso3}</p>`) +
      paso(4, 'Valor experimental de la aceleración',
        `<div class="formula" style="margin:10px 0 2px">${paso4}</div>`, hay);
  }

  /* --------------------------------------------- Comparación con g */
  function pintarComparacion(a){
    const host = document.getElementById('comparacion-host');
    if (!host) return;
    const k = coefCuadratico(a);
    const g = leerNum('g-ref') ?? G_REF;
    const aExp = (a && isFinite(k)) ? 2 * k : null;

    const tarjetas = `
      <div class="vs">
        <div class="vs__caja">
          <div class="vs__et">Aceleración experimental</div>
          <div class="vs__v">${aExp !== null ? fmt(aExp,2) : '—'}</div>
          <div class="vs__u">m/s²</div>
        </div>
        <div class="vs__sep" aria-hidden="true">vs</div>
        <div class="vs__caja vs__caja--ref">
          <div class="vs__et">Valor de referencia</div>
          <div class="vs__v">${g > 0 ? fmt(g,2) : '—'}</div>
          <div class="vs__u">m/s²</div>
        </div>
      </div>`;

    let texto;
    if (aExp === null){
      texto = `<div class="nota"><strong>Falta tu aceleración.</strong> Completa las tablas y
        elige un ajuste cuadrático en la página de la gráfica: en cuanto haya un valor
        experimental, aquí aparecerán la diferencia y el error relativo.</div>`;
    } else if (!(g > 0)){
      texto = `<div class="nota nota--aviso"><strong>Escribe un valor de referencia válido</strong>
        para g, mayor que cero.</div>`;
    } else {
      const dif = aExp - g, err = Math.abs(dif) / g * 100;
      const bien = err <= 5;
      texto = `<div class="nota${bien ? '' : ' nota--aviso'}">
        <strong>Diferencia y error relativo</strong><br>
        a<sub>exp</sub> − g = ${fmt(aExp,2)} − ${fmt(g,2)} = <b>${fmt(dif,2)} m/s²</b><br>
        E<sub>r</sub> = |${fmt(dif,2)}| / ${fmt(g,2)} × 100 % =
        <span class="dato" style="font-size:1.15em;color:${bien ? 'var(--ok)' : 'var(--err)'}">${fmt(err,2)} %</span><br>
        ${bien
          ? 'Tu valor experimental es <b>muy cercano</b> al de referencia: la aceleración del balín es, dentro de la incertidumbre de la práctica, la aceleración de la gravedad.'
          : 'Tu valor se aparta del de referencia. Revisa la verticalidad de la torre, el criterio con que mediste las alturas y la dispersión de los tiempos de una misma tabla.'}
      </div>`;
    }
    host.innerHTML = tarjetas + texto;
  }

  /* ------------------------------------------------------------ Refresco */
  function refrescar(){
    pintarPromedios();
    const P = pares();
    const a = ajuste(P);
    pintarTabla7();
    pintarBarras();
    pintarGrafica(P, a);
    pintarResultado(P, a);
    pintarAceleracion(P, a);
    pintarComparacion(a);

    /* Modelos de las casillas que el estudiante transcribe */
    const poner = (id, v) => { if (CLAVES[id]) CLAVES[id].modelo = v; };
    const k = coefCuadratico(a);
    const g = leerNum('g-ref') ?? G_REF;
    poner('ec-exp', a ? ecuacion(a) : '');
    poner('k-exp',  (a && isFinite(k)) ? fmt(k,4) : '');
    poner('r2-exp', a ? fmt(a.R2,4) : '');
    if (a && isFinite(k)){
      const aExp = 2 * k;
      poner('a-exp',   fmt(aExp,2));
      poner('cmp-a',   fmt(aExp,2));
      poner('cmp-g',   fmt(g,2));
      poner('cmp-dif', fmt(aExp - g,2));
      poner('cmp-err', fmt(Math.abs(aExp - g) / g * 100, 2));
    } else {
      ['a-exp','cmp-a','cmp-dif','cmp-err'].forEach(id => poner(id, ''));
      poner('cmp-g', fmt(g,2));
    }
  }

  return { refrescar, datosTabla, pares, ajuste, ecuacion, coefCuadratico };
})();

/* Estilos de los textos dentro de los SVG */
(function estilosSVG(){
  const s = document.createElement('style');
  s.textContent = `
    .m-lab{ font-family:var(--texto); font-size:12px; fill:#5A5346; }
    .m-et{ font-family:var(--mono); font-size:15px; font-weight:700; fill:#0C2B52; }
    .m-visor{ font-family:var(--mono); font-size:14px; font-weight:700; fill:#8FE3A8; }
    .g-eje{ stroke:#4A4234; stroke-width:1.3; }
    .g-rejilla{ stroke:rgba(120,100,66,.18); stroke-width:1; }
    .g-num{ font-family:var(--mono); font-size:10px; fill:#5A5346; }
    .g-tit{ font-family:var(--texto); font-size:11px; fill:#4A4234; }
  `;
  document.head.appendChild(s);
})();
