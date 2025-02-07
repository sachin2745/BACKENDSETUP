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

  let openGraph = {};
  if (privacy.metaSchema) {
    try {
      openGraph = typeof privacy.metaSchema === 'string' ? JSON.parse(privacy.metaSchema) : privacy.metaSchema;
    } catch (error) {
      console.error("Error parsing metaSchema:", error);
      openGraph = {}; // Fallback to an empty object if parsing fails
    }
  }

  return {
    title: privacy.metaTitle || "Default Title",
    description: privacy.metaDescriptioin || "Default Description",
    keywords: privacy.metaKeywords || "default, keywords",
    openGraph: openGraph,
  };
}

export default async function PrivacyWrapper() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/legal-documents/getall`);

  if (!res.ok) {
    notFound();  // Redirect to the Not Found page if the fetch fails
  }

  const privacyData = await res.json();

  // Check if terms data exists
  if (!privacyData.privacy || privacyData.privacy.length === 0) {
    notFound();  // Redirect to the Not Found page if privacy are missing
  }

  return <Privacy />;
}
