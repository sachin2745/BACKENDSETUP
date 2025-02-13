import Link from "next/link";
import EnquiryForm from "./(components)/EnquiryForm";

export function generateMetadata() {
  return {
    title: "Home Page",
    description:
      "We are passionate about creating modern and user-friendly web applications.",
    keywords: "web development, user-friendly, modern applications",
    openGraph: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Blog Portal",
      url: "https://www.blogportal.com",
      logo: "https://www.blogportal.com/logo.png",
      sameAs: [
        "https://www.facebook.com/blogportal",
        "https://www.twitter.com/blogportal",
        "https://www.linkedin.com/in/blogportal",
      ],
    },
  };
}

export default function HomePage() {
  return (
    <>
      <EnquiryForm />

      <div className="flex items-center justify-center min-h-screen">
        <div className="mx-auto p-24 text-center border-2 border-sky-500 bg-sky-500 text-white rounded-lg">
          <h1 className="text-3xl font-bold">Welcome to TailAdmin Dashboard</h1>
          <p className="mt-2">
            Click below to explore:
            <br />
            {""}
            <Link
              href="http://localhost:3000/admin/dashboard"
              className="text-white font-bold "
            >
              Admin Dashboard
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
