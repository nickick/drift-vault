"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NetworkSwitch } from "@/app/Connect";
import { DriftLogo } from "@/app/icons/DriftLogo";
import Twitter from "@/app/icons/Twitter";
import { Sling as Hamburger } from "hamburger-react";
import "./header.css";
import { NavItem, leftNavItems } from "../DesktopHeader";
import cx from "classnames";

const rightNavItems: NavItem[] = [
  {
    icon: <Twitter size={22} />,
    link: "",
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
    <div className="flex items-center justify-center pt-6 pb-14 max-w-screen-xl mx-auto relative">
      <div className="flex space-x-6 items-center absolute left-6">
        <Hamburger
          toggled={isOpen}
          toggle={setOpen}
        />
      </div>
      <div
        className={cx({
          "fixed inset-0 h-screen w-screen z-20 transform transition-transform":
            true,
          "-translate-x-full": !isOpen,
          "translate-x-0": isOpen,
        })}
      >
        <div className="flex flex-col p-3 bg-black z-10 w-full h-full justify-center items-center relative">
          <div className="left-4 top-4 absolute">
            <Hamburger
              toggled={isOpen}
              toggle={() => setOpen(false)}
            />
          </div>
          {leftNavItems.map((item) => {
            return (
              <NavbarItem
                key={item.name}
                item={item}
              />
            );
          })}
          {rightNavItems.map((item, index) => {
            return (
              <NavbarItem
                key={item.name || "" + index}
                item={item}
              />
            );
          })}
        </div>
      </div>
      <Link
        href="/"
        className="py-1"
      >
        <DriftLogo />
      </Link>
      <div className="flex space-x-6 items-center absolute right-10">
        {rightNavItems.map((item, index) => {
          return (
            <NavbarItem
              key={item.name || "" + index}
              item={item}
            />
          );
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
  return (
    <a
      key={item.name}
      href={item.link}
      className="py-3 uppercase font-sans text-lg tracking-[0.09em]"
    >
      {item.name ? item.name : <div className="w-[1.2rem]">{item.icon}</div>}
    </a>
  );
};
