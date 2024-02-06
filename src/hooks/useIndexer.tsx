import { useEffect, useState } from "react";
import { AbiEvent, parseAbiItem } from "abitype";

import { useDHConnect } from "@daohaus/connect";

import { useTargets } from "./useTargets";
import NetworkRegistryIndexer from "../utils/indexer/NetworkRegistryIndexer";
import { db, EventHandlerType, NETWORK_REGISTRY_EVENTS } from "../utils/indexer";
import { ValidNetwork } from "../utils/keychain";

const useIndexer = () => {
  const [indexer, setIndexer] = useState<NetworkRegistryIndexer>();
  const target = useTargets();
  const { publicClient, chainId } = useDHConnect();

  useEffect(() => {
    const initIndexer = async (chainId: ValidNetwork) => {
      try {
        console.log("InitIndexer...");
        // check if the indexer has not been initialized
        const indexer = new NetworkRegistryIndexer(publicClient!);
        setIndexer(indexer);

        // NOTICE: uncomment this to reboot the indexer
        // await indexer.db.subscriptions.clear();
        // await indexer.db.replicas.clear();
        // await indexer.db.members.clear();
        // await indexer.db.memberActions.clear();
        // await indexer.db.activityUpdates.clear();
        // await indexer.db.syncActions.clear();
        // await indexer.db.keyvals.clear();

        // // NOTICE: run this once if you change the db schema
        // await indexer.db.delete();
        
        // await indexer.db.keyvals.update(`posterState-${chainId}`);

        // Subscribe to Poster
        //TODO better poster state management
        if (!(await db.keyvals.get(`posterState-${chainId}`)) && !indexer) {
          console.log("Initializing indexer...");
          await db.keyvals.add(
            { lastBlock: BigInt(target.START_BLOCK) },
            `posterState-${chainId}`
          );
          console.log("Set START_BLOCK");
        }
      } catch (error) {
        console.log("ERROR loading indexer");
        console.error(error);
      }
    };

    if (chainId && publicClient && !indexer) {
      initIndexer(chainId);
    }
  }, []);

  useEffect(() => {
    if (indexer) {
      console.log("Looking if there's need of Registering initial subscriptions...");

      NETWORK_REGISTRY_EVENTS.forEach((registryEvent: EventHandlerType) => {
        indexer.subscribe(
          registryEvent.aggregateByTxHash,
          registryEvent.daoProposal,
          target.CHAIN_ID,
          target.REGISTRY_ADDRESS,
          parseAbiItem(registryEvent.event) as AbiEvent,
          BigInt(target.START_BLOCK),
          registryEvent.handler
        );
      });
    }
  }, [target, indexer]);

  return {
    indexer,
    client: publicClient,
  };
};

export { useIndexer };
