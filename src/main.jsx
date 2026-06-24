import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

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

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
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

function sumEntries(entries, type = null) {
  return entries
    .filter((entry) => !type || entry.type === type)
    .reduce((total, entry) => total + entry.amount, 0);
}

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [entries, setEntries] = useState(loadEntries);

  const monthEntries = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return entries.filter((entry) => {
      const date = fromDateKey(entry.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  }, [currentDate, entries]);

  function entriesForDate(dateKey) {
    return entries
      .filter((entry) => entry.date === dateKey)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  function saveEntries(nextEntries) {
    setEntries(nextEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const amount = parseMoney(formData.get("amount").toString());

    if (amount <= 0) {
      alert("Informe um valor maior que zero.");
      return;
    }

    saveEntries([
      ...entries,
      {
        id: crypto.randomUUID(),
        date: formData.get("date"),
        description: formData.get("description").toString().trim(),
        amount,
        type: formData.get("type"),
        method: formData.get("method"),
        createdAt: new Date().toISOString(),
      },
    ]);

    event.currentTarget.reset();
  }

  function changeMonth(direction) {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Financeiro</span>
          <h1>Dashboard de lancamentos</h1>
        </div>
        <button className="primary-action" onClick={() => setSelectedDate(toDateKey(new Date()))}>
          + Lancar hoje
        </button>
      </header>

      <Dashboard entries={monthEntries} todayEntries={entriesForDate(toDateKey(new Date()))} />

      <section className="calendar-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Calendario</span>
            <h2>
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <div className="month-actions">
            <button className="icon-button" onClick={() => changeMonth(-1)} aria-label="Mes anterior">
              ‹
            </button>
            <button className="ghost-button" onClick={() => setCurrentDate(new Date())}>
              Mes atual
            </button>
            <button className="icon-button" onClick={() => changeMonth(1)} aria-label="Proximo mes">
              ›
            </button>
          </div>
        </div>

        <Calendar currentDate={currentDate} entriesForDate={entriesForDate} onSelectDate={setSelectedDate} />
      </section>

      <section className="list-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Ultimos registros</span>
            <h2>Lancamentos do mes</h2>
          </div>
        </div>
        <EntryList entries={monthEntries} />
      </section>

      {selectedDate ? (
        <EntryModal
          dateKey={selectedDate}
          entries={entriesForDate(selectedDate)}
          onClose={() => setSelectedDate(null)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </main>
  );
}

function Dashboard({ entries, todayEntries }) {
  const income = sumEntries(entries, "entrada");
  const expense = sumEntries(entries, "saida");
  const balance = income - expense;
  const todayTotal = sumEntries(todayEntries);

  return (
    <section className="dashboard-grid">
      <article className="metric-card balance">
        <span>Saldo do mes</span>
        <strong>{BRL.format(balance)}</strong>
      </article>
      <article className="metric-card income">
        <span>Entradas</span>
        <strong>{BRL.format(income)}</strong>
      </article>
      <article className="metric-card expense">
        <span>Saidas</span>
        <strong>{BRL.format(expense)}</strong>
      </article>
      <article className="metric-card">
        <span>Hoje</span>
        <strong>{BRL.format(todayTotal)}</strong>
      </article>
    </section>
  );
}

function Calendar({ currentDate, entriesForDate, onSelectDate }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  for (let i = 0; i < firstDay.getDay(); i += 1) {
    days.push(<div className="day-cell muted" key={`empty-${i}`} />);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const dateKey = toDateKey(date);
    const dailyEntries = entriesForDate(dateKey);
    const dailyTotal = sumEntries(dailyEntries);
    const isToday = dateKey === toDateKey(new Date());

    days.push(
      <button
        className={`day-cell ${isToday ? "today" : ""}`}
        key={dateKey}
        onClick={() => onSelectDate(dateKey)}
      >
        <span className="day-number">{day}</span>
        <span className="day-total">{dailyEntries.length ? BRL.format(dailyTotal) : ""}</span>
        <span className="day-count">{dailyEntries.length ? `${dailyEntries.length} lanc.` : ""}</span>
      </button>,
    );
  }

  return (
    <>
      <div className="calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">{days}</div>
    </>
  );
}

function EntryModal({ dateKey, entries, onClose, onSubmit }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">Novo lancamento</span>
            <h2 id="modal-title">{formatDate(dateKey)}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <form className="entry-form" onSubmit={onSubmit}>
          <input type="hidden" name="date" value={dateKey} />
          <label>
            Descricao
            <input name="description" type="text" placeholder="Ex: Pix, dinheiro, pedido..." required />
          </label>
          <label>
            Valor
            <input name="amount" type="text" inputMode="decimal" placeholder="0,00" required />
          </label>
          <div className="form-grid">
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
          <button className="primary-action" type="submit">
            Salvar lancamento
          </button>
        </form>

        <div className="modal-list">
          <h3>Lancamentos do dia</h3>
          <EntryList entries={entries} />
        </div>
      </section>
    </div>
  );
}

function EntryList({ entries }) {
  if (!entries.length) {
    return <div className="empty-state">Nenhum lancamento neste periodo. Clique em um dia para comecar.</div>;
  }

  return (
    <div className="entry-list">
      {entries
        .slice()
        .reverse()
        .map((entry) => (
          <div className="entry-row" key={entry.id}>
            <div>
              <strong>{entry.description}</strong>
              <span>
                {formatDate(entry.date)} · {entry.method}
              </span>
            </div>
            <span className={entry.type === "entrada" ? "positive" : "negative"}>
              {entry.type === "entrada" ? "+" : "-"} {BRL.format(entry.amount)}
            </span>
          </div>
        ))}
    </div>
  );
}

createRoot(document.querySelector("#app")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
