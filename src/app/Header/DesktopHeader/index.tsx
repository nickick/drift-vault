"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NetworkSwitch } from "../../Connect";
import { Discord } from "../../icons/Discord";
import { DriftLogo } from "../../icons/DriftLogo";
import { Instagram } from "../../icons/Instagram";
import Twitter from "../../icons/Twitter";
import "./header.css";
import DownArrow from "@/app/icons/DownArrow";

export type NavItem = {
  name?: string;
  icon?: React.ReactNode;
  link: string;
  subItems?: NavItem[];
};

export const leftNavItems: NavItem[] = [
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
        name: "Driftershoots Vault",
        link: "/",
      },
    ],
  },
];

export const rightNavItems: NavItem[] = [
  {
    name: "About",
    link: "https://driftershoots.com/about",
  },
  {
    name: "Contact",
    link: "https://driftershoots.com/contact",
  },
  {
    icon: <Instagram size={22} />,
    link: "https://www.instagram.com/driftershoots",
  },
  {
    icon: <Twitter size={18} />,
    link: "https://twitter.com/driftershoots",
  },
  {
    icon: <Discord size={22} />,
    link: "https://discord.com/invite/kr65XUgPYw",
  },
];

export const Header = () => {
  const [loaded, setLoaded] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    setLoaded(true);
  }, [address]);

  return (
    <div className="flex items-center justify-center pt-[3.62rem] pb-16 max-w-between-lg-xl mx-auto relative">
      <div className="flex space-x-6 justify-between items-center absolute left-[0.7rem]">
        {leftNavItems.map((item, i) => {
          return <NavbarItem key={`${item.name}-${i}`} item={item} />;
        })}
      </div>
      <Link href="/" className="py-1">
        <DriftLogo />
      </Link>
      <div className="flex space-x-6 justify-between items-center absolute right-4">
        {rightNavItems.map((item, i) => {
          return <NavbarItem key={`${item.name}-${i}`} item={item} />;
        })}
        {address && loaded && (
          <div className="flex space-x-2">
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
      <details className="dropdown">
        <summary className="uppercase font-sans text-xs tracking-[0.09em] btn bg-black border-none p-0 m-0 hover:bg-black gap-0">
          {item.name} <DownArrow />
        </summary>
        <ul className="p-2 shadow menu dropdown-content z-[1] w-52">
          {item.subItems.map((subItem, i) => {
            return (
              <li key={`${item.link}-${i}`}>
                <NavbarItem item={subItem} />
              </li>
            );
          })}
        </ul>
      </details>
    );
  }
  return (
    <div className="flex items-center">
      <a
        key={item.name}
        href={item.link}
        className="uppercase font-sans text-xs tracking-[0.09em]"
        target="_blank"
        rel="noreferrer"
      >
        {item.name ? item.name : <div className="w-[1.2rem]">{item.icon}</div>}
      </a>
      {item.subItems && <DownArrow />}
    </div>
  );
};
