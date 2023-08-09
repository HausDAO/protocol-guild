# Protocol Cross CHain Member Registry (vite)

Vite React Starter for a DAO app scoped to a single DAO.

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

## Reference

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


## Resources

- [DAO Toolbox](https://toolbox.daohaus.fun/) docs
- HausDAO monorepo [libs](https://github.com/HausDAO/monorepo/tree/develop/libs)
- monorepo admin/admin-new
