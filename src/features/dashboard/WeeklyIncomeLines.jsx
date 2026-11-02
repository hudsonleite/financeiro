import { formatDate } from "../../utils/date.js";
import { formatCurrency } from "../../utils/money.js";

const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const colors = ["#129269", "#3978d4", "#ad64cb", "#d78326", "#dc6377", "#278b9b", "#7770bd", "#8b7837", "#a95535", "#57697d", "#8c5890", "#66882d", "#b34b64"];
const weekName = (index) => index === 0 ? "Semana atual" : index === 1 ? "Semana anterior" : `${index} semanas atrás`;
const compactCurrency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 });

export function WeeklyIncomeLines({ weeks, showValues }) {
  const maximum = Math.max(1, ...weeks.flatMap((week) => week.days.map((day) => day.amount)));
  const magnitude = 10 ** Math.floor(Math.log10(maximum));
  const top = Math.ceil(maximum / magnitude) * magnitude;
  const x = (day) => 120 + day * 120;
  const y = (amount) => 290 - amount / top * 235;
  const labels = weekdays.flatMap((_, dayIndex) => {
    let previousY = 0;
    return weeks.map((week, index) => ({ index, day: week.days[dayIndex] }))
      .sort((a, b) => y(a.day.amount) - y(b.day.amount))
      .map(({ index, day }, position) => {
        const labelY = Math.min(275 - (weeks.length - 1 - position) * 18, Math.max(previousY + 18, y(day.amount) - 12));
        previousY = labelY;
        return { index, day, dayIndex, labelY };
      });
  });
  return <>
    <p className="page-subtitle">Uma linha por semana, comparando as entradas de cada dia. Inclui lançamentos em datas futuras.</p>
    {!weeks.some((week) => week.total > 0) && <p className="weekly-chart-empty">Nenhuma entrada registrada nas semanas selecionadas.</p>}
    <div className="weekly-chart-scroll" tabIndex="0" role="region" aria-label="Gráfico de linhas de entradas com rolagem horizontal">
      <svg className="weekly-chart-svg" style={{ minWidth: 940 }} viewBox="0 0 940 340" role="img" aria-label="Entradas de segunda a domingo, uma linha por semana. Valores disponíveis na tabela abaixo.">
        {Array.from({ length: 5 }, (_, i) => {
          const amount = top * i / 4;
          return <g key={i}><line x1="100" x2="860" y1={y(amount)} y2={y(amount)} stroke="#e5ecee" strokeDasharray="4 4" /><text x="88" y={y(amount) + 4} textAnchor="end">{compactCurrency.format(amount)}</text></g>;
        })}
        {weekdays.map((day, i) => <text key={day} x={x(i)} y="320" textAnchor="middle">{day}</text>)}
        {[...weeks.keys()].reverse().map((index) => <g key={index}>
          <polyline points={weeks[index].days.map((day, i) => `${x(i)},${y(day.amount)}`).join(" ")} fill="none" stroke={colors[index]} strokeWidth={index === 0 ? 3 : 2} strokeDasharray={index === 0 ? undefined : `${6 + index * 2} 4`} strokeLinejoin="round" />
          {weeks[index].days.map((day, i) => <circle key={day.date} cx={x(i)} cy={y(day.amount)} r={index === 0 ? 5 : 3.5} fill={colors[index]} stroke="white" strokeWidth="1.5"><title>{weekName(index)} · {formatDate(day.date)}: {formatCurrency(day.amount)}</title></circle>)}
        </g>)}
        {showValues && labels.map(({ index, day, dayIndex, labelY }) => <g key={day.date}>
          {Math.abs(labelY - y(day.amount)) > 20 && <line x1={x(dayIndex)} y1={y(day.amount)} x2={x(dayIndex)} y2={labelY + 4} stroke={colors[index]} strokeOpacity=".4" />}
          <text className="weekly-chart-value" x={x(dayIndex)} y={labelY} textAnchor="middle" style={{ fill: colors[index] }}>{formatCurrency(day.amount)}</text>
        </g>)}
      </svg>
    </div>
    <ul className="weekly-chart-legend">{weeks.map((week, index) => <li key={week.days[0].date}><span className="weekly-chart-swatch" style={{ background: colors[index] }} /><div><span>{weekName(index)}</span><small>{formatDate(week.days[0].date)} até {formatDate(week.days[6].date)}</small></div><strong>{formatCurrency(week.total)}</strong></li>)}</ul>
    <details className="weekly-chart-details"><summary>Ver entradas por dia</summary><div className="weekly-chart-scroll"><table><caption>Entradas diárias por semana</caption><thead><tr><th scope="col">Semana</th>{weekdays.map((day) => <th scope="col" key={day}>{day}</th>)}<th scope="col">Total</th></tr></thead><tbody>{weeks.map((week) => <tr key={week.days[0].date}><th scope="row">{formatDate(week.days[0].date)} até {formatDate(week.days[6].date)}</th>{week.days.map((day) => <td key={day.date}>{formatCurrency(day.amount)}</td>)}<td>{formatCurrency(week.total)}</td></tr>)}</tbody></table></div></details>
  </>;
}
