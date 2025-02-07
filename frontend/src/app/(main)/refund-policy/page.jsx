import { notFound } from 'next/navigation';
import Refund from './refundClient';

export async function generateMetadata() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/legal-documents/getall`);

  if (!res.ok) {
    return { title: "Refund Not Found" };
  }

  const refundData = await res.json();

  // Check if privacy data exists
  if (!refundData.refund || refundData.refund.length === 0) {
    notFound();  // Redirect to the Not Found page
  }

  const refund = refundData.refund[0];

  let openGraph = {};
  if (refund.metaSchema) {
    try {
      openGraph = typeof refund.metaSchema === 'string' ? JSON.parse(refund.metaSchema) : refund.metaSchema;
    } catch (error) {
      console.error("Error parsing metaSchema:", error);
      openGraph = {}; // Fallback to an empty object if parsing fails
    }
  }

  return {
    title: refund.metaTitle || "Default Title",
    description: refund.metaDescriptioin || "Default Description",
    keywords: refund.metaKeywords || "default, keywords",
    openGraph: openGraph,
  };
}

export default async function RefundWrapper() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/legal-documents/getall`);

  if (!res.ok) {
    notFound();  // Redirect to the Not Found page if the fetch fails
  }

  const refundData = await res.json();

  // Check if terms data exists
  if (!refundData.refund || refundData.refund.length === 0) {
    notFound();  // Redirect to the Not Found page if refund are missing
  }

  return <Refund />;
}
