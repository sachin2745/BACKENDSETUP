import { notFound } from 'next/navigation';
import TermsAndCondition from "./termsClient";

export async function generateMetadata() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/legal-documents/getall`);

  if (!res.ok) {
    return { title: "Terms Not Found" };
  }

  const termsData = await res.json();

  // Check if terms data exists
  if (!termsData.terms || termsData.terms.length === 0) {
    notFound();  // Redirect to the Not Found page
  }

  const terms = termsData.terms[0];

  let openGraph = {};
  if (terms.metaSchema) {
    try {
      openGraph = typeof terms.metaSchema === 'string' ? JSON.parse(terms.metaSchema) : terms.metaSchema;
    } catch (error) {
      console.error("Error parsing metaSchema:", error);
      openGraph = {}; // Fallback to an empty object if parsing fails
    }
  }

  return {
    title: terms.metaTitle || "Default Title",
    description: terms.metaDescriptioin || "Default Description",
    keywords: terms.metaKeywords || "default, keywords",
    openGraph: openGraph,
  };
}

export default async function TermsAndConditionWrapper() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/legal-documents/getall`);

  if (!res.ok) {
    notFound();  // Redirect to the Not Found page if the fetch fails
  }

  const termsData = await res.json();

  // Check if terms data exists
  if (!termsData.terms || termsData.terms.length === 0) {
    notFound();  // Redirect to the Not Found page if terms are missing
  }

  return <TermsAndCondition />;
}
