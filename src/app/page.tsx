"use client";

import Link from "next/link";
import { Code, FilePlus, Users } from "lucide-react";
import {
  AccordionContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "./_components/ui/accordion";
import { Button } from "./_components/ui/button";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { PiSignInLight } from "react-icons/pi";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaListUl } from "react-icons/fa";
import Image from "next/image";
import { FaQuestionCircle } from "react-icons/fa";
import { IoRocket } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "./_components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./_components/ui/dropdown-menu";

export default function Component() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const router = useRouter();
  const id = nanoid(10);

  const handleButtonClick = () => {
    router.push(`/f/${id}`);
  };

  const { data, status } = useSession();

  const handleSignin = async () => {
    await signIn("google");
  };

  const handleSignout = async () => {
    await signOut();
  };

  const image = data?.user?.image;

  return (
    <div className="polka-dot relative flex min-h-screen flex-col bg-gray-900 text-gray-100">
      <header className="sticky top-0 z-50 bg-[#1c1b1b] bg-opacity-80 shadow-md backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link className="flex items-center space-x-2" href="#">
            <Image
              src="/assets/coding.png"
              width="36"
              height="36"
              alt="CodeShare Logo"
            />
            <span className="text-xl font-bold text-white">CodeShare</span>
          </Link>
          <nav className="hidden space-x-4 md:flex">
            <Button
              onClick={() => scrollToSection("features")}
              variant="ghost"
              className="text-gray-300"
            >
              <FaListUl className="mr-2" />
              Features
            </Button>
            <Button
              onClick={() => scrollToSection("faq")}
              variant="ghost"
              className="text-gray-300"
            >
              <FaQuestionCircle className="mr-2" />
              FAQ
            </Button>
          </nav>
          <div className="flex items-center space-x-4">
            {status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={image ?? ""} />
                    <AvatarFallback>
                      {data?.user?.name?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-2 border-gray-700 bg-gray-800">
                  <DropdownMenuItem
                    onClick={handleSignout}
                    className="text-white hover:bg-gray-700"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleSignin}
                variant="default"
                className="border-3px border-white bg-[#17171a] text-white hover:bg-[#474751]"
              >
                Sign In
                <PiSignInLight size="18" className="ml-2" />
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="hero-gradient relative w-full py-12 md:py-16 lg:py-20 xl:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center space-y-6 text-center lg:space-y-8">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="gradient-text">Collaborate on code</span>
                <br />
                with developers
              </h1>
              <p className="max-w-2xl text-lg text-gray-300 md:text-xl">
                Collaborate in real-time, share code, and bring ideas to life
                with developers worldwide.
              </p>
              <Button
                onClick={handleButtonClick}
                className="transform rounded-lg bg-white px-4 py-4 text-base text-black shadow-lg hover:bg-slate-300 md:px-6 md:py-6 md:text-lg"
              >
                <FilePlus className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                New File
              </Button>
            </div>
          </div>
        </section>
        <section id="features" className="w-full bg-[#1a1a1a] py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className=" mb-12 text-center text-2xl font-bold text-slate-400 md:mb-16 md:text-3xl lg:text-4xl">
              Powerful Features for Seamless Collaboration
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <div className=" rounded-lg border border-white bg-[#191919] p-6">
                <Code className="mb-4 h-10 w-10 text-white md:h-12 md:w-12" />
                <h3 className="mb-2 text-lg font-semibold text-white md:text-xl">
                  Real-time Collaboration
                </h3>
                <p className="text-gray-300">
                  Work together with your team in real-time. See changes
                  instantly and collaborate seamlessly.
                </p>
              </div>
              <div className=" rounded-lg border border-white bg-[#191919] p-6">
                <Users className="mb-4 h-10 w-10 text-white md:h-12 md:w-12" />
                <h3 className="mb-2 text-lg font-semibold text-white md:text-xl">
                  Multi-user Editing
                </h3>
                <p className="text-gray-300">
                  Multiple users can edit the same file simultaneously without
                  conflicts.
                </p>
              </div>
              <div className=" rounded-lg border border-white bg-[#191919] p-6">
                <IoRocket className="mb-4 h-10 w-10 text-white md:h-12 md:w-12" />
                <h3 className="mb-2 text-lg font-semibold text-white md:text-xl">
                  Easy File Sharing
                </h3>
                <p className="text-gray-300">
                  Share files with a single link. No complicated setups
                  required.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full bg-[#111111] py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-slate-4 mb-12 text-center text-2xl font-bold md:mb-16 md:text-3xl lg:text-4xl">
              Frequently Asked Questions
            </h2>
            <Accordion
              type="single"
              collapsible
              className="mx-auto w-full max-w-2xl"
            >
              <AccordionItem value="item-1" className="mb-4">
                <AccordionTrigger className="text-base font-semibold text-white hover:text-indigo-400 md:text-lg">
                  How does CodeShare work?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  CodeShare uses real-time synchronization to allow multiple
                  users to edit the same file simultaneously. Our advanced
                  conflict resolution ensures smooth collaboration without data
                  loss.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="mb-4">
                <AccordionTrigger className="text-base font-semibold text-white hover:text-indigo-400 md:text-lg">
                  Is CodeShare free to use?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Yes, CodeShare offers a free tier with basic features. Premium
                  plans are available for advanced functionality, including
                  unlimited collaborators, extended file history, and priority
                  support.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="mb-4">
                <AccordionTrigger className="text-base font-semibold text-white hover:text-indigo-400 md:text-lg">
                  What programming languages does CodeShare support?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  CodeShare supports a wide range of programming languages,
                  including but not limited to JavaScript, Python, Java, C++,
                  Ruby, and many more. Our syntax highlighting and
                  language-specific features enhance the coding experience.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      <footer className="bg-[#17171a] py-6 text-gray-400 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <Link href="#" className="flex items-center">
                <Image
                  src="/assets/coding.png"
                  width="24"
                  height="24"
                  alt="CodeShare Logo"
                  className="mr-2"
                />
                <span className="text-lg font-semibold text-white">
                  CodeShare
                </span>
              </Link>
              <p className="mt-2 text-sm">
                © 2025 CodeShare. All rights reserved.
              </p>
            </div>
            <nav className="flex flex-wrap justify-center gap-4 md:justify-end">
              <Link
                className="transition-colors duration-200 hover:text-white"
                href="#"
              >
                Terms of Service
              </Link>
              <Link
                className="transition-colors duration-200 hover:text-white"
                href="#"
              >
                Privacy Policy
              </Link>
              <Link
                className="transition-colors duration-200 hover:text-white"
                href="#"
              >
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
