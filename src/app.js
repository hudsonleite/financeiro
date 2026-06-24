const STORAGE_KEY = "financeiro:lancamentos:v1";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const state = {
  currentDate: new Date(),
  selectedDate: null,
  entries: loadEntries(),
};

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(dateKey) {
  return fromDateKey(dateKey).toLocaleDateString("pt-BR");
}

function parseMoney(value) {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function monthEntries() {
  const year = state.currentDate.getFullYear();
  const month = state.currentDate.getMonth();
  return state.entries.filter((entry) => {
    const date = fromDateKey(entry.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}

function sumEntries(entries, type = null) {
  return entries
    .filter((entry) => !type || entry.type === type)
    .reduce((total, entry) => total + entry.amount, 0);
}

function entriesForDate(dateKey) {
  return state.entries
    .filter((entry) => entry.date === dateKey)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function render() {
  document.querySelector("#app").innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div>
          <span class="eyebrow">Financeiro</span>
          <h1>Dashboard de lancamentos</h1>
        </div>
        <button class="primary-action" data-open-today>+ Lancar hoje</button>
      </header>

      ${renderDashboard()}

      <section class="calendar-panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Calendario</span>
            <h2>${MONTHS[state.currentDate.getMonth()]} ${state.currentDate.getFullYear()}</h2>
          </div>
          <div class="month-actions">
            <button class="icon-button" data-prev-month aria-label="Mes anterior">‹</button>
            <button class="ghost-button" data-current-month>Mes atual</button>
            <button class="icon-button" data-next-month aria-label="Proximo mes">›</button>
          </div>
        </div>
        ${renderCalendar()}
      </section>

      <section class="list-panel">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Ultimos registros</span>
            <h2>Lancamentos do mes</h2>
          </div>
        </div>
        ${renderEntryList(monthEntries())}
      </section>
    </main>
    ${state.selectedDate ? renderModal(state.selectedDate) : ""}
  `;

  bindEvents();
}

function renderDashboard() {
  const entries = monthEntries();
  const income = sumEntries(entries, "entrada");
  const expense = sumEntries(entries, "saida");
  const balance = income - expense;
  const todayTotal = sumEntries(entriesForDate(toDateKey(new Date())));

  return `
    <section class="dashboard-grid">
      <article class="metric-card balance">
        <span>Saldo do mes</span>
        <strong>${BRL.format(balance)}</strong>
      </article>
      <article class="metric-card income">
        <span>Entradas</span>
        <strong>${BRL.format(income)}</strong>
      </article>
      <article class="metric-card expense">
        <span>Saidas</span>
        <strong>${BRL.format(expense)}</strong>
      </article>
      <article class="metric-card">
        <span>Hoje</span>
        <strong>${BRL.format(todayTotal)}</strong>
      </article>
    </section>
  `;
}

function renderCalendar() {
  const year = state.currentDate.getFullYear();
  const month = state.currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  for (let i = 0; i < firstDay.getDay(); i += 1) {
    days.push(`<div class="day-cell muted"></div>`);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const dateKey = toDateKey(date);
    const dailyEntries = entriesForDate(dateKey);
    const dailyTotal = sumEntries(dailyEntries);
    const isToday = dateKey === toDateKey(new Date());

    days.push(`
      <button class="day-cell ${isToday ? "today" : ""}" data-open-date="${dateKey}">
        <span class="day-number">${day}</span>
        <span class="day-total">${dailyEntries.length ? BRL.format(dailyTotal) : ""}</span>
        <span class="day-count">${dailyEntries.length ? `${dailyEntries.length} lanc.` : ""}</span>
      </button>
    `);
  }

  return `
    <div class="calendar-weekdays">
      ${WEEKDAYS.map((day) => `<span>${day}</span>`).join("")}
    </div>
    <div class="calendar-grid">${days.join("")}</div>
  `;
}

function renderEntryList(entries) {
  if (!entries.length) {
    return `<div class="empty-state">Nenhum lancamento neste mes. Clique em um dia do calendario para comecar.</div>`;
  }

  return `
    <div class="entry-list">
      ${entries
        .slice()
        .reverse()
        .map(
          (entry) => `
            <div class="entry-row">
              <div>
                <strong>${entry.description}</strong>
                <span>${formatDate(entry.date)} · ${entry.method}</span>
              </div>
              <span class="${entry.type === "entrada" ? "positive" : "negative"}">
                ${entry.type === "entrada" ? "+" : "-"} ${BRL.format(entry.amount)}
              </span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderModal(dateKey) {
  const entries = entriesForDate(dateKey);

  return `
    <div class="modal-backdrop" data-close-modal>
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-header">
          <div>
            <span class="eyebrow">Novo lancamento</span>
            <h2 id="modal-title">${formatDate(dateKey)}</h2>
          </div>
          <button class="icon-button" data-close-modal aria-label="Fechar">×</button>
        </div>

        <form class="entry-form" data-entry-form>
          <input type="hidden" name="date" value="${dateKey}" />
          <label>
            Descricao
            <input name="description" type="text" placeholder="Ex: Pix, dinheiro, pedido..." required />
          </label>
          <label>
            Valor
            <input name="amount" type="text" inputmode="decimal" placeholder="0,00" required />
          </label>
          <div class="form-grid">
            <label>
              Tipo
              <select name="type">
                <option value="entrada">Entrada</option>
                <option value="saida">Saida</option>
              </select>
            </label>
            <label>
              Forma
              <select name="method">
                <option>Dinheiro</option>
                <option>Pix</option>
                <option>Debito</option>
                <option>Credito</option>
                <option>Rede</option>
                <option>Stone</option>
                <option>Outro</option>
              </select>
            </label>
          </div>
          <button class="primary-action" type="submit">Salvar lancamento</button>
        </form>

        <div class="modal-list">
          <h3>Lancamentos do dia</h3>
          ${renderEntryList(entries)}
        </div>
      </section>
    </div>
  `;
}

function bindEvents() {
  document.querySelector("[data-prev-month]")?.addEventListener("click", () => {
    state.currentDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() - 1, 1);
    render();
  });

  document.querySelector("[data-next-month]")?.addEventListener("click", () => {
    state.currentDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 1);
    render();
  });

  document.querySelector("[data-current-month]")?.addEventListener("click", () => {
    state.currentDate = new Date();
    render();
  });

  document.querySelector("[data-open-today]")?.addEventListener("click", () => {
    state.selectedDate = toDateKey(new Date());
    render();
  });

  document.querySelectorAll("[data-open-date]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedDate = button.dataset.openDate;
      render();
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (event.target === element || element.matches(".icon-button")) {
        state.selectedDate = null;
        render();
      }
    });
  });

  document.querySelector("[data-entry-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const amount = parseMoney(formData.get("amount").toString());

    if (amount <= 0) {
      alert("Informe um valor maior que zero.");
      return;
    }

    state.entries.push({
      id: crypto.randomUUID(),
      date: formData.get("date"),
      description: formData.get("description").toString().trim(),
      amount,
      type: formData.get("type"),
      method: formData.get("method"),
      createdAt: new Date().toISOString(),
    });

    saveEntries();
    render();
  });
}

render();
