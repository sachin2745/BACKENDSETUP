import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white text-xs sm:text-sm text-black font-medium font-RedditSans border-t text-center p-4 mt-8 max-w-[78rem] px-4 md:px-6 mx-auto ">
      <div className="flex md:flex-row flex-col justify-between items-center gap-y-2 ">
        <div className="flex justify-center md:justify-start gap-2 sm:gap-3 items-center">
          <Link href="/privacy-policy">
            <div className="xl:text-[#3D3D3D] xl:text-[14px] xl:leading-[18px] xl:font-[500] text-xs hover:underline ">
              Privacy Policy
            </div>
          </Link>
          <hr className="border h-4" />
          <Link href="/terms-and-conditions">
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
        © {new Date().getFullYear()} Blog Portal developed by Sachin. All Rights Reserved        </div>
      </div>
    </footer>

   
  );
};

export default Footer;
