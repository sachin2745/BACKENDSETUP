import Link from "next/link";
import EnquiryForm from "./(components)/EnquiryForm";

export default function HomePage() {
  return (
    <>
      <EnquiryForm />
      <div className="flex items-center justify-center min-h-screen">
        <div className="mx-auto p-24 text-center border-2  bgEmerald text-white rounded-lg">
          <h1 className="text-3xl font-bold">Welcome to My Dashboard</h1>
          <p className="mt-2 font-semibold">
            Click below to explore:
            <br />
            <Link href="/admin/dashboard">
              <span className="text-white font-medium">Admin Dashboard</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
