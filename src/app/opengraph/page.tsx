import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="w-[1200px] h-[630px] overflow-hidden relative">
      <div className="font-serif absolute top-2/3 left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-white z-10 text-[10rem]">
        <div className="flex space-x-36 items-end">
          <div className="text-[8rem] leading-none">Vaulted</div>
          <div className="text-[4rem] whitespace-nowrap relative bottom-0">
            by Driftershoots
          </div>
        </div>
      </div>
      <Image
        src={"/images/moment-print-1.jpeg"}
        width={1200}
        height={630}
        className="object-cover -translate-y-36"
        alt="Moment Print"
      />
    </div>
  );
};

export default page;
