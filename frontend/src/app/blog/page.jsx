import { notFound } from "next/navigation";
import BlogPage from "./BlogPageClient";

export async function generateMetadata() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/blog/getall`);

  if (!res.ok) {
    return { title: "Blog Not Found" };
  }

  const blogData = await res.json();

  // Check if blog data exists
  if (!blogData.blogData) {
    notFound(); // Redirect if no blog data
  }

  const blog = blogData.blogData;

  return {
    title: blog.metaTitle || "Default Title",
    description: blog.metaDescriptioin || "Default Description",
    keywords: blog.metaKeywords || "default, keywords",
  };
}

export default async function blogWrapper() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/blog/getall`);

  if (!res.ok) {
    notFound(); // Redirect to the Not Found page if the fetch fails
  }

  const blogData = await res.json();

  // Check if blog data exists
  if (!blogData.blogData) {
    notFound(); // Redirect if no blog data
  }

  const blog = blogData.blogData;

  let schemaData = "";

  if (blog.metaSchema) {
    try {
      schemaData =
        typeof blog.metaSchema === "string"
          ? blog.metaSchema
          : JSON.stringify(blog.metaSchema, null, 2); // Pretty-print JSON
    } catch (error) {
      console.error("Error parsing metaSchema:", error);
    }
  }

  return (
    <>
      <BlogPage />
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaData }}
        />
      )}
    </>
  );
}
