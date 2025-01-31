"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <Link href="/" className="text-xl font-bold">
          MySite
        </Link>
        <ul className="flex gap-6">
          {["home", "about", "blog", "contact", "store"].map((page) => (
            <li key={page}>
              <Link href={`/${page}`} className={pathname === `/${page}` ? "underline" : ""}>
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
