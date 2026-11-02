import { useState } from "react";
import { SelectField } from "../../components/ui/SelectField.jsx";
import { formatDate } from "../../utils/date.js";
import { formatCurrency } from "../../utils/money.js";
import { getWeeklyIncome } from "./weeklyIncome.js";
import { WeeklyIncomeLines } from "./WeeklyIncomeLines.jsx";
import { AppIcon } from "../../components/icons/AppIcon.jsx";
import { getComparisonPeriods } from "./comparisonPeriods.js";

const options = Array.from({ length: 13 }, (_, i) => ({ value: String(i), label: i === 0 ? "Somente semana atual" : `${i} semana${i > 1 ? "s" : ""} anterior${i > 1 ? "es" : ""}` }));
const series = [{ key: "income", label: "Entradas", color: "#129269" }, { key: "expense", label: "Saídas", color: "#d4524d" }];
const compactCurrency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 });
const period = (week) => week.label ?? `${formatDate(week.start).slice(0, 5)} até ${formatDate(week.end).slice(0, 5)}`;

export function WeeklyIncomeChart({ entries }) {
  const [previousWeeks, setPreviousWeeks] = useState("1");
  const [showValues, setShowValues] = useState(false);
  const [activeTab, setActiveTab] = useState("columns");
  const [comparison, setComparison] = useState("week");
  const [monthComparison, setMonthComparison] = useState("previous");
  const [previousYears, setPreviousYears] = useState("1");
  const [baseMonth, setBaseMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const today = new Date();
  const firstYear = entries.reduce((year, entry) => Math.min(year, Number(entry.date.slice(0, 4))), today.getFullYear());
  const monthOptions = Array.from({ length: (today.getFullYear() - firstYear) * 12 + today.getMonth() + 1 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
    return { value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`, label: date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) };
  });
  const incomes = getWeeklyIncome(entries, Number(previousWeeks), today);
  const expenses = getWeeklyIncome(entries, Number(previousWeeks), today, "saida");
  const weeks = comparison === "week" ? incomes.map((week, index) => ({ income: week.total, expense: expenses[index].total,
    start: week.days[0].date, end: week.days[6].date, current: index === 0,
  })) : getComparisonPeriods(entries, comparison, monthComparison, today, baseMonth, Number(previousYears));
  const maximum = Math.max(1, ...weeks.flatMap((week) => [week.income, week.expense]));
  const magnitude = 10 ** Math.floor(Math.log10(maximum));
  const top = Math.ceil(maximum / magnitude) * magnitude;
  const width = Math.max(800, 110 + weeks.length * 210);
  const groupWidth = (width - 110) / weeks.length;
  const center = (index) => 100 + (index + 0.5) * groupWidth;
  const x = (index, type) => center(index) + (type === 0 ? -42 : 42);
  const y = (amount) => 290 - amount / top * 235;
  const tooltip = (week, item) => `${formatDate(week.start)} até ${formatDate(week.end)} · ${item.label}: ${formatCurrency(week[item.key])} · Saldo: ${formatCurrency(week.income - week.expense)}`;

  return <section className="weekly-chart" aria-labelledby="weekly-chart-title">
    <div className="panel-header">
      <div><span className="eyebrow">Resultado</span><h2 id="weekly-chart-title">{activeTab === "columns" ? "Entradas e saídas" : "Entradas por dia"}</h2><p className="page-subtitle">{activeTab === "lines" || comparison === "week" ? "Comparativo semanal · Segunda a domingo" : comparison === "month" ? "Comparativo mensal" : "Comparativo anual"}</p></div>
      <div className="weekly-chart-controls">
        {activeTab === "lines" || comparison === "week" ? <SelectField label="Comparar com" options={options} value={previousWeeks} onChange={setPreviousWeeks} /> : null}
        <label className="weekly-chart-toggle"><input type="checkbox" checked={showValues} onChange={(event) => setShowValues(event.target.checked)} />Mostrar valores</label>
      </div>
    </div>
    <div className="result-chart-tabs" role="tablist" aria-label="Modelo do gráfico">
      {[{ id: "columns", label: "Colunas · Entradas e saídas" }, { id: "lines", label: "Linhas · Entradas" }].map((tab) => <button key={tab.id} id={`chart-tab-${tab.id}`} type="button" role="tab" aria-selected={activeTab === tab.id} aria-controls={`chart-panel-${tab.id}`} tabIndex={activeTab === tab.id ? 0 : -1} onClick={() => setActiveTab(tab.id)} onKeyDown={(event) => {
        if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const next = event.key === "Home" ? "columns" : event.key === "End" ? "lines" : activeTab === "columns" ? "lines" : "columns";
          setActiveTab(next);
          document.getElementById(`chart-tab-${next}`)?.focus();
        }
      }}><AppIcon name={tab.id} /><span>{tab.label}</span></button>)}
    </div>
    <div id="chart-panel-columns" role="tabpanel" aria-labelledby="chart-tab-columns" hidden={activeTab !== "columns"}>
    <div className="weekly-chart-controls column-comparison-filters">
      <SelectField label="Comparação" options={[{ value: "week", label: "Semana" }, { value: "month", label: "Mês" }, { value: "year", label: "Ano" }]} value={comparison} onChange={setComparison} />
      {comparison === "month" && <>
        <SelectField label="Mês base" options={monthOptions} value={baseMonth} onChange={setBaseMonth} />
        <SelectField label="Comparar mês base com" options={[{ value: "previous", label: "Mês anterior" }, { value: "lastYear", label: "Mesmo mês do ano anterior" }]} value={monthComparison} onChange={setMonthComparison} />
      </>}
      {comparison === "year" && <SelectField label="Comparar ano atual com" options={Array.from({ length: 13 }, (_, i) => ({ value: String(i), label: i === 0 ? "Somente ano atual" : `${i} ano${i > 1 ? "s" : ""} anterior${i > 1 ? "es" : ""}` }))} value={previousYears} onChange={setPreviousYears} />}
    </div>
    <p className="page-subtitle">Totais dos períodos completos, incluindo lançamentos em datas futuras. O período atual pode estar parcialmente preenchido.</p>
    <ul className="weekly-chart-legend">{series.map((item) => <li key={item.key}><span className="weekly-chart-swatch" style={{ background: item.color }} /><span>{item.label}</span></li>)}</ul>
    {!weeks.some((week) => week.income || week.expense) && <p className="weekly-chart-empty">Nenhum lançamento registrado nos períodos selecionados.</p>}
    <div className="weekly-chart-scroll" tabIndex="0" role="region" aria-label="Gráfico de totais por período com rolagem horizontal">
      <svg className="weekly-chart-svg" style={{ minWidth: width }} viewBox={`0 0 ${width} 355`} role="img" aria-label="Entradas e saídas totais por período, começando pelo período atual. Valores detalhados na tabela abaixo.">
        {Array.from({ length: 5 }, (_, i) => {
          const amount = top * i / 4;
          return <g key={i}><line x1="90" x2={width - 10} y1={y(amount)} y2={y(amount)} stroke="#e5ecee" strokeDasharray="4 4" /><text x="80" y={y(amount) + 4} textAnchor="end">{compactCurrency.format(amount)}</text></g>;
        })}
        {weeks.map((week, index) => <g key={week.start}>
          <text x={center(index)} y="317" textAnchor="middle">{period(week)}</text>
          <text x={center(index)} y="338" textAnchor="middle">{week.current ? comparison === "week" ? "Semana atual" : comparison === "month" ? "Mês base" : "Ano atual" : `${week.start.slice(0, 4)}${week.start.slice(0, 4) !== week.end.slice(0, 4) ? ` / ${week.end.slice(0, 4)}` : ""}`}</text>
          {series.map((item, type) => <rect key={item.key} x={x(index, type) - 23} y={y(week[item.key])} width="46" height={290 - y(week[item.key])} rx="4" fill={item.color} fillOpacity=".65"><title>{tooltip(week, item)}</title></rect>)}
        </g>)}
        {series.map((item, type) => <g key={item.key}>
          <polyline points={weeks.map((week, index) => `${x(index, type)},${y(week[item.key])}`).join(" ")} fill="none" stroke={item.color} strokeWidth="2.5" strokeDasharray={type === 1 ? "6 4" : undefined} strokeLinejoin="round" />
          {weeks.map((week, index) => <circle key={week.start} cx={x(index, type)} cy={y(week[item.key])} r="4" fill={item.color} stroke="white" strokeWidth="1.5"><title>{tooltip(week, item)}</title></circle>)}
        </g>)}
        {showValues && weeks.flatMap((week, index) => series.map((item, type) => <text key={`${week.start}-${item.key}`} className="weekly-chart-value" x={x(index, type)} y={y(week[item.key]) - 12} textAnchor="middle" style={{ fill: item.color }}>{formatCurrency(week[item.key])}</text>))}
      </svg>
    </div>
    <details className="weekly-chart-details"><summary>Ver totais por período</summary><div className="weekly-chart-scroll"><table><caption>Entradas, saídas e saldo por período</caption><thead><tr><th scope="col">Período</th><th scope="col">Entradas</th><th scope="col">Saídas</th><th scope="col">Saldo</th></tr></thead><tbody>{weeks.map((week) => <tr key={week.start}><th scope="row">{formatDate(week.start)} até {formatDate(week.end)}</th><td>{formatCurrency(week.income)}</td><td>{formatCurrency(week.expense)}</td><td>{formatCurrency(week.income - week.expense)}</td></tr>)}</tbody></table></div></details>
    </div>
    <div id="chart-panel-lines" role="tabpanel" aria-labelledby="chart-tab-lines" hidden={activeTab !== "lines"}>
      <WeeklyIncomeLines weeks={incomes} showValues={showValues} />
    </div>
  </section>;
}
