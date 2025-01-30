import ViewBlog from "./ViewBlogClient";

export async function generateMetadata({ params }) {
  // Ensure params is awaited
  const { slug } = await params; // Await params to access slug

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/post/getbysku/${slug}`);
  if (!res.ok) return { title: "Blog Not Found" };

  const blogData = await res.json();

  // Log the blogData to inspect its structure
//   console.log("Fetched blog data:", blogData);

  // Check if blogSchema is defined and is an object
  let openGraph = {};
  if (blogData.blogSchema) {
    try {
      // If blogSchema is a string, parse it
      openGraph = typeof blogData.blogSchema === 'string' ? JSON.parse(blogData.blogSchema) : blogData.blogSchema;
    } catch (error) {
      console.error("Error parsing blogSchema:", error);
      openGraph = {}; // Fallback to an empty object if parsing fails
    }
  }

  // Log the openGraph object to inspect its structure
//   console.log("Open Graph data:", openGraph);

  return {
    title: blogData.blogMetaTitle || "Blog Post",
    description: blogData.blogMetaDescription || "Read this blog post.",
    keywords: blogData.blogMetaKeywords || "Read this blog post.",
    openGraph: openGraph,
  };
}

export default async function BlogDetailWrapper({ params }) {
    const { slug } = await params;
  
    return <ViewBlog slug={slug} />;
}