"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search templates...",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <span aria-hidden="true" className="pointer-events-none text-slate-400" style={{ alignItems: "center", display: "flex", left: "1rem", position: "absolute", top: "50%", transform: "translateY(-50%)" }}>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3m1.3-5.2a6.5 6.5 0 11-13 0a6.5 6.5 0 0113 0z" />
        </svg>
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 bg-white py-3 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        style={{ paddingLeft: "3rem" }}
      />
    </div>
  );
}
