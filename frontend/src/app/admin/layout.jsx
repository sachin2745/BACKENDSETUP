import AdminLayout from "./Layout/adminLayout";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage your application settings and user data.",
};

export default function AdminLayoutWrapper({ children }) { 

  return <AdminLayout>{children}</AdminLayout>; // ✅ Apply Admin Layout for other admin pages
}
