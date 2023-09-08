import { DHLayout, useDHConnect } from "@daohaus/connect";
import { TXBuilder } from "@daohaus/tx-builder";
import { H4 } from "@daohaus/ui";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { TARGETS } from "../targetDao";
// import { CurrentDaoProvider } from "@daohaus/moloch-v3-hooks";

import Particles from "react-particles";
import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";


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

  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);

    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadSlim(engine);
  }, []);
  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      await console.log(container);
    },
    []
  );


  return (
    <>
    <Particles
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
      />
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
    </>

  );
};
