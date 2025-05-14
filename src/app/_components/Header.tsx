import Link from "next/link";
import { Button } from "./ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { PiSignInLight } from "react-icons/pi";

export default function Header() {
  const { data, status } = useSession();

  const handleSignin = async () => {
    await signIn("google");
  };

  const handleSignout = async () => {
    await signOut();
  };

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

  const image = data?.user?.image;

  return (
    <header className="sticky top-0 z-50 bg-opacity-80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link className="flex items-center space-x-2" href="#">
          <Image
            src="/assets/coding.png"
            width="30"
            height="30"
            alt="CodeShare Logo"
          />
          <span className="text-lg font-bold text-black">CodeShare</span>
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 transform space-x-4 md:flex">
          <Button
            onClick={() => scrollToSection("features")}
            variant="ghost"
            className="h-10 text-gray-700 hover:bg-transparent hover:text-black"
          >
            Features
          </Button>
          <Button
            onClick={() => scrollToSection("faq")}
            variant="ghost"
            className="h-10 text-gray-700 hover:bg-transparent hover:text-black"
          >
            FAQs
          </Button>
        </nav>
        <div className="flex items-center space-x-4">
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild={true}>
                <Avatar className="h-8 w-8 cursor-pointer ring-offset-background transition-opacity hover:opacity-80">
                  <AvatarImage src={image ?? ""} />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 border border-gray-300 bg-[#f5f5f5] text-black shadow-xl"
              >
                <DropdownMenuItem
                  onClick={handleSignout}
                  className="cursor-pointer transition-colors duration-200 hover:bg-[#e0e0e0]"
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
              className="border-0 bg-transparent text-black transition-colors duration-200 hover:bg-[#e0e0e0] hover:text-black"
            >
              <PiSignInLight size="16" className="mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
