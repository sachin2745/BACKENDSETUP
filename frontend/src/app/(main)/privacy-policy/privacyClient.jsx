"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Privacy = () => {
  const [privacy, setPrivacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/web/legal-documents/getall`
        );
        if (response.data.privacy && response.data.privacy.length > 0) {
            setPrivacy(response.data.privacy[0]);
        } else {
          router.push("/not-found");
        }
      } catch (err) {
        console.error(err.message);
        router.push("/not-found");  // Redirect on error as well
      } finally {
        setLoading(false);
      }
    };
    fetchPrivacy();
  }, [router]);

  if (loading) {
    // Skeleton Loader while data is being fetched
    return (
      <section className="font-RedditSans animate-pulse">
        <div className="container mt-5 max-w-[900px] mx-auto">
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="font-RedditSans">
      <div className="container mt-5 max-w-[78rem] mx-auto px-4 md:px-6">
        <div className="bg-white ">
          <h1 className="text-3xl font-bold capitalize text-gray-800 mb-4">
            {privacy.pageTitle}
          </h1>
          <div
            className="pt-4 text-lg leading-relaxed text-gray-700"
            dangerouslySetInnerHTML={{
              __html: privacy.pageDescription || "No content available.",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Privacy;
