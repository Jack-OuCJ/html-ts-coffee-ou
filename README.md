# HTML TS Buy Me A Coffee

# Setup (Both Javascript and Typescript Editions)

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you've installed it right if you can run: `git --version`
- [Metamask](https://metamask.io/)
  - This is a browser extension that lets you interact with the blockchain.
- [anvil](https://book.getfoundry.sh/reference/anvil/)
  - You'll know you've installed it right if you can run: `anvil --version` 

## Installation

1. Clone the repository

```bash
git clone https://github.com/Jack-OuCJ/html-ts-coffee-ou.git
cd html-ts-coffee-ou
```

2. Run the following command:

```bash
anvil --load-state fundme-anvil.json 
```

This will load a local blockchain with our smart contract already deployed.

3. Import the anvil key into your Metamask

When you run the `anvil` command from #1, it'll give you a list of private keys. [Import one into your metamask.](https://support.metamask.io/start/how-to-import-an-account/)

You'll now have a wallet with some funds associated with our anvil chain!

4. Add the anvil chain to your metamask

[Follow this](https://support.metamask.io/configure/networks/how-to-add-a-custom-network-rpc/) and use:
- Network name: Anvil
- New RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency Symbol: ETH
- Block Explorer URL: None

## Run

1. Install the dependencies

```bash
pnpm install
```

2. Run the following command:

```bash
pnpm run dev
```

3. Open your browser to whatever the command above says, ie: `http://localhost:5173/`

4. Press some buttons!