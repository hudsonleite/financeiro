export function IconButton({ label, children, onClick }) {
  return (
    <button className="icon-button" onClick={onClick} aria-label={label}>
      {children}
    </button>
  );
}
