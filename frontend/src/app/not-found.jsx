import Link from "next/link";

export default function NotFound() {
  return (
    <div className=" min-h-screen  bg-white">
      {/* Text Section */}
      <div className="flex  justify-center text-center items-center px-6 py-20 sm:py-32 lg:px-16">
        <div className="max-w-xl">
          <h1 className="text-6xl font-extrabold text-primary sm:text-8xl">
            404
          </h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-5xl">
            Page not found
          </h2>
          <p className="mt-6 text-lg text-gray-600">
            Oops! The page you’re looking for doesn’t exist or has been moved.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center px-5 py-3 text-sm font-medium text-white bg-primary rounded-lg  transition duration-300"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      
    </div>
  );
}
