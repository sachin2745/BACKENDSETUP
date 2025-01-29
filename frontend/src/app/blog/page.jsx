"use client";
import { useEffect, useState } from "react";
import Meta from "../meta";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import axios from "axios";
import Link from "next/link";

 const metadata = {
  title: "About Us",
  description:
    "We are passionate about creating modern and user-friendly web applications.",
  keywords: "web development, user-friendly, modern applications",
  schema: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Your Company Name",
    url: "https://www.yourcompany.com",
    logo: "https://www.yourcompany.com/logo.png",
    sameAs: [
      "https://www.facebook.com/yourprofile",
      "https://www.twitter.com/yourprofile",
      "https://www.linkedin.com/in/yourprofile",
    ],
  },
};

export default function AboutPage() {

  const [blogs, setBlogs] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/admin/blogs/getall"
      ); // Making GET request to the API endpoint
      console.log(response.data);
      const data = response.data; // Extracting the data from the response

      // Setting the state with the fetched data
      setBlogs(data.blogs);
      setBlogCategories(data.blogCategories);
    } catch (err) {
      console.log(err.message); // Catching any error and setting the error state
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const [postArray, setPostArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs().then((posts) => {
      setPostArray(posts);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Meta
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        schema={metadata.schema}
      />

      <section className="text-gray-600 body-font bg-mate_black ">
        <div className="text-center font-Jost text-black dark:text-black pt-10">
          <h1 className="font-bold text-3xl font-Montserrat">My Blog</h1>
          <h3 className="text-sm font-Montserrat ">Home &rsaquo; My Blog</h3>
        </div>

        <div className="container px-5 py-24 mx-auto">
          {loading ? (
            <div className="flex flex-wrap -m-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 md:w-1/3">
                  <div className="h-full relative border-2 shadow-xl border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                    <div className="lg:h-48 md:h-36 w-full bg-gray-300" />
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 mb-2" />
                      <div className="h-4 bg-gray-300 mb-2 w-1/2" />
                      <div className="h-16 bg-gray-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap -m-4">
              {blogs.map((post, index) => (
                <div key={post.blogId } className="p-4 md:w-1/3 ">
                  <div className="h-full relative border-2 shadow-xl  overflow-hidden border-gray-200 border-opacity-60 rounded-lg ">
                    <img
                      className="lg:h-48 md:h-36 w-full object-cover opacity-75  block transition duration-200 ease-out transform hover:opacity-100"
                      src={`${process.env.NEXT_PUBLIC_API_URL}${post.blogImage}`}
                      alt="blog"
                    />
                    <span className="absolute font-Oswald outline top-0 z-10 left-0 m-3 rounded-sm bg-transparent tracking-wide px-2 text-center text-sm font-bold text-white">
                      Blog {index + 1}
                    </span>
                    <div className="p-6 font-Josefin_Sans">
                      <div className="flex justify-between mb-3">
                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-600 ">
                          CATEGORY
                        </h2>
                        <h1 className="title-font text-xs tracking-widest font-medium text-gray-600  uppercase">
                          {post.blogCategory}
                        </h1>
                      </div>
                      <h2 className="leading-relaxed mb-3 font-Montserrat font-bold line-clamp-* capitalize">
                        {post.blogTitle}
                      </h2>
                      <div className="flex items-center flex-wrap  ">
                        <Link
                         key={post.blogSKU}
                         href={`/blog/${post.blogSKU}`}
                          // href={`/blog/${post.slug.blogSKU}`}
                          className="text-quaternary  hover:text-white bg-white hover:bg-quaternary px-2 py-2  rounded-md transition ease-in-out  duration-300  transform  inline-flex items-center md:mb-0 lg:mb-0"
                        >
                          Learn More <MdKeyboardDoubleArrowRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
