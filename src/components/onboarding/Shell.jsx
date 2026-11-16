export default function Shell({ children }) {
  return (
    <main className="app-shell flex flex-col bg-surface md:border-x md:border-[#E5F5FF] md:shadow-[0_0_40px_rgba(9,31,64,0.08)]">
      {children}
    </main>
  );
}
