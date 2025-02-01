import BlogPage from "./BlogPageClient";

export async function generateMetadata() {
  return {
    title: "Blog Portal",
    description: "We are passionate about creating modern and user-friendly web applications.",
    keywords: "web development, user-friendly, modern applications",
    openGraph: {
      title: "Blog Portal",
      description: "We are passionate about creating modern and user-friendly web applications.",
      type: "website",
      url: "https://www.blogportal.com",
      images: [
        {
          url: "https://www.blogportal.com/logo.png",
          width: 800,
          height: 600,
          alt: "Logo",
        },
      ],
    },
  };
}

export default function BlogWrapper() {
  return <BlogPage />;
}
