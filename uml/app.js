(function () {
  'use strict';

  // Margen para que el valor codificado con encodeURIComponent no supere el límite del navegador.
  const COOKIE_MAX = 2400;
  const COOKIE_DAYS = 365;
  const STORAGE_VERSION = 1;
  const XP_PER_CORRECT = 10;
  const XP_PER_LEVEL = 100;
  const RECENT_IDS_SIZE = 5;
  const RECENCY_DIV_MIN = 360;
  const COOKIE_PREFIX = 'uml_quiz_stats_';
  const FALLBACK_KEY = 'uml_quiz_fallback_v1';

  const QUESTION_BANK = [
    {
      id: 'S01', type: 'single',
      prompt: '¿Qué significa la sigla UML?',
      options: ['Universal Machine Language', 'Lenguaje Unificado de Modelado', 'Modelo Lógico de Usuario', 'Lenguaje Universal de Métodos'],
      answer: [1],
      explanation: 'UML viene de Unified Modeling Language: Lenguaje Unificado de Modelado.'
    },
    {
      id: 'S02', type: 'single',
      prompt: '¿Cuál es la mejor definición de UML?',
      options: ['Un lenguaje gráfico de modelado', 'Un lenguaje de programación orientado a objetos', 'Una base de datos para documentar requisitos', 'Una metodología completa de desarrollo'],
      answer: [0],
      explanation: 'UML es un lenguaje gráfico que ayuda a representar y documentar sistemas.'
    },
    {
      id: 'S03', type: 'single',
      prompt: '¿Cuál de estas afirmaciones sobre UML es correcta?',
      options: ['Es una metodología ágil', 'Solo se usa después de programar', 'No es un lenguaje de programación ni una metodología de desarrollo', 'Reemplaza el código fuente'],
      answer: [2],
      explanation: 'UML es un lenguaje de modelado; no programa el sistema ni prescribe por sí solo una metodología.'
    },
    {
      id: 'S04', type: 'single',
      prompt: '¿Para qué se usan los diagramas UML antes de programar?',
      options: ['Para representar cómo será o cómo funciona el sistema y facilitar su análisis y diseño', 'Para compilar el proyecto', 'Para guardar los datos de producción', 'Para medir la velocidad de la red'],
      answer: [0],
      explanation: 'Los diagramas permiten pensar, comunicar y revisar el sistema antes de construirlo.'
    },
    {
      id: 'S05', type: 'single',
      prompt: '¿Qué ventaja de comunicación aporta UML?',
      options: ['Elimina la necesidad de hablar con el cliente', 'Da a clientes, analistas y desarrolladores una representación común del sistema', 'Permite que solo el programador entienda el diseño', 'Evita documentar decisiones'],
      answer: [1],
      explanation: 'Una representación común reduce errores de comunicación entre los participantes.'
    },
    {
      id: 'S06', type: 'single',
      prompt: 'En la especificación de requerimientos, UML ayuda principalmente a…',
      options: ['recopilar qué necesita el sistema', 'determinar cómo se instalará el sistema', 'elegir el lenguaje de programación', 'crear copias de seguridad'],
      answer: [0],
      explanation: 'La especificación de requerimientos se concentra en las necesidades que debe cubrir el sistema.'
    },
    {
      id: 'S07', type: 'single',
      prompt: 'Durante el análisis se busca determinar…',
      options: ['qué debe hacer el sistema', 'qué color tendrá la interfaz', 'cómo se comprarán los servidores', 'quién compilará el código'],
      answer: [0],
      explanation: 'El análisis determina qué debe hacer el sistema.'
    },
    {
      id: 'S08', type: 'single',
      prompt: 'Durante el diseño se busca determinar…',
      options: ['qué necesita el usuario, sin pensar soluciones', 'cómo se realizará el sistema', 'cuánto espacio físico ocupará la oficina', 'qué datos se borrarán'],
      answer: [1],
      explanation: 'El diseño pasa del qué al cómo: define cómo se realizará la solución.'
    },
    {
      id: 'S09', type: 'single',
      prompt: '¿Qué representa UML durante el despliegue o implementación?',
      options: ['Cómo se instalarán y ejecutarán los componentes', 'Solo los requisitos del cliente', 'El salario del equipo', 'La sintaxis del lenguaje de programación'],
      answer: [0],
      explanation: 'En despliegue interesa dónde y cómo se ejecutan los componentes del sistema.'
    },
    {
      id: 'S10', type: 'single',
      prompt: 'Los diagramas estructurales representan principalmente…',
      options: ['el aspecto estático y cómo está formado el sistema', 'el orden temporal de los mensajes', 'los cambios de estado a través del tiempo', 'únicamente las acciones del usuario'],
      answer: [0],
      explanation: 'Estructural equivale a estático: elementos, organización y relaciones.'
    },
    {
      id: 'S11', type: 'single',
      prompt: 'Los diagramas de comportamiento representan principalmente…',
      options: ['el aspecto dinámico: qué hace el sistema y cómo se comporta', 'solo los dispositivos físicos', 'la estructura de las clases sin cambios', 'los archivos instalados en un servidor'],
      answer: [0],
      explanation: 'Comportamiento equivale a dinámico: funciones, interacciones, actividades y cambios.'
    },
    {
      id: 'S12', type: 'single',
      prompt: '¿Qué muestra un diagrama de clases?',
      options: ['Clases, atributos, métodos y relaciones', 'Objetos concretos en un instante', 'Equipos físicos de la red', 'El orden temporal de los mensajes'],
      answer: [0],
      explanation: 'El diagrama de clases describe la estructura estática basada en clases y sus relaciones.'
    },
    {
      id: 'S13', type: 'single',
      prompt: '¿Qué muestra un diagrama de objetos?',
      options: ['Instancias concretas de clases y las relaciones entre ellas', 'Únicamente clases abstractas', 'Los servidores donde corre el sistema', 'Las etapas de un proceso'],
      answer: [0],
      explanation: 'Si Persona es una clase, una persona determinada es un objeto o instancia.'
    },
    {
      id: 'S14', type: 'single',
      prompt: '¿Qué representa un diagrama de componentes?',
      options: ['Los componentes de software de una aplicación y sus relaciones', 'Los roles de los usuarios', 'Los estados de un objeto', 'Los atributos privados de una clase'],
      answer: [0],
      explanation: 'Este diagrama se concentra en las piezas de software que forman la aplicación.'
    },
    {
      id: 'S15', type: 'single',
      prompt: 'Servidor, computadora cliente y base de datos son elementos típicos de un diagrama de…',
      options: ['despliegue', 'actividades', 'casos de uso', 'objetos'],
      answer: [0],
      explanation: 'El diagrama de despliegue ubica componentes sobre equipos o dispositivos físicos.'
    },
    {
      id: 'S16', type: 'single',
      prompt: '¿Qué representa un diagrama de casos de uso?',
      options: ['Las funciones del sistema desde el punto de vista de usuarios y actores', 'La memoria ocupada por cada componente', 'Los objetos concretos creados en ejecución', 'La herencia entre clases'],
      answer: [0],
      explanation: 'Los casos de uso expresan funcionalidades relevantes para actores externos.'
    },
    {
      id: 'S17', type: 'single',
      prompt: '¿Qué distingue a un diagrama de secuencia?',
      options: ['Muestra interacciones entre objetos considerando su orden temporal', 'Muestra únicamente dispositivos físicos', 'Muestra una relación todo-parte', 'Muestra los atributos de una clase'],
      answer: [0],
      explanation: 'En secuencia importa especialmente cuándo ocurre cada interacción.'
    },
    {
      id: 'S18', type: 'single',
      prompt: 'El diagrama que muestra interacciones entre objetos desde un punto de vista más espacial es el de…',
      options: ['colaboración', 'despliegue', 'clases', 'estados'],
      answer: [0],
      explanation: 'Colaboración enfatiza objetos, enlaces y comunicaciones desde una vista espacial.'
    },
    {
      id: 'S19', type: 'single',
      prompt: '¿Qué representa un diagrama de estados?',
      options: ['Los estados de un objeto y las transiciones entre ellos', 'Los paquetes instalados', 'Los roles externos del sistema', 'Las clases y sus atributos'],
      answer: [0],
      explanation: 'Modela los posibles estados de un objeto y cómo pasa de uno a otro.'
    },
    {
      id: 'S20', type: 'single',
      prompt: '¿Qué representa un diagrama de actividades?',
      options: ['Un flujo de actividades o acciones de un proceso', 'La ubicación física de los servidores', 'La multiplicidad entre clases', 'Objetos concretos y sus valores'],
      answer: [0],
      explanation: 'El diagrama de actividades permite seguir cómo se desarrolla un proceso.'
    },
    {
      id: 'S21', type: 'single',
      prompt: 'En un diagrama de casos de uso, un actor representa…',
      options: ['Algo externo al sistema que interactúa con él', 'Una clase interna obligatoria', 'Una tabla de la base de datos', 'Una línea de código'],
      answer: [0],
      explanation: 'Un actor puede ser una persona, un rol, otro sistema u otra aplicación.'
    },
    {
      id: 'S22', type: 'single',
      prompt: '¿Por qué un actor no representa necesariamente a una persona específica?',
      options: ['Porque normalmente representa un rol o perfil que pueden asumir distintas personas', 'Porque siempre representa hardware', 'Porque solo puede ser una aplicación', 'Porque UML no modela usuarios'],
      answer: [0],
      explanation: 'Varias personas pueden actuar, por ejemplo, con el rol Administrador.'
    },
    {
      id: 'S23', type: 'single',
      prompt: '¿Cómo se representa normalmente un caso de uso?',
      options: ['Con una elipse que contiene el nombre de la función', 'Con un rombo lleno', 'Con un rectángulo de tres compartimentos', 'Con una línea discontinua sin texto'],
      answer: [0],
      explanation: 'El caso de uso se dibuja como una elipse y nombra una funcionalidad.'
    },
    {
      id: 'S24', type: 'single',
      prompt: 'La línea continua entre un actor y un caso de uso representa una…',
      options: ['asociación', 'composición', 'extensión', 'agregación'],
      answer: [0],
      explanation: 'La asociación indica que el actor participa o interactúa con esa funcionalidad.'
    },
    {
      id: 'S25', type: 'single',
      prompt: '¿Qué significa la relación <<include>>?',
      options: ['El caso principal incluye obligatoriamente a otro', 'El comportamiento adicional es opcional', 'Un actor hereda de una clase', 'Dos objetos se ejecutan en el mismo servidor'],
      answer: [0],
      explanation: 'Include = siempre u obligatorio.'
    },
    {
      id: 'S26', type: 'single',
      prompt: '¿Qué significa la relación <<extend>>?',
      options: ['Agrega un comportamiento opcional o condicionado', 'Incluye siempre otro caso de uso', 'Elimina un actor del sistema', 'Crea una clase hija'],
      answer: [0],
      explanation: 'Extend = puede ocurrir, según una condición o situación particular.'
    },
    {
      id: 'S27', type: 'single',
      prompt: 'En casos de uso, la generalización permite que un actor o caso de uso…',
      options: ['herede el comportamiento de otro', 'se ejecute antes que otro', 'se transforme en un atributo', 'se instale en un dispositivo'],
      answer: [0],
      explanation: 'La generalización expresa herencia y es especialmente común entre actores.'
    },
    {
      id: 'S28', type: 'single',
      prompt: '¿Cuáles son las tres partes habituales del rectángulo de una clase?',
      options: ['Nombre, atributos y métodos', 'Actor, caso de uso y relación', 'Estado, transición y evento', 'Servidor, cliente y base de datos'],
      answer: [0],
      explanation: 'Una clase suele dibujarse con nombre arriba, atributos en el centro y métodos abajo.'
    },
    {
      id: 'S29', type: 'single',
      prompt: 'En una clase, los atributos representan…',
      options: ['propiedades o características', 'mensajes ordenados en el tiempo', 'equipos físicos', 'usuarios externos'],
      answer: [0],
      explanation: 'Patente, marca, modelo y año son ejemplos de atributos de Vehículo.'
    },
    {
      id: 'S30', type: 'single',
      prompt: 'En una clase, los métodos representan…',
      options: ['operaciones o servicios que puede realizar', 'valores fijos de la interfaz', 'actores del sistema', 'dispositivos de despliegue'],
      answer: [0],
      explanation: 'Un método puede incluir visibilidad, nombre, parámetros y tipo de retorno.'
    },
    {
      id: 'S31', type: 'single',
      prompt: '¿Qué indica el signo - delante de un atributo o método?',
      options: ['Visibilidad privada', 'Visibilidad pública', 'Visibilidad protegida', 'Multiplicidad muchos'],
      answer: [0],
      explanation: '- significa private o privado: solo accede la propia clase.'
    },
    {
      id: 'S32', type: 'single',
      prompt: '¿Qué indica el signo + delante de un atributo o método?',
      options: ['Visibilidad pública', 'Visibilidad privada', 'Visibilidad protegida', 'Composición'],
      answer: [0],
      explanation: '+ significa public o público: pueden acceder todas las clases.'
    },
    {
      id: 'S33', type: 'single',
      prompt: '¿Qué indica el signo # delante de un atributo o método?',
      options: ['Visibilidad protegida', 'Visibilidad pública', 'Visibilidad privada', 'Agregación'],
      answer: [0],
      explanation: '# significa protected o protegido: acceden principalmente la clase y sus subclases.'
    },
    {
      id: 'S34', type: 'single',
      prompt: 'Entre clases, una asociación indica que…',
      options: ['objetos de una clase están relacionados con objetos de otra', 'una parte depende completamente del todo', 'una clase siempre hereda de otra', 'dos clases tienen el mismo nombre'],
      answer: [0],
      explanation: 'Cliente y Pedido pueden asociarse porque un cliente realiza pedidos.'
    },
    {
      id: 'S35', type: 'single',
      prompt: 'En una herencia, la flecha apunta…',
      options: ['desde la clase hija hacia la clase padre', 'desde la clase padre hacia la clase hija', 'hacia el atributo privado', 'hacia el objeto más reciente'],
      answer: [0],
      explanation: 'Auto y Camioneta apuntan a Vehículo, la clase padre.'
    },
    {
      id: 'S36', type: 'single',
      prompt: '¿Qué caracteriza a la agregación?',
      options: ['Es una relación todo-parte y las partes pueden existir independientemente', 'La parte desaparece necesariamente con el todo', 'Representa un comportamiento opcional', 'Representa cambios de estado'],
      answer: [0],
      explanation: 'La agregación se representa con rombo vacío; el Jugador puede existir sin ese Equipo.'
    },
    {
      id: 'S37', type: 'single',
      prompt: '¿Qué caracteriza a la composición?',
      options: ['Es una relación todo-parte fuerte donde la parte depende conceptualmente del todo', 'Las partes siempre existen independientemente', 'Es una relación entre actor y caso de uso', 'Ordena mensajes en el tiempo'],
      answer: [0],
      explanation: 'La composición usa rombo lleno; DetallePedido pierde sentido sin su Pedido.'
    },
    {
      id: 'S38', type: 'single',
      prompt: '¿Qué significa la multiplicidad 0..1?',
      options: ['Ninguno o uno', 'Exactamente uno', 'Uno o muchos', 'Cero o muchos'],
      answer: [0],
      explanation: '0..1 permite que la relación no exista o que haya una única instancia.'
    },
    {
      id: 'S39', type: 'single',
      prompt: 'En Cliente 1 ───── 0..* Pedido, ¿qué se interpreta?',
      options: ['Un cliente puede tener muchos pedidos y cada pedido pertenece a un cliente', 'Cada cliente debe tener exactamente un pedido', 'Un pedido puede pertenecer a muchos clientes', 'No existe relación entre Cliente y Pedido'],
      answer: [0],
      explanation: 'El 1 está del lado de Cliente y 0..* del lado de Pedido.'
    },

    {
      id: 'M01', type: 'multi',
      prompt: 'Seleccioná las cuatro acciones que UML permite realizar sobre un sistema.',
      options: ['Visualizar', 'Especificar', 'Construir', 'Documentar', 'Compilar automáticamente'],
      answer: [0, 1, 2, 3],
      explanation: 'La fórmula del apunte es: visualizar, especificar, construir y documentar sistemas.'
    },
    {
      id: 'M02', type: 'multi',
      prompt: '¿En qué etapas del desarrollo puede utilizarse UML según el apunte?',
      options: ['Especificación de requerimientos', 'Análisis', 'Diseño', 'Despliegue o implementación', 'Únicamente mantenimiento'],
      answer: [0, 1, 2, 3],
      explanation: 'UML acompaña varias etapas, desde requisitos hasta despliegue.'
    },
    {
      id: 'M03', type: 'multi',
      prompt: 'Seleccioná todos los diagramas estructurales del material.',
      options: ['Clases', 'Objetos', 'Componentes', 'Despliegue', 'Secuencia', 'Actividades'],
      answer: [0, 1, 2, 3],
      explanation: 'Estructurales = Clases, Objetos, Componentes y Despliegue.'
    },
    {
      id: 'M04', type: 'multi',
      prompt: 'Seleccioná todos los diagramas de comportamiento del material.',
      options: ['Casos de uso', 'Secuencia', 'Colaboración', 'Estados', 'Actividades', 'Componentes'],
      answer: [0, 1, 2, 3, 4],
      explanation: 'Comportamiento = Casos de uso, Secuencia, Colaboración, Estados y Actividades.'
    },
    {
      id: 'M05', type: 'multi',
      prompt: '¿Cuáles son los tres elementos principales de un diagrama de casos de uso?',
      options: ['Actores', 'Casos de uso', 'Relaciones', 'Atributos', 'Dispositivos'],
      answer: [0, 1, 2],
      explanation: 'Actor = quién; caso de uso = qué hace; relación = cómo se conectan.'
    },
    {
      id: 'M06', type: 'multi',
      prompt: '¿Cuáles de estos elementos pueden actuar como actores?',
      options: ['Un usuario', 'Un rol', 'Otro sistema', 'Otra aplicación', 'Solo una clase interna'],
      answer: [0, 1, 2, 3],
      explanation: 'Un actor es cualquier entidad externa que interactúa con el sistema.'
    },
    {
      id: 'M07', type: 'multi',
      prompt: '¿Qué información puede incluir la declaración de un atributo?',
      options: ['Visibilidad', 'Nombre', 'Tipo de dato', 'Valor inicial', 'Actor asociado'],
      answer: [0, 1, 2, 3],
      explanation: 'El formato indicado es visibilidad + nombre + tipo de dato + valor inicial.'
    },
    {
      id: 'M08', type: 'multi',
      prompt: '¿Qué información puede contener la firma de un método?',
      options: ['Visibilidad', 'Nombre', 'Parámetros', 'Tipo de retorno', 'Multiplicidad del actor'],
      answer: [0, 1, 2, 3],
      explanation: 'Los métodos pueden especificar visibilidad, nombre, parámetros y retorno.'
    },

    {
      id: 'P01', type: 'match',
      prompt: 'Uní cada diagrama estructural con lo que representa.',
      left: ['Clases', 'Objetos', 'Componentes', 'Despliegue'],
      right: [
        'Clases, atributos, métodos y relaciones',
        'Instancias concretas y sus relaciones',
        'Piezas de software de la aplicación',
        'Ejecución sobre equipos o dispositivos físicos'
      ],
      answerMap: { 'Clases': 0, 'Objetos': 1, 'Componentes': 2, 'Despliegue': 3 },
      explanation: 'Los cuatro diagramas describen aspectos estáticos del sistema.'
    },
    {
      id: 'P02', type: 'match',
      prompt: 'Uní cada diagrama de comportamiento con su foco principal.',
      left: ['Casos de uso', 'Secuencia', 'Colaboración', 'Estados', 'Actividades'],
      right: [
        'Funciones vistas por usuarios y actores',
        'Interacciones en orden temporal',
        'Interacciones desde una vista espacial',
        'Estados de un objeto y sus transiciones',
        'Flujo de acciones de un proceso'
      ],
      answerMap: { 'Casos de uso': 0, 'Secuencia': 1, 'Colaboración': 2, 'Estados': 3, 'Actividades': 4 },
      explanation: 'Todos muestran aspectos dinámicos: qué ocurre mientras funciona el sistema.'
    },
    {
      id: 'P03', type: 'match',
      prompt: 'Uní cada relación de casos de uso con su significado.',
      left: ['Asociación', '<<include>>', '<<extend>>', 'Generalización'],
      right: [
        'Actor que participa en una funcionalidad',
        'Comportamiento incluido obligatoriamente',
        'Comportamiento opcional o condicionado',
        'Herencia de comportamiento'
      ],
      answerMap: { 'Asociación': 0, '<<include>>': 1, '<<extend>>': 2, 'Generalización': 3 },
      explanation: 'Recordatorio: include = siempre; extend = puede ocurrir.'
    },
    {
      id: 'P04', type: 'match',
      prompt: 'Uní cada símbolo de visibilidad con su acceso.',
      left: ['- privado', '+ público', '# protegido'],
      right: [
        'Solo la propia clase',
        'Todas las clases',
        'Principalmente la clase y sus subclases'
      ],
      answerMap: { '- privado': 0, '+ público': 1, '# protegido': 2 },
      explanation: 'La visibilidad controla quién puede acceder a un atributo o método.'
    },
    {
      id: 'P05', type: 'match',
      prompt: 'Uní cada relación entre clases con su definición.',
      left: ['Asociación', 'Herencia', 'Agregación', 'Composición'],
      right: [
        'Objetos de distintas clases están relacionados',
        'Una clase hija recibe atributos y métodos de una clase padre',
        'Todo-parte con existencia independiente de las partes',
        'Todo-parte fuerte: la parte depende del todo'
      ],
      answerMap: { 'Asociación': 0, 'Herencia': 1, 'Agregación': 2, 'Composición': 3 },
      explanation: 'Agregación usa rombo vacío y composición usa rombo lleno.'
    },
    {
      id: 'P06', type: 'match',
      prompt: 'Uní cada multiplicidad con su significado.',
      left: ['1', '0..1', '* o 0..*', '1..*'],
      right: ['Exactamente uno', 'Ninguno o uno', 'Cero o muchos', 'Uno o muchos'],
      answerMap: { '1': 0, '0..1': 1, '* o 0..*': 2, '1..*': 3 },
      explanation: 'La multiplicidad indica cuántos objetos pueden participar de una relación.'
    },

    {
      id: 'O01', type: 'order',
      prompt: 'Ordená las etapas como aparecen presentadas en el apunte.',
      items: ['Diseño', 'Despliegue o implementación', 'Análisis', 'Especificación de requerimientos'],
      answerOrder: ['Especificación de requerimientos', 'Análisis', 'Diseño', 'Despliegue o implementación'],
      explanation: 'Requerimientos → análisis → diseño → despliegue o implementación.'
    },
    {
      id: 'O02', type: 'order',
      prompt: 'Ordená de arriba hacia abajo los compartimentos habituales de una clase UML.',
      items: ['Métodos', 'Nombre de la clase', 'Atributos'],
      answerOrder: ['Nombre de la clase', 'Atributos', 'Métodos'],
      explanation: 'La representación típica coloca nombre, atributos y métodos, en ese orden.'
    }
  ];

  const idToIndex = {};
  QUESTION_BANK.forEach(function (question, index) {
    idToIndex[question.id] = index;
  });

  function toB36(value) {
    return Number(value).toString(36);
  }

  function fromB36(value) {
    return parseInt(String(value), 36) || 0;
  }

  function isFileProtocol() {
    try {
      return window.location.protocol === 'file:';
    } catch (error) {
      return false;
    }
  }

  function setFileProtocolWarning() {
    var warning = document.getElementById('file-protocol-warning');
    if (!warning) return;
    warning.classList.toggle('hidden', !isFileProtocol());
  }

  function getCookie(name) {
    var escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  }

  function setCookie(name, value, days) {
    var maxAge = days * 24 * 60 * 60;
    document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; max-age=' + maxAge + '; SameSite=Lax';
  }

  function deleteCookie(name) {
    document.cookie = name + '=; path=/; max-age=0; SameSite=Lax';
  }

  function nowMin() {
    return Math.floor(Date.now() / 60000);
  }

  function statsToCompact(stats) {
    var compactQuestions = {};
    Object.keys(stats.questions).forEach(function (id) {
      var question = stats.questions[id];
      compactQuestions[id] = {
        s: toB36(question.seenCount),
        c: toB36(question.correctCount),
        w: toB36(question.wrongCount),
        t: toB36(question.lastSeen)
      };
    });

    return JSON.stringify({
      v: STORAGE_VERSION,
      x: toB36(stats.xp),
      s: toB36(stats.streak),
      ta: toB36(stats.totalAnswered),
      tc: toB36(stats.totalCorrect),
      l: toB36(stats.level),
      r: stats.recentIds,
      q: compactQuestions
    });
  }

  function compactToStats(raw) {
    var parsed;
    try {
      parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (error) {
      return null;
    }
    if (!parsed || parsed.v !== STORAGE_VERSION) return null;

    var questions = {};
    Object.keys(parsed.q || {}).forEach(function (id) {
      var question = parsed.q[id];
      questions[id] = {
        seenCount: fromB36(question.s),
        correctCount: fromB36(question.c),
        wrongCount: fromB36(question.w),
        lastSeen: fromB36(question.t)
      };
    });

    return {
      version: parsed.v,
      xp: fromB36(parsed.x),
      streak: fromB36(parsed.s),
      totalAnswered: fromB36(parsed.ta),
      totalCorrect: fromB36(parsed.tc),
      level: fromB36(parsed.l) || 1,
      recentIds: Array.isArray(parsed.r) ? parsed.r.slice(-RECENT_IDS_SIZE) : [],
      questions: questions
    };
  }

  function defaultStats() {
    return {
      version: STORAGE_VERSION,
      xp: 0,
      streak: 0,
      totalAnswered: 0,
      totalCorrect: 0,
      level: 1,
      recentIds: [],
      questions: {}
    };
  }

  function getStats() {
    var parts = [];
    var index = 0;
    var chunk;
    while ((chunk = getCookie(COOKIE_PREFIX + index)) !== '') {
      parts.push(chunk);
      index += 1;
    }

    if (parts.length) {
      var cookieStats = compactToStats(parts.join(''));
      if (cookieStats) return cookieStats;
    }

    try {
      var fallback = localStorage.getItem(FALLBACK_KEY);
      if (fallback) {
        var localStats = compactToStats(fallback);
        if (localStats) return localStats;
      }
    } catch (error) {}

    return defaultStats();
  }

  function setStats(stats) {
    var serialized = statsToCompact(stats);
    var index = 0;
    var start = 0;

    while (start < serialized.length) {
      setCookie(COOKIE_PREFIX + index, serialized.slice(start, start + COOKIE_MAX), COOKIE_DAYS);
      start += COOKIE_MAX;
      index += 1;
    }
    while (getCookie(COOKIE_PREFIX + index) !== '') {
      deleteCookie(COOKIE_PREFIX + index);
      index += 1;
    }

    try {
      localStorage.setItem(FALLBACK_KEY, serialized);
    } catch (error) {}
  }

  function clearAllProgress() {
    var index = 0;
    while (getCookie(COOKIE_PREFIX + index) !== '') {
      deleteCookie(COOKIE_PREFIX + index);
      index += 1;
    }
    try {
      localStorage.removeItem(FALLBACK_KEY);
    } catch (error) {}
  }

  function pickNextQuestion(stats) {
    var now = nowMin();
    var questionStats = QUESTION_BANK.map(function (question) {
      var saved = stats.questions[question.id] || {
        seenCount: 0,
        correctCount: 0,
        wrongCount: 0,
        lastSeen: 0
      };
      return {
        id: question.id,
        seen: saved.seenCount,
        correct: saved.correctCount,
        wrong: saved.wrongCount,
        lastSeen: saved.lastSeen,
        lastOne: stats.recentIds[stats.recentIds.length - 1] === question.id
      };
    });

    var unseen = questionStats.filter(function (question) {
      return question.seen === 0;
    });
    if (unseen.length) {
      var unseenPick = unseen[Math.floor(Math.random() * unseen.length)];
      return QUESTION_BANK[idToIndex[unseenPick.id]];
    }

    var excluded = stats.recentIds.slice(-RECENT_IDS_SIZE);
    var candidates = questionStats.filter(function (question) {
      return excluded.indexOf(question.id) < 0;
    });
    if (!candidates.length) {
      candidates = questionStats.filter(function (question) {
        return !question.lastOne;
      });
    }
    if (!candidates.length) candidates = questionStats;

    var weighted = candidates.map(function (question) {
      var priority = (question.wrong * 3 + (question.seen - question.correct) + 1) / (question.seen + 1);
      var recency = Math.min(3, Math.max(0, (now - question.lastSeen) / RECENCY_DIV_MIN));
      return { id: question.id, score: priority + recency + 0.01 };
    });
    var total = weighted.reduce(function (sum, question) {
      return sum + question.score;
    }, 0);
    var random = Math.random() * total;

    for (var index = 0; index < weighted.length; index += 1) {
      random -= weighted[index].score;
      if (random <= 0) return QUESTION_BANK[idToIndex[weighted[index].id]];
    }
    return QUESTION_BANK[idToIndex[weighted[weighted.length - 1].id]];
  }

  var state = {
    stats: getStats(),
    currentQuestion: null,
    answered: false
  };

  var screenStart = document.getElementById('screen-start');
  var screenQuiz = document.getElementById('screen-quiz');
  var statsXp = document.getElementById('stat-xp');
  var statsLevel = document.getElementById('stat-level');
  var statsStreak = document.getElementById('stat-streak');
  var statsPct = document.getElementById('stat-pct');
  var statsVistas = document.getElementById('stat-vistas');
  var btnStart = document.getElementById('btn-start');
  var btnReset = document.getElementById('btn-reset');
  var progressFill = document.getElementById('progress-fill');
  var questionPrompt = document.getElementById('question-prompt');
  var questionBody = document.getElementById('question-body');
  var feedbackArea = document.getElementById('feedback-area');
  var btnSubmit = document.getElementById('btn-submit');
  var btnNext = document.getElementById('btn-next');
  var questionTypeLabel = document.getElementById('question-type-label');

  function renderStart() {
    var stats = state.stats;
    statsXp.textContent = stats.xp;
    statsLevel.textContent = stats.level;
    statsStreak.textContent = stats.streak;
    statsPct.textContent = stats.totalAnswered ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) + '%' : '—';
    var seen = QUESTION_BANK.filter(function (question) {
      return Boolean(stats.questions[question.id]);
    }).length;
    statsVistas.textContent = seen + ' / ' + QUESTION_BANK.length;
  }

  function showScreen(screen) {
    screenStart.classList.remove('active');
    screenQuiz.classList.remove('active');
    screen.classList.add('active');
  }

  function escapeHtml(value) {
    var div = document.createElement('div');
    div.textContent = String(value);
    return div.innerHTML;
  }

  function shuffle(items) {
    for (var index = items.length - 1; index > 0; index -= 1) {
      var randomIndex = Math.floor(Math.random() * (index + 1));
      var temporary = items[index];
      items[index] = items[randomIndex];
      items[randomIndex] = temporary;
    }
    return items;
  }

  function renderChoice(question, multiple) {
    var type = multiple ? 'checkbox' : 'radio';
    var name = multiple ? '' : ' name="single"';
    var html = '<ul class="options-list" role="' + (multiple ? 'group' : 'radiogroup') + '" aria-label="Opciones">';
    question.options.forEach(function (option, index) {
      html += '<li><label class="option">';
      html += '<input type="' + type + '"' + name + ' value="' + index + '">';
      html += '<span>' + escapeHtml(option) + '</span></label></li>';
    });
    html += '</ul>';
    questionBody.innerHTML = html;

    questionBody.querySelectorAll('input').forEach(function (input) {
      input.addEventListener('change', function () {
        btnSubmit.disabled = questionBody.querySelectorAll('input:checked').length === 0;
      });
    });
  }

  function renderMatch(question) {
    var html = '<div class="match-rows">';
    question.left.forEach(function (left, index) {
      html += '<div class="match-row">';
      html += '<span class="match-left">' + escapeHtml(left) + '</span>';
      html += '<select data-left-index="' + index + '" aria-label="Relacionar ' + escapeHtml(left) + '">';
      html += '<option value="">— Elegir —</option>';
      question.right.forEach(function (right, rightIndex) {
        html += '<option value="' + rightIndex + '">' + escapeHtml(right) + '</option>';
      });
      html += '</select></div>';
    });
    html += '</div>';
    questionBody.innerHTML = html;

    function updateSubmit() {
      var allSelected = true;
      questionBody.querySelectorAll('select').forEach(function (select) {
        if (select.value === '') allSelected = false;
      });
      btnSubmit.disabled = !allSelected;
    }
    questionBody.querySelectorAll('select').forEach(function (select) {
      select.addEventListener('change', updateSubmit);
    });
  }

  function renderOrder(question) {
    var items = shuffle(question.items.slice());
    var html = '<div class="order-list">';
    items.forEach(function (item, index) {
      html += '<div class="order-item">';
      html += '<span class="order-num">' + (index + 1) + '</span>';
      html += '<span class="order-text">' + escapeHtml(item) + '</span>';
      html += '<div class="order-btns">';
      html += '<button type="button" class="order-up" aria-label="Subir">▲</button>';
      html += '<button type="button" class="order-down" aria-label="Bajar">▼</button>';
      html += '</div></div>';
    });
    html += '</div>';
    questionBody.innerHTML = html;

    var list = questionBody.querySelector('.order-list');
    list.addEventListener('click', function (event) {
      var moveUp = event.target.classList.contains('order-up');
      var moveDown = event.target.classList.contains('order-down');
      if (!moveUp && !moveDown) return;

      var item = event.target.closest('.order-item');
      var allItems = Array.prototype.slice.call(list.querySelectorAll('.order-item'));
      var index = allItems.indexOf(item);
      if (moveUp && index > 0) {
        list.insertBefore(item, allItems[index - 1]);
      } else if (moveDown && index < allItems.length - 1) {
        list.insertBefore(allItems[index + 1], item);
      }
      reindexOrder(list);
    });
    btnSubmit.disabled = false;
  }

  function reindexOrder(list) {
    list.querySelectorAll('.order-item').forEach(function (item, index) {
      item.querySelector('.order-num').textContent = index + 1;
    });
  }

  function getUserAnswer(question) {
    if (question.type === 'single') {
      var selected = questionBody.querySelector('input[name="single"]:checked');
      return selected ? [parseInt(selected.value, 10)] : null;
    }
    if (question.type === 'multi') {
      return Array.prototype.map.call(questionBody.querySelectorAll('input:checked'), function (input) {
        return parseInt(input.value, 10);
      }).sort(function (first, second) {
        return first - second;
      });
    }
    if (question.type === 'match') {
      var map = {};
      questionBody.querySelectorAll('select').forEach(function (select) {
        var left = question.left[parseInt(select.getAttribute('data-left-index'), 10)];
        map[left] = select.value === '' ? -1 : parseInt(select.value, 10);
      });
      return map;
    }
    return Array.prototype.map.call(questionBody.querySelectorAll('.order-text'), function (element) {
      return element.textContent;
    });
  }

  function arraysEqual(first, second) {
    if (!first || !second || first.length !== second.length) return false;
    return first.every(function (value, index) {
      return value === second[index];
    });
  }

  function isCorrectAnswer(question, userAnswer) {
    if (question.type === 'single' || question.type === 'multi') {
      return arraysEqual(question.answer, userAnswer);
    }
    if (question.type === 'order') {
      return arraysEqual(question.answerOrder, userAnswer);
    }
    return Object.keys(question.answerMap).every(function (left) {
      return question.answerMap[left] === userAnswer[left];
    });
  }

  function correctAnswerText(question) {
    if (question.type === 'single') return question.options[question.answer[0]];
    if (question.type === 'multi') {
      return question.answer.map(function (index) {
        return question.options[index];
      }).join('; ');
    }
    if (question.type === 'order') {
      return question.answerOrder.map(function (item, index) {
        return (index + 1) + '. ' + item;
      }).join('\n');
    }
    return Object.keys(question.answerMap).map(function (left) {
      return left + ' → ' + question.right[question.answerMap[left]];
    }).join('\n');
  }

  function markAnswer(question) {
    if (question.type === 'single' || question.type === 'multi') {
      questionBody.querySelectorAll('.option').forEach(function (option, index) {
        var input = option.querySelector('input');
        input.disabled = true;
        var expected = question.answer.indexOf(index) >= 0;
        if (expected) option.classList.add('correct');
        else if (input.checked) option.classList.add('wrong');
      });
      return;
    }

    if (question.type === 'match') {
      questionBody.querySelectorAll('select').forEach(function (select) {
        var left = question.left[parseInt(select.getAttribute('data-left-index'), 10)];
        var correct = parseInt(select.value, 10) === question.answerMap[left];
        select.disabled = true;
        select.parentElement.classList.add(correct ? 'correct' : 'wrong');
      });
      return;
    }

    var orderedTexts = Array.prototype.map.call(questionBody.querySelectorAll('.order-text'), function (element) {
      return element.textContent;
    });
    questionBody.querySelectorAll('.order-item').forEach(function (item, index) {
      item.classList.add(orderedTexts[index] === question.answerOrder[index] ? 'correct' : 'wrong');
    });
    questionBody.querySelectorAll('.order-btns button').forEach(function (button) {
      button.disabled = true;
    });
  }

  function ensureQuestionStats(id) {
    if (!state.stats.questions[id]) {
      state.stats.questions[id] = {
        seenCount: 0,
        correctCount: 0,
        wrongCount: 0,
        lastSeen: 0
      };
    }
    return state.stats.questions[id];
  }

  function recordAnswer(id, correct) {
    var questionStats = ensureQuestionStats(id);
    questionStats.seenCount += 1;
    questionStats.lastSeen = nowMin();
    state.stats.totalAnswered += 1;

    if (correct) {
      questionStats.correctCount += 1;
      state.stats.xp += XP_PER_CORRECT;
      state.stats.streak += 1;
      state.stats.totalCorrect += 1;
    } else {
      questionStats.wrongCount += 1;
      state.stats.streak = 0;
    }

    state.stats.level = Math.floor(state.stats.xp / XP_PER_LEVEL) + 1;
    state.stats.recentIds = state.stats.recentIds.filter(function (recentId) {
      return recentId !== id;
    });
    state.stats.recentIds.push(id);
    state.stats.recentIds = state.stats.recentIds.slice(-RECENT_IDS_SIZE);
    setStats(state.stats);
  }

  function submitAnswer() {
    if (state.answered) return;
    var question = state.currentQuestion;
    var userAnswer = getUserAnswer(question);
    var correct = isCorrectAnswer(question, userAnswer);
    state.answered = true;

    recordAnswer(question.id, correct);
    markAnswer(question);

    var answerHtml = correct ? '' : '<div class="correct-answer"><strong>Respuesta correcta:</strong><br>' +
      correctAnswerText(question).split('\n').map(escapeHtml).join('<br>') + '</div>';
    var explanationHtml = question.explanation ? '<div class="explanation"><strong>Clave:</strong> ' + escapeHtml(question.explanation) + '</div>' : '';

    feedbackArea.classList.remove('hidden', 'correct', 'wrong');
    feedbackArea.classList.add(correct ? 'correct' : 'wrong');
    feedbackArea.innerHTML = (correct ? '<span class="feedback-icon">✅</span><strong>Correcto.</strong>' : '<span class="feedback-icon">❌</span><strong>Incorrecto.</strong>') + answerHtml + explanationHtml;
    progressFill.style.width = '100%';
    btnSubmit.classList.add('hidden');
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  function nextQuestion() {
    state.stats = getStats();
    state.currentQuestion = pickNextQuestion(state.stats);
    state.answered = false;

    var question = state.currentQuestion;
    var typeLabels = {
      single: 'Una opción',
      multi: 'Varias opciones',
      match: 'Relacionar',
      order: 'Ordenar'
    };
    questionTypeLabel.textContent = typeLabels[question.type];
    questionPrompt.textContent = question.prompt;
    progressFill.style.width = '0%';
    feedbackArea.classList.add('hidden');
    feedbackArea.innerHTML = '';
    btnSubmit.classList.remove('hidden');
    btnSubmit.disabled = true;
    btnNext.classList.add('hidden');

    var multiHint = document.getElementById('question-multi-hint');
    multiHint.classList.toggle('hidden', question.type !== 'multi');
    if (question.type === 'multi') questionPrompt.setAttribute('aria-describedby', 'question-multi-hint');
    else questionPrompt.removeAttribute('aria-describedby');

    if (question.type === 'single') renderChoice(question, false);
    else if (question.type === 'multi') renderChoice(question, true);
    else if (question.type === 'match') renderMatch(question);
    else renderOrder(question);
  }

  function startQuiz() {
    showScreen(screenQuiz);
    nextQuestion();
  }

  function resetProgress() {
    if (!window.confirm('¿Resetear todo el progreso de UML? Se borrarán las cookies y los datos locales de esta materia.')) return;
    clearAllProgress();
    state.stats = defaultStats();
    renderStart();
    showScreen(screenStart);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' || !screenQuiz.classList.contains('active')) return;
    if (state.answered) {
      if (document.activeElement !== btnNext) btnNext.focus();
      return;
    }
    if (!btnSubmit.disabled) submitAnswer();
  });

  btnStart.addEventListener('click', startQuiz);
  btnReset.addEventListener('click', resetProgress);
  btnSubmit.addEventListener('click', submitAnswer);
  btnNext.addEventListener('click', nextQuestion);

  setFileProtocolWarning();
  renderStart();
})();
