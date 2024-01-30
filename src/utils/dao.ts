import { GRAPH_API_KEYS, ValidNetwork } from "@daohaus/keychain-utils";
import { findMember } from "@daohaus/moloch-v3-data";
import { EthAddress } from "@daohaus/utils";

export const fetchMembersShares = async ({
  dao,
  memberAddresses,
  networkId,
}: {
  networkId: ValidNetwork,
  dao: EthAddress,
  memberAddresses: Array<EthAddress>,

}) => {
  return Promise.all(
    memberAddresses.map(async (memberAddress) => {
      const member = await findMember({
        networkId,
        dao,
        memberAddress,
        graphApiKeys: GRAPH_API_KEYS
      });
      return member.data?.member?.shares || "0";
    }),
  );
}
