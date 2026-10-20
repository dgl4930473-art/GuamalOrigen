const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();


/* ---------- Calendario ---------- */
/* Para añadir una fiesta confirmada, agrega una línea a esta lista:
   { mes: 1-12, dia: 1-31, titulo: "Nombre", detalle: "Descripción corta" }
   Usa mes: 0 (sin dia) para eventos cuya fecha aún no está confirmada. */
const EVENTOS = [
  { mes: 11, dia: 19, titulo: "Fecha clave de la historia municipal", detalle: "El 19 de noviembre de 1957 se reconoce como una fecha clave en la historia de Guamal." },
  { mes: 0, titulo: "Festival de Colonias y Río", detalle: "La Alcaldía ha publicado información sobre este festival. La fecha de las próximas ediciones aún no está confirmada." }
];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS = ["L", "M", "X", "J", "V", "S", "D"];
const hoy = new Date();
let calAnio = hoy.getFullYear();
let calMes = hoy.getMonth();
let calDiaSel = null;

const calTitle = document.getElementById("calTitle");
const calGrid = document.getElementById("calGrid");
const calEvents = document.getElementById("calEvents");

function eventosDelMes() {
  return EVENTOS.filter((e) => e.mes === calMes + 1).sort((a, b) => a.dia - b.dia);
}

function tarjetaEvento(e) {
  const fecha = e.dia ? `${e.dia} de ${MESES[e.mes - 1]}` : "Fecha por confirmar";
  return `<div class="cal-event"><span class="cal-date">${fecha}</span><h4>${e.titulo}</h4><p>${e.detalle}</p></div>`;
}

function dibujarCalendario() {
  calTitle.textContent = `${MESES[calMes]} ${calAnio}`;
  const delMes = eventosDelMes();
  const diasConEvento = new Set(delMes.map((e) => e.dia));
  const primero = (new Date(calAnio, calMes, 1).getDay() + 6) % 7;
  const total = new Date(calAnio, calMes + 1, 0).getDate();
  let html = DIAS.map((d) => `<div class="cal-dow" aria-hidden="true">${d}</div>`).join("");
  for (let i = 0; i < primero; i++) html += '<div class="cal-day empty"></div>';
  for (let d = 1; d <= total; d++) {
    const esHoy = d === hoy.getDate() && calMes === hoy.getMonth() && calAnio === hoy.getFullYear();
    const clases = "cal-day" + (esHoy ? " today" : "") + (d === calDiaSel ? " selected" : "");
    if (diasConEvento.has(d)) {
      html += `<button type="button" class="${clases} has-event" data-dia="${d}" aria-label="${d} de ${MESES[calMes]}, hay un evento">${d}</button>`;
    } else {
      html += `<div class="${clases}">${d}</div>`;
    }
  }
  calGrid.innerHTML = html;

  const visibles = calDiaSel ? delMes.filter((e) => e.dia === calDiaSel) : delMes;
  let lista = `<h3>Eventos de ${MESES[calMes]}</h3>`;
  lista += visibles.length ? visibles.map(tarjetaEvento).join("") : '<p class="cal-empty">No hay eventos confirmados este mes. Pregunta en la Alcaldía por las actividades vigentes.</p>';
  const pendientes = EVENTOS.filter((e) => e.mes === 0);
  if (pendientes.length) lista += `<div class="cal-pending"><strong>Por confirmar</strong>${pendientes.map(tarjetaEvento).join("")}</div>`;
  calEvents.innerHTML = lista;
}

function cambiarMes(delta) {
  calMes += delta;
  if (calMes < 0) { calMes = 11; calAnio--; }
  if (calMes > 11) { calMes = 0; calAnio++; }
  calDiaSel = null;
  dibujarCalendario();
}

document.getElementById("calPrev").addEventListener("click", () => cambiarMes(-1));
document.getElementById("calNext").addEventListener("click", () => cambiarMes(1));
calGrid.addEventListener("click", (ev) => {
  const btn = ev.target.closest("button[data-dia]");
  if (!btn) return;
  const dia = Number(btn.dataset.dia);
  calDiaSel = calDiaSel === dia ? null : dia;
  dibujarCalendario();
});
dibujarCalendario();

/* ---------- Mini quiz ---------- */
const PREGUNTAS = [
  { p: "¿En qué departamento de Colombia está Guamal?", o: ["Casanare", "Meta", "Guaviare", "Cundinamarca"], c: 1, e: "Guamal es un municipio del departamento del Meta, en el piedemonte llanero." },
  { p: "Según una explicación tradicional, ¿de dónde viene el nombre Guamal?", o: ["De un antiguo cacique", "De un río con ese nombre", "De los árboles de guama", "De una hacienda fundadora"], c: 2, e: "Una explicación tradicional lo relaciona con la presencia de árboles de guama en el territorio." },
  { p: "¿Qué fecha se reconoce como clave en la historia municipal?", o: ["7 de agosto de 1950", "12 de octubre de 1892", "20 de julio de 1810", "19 de noviembre de 1957"], c: 3, e: "El 19 de noviembre de 1957 se reconoce como una fecha clave en la historia de Guamal." },
  { p: "¿En qué río queda el balneario natural Pozo Azul?", o: ["Río Orotoy", "Río Humadea", "Río Meta", "Río Guaviare"], c: 0, e: "Pozo Azul está en el río Orotoy, en la vereda Santa Bárbara." },
  { p: "¿Cómo se prepara la mamona o ternera a la llanera?", o: ["Hervida con yuca en olla", "Frita en aceite", "Asada lentamente en estacas junto al fuego", "Horneada en hojas de plátano"], c: 2, e: "La carne de res se asa despacio en estacas, alrededor del fuego, y suele servirse con yuca, papa salada y ají." },
  { p: "¿Qué cooperativa cacaotera de Guamal aparece en este sitio?", o: ["Chocollano", "Workakao", "Cacaoteros del Ariari", "Casa Luker"], c: 1, e: "Workakao es una organización de familias cacaoteras de Guamal que transforma el grano en chocolates artesanales." },
  { p: "En la cadena del cacao, ¿qué sigue después de cosechar las mazorcas?", o: ["Fermentar el grano", "Hacer el chocolate", "Sembrar de nuevo", "Empacar para vender"], c: 0, e: "Después de la cosecha viene la fermentación y el secado del grano; al final se transforma en chocolate." },
  { p: "Antes de visitar un río o balneario, ¿qué recomienda la guía de este sitio?", o: ["Saltar para probar la profundidad", "Respetar los avisos y evitar zonas de corriente fuerte", "Ir sin avisar a nadie", "Enterrar la basura en la orilla"], c: 1, e: "Respeta los avisos, evita las zonas de corriente fuerte y lleva tus residuos de vuelta." }
];
const quizCard = document.getElementById("quizCard");
let qIndex = 0;
let qAciertos = 0;

function dibujarPregunta() {
  const q = PREGUNTAS[qIndex];
  const progreso = (qIndex / PREGUNTAS.length) * 100;
  quizCard.innerHTML = `
    <div class="quiz-progress" aria-hidden="true"><span style="width:${progreso}%"></span></div>
    <p class="quiz-count">Pregunta ${qIndex + 1} de ${PREGUNTAS.length}</p>
    <h3 class="quiz-question">${q.p}</h3>
    <div class="quiz-options">${q.o.map((t, i) => `<button type="button" class="quiz-option" data-i="${i}">${t}</button>`).join("")}</div>
    <div id="quizExtra"></div>`;
}

function responder(i) {
  const q = PREGUNTAS[qIndex];
  const botones = quizCard.querySelectorAll(".quiz-option");
  botones.forEach((b) => (b.disabled = true));
  botones[q.c].classList.add("correct");
  if (i === q.c) qAciertos++; else botones[i].classList.add("wrong");
  const ultima = qIndex === PREGUNTAS.length - 1;
  document.getElementById("quizExtra").innerHTML = `
    <p class="quiz-feedback"><strong>${i === q.c ? "¡Correcto!" : "Casi."}</strong> ${q.e}</p>
    <button type="button" class="button button-dark" id="quizNext">${ultima ? "Ver mi resultado" : "Siguiente pregunta"}</button>`;
  document.getElementById("quizNext").focus();
}

function dibujarResultado() {
  const total = PREGUNTAS.length;
  const mensaje = qAciertos >= 7 ? "¡Excelente! Conoces muy bien Guamal." : qAciertos >= 4 ? "¡Buen trabajo! Ya sabes bastante de Guamal." : "Sigue explorando el sitio y vuelve a intentarlo.";
  quizCard.innerHTML = `
    <div class="quiz-progress" aria-hidden="true"><span style="width:100%"></span></div>
    <div class="quiz-result">
      <p class="quiz-count">Tu resultado</p>
      <div class="quiz-score">${qAciertos}<small> / ${total}</small></div>
      <p>${mensaje}</p>
      <button type="button" class="button button-dark" id="quizRestart">Intentar de nuevo</button>
    </div>`;
}

quizCard.addEventListener("click", (ev) => {
  const op = ev.target.closest(".quiz-option");
  if (op && !op.disabled) return responder(Number(op.dataset.i));
  if (ev.target.closest("#quizNext")) {
    qIndex++;
    return qIndex < PREGUNTAS.length ? dibujarPregunta() : dibujarResultado();
  }
  if (ev.target.closest("#quizRestart")) {
    qIndex = 0; qAciertos = 0;
    dibujarPregunta();
  }
});
dibujarPregunta();
