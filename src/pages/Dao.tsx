import { useDaoData } from "@daohaus/moloch-v3-hooks";
import { DaoOverview } from "@daohaus/moloch-v3-macro-ui";
import { H2, ParMd, SingleColumnLayout, Link } from "@daohaus/ui";

import { TARGETS, TARGET_DAO } from "../targetDao";

export function Dao() {
  const { dao } = useDaoData({
    daoId: TARGETS.DAO_ADDRESS,
    daoChain: TARGETS.DEFAULT_CHAIN,
  });

  return (
    <SingleColumnLayout>
      {dao && (
        <DaoOverview
          daoChain={TARGETS.DEFAULT_CHAIN}
          daoId={dao.id}
        />
      )}
    </SingleColumnLayout>
  );
}

export default Dao;
