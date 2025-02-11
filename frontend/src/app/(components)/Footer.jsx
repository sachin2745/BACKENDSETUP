import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/web/footer-data`
        );

        if (response.status === 200) {
          setFooterData(response.data.footerData);
          setCompanyData(response.data.companyData);
          // console.log("Footer Data:", response.data.footerData);
          // console.log("Company Data:", response.data.companyData);
        } else {
          console.error(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching footer data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading Footer...</div>;
  }

  return (
    <>
      <footer className=" bg-dashGray text-center border-b-2 sm:py-6 lg:text-left font-RedditSans">
        <div className="mx-auto max-w-[78rem] p-4 px-4 md:px-6">
          <div className="md:flex md:flex-col md:justify-between xl:flex xl:flex-row  ">
            <div className="mb-6 md:mb-0 xl:w-[40%] md:w-[100%] ">
              <div className="flex items-center">
                <a aria-label="pw-logo" href="/">
                  <div
                    className="h-12 w-12 mr-3 bg-center bg-no-repeat bg-contain rounded-full"
                    style={{
                      backgroundImage: `url('${process.env.NEXT_PUBLIC_API_URL}${footerData?.companyLogo}')`,
                    }}
                  />
                </a>
                <div className="self-center font-[700]  text-[#1B2124]  text-[18px] leading-[28px]">
                  {footerData?.companyName || ""}
                </div>
              </div>
              <div className="pt-3 font-[400] text-[#3D3D3D] text-[14px] xl:leading-[20px]  sm:leading-[18px]  text-left">
                {footerData?.settingShortDescription || ""}
              </div>
              <div className="2xl">
                <div className="grid content-between md:justify-start col-span-12 md:col-span-4 space-y-2">
                  <div className="whitespace-nowrap text-[#989DA5] md:block hidden" />
                  <div className="flex d-md-items-end gap-4 py-6">
                    {footerData?.googleUrl && (
                      <a
                        aria-label="google-store"
                        href={footerData?.googleUrl || ""}
                        target="_blank"
                        rel="noreferrer"
                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                      >
                        <img
                          className="h-[30px] rounded"
                          src="google-play.webp"
                          alt="Download App on Playstore"
                        />
                      </a>
                    )}
                    {footerData?.appleUrl && (
                      <a
                        aria-label="apple-store"
                        href={footerData?.appleUrl || ""}
                        target="_blank"
                        rel="noreferrer"
                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                      >
                        <img
                          className="h-[30px] rounded"
                          src="mac_with_apple.webp"
                          alt="Download App on Playstore"
                        />
                      </a>
                    )}
                    {footerData?.intelUrl && (
                      <a
                        aria-label="inter-store"
                        href={footerData?.intelUrl || ""}
                        target="_blank"
                        rel="noreferrer"
                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                      >
                        <img
                          className="h-[30px] rounded"
                          src="mac_with_intel.webp"
                          alt="Download App on Playstore"
                        />
                      </a>
                    )}
                    {footerData?.windowsUrl && (
                      <a
                        aria-label="windows-store"
                        href={footerData?.windowsUrl || ""}
                        target="_blank"
                        rel="noreferrer"
                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                      >
                        <img
                          className="h-[31px] rounded"
                          src="windows-button.webp"
                          alt="Download App on Playstore"
                        />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-[20px] md:mb-0 lg:mt-0 mt-[20px] ">
                  <div className="text-[16px] md:text-[20px] font-[600] mb-[10px] text-start">
                    Let’s get social :
                  </div>
                  <div className="flex w-[204px] justify-between">
                    {footerData?.facebookUrl && (
                      <a
                        aria-label="Facebook"
                        href={footerData.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                      >
                        <div
                          className="h-6 w-6 bg-center bg-no-repeat bg-contain"
                          style={{
                            backgroundImage: "url(/facebook.webp)",
                          }}
                        />
                      </a>
                    )}
                    {footerData?.instagramUrl && (
                      <a
                        aria-label="Instagram"
                        href={footerData.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                      >
                        <div
                          className="h-6 w-6 bg-center bg-no-repeat bg-contain"
                          style={{
                            backgroundImage: "url(/instagram.webp)",
                          }}
                        />
                      </a>
                    )}
                    {footerData?.youtubeUrl && (
                      <a
                        aria-label="YouTube"
                        href={footerData.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                      >
                        <div
                          className="h-6 w-6 bg-center bg-no-repeat bg-contain"
                          style={{
                            backgroundImage: "url(/youtube.webp)",
                          }}
                        />
                      </a>
                    )}
                    {footerData?.linkedinUrl && (
                      <a
                        aria-label="LinkedIn"
                        href={footerData.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                      >
                        <div
                          className="h-6 w-6 bg-center bg-no-repeat bg-contain"
                          style={{
                            backgroundImage: "url(/linkedin.webp)",
                          }}
                        />
                      </a>
                    )}
                    {footerData?.twitterUrl && (
                      <a
                        aria-label="Twitter"
                        href={footerData.twitterUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                      >
                        <div
                          className="h-6 w-6 bg-center bg-no-repeat bg-contain"
                          style={{
                            backgroundImage: "url(/twitter.webp)",
                          }}
                        />
                      </a>
                    )}
                    {footerData?.telegramUrl && (
                      <a
                        aria-label="Telegram"
                        href={footerData.telegramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                      >
                        <div
                          className="h-6 w-6 bg-center bg-no-repeat bg-contain"
                          style={{
                            backgroundImage: "url(/telegram.webp)",
                          }}
                        />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:w-[50%]  grid xl:grid-cols-3 gap-5 md:grid-cols-3 md:place-items-start grid-cols-2 md:pt-6 xl:pt-0 xl:mr-[60px]">
              <div>
                <div className="mb-2 font-[600] text-start text-[#1B2124]  xl:text-[20px] xl:leading-[30px] text-[16px] leading-[24px]">
                  Quick Links
                </div>
                {companyData?.map((item, index) => {
                  const pageType = item.pageType;
                  const url =
                    pageType === "Home"
                      ? "/"
                      : `/${pageType.toLowerCase().replace(/\s+/g, "-")}`;

                  return (
                    <ul
                      key={index}
                      className="font-[400] text-start text-[#757575] text-[14px] leading-[20px] "
                    >
                      <li className="mb-2">
                        <a
                          href={`${url}`}
                          className="hover:underline text-[#3D3D3D] hover:text-black"
                        >
                          {pageType}
                        </a>
                      </li>
                    </ul>
                  );
                })}
              </div>
              <div>
                <div className="mb-2 font-[600] text-start text-[#1B2124]  xl:text-[20px] xl:leading-[30px] text-[16px] leading-[24px]">
                  Our Centres
                </div>
                <ul className="font-[400] text-start text-[#757575]   text-[14px] leading-[20px]">
                  <li className="mb-2">
                    <a href="https://www.pw.live/vidyapeeth-centres/new-delhi-dl">
                      <div className="hover:underline text-[#3D3D3D] hover:text-black">
                        New Delhi
                      </div>
                    </a>
                  </li>
                </ul>
                <ul className="font-[400] text-start text-[#757575]   text-[14px] leading-[20px]">
                  <li className="mb-2">
                    <a href="https://www.pw.live/vidyapeeth-centres/patna-br">
                      <div className="hover:underline text-[#3D3D3D] hover:text-black">
                        Patna
                      </div>
                    </a>
                  </li>
                </ul>
                <ul className="font-[400] text-start text-[#757575]   text-[14px] leading-[20px]">
                  <li className="mb-2">
                    <a href="https://www.pw.live/vidyapeeth-centres/kota-rj">
                      <div className="hover:underline text-[#3D3D3D] hover:text-black">
                        Kota
                      </div>
                    </a>
                  </li>
                </ul>
                <ul className="font-[400] text-start text-[#757575]   text-[14px] leading-[20px]">
                  <li className="mb-2">
                    <a href="https://www.pw.live/vidyapeeth-centres/noida-up">
                      <div className="hover:underline text-[#3D3D3D] hover:text-black">
                        Noida
                      </div>
                    </a>
                  </li>
                </ul>
                <ul className="font-[400] text-start text-[#757575]   text-[14px] leading-[20px]">
                  <li className="mb-2">
                    <a href="https://www.pw.live/vidyapeeth-centres/dhanbad-jh">
                      <div className="hover:underline text-[#3D3D3D] hover:text-black">
                        Dhanbad
                      </div>
                    </a>
                  </li>
                </ul>
                <ul className="font-[400] text-start text-[#757575]   text-[14px] leading-[20px]">
                  <li className="mb-2">
                    <a href="https://www.pw.live/vidyapeeth-centres/varanasi-up">
                      <div className="hover:underline text-[#3D3D3D] hover:text-black">
                        Varanasi
                      </div>
                    </a>
                  </li>
                </ul>
                <ul className="font-[400] text-start text-[#757575]   text-[14px] leading-[20px]">
                  <li className="mb-2">
                    <a href="https://www.pw.live/vidyapeeth-centres">
                      <div className="hover:underline text-[#3D3D3D] hover:text-black">
                        View All
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <div className="mb-2 font-[600] text-start text-[#1B2124]  xl:text-[20px] xl:leading-[30px] text-[16px] leading-[24px]">
                  Popular Exams
                </div>
                <ul className="font-[400] text-start text-[#757575]   text-[14px] leading-[20px]">
                  <li className="mb-2">
                    <a href="https://www.pw.live/iit-jee/">
                      <div className="hover:underline text-[#3D3D3D] hover:text-black">
                        IIT JEE
                      </div>
                    </a>
                  </li>
                </ul>
                <ul className="font-[400] text-start text-[#757575]   text-[14px] leading-[20px]">
                  <li className="mb-2">
                    <a href="https://www.pw.live/neet/">
                      <div className="hover:underline text-[#3D3D3D] hover:text-black">
                        NEET
                      </div>
                    </a>
                  </li>
                </ul>
                <ul className="font-[400] text-start text-[#757575]   text-[14px] leading-[20px]">
                  <li className="mb-2">
                    <a href="https://www.pw.live/gate/">
                      <div className="hover:underline text-[#3D3D3D] hover:text-black">
                        GATE
                      </div>
                    </a>
                  </li>
                </ul>
                <ul className="font-[400] text-start text-[#757575]   text-[14px] leading-[20px]">
                  <li className="mb-2">
                    <a href="https://www.pw.live/online-course-physics-wallah-defence-nda">
                      <div className="hover:underline text-[#3D3D3D] hover:text-black">
                        NDA
                      </div>
                    </a>
                  </li>
                </ul>
                <ul className="font-[400] text-start text-[#757575]   text-[14px] leading-[20px]">
                  <li className="mb-2">
                    <a href="https://www.pw.live/upsc">
                      <div className="hover:underline text-[#3D3D3D] hover:text-black">
                        UPSC
                      </div>
                    </a>
                  </li>
                </ul>
                <ul className="font-[400] text-start text-[#757575]   text-[14px] leading-[20px]">
                  <li className="mb-2">
                    <a href="https://www.pw.live/school-prep/">
                      <div className="hover:underline text-[#3D3D3D] hover:text-black">
                        School Prep
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="bg-dashGray text-xs sm:text-sm text-black font-medium font-RedditSans border-t text-center p-4  max-w-[78rem] px-4 md:px-6 mx-auto ">
        <div className="flex md:flex-row flex-col justify-between items-center gap-y-2 ">
          <div className="flex justify-center md:justify-start gap-2 sm:gap-3 items-center">
            <Link href="/privacy-policy">
              <div className="xl:text-[#3D3D3D] xl:text-[14px] xl:leading-[18px] xl:font-[500] text-xs hover:underline ">
                Privacy Policy
              </div>
            </Link>
            <hr className="border h-4" />
            <Link href="/terms-and-condition">
              <div className="xl:text-[#3D3D3D] xl:text-[14px] xl:leading-[18px] xl:font-[500] text-xs hover:underline">
                Terms of use
              </div>
            </Link>
            <hr className="border h-4" />
            <Link href="/refund-policy">
              <div className="xl:text-[#3D3D3D] xl:text-[14px] xl:leading-[18px] xl:font-[500] text-xs hover:underline ">
                Refunds & Cancellation Policy
              </div>
            </Link>
          </div>
          <div className="text-center xl:text-[#3D3D3D] xl:text-[14px] xl:leading-[18px] xl:font-[500] text-[12px] text-[#1B2124]">
            © {new Date().getFullYear()} Website developed by Sachin. All
            Rights Reserved{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
