import AdminLayout from "./Layout/adminLayout";

export const metadata = {
    title: "Admin Dashboard",
    description: "Manage your application settings and user data.",
  };
  
const DashboardPage = () => {
  return (
    <AdminLayout>
      <div className="flex text-center justify-center items-center h-screen">
        <h1 className="text-3xl font-bold">ADMIN DASHBOARD</h1>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
