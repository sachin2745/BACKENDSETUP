"use client";
import { usePathname } from "next/navigation";
import Footer from "./(components)/Footer";
import Header from "./(components)/Header";
import "./globals.css";
import Contact from "./(components)/Contact";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/login"; // Detect login page

  const [headerData, setHeaderData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/web/header-data`
        );

        if (response.status === 200) {
          setHeaderData(response.data.headerData);
          // console.log("Header data:", response.data.headerData);
        } else {
          console.error(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching header data:", err);
      }
    };

    fetchData();
  }, []);

  if (isLoginPage) {
    return (
      <html lang="en" data-theme="light">
        <head>
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_API_URL}${headerData?.fav180}`}
        />
         <link
          href="https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
        </head>
        <body>
          <main className="min-h-screen">{children}</main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" data-theme="light">
      <head>
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_API_URL}${headerData?.fav180}`}
        />
        {headerData && (
          <script dangerouslySetInnerHTML={{ __html: headerData.gSeoDetail }} />
        )}
        
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Oswald:wght@200..700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Oswald:wght@200..700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Lilita+One&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Oswald:wght@200..700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Lilita+One&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Oswald:wght@200..700&family=Syne:wght@400..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Allura&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Glass+Antiqua&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Style+Script&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Clicker+Script&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.BUILDER_HYDRATION_OVERLAY = true;
            `,
          }}
        />
        <script
          src="https://code.jquery.com/jquery-3.7.1.js"
          integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
          crossOrigin="anonymous"
        ></script>
        <link
          href="https://cdn.datatables.net/v/dt/dt-2.2.0/datatables.min.css"
          rel="stylesheet"
        />
        <script src="https://cdn.datatables.net/v/dt/dt-2.2.0/datatables.min.js"></script>
        {/* <!-- DataTables CSS --> */}
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/1.13.5/css/jquery.dataTables.min.css"
        />
        {/* <!-- Buttons Extension CSS --> */}
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css"
        />
        {/* <!-- jQuery --> */}
        {/* <!-- DataTables JS --> */}
        <script src="https://cdn.datatables.net/1.13.5/js/jquery.dataTables.min.js"></script>
        {/* <!-- Buttons Extension JS --> */}
        <script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
        <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
        <script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
        {/* <!-- JSZip (for Excel export) --> */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
        {/* <!-- pdfMake (for PDF export) --> */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>
      </head>

      <body className="">
        {!isAdminPage && <Header />}
        <main className="min-h-screen">{children}</main>
        {!isAdminPage && <Contact />}
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}
