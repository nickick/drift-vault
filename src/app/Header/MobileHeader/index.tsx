"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NetworkSwitch } from "@/app/Connect";
import { DriftLogo } from "@/app/icons/DriftLogo";
import Twitter from "@/app/icons/Twitter";
import { Sling as Hamburger } from "hamburger-react";
import "./header.css";
import { NavItem } from "../DesktopHeader";
import cx from "classnames";
import { Instagram } from "@/app/icons/Instagram";
import { Discord } from "@/app/icons/Discord";

const leftNavItems: NavItem[] = [
  {
    name: "Prints",
    link: "https://driftershoots.com/prints",
  },
  {
    name: "Gallery",
    link: "https://driftershoots.com/gallery",
  },
  {
    name: "Publications",
    link: "https://driftershoots.com/publications",
  },
  {
    name: "Contact",
    link: "https://driftershoots.com/contact",
    icon: "",
  },
  {
    name: "About",
    link: "https://driftershoots.com/about",
    icon: "",
  },
  {
    name: "Apps",
    link: "",
    subItems: [
      {
        name: "WMVG Migration",
        link: "https://www.wheremyvansgo.com/",
      },
      {
        name: "First Day Out",
        link: "https://firstdayout.driftershoots.com/",
      },
      {
        name: "Drift Vault",
        link: "/",
      },
    ],
  },
];

const rightNavItems: (NavItem & { hidden?: boolean })[] = [
  {
    icon: <Instagram size={22} />,
    link: "https://www.instagram.com/driftershoots",
    hidden: true,
  },
  {
    icon: <Discord size={22} />,
    link: "https://discord.com/invite/kr65XUgPYw",
    hidden: true,
  },
  {
    icon: <Twitter size={18} />,
    link: "https://twitter.com/driftershoots",
  },
];

export const MobileHeader = () => {
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    setLoaded(true);
  }, [address]);

  return (
    <div className="flex items-center justify-center pt-10 pb-14 max-w-screen-xl mx-auto relative">
      <div className="flex space-x-6 items-center absolute left-8">
        <Hamburger toggled={isOpen} toggle={setOpen} size={20} />
      </div>
      <div
        className={cx({
          "fixed inset-0 w-[90%] h-screen z-20 transform transition-transform":
            true,
          "-translate-x-full": !isOpen,
          "-translate-x-0": isOpen,
        })}
      >
        <div className="flex flex-col p-3 bg-mainsite-mobile-gray z-10 w-full h-full justify-center items-center relative">
          <div className="right-8 top-8 absolute">
            <Hamburger
              toggled={isOpen}
              toggle={() => setOpen(false)}
              size={20}
            />
          </div>
          {leftNavItems.map((item) => {
            return <NavbarItem key={item.name} item={item} />;
          })}
          {rightNavItems.map((item, index) => {
            return <NavbarItem key={item.name || "" + index} item={item} />;
          })}
        </div>
      </div>
      <Link href="/" className="py-1">
        <DriftLogo />
      </Link>
      <div className="flex space-x-6 items-center absolute right-12">
        {rightNavItems.map((item, index) => {
          if (item.hidden) return null;
          return <NavbarItem key={item.name || "" + index} item={item} />;
        })}
        {address && loaded && (
          <div className="hidden sm:flex space-x-2">
            <NetworkSwitch />
          </div>
        )}
      </div>
    </div>
  );
};

const NavbarItem = ({ item }: { item: NavItem }) => {
  if (item.subItems) {
    return (
      <div className="flex flex-col justify-center items-center">
        {item.subItems.map((subItem) => {
          return <NavbarItem key={subItem.link} item={subItem} />;
        })}
      </div>
    );
  }
  return (
    <a
      key={item.name}
      href={item.link}
      className="py-2.5 uppercase font-sans text-xs tracking-[0.09em]"
    >
      {item.name ? item.name : <div className="w-[1.2rem]">{item.icon}</div>}
    </a>
  );
};
