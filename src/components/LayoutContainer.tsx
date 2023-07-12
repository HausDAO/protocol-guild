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
  const { provider, address } = useDHConnect();
  // const { dao } = useDaoData({
  //   daoId: TARGETS.DAO_ADDRESS,
  //   daoChain: TARGETS.DEFAULT_CHAIN,
  // });

  return (
    <DHLayout
      pathname={location.pathname}
      navLinks={[
        { label: "Home", href: `/` },
        { label: "New Members", href: `newmember` },
        { label: "Edit Members", href: `editmember` },
        { label: "Splits Controller", href: `controller` },
        { label: "Replicas", href: `replicas` },
        { label: "Upload", href: `upload` },


      ]}
      leftNav={<H4>Network Registry</H4>}
    >
        <TXBuilder
          provider={provider}
          chainId={TARGETS.DEFAULT_CHAIN}
          daoId={TARGETS.DAO_ADDRESS}
          safeId={TARGETS.SAFE_ADDRESS}
          appState={{ memberAddress: address }}
        >
          <Outlet />
        </TXBuilder>

    </DHLayout>
  );
};
