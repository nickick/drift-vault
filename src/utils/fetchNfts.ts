import { Alchemy, Network } from "alchemy-sdk";

const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY,
  network:
    process.env.NEXT_PUBLIC_CHAIN_NAME === "goerli"
      ? Network.ETH_GOERLI
      : Network.ETH_MAINNET,
});

export const fetchNfts = async (address: string, contract: string) => {
  const nfts = await alchemy.nft.getNftsForOwner(address);

  const filteredNfts = nfts.ownedNfts.filter((nft) => {
    return nft.contract.address === contract?.toLocaleLowerCase();
  });

  return {
    nfts: filteredNfts,
  };
};
