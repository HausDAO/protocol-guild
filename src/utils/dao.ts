import { GRAPH_API_KEYS, ValidNetwork } from "@daohaus/keychain-utils";
import { MolochV3Proposal, findMember, listProposals } from "@daohaus/moloch-v3-data";
import { EthAddress } from "@daohaus/utils";

export const fetchMembersShares = async ({
  dao,
  memberAddresses,
  networkId,
}: {
  networkId: ValidNetwork,
  dao: EthAddress,
  memberAddresses: Array<EthAddress>,

}): Promise<Array<string>> => {
  return Promise.all(
    memberAddresses.map(async (memberAddress) => {
      const member = await findMember({
        networkId,
        dao,
        memberAddress,
        graphApiKeys: GRAPH_API_KEYS,
      });
      return member.data?.member?.shares || "0";
    }),
  );
}

export const fetchProposalsByProcessedTxHash = async ({
  networkId,
  txHashes,
}: {
  networkId: ValidNetwork,
  txHashes: Array<string>,
}): Promise<Array<MolochV3Proposal>> => {
  const rs = await listProposals({
    networkId,
    filter: {
      processTxHash_in: txHashes
    },
    graphApiKeys: GRAPH_API_KEYS,
  });
  if (rs.error) {
    console.error('Error in fetchProposalsByProcessedTxHash', rs.error);
  }
  return rs.items;
};
