import { notFound } from 'next/navigation';
import Privacy from './privacyClient';

export async function generateMetadata() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/legal-documents/getall`);

  if (!res.ok) {
    return { title: "Privacy Not Found" };
  }

  const privacyData = await res.json();

  // Check if privacy data exists
  if (!privacyData.privacy || privacyData.privacy.length === 0) {
    notFound();  // Redirect to the Not Found page
  }

  const privacy = privacyData.privacy[0];

  return {
    title: privacy.metaTitle || "Default Title",
    description: privacy.metaDescriptioin || "Default Description",
    keywords: privacy.metaKeywords || "default, keywords",
  };
}

export default async function PrivacyWrapper() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/legal-documents/getall`);

  if (!res.ok) {
    notFound();  // Redirect to the Not Found page if the fetch fails
  }

  const privacyData = await res.json();

  // Check if privacy data exists
  if (!privacyData.privacy || privacyData.privacy.length === 0) {
    notFound();  // Redirect to the Not Found page if privacy is missing
  }

  const privacy = privacyData.privacy[0];
  let schemaData = "";

  if (privacy.metaSchema) {
    try {
      schemaData = typeof privacy.metaSchema === "string"
        ? privacy.metaSchema
        : JSON.stringify(privacy.metaSchema, null, 2);  // Pretty-print JSON
    } catch (error) {
      console.error("Error parsing metaSchema:", error);
    }
  }

  return (
    <>
      <Privacy />
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaData }}
        />
      )}
    </>
  );
}
