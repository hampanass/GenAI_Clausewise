export function LoginBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,138,131,0.10),transparent_34%),radial-gradient(circle_at_85%_15%,rgba(18,40,63,0.08),transparent_32%),linear-gradient(180deg,#f7fafc_0%,#eef5f4_100%)]" />
      <div className="login-dot-grid absolute inset-0 opacity-60" />
      <div className="login-blob left-[-12%] top-[-18%] h-[30rem] w-[30rem] bg-teal/20" />
      <div
        className="login-blob right-[-14%] top-[8%] h-[32rem] w-[32rem] bg-[#9bc7c2]/25"
        style={{ animationDelay: "-9s" }}
      />
      <div
        className="login-blob bottom-[-22%] left-[28%] h-[34rem] w-[34rem] bg-[#d8e7ee]/40"
        style={{ animationDelay: "-16s" }}
      />
    </div>
  );
}