import { DHLayout, useDHConnect } from "@daohaus/connect";
import { TXBuilder } from "@daohaus/tx-builder";
import { H4 } from "@daohaus/ui";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { TARGETS } from "../targetDao";
// import { CurrentDaoProvider } from "@daohaus/moloch-v3-hooks";


export const LayoutContainer = () => {
  const location = useLocation();
  const { proposalId, memberAddress } = useParams<{
    proposalId: string;
    memberAddress: string;
  }>();
  const { publicClient, address } = useDHConnect();
  // const { dao } = useDaoData({
  //   daoId: TARGETS.DAO_ADDRESS,
  //   daoChain: TARGETS.NETWORK_ID,
  // });

  return (
    <DHLayout
      pathname={location.pathname}
      navLinks={[
        { label: "Members", href: `/` },
        { label: "Registries", href: `registries` },

      ]}
      leftNav={<H4>Network Registry</H4>}
    >
        <TXBuilder
          publicClient={publicClient}
          chainId={TARGETS.NETWORK_ID}
          daoId={TARGETS.DAO_ADDRESS}
          safeId={TARGETS.SAFE_ADDRESS}
          appState={{ memberAddress: address }}
        >
          <Outlet />
        </TXBuilder>

    </DHLayout>
  );
};
