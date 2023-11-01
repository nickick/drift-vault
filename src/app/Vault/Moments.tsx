import React, { ReactNode, useState } from "react";
import { Tab } from "./Tab";
import Image from "next/image";
import cx from "classnames";
import { MomentClaim } from "../modals/MomentClaim";

type MomentData = {
  current: boolean;
  eligible: boolean;
  title: ReactNode;
  details: ReactNode[];
  description: ReactNode;
  imgSrc: string;
};

const MOMENT_DATA: MomentData[] = [
  {
    current: true,
    eligible: true,
    title: "Drift Zine #1",
    details: ["Edition of 75, Signed and Numbered", "$20 + Shipping"],
    description:
      "The first photography Zine to come from Isaac Wright, aka DrifterShoots. Zine #1 features photos from his 2023 explorations across various countries, including Egypt, China, Dubai, and ..........",
    imgSrc: "/images/moment-1.png",
  },
  {
    current: false,
    eligible: false,
    title: "Past Moment #1",
    details: ["Edition of 75, Signed and Numbered", "$20 + Shipping"],
    description:
      "The first photography Zine to come from Isaac Wright, aka DrifterShoots. Zine #1 features photos from his 2023 explorations across various countries, including Egypt, China, Dubai, and ..........",
    imgSrc: "/images/moment-1.png",
  },
  {
    current: false,
    eligible: true,
    title: "Past Moment #2",
    details: ["Edition of 75, Signed and Numbered", "$20 + Shipping"],
    description:
      "The first photography Zine to come from Isaac Wright, aka DrifterShoots. Zine #1 features photos from his 2023 explorations across various countries, including Egypt, China, Dubai, and ..........",
    imgSrc: "/images/moment-1.png",
  },
];

type MomentsProps = {
  active: boolean;
};

const Moments = ({ active }: MomentsProps) => {
  const [momentClaimOpen, setMomentClaimOpen] = useState(false);
  const [momentForClaimWindow, setMomentForClaimWindow] = useState<MomentData>(
    MOMENT_DATA[0]
  );

  const toggleMomentClaimOpen = () => {
    setMomentClaimOpen(!momentClaimOpen);
  };

  return (
    <Tab active={active} walletRequired={false}>
      <div className="flex flex-col p-4 space-y-4">
        {MOMENT_DATA.map((moment, index) => (
          <MomentsRow
            key={index}
            {...moment}
            setMoment={() => {
              setMomentForClaimWindow(moment);
              setMomentClaimOpen(true);
            }}
          />
        ))}
      </div>
      <MomentClaim
        isOpen={momentClaimOpen}
        onClose={toggleMomentClaimOpen}
        moment={{ title: momentForClaimWindow.title }}
        claimMoment={() => {}}
      />
    </Tab>
  );
};

const MomentsRow = ({
  current,
  eligible,
  title,
  details,
  description,
  imgSrc,
  setMoment,
}: MomentData & { setMoment: () => void }) => (
  <div className="flex w-full border border-border-gray">
    <Image
      src={imgSrc}
      alt={title?.toString() ?? ""}
      width={212}
      height={212}
    />
    <div className="flex flex-col p-4">
      <div className="text-2xl">{title}</div>
      <div className="italic">
        {details.map((detail) => (
          <div key={detail?.toString().length}>{detail}</div>
        ))}
      </div>
      <div>{description}</div>
    </div>
    <div className="flex flex-col justify-center p-4 text-center space-y-4">
      <div
        className={cx({
          "rounded-lg p-4 text-xl w-48 h-36 flex items-center justify-center text-center":
            true,
          "bg-green-700 cursor-pointer": eligible && current,
          "bg-gray-700": !eligible && current,
          "bg-gray-300 text-gray-500": !current,
        })}
        onClick={() => {
          if (current && eligible) {
            setMoment();
          }
        }}
      >
        {current ? (
          <>{eligible ? "You're eligible!" : "Not eligible"}</>
        ) : (
          "Completed"
        )}
      </div>
      <div>View snapshot</div>
    </div>
  </div>
);

export { Moments };
