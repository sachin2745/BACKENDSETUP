import { notFound } from 'next/navigation';
import ContactUs from './contactClient';

export async function generateMetadata() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/contact/getall`);

  if (!res.ok) {
    return { title: "Privacy Not Found" };
  }

  const contactData = await res.json();

  // Check if contacts data exists
  if (!contactData.contacts || contactData.contacts.length === 0) {
    notFound();  // Redirect to the Not Found page
  }

  const contacts = contactData.contacts[0];

  let openGraph = {};
  if (contacts.metaSchema) {
    try {
      openGraph = typeof contacts.metaSchema === 'string' ? JSON.parse(contacts.metaSchema) : contacts.metaSchema;
    } catch (error) {
      console.error("Error parsing metaSchema:", error);
      openGraph = {}; // Fallback to an empty object if parsing fails
    }
  }

  return {
    title: contacts.metaTitle || "Default Title",
    description: contacts.metaDescriptioin || "Default Description",
    keywords: contacts.metaKeywords || "default, keywords",
    openGraph: openGraph,
  };
}

export default async function ContactsWrapper() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/contact/getall`);

  if (!res.ok) {
    notFound();  // Redirect to the Not Found page if the fetch fails
  }

  const contactData = await res.json();

  // Check if terms data exists
  if (!contactData.contacts || contactData.contacts.length === 0) {
    notFound();  // Redirect to the Not Found page if contacts are missing
  }

  return <ContactUs />;
}
