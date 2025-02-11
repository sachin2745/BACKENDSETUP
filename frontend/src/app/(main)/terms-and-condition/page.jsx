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

  let schema = '';
  if (terms.metaSchema) {
    schema = typeof terms.metaSchema === 'string' ? terms.metaSchema : JSON.stringify(terms.metaSchema);
  }

  return {
    title: terms.metaTitle || "Default Title",
    description: terms.metaDescriptioin || "Default Description",
    keywords: terms.metaKeywords || "default, keywords",
    other: {
      script: schema ? [{ type: "application/ld+json", innerHTML: schema }] : [],
    },
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
