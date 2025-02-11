import { notFound } from "next/navigation";
import About from "./aboutClient";

export async function generateMetadata() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/about/getall`);

  if (!res.ok) {
    return { title: "about Not Found" };
  }

  const aboutData = await res.json();

  // Check if about data exists
  if (!aboutData.aboutData) {
    notFound(); // Redirect if no about data
  }

  const about = aboutData.aboutData;

  return {
    title: about.metaTitle || "Default Title",
    description: about.metaDescriptioin || "Default Description",
    keywords: about.metaKeywords || "default, keywords",
  };
}

export default async function aboutWrapper() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/about/getall`);

  if (!res.ok) {
    notFound(); // Redirect to the Not Found page if the fetch fails
  }

  const aboutData = await res.json();

  // Check if about data exists
  if (!aboutData.aboutData) {
    notFound(); // Redirect if no about data
  }

  const about = aboutData.aboutData;

  let schemaData = "";

  if (about.metaSchema) {
    try {
      schemaData =
        typeof about.metaSchema === "string"
          ? about.metaSchema
          : JSON.stringify(about.metaSchema, null, 2); // Pretty-print JSON
    } catch (error) {
      console.error("Error parsing metaSchema:", error);
    }
  }

  return (
    <>
      <About />
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaData }}
        />
      )}
    </>
  );
}
