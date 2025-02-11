"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaLocationArrow, FaQuora } from "react-icons/fa";


const ContactUs = () => {
  const [contacts, setContacts] = useState({});
  const [settings, setSettings] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/web/contact/getall`
        );
        if (
          response.data.contacts &&
          response.data.settings &&
          response.data.faqs &&
          response.data.contacts.length > 0
        ) {
          setContacts(response.data.contacts[0]);
          setSettings(response.data.settings[0]);
          setFaqs(response.data.faqs);
        } else {
          router.push("/not-found");
        }
      } catch (err) {
        console.error(err.message);
        router.push("/not-found");
      } finally {
        setLoading(false);
      }
    };
    fetchContactData();
  }, [router]);

  if (loading) {
    return (
      <section className="font-RedditSans animate-pulse">
        <div className="container mt-14 max-w-[78rem] mx-auto px-4 md:px-6">
          {/* Heading Skeleton */}
          <div className="h-10 bg-gray-300 rounded w-1/2 mb-6"></div>

          {/* Description Skeleton */}
          <div className="space-y-4 mb-10">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>

          {/* Contact Info & Map Skeleton */}
          <div className="flex flex-col md:flex-row justify-between my-12 gap-8">
            {/* Contact Info Skeleton */}
            <div className="w-full md:w-[48%] space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              <div className="h-10 bg-gray-300 rounded w-40"></div>{" "}
              {/* Button Placeholder */}
            </div>

            {/* Map Skeleton */}
            <div className="w-full md:w-[75%] h-72 bg-gray-300 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!contacts.pageTitle || !settings.companyName) {
    return null; // Prevent rendering until data is fetched
  }

  const openGoogleMaps = () => {
    const companyName = settings?.companyName || "Career Wave";
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      companyName
    )}`;
    window.open(googleMapsLink, "_blank");
  };

  return (
    <div>
      <div className="container max-w-[78rem] mx-auto px-4 md:px-6 font-RedditSans">
        <div className="my-14">
          <h1 className="my-4 text-4xl font-bold capitalize text-gray-800">
            {contacts.pageTitle}
          </h1>
          <div className="mb-5 pb-4 border-b-2 border-gray-200">
            {typeof window !== "undefined" && (
              <div
                className="text-[16px] leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: contacts.pageDescription || "No content available.",
                }}
              />
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between my-6 pt-6 pb-12  ">
            <div className="w-full md:w-[48%]">
              <div className="mb-3">
                <h2 className="text-4xl uppercase">{settings.companyName}</h2>
              </div>
              <div className="mb-3">
                <span className="text-md font-normal">
                  <div className="w-36">{settings.officialAddress}</div>
                </span>
              </div>
              <div className="font-18 mb-3 text-primary">
                <a href={`mailto:${settings.officialEmail}`}>
                  {settings.officialEmail}
                </a>
              </div>
              <button
                type="button"
                className="px-6 py-2.5 flex items-center gap-3 text-primary hover:bg-primary hover:text-white transition ease-in-out duration-300 delay-200 bg-white border-2 border-primary rounded-lg mb-5"
                onClick={openGoogleMaps}
              >
                <FaLocationArrow />
                Get Directions
              </button>
            </div>

            <div className="w-full md:w-[75%] mt-5 md:mt-0">
              {typeof window !== "undefined" && (
                <div
                  dangerouslySetInnerHTML={{ __html: settings.embedMapUrl }}
                />
              )}
            </div>
          </div>

          {faqs.length > 0 && (
            <div className="border-t-2 border-gray-200">
              <h3 className="my-6  text-3xl font-bold capitalize text-quaternary">
                Frequently Asked Questions
              </h3>
              <div className="mb-5">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="collapse collapse-plus text-xs  sm:text-[16px] leading-relaxed bg-emerald-100 mb-6 border-b-4 border-emerald-300 rounded-lg focus:outline-none"
                  >
                    <input
                      type="radio"
                      name="faq-accordion"
                      defaultChecked={index === 0} // First FAQ is open by default
                    />
                    <div className="collapse-title flex items-center gap-2 sm:gap-0 font-bold break-words">
                      <FaQuora className="text-quaternary flex-shrink-0" />
                      <span className="hidden sm:block mr-1">.</span>
                      <span className="text-wrap">{faq.faqQuestion}</span>
                    </div>
                    <div className="collapse-content bg-white text-quaternary border-x-2 border-emerald-100">
                      <p className="pt-4">{faq.faqAnswer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
