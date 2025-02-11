import ViewBlog from "./ViewBlogClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/post/getbysku/${slug}`);
  if (!res.ok) return { title: "Blog Not Found" };

  const blogData = await res.json();

  let schemaScript = '';
  if (blogData.blogSchema) {
    try {
      const parsedSchema = typeof blogData.blogSchema === 'string' ? JSON.parse(blogData.blogSchema) : blogData.blogSchema;
      schemaScript = `<script type="application/ld+json">${JSON.stringify(parsedSchema)}</script>`;
    } catch (error) {
      console.error("Error parsing blogSchema:", error);
      schemaScript = ''; // Fallback to an empty script if parsing fails
    }
  }

  return {
    title: blogData.blogMetaTitle || "Blog Post",
    description: blogData.blogMetaDescription || "Read this blog post.",
    keywords: blogData.blogMetaKeywords || "Read this blog post.",
    other: {
      schemaScript
    }
  };
}

export default async function BlogDetailWrapper({ params }) {
  const { slug } = await params;

  return <ViewBlog slug={slug} />;
}
