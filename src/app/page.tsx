"use client";

import Link from "next/link";
import { FilePlus } from "lucide-react";
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
import Image from "next/image";
import { Avatar, AvatarImage } from "./_components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./_components/ui/dropdown-menu";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Component() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
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
    <div className="cursor:default relative flex min-h-screen flex-col bg-gradient-to-b from-[#1b1b1c] to-[#111111]  text-gray-100">
      <header className="sticky top-0 z-50 bg-opacity-80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link className="flex items-center space-x-2" href="#">
            <Image
              src="/assets/coding.png"
              width="30"
              height="30"
              alt="CodeShare Logo"
            />
            <span className="text-lg font-bold text-white">CodeShare</span>
          </Link>
          <nav className="absolute left-1/2 hidden -translate-x-1/2 transform space-x-4 md:flex">
            <Button
              onClick={() => scrollToSection("features")}
              variant="ghost"
              className="h-10 text-gray-300 hover:bg-transparent hover:text-white"
            >
              Features
            </Button>
            <Button
              onClick={() => scrollToSection("faq")}
              variant="ghost"
              className="h-10 text-gray-300 hover:bg-transparent hover:text-white"
            >
              FAQs
            </Button>
          </nav>
          <div className="flex items-center space-x-4">
            {
              // status === "loading" ? (
              // <Avatar className="h-8 w-8">
              //   <AvatarFallback>😎</AvatarFallback>
              // </Avatar>
              // ) :
              status === "authenticated" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild={true}>
                    <Avatar className="h-8 w-8 cursor-pointer ring-offset-background transition-opacity hover:opacity-80">
                      <AvatarImage src={image ?? ""} />
                      {/* <AvatarFallback>😎</AvatarFallback> */}
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-40 border border-gray-700 bg-[#1f1e1e] text-white shadow-xl"
                  >
                    <DropdownMenuItem
                      onClick={handleSignout}
                      className="cursor-pointer transition-colors duration-200 hover:bg-[#2a2a2a]"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={handleSignin}
                  variant="outline"
                  size="sm"
                  className="border-0 bg-transparent text-white transition-colors duration-200 hover:bg-[#3a3a3a] hover:text-white"
                >
                  <PiSignInLight size="16" className="mr-2" />
                  Sign In
                </Button>
              )
            }
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative w-full bg-gradient-to-b from-[#1c1b1b] to-[#111111] py-24 md:py-28 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center space-y-4 text-center lg:space-y-8">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                <span className="gradient-text">Collaborate on code</span>
                <br />
                with developers
              </h1>
              <p className="max-w-2xl text-base text-gray-300 md:text-lg">
                Collaborate in real-time, share code, and bring ideas to life
                with developers worldwide.
              </p>
              <Button
                onClick={handleButtonClick}
                className="w-30 h-11 transform rounded-lg bg-white text-base text-black shadow-lg hover:bg-slate-300 md:px-5 md:py-4"
              >
                <FilePlus className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                New File
              </Button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto mt-20 max-w-6xl overflow-hidden rounded-lg shadow-lg"
          >
            <Image
              src="/assets/hero.png"
              alt="Hero Image"
              width={1200}
              height={600}
              className="rounded-lg object-cover"
            />
          </motion.div>
        </section>
        <section id="features" className="bg-[#111111] px-6 py-24 md:px-12">
          <div className="container mx-auto max-w-6xl">
            <h2 className="mb-16 text-center text-2xl font-bold text-white md:text-3xl">
              Features
            </h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="mb-16 grid grid-cols-1 items-center gap-8 md:grid-cols-2"
            >
              <motion.div variants={fadeInUp} className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Real-time Collaboration
                </h3>
                <p className="text-base text-gray-300">
                  Work seamlessly with your team in real-time. View active users
                  in the editor, with upcoming features such as cursor tracking
                  and selection sharing for an enhanced collaborative
                  experience.
                </p>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="feature-image relative h-[280px] overflow-hidden rounded-xl"
              >
                <Image
                  src="/assets/collab.png"
                  fill
                  style={{ objectFit: "cover" }}
                  alt="Real-time Collaboration"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="mb-24 grid grid-cols-1 items-center gap-8 md:grid-cols-2"
            >
              <motion.div
                variants={fadeInUp}
                className="feature-image relative order-2 h-[280px] overflow-hidden rounded-xl md:order-1"
              >
                <Image
                  src="/assets/fab.png"
                  fill
                  style={{ objectFit: "cover" }}
                  alt="Floating Action Bar"
                />
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="order-1 space-y-4 md:order-2"
              >
                <h3 className="text-xl font-bold text-white">
                  Floating Action Bar
                </h3>
                <p className="text-base text-gray-300">
                  Enhance your coding experience with a floating action bar that
                  provides quick access to essential tools like fullscreen mode,
                  copy functionality, file favoriting, and more.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="mb-24 grid grid-cols-1 items-center gap-8 md:grid-cols-2"
            >
              <motion.div variants={fadeInUp} className="space-y-4">
                <h3 className="text-xl font-bold text-white">Quick Search</h3>
                <p className="text-base text-gray-300">
                  Find files instantly with an intelligent search feature that
                  allows you to filter through your codebase efficiently,
                  including a dedicated section for your favorite files.
                </p>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="feature-image relative h-[280px] overflow-hidden rounded-xl"
              >
                <Image
                  src="/assets/search2.png"
                  fill
                  style={{ objectFit: "cover" }}
                  alt="Quick Search"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 items-center gap-8 md:grid-cols-2"
            >
              <motion.div
                variants={fadeInUp}
                className="feature-image relative order-2 h-[280px] overflow-hidden rounded-xl md:order-1"
              >
                <Image
                  src="/assets/share4.png"
                  fill
                  style={{ objectFit: "cover" }}
                  alt="Instant Sharing"
                />
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="order-1 space-y-4 md:order-2"
              >
                <h3 className="text-xl font-bold text-white">
                  Instant Sharing
                </h3>
                <p className="text-base text-gray-300">
                  Share your code effortlessly with a single click. Use the
                  View-only mode: &quot;view-only&quot; option to allow others
                  to see your work without making changes, ensuring full control
                  over your code.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="faq" className="w-full bg-[#111111] py-24 md:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-slate-4 mb-12 text-center text-xl font-bold md:mb-16 md:text-2xl">
              Frequently Asked Questions
            </h2>
            <Accordion
              type="single"
              collapsible
              className="mx-auto w-full max-w-2xl"
            >
              <AccordionItem value="item-4" className="mb-4">
                <AccordionTrigger className="text-base font-semibold text-white md:text-lg">
                  What can I use Codeshare for?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  You can use Codeshare for everything code sharing, like pair
                  programming, sharing code online with your team, tech
                  interviews, teaching... you name it.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="mb-4">
                <AccordionTrigger className="text-base font-semibold text-white md:text-lg">
                  How long does a file last?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Forever (unless the creator of the file deletes it).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7" className="mb-4">
                <AccordionTrigger className="text-base font-semibold text-white md:text-lg">
                  How can I compile or run the code?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  You can&apos;t. Codeshare is not intended to run or compile
                  code; it is just meant to share and edit code collaboratively.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8" className="mb-4">
                <AccordionTrigger className="text-base font-semibold text-white md:text-lg">
                  Can anyone see a file I created?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Yes, as long as they have the file link. So, never put
                  confidential information inside a file.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-9" className="mb-4">
                <AccordionTrigger className="text-base font-semibold text-white md:text-lg">
                  Can I prevent a file from being modified by other people?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Yes, just turn the &quot;view-only&quot; option on when you
                  share the file or from your Dashboard. Keep in mind that this
                  option can only be changed by the user who created the file.
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
                  width="20"
                  height="20"
                  alt="CodeShare Logo"
                  className="mr-2"
                />
                <span className="text-base font-semibold text-white">
                  CodeShare
                </span>
              </Link>
              <p className="mt-2 text-xs">
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
