import { useEffect, useState } from "react";

const MOBILE_WIDTH = 640; // default pixel minimum width for sm breakpoint on Tailwind

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_WIDTH);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_WIDTH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};
