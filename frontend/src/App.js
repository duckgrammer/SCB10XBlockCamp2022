import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ReloadOutlined } from '@ant-design/icons';
import daiABI from "./daiABI.json";
import 'antd/dist/antd.min.css';
import './index.css';
import './App.css';
import { Button, Row, Col } from 'antd';
import AccountCard from "./components/AccountCard";
import CreateCard from "./components/CreateCard";
import TransferCard from "./components/TransferCard";
import NewCard from "./components/NewCard";
import FXCard from "./components/FXCard";

export default function App() {
  const [page, setPage] = useState("account");
  const [txs, setTxs] = useState([]);
  const [connectWallet, setConnectWallet] = useState(false);
  const [connectBalance, setConnectBalance] = useState(false);
  const [contractListened, setContractListened] = useState();
  const [contractInfo, setContractInfo] = useState({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-",
    totalSupply: "-"
  });
  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-"
  });
  const [accounts, setAccounts] = useState([]);
  const [accountBalance, setAccountBalance] = useState([]);
  const [currAccount, setCurrAccount] = useState("");

  useEffect(() => {
    if (contractInfo.address !== "-") {
      getMyBalance();
      getAccounts();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(
        contractInfo.address,
        daiABI,
        provider
      );

      erc20.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event });

        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: event.transactionHash,
            from,
            to,
            amount: String(amount)
          }
        ]);
      });
      setContractListened(erc20);

      return () => {
        contractListened.removeAllListeners();
      };
    }
  }, [contractInfo.address]);

  // MY FUNCTIONS
  const getTokenInfo = async () => {
    setConnectWallet(true);
    console.log("Get Token Info");
    const contractAddress = "0x74Ed4e01E31F1f3896B8c2d37D0279627bD5CF40";
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const erc20 = new ethers.Contract(contractAddress, daiABI, provider);

    const tokenName = await erc20.name();
    const tokenSymbol = await erc20.symbol();
    const totalSupply = await erc20.totalSupply();

    setContractInfo({
      address: contractAddress,
      tokenName,
      tokenSymbol,
      totalSupply
    });
    setConnectWallet(false);
  };

  const getAccounts = async () => {
    console.log("Get Accounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(contractInfo.address, daiABI, provider);
    const allAccounts = await erc20.myAccounts();
    setAccounts(allAccounts);

    setAccountBalance([]);
    for(let i = 0; i < allAccounts.length; i++){
      const temp = await erc20.accountInfo(allAccounts[i]);
      setAccountBalance(accountBalance => [...accountBalance, parseInt(temp._hex, 16)]);
    }
  }

  const refreshBalance = async () => {
    getAccounts();
  }

  const getMyBalance = async () => {
    setConnectBalance(() => { return true; });
    console.log("Get My Balance");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(contractInfo.address, daiABI, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await erc20.balanceOf(signerAddress);

    setBalanceInfo({
      address: signerAddress,
      balance: String(balance)
    });

    setConnectBalance(() => {
      return false;
    }, 6000);
  };

  const createAccount = async (e) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, daiABI, signer);
    await erc20.createAccount(e.name);
    setPage("account");
  }

  const transfer = async (e) => {
    console.log("transfer " + e);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, daiABI, signer);
    await erc20.transfer(e.name, e.amount);
    setPage("account");
    getMyBalance();
  }

  const withdraw = async (e) => {
    console.log("withdraw " + e);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, daiABI, signer);
    await erc20.withdraw(e.amount);
    setPage("account");
    getMyBalance();
  }

  const deposit = async (e) => {
    console.log("deposit " + e);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, daiABI, signer);
    await erc20.deposit(e.amount);
    setPage("account");
    getMyBalance();
  }

  const myTransfer = async (e) => {
    console.log("transfer " + e);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, daiABI, signer);
    await erc20.myTransfer(currAccount, e.name, e.amount);
    setPage("account");
    getMyBalance();
  }

  const myDeposit = async (e) => {
    console.log("deposit " + currAccount + e.amount);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, daiABI, signer);
    await erc20.myDeposit(currAccount, e.amount);
    setPage("account");
    getMyBalance();
  }

  const myWithdraw = async (e) => {
    console.log("deposit " + currAccount + e.amount);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, daiABI, signer);
    await erc20.myWithdraw(currAccount, e.amount);
    setPage("account");
    getMyBalance();
  }

  return (
    <div>
      <Row className="PageHeader">
        <Col flex="150px" onClick={() => setPage("account")}>
          <h1 style={{cursor: "pointer"}}>🚀 10XBank</h1>
        </Col>
        <Col flex="auto" style={{textAlign: "right"}}>
          <Button shape="circle" 
            loading={connectBalance}
            onClick={() => refreshBalance()} 
            style={{marginRight: "10px"}}
            icon={<ReloadOutlined />}
            type="primary"
          />
          <Button onClick={() => getTokenInfo()} loading={connectWallet}>
            {balanceInfo.address === "-" ? "Connect Wallet" : balanceInfo.address}
          </Button>
        </Col>
      </Row>
      <Row className="PageBody">
        <Col span={24}>
          <h2>
            { page === "account" ? "My Accounts:" : 
            page === "create" ? "Create Your bank account" :
            page === "deposit" ? "Deposit" :
            page === "withdraw" ? "Withdraw" :
            page === "transfer" ? "Transfer" : "" }
          </h2>
          <Row>
            { page === "account" ? 
                <Col span={24}>
                  {accounts.map((account, index) =>
                    <AccountCard key={account}
                    name={account}
                    balance={accountBalance[index]} 
                    tokenSymbol={contractInfo.tokenSymbol} 
                    setPage={setPage} setCurrAccount={setCurrAccount}
                    />
                  )}
                  {/*<AccountCard balance={balanceInfo.balance} tokenSymbol={contractInfo.tokenSymbol} setPage={setPage} getMyBalance={getMyBalance} connectBalance={connectBalance}/>*/}
                  <NewCard setPage={setPage}/>
                </Col>
            : 
              page === "create" ? 
                <CreateCard createAccount={createAccount}/>
            :
              page === "deposit" ? 
                <FXCard tokenSymbol={contractInfo.tokenSymbol} fx={myDeposit} text="deposit"/>
             :
              page === "withdraw" ? 
                <FXCard tokenSymbol={contractInfo.tokenSymbol} fx={myWithdraw} text="withdraw"/>
            :
              page === "transfer" ? 
                <TransferCard tokenSymbol={contractInfo.tokenSymbol} transfer={myTransfer}/>
            : "" }
          </Row>
        </Col>
      </Row>
    </div>
  );
}
