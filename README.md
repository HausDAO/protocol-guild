# Protocol Cross Chain Member Registry (vite)

This is the front end app for the PRotocol Guild DAO to interact with the Cross Chain Member Registries.

## Development

### 1. Project Setup

#### Clone and install

```bash
git clone <this repo>

cd <into folder>

yarn
```


### 2. `.env` Setup

```bash
cp .env.sample .env
```

```yaml
VITE_RIVET_KEY
VITE_WALLET_CONNECT_ID
VITE_ETHERSCAN_KEY
VITE_GRAPH_API_KEY_MAINNET # mandatory if working on Ethereum mainnet
VITE_TARGET_KEY # either TEST or PRODUCTION
```

Get a free Rivet key [here](https://rivet.cloud/)

Get a free Wallet Connect id [here](https://walletconnect.com/)


### 3. Target DAO and globals Set-up

#### Edit `src/targetDao.ts`

Add your DAO's data and other deployed contracts and network meta data here

### 4. Run the Development Server

```bash
yarn dev
```

## Build

```bash
yarn build
```

### ipfs deploy 
build is a single file see plugin in vite config

`github/workflows/deploy.yml`

this Github action uses web3storage to deploy the signle file build to ipfs. Set env vars in action secrets including your web3storage key. This will automatically deploy when merged to main. IPFS CID can be pulled from the action log after succesfull deploy.

```yaml
VITE_RIVET_KEY
VITE_WALLET_CONNECT_ID
WEB3_STORAGE_TOKEN
```

get free web3storage token [here](https://web3.storage/)

### ENS routing
add record to your ENS pointing to IPFS gateway with CID


## DAOhaus Components

### `main.tsx`

- Sets up the `react-query` provider `@daohaus/moloch-v3-hooks` will use
- Sets up `DHConnectProvider` - that handles the Wallet Connect functionality
- Sets up `HausThemeProvider` - that provides the styling theme to the app
- Adds the router to the app

### `LayoutContainer.tsx`

- Parent component wrapping all routes/pages
- Sets up `DHLayout` which adds the connect button and navigation to the app
  - You can update the navigation in `navLinks`
- Sets up `TXBuilder` which enables easy transaction creation


### Adding UI Components

- [Storybook](https://storybook.js.org/)

### Editing the Theme

tbd


### Resources

- [DAO Toolbox](https://toolbox.daohaus.fun/) docs
- HausDAO monorepo [libs](https://github.com/HausDAO/monorepo/tree/develop/libs)
- monorepo admin/admin-new


## Deploying a Network Registry

Follow these instructions if setting up and deploying new set of networked registries. New contract addresses should be set under `TARGETS` in [targetDAO.ts](./src/targetDao.ts).

### Contract Repo

Clone or download the
[protocol-guild-contract](https://github.com/HausDAO/protocol-guild-contracts) repository to your machine

```bash
git clone https://github.com/HausDAO/protocol-guild-contracts.git
```

### List of member addresses as of testing

[Spreadsheet Link](https://docs.google.com/spreadsheets/d/16zS3KiLjc45BjFQii7rLZl4FU17o7iTfJPrilwr_GE4/edit?usp=sharing)

### Deploy a Home Registry

#### 1. Collect addresses for at least 2 initial members 

Output

- `Addr_1`
- `Addr_2`


#### 2. Deploy initial DAO

- Use DAOHaus [Summoner](https://summon.daohaus.fun/) dApp. You can include an initial set of members, setup DAO config and vote settings for initial new member proposals.

Output:
  - `moloch` DAO address (`DAO_ADDRESS`)
  - `safe` treasury address (`SAFE_ADDRESS`)

#### 3. Setup initial Split contract through the 0xSplits dApp

- Go to the [0xSplit dApp](https://app.0xsplits.xyz/) to create new Split with initial members (at least two), split amounts can be equal as these will be updated in the first split proposals. You can either set the DAO Safe address or an EOA as the split controller (you must transfer ownership later). You can freely set the distribution threshold and sponsorship fee.

Output:
  - `split` address (`SPLIT_ADDRESS`)

#### 4. Deploy a NetworkRegistry contract in the Home network

- Before running the deployment script in the `protocol-guild-contract` repository you download locally, go to the `constants/config.ts` directory, find the chainID of the `home network` you plan to work with and set the `moloch`, `safe` & `split` addresses to the contract addresses you deployed in the previous steps.
- Open a terminal, go to the directory where `protocol-guild-contract` is located and run the following command line (example uses Goerli):

```bash
pnpm hardhat --network goerli deploy --tags PGNetworkRegistry
```

- Confirm the DAO Safe has ownership over the registry contract
- Finally, set the new `pgRegistry` address within the `home network` in the `constants/config.ts` file.

Output:

- `registry` address (`REGISTRY_ADDRESS`)

#### 5. Transfer control of the 0xSplit to NetworkRegistry

- If you set the 0xSplit controller to an EOA, you can `transferControl` to the `registry` contract through 0xSplits dApp. Alternatively, you can run the following script in the `protocol-guild-contract` repo:

```bash
pnpm hardhat --network goerli registry:ownSplit
```

 If you initially set the 0xSplit controller to the DAO's Safe, you'll need to submit a DAO proposal using the DAOHaus `Multicall Proposal Builder`. For this, you need the `splitMain` address to craft a tx that calls `transferControl(<split>, <new_controller>)`
- If you set the 0xSplit controller to an external smart contract wallet, try using wallet connect or a vendor tx builder dApp.

- Make sure the `registry` address is set as the new potential 0xSplit controller.

#### 6. NetworkRegistry accepts control of the 0xSplit

- Now the new controller must accept the role for the 0xSplit contract, so you need to submit a DAO proposal using the DAOHaus `Multicall Proposal Builder` to craft a tx that calls `acceptSplitControl()` in the `registry` contract.

- Make sure the `registry` address is set as the 0xSplit controller: you verify that in the 0xSplit dApp or by opening the `splitMain` contract in the block explorer and look for the `getController(split)` function.

### Deploy a Foreign Registry

You can deploy as many foreign registries as you want as long as these networks can communicate with each other using Connext cross-chain messagging. Below, there's an example on how to deploy a foreign registry on Optimism Goerli.

#### 1. Setup initial Split contract through the 0xSplits dApp

- You can either follow the same instructions in Step 3 above, however, the 0xSplit dApp might not support certain testnet networks, so for our purpose, we'll use the following script from the `protocol-guild-contract` repo to deploy a new 0xSplit on the L2 test network:

```bash
pnpm hardhat --network optimismGoerli deploy:split --controller
```

- *NOTICE*: The `--controlller` flag will set the deployer address as the 0xSplit controller. Run it with `--help` for further info about script parameters.

Output:
  - `split` address in the replica network

#### 2. Deploy a NetworkRegistry contract in the replica network

- Before running the deployment script in the `protocol-guild-contract` repo, go to the `constants/config.ts` directory, find the `replica network` you plan to work with and set the `split` address to the contract address you deployed in the previous step. Additionally, you can set the `registryOwner` address that will act as a fallback owner to setup the registry in the replica network before using connext to perform sync actions through the main registry.
- Run the following command line under the `protocol-guild-contract` repo directory:

```bash
pnpm hardhat --network optimismGoerli deploy --tags PGNetworkRegistry
```

- Confirm the registry contract has either an owner (`registryOwner`) or renounced ownership (AddressZero) and the main NetworkRegitry address & network domainID are set as the `updater` settings.
- Finally, set the new `registry` address within the `replica network` in the `constants/config.ts` file.

Output:

- replica `registry` address

#### 3. Transfer + Accept control of the 0xSplit to Replica NetworkRegistry

- You can follow the same instructions in Steps 5 & 6 from above but for the replica network. Remember that you might set your deployer address (EOA) as the 0xSplit controller, so you might just need to call `acceptSplitControl()`. Otherwise, you'll to craft a cross-chain tx by calling the `acceptNetworkSplitControl([<chainId>], [<relayerFee>])` through the main `registry` contract.

- However,you can also use the UI to batch the two actions required to add a new replica in the main registry (`updateNetworkRegistry` + `acceptNetworkSplitControl`). See the next section for instructions.

- In the end, make sure the replica `registry` address is set as the new controller.

#### 4. Enable a foreign registry + accept 0xSplit control in the frontend

1. Open the [targetDao.ts](./src/targetDao.ts) config file and add a new record (if not exists) under `REPLICA_CHAINS` in the `TARGETS` object.
2. Make sure the [keychain.ts](./src/utils/keychain.ts) config file supports the network where you deployed the new registry.
2. In the frontend, navigate to the `Registries` page, open the menu for the new network registry and click on `Register`. This proposal form will batch the two actions required to enable a new replica in the main registry (`updateNetworkRegistry` + `acceptNetworkSplitControl`).


### Notes of deployed Foreign Registries

**optimisticGoerli** foriforeignegn registry addrs: 
split: 0x41F757dC2122bD72967Cc6124345a3526200C472 (update contract config before running this)
registry: ~~0x6B67d35D0B93F0a5C8ADFca64d50F14D6A5cb1D6~~
new: 0x0b19D9cDF9172A8D760605357B5331ce802BfB91

`pnpm hardhat --network optimismGoerli deploy --tags PGNetworkRegistry`

**arbitrumGoerli** foreign registry addrs: 
split: 0x7C80Fd0C51E6eb02d14B9bBaf6a916E4C4fE2ded
registry:0x16465c10D98FB97d2adA84e5C19E08060085240c

`pnpm hardhat --network arbitrumGoerli deploy --tags PGNetworkRegistry`

**mumbai** foreign registry addrs
split: 0xb2686820c23d266d74bfe46dab3f9faa3e04f27b
registry: 0x28C57030923f781861852C01371624ed50C8F1aE

### update foreign registry members
if you want to save gas you should update members from l2 chain. this needs to be done before transfer of updater/owner

### transfer ownership
- begin 0xsplit controller transfer to registry
- change registry updater


