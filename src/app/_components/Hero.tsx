import { Button } from "./ui/button";
import { FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  const router = useRouter();
  const id = nanoid(10);

  const handleButtonClick = () => {
    router.push(`/f/${id}`);
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] py-24 md:py-28 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4 text-center lg:space-y-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span style={{ color: "black" }}>Collaborate on code</span>
            <br />
            with developers
          </h1>
          <p className="max-w-2xl text-base text-gray-700 md:text-lg">
            Collaborate in real-time, share code, and bring ideas to life with
            developers worldwide.
          </p>
          <Button
            onClick={handleButtonClick}
            className="w-30 h-12 transform rounded-lg bg-black text-base text-white shadow-lg hover:bg-gray-700 md:px-5 md:py-4"
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
          src="/assets/hero_new.png"
          alt="Hero Image"
          width={1200}
          height={600}
          className="rounded-lg object-cover"
        />
      </motion.div>
    </section>
  );
}
