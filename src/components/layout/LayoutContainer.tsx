import { useCallback, useMemo } from "react";
import Particles from "react-particles";
import { Outlet, useLocation, useParams } from "react-router-dom";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

import { DHLayout, useDHConnect } from "@daohaus/connect";
import { ValidNetwork } from "@daohaus/keychain-utils";
import { CurrentDaoProvider, useDaoData } from "@daohaus/moloch-v3-hooks";
import { TXBuilder } from "@daohaus/tx-builder";
import { H4 } from "@daohaus/ui";
import { EthAddress } from "@daohaus/utils";

import { useCurrentRegistry } from "../../hooks/context/RegistryContext";
import { useIndexer } from "../../hooks/useIndexer";


export const LayoutContainer = () => {

  const { memberAddress, proposalId } = useParams<{
    daoChain: ValidNetwork;
    daoId: string;
    proposalId: string;
    memberAddress: string;
  }>();
  
  const currentRegistry = useCurrentRegistry();
  if (!currentRegistry.daoChain) return null;

  return (
    <Layout
      daoId={currentRegistry.daoId}
      daoChain={currentRegistry.daoChain as ValidNetwork}
      memberAddress={memberAddress}
      proposalId={proposalId}
      registryAddress={currentRegistry.registryAddress}
    />
  )
};

const Layout = ({
  daoId,
  daoChain,
  memberAddress,
  proposalId,
  registryAddress,
}: {
  daoId: string;
  daoChain: ValidNetwork;
  memberAddress?: string;
  proposalId?: string;
  registryAddress: EthAddress;
}) => {
  const location = useLocation();
  const { address, publicClient } = useDHConnect();
  const { indexer } = useIndexer();
  
  const { dao } = useDaoData({
    daoId: daoId as string,
    daoChain: daoChain as string,
  });

  const moreLinks = useMemo(() => {
    return [
      {
        label: 'Bulk Upload',
        href: `/membership`,
      },
      {
        label: 'New Member',
        href: `/newMember`,
      },
      {
        label: 'Update Member Activity',
        href: `/editMember`,
      },
    ];
  }, []);

  // const particlesInit = useCallback(async (engine: Engine) => {
  //   // console.log(engine);

  //   // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
  //   // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
  //   // starting from v2 you can add only the features you need reducing the bundle size
  //   //await loadFull(engine);
  //   await loadSlim(engine);
  // }, []);
  // const particlesLoaded = useCallback(
  //   async (container: Container | undefined) => {
  //     // console.log(container);
  //   },
  //   []
  // );

  return (
    <>
      {/* <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fullScreen: {
            zIndex: -1,
            enable: true,
          },
          fpsLimit: 120,
          particles: {
            move: {
              enable: true,
              speed: { min: 1, max: 6 },
            },
            number: {
              value: 10,
              max: 15,
            },
            opacity: {
              value: 1,
            },
            size: {
              value: {
                min: 6,
                max: 12,
              },
            },
            shape: {
              type: "char",
              character: {
                value: "🤝",
              },
            },
          },
          detectRetina: true,
        }}
      /> */}
      <DHLayout
        pathname={location.pathname}
        navLinks={[
          { label: "Home", href: `/` },
          { label: "Registries", href: `registries` },
          { label: "Activity Logs", href: `history` },
        ]}
        dropdownTriggerLabel="Membership"
        dropdownLinks={moreLinks}
        leftNav={<H4>📒 Registry Manager 🖊️</H4>}
      >
        <CurrentDaoProvider
          userAddress={address}
          targetDao={{
            daoChain: daoChain,
            daoId: daoId,
            proposalId,
            memberAddress,
          }}
        >
          <TXBuilder
            publicClient={publicClient}
            chainId={daoChain}
            daoId={daoId}
            safeId={dao?.safeAddress}
            appState={{ dao, memberAddress: address, registryAddress }}
          >
            <Outlet />
          </TXBuilder>
        </CurrentDaoProvider>
      </DHLayout>
    </>
  );
};

