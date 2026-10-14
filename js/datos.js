/* ============================================================================
   DATOS.JS — Contenido académico de la práctica
   Universidad Tecnológica de Pereira · Facultad de Ciencias Básicas
   Departamento de Física · Laboratorio de Física I
   Práctica 4 · Caída libre
   ========================================================================== */

const META = {
  universidad:  "Universidad Tecnológica de Pereira",
  facultad:     "Facultad de Ciencias Básicas",
  departamento: "Departamento de Física",
  asignatura:   "Laboratorio de Física I",
  practica:     "Práctica 4",
  titulo:       "Caída libre"
};

/* ------------------------------------------------------- Constantes físicas */
const G_REF      = 9.80;    // valor de referencia del curso, en m/s²
const G_PEREIRA  = 9.776;   // valor local estimado para Pereira (4,8° N, 1411 m)
const N_TABLAS   = 6;       // seis alturas, seis tablas

/* --------------------------------------------------------------------------
   CONJUNTO DE DATOS DE REFERENCIA

   El estudiante elige sus propias alturas, de modo que las casillas de las
   Tablas 1 a 6 no tienen una «respuesta correcta»: son datos suyos. Lo que sí
   tiene el cuaderno es un conjunto de datos de referencia, coherente y
   reproducible, que carga el botón «Autocompletar». Se construye a partir de
   seis alturas razonables y del tiempo teórico de caída, al que se aplica una
   desviación fija de alrededor del 1 % para imitar la dispersión real de tres
   mediciones sucesivas. Las desviaciones están escritas una a una, y no se
   sortean al azar, para que el cuaderno entregue siempre el mismo ejemplo:
   así el docente puede proyectarlo en clase y obtener exactamente los mismos
   números que el estudiante.
   -------------------------------------------------------------------------- */
const ALTURAS_MODELO = [0.30, 0.60, 0.90, 1.20, 1.50, 1.80];

const DESVIACIONES = [
  [1.012, 0.994, 1.003],
  [0.991, 1.008, 1.000],
  [1.006, 0.997, 1.011],
  [0.995, 1.004, 0.992],
  [1.009, 0.998, 1.001],
  [0.996, 1.007, 0.999]
];

/* Tiempo teórico de caída desde la altura h, partiendo del reposo */
const tCaida = h => Math.sqrt(2 * h / G_REF);

/* Tiempo de referencia de la medición j de la tabla i (en segundos) */
function tModelo(i, j){
  return tCaida(ALTURAS_MODELO[i]) * DESVIACIONES[i][j];
}

/* Formato español: coma decimal */
function f2(x){ return Number(x).toFixed(2).replace('.', ','); }
function f3(x){ return Number(x).toFixed(3).replace('.', ','); }
function f4(x){ return Number(x).toFixed(4).replace('.', ','); }

/* ------------------------------------------------------- Índice de secciones */
const SECCIONES = [
  { t: "Portada",                         d: "Identificación del cuaderno" },
  { t: "Índice",                          d: "Navegación por secciones" },
  { t: "Presentación de la práctica",     d: "Qué se mide y para qué" },
  { t: "Objetivos",                       d: "Metas de la sesión" },
  { t: "Materiales e instrumentos",       d: "Los tres elementos del montaje" },
  { t: "Fundamento físico",               d: "Caída libre y movimiento uniformemente acelerado" },
  { t: "Montaje experimental",            d: "Esquema interactivo del equipo" },
  { t: "Procedimiento",                   d: "Los cinco pasos de la toma de datos" },
  { t: "Encabezado del informe",          d: "Resumen, nota y grupo de trabajo" },
  { t: "Marco teórico",                   d: "Redacción propia del grupo" },
  { t: "Preinforme · Predicciones",       d: "Cinco cálculos previos" },
  { t: "Tabla 1 · Primera altura",        d: "Altura y tres tiempos de caída" },
  { t: "Tabla 2 · Segunda altura",        d: "Altura y tres tiempos de caída" },
  { t: "Tabla 3 · Tercera altura",        d: "Altura y tres tiempos de caída" },
  { t: "Tabla 4 · Cuarta altura",         d: "Altura y tres tiempos de caída" },
  { t: "Tabla 5 · Quinta altura",         d: "Altura y tres tiempos de caída" },
  { t: "Tabla 6 · Sexta altura",          d: "Altura y tres tiempos de caída" },
  { t: "Tabla 7 · Resumen experimental",  d: "Promedios y lectura de los datos" },
  { t: "Gráfica y ecuación experimental", d: "Ajuste de h frente a t̄" },
  { t: "Determinación de la aceleración", d: "Del coeficiente de t² al valor de a" },
  { t: "Comparación con la gravedad",     d: "Diferencia y error relativo" },
  { t: "Simulador de caída libre",        d: "El balín cayendo en cámara lenta" },
  { t: "Preguntas",                       d: "Tres preguntas para justificar" },
  { t: "Conclusiones",                    d: "Tres cierres propios" },
  { t: "Glosario",                        d: "Términos clave de la práctica" },
  { t: "Referencias",                     d: "Fuentes consultadas" }
];

/* La página de las tablas empieza en este índice */
const PAG_TABLA_1 = 11;

/* ----------------------------------------- Materiales e instrumentos */
const MATERIALES = [
  { n:"Cronómetro UTP", f:"Unidad de control que mide el tiempo transcurrido entre la liberación del balín y su impacto en la base. Es el instrumento que entrega el dato de tiempo y, por tanto, el que más influye en la incertidumbre del resultado." },
  { n:"Cinta métrica con sensor acústico", f:"Permite fijar y leer la altura h desde la que se libera el balín, medida entre el punto de liberación y el sensor de impacto. Debe leerse siempre entre los mismos dos puntos." },
  { n:"Balín", f:"Esfera metálica, pequeña y densa. Es el cuerpo cuyo movimiento se estudia. Su densidad alta hace que la resistencia del aire sea despreciable en las alturas de la práctica." },
  { n:"Mecanismo de liberación", f:"Electroimán que sostiene el balín y lo suelta al cortarse la corriente. Garantiza que el balín parte del reposo y que la liberación coincide con el arranque del cronómetro." },
  { n:"Torre o soporte vertical", f:"Columna graduada sobre la que se desplaza el mecanismo de liberación. Debe quedar perfectamente vertical para que la trayectoria del balín sea de caída libre pura." },
  { n:"Sensor de impacto", f:"Plataforma situada en la base que detiene el cronómetro en el instante en que el balín la golpea. Marca el final de la caída." }
];

/* ------------------------------------------------- Procedimiento (guía) */
const PASOS = [
  { t:"Ubica el sensor y registra la altura",
    d:"Coloca el mecanismo de liberación a la altura que desees sobre la torre y mide con la cinta métrica la distancia hasta el sensor de impacto. <b>Registra ese valor</b> en la casilla <i>h</i> de la <b>Tabla 1</b>.", clave:true },
  { t:"Coloca el balín y libéralo",
    d:"Pon el balín en el <b>electroimán</b> del mecanismo de liberación y acciona el disparador. El balín debe quedar inmóvil antes de soltarse: si oscila, el movimiento ya no parte del reposo." },
  { t:"Mide el tiempo de caída tres veces",
    d:"Repite la liberación <b>tres veces</b> desde la misma altura y anota los tres tiempos en la Tabla 1. Son tres medidas de la misma magnitud, no tres experimentos distintos.", clave:true },
  { t:"Calcula el tiempo promedio",
    d:"Con los tres tiempos obtén el promedio t̄ = (t₁ + t₂ + t₃)/3. Ese promedio es el valor que representa a esa altura y el que se llevará a la gráfica.", clave:true },
  { t:"Repite para cinco alturas más",
    d:"Repite todo el procedimiento para <b>cinco alturas distintas</b> y completa las <b>Tablas 2, 3, 4, 5 y 6</b>. Elige las alturas de forma que los tiempos de caída resulten claramente diferentes entre sí.", clave:true }
];

/* ---------------------------- Partes del montaje (esquema interactivo) */
const PARTES = [
  { id:"tor", n:"Torre o soporte vertical",
    d:"Columna graduada que sostiene todo el montaje y sobre la que se desliza el mecanismo de liberación. Su verticalidad es crítica: si está inclinada, el balín no cae libremente sino sobre un plano, y el tiempo medido resulta mayor del que corresponde a la altura leída." },
  { id:"lib", n:"Mecanismo de liberación (electroimán)",
    d:"Sostiene el balín por atracción magnética y lo suelta al cortarse la corriente. Ese mismo corte arranca el cronómetro, de modo que el instante inicial del movimiento y el inicio de la medida coinciden. Es lo que garantiza que la velocidad inicial sea cero." },
  { id:"bal", n:"Balín",
    d:"El cuerpo en estudio. Es una esfera metálica pequeña y densa: su peso es muy superior al rozamiento con el aire, de manera que durante los pocos decímetros de caída la única fuerza apreciable es la gravedad. Por eso el movimiento puede tratarse como caída libre." },
  { id:"alt", n:"Altura h (distancia de caída)",
    d:"Distancia vertical entre el punto de liberación y el sensor de impacto. Es una de las dos magnitudes que se miden directamente. Debe leerse siempre entre los mismos dos puntos de referencia: cambiar el criterio de un ensayo a otro introduce un error sistemático difícil de detectar." },
  { id:"tra", n:"Trayectoria vertical de caída",
    d:"El balín recorre una línea recta vertical. En intervalos iguales de tiempo recorre distancias cada vez mayores, precisamente porque la velocidad aumenta de forma uniforme. Esa separación creciente es la firma visual de un movimiento acelerado." },
  { id:"sen", n:"Sensor de impacto",
    d:"Plataforma situada en la base que detecta el golpe del balín y detiene el cronómetro. Define el final del recorrido y, por tanto, el punto respecto al cual debe medirse la altura." },
  { id:"cro", n:"Cronómetro UTP (unidad de control)",
    d:"Mide el intervalo entre la liberación y el impacto. Su resolución, de milésimas de segundo, es la que fija el número de cifras significativas con que tiene sentido escribir los tiempos. Es también la fuente principal de dispersión entre las tres medidas de una misma altura." },
  { id:"gra", n:"Aceleración de la gravedad g",
    d:"Vector dirigido verticalmente hacia abajo, de magnitud aproximadamente constante cerca de la superficie terrestre. Es la causa del movimiento y lo que la práctica pretende medir: si el experimento está bien hecho, la aceleración obtenida del ajuste debe coincidir con ella." }
];

/* ----------------------------------------------- Resumen y marco teórico */
const RESUMEN_MODELO =
  "En esta práctica se estudió experimentalmente el movimiento de un balín en caída libre y se " +
  "determinó el valor de su aceleración. Utilizando una torre vertical con mecanismo de liberación " +
  "electromagnético, cinta métrica y el cronómetro del laboratorio, se midió el tiempo de caída del " +
  "balín desde seis alturas distintas, comprendidas entre 0,30 m y 1,80 m, repitiendo tres veces la " +
  "medida en cada altura y tomando el promedio de los tres valores. Al representar la altura frente " +
  "al tiempo promedio se obtuvo una curva que no es una recta sino una parábola, lo que indica que " +
  "la distancia recorrida crece con el cuadrado del tiempo. El ajuste de los datos al modelo " +
  "h = k·t² entregó un coeficiente k del que, por comparación con la expresión teórica h = ½·a·t², " +
  "se dedujo la aceleración experimental del balín. El valor obtenido resultó muy próximo al de la " +
  "aceleración de la gravedad usada como referencia, con un error relativo inferior al uno por " +
  "ciento, lo que confirma que el balín describe un movimiento uniformemente acelerado y que la " +
  "aceleración que lo produce es la de la gravedad.";

const MARCO_MODELO =
  "Se llama caída libre al movimiento de un cuerpo sobre el que actúa únicamente su peso, es decir, " +
  "la fuerza de atracción gravitatoria de la Tierra. En rigor ningún movimiento real cumple esa " +
  "condición, porque siempre existe el aire; pero cuando el cuerpo es pequeño, denso y recorre una " +
  "distancia corta, la resistencia del aire resulta despreciable frente al peso y el movimiento " +
  "puede tratarse como caída libre sin error apreciable. Es exactamente el caso del balín metálico " +
  "de esta práctica.\n\n" +
  "Puesto que la fuerza que actúa es constante, también lo es la aceleración, y el movimiento es " +
  "uniformemente acelerado. Esto significa que la velocidad no se mantiene fija, sino que aumenta " +
  "la misma cantidad en cada segundo que pasa. La aceleración correspondiente se denota con la " +
  "letra g y su valor cerca de la superficie terrestre ronda los 9,8 m/s², dirigida siempre hacia " +
  "el centro de la Tierra.\n\n" +
  "Para un cuerpo que parte del reposo y cae una distancia h en un tiempo t con aceleración " +
  "constante a, la cinemática del movimiento rectilíneo uniformemente acelerado conduce a la " +
  "relación h = ½·a·t². La consecuencia más importante de esta expresión es que la altura no crece " +
  "en proporción al tiempo, sino al cuadrado del tiempo: si el tiempo de caída se duplica, la " +
  "distancia recorrida se multiplica por cuatro, y si se triplica, por nueve. Representada en unos " +
  "ejes h frente a t, la relación no es una recta sino una parábola que pasa por el origen.\n\n" +
  "Esa forma funcional es la que permite invertir el problema y medir la aceleración. Si se toman " +
  "parejas experimentales de altura y tiempo y se ajustan al modelo h = k·t², el coeficiente k que " +
  "resulta del ajuste debe coincidir con ½·a. De ahí se despeja directamente a = 2k. El " +
  "experimento no mide la aceleración de forma directa, puesto que no existe un instrumento que la " +
  "lea: la obtiene del comportamiento global de un conjunto de medidas de longitud y de tiempo, " +
  "que sí son magnitudes directamente medibles.\n\n" +
  "Repetir tres veces la medida del tiempo para cada altura no es una formalidad. El tiempo es la " +
  "magnitud más delicada de esta práctica, porque los intervalos son de apenas unas décimas de " +
  "segundo y cualquier retardo del mecanismo de liberación o del sensor se nota. Al promediar tres " +
  "lecturas se reduce el efecto de los errores aleatorios, que unas veces aumentan y otras " +
  "disminuyen el valor leído. Los errores sistemáticos, en cambio, no se corrigen promediando: si " +
  "la altura se mide siempre desde un punto equivocado, las seis parejas quedan desplazadas en el " +
  "mismo sentido y el ajuste devuelve una aceleración sesgada.\n\n" +
  "Conviene recordar, por último, que el valor de g no es universal. Depende de la latitud, porque " +
  "la Tierra no es exactamente esférica y porque rota, y disminuye con la altitud al aumentar la " +
  "distancia al centro del planeta. En Pereira, a unos 4,8° de latitud norte y 1411 m sobre el " +
  "nivel del mar, el valor local estimado es de unos 9,776 m/s², ligeramente inferior al valor " +
  "convencional de 9,80 m/s² que suele emplearse en los cursos.";

/* ---------------------------------------------------------- Preguntas */
const PREGUNTAS = [
  { id:"q1",
    texto:"De acuerdo con la gráfica obtenida, ¿qué tipo de función relaciona la altura con el tiempo?",
    guia:"Fíjate en si los puntos se alinean o se curvan, y en qué le pasa a la altura cuando el tiempo se duplica.",
    modelo:"La relación entre la altura y el tiempo es una función cuadrática. Los puntos experimentales no se alinean sobre una recta sino que se curvan hacia arriba, describiendo una rama de parábola que pasa por el origen. Esto se aprecia también sin necesidad de graficar, comparando directamente las parejas de datos: entre la primera y la cuarta altura el tiempo pasa de unos 0,25 s a unos 0,49 s, es decir, se duplica aproximadamente; pero la altura no pasa de 0,30 m a 0,60 m, sino a 1,20 m, o sea que se multiplica por cuatro. Ese comportamiento —el tiempo al doble, la distancia al cuádruple— es la firma de una dependencia en t², y coincide con lo que predice el modelo teórico h = ½·a·t² para un cuerpo que parte del reposo. El ajuste de los datos lo confirma numéricamente: el modelo h = k·t² reproduce las seis parejas con un coeficiente de determinación prácticamente igual a la unidad, mientras que un ajuste en línea recta deja los puntos sistemáticamente por encima y por debajo de la recta." },
  { id:"q2",
    texto:"¿El valor obtenido para la aceleración se parece a alguna constante conocida? En caso afirmativo, ¿a cuál constante se parece?",
    guia:"Compara el número que obtuviste con las constantes que conoces del curso y mira sus unidades.",
    modelo:"Sí. El valor experimental obtenido para la aceleración del balín, cercano a 9,8 m/s², coincide con la aceleración de la gravedad g en las proximidades de la superficie terrestre. La coincidencia no es casual ni numérica: el balín cae sometido únicamente a su propio peso, y según la segunda ley de Newton la aceleración que adquiere un cuerpo bajo la acción de su peso es precisamente g, con independencia de su masa. Por eso la aceleración medida no depende de qué balín se use, siempre que la resistencia del aire siga siendo despreciable. Conviene además señalar que g no es una constante universal como lo es la velocidad de la luz: varía con la latitud y con la altitud. En Pereira, a 4,8° de latitud norte y 1411 m de altitud, el valor local estimado es de unos 9,776 m/s², algo menor que el valor convencional de 9,80 m/s². La diferencia, de algunas milésimas, queda por debajo de la incertidumbre de esta práctica, de modo que el experimento no permite distinguir entre ambos valores." },
  { id:"q3",
    texto:"De acuerdo con los datos obtenidos, ¿qué tipo de movimiento describe el balín?",
    guia:"Piensa en qué magnitud se mantiene constante durante la caída: ¿la velocidad o su variación?",
    modelo:"El balín describe un movimiento rectilíneo uniformemente acelerado. Es rectilíneo porque la trayectoria es una línea vertical, y es uniformemente acelerado porque la aceleración se mantiene constante durante toda la caída. Lo que permanece fijo no es la velocidad, que aumenta continuamente, sino su ritmo de cambio: el balín gana aproximadamente 9,8 m/s de rapidez por cada segundo que cae. La prueba experimental de esa constancia está en la propia forma de los datos: si la aceleración variara durante la caída, la relación entre altura y tiempo no sería exactamente cuadrática y el ajuste h = k·t² no reproduciría las seis parejas con la fidelidad que lo hace. Dicho de otro modo, el hecho de que un único coeficiente k sirva para las seis alturas, desde 0,30 m hasta 1,80 m, demuestra que la aceleración es la misma en todas ellas. Un movimiento uniforme queda descartado de entrada: en él las distancias recorridas en intervalos iguales serían iguales, y aquí crecen." }
];

/* -------------------------------------------------------- Conclusiones */
const CONCLUSIONES = [
  { id:"c1",
    guia:"Sobre la relación altura–tiempo: qué forma tienen los datos y qué modelo los describe.",
    modelo:"Las seis parejas de altura y tiempo promedio obtenidas en el laboratorio muestran que la distancia recorrida por el balín no crece en proporción al tiempo de caída, sino al cuadrado del tiempo. La representación gráfica de h frente a t̄ da una curva de tipo parabólico que pasa por el origen, y el ajuste al modelo h = k·t² reproduce los datos con un coeficiente de determinación muy próximo a la unidad. Esto confirma experimentalmente la expresión cinemática h = ½·a·t² para un cuerpo que parte del reposo con aceleración constante, y descarta tanto el movimiento uniforme como cualquier relación lineal entre las dos magnitudes." },
  { id:"c2",
    guia:"Sobre la aceleración obtenida: qué valor salió y qué tan cerca quedó del de referencia.",
    modelo:"A partir del coeficiente del término cuadrático del ajuste se determinó la aceleración experimental del balín mediante a = 2k, sin necesidad de medir directamente ninguna velocidad. El valor obtenido resultó muy próximo al de la aceleración de la gravedad tomada como referencia, con un error relativo inferior al uno por ciento. La conclusión física es que la aceleración del balín en caída es la aceleración de la gravedad, y que el método de obtenerla a partir del ajuste de un conjunto de medidas de longitud y tiempo es fiable. El procedimiento ilustra además una idea general del trabajo experimental: una magnitud que no puede leerse en ningún instrumento se obtiene del comportamiento global de magnitudes que sí pueden medirse." },
  { id:"c3",
    guia:"Sobre las fuentes de error: qué explica la diferencia que quedó y cómo podría reducirse.",
    modelo:"La pequeña diferencia entre el valor experimental y el de referencia se explica por las limitaciones propias del montaje y no por un fallo del modelo. Las fuentes más probables son la resolución del cronómetro frente a tiempos de caída de apenas unas décimas de segundo, los retardos del mecanismo de liberación y del sensor de impacto, la precisión con que se lee la altura y la posible falta de verticalidad de la torre. De todas ellas, la medida del tiempo es la más delicada, porque interviene elevada al cuadrado y por tanto cualquier error relativo en t se traduce en un error relativo doble en la aceleración. Promediar tres medidas por altura reduce los errores aleatorios, pero no los sistemáticos: para reducirlos habría que trabajar con alturas mayores, que alargan el tiempo de caída y disminuyen el peso relativo de los retardos del equipo." }
];

/* ------------------------------------------------------------- Glosario */
const GLOSARIO = [
  { t:"Caída libre", d:"Movimiento de un cuerpo sobre el que actúa únicamente la gravedad. En la práctica se acepta esa descripción cuando la resistencia del aire es despreciable frente al peso.", f:"" },
  { t:"Gravedad (g)", d:"Aceleración que la Tierra imprime a los cuerpos cercanos a su superficie, dirigida hacia abajo. Vale unos 9,8 m/s², con variaciones según la latitud y la altitud.", f:"" },
  { t:"Aceleración", d:"Rapidez con la que cambia la velocidad de un cuerpo. Se mide en metros por segundo cada segundo (m/s²).", f:"" },
  { t:"Velocidad", d:"Rapidez y dirección con la que un cuerpo cambia de posición. En caída libre crece de forma uniforme con el tiempo: v = g·t si se parte del reposo.", f:"" },
  { t:"Altura (h)", d:"Distancia vertical entre el punto de liberación del balín y el sensor de impacto. Es una de las dos magnitudes medidas directamente en la práctica.", f:"" },
  { t:"Tiempo de caída (t)", d:"Intervalo transcurrido entre la liberación del balín y su llegada al sensor, medido con el cronómetro del laboratorio.", f:"" },
  { t:"Reposo", d:"Estado de velocidad nula. Que el balín parta del reposo es lo que permite usar la expresión h = ½·a·t² sin término adicional en t.", f:"" },
  { t:"Movimiento uniformemente acelerado", d:"Movimiento con aceleración constante: la velocidad varía la misma cantidad en cada intervalo igual de tiempo. La posición depende del cuadrado del tiempo.", f:"" },
  { t:"Tiempo promedio (t̄)", d:"Media aritmética de las tres mediciones de tiempo de una misma altura: t̄ = (t₁+t₂+t₃)/3. Reduce el efecto de los errores aleatorios.", f:"" },
  { t:"Error aleatorio", d:"Dispersión impredecible entre medidas repetidas de la misma magnitud. Unas veces aumenta el valor y otras lo disminuye, de modo que promediar lo atenúa.", f:"" },
  { t:"Error sistemático", d:"Desviación que afecta siempre en el mismo sentido a todas las medidas. No se corrige promediando: hay que identificar su causa y eliminarla.", f:"" },
  { t:"Dato experimental", d:"Valor obtenido directamente de una medición realizada en el laboratorio, no de un cálculo ni de una tabla.", f:"" },
  { t:"Ajuste por mínimos cuadrados", d:"Procedimiento que busca la función de una familia dada que pasa lo más cerca posible de un conjunto de puntos, haciendo mínima la suma de los cuadrados de las separaciones.", f:"" },
  { t:"Función cuadrática", d:"Función de la forma y = A·x² + B·x + C. Su gráfica es una parábola. En esta práctica la altura resulta ser una función cuadrática del tiempo.", f:"" },
  { t:"Coeficiente de determinación (R²)", d:"Número entre 0 y 1 que indica qué fracción de la variación de los datos explica la curva ajustada. Cuanto más próximo a 1, mejor describe el modelo a los datos.", f:"" },
  { t:"Error relativo", d:"Diferencia entre el valor experimental y el de referencia, dividida por el de referencia y expresada en porcentaje. Permite comparar discrepancias de magnitudes muy distintas.", f:"" },
  { t:"Resolución", d:"Menor variación de la magnitud medida que produce un cambio perceptible en la indicación del instrumento. El cronómetro de la práctica resuelve milésimas de segundo.", f:"VIM 4.14" },
  { t:"Incertidumbre de medida", d:"Parámetro que caracteriza la dispersión de los valores que razonablemente pueden atribuirse a la magnitud medida.", f:"VIM 2.26" }
];

/* ----------------------------------------------------------- Referencias */
const REFERENCIAS = [
  "Serway, R. A., & Jewett, J. W. (2019). <i>Física para ciencias e ingeniería con física moderna</i> (10.ª ed., Vol. 1). Cengage Learning. Capítulo 2: Movimiento en una dimensión — caída libre.",
  "Young, H. D., & Freedman, R. A. (2018). <i>Sears y Zemansky. Física universitaria con física moderna</i> (14.ª ed., Vol. 1). Pearson. Capítulo 2: Movimiento rectilíneo con aceleración constante.",
  "Taylor, J. R. (2014). <i>Introducción al análisis de errores. El estudio de las incertidumbres en las mediciones físicas</i> (2.ª ed.). Reverté.",
  "Bureau International des Poids et Mesures. (2012). <i>Vocabulario Internacional de Metrología (VIM)</i> (3.ª ed.). JCGM 200:2012.",
  "Moritz, H. (2000). Geodetic Reference System 1980. <i>Journal of Geodesy, 74</i>(1), 128–133. (Fórmula de la gravedad normal empleada para estimar el valor local.)",
  "Departamento de Física, Universidad Tecnológica de Pereira. <i>Guía de laboratorio: caída libre</i>. Laboratorio de Física I, Facultad de Ciencias Básicas."
];
