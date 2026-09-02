const paths = {
  dashboard: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z",
  entries: "M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm3 4v2h8V8H8Zm0 4v2h8v-2H8Zm0 4v2h5v-2H8Z",
  chevron: "m15 18-6-6 6-6",
  wallet: "M4 5h15a1 1 0 0 1 1 1v2h-5a4 4 0 0 0 0 8h5v2a1 1 0 0 1-1 1H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm11 5h7v4h-7a2 2 0 1 1 0-4Zm0 1.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Z",
  income: "M12 3a1 1 0 0 1 1 1v12.6l3.3-3.3 1.4 1.4-5 5a1 1 0 0 1-1.4 0l-5-5 1.4-1.4 3.3 3.3V4a1 1 0 0 1 1-1Z",
  expense: "M12 21a1 1 0 0 1-1-1V7.4L7.7 10.7 6.3 9.3l5-5a1 1 0 0 1 1.4 0l5 5-1.4 1.4L13 7.4V20a1 1 0 0 1-1 1Z",
  calendar: "M6 2h2v2h8V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2Zm14 8H4v8h16v-8ZM4 8h16V6H4v2Z",
  finance: "M12 2 3 6v2h18V6l-9-4ZM5 10v7H3v3h18v-3h-2v-7h-2v7h-3v-7h-2v7H9v-7H7v7H5v-7Z",
  trash: "M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-.7 12H7.7L7 9Zm3 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z",
};

export function AppIcon({ name }) {
  const isChevron = name === "chevron";

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} fill={isChevron ? "none" : "currentColor"} stroke={isChevron ? "currentColor" : "none"} />
    </svg>
  );
}
