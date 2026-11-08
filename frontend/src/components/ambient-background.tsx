export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,138,131,0.10),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(18,40,63,0.08),transparent_30%),linear-gradient(180deg,#f7fafc_0%,#eef5f4_100%)]" />
      <div className="ambient-grid absolute inset-0 opacity-70" />
      <div className="ambient-orb left-[-12%] top-[-18%] h-[34rem] w-[34rem] bg-teal/20" />
      <div className="ambient-orb ambient-orb-delay right-[-14%] top-[8%] h-[30rem] w-[30rem] bg-[#9bc7c2]/25" />
      <div className="ambient-orb ambient-orb-slow bottom-[-22%] left-[24%] h-[36rem] w-[36rem] bg-[#d8e7ee]/35" />
    </div>
  );
}
