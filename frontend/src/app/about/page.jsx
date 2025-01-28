// pages/about.js

import Meta from "../meta";

export const metadata = {
  title: "About Us",
  description: "We are passionate about creating modern and user-friendly web applications.",
  keywords: "web development, user-friendly, modern applications",
  schema: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Your Company Name",
    "url": "https://www.yourcompany.com",
    "logo": "https://www.yourcompany.com/logo.png",
    "sameAs": [
      "https://www.facebook.com/yourprofile",
      "https://www.twitter.com/yourprofile",
      "https://www.linkedin.com/in/yourprofile"
    ]
  }
};

export default function AboutPage() {
   
  return (
    <>
      <Meta 
        title={metadata.title} 
        description={metadata.description} 
        keywords={metadata.keywords} 
        schema={metadata.schema} 
      />

      <section>
        <h1>About Us</h1>
        <p>We are passionate about creating modern and user-friendly web applications.</p>
      </section>
    </>
  );
}