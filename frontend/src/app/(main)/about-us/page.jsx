import About from "./aboutClient";

export async function generateMetadata() {
  return {
    title: "About Page",
    description: "We are passionate about creating modern and user-friendly web applications.",
    keywords: "web development, user-friendly, modern applications",
    openGraph: {
      title: "About Page",
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

export default function AboutWrapper() {
  return <About />;
}
