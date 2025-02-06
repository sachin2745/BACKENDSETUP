import React, { useEffect, useState } from "react";
import { FiPhoneCall } from "react-icons/fi";
import { ImWhatsapp } from "react-icons/im";

const Contact = () => {
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/web/contact`
        );
        const data = await response.json();

        setContactInfo(data);
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative">
      <div className="fixed right-4 bottom-4 flex flex-col space-y-3 z-50">
        {/* WhatsApp Button */}
        {contactInfo?.whatsappNumber && (
          <a
            href={`https://wa.me/${contactInfo.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110"
          >
            <ImWhatsapp className="text-2xl" />
          </a>
        )}

        {/* Call Button */}
        {contactInfo?.callingNumber && (
          <a
            href={`tel:${contactInfo.callingNumber}`}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110"
          >
            <FiPhoneCall className="text-2xl" />
          </a>
        )}
      </div>
    </div>
  );
};

export default Contact;
