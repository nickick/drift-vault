import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="w-[1200px] h-[630px] overflow-hidden relative">
      <div className="font-serif absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-10 text-[10rem] whitespace-nowrap">
        Drift Vault
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
