import { notFound } from "next/navigation";
import StorePage from "./StorePageClient";

export async function generateMetadata() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/web/store/getall`
  );

  if (!res.ok) {
    return { title: "Store Not Found" };
  }

  const storeData = await res.json();

  if (!storeData.store || storeData.store.length === 0) {
    notFound();
  }

  const store = storeData.store[0];
  // console.log(store);

  return {
    title: store.storeMetaTitle || "Default Title",
    description: store.storeMetaDescription || "Default Description",
    keywords: store.storeMetaKeyword || "default, keywords",
  };
}

export default async function storeWrapper() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/web/store/getall`
  );

  if (!res.ok) {
    notFound();
  }

  const storeData = await res.json();

  if (!storeData.store || storeData.store.length === 0) {
    notFound();
  }

  const store = storeData.store[0];

  return (
    <>
      <StorePage />
      {store.storeSchema && (
        <script type="application/ld+json">
          {typeof store.storeSchema === "string"
            ? store.storeSchema
            : JSON.stringify(store.storeSchema)}
        </script>
      )}
    </>
  );
}
