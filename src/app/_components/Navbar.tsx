import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FiShare2 } from "react-icons/fi";
import { PiSignInLight } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const [heading, setHeading] = useState("Untitled");
  const { status } = useSession();

  const handleSignin = async () => {
    await signIn("google");
  };

  const handleSignout = async () => {
    await signOut();
  };

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
        <Button
          variant="outline"
          className="border-0 bg-[#2D2D2D] px-2 py-1 text-sm text-white"
        >
          Share
          <FiShare2 size="16" className="ml-1" />
        </Button>
        {status === "authenticated" ? (
          <Button
            onClick={handleSignout}
            variant="outline"
            className="border-0 bg-[#2D2D2D] px-2 py-1 text-sm text-white"
          >
            Sign Out
            <PiSignInLight size="19" className="ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSignin}
            variant="outline"
            className="border-0 bg-[#2D2D2D] px-2 py-1 text-sm text-white"
          >
            Sign In
            <PiSignInLight size="19" className="ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
