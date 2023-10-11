import { Header } from "./Header";
import { Vault } from "./Vault";

export default function Home() {
  return (
    <div className="max-h-screen overflow-auto">
      <Header />
      <main className="flex flex-col items-center justify-between p-12 max-w-screen-8xl mx-auto">
        <Vault />
      </main>
    </div>
  );
}
