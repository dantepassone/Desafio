(function () {
  'use strict';

  const COOKIE_MAX = 4000;
  const COOKIE_DAYS = 365;
  const STORAGE_VERSION = 1;
  const XP_PER_CORRECT = 10;
  const XP_PER_LEVEL = 100;
  const RECENT_IDS_SIZE = 5;
  const RECENCY_DIV_MIN = 360; // 6h en minutos

  // --- QUESTION_BANK (exacto) ---
  const QUESTION_BANK = [
    { "id":"A1","type":"single","prompt":"¿Quién es \"manipulador/a de alimentos\"?",
      "options":["Solo quien cocina en restaurantes","Toda persona que toca alimentos únicamente envasados","Toda persona que por su actividad está en contacto directo con alimentos en preparación, fabricación, envasado, almacenamiento, transporte, venta o servicio","Solo quien controla calidad en fábrica"],
      "answer":[2]
    },
    { "id":"A2","type":"single","prompt":"Un alimento \"genuino o normal\" es el que…",
      "options":["Tiene buen sabor y buen olor","No contiene sustancias no autorizadas ni adulteración y se vende con rotulado legal sin engaños","Siempre es industrial","Está libre de microorganismos"],
      "answer":[1]
    },
    { "id":"A3","type":"single","prompt":"Un \"alimento adulterado\" es el que…",
      "options":["Se pudrió por causas naturales","Tiene apariencia de otro producto legítimo","Fue privado total o parcialmente de elementos útiles o reemplazado/adicionado para ocultar defectos o alteraciones","Está en su envase original"],
      "answer":[2]
    },
    { "id":"A4","type":"single","prompt":"Un \"alimento falsificado\" es el que…",
      "options":["Está contaminado con bacterias","Tiene apariencia de producto legítimo y se denomina como ese sin serlo o no procede del verdadero fabricante/zona","Tiene menos nutrientes","Se venció"],
      "answer":[1]
    },
    { "id":"A5","type":"single","prompt":"Un \"alimento contaminado\" es el que…",
      "options":["Tiene exceso de sal","Contiene agentes vivos riesgosos y/o sustancias extrañas a su composición normal, o tóxicos naturales en exceso permitido","Está mal rotulado","Se cocinó de más"],
      "answer":[1]
    },
    { "id":"A6","type":"single","prompt":"\"Inocuidad\" significa…",
      "options":["Que el alimento sea rico en proteínas","Que no afecte la salud humana en el corto/mediano plazo, incluso la descendencia","Que el alimento sea orgánico","Que no tenga conservantes"],
      "answer":[1]
    },
    { "id":"A7","type":"single","prompt":"¿Cuál NO es una de las \"5 claves para la inocuidad\"?",
      "options":["Usar agua y materias primas seguras","No mezclar crudos y cocidos","Mantener alimentos a temperaturas seguras","Agregar limón a todas las comidas"],
      "answer":[3]
    },
    { "id":"A8","type":"single","prompt":"¿Cuál es un ejemplo de contaminación física?",
      "options":["Restos de insecticida","Astillas de madera / vidrio / tornillos en el alimento","Virus y bacterias","Hongos por humedad"],
      "answer":[1]
    },
    { "id":"A9","type":"single","prompt":"Según el apunte, las bacterias pueden reproducirse en…",
      "options":["2 horas","1 hora","20 minutos","24 horas"],
      "answer":[2]
    },
    { "id":"A10","type":"single","prompt":"Sobre temperatura (crecimiento bacteriano), el apunte indica que…",
      "options":["Por debajo de 5°C crecen más","Por debajo de 5°C se retarda el crecimiento","A 40°C se elimina el crecimiento","A 10°C mueren todas"],
      "answer":[1]
    },
    { "id":"A11","type":"single","prompt":"En descongelado, la \"ZONA DE PELIGRO\" está entre…",
      "options":["0°C a 5°C","5°C a 60°C","5°C a 65°C","60°C a 100°C"],
      "answer":[1]
    },
    { "id":"A12","type":"single","prompt":"¿Cuándo corresponde lavarse las manos?",
      "options":["Solo al comenzar el turno","Solo después de ir al baño","Después de estornudar/toser y también tras tocar huevos frescos o carnes crudas","Solo si se ven sucias"],
      "answer":[2]
    },
    { "id":"A13","type":"single","prompt":"El uso de guantes…",
      "options":["Reemplaza el lavado de manos","No sirve para nada","No excluye el lavado de manos: hay que mantener la frecuencia y cambiarlos si corresponde","Permite tocar basura y volver a cocinar"],
      "answer":[2]
    },
    { "id":"A14","type":"single","prompt":"¿Por qué NO se debe toser o estornudar sobre alimentos/materias primas?",
      "options":["Porque baja la temperatura","Porque en la saliva está Staphylococcus aureus, que puede causar ETA","Porque \"se corta\" el alimento","Porque cambia el sabor"],
      "answer":[1]
    },
    { "id":"A15","type":"single","prompt":"Barba o bigote en el área de elaboración:",
      "options":["Se recomienda siempre, sin cubrir","Debe cubrirse con barbijo, pero preferentemente evitarse","Solo importa si hay guantes","No influye en nada"],
      "answer":[1]
    },
    { "id":"A16","type":"single","prompt":"Basura en el área de trabajo:",
      "options":["Se acumula y se saca al final del día","Se desecha con frecuencia y los tachos deben estar bien tapados","Da lo mismo si está cerca de la mesada","Solo importa en industrias"],
      "answer":[1]
    },
    { "id":"A17","type":"single","prompt":"¿Cuál definición es correcta?",
      "options":["Limpieza = reducir microorganismos; desinfección = sacar suciedad","Limpieza = eliminar suciedad; desinfección = reducir microorganismos a nivel que no contamine","Son lo mismo","Desinfección = solo agua caliente"],
      "answer":[1]
    },
    { "id":"A18","type":"single","prompt":"Contaminación cruzada directa:",
      "options":["Se transmite por aire siempre","Crudos tocan cocidos y transfieren contaminación","Solo ocurre en freezer","Solo es por químicos"],
      "answer":[1]
    },
    { "id":"A19","type":"single","prompt":"En heladera (un solo recinto), distribución recomendada:",
      "options":["Carnes arriba y lácteos abajo","Carnes abajo; cocidos al centro o arriba; lácteos arriba","Todo mezclado","Verduras abajo y carnes arriba"],
      "answer":[1]
    },
    { "id":"A20","type":"single","prompt":"Según el apunte, los huevos…",
      "options":["Van siempre en la heladera","NO van en la heladera: se dejan afuera en lugar fresco y seco","Van en freezer","Da igual"],
      "answer":[1]
    },
    { "id":"A21","type":"single","prompt":"Descongelado en heladera: retirar del congelador con una antelación de…",
      "options":["30 minutos","2 horas","Por lo menos 6 horas","24 horas obligatorias"],
      "answer":[2]
    },
    { "id":"A22","type":"single","prompt":"Descongelado con agua fría: se recomienda…",
      "options":["Usar agua caliente y no cambiarla","Mantener agua muy fría y cambiarla cada media hora","Dejar el alimento abierto sin envoltorio","Usar agua con detergente"],
      "answer":[1]
    },
    { "id":"A23","type":"single","prompt":"Descongelado en microondas:",
      "options":["Se puede guardar y cocinar al día siguiente","Hay que cocinar inmediatamente porque partes pueden quedar calientes (zona de peligro)","Es igual que heladera","Se recomienda siempre para grandes piezas"],
      "answer":[1]
    },
    { "id":"A24","type":"single","prompt":"El apunte remarca:",
      "options":["Se puede descongelar a temperatura ambiente si es \"poco tiempo\"","Nunca descongelar a temperatura ambiente","Solo en verano","Depende del alimento"],
      "answer":[1]
    },
    { "id":"A25","type":"single","prompt":"Rotulado obligatorio \"libre de gluten\":",
      "options":["Solo poner \"Sin TACC\" chiquito","Debe decir \"libre de gluten\" + \"Sin TACC\" cerca de la denominación con buena visibilidad + símbolo","Solo importados","No requiere símbolo"],
      "answer":[1]
    },
    { "id":"B26","type":"multi","prompt":"Para evitar contaminación cruzada con gluten, se recomienda:",
      "options":["Almacenar materias primas y productos finales en espacio exclusivo","Destinar heladeras/freezer exclusivos; si no, contenedores herméticos y ubicar en estante superior","Identificar todo como \"producto libre de gluten\"","Mezclar utensilios porosos porque \"se limpian igual\""],
      "answer":[0,1,2]
    },
    { "id":"B27","type":"multi","prompt":"Sobre POES:",
      "options":["Describen qué, cómo, cuándo y dónde limpiar/desinfectar","Incluyen registros/advertencias e identificación de productos","Se diferencian pre-operacionales, operacionales y post-operacionales","Solo se aplican \"cuando hay inspección\""],
      "answer":[0,1,2]
    },
    { "id":"B28","type":"multi","prompt":"Sobre HACCP:",
      "options":["Identifica, evalúa y controla peligros que comprometen inocuidad","Un PCC puede ser espacio físico, práctica, procedimiento o proceso vigilado","Consta de 7 pasos e incluye verificación y documentación","Solo sirve para industrias enormes"],
      "answer":[0,1,2]
    },
    { "id":"B29","type":"multi","prompt":"Salmonelosis: medidas de control que figuran:",
      "options":["Cocción completa (70°C o más)","Lavado de manos frecuente","Separar crudos de cocidos","Mantener refrigeración 5°C o menos"],
      "answer":[0,1,2,3]
    },
    { "id":"B30","type":"multi","prompt":"Listeriosis: el material afirma que:",
      "options":["Listeria crece aún a temperaturas de refrigeración","Se elimina por calentamiento durante la cocción","Se asocia a fiambres/embutidos, lácteos sin pasteurizar, vegetales crudos, pescados crudos/ahumados","Incubación: entre 12 horas y 2 meses"],
      "answer":[0,1,2,3]
    },
    { "id":"C1","type":"match","prompt":"Uní cada sigla con su definición (usa dropdown).",
      "left":["ETA","BPM","BPA","POES","MIP","HACCP","PCC","SUH","TACC"],
      "right":["Buenas prácticas agrícolas (inocuidad/calidad)","Enfermedades transmitidas por alimentos/agua contaminados o toxinas","Procedimientos estandarizados de saneamiento (qué/cómo/cuándo/dónde + registros)","Manejo integrado de plagas","Sistema de análisis de peligros y puntos críticos de control","Punto crítico de control (espacio/práctica/procedimiento/proceso vigilado)","Síndrome urémico hemolítico","Buenas prácticas de manufactura/manipulación","Trigo, avena, cebada y centeno"],
      "answerMap":{"ETA":1,"BPM":7,"BPA":0,"POES":2,"MIP":3,"HACCP":4,"PCC":5,"SUH":6,"TACC":8}
    },
    { "id":"D1","type":"match","prompt":"Uní la enfermedad con su dato clave.",
      "left":["Salmonelosis","Bacillus cereus (diarreica)","Bacillus cereus (emética)","Intoxicación estafilocócica","Botulismo","Listeriosis","Triquinosis"],
      "right":[
        "Neurotoxina; asociado a poco oxígeno y pH > 4,6",
        "Crece en refrigeración; se elimina por cocción; asociada a fiambres/lácteos no pasteurizados etc.",
        "Parásito en cerdo/jabalí; por chacinados/cerdo mal cocido",
        "Enterotoxinas; humano principal reservorio; microgotas salivales/contacto",
        "Huevos/carnes/aves/leche; síntomas digestivos + fiebre",
        "6–15 h; dura ~24 h; diarrea acuosa y dolor abdominal",
        "1–6 h; dura ~24 h; náuseas y vómitos"
      ],
      "answerMap":{
        "Salmonelosis":4,
        "Bacillus cereus (diarreica)":5,
        "Bacillus cereus (emética)":6,
        "Intoxicación estafilocócica":3,
        "Botulismo":0,
        "Listeriosis":1,
        "Triquinosis":2
      }
    },
    { "id":"E1","type":"order","prompt":"Ordená los 7 pasos del HACCP (de 1 a 7).",
      "items":["Acciones correctivas","Documentación","Analizar riesgos y peligros","Verificación","Identificación de puntos críticos","Establecimiento de límites críticos","Desarrollo de procedimientos de monitoreo"],
      "answerOrder":["Analizar riesgos y peligros","Identificación de puntos críticos","Establecimiento de límites críticos","Desarrollo de procedimientos de monitoreo","Acciones correctivas","Verificación","Documentación"]
    },
    { "id":"E2","type":"order","prompt":"Ordená según el momento de ejecución de POES:",
      "items":["Post-operacionales","Operacionales","Pre-operacionales"],
      "answerOrder":["Pre-operacionales","Operacionales","Post-operacionales"]
    }
  ];

  const idToIndex = {};
  QUESTION_BANK.forEach(function (q, i) { idToIndex[q.id] = i; });

  // --- Util: base36 ---
  function toB36(n) { return Number(n).toString(36); }
  function fromB36(s) { return parseInt(String(s), 36) || 0; }

  // --- Protocolo file:// ---
  var isFileProtocol = (function () {
    try { return window.location.protocol === 'file:'; } catch (e) { return false; }
  })();

  function showFileProtocolWarning() {
    var el = document.getElementById('file-protocol-warning');
    if (el) el.classList.remove('hidden');
  }
  function hideFileProtocolWarning() {
    var el = document.getElementById('file-protocol-warning');
    if (el) el.classList.add('hidden');
  }
  if (isFileProtocol) showFileProtocolWarning();
  else hideFileProtocolWarning();

  // --- Cookies ---
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
  }

  function setCookie(name, value, days) {
    var max = days * 24 * 60 * 60;
    document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; max-age=' + max + '; SameSite=Lax';
  }

  function deleteCookie(name) {
    document.cookie = name + '=; path=/; max-age=0';
  }

  function cookiesAvailable() {
    var test = 'quiz_test_' + Date.now();
    setCookie(test, '1', 0);
    var ok = getCookie(test) === '1';
    deleteCookie(test);
    return ok;
  }

  // --- Serialización compacta (base36, sparse) ---
  function nowMin() { return Math.floor(Date.now() / 60000); }

  function statsToCompact(stats) {
    var q = {};
    var id;
    for (id in stats.questions) {
      var qq = stats.questions[id];
      q[id] = {
        s: toB36(qq.seenCount),
        c: toB36(qq.correctCount),
        w: toB36(qq.wrongCount),
        t: toB36(qq.lastSeen)
      };
    }
    return JSON.stringify({
      v: STORAGE_VERSION,
      x: toB36(stats.xp),
      s: toB36(stats.streak),
      ta: toB36(stats.totalAnswered),
      tc: toB36(stats.totalCorrect),
      l: toB36(stats.level),
      r: stats.recentIds,
      q: q
    });
  }

  function compactToStats(raw) {
    var o = (typeof raw === 'string') ? (function () { try { return JSON.parse(raw); } catch (e) { return null; } })() : raw;
    if (!o || !o.v) return null;
    var q = o.q || {};
    var questions = {};
    var id;
    for (id in q) {
      var qq = q[id];
      questions[id] = {
        seenCount: fromB36(qq.s),
        correctCount: fromB36(qq.c),
        wrongCount: fromB36(qq.w),
        lastSeen: fromB36(qq.t)
      };
    }
    return {
      version: o.v,
      xp: fromB36(o.x),
      streak: fromB36(o.s),
      totalAnswered: fromB36(o.ta),
      totalCorrect: fromB36(o.tc),
      level: fromB36(o.l) || 1,
      recentIds: Array.isArray(o.r) ? o.r.slice(-RECENT_IDS_SIZE) : [],
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
    var i = 0;
    var parts = [];
    var chunk;
    while ((chunk = getCookie('quiz_stats_' + i)) !== '') {
      parts.push(chunk);
      i++;
    }
    var str = parts.join('');
    if (str) {
      var stats = compactToStats(str);
      if (stats) return stats;
    }
    try {
      var fallback = localStorage.getItem('quiz_fallback');
      if (fallback) {
        var s = compactToStats(fallback);
        if (s) return s;
      }
    } catch (e) {}
    return defaultStats();
  }

  function setStats(stats) {
    var str = statsToCompact(stats);
    var i = 0;
    var start = 0;
    while (start < str.length) {
      var chunk = str.slice(start, start + COOKIE_MAX);
      setCookie('quiz_stats_' + i, chunk, COOKIE_DAYS);
      start += COOKIE_MAX;
      i++;
    }
    while (getCookie('quiz_stats_' + i) !== '') {
      deleteCookie('quiz_stats_' + i);
      i++;
    }
    try {
      localStorage.setItem('quiz_fallback', str);
    } catch (e) {}
  }

  function clearAllProgress() {
    var i = 0;
    while (getCookie('quiz_stats_' + i) !== '') {
      deleteCookie('quiz_stats_' + i);
      i++;
    }
    try {
      localStorage.removeItem('quiz_fallback');
    } catch (e) {}
  }

  // --- Selección inteligente ---
  function pickNextQuestion(stats) {
    var now = nowMin();
    var questions = QUESTION_BANK.map(function (q) {
      var id = q.id;
      var qs = stats.questions[id] || { seenCount: 0, correctCount: 0, wrongCount: 0, lastSeen: 0 };
      var seen = qs.seenCount;
      var correct = qs.correctCount;
      var wrong = qs.wrongCount;
      var lastSeen = qs.lastSeen;
      var inRecent = stats.recentIds.indexOf(id) >= 0;
      var lastOne = stats.recentIds[stats.recentIds.length - 1] === id;
      return { id: id, seen: seen, correct: correct, wrong: wrong, lastSeen: lastSeen, inRecent: inRecent, lastOne: lastOne };
    });

    var newOnes = questions.filter(function (p) { return p.seen === 0; });
    if (newOnes.length > 0) {
      return QUESTION_BANK[idToIndex[newOnes[Math.floor(Math.random() * newOnes.length)].id]];
    }

    var excluded = stats.recentIds.slice(-RECENT_IDS_SIZE);
    var candidates = questions.filter(function (p) {
      return p.seen > 0 && excluded.indexOf(p.id) < 0;
    });

    if (candidates.length === 0) {
      var allowRecent = questions.filter(function (p) { return p.seen > 0 && !p.lastOne; });
      if (allowRecent.length === 0) allowRecent = questions;
      candidates = allowRecent;
    }

    var scores = [];
    for (var i = 0; i < candidates.length; i++) {
      var p = candidates[i];
      var prioridad = (p.wrong * 3 + (p.seen - p.correct) + 1) / (p.seen + 1);
      var recencia = Math.min(3, Math.max(0, (now - p.lastSeen) / RECENCY_DIV_MIN));
      var score = prioridad + recencia + 0.01;
      scores.push({ id: p.id, score: score });
    }
    var total = 0;
    for (var j = 0; j < scores.length; j++) total += scores[j].score;
    var r = Math.random() * total;
    for (var k = 0; k < scores.length; k++) {
      r -= scores[k].score;
      if (r <= 0) return QUESTION_BANK[idToIndex[scores[k].id]];
    }
    return QUESTION_BANK[idToIndex[scores[scores.length - 1].id]];
  }

  // --- Estado UI ---
  var state = {
    stats: getStats(),
    currentQuestion: null,
    answered: false
  };

  function ensureQuestionStats(id) {
    if (!state.stats.questions[id]) {
      state.stats.questions[id] = { seenCount: 0, correctCount: 0, wrongCount: 0, lastSeen: 0 };
    }
    return state.stats.questions[id];
  }

  function recordAnswer(id, correct) {
    var qs = ensureQuestionStats(id);
    qs.seenCount++;
    qs.lastSeen = nowMin();
    if (correct) {
      qs.correctCount++;
      state.stats.xp += XP_PER_CORRECT;
      state.stats.streak++;
      state.stats.totalCorrect++;
    } else {
      qs.wrongCount++;
      state.stats.streak = 0;
    }
    state.stats.totalAnswered++;
    while (state.stats.xp >= state.stats.level * XP_PER_LEVEL) state.stats.level++;
    var recent = state.stats.recentIds.filter(function (r) { return r !== id; });
    recent.push(id);
    state.stats.recentIds = recent.slice(-RECENT_IDS_SIZE);
    setStats(state.stats);
  }

  // --- DOM refs ---
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

  function renderStart() {
    var s = state.stats;
    statsXp.textContent = s.xp;
    statsLevel.textContent = s.level;
    statsStreak.textContent = s.streak;
    var pct = s.totalAnswered ? Math.round((s.totalCorrect / s.totalAnswered) * 100) : '—';
    statsPct.textContent = typeof pct === 'number' ? pct + '%' : pct;
    var seen = 0;
    for (var id in s.questions) seen++;
    statsVistas.textContent = seen + ' / ' + QUESTION_BANK.length;
  }

  function showScreen(screen) {
    screenStart.classList.remove('active');
    screenQuiz.classList.remove('active');
    screen.classList.add('active');
  }

  // --- Renderizado por tipo ---
  function renderSingle(q) {
    var html = '<ul class="options-list" role="radiogroup" aria-label="Opciones">';
    q.options.forEach(function (opt, i) {
      html += '<li class="option" tabindex="0" role="radio" aria-checked="false" data-idx="' + i + '">';
      html += '<input type="radio" name="single" value="' + i + '" id="opt' + i + '">';
      html += '<label for="opt' + i + '">' + escapeHtml(opt) + '</label></li>';
    });
    html += '</ul>';
    questionBody.innerHTML = html;
    questionBody.querySelectorAll('.option').forEach(function (li) {
      li.addEventListener('click', function () {
        questionBody.querySelectorAll('.option').forEach(function (x) {
          x.classList.remove('selected');
          x.setAttribute('aria-checked', 'false');
          x.querySelector('input').checked = false;
        });
        li.classList.add('selected');
        li.setAttribute('aria-checked', 'true');
        li.querySelector('input').checked = true;
        btnSubmit.disabled = false;
      });
    });
  }

  function renderMulti(q) {
    var multiHintEl = document.getElementById('question-multi-hint');
    if (multiHintEl) {
      multiHintEl.classList.remove('hidden');
    }
    var html = '<ul class="options-list" role="group" aria-label="Opciones">';
    q.options.forEach(function (opt, i) {
      html += '<li class="option">';
      html += '<input type="checkbox" id="m' + i + '" value="' + i + '">';
      html += '<label for="m' + i + '">' + escapeHtml(opt) + '</label></li>';
    });
    html += '</ul>';
    questionBody.innerHTML = html;
    function updateSubmit() {
      var any = questionBody.querySelectorAll('input:checked').length > 0;
      btnSubmit.disabled = !any;
    }
    questionBody.querySelectorAll('input').forEach(function (cb) {
      cb.addEventListener('change', updateSubmit);
    });
  }

  function renderMatch(q) {
    var html = '<div class="match-rows">';
    q.left.forEach(function (leftVal, i) {
      html += '<div class="match-row">';
      html += '<span class="match-left">' + escapeHtml(leftVal) + '</span>';
      html += '<select data-left="' + escapeHtml(leftVal) + '" aria-label="' + escapeHtml(leftVal) + '">';
      html += '<option value="">— Elegir —</option>';
      q.right.forEach(function (rightVal, j) {
        html += '<option value="' + j + '">' + escapeHtml(rightVal) + '</option>';
      });
      html += '</select></div>';
    });
    html += '</div>';
    questionBody.innerHTML = html;
    function updateSubmit() {
      var selects = questionBody.querySelectorAll('select');
      var all = true;
      selects.forEach(function (s) { if (s.value === '') all = false; });
      btnSubmit.disabled = !all;
    }
    questionBody.querySelectorAll('select').forEach(function (sel) {
      sel.addEventListener('change', updateSubmit);
    });
  }

  function renderOrder(q) {
    var items = q.items.slice();
    shuffle(items);
    var html = '<div class="order-list">';
    items.forEach(function (text, i) {
      html += '<div class="order-item" data-index="' + i + '">';
      html += '<span class="order-num">' + (i + 1) + '</span>';
      html += '<span class="order-text">' + escapeHtml(text) + '</span>';
      html += '<div class="order-btns"><button type="button" class="order-up" aria-label="Subir">▲</button><button type="button" class="order-down" aria-label="Bajar">▼</button></div>';
      html += '</div>';
    });
    html += '</div>';
    questionBody.innerHTML = html;
    var list = questionBody.querySelector('.order-list');
    list.addEventListener('click', function (e) {
      var up = e.target.classList.contains('order-up');
      var down = e.target.classList.contains('order-down');
      if (!up && !down) return;
      var item = e.target.closest('.order-item');
      if (!item) return;
      var divs = list.querySelectorAll('.order-item');
      var idx = Array.prototype.indexOf.call(divs, item);
      if (up && idx > 0) {
        list.insertBefore(item, divs[idx - 1]);
        reindexOrder(list);
      } else if (down && idx < divs.length - 1) {
        list.insertBefore(divs[idx + 1], item);
        reindexOrder(list);
      }
    });
    btnSubmit.disabled = false;
  }

  function reindexOrder(list) {
    list.querySelectorAll('.order-item').forEach(function (div, i) {
      div.querySelector('.order-num').textContent = i + 1;
      div.setAttribute('data-index', i);
    });
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  // --- Respuestas ---
  function getSingleAnswer() {
    var radio = questionBody.querySelector('input[name="single"]:checked');
    return radio ? [parseInt(radio.value, 10)] : null;
  }

  function getMultiAnswer() {
    var checked = questionBody.querySelectorAll('input[type="checkbox"]:checked');
    var arr = [];
    checked.forEach(function (c) { arr.push(parseInt(c.value, 10)); });
    arr.sort(function (a, b) { return a - b; });
    return arr;
  }

  function getMatchAnswer() {
    var map = {};
    questionBody.querySelectorAll('select').forEach(function (sel) {
      var left = sel.getAttribute('data-left');
      map[left] = sel.value === '' ? -1 : parseInt(sel.value, 10);
    });
    return map;
  }

  function getOrderAnswer(q) {
    var divs = questionBody.querySelectorAll('.order-item .order-text');
    var arr = [];
    divs.forEach(function (d) { arr.push(d.textContent); });
    return arr;
  }

  function checkSingle(q, user) {
    if (!user || user.length !== 1) return false;
    return q.answer[0] === user[0];
  }

  function checkMulti(q, user) {
    if (!user || user.length !== q.answer.length) return false;
    for (var i = 0; i < q.answer.length; i++) if (user[i] !== q.answer[i]) return false;
    return true;
  }

  function checkMatch(q, user) {
    var am = q.answerMap;
    for (var key in am) if (am[key] !== user[key]) return false;
    return true;
  }

  function checkOrder(q, user) {
    if (!user || user.length !== q.answerOrder.length) return false;
    for (var i = 0; i < q.answerOrder.length; i++) if (user[i] !== q.answerOrder[i]) return false;
    return true;
  }

  function showCorrectAnswer(q) {
    if (q.type === 'single') {
      return q.options[q.answer[0]];
    }
    if (q.type === 'multi') {
      return q.answer.map(function (i) { return q.options[i]; }).join('; ');
    }
    if (q.type === 'match') {
      var lines = [];
      for (var left in q.answerMap) {
        var idx = q.answerMap[left];
        lines.push(left + ' → ' + q.right[idx]);
      }
      return lines.join('\n');
    }
    if (q.type === 'order') {
      return q.answerOrder.map(function (item, i) { return (i + 1) + '. ' + item; }).join('\n');
    }
    return '';
  }

  function markOrderCorrect(q) {
    questionBody.querySelectorAll('.order-item').forEach(function (div) {
      div.classList.remove('correct', 'wrong');
    });
    var texts = questionBody.querySelectorAll('.order-item .order-text');
    var userOrder = [];
    texts.forEach(function (t) { userOrder.push(t.textContent); });
    var correctOrder = q.answerOrder;
    texts.forEach(function (span, i) {
      var idx = correctOrder.indexOf(span.textContent);
      if (userOrder[i] === correctOrder[i]) span.closest('.order-item').classList.add('correct');
      else span.closest('.order-item').classList.add('wrong');
    });
  }

  function markMatchCorrect(q) {
    questionBody.querySelectorAll('select').forEach(function (sel) {
      var left = sel.getAttribute('data-left');
      var correctIdx = q.answerMap[left];
      sel.disabled = true;
      if (parseInt(sel.value, 10) === correctIdx) sel.parentElement.classList.add('correct');
      else sel.parentElement.classList.add('wrong');
    });
  }

  function markMultiCorrect(q) {
    questionBody.querySelectorAll('.option').forEach(function (li, i) {
      var cb = li.querySelector('input');
      cb.disabled = true;
      var correct = q.answer.indexOf(i) >= 0;
      var checked = cb.checked;
      if (correct && checked) li.classList.add('correct');
      else if (correct && !checked) li.classList.add('correct');
      else if (!correct && checked) li.classList.add('wrong');
    });
  }

  function markSingleCorrect(q) {
    questionBody.querySelectorAll('.option').forEach(function (li) {
      var radio = li.querySelector('input');
      radio.disabled = true;
      var idx = parseInt(radio.value, 10);
      if (idx === q.answer[0]) li.classList.add('correct');
      else if (radio.checked) li.classList.add('wrong');
    });
  }

  function submitAnswer() {
    if (state.answered) return;
    var q = state.currentQuestion;
    var user;
    if (q.type === 'single') user = getSingleAnswer();
    else if (q.type === 'multi') user = getMultiAnswer();
    else if (q.type === 'match') user = getMatchAnswer(q);
    else user = getOrderAnswer(q);

    var correct = false;
    if (q.type === 'single') correct = checkSingle(q, user);
    else if (q.type === 'multi') correct = checkMulti(q, user);
    else if (q.type === 'match') correct = checkMatch(q, user);
    else correct = checkOrder(q, user);

    state.answered = true;
    recordAnswer(q.id, correct);

    if (q.type === 'single') markSingleCorrect(q);
    else if (q.type === 'multi') markMultiCorrect(q);
    else if (q.type === 'match') markMatchCorrect(q);
    else markOrderCorrect(q);

    feedbackArea.classList.remove('hidden', 'correct', 'wrong');
    feedbackArea.classList.add(correct ? 'correct' : 'wrong');
    var correctAnswerHtml = correct ? '' : '<div class="correct-answer">' +
      showCorrectAnswer(q).split('\n').map(escapeHtml).join('<br>') + '</div>';
    feedbackArea.innerHTML = (correct ? '<span class="feedback-icon">✅</span> Correcto.' : '<span class="feedback-icon">❌</span> Incorrecto.') +
      correctAnswerHtml;

    progressFill.style.width = '100%';
    btnSubmit.classList.add('hidden');
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  function nextQuestion() {
    state.stats = getStats();
    state.currentQuestion = pickNextQuestion(state.stats);
    state.answered = false;
    progressFill.style.width = '0%';

    questionPrompt.textContent = state.currentQuestion.prompt;
    var multiHintEl = document.getElementById('question-multi-hint');
    if (multiHintEl) {
      if (state.currentQuestion.type === 'multi') {
        multiHintEl.classList.remove('hidden');
        questionPrompt.setAttribute('aria-describedby', 'question-multi-hint');
      } else {
        multiHintEl.classList.add('hidden');
        questionPrompt.removeAttribute('aria-describedby');
      }
    }
    feedbackArea.classList.add('hidden');
    feedbackArea.innerHTML = '';
    btnSubmit.classList.remove('hidden');
    btnSubmit.disabled = true;
    btnNext.classList.add('hidden');

    if (state.currentQuestion.type === 'single') renderSingle(state.currentQuestion);
    else if (state.currentQuestion.type === 'multi') renderMulti(state.currentQuestion);
    else if (state.currentQuestion.type === 'match') renderMatch(state.currentQuestion);
    else renderOrder(state.currentQuestion);
  }

  function startQuiz() {
    showScreen(screenQuiz);
    nextQuestion();
  }

  function resetProgress() {
    if (!confirm('¿Resetear todo el progreso? Se borrarán cookies y datos locales.')) return;
    clearAllProgress();
    state.stats = defaultStats();
    renderStart();
    showScreen(screenStart);
  }

  // --- Enter para enviar ---
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    if (screenQuiz.classList.contains('active') && !state.answered) {
      if (state.currentQuestion.type === 'single' && getSingleAnswer() !== null) submitAnswer();
      else if (state.currentQuestion.type === 'multi' && questionBody.querySelectorAll('input:checked').length > 0) submitAnswer();
      else if (state.currentQuestion.type === 'match') {
        var all = true;
        questionBody.querySelectorAll('select').forEach(function (s) { if (s.value === '') all = false; });
        if (all) submitAnswer();
      } else if (state.currentQuestion.type === 'order') submitAnswer();
    } else if (screenQuiz.classList.contains('active') && state.answered && document.activeElement !== btnNext) {
      btnNext.focus();
    }
  });

  btnStart.addEventListener('click', startQuiz);
  btnReset.addEventListener('click', resetProgress);
  btnSubmit.addEventListener('click', submitAnswer);
  btnNext.addEventListener('click', nextQuestion);

  renderStart();
})();
