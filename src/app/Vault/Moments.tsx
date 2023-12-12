import React, { ReactNode, useState } from "react";
import { Tab } from "./Tab";
import Image from "next/image";
import cx from "classnames";
import { MomentClaim } from "../modals/MomentClaim";
import axios from "axios";
import { useAccount } from "wagmi";

type MomentData = {
  stripeUrlIdentifier: string;
  title: ReactNode;
  details: ReactNode[];
  description: ReactNode;
  imgSrc: string;
};

type MomentCTAData = {
  current: boolean;
  eligible: boolean;
  wallet?: `0x${string}`;
};

const MOMENT_DATA: (MomentData & MomentCTAData)[] = [
  {
    current: true,
    stripeUrlIdentifier: "test_28o4k88qHaXD5lCeUU",
    eligible: true,
    title: "Drift Zine #1",
    details: ["Edition of 75, Signed and Numbered", "$20 + Shipping"],
    description:
      "Learning How To Die is a photographic zine covering three years of Drift’s work documenting the Deer Isle Bridge and the lessons and milestones marked throughout. Through the still photographs and writing included the viewer is taken on a journey through one of the most sensitive and volatile times in the artist’s life.",
    imgSrc: "/images/moment-1.png",
  },
  {
    current: false,
    stripeUrlIdentifier: "test_28o4k88qHaXD5lCeUU",
    eligible: false,
    title: "Past Moment #1",
    details: ["Edition of 75, Signed and Numbered", "$20 + Shipping"],
    description:
      "The first photography Zine to come from Isaac Wright, aka DrifterShoots. Zine #1 features photos from his 2023 explorations across various countries, including Egypt, China, Dubai, and...",
    imgSrc: "/images/moment-1.png",
  },
  {
    current: false,
    stripeUrlIdentifier: "test_28o4k88qHaXD5lCeUU",
    eligible: true,
    title: "Past Moment #2",
    details: ["Edition of 75, Signed and Numbered", "$20 + Shipping"],
    description:
      "The first photography Zine to come from Isaac Wright, aka DrifterShoots. Zine #1 features photos from his 2023 explorations across various countries, including Egypt, China, Dubai, and...",
    imgSrc: "/images/moment-1.png",
  },
];

type MomentsProps = {
  active: boolean;
};

const Moments = ({ active }: MomentsProps) => {
  const [momentClaimOpen, setMomentClaimOpen] = useState(false);
  const [momentClaimLink, setMomentClaimLink] = useState<string>();
  const [momentClaimLinkLoading, setMomentClaimLinkLoading] = useState(false);
  const [momentForClaimWindow, setMomentForClaimWindow] = useState<MomentData>(
    MOMENT_DATA[0]
  );

  const toggleMomentClaimOpen = () => {
    setMomentClaimOpen(!momentClaimOpen);
  };

  const { address } = useAccount();

  return (
    <Tab active={active} walletRequired={false}>
      <div className="flex flex-col p-4 space-y-4">
        {MOMENT_DATA.map((moment, index) => (
          <MomentsRow
            key={index}
            wallet={address}
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
        link={momentClaimLink}
        loading={momentClaimLinkLoading}
        moment={{ title: momentForClaimWindow.title }}
        claimMoment={async () => {
          setMomentClaimLinkLoading(true);
          const res = await axios.post("/api/link", {
            stripeUrlIdentifier: momentForClaimWindow.stripeUrlIdentifier,
          });

          const linkData = res.data as {
            address: string;
            link: {
              id: string;
              stripeUrlIdentifier: string;
              resolved_link: string;
            };
          };

          setMomentClaimLink(linkData.link.resolved_link);

          window.open(linkData.link.resolved_link, "_blank");
          setMomentClaimLinkLoading(false);
        }}
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
  wallet,
}: MomentData & MomentCTAData & { setMoment: () => void }) => (
  <div className="grid grid-cols-12 border border-border-gray bg-moments-gray flex-shrink-0">
    <div className="w-full col-span-3">
      <Image
        src={imgSrc}
        alt={title?.toString() ?? ""}
        width={212}
        height={212}
        className="object-cover h-full w-full"
      />
    </div>
    <div className="flex flex-col p-4 px-10 space-y-2 col-span-9">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm">
        {details.map((detail) => (
          <div key={detail?.toString().length}>{detail}</div>
        ))}
      </div>
      <div className="opacity-50 text-sm">{description}</div>
      <MomentsRowCTA {...{ wallet, current, eligible, setMoment }} />
    </div>
  </div>
);

const MomentsRowCTA = ({
  wallet,
  current,
  eligible,
  setMoment,
}: MomentCTAData & { setMoment: () => void }) => {
  return (
    <div className="flex justify-end items-center pt-4 text-center space-x-4 -mr-2">
      <div className="px-6 py-2 text-md font-semibold border">
        View snapshot
      </div>
      <div
        className={cx({
          "px-12 py-2 flex items-center justify-center text-center border font-semibold":
            true,
          "bg-green-700 border-green-700 cursor-pointer px-8":
            wallet && eligible && current,
          "bg-gray-700 border-gray-700": wallet && !eligible && current,
          "bg-white border text-black": !wallet && current,
          "bg-blue-purple border-blue-purple text-white opacity-50": !current,
        })}
        onClick={() => {
          if (current && eligible) {
            setMoment();
          }
        }}
      >
        {current ? (
          <>
            {!wallet ? "Connect to check eligibility" : ""}
            {eligible && wallet ? "You're Eligible!" : ""}
          </>
        ) : (
          "Completed"
        )}
      </div>
    </div>
  );
};

export { Moments };
