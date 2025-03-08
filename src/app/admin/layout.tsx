// filepath: c:\Users\hooma\Desktop\projects\print-on-demand\src\app\admin\layout.tsx
import AdminNav from '../components/header/AdminNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">{children}</div>
    </div>
  );
}