import { getAddress, isBytes, isHex, recoverMessageAddress } from "viem";

export async function recoverAddress({
  msg,
  sig,
}: {
  msg: string;
  sig: string;
}) {
  if (!msg || !sig) {
    throw new Error("Missing message or signature");
  }

  const expectedMsg =
    /^Login to Drift Vault with account (0x[0-9a-fA-F]{40}): 20[0-9]{2}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/;

  const matchResult = msg.match(expectedMsg);

  if (!matchResult || !matchResult[1]) {
    throw new Error("Wrong message format");
  }

  const expectedAddress = matchResult[1];

  // Signature should be 65 hex bytes or 130 chars with 0x prefix
  if ((!isBytes(sig) && !isHex(sig)) || sig.length !== 65 * 2 + 2) {
    throw new Error("Wrong signature format");
  }

  const signedDateStr = msg.split(": ")[1];
  const addressRaw = await recoverMessageAddress({
    message: msg,
    signature: sig,
  });
  const recoveredAddress = getAddress(addressRaw);
  if (!recoveredAddress) {
    throw new Error("Could not recover address");
  }
  if (expectedAddress !== recoveredAddress) {
    throw new Error("Expected address does not match recovered address");
  }

  const fiveMins = 1000 * 60 * 5;
  const now = +new Date() + fiveMins;
  const signedDate = +new Date(signedDateStr);
  const fiveMinsAgo = +new Date() - fiveMins;
  const tooOld = signedDate < fiveMinsAgo;
  const inFuture = signedDate > now;

  if (tooOld) {
    throw new Error("Date too old");
  }
  if (inFuture) {
    throw new Error("Date in the future");
  }

  return recoveredAddress;
}
