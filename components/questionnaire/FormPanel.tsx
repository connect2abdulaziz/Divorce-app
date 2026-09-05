export function FormPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line/80 bg-white shadow-[0_1px_2px_rgba(33,35,31,0.04),0_16px_40px_rgba(33,35,31,0.06)]">
      {children}
    </div>
  );
}
