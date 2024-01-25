import { Abi, AbiEvent } from "abitype";
import { debounce } from "lodash";
import { PublicClient } from "viem";

import { EthAddress, ZERO_ADDRESS } from "@daohaus/utils";

import { db, NetworkRegistryDB } from "./db";
import { EventHandler, getEventHandler } from "./eventHandlers";
import { ValidNetwork } from "../keychain";

interface NetworkRegistryIndexerInterface {
  db: NetworkRegistryDB;
  subscribe: (
    aggregateByTxHash: boolean,
    chainId: ValidNetwork,
    address: EthAddress,
    event: AbiEvent,
    fromBlock: bigint,
    eventHandler: EventHandler
  ) => void;
}

class NetworkRegistryIndexer implements NetworkRegistryIndexerInterface {
  private _publicClient: PublicClient;
  private _db: NetworkRegistryDB;
  updating = false;
  update: () => void;

  constructor(publicClient: PublicClient) {
    this._db = db;
    this._publicClient = publicClient;

    this.update = debounce(async () => this._update(), 5000, {
      maxWait: 60000,
    });
    setInterval(this.update, 60000);
  }

  public get db() {
    return this._db;
  }

  _update = async () => {
    if (this.updating) {
      console.log("Already updating");
      return;
    }

    this.updating = true;
    const currentBlockNo = await this._publicClient.getBlockNumber();
    const chainId = await this._publicClient.getChainId();
    // await this.db.subscriptions.clear();
    const subscriptions = await this.db.subscriptions
      .where({ chainId })
      .toArray();

    //TODO something cleaner than massice try-catch
    try {
      // Get cookie jars and claim events
      await Promise.all(
        subscriptions.map(async (s) => {
          if (s.lastBlock >= currentBlockNo) {
            return;
          }

          const events = await this._publicClient.getLogs({
            address: s.address,
            event: s.event,
            fromBlock: s.lastBlock,
            toBlock: currentBlockNo,
          });

          if (events.length === 0) {
            console.log(`No new events for ${s.address} on ${s.event.name}`);
          } else {
            const eventHandler = getEventHandler(s.eventHandler);
            if (!eventHandler) {
              console.error(`No event handler found for ${s.eventHandler}`);
              return;
            }
            console.log(
              `Got event for ${s.address} on ${s.event.name}`,
              events
            );

            // TODO: get block ranges
            const block = await this._publicClient.getBlock({ blockNumber: currentBlockNo });

            if (s.aggregateByTxHash) {
              // TODO: skip for now
              console.log("Skipping event with aggregateByTxHash=true")
            } else {
              await Promise.all(
                events.map(async (e) => eventHandler(s.event.name, e, this._publicClient, block.timestamp))
              );
            }
          }

          //TODO debounce/throttle this; currently calls update 3x
          await this.db.subscriptions.update(s, {
            lastBlock: currentBlockNo,
          });
        })
      );

      // TODO: CUSTOM IMPLEMENTATION

    //   // Get Poster (0x000000000000cd17345801aa8147b8d3950260ff) events for cookie jars
    //   const cookieJars = (await this.db.cookieJars.toArray()).map(
    //     (jar) => jar.address as `0x${string}`
    //   );
    //   const posterState = await this.db.keyvals.get(`posterState-${chainId}`);

    //   if (posterState && cookieJars.length > 0) {
    //     console.log(`Getting posts from ${posterState.lastBlock}`);
    //     const posts = await this._publicClient.getLogs({
    //       address: "0x000000000000cd17345801aa8147b8d3950260ff",
    //       event: parseAbiItem(
    //         "event NewPost(address indexed user, string content, string indexed tag)"
    //       ),
    //       args: {
    //         user: cookieJars,
    //       },
    //       fromBlock: posterState.lastBlock,
    //     });

    //     if (posts.length === 0) {
    //       console.log(`No new posts`);
    //     } else {
    //       console.log(`Got posts`, posts);
    //       await Promise.all(
    //         posts.map(async (post) => {
    //           const decoded = decodeEventLog({
    //             abi: parseAbi([
    //               "event NewPost(address indexed user, string content, string indexed tag)",
    //             ]),
    //             data: post.data,
    //             topics: post.topics,
    //           });
    //           postHandler(
    //             decoded.args.user, //user
    //             decoded.args.tag, //tag
    //             decoded.args.content, //content
    //             this._publicClient
    //           );
    //         })
    //       );
    //     }

    //     await this.db.keyvals.update(`posterState-${chainId}`, {
    //       lastBlock: currentBlock,
    //     });
    //   }
    } catch (e) {
      console.error("Failed to update", e);
    } finally {
      this.updating = false;
    }
  };

  subscribe = async (
    aggregateByTxHash: boolean,
    chainId: ValidNetwork,
    address: EthAddress,
    event: AbiEvent,
    fromBlock: bigint,
    eventHandler: EventHandler
  ) => {
    if (!this.db) {
      console.error("Database not initialized");
      return undefined;
    }

    const exists = await db.subscriptions
      .where('[chainId+address+event.name]')
      .equals([Number(chainId), address, event.name])
      .first();

    if (exists) return;

    console.log(`Subscribing to ${address} ${event.name} events`);

    try {
      const id = await this.db.subscriptions.add({
        aggregateByTxHash,
        chainId: Number(chainId),
        address,
        event,
        eventHandler,
        fromBlock,
        lastBlock: fromBlock,
      });

      console.log(
        `Subscribed to ${address} ${event.name} events at id ${id} on chain ${chainId}`
      );
    } catch (e) {
      console.error("Failed to subscribe to event", event.name, address, e);
    }
  };
}

export default NetworkRegistryIndexer;