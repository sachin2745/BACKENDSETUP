"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [founderData, setFounderData] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/web/about-data/getall`
        );

        if (response.status === 200) {
          setAboutData(response.data.aboutData);
          setFounderData(response.data.founderData);
          setPageData(response.data.pageData);
          setBannerData(response.data.bannerData);
          // console.log("About Data:", response.data);
        } else {
          console.error(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching about data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen">Loading</div>;
  }

  return (
    <>
      <section className="font-RedditSans">
        {aboutData && (
          <div
            className="mx-auto md:pt-[20px] md:pb-[40px] pt-[18px] xl:bg-bottom 2xl:bg-cover bg-cover xl:bg-contain bg-no-repeat "
            style={{
              backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${aboutData.ourMissionBgImg})`,
            }}
          >
            <div className="max-w-[78rem]  md:pt-[32px] pt-[20px] px-[16px] mx-auto">
              <h2 className="font-[700] md:text-[32px] md:leading-[48px] text-[20px] leading-[30px] text-white">
                {aboutData?.ourMissionHeading || ""}
              </h2>
            </div>
            <div className="max-w-6xl md:flex md:flex-col lg:flex lg:flex-row justify-around items-center md:pb-[32px] px-6 sm:px-0 py-[18px] mx-auto">
              <div className="md:columns-4 columns-12 md:w-[356px] sm:w-full h-[120px] my-[20px] rounded-lg relative">
                <div className="w-[76px] h-[86px] rounded-lg bg-[#1B7938] absolute top-[-3px] left-[-3px]" />
                <div className="w-[76px] h-[86px] rounded-lg bg-[#1B7938] absolute bottom-[-3px] right-0" />
                <div className="w-[97%] h-auto rounded-lg bg-[#FFF1F3] absolute bottom-1 right-1 top-1 left-1">
                  <div className="pt-[30px] pb-[30px] px-[24px] flex items-center gap-x-4">
                    <div>
                      <div
                        className=" h-[32px] sm:h-[56px] w-[32px] sm:w-[56px] bg-center bg-no-repeat bg-contain"
                        style={{
                          backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${aboutData.ourMissionImg1})`,
                        }}
                      />
                    </div>
                    <div className="text-sm md:text-[18px] px-4 md:px-0 md:text-center items-center xl:text-start text-[#1B2124] font-[600] leading-7">
                      {aboutData?.ourMissionContent1 || ""}
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:columns-4 columns-12 md:w-[356px] sm:w-full h-[120px] my-[20px] rounded-lg relative">
                <div className="w-[76px] h-[86px] rounded-lg bg-[#F1EFFF] absolute top-[-3px] left-[-3px]" />
                <div className="w-[76px] h-[86px] rounded-lg bg-[#F1EFFF] absolute bottom-[-3px] right-0" />
                <div className="w-[97%] h-auto rounded-lg bg-[#FFFBEF] absolute bottom-1 right-1 top-1 left-1">
                  <div className="pt-[30px] pb-[30px] px-[24px] flex items-center gap-x-4">
                    <div>
                      <div
                        className="h-[32px] sm:h-[56px] w-[32px] sm:w-[56px] bg-center bg-no-repeat bg-contain"
                        style={{
                          backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${aboutData.ourMissionImg2})`,
                        }}
                      />
                    </div>
                    <div className="text-sm md:text-[18px] px-4 md:px-0 md:text-center items-center xl:text-start text-[#1B2124] font-[600] leading-7">
                      {aboutData?.ourMissionContent2 || ""}
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:columns-4 columns-12 md:w-[356px] sm:w-full h-[120px] my-[20px] rounded-lg relative">
                <div className="w-[76px] h-[86px] rounded-lg bg-[#E31B4D] absolute top-[-3px] left-[-3px]" />
                <div className="w-[76px] h-[86px] rounded-lg bg-[#E31B4D] absolute bottom-[-3px] right-0" />
                <div className="w-[97%] h-auto rounded-lg bg-[#E7F6FA] absolute bottom-1 right-1 top-1 left-1">
                  <div className="pt-[30px] pb-[30px] px-[24px] flex items-center gap-x-4">
                    <div>
                      <div
                        className="h-[32px] sm:h-[56px] w-[32px] sm:w-[56px] bg-center bg-no-repeat bg-contain"
                        style={{
                          backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${aboutData.ourMissionImg3})`,
                        }}
                      />
                    </div>
                    <div className="text-sm md:text-[18px] px-4 md:px-0 md:text-center items-center xl:text-start text-[#1B2124] font-[600] leading-7">
                      {aboutData?.ourMissionContent3 || ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="font-RedditSans">
        <div
          className="mx-auto bg-no-repeat bg-cover bg-bottom py-3 "
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${aboutData.ourVisionBgImg})`,
          }}
        >
          <div className="max-w-[78rem] mx-auto  flex py-[24px] px-[16px] md:py-[30px] justify-between flex-col xl:flex-row m-auto">
            <div className="xl:text-left xl:w-[50%] w-full py-[20px]">
              <h2 className="font-[700] md:text-[32px] md:leading-[48px] text-[20px] leading-[30px] text-[#1B2124]">
                {aboutData?.ourVisionHeading || ""}
              </h2>
              <div className="flex pt-[16px] gap-2.5 text-sm md:text-[18px] leading-[28px] md:px-0 items-center xl:text-start text-[#3D3D3D] mb-3.5 font-[500]">
                <span>
                  <div
                    className="h-[32px] w-[32px] bg-center bg-no-repeat bg-contain"
                    style={{
                      backgroundImage: "url(star.webp)",
                    }}
                  />
                </span>
                <span> {aboutData?.ourVisionContent1 || ""}</span>
              </div>
              <div className="flex text-sm gap-2.5 md:text-[18px] leading-[28px] md:px-0 items-center xl:text-start text-[#3D3D3D] mb-3.5 font-[500]">
                <span>
                  <div
                    className="h-[32px] w-[32px] bg-center bg-no-repeat bg-contain"
                    style={{
                      backgroundImage: "url(star.webp)",
                    }}
                  />
                </span>
                <span> {aboutData?.ourVisionContent2 || ""}</span>
              </div>
              <div className="flex text-sm gap-2.5 md:text-[18px] leading-[28px] md:px-0 items-center xl:text-start text-[#3D3D3D] mb-3.5 font-[500]">
                <span>
                  <div
                    className="h-[32px] w-[32px] bg-center bg-no-repeat bg-contain"
                    style={{
                      backgroundImage: "url(star.webp)",
                    }}
                  />
                </span>
                <span> {aboutData?.ourVisionContent3 || ""}</span>
              </div>
            </div>
            <div className="mx-auto">
              <div
                className="h-[183px] sm:h-[336px] w-[328px] sm:w-[580px] bg-center bg-no-repeat bg-contain"
                style={{
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${aboutData.ourVisionImg})`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="font-RedditSans">
        <div
          className="mx-auto md:bg-bottom bg-cover md:bg-no-repeat h-[920px] md:h-[620px] py-3"
          style={{ backgroundImage: "url(founders-bg.svg)" }}
        >
          <div className="max-w-[78rem] mx-auto px-6  pb-9">
            <div className="xl:text-left w-full">
              <div className="pb-4 pt-8">
                <h2 className="font-semibold md:text-3xl md:leading-[48px] text-xl leading-7 text-white">
                  Our Founders
                </h2>
              </div>
              <div
                className={`grid gap-6 ${
                  founderData.length === 1
                    ? "grid-cols-1 justify-center flex" // Center if only one item
                    : "md:grid-cols-2 grid-cols-1" // Default layout for multiple items
                }`}
              >
                {founderData.map((founder, index) => (
                  <div key={index} className="relative group">
                    {/* COLLAPSED VIEW */}
                    <div className="flex flex-col md:h-[440px] h-[380px] bg-white text-center rounded-md transition-all duration-300 group-hover:hidden">
                      <div className="w-full px-8 pt-8 pb-4 overflow-y-scroll scrollbarWidthNone">
                        <div className="animate-in slide-in-from-top-64 duration-700">
                          <div className="flex justify-center py-3">
                            <div
                              className="md:h-[168px] md:w-[168px] h-[100px] w-[100px] bg-center bg-no-repeat bg-contain"
                              style={{
                                backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${founder.founderImg})`,
                              }}
                            />
                          </div>
                          <div className="py-1 font-bold md:text-2xl md:leading-8 text-lg leading-7 text-[#3D3D3D]">
                            {founder.founderName}
                          </div>
                          <div className="font-medium md:text-base md:leading-6 text-sm leading-5 text-[#3D3D3D]">
                            {founder.founderDsg}
                          </div>
                          <div className="pt-3 px-1 font-semibold md:text-xl md:leading-8 text-base leading-7 text-[#1B2124] italic">
                            “{founder.founderMsg}”
                          </div>
                        </div>
                      </div>
                      <button className="py-4 border-t border-[#bebdbd] cursor-pointer w-full">
                        <div className="flex text-sm md:text-base justify-center text-[#5A4BDA] font-bold leading-6">
                          <span className="pt-1">
                            Read More about {founder.founderName}
                          </span>
                          <span className="pt-[2px]">
                            <div
                              className="w-[30px] h-[30px] bg-center bg-no-repeat bg-contain"
                              style={{
                                backgroundImage: "url(chevron_up.webp)",
                              }}
                            />
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* EXPANDED VIEW */}
                    <div className="flex-col hidden group-hover:flex md:h-[440px] h-[380px] bg-white text-center rounded-md transition-all duration-300 absolute inset-0">
                      <div className="w-full px-8 pt-8 pb-4 overflow-y-scroll scrollbarWidthNone">
                        <div className="animate-in slide-in-from-bottom-64 duration-700">
                          <div className="mt-2 text-start cursor-default">
                            <div className="py-2 font-bold md:text-2xl md:leading-8 text-lg leading-7 text-[#3D3D3D]">
                              {founder.founderName}
                            </div>
                            <div className="font-normal md:text-base md:leading-6 text-sm leading-5 text-[#1B2124]">
                              {founder.founderDetail}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="py-4 border-t border-[#bebdbd] cursor-pointer w-full">
                        <div className="flex text-sm md:text-base justify-center text-[#5A4BDA] font-bold leading-6">
                          <span className="pt-1">
                            Read Less about {founder.founderName}
                          </span>
                          <span className="pt-[2px]">
                            <div
                              className="w-[30px] h-[30px] bg-center bg-no-repeat bg-contain rotate-180"
                              style={{
                                backgroundImage: "url(chevron_up.webp)",
                              }}
                            />
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="font-RedditSans max-w-[78rem] mx-auto px-6 py-12">
        {pageData.pageDescription && (
          <div dangerouslySetInnerHTML={{ __html: pageData.pageDescription }} />
        )}
      </section>

      <section className="font-RedditSans">
        {bannerData && (
          <div
            className="my-10 min-h-[350px] overflow-hidden sm:mx-4 xl:mx-auto relative max-w-[75rem] m-auto shadow-md justify-between xl:p-10 p-4 md:flex rounded-md"
            style={{ backgroundColor: bannerData?.bannerBgColor || "" }}
          >
            <div className="my-auto">
              <div>
                <div className="font-bold text-[#1B2124] xl:leading-[48px] leading-[30px] md:text-2xl xl:text-left text-center  text-[20px] xl:text-[32px] mb-4 md:mb-3">
                  {bannerData?.bannerHeading || ""}
                </div>
              </div>
              <div className="xl:mb-10 mb-8 text-[#1B2124]">
                <div>
                  <div className="flex items-center gap-2.5 my-[10px]">
                    <img
                      alt="blueTickImage"
                      loading="lazy"
                      width={16}
                      height={16}
                      decoding="async"
                      data-nimg={1}
                      className="w-4 h-4 bg-center bg-no-repeat bg-cover"
                      style={{ color: "transparent" }}
                      src={`${process.env.NEXT_PUBLIC_API_URL}${bannerData.bannerTickIcon}`}
                    />
                    <div className="sm:text-base text-sm">
                      {bannerData?.bannerContent1 || ""}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2.5 my-[10px]">
                    <img
                      alt="blueTickImage"
                      loading="lazy"
                      width={16}
                      height={16}
                      decoding="async"
                      data-nimg={1}
                      className="w-4 h-4 bg-center bg-no-repeat bg-cover"
                      style={{ color: "transparent" }}
                      src={`${process.env.NEXT_PUBLIC_API_URL}${bannerData.bannerTickIcon}`}
                    />
                    <div className="sm:text-base text-sm">
                      {bannerData?.bannerContent2 || ""}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2.5 my-[10px]">
                    <img
                      alt="blueTickImage"
                      loading="lazy"
                      width={16}
                      height={16}
                      decoding="async"
                      data-nimg={1}
                      className="w-4 h-4 bg-center bg-no-repeat bg-cover"
                      style={{ color: "transparent" }}
                      src={`${process.env.NEXT_PUBLIC_API_URL}${bannerData.bannerTickIcon}`}
                    />
                    <div className="sm:text-base text-sm">
                      {bannerData?.bannerContent3 || ""}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex md:gap-3.5 gap-2 md:justify-start justify-center sm:mb-0 mb-10">
                  <a
                    href={bannerData?.bannerGoogle || ""}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="store-icons"
                  >
                    <img
                      alt="image"
                      loading="lazy"
                      width={0}
                      height={0}
                      decoding="async"
                      data-nimg={1}
                      className="cursor-pointer w-[135px] h-[40px] bg-center bg-no-repeat bg-cover"
                      style={{ color: "transparent" }}
                      src="google-play-badge.webp"
                    />
                  </a>
                  <a
                    href={bannerData?.bannerApple || ""}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="store-icons"
                  >
                    <img
                      alt="image"
                      loading="lazy"
                      width={0}
                      height={0}
                      decoding="async"
                      data-nimg={1}
                      className="cursor-pointer w-[135px] h-[40px] bg-center bg-no-repeat bg-cover"
                      style={{ color: "transparent" }}
                      src="apple-store-badge.webp"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div>
              <img
                alt="download-right"
                loading="lazy"
                width={0}
                height={0}
                decoding="async"
                data-nimg={1}
                className=" xl:w-[301px] xl:h-[376px] w-[200px] sm:h-[450px] h-[248px] mb-[-30px] sm:mb-[-130px] xl:mb-[-65px] m-auto  bg-center bg-contain  bg-no-repeat "
                style={{ color: "transparent" }}
                src={`${process.env.NEXT_PUBLIC_API_URL}${bannerData.bannerImg}`}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default About;
