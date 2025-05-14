// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 text-black md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <Link href="#" className="flex items-center">
              <Image
                src="/assets/coding.png"
                width="20"
                height="20"
                alt="CodeShare Logo"
                className="mr-2"
              />
              <span className="text-base font-semibold text-black">
                CodeShare
              </span>
            </Link>
            <p className="mt-2 text-xs">
              © 2025 CodeShare. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:justify-end">
            <Link
              className="transition-colors duration-200 hover:text-black"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="transition-colors duration-200 hover:text-black"
              href="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="transition-colors duration-200 hover:text-black"
              href="#"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
