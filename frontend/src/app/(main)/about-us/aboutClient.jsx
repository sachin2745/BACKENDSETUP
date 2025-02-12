"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [founderData, setFounderData] = useState(null);
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
          console.log("About Data:", response.data);
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
            <div className="max-w-6xl md:pt-[32px] pt-[20px] px-[16px] mx-auto">
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

      <section>
        <div
          className="mx-auto bg-no-repeat bg-cover bg-bottom py-3 "
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${aboutData.ourVisionBgImg})`,
          }}
        >
          <div className="max-w-6xl flex py-[24px] px-[16px] md:py-[30px] justify-between flex-col xl:flex-row m-auto">
            <div className="xl:text-left xl:w-[50%] w-full py-[20px]">
              <h2 className="font-[700] md:text-[32px] md:leading-[48px] text-[20px] leading-[30px] text-[#1B2124]">
               {aboutData?.ourVisionHeading || ""}
              </h2>
              <div className="flex pt-[16px] gap-2.5 text-sm md:text-[18px] leading-[28px] md:px-0 items-center xl:text-start text-[#3D3D3D] mb-3.5 font-[500]">
                <span>
                  <div
                    className="h-[32px] w-[32px] bg-center bg-no-repeat bg-contain"
                    style={{
                      backgroundImage:
                        "url(star.webp)",
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
                      backgroundImage:
                      "url(star.webp)",
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
                      backgroundImage:
                      "url(star.webp)",
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
                  backgroundImage:
                    `url(${process.env.NEXT_PUBLIC_API_URL}${aboutData.ourVisionImg})`,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
