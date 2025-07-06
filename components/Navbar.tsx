"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Social Share", href: "/social-share" },
  { label: "Video Upload", href: "/video-upload" },
  { label: "Add Effetcts", href: "/add-effects" },
  { label: "Background Fill", href: "/bg-fill" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="Fixed  top-0 z-50 w-full bg-[#0f0c29]/80 backdrop-blur-md border-b border-fuchsia-500/30 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl p-2 font-extrabold bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-transparent bg-clip-text"
        >
          Image Lab
        </Link>

        {/* Desktop Nav */}
        <SignedIn>
          <ul className="hidden md:flex gap-10 items-center text-base font-medium">
            {navLinks.map((link) => (
              <li key={link.href} className="bg-white/5 px-4 py-2 rounded">
                <Link
                  href={link.href}
                  className={`transition-colors hover:text-fuchsia-400 gap-4 ${
                    pathname === link.href
                      ? "text-fuchsia-400  underline-offset-4"
                      : "text-white/90"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </SignedIn>

        {/* User Buttons / Auth */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in">
              <Button className="bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                variant="outline"
                className="border-fuchsia-500 text-fuchsia-300 hover:bg-fuchsia-500/10"
              >
                Sign Up
              </Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton
              afterSwitchSessionUrl="/social-share"
              appearance={{
                elements: {
                  userButtonAvatarBox: "ring-2 ring-fuchsia-500",
                  userButtonPopoverCard:
                    "bg-[#1a1a2e] text-white border border-fuchsia-500/20 shadow-lg",
                  userButtonPopoverActionButtonText:
                    "text-white hover:text-fuchsia-400",
                },
              }}
            />
          </SignedIn>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-fuchsia-400">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="bg-[#0f0c29] text-white">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-transparent bg-clip-text">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <SignedIn>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block text-lg font-medium p-4 ${
                        pathname === link.href
                          ? "text-fuchsia-400 "
                          : "text-white hover:text-fuchsia-300"
                      }`}
                    >
                      {link.label}
                    </Link>
                    
                    
                    
                    
                  ))}
                </SignedIn>

                <div className="p-4">
                  <UserButton afterSwitchSessionUrl="/home"  />
                </div>

                <SignedOut>
                  <div className="flex flex-col gap-3 pt-4">
                    <Link href="/sign-in">
                      <Button className="w-full bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button
                        variant="outline"
                        className="w-full border-fuchsia-500 text-fuchsia-300 hover:bg-fuchsia-500/10"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </SignedOut>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
