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


## Network Registry
these are the instructions if setting up and deploying new registries

### Contract Repo
[protocol-guild-contract](https://github.com/HausDAO/protocol-guild-contracts)

### Deploy Home Registry 
### Testing setup notes:


### Collect addresses for 3 initial members 
- [ ] addr 1 
- [ ] addr 2 
- [ ] addr 3 


### Deploy initial DAO
https://summon.daohaus.fun/
>  3 initial members can be set as summoners, setup DAO config and vote for initial new member proposals. 

- [ ] DAO address 0x1df24e0463dd40dc5a6be8034e90cf434686c9a4
- [ ] Safe treasury address 0xf44803400e641abe86e1cfecfb82118800136d60

### setup initial split in 0xsplits dapp
https://app.0xsplits.xyz/
> create new split with 3 members, split can be equal they will be updated in the first proposals. Set controller as shared Safe address or eoa (needs to transfer ownership). Threshold and fee probably does not matter.

- [ ] 0xsplits address 0xE6bD75288bF450f2aB4F4EB3F44CAf0371AA8584

### Deploy registry contracts
- update config files (constants/config)
- deploy registry instance

`pnpm hardhat --network goerli deploy --tags PGNetworkRegistry`
- confirm ownership of registry is with safe`

- [ ] registry address 0x0BcA4bfDe464Aec3F23b5E78647954952fdd6081

### transfer control of 0xsplits
- from 0xsplits app transfer control to **network registry** not safe
- in app use DAO proposal to accept control

### addresses

see config


### list of addresses as of testing
https://docs.google.com/spreadsheets/d/16zS3KiLjc45BjFQii7rLZl4FU17o7iTfJPrilwr_GE4/edit?usp=sharing

## Deploy Foreign Registry 

### replica deployment

### summon registry on 0xsplits

setup initial 0x splits with 3 addresses

splits addr: 

**update config**

### deploy registry

**optimisticGoerli** foriegn registry addrs: 
split: 0x41F757dC2122bD72967Cc6124345a3526200C472 (update contract config before running this)
registry: ~~0x6B67d35D0B93F0a5C8ADFca64d50F14D6A5cb1D6~~
new: 0x0b19D9cDF9172A8D760605357B5331ce802BfB91

`pnpm hardhat --network optimismGoerli deploy --tags PGNetworkRegistry`

**arbitrumGoerli** foriegn registry addrs: 
split: 0x7C80Fd0C51E6eb02d14B9bBaf6a916E4C4fE2ded
registry:0x16465c10D98FB97d2adA84e5C19E08060085240c

`pnpm hardhat --network arbitrumGoerli deploy --tags PGNetworkRegistry`



### update foreign registry members
if you want to save gas you should update members from l2 chain. this needs to be done before transfer of updater/owner

### transfer ownership
- begin 0xsplit controller transfer to registry
- change registry updater


