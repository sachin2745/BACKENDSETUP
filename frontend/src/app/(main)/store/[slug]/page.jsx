import ViewStorePage from "./ViewStorePage";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/post/getbyslug/${slug}`);
  if (!res.ok) return { title: "Blog Not Found" };

  const storeData = await res.json();

  let schemaScript = '';
  if (storeData.productSchema) {
    try {
      const parsedSchema = typeof storeData.productSchema === 'string' ? JSON.parse(storeData.productSchema) : storeData.productSchema;
      schemaScript = `<script type="application/ld+json">${JSON.stringify(parsedSchema)}</script>`;
    } catch (error) {
      console.error("Error parsing productSchema:", error);
      schemaScript = ''; // Fallback to an empty script if parsing fails
    }
  }

  return {
    title: storeData.productMetaTitle || "",
    description: storeData.productMetaDescription || "",
    keywords: storeData.productKeywords || "",
    other: {
      schemaScript
    }
  };
}

export default async function ViewAtorePageWrapper({ params }) {
  const { slug } = await params;

  return <ViewStorePage slug={slug} />;
}
