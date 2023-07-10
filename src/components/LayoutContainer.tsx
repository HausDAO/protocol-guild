import { DHLayout, useDHConnect } from "@daohaus/connect";
import { TXBuilder } from "@daohaus/tx-builder";
import { H4 } from "@daohaus/ui";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { TARGETS, TARGET_DAO } from "../targetDao";
import { CurrentDaoProvider, useDaoData } from "@daohaus/moloch-v3-hooks";

const routePath = `molochv3/${
  TARGETS.DEFAULT_CHAIN
}/${TARGETS.DAO_ADDRESS}`;

export const LayoutContainer = () => {
  const location = useLocation();
  const { proposalId, memberAddress } = useParams<{
    proposalId: string;
    memberAddress: string;
  }>();
  const { provider, address } = useDHConnect();
  const { dao } = useDaoData({
    daoId: TARGETS.DAO_ADDRESS,
    daoChain: TARGETS.DEFAULT_CHAIN,
  });

  return (
    <DHLayout
      pathname={location.pathname}
      navLinks={[
        { label: "Home", href: `/` },
        { label: "DAO Overview", href: `${routePath}/dao` },
        { label: "New Members", href: `${routePath}/newmember` },
        { label: "Edit Members", href: `${routePath}/editmember` },
      ]}
      dropdownLinks={[
        { label: "Safes", href: `${routePath}/safes` },
        { label: "Proposals", href: `${routePath}/proposals` },
        { label: "Members", href: `${routePath}/members` },
        { label: "Settings", href: `${routePath}/settings` },
      ]}
      leftNav={<H4>{dao?.name}</H4>}
    >
      <CurrentDaoProvider
        targetDao={{
          daoChain: TARGETS.DEFAULT_CHAIN,
          daoId: TARGETS.DAO_ADDRESS,
          proposalId,
          memberAddress,
        }}
      >
        <TXBuilder
          provider={provider}
          chainId={TARGETS.DEFAULT_CHAIN}
          daoId={TARGETS.DAO_ADDRESS}
          safeId={TARGETS.SAFE_ADDRESS}
          appState={{ dao, memberAddress: address }}
        >
          <Outlet />
        </TXBuilder>
      </CurrentDaoProvider>
    </DHLayout>
  );
};
