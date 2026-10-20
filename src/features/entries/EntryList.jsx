import {useState} from "react";
import {formatPaymentMethod} from "../../constants/entries.js";
import {AppIcon} from "../../components/icons/AppIcon.jsx";
import {formatDate} from "../../utils/date.js";
import {formatCurrency} from "../../utils/money.js";
export function EntryList({entries,onDeleteEntry}) {
 const [selectedEntry,setSelectedEntry]=useState(null);
 const [error,setError]=useState("");
 const close=()=>{setSelectedEntry(null);setError("");};
 function confirm(e){e.preventDefault();try{onDeleteEntry(selectedEntry.id);close();}catch(err){setError(err.message||"Não foi possível excluir.");}}
 if (!entries.length) return <div className="empty-state">Nenhum lançamento neste período. Clique em um dia para começar.</div>;
 return <div className="entry-list">
 {entries.slice().reverse().map(entry=><div className={`entry-row ${entry.type} ${entry.deletedAt?"deleted":""}`} key={entry.id}>
 <div className="entry-main"><span className="entry-type-icon"><AppIcon name={entry.type==="entrada"?"income":"expense"}/></span>
 <div className="entry-copy"><strong>{entry.description||formatPaymentMethod(entry.method)}</strong><span>{formatDate(entry.date)} - {formatPaymentMethod(entry.method)}</span></div></div>
 <div className="entry-actions"><span className={`entry-value ${entry.type==="entrada"?"positive":"negative"}`}>{entry.type==="entrada"?"+":"-"} {formatCurrency(entry.amount)}</span>
 {!entry.deletedAt?<button className="entry-delete-button" aria-label={`Excluir lançamento ${entry.description||entry.method}`} title="Excluir lançamento" onClick={()=>setSelectedEntry(entry)} type="button"><AppIcon name="trash"/></button>:null}</div></div>)}
 {selectedEntry?<div className="confirmation-backdrop" onClick={close}><section className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title" onClick={e=>e.stopPropagation()}>
 <span className="eyebrow">Confirmação</span><h2 id="delete-title">Excluir lançamento?</h2>
 <p>O registro <strong>{selectedEntry.description||selectedEntry.method}</strong> ficará visível, marcado como excluído e fora dos totais.</p>
 <p>Controle de acesso por usuário ainda depende de um servidor. Esta confirmação não é uma autorização de segurança.</p>
 <form className="confirmation-form" onSubmit={confirm}>{error?<span className="confirmation-error" role="alert">{error}</span>:null}
 <div className="confirmation-actions"><button className="ghost-button" type="button" onClick={close}>Cancelar</button><button className="danger-button" type="submit">Confirmar exclusão</button></div></form></section></div>:null}
 </div>;
}
