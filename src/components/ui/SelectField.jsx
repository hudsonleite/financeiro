import { useEffect, useId, useRef, useState } from "react";

export function SelectField({ label, name, options, value, onChange, defaultValue = options[0]?.value }) {
  const id = useId();
  const root = useRef(null);
  const trigger = useRef(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const selectedValue = value ?? internalValue;
  const selected = options.find((option) => option.value === selectedValue) ?? options[0];

  useEffect(() => {
    function close(event) {
      if (!root.current?.contains(event.target)) setOpen(false);
    }
    const form = root.current?.closest("form");
    function reset() { setInternalValue(defaultValue); setOpen(false); }
    document.addEventListener("pointerdown", close);
    form?.addEventListener("reset", reset);
    return () => {
      document.removeEventListener("pointerdown", close);
      form?.removeEventListener("reset", reset);
    };
  }, [defaultValue]);

  useEffect(() => {
    if (open) root.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function choose(option) {
    setInternalValue(option.value);
    onChange?.(option.value);
    setOpen(false);
    trigger.current?.focus();
  }

  function handleKeyDown(event) {
    if (event.key === "Tab") { setOpen(false); return; }
    if (event.key === "Escape" && open) {
      event.preventDefault(); event.stopPropagation(); setOpen(false); return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      if (!open) {
        setActive(Math.max(0, options.indexOf(selected)));
        setOpen(true);
      } else if (event.key === "Enter" || event.key === " ") choose(options[active]);
      else if (event.key === "Home") setActive(0);
      else if (event.key === "End") setActive(options.length - 1);
      else setActive((index) => (index + (event.key === "ArrowUp" ? -1 : 1) + options.length) % options.length);
    } else if (event.key.length === 1) {
      const index = options.findIndex((option) => option.label.toLocaleLowerCase("pt-BR").startsWith(event.key.toLocaleLowerCase("pt-BR")));
      if (index >= 0) { event.preventDefault(); setActive(index); setOpen(true); }
    }
  }

  return (
    <div className="select-field" ref={root} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <label id={`${id}-label`} htmlFor={id} className="select-field-label">{label}</label>
      {name ? <input type="hidden" name={name} value={selectedValue} /> : null}
      <button id={id} ref={trigger} type="button" className="select-trigger" role="combobox"
        aria-labelledby={`${id}-label ${id}-value`} aria-expanded={open} aria-haspopup="listbox"
        aria-controls={open ? `${id}-options` : undefined}
        aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        onKeyDown={handleKeyDown} onClick={() => { setActive(Math.max(0, options.indexOf(selected))); setOpen(!open); }}>
        <span className={`select-marker ${selected.tone ?? "neutral"}`} aria-hidden="true" />
        <span id={`${id}-value`}>{selected.label}</span>
        <svg className="select-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
      </button>
      {open ? (
        <div className="select-options" id={`${id}-options`} role="listbox" aria-labelledby={`${id}-label`}>
          {options.map((option, index) => (
            <div key={option.value} id={`${id}-option-${index}`} className="select-option" role="option"
              aria-selected={option.value === selectedValue} data-active={index === active}
              onPointerMove={() => setActive(index)} onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(option)}>
              <span className={`select-marker ${option.tone ?? "neutral"}`} aria-hidden="true" />
              <span>{option.label}</span>
              {option.value === selectedValue ? <span className="select-check" aria-hidden="true">✓</span> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
