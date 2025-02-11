import { notFound } from "next/navigation";
import HomePage from "./homeClient";

export async function generateMetadata() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/home/getall`);

  if (!res.ok) {
    return { title: "Privacy Not Found" };
  }

  const homeData = await res.json();

  if (!homeData.home || homeData.home.length === 0) {
    notFound();
  }

  const home = homeData.home[0];

  return {
    title: home.metaTitle || "Default Title",
    description: home.metaDescriptioin || "Default Description",
    keywords: home.metaKeywords || "default, keywords",
  };
}

export default async function homeWrapper() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/home/getall`);

  if (!res.ok) {
    notFound();
  }

  const homeData = await res.json();

  if (!homeData.home || homeData.home.length === 0) {
    notFound();
  }

  const home = homeData.home[0];
  let schemaData = "";

  if (home.metaSchema) {
    try {
      schemaData = typeof home.metaSchema === "string" 
        ? home.metaSchema 
        : JSON.stringify(home.metaSchema, null, 2);  // Pretty-print JSON
    } catch (error) {
      console.error("Error parsing metaSchema:", error);
    }
  }

  return (
    <>
      <HomePage />
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaData }}
        />
      )}
    </>
  );
}
