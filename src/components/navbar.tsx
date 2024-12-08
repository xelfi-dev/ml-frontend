"use client";

import Image from "next/image";
import Link from "next/link";
import { animate } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";
import { useScroll } from "@/app/hooks/use-scroll";

export const Navbar = () => {
  const refLogo = React.useRef(null);
  const refProfile = React.useRef(null);
  const { scrolled } = useScroll();

  React.useEffect(() => {
    if (refLogo.current && refProfile.current) {
      animate(
        refLogo.current,
        {
          opacity: scrolled ? 1 : 0,
          x: scrolled ? -30 : -60,
        },
        { duration: 0.3 }
      );
      animate(
        refProfile.current,
        {
          opacity: scrolled ? 1 : 0,
          x: scrolled ? 80 : 100,
        },
        { duration: 0.3 }
      );
    }
  }, [scrolled]);

  return (
    <header className="animate-in fade-in slide-in-from-top-2 sticky top-0 z-50 w-full duration-500">
      <div className="relative transition-all duration-300 pl-8">
        <div>
          <Link
            href={"/"}
            suppressHydrationWarning
            className={cn(
              "absolute pointer-events-auto transition-all duration-300",
              {
                "translate-x-[-10px] opacity-0 hover:opacity-0 pointer-events-none":
                  scrolled,
              }
            )}
          >
            <Image
              src={"/tl.png"}
              alt="logo"
              loading="lazy"
              width={40}
              height={40}
              className="mt-3"
            />
          </Link>
        </div>
      </div>
      <div
        className={cn(
          "pointer-events-auto absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[50%] rounded-full bg-gray-300/0 px-1 py-[6px] backdrop-blur-md transition-all duration-300 lg:block py-2 min-h-[40px]",
          {
            "bg-gray-800/70 shadow-md": scrolled,
          }
        )}
      >
        <div className="overflow-hidden h-[28px]">
          <div
            suppressHydrationWarning
            className={cn("relative transition-all duration-300", {
              "ml-[20px] mr-[30px]": scrolled,
            })}
          >
            <Link
              href={"/"}
              className={`relative group text-foreground/60 hover:text-foreground/80 hover:text-white hover:delay-100 hover:duration-300 text-center ml-4 mr-3`}
            >
              Home
            </Link>
            <Link
              href={"/profile"}
              className={`relative group text-foreground/60 hover:text-foreground/80 hover:text-white hover:delay-100 hover:duration-300 text-center ml-4 mr-3`}
            >
              Profile
            </Link>
            <Link
              href={"/recommendations"}
              className={`relative group text-foreground/60 hover:text-foreground/80 hover:text-white hover:delay-100 hover:duration-300 text-center ml-4`}
            >
              Recommendations
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
