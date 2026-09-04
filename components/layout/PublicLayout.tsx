import { Header } from "./Header";
import { Footer } from "./Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="ct-public-shell min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="ct-public-main flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
