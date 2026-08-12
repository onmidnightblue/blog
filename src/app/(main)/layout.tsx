import PortfolioNav from "@components/layout/PortfolioNav";
import NavAuthFooter from "@components/layout/NavAuthFooter";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="portfolio-layout flex h-dvh min-h-0 overflow-hidden">
      <PortfolioNav footer={<NavAuthFooter />} />
      <main className="flex flex-1 flex-col min-h-0 min-w-0 md:ml-60 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
