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
  expectedDate: ReactNode;
  bgHex: string;
  imgSrc: string;
};

type MomentCTAData = {
  current: boolean;
  eligible: boolean;
  expectedDate: string;
  snapshotUrl?: string;
  wallet?: `0x${string}`;
};

const MOMENT_DATA: (MomentData & MomentCTAData)[] = [
  {
    current: false,
    // snapshotUrl:
    //   "https://github.com/nickick/drift-vault/blob/main/snapshots/12-6-2023.json",
    stripeUrlIdentifier: "test_28o4k88qHaXD5lCeUU",
    eligible: true,
    title: "Large format print",
    details: ["Top 3 holders"],
    description:
      "Learning How To Die is a photographic zine covering three years of Drift’s work documenting the Deer Isle Bridge and the lessons and milestones marked throughout. Through the still photographs and writing included the viewer is taken on a journey through one of the most sensitive and volatile times in the artist’s life.",
    expectedDate: "Coming Feb 2024",
    imgSrc: "/images/drift-zine-1-moment.png",
    bgHex: "#ffffff",
  },
  {
    current: false,
    stripeUrlIdentifier: "test_28o4k88qHaXD5lCeUU",
    eligible: true,
    title: "Drift Zine #1",
    details: [
      "First 50 out of 250 limited editions, Signed and Numbered",
      "$65 + Shipping",
    ],
    description:
      "Learning How To Die is a photographic zine covering three years of Drift’s work documenting the Deer Isle Bridge and the lessons and milestones marked throughout. Through the still photographs and writing included the viewer is taken on a journey through one of the most sensitive and volatile times in the artist’s life.",
    expectedDate: "Coming Feb 2024",
    imgSrc: "/images/moment-print-1.jpeg",
    bgHex: "#000000",
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
      <div className="flex flex-col px-4 py-6 sm:py-4 space-y-4">
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
  bgHex,
  setMoment,
  snapshotUrl,
  expectedDate,
  wallet,
}: MomentData & MomentCTAData & { setMoment: () => void }) => (
  <div className="flex flex-col sm:grid sm:grid-cols-12 border border-border-gray bg-moments-gray flex-shrink-0">
    <div
      className="w-full col-span-3"
      style={{
        backgroundColor: bgHex,
      }}
    >
      <Image
        src={imgSrc}
        alt={title?.toString() ?? ""}
        width={212}
        height={212}
        className="object-contain h-full w-full"
      />
    </div>
    <div className="flex flex-col pt-6 sm:p-4 px-6 sm:px-10 space-y-2 col-span-9">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm">
        {details.map((detail) => (
          <div key={detail?.toString().length}>{detail}</div>
        ))}
      </div>
      <div className="opacity-50 text-sm">{description}</div>
      <MomentsRowCTA
        {...{ wallet, current, eligible, setMoment, snapshotUrl, expectedDate }}
      />
    </div>
  </div>
);

const MomentsRowCTA = ({
  wallet,
  current,
  eligible,
  setMoment,
  snapshotUrl,
  expectedDate,
}: MomentCTAData & { setMoment: () => void }) => {
  return (
    <div className="flex justify-end items-center pt-4 text-center space-x-4 -mr-2">
      <div className="md:flex flex-col md:flex-row justify-end items-center pt-4 text-center space-x-4 md:-mr-2 hidden">
        {snapshotUrl ? (
          <a
            href={snapshotUrl}
            className="px-6 py-2 text-md font-semibold border"
            target="_blank"
            rel="noopener noreferrer"
          >
            View snapshot
          </a>
        ) : null}
        <div
          className={cx({
            "px-12 py-2 flex items-center justify-center text-center border font-semibold":
              true,
            "bg-green-700 border-green-700 cursor-pointer px-8":
              wallet && eligible && current,
            "bg-gray-700 border-gray-700":
              (wallet && !eligible && current) || (!current && !snapshotUrl),
            "bg-white border text-black": !wallet && current,
            "bg-blue-purple border-blue-purple text-white opacity-50":
              !current && snapshotUrl,
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
            <div>{snapshotUrl ? "Completed" : expectedDate}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export { Moments };
