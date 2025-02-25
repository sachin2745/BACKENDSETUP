import React from "react";

const page = () => {
  return (
    <div className="py-2 lg:py-5 mx-auto max-w-7xl px-0 md:px-3 w-full font-RedditSans">
    <div className="px-3 lg:px-0">
      <div className="animate-pulse flex space-x-4">
        <div className="h-6 bg-gray-300 rounded w-10"></div>
        <div className="h-6 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
    <div className="lg:flex justify-between lg:space-x-4 lg:pr-3 mt-4">
      <div className="flex-1">
        <div className="flex flex-col space-y-4">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="shadow rounded-lg p-4 w-full animate-pulse bg-gray-200">
              <div className="h-24 bg-gray-300 rounded"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mt-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 lg:mt-0 flex justify-center lg:sticky lg:top-[130px]">
        <div className="w-[400px] max-w-[100vw] px-3 md:px-0">
          <div className="rounded-xl p-4 lg:p-6 shadow-lg animate-pulse bg-gray-200">
            <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>
            <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-24 mb-2"></div>
            <div className="h-5 bg-gray-300 rounded w-24"></div>
          <div className="h-8 bg-gray-300 rounded w-full mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default page;
