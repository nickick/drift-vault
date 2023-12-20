import { Header } from "./Header/DesktopHeader";
import { MobileHeader } from "./Header/MobileHeader";
import { Vaulted } from "./Vault";

export default function Home() {
  return (
    <div className="max-h-screen min-h-screen h-full overflow-auto flex flex-col justify-between">
      <div>
        <div className="hidden sm:block">
          <Header />
        </div>
        <div className="sm:hidden relative z-30">
          <MobileHeader />
        </div>
        <main className="flex flex-col items-center justify-between px-1 sm:px-12 max-w-between-lg-xl mx-auto">
          <Vaulted />
        </main>
      </div>
      <footer className="max-w-between-lg-xl mx-auto px-12 pb-6 text-slate-gray w-full">
        <div>All materials © {new Date().getFullYear()} Isaac Wright</div>
        <div></div>
      </footer>
    </div>
  );
}
