import { notFound } from 'next/navigation';
import Refund from './refundClient';

export async function generateMetadata() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/legal-documents/getall`);

  if (!res.ok) {
    return { title: "Refund Not Found" };
  }

  const refundData = await res.json();

  if (!refundData.refund || refundData.refund.length === 0) {
    notFound();
  }

  const refund = refundData.refund[0];

  return {
    title: refund.metaTitle || "Default Title",
    description: refund.metaDescriptioin || "Default Description",
    keywords: refund.metaKeywords || "default, keywords",
  };
}

export default async function RefundWrapper() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/legal-documents/getall`);

  if (!res.ok) {
    notFound();
  }

  const refundData = await res.json();

  if (!refundData.refund || refundData.refund.length === 0) {
    notFound();
  }

  const refund = refundData.refund[0];

  return (
    <>
      <Refund />
      {refund.metaSchema && (
        <script type="application/ld+json">
          {typeof refund.metaSchema === 'string' ? refund.metaSchema : JSON.stringify(refund.metaSchema)}
        </script>
      )}
    </>
  );
}
