# 🚀 SCB10XBlockCamp2022
Simulating a banking app on the blockchain. The app is able to deposit, withdraw, and transfer 'DAI tokens.' The user is also able to create multiple accounts in one wallet and transfer between them.

![account](https://github.com/panda3141592/SCB10XBlockCamp2022/blob/main/image/account.png?raw=true)

[BONUS] Deduct 1% of transaction to other's account as platoform free

[BONUS] Transfer to multiple accounts at the same time.

![transfer](https://github.com/panda3141592/SCB10XBlockCamp2022/blob/main/image/transfer.png?raw=true)

## Installation and Running
frontend:
  1. Make sure Node.JS https://nodejs.org/en/ is installed
  2. `npm install`, to install all required dependencies
  3. `cd frontend` to move into the folder where the app is
  4. `npm start` to start the app
  5. Login to you metamask wallet and press Connect Wallet button on the top right of the app

smart contract:
  1. Change line 63 of contract/token.sol to the address of your wallet (the total supply of tokens will be transfered to your wallet)
  2. Deploy you contract on remix ide
  3. Import the token using the generated token contract address in to your metamask wallet
  4. Also paste the generate token contract address to line 77 of App.js

## 🛠️ Tools and Technologies
  - Smart Contract is written in Soldity (Compiled and Deployed using Remix IDE)
  - The DAI token (an ERC20 Token) is on the Ropsten Test Network
  - The frontend is written in React and mainly using antd framework

## 📚 References
  - ERC20 Token: https://www.quicknode.com/guides/solidity/how-to-create-and-deploy-an-erc20-token
  - Connecting Token to React: https://www.youtube.com/watch?v=38WUVVoMZKM&t=575s