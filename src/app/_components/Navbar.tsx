import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FiUser } from "react-icons/fi";
import { PiSignInLight } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [heading, setHeading] = useState("Untitled");

  return (
    <div className="h-18 flex items-center justify-between bg-[#1f1e1e] p-3">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Image src="/assets/coding.png" alt="logo" width="40" height="40" />
        </Link>
        <Input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="border-none bg-[#212121] p-1 text-sm text-white focus:ring-0"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="px-2 py-1 text-sm">
          Share
          <FiUser size="15" className="ml-1" />
        </Button>
        <Button className="px-2 py-1 text-[13px] text-white">
          <PiSignInLight size="18" className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
