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
    <div className="polka-dot relative flex min-h-screen flex-col text-gray-100">
      <header className="mt-2 flex h-12 items-center px-3 lg:px-5">
        <div className="flex flex-row items-center">
          <Link className="flex items-center" href="#">
            <Image
              src="/assets/coding.png"
              width="36"
              height="36"
              alt="image"
            />
            <span className="ml-2 text-lg font-bold ">CodeShare</span>
          </Link>
        </div>

        <nav className="ml-auto flex flex-row items-center justify-center gap-3 sm:gap-4">
          <Button
            onClick={() => scrollToSection("features")}
            variant="ghost"
            className="flex items-center text-base font-medium text-gray-300"
          >
            <FaListUl className="mr-1" />
            Features
          </Button>

          <Button
            onClick={() => scrollToSection("faq")}
            variant="ghost"
            className="flex items-center text-base font-medium text-gray-300"
          >
            <FaQuestionCircle className="mr-1" />
            FAQ
          </Button>

          <Button
            onClick={() => scrollToSection("contribute")}
            variant="ghost"
            className="flex items-center text-base font-medium text-gray-300"
          >
            <IoRocket className="mr-1" />
            Contribute
          </Button>
          <div className="flex gap-2">
            {
              // status === "loading" ? (
              // <Avatar className="h-8 w-8">
              //   <AvatarFallback>😎</AvatarFallback>
              // </Avatar>
              // ) :
              status === "authenticated" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src={image ?? ""} />
                      {/* <AvatarFallback>😎</AvatarFallback> */}
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="border border-gray-700 bg-[#1f1e1e] text-white shadow-lg hover:bg-[#1f1e1e]"
                    style={{
                      transform: "translate(-1.5rem, 0.5rem)",
                    }}
                  >
                    <DropdownMenuItem
                      onClick={handleSignout}
                      className="cursor-pointer hover:bg-[#1f1e1e]"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={handleSignin}
                  variant="outline"
                  className="border-0 bg-[#2D2D2D] px-2 py-1 text-sm text-white"
                >
                  Sign In
                  <PiSignInLight size="18" className="ml-1" />
                </Button>
              )
            }
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <section className="lg:py-26 w-full py-16 md:py-24">
          <div className="container mx-auto px-3 md:px-4">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-3">
                <div className="text-[15px] font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                  Collaborate on code with developers
                  <span className="text-blue-500">.</span>{" "}
                </div>
                <p className="custom-font mx-auto max-w-[600px] text-base text-gray-400 md:text-lg lg:text-xl">
                  Share, edit, and create together as you connect with fellow
                  developers and bring your ideas to life.{" "}
                </p>
              </div>
              <div className="y-4 space-x-4">
                <Button
                  onClick={handleButtonClick}
                  className="bg-blue-600 px-6 py-7 text-lg text-white hover:bg-blue-700"
                >
                  <FilePlus className="mr-2 h-6 w-6" />
                  New File
                </Button>
              </div>
              {/* <div className="custom-font text-gray-400">
                No sign up. Free. Forever ❤️
              </div> */}
              <div className=" pr-80">
                <Image
                  src="/assets/getstarted.png"
                  width={225}
                  height={225}
                  alt="image"
                />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-16 md:py-24 lg:py-36">
          <div className="container mx-auto px-3 md:px-4">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              Features
            </h2>
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <li className="flex items-center space-x-3 text-base text-gray-300">
                <Code className="h-5 w-5 text-blue-400" />
                <span>Real-time collaboration</span>
              </li>
              <li className="flex items-center space-x-3 text-base text-gray-300">
                <Users className="h-5 w-5 text-blue-400" />
                <span>Multi-user editing</span>
              </li>
              <li className="flex items-center space-x-3 text-base text-gray-300">
                <FilePlus className="h-5 w-5 text-blue-400" />
                <span>Easy file sharing</span>
              </li>
            </ul>
          </div>
        </section>
        <section id="faq" className="w-full py-16 md:py-24 lg:py-36">
          <div className="container mx-auto px-3 md:px-4">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              FAQ
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-base">
                  How does CodeShare work?
                </AccordionTrigger>
                <AccordionContent className="text-sm">
                  CodeShare uses real-time synchronization to allow multiple
                  users to edit the same file simultaneously. Our advanced
                  conflict resolution ensures smooth collaboration without data
                  loss.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-base">
                  Is CodeShare free to use?
                </AccordionTrigger>
                <AccordionContent className="text-sm">
                  Yes, CodeShare offers a free tier with basic features. Premium
                  plans are available for advanced functionality, including
                  unlimited collaborators, extended file history, and priority
                  support.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-base">
                  What programming languages does CodeShare support?
                </AccordionTrigger>
                <AccordionContent className="text-sm">
                  CodeShare supports a wide range of programming languages,
                  including but not limited to JavaScript, Python, Java, C++,
                  Ruby, and many more. Our syntax highlighting and
                  language-specific features enhance the coding experience.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
        <section id="contribute" className="w-full py-16 md:py-24 lg:py-36">
          <div className="container mx-auto px-3 md:px-4">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              Contribute
            </h2>
            <p className="mb-6 text-base text-gray-400">
              We welcome contributions from the community. Here&apos;s how you
              can get involved:
            </p>
            <ul className="mb-8 list-inside list-disc text-base text-gray-300">
              <li>
                Report bugs and suggest features on our GitHub issues page
              </li>
              <li>Contribute code by submitting pull requests</li>
              <li>Help improve our documentation</li>
            </ul>
            <Button className="bg-blue-600 px-4 py-2 text-base text-white hover:bg-blue-700">
              Join Our Community
            </Button>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-3 border-t border-gray-800 px-3 py-6 sm:flex-row md:px-4">
        <p className="text-xs text-gray-500">
          © 2025 CodeShare. All rights reserved.
        </p>
        <nav className="flex gap-3 sm:ml-auto sm:gap-4">
          <Link
            className="text-xs text-gray-400 underline-offset-4 hover:underline"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs text-gray-400 underline-offset-4 hover:underline"
            href="#"
          >
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
