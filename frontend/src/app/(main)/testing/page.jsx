import React from "react";

const page = () => {
  return (
    <div className="max-w-7xl mx-auto xl:flex flex-row pt-10 p-5 items-start animate-pulse">
      <div className="relative md:flex flex-row items-start fit w-full">
        <div className="mx-0 md:px-4 w-full md:w-[45%]">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-2 overflow-x-auto lg:overflow-y-auto hide-scrollbar">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-gray-300 rounded-md"
                ></div>
              ))}
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-200 p-4 rounded-lg relative h-80 md:h-[500px]">
              <div className="w-full max-w-lg h-full bg-gray-300 rounded-md"></div>
            </div>
          </div>
          <div className="fixed bottom-0 lg:static left-0 right-0 px-3 lg:px-0 py-4 bg-white lg:pt-6 lg:pb-0 lg:py-0 z-20 shadow-top md:shadow-none rounded-t-lg md:rounded-none">
            <div className="grid grid-cols-2 gap-2 md:gap-6 justify-items-center">
              <div className="border-2 border-gray-300 w-full flex items-center justify-center py-3 rounded-lg"></div>
              <div className="w-full bg-gray-300 h-12 rounded-lg"></div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[55%] mx-auto my-4 mb-[2.5rem] flex flex-col pb-[4rem] relative">
          <div className="px-3">
            <div className="flex flex-col">
              <div className="h-6 bg-gray-300 md:w-3/4 rounded-md"></div>
              <div className="h-6 bg-gray-300 md:w-3/4 rounded-md mt-2"></div>
              {/* <div className="h-4 bg-gray-300 w-1/2 rounded-md mt-2"></div> */}
            </div>
            <div className="flex mt-3">
              <div className="h-5 bg-gray-300 w-24 rounded-md"></div>
            </div>
            <div className="flex mt-3 gap-3">
              <div className="h-6 bg-gray-300 w-16 rounded-md"></div>
              <div className="h-6 bg-gray-300 w-24 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
