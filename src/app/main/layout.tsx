import Navbar from "../components/header/Navbar";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="main-content">{children}</div>
    </div>
  );
}