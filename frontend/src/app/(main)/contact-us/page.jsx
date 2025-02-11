import { notFound } from 'next/navigation';
import ContactUs from './contactClient';

export async function generateMetadata() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/contact/getall`);

  if (!res.ok) {
    return { title: "Contact Not Found" };
  }

  const contactData = await res.json();

  // Check if contacts data exists
  if (!contactData.contacts || contactData.contacts.length === 0) {
    notFound();  // Redirect to the Not Found page
  }

  const contacts = contactData.contacts[0];

  return {
    title: contacts.metaTitle || "Default Title",
    description: contacts.metaDescriptioin || "Default Description",
    keywords: contacts.metaKeywords || "default, keywords",
  };
}

export default async function ContactsWrapper() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/contact/getall`);

  if (!res.ok) {
    notFound();  // Redirect to the Not Found page if the fetch fails
  }

  const contactData = await res.json();

  // Check if contacts data exists
  if (!contactData.contacts || contactData.contacts.length === 0) {
    notFound();  // Redirect to the Not Found page if contacts are missing
  }

  const contacts = contactData.contacts[0];
  let schemaData = "";

  if (contacts.metaSchema) {
    try {
      schemaData = typeof contacts.metaSchema === "string"
        ? contacts.metaSchema
        : JSON.stringify(contacts.metaSchema, null, 2);  // Pretty-print JSON
    } catch (error) {
      console.error("Error parsing metaSchema:", error);
    }
  }

  return (
    <>
      <ContactUs />
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaData }}
        />
      )}
    </>
  );
}
