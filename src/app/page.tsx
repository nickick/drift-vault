import { Header } from "./Header";
import { Vault } from "./Vault";

export default function Home() {
  return (
    <div className="max-h-screen overflow-auto">
      <Header />
      <main className="flex flex-col items-center justify-between px-12 max-w-screen-xl mx-auto">
        <Vault />
      </main>
    </div>
  );
}
