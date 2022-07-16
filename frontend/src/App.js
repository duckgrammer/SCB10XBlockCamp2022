import { useState, useEffect } from "react";
import { ethers } from "ethers";
import daiABI from "./daiABI.json";
import 'antd/dist/antd.min.css';
import './index.css';
import './App.css';
import { Row, Col, Modal } from 'antd';
import AccountCard from "./components/AccountCard";
import CreateCard from "./components/CreateCard";
import TransferCard from "./components/TransferCard";
import NewCard from "./components/NewCard";
import FXCard from "./components/FXCard";
import ConnectWallet from "./components/ConnectWallet";
import Refresh from "./components/Refresh";

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
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(
        contractInfo.address,
        daiABI,
        provider
      );

      erc20.on("Transfer", (from, to, amount, event) => {
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

  useEffect(() => {
    if (balanceInfo.address !== "-") {
     getAccounts();
    }
  }, [balanceInfo.address]);

  const getTokenInfo = async () => {
    setConnectWallet(true);
    const contractAddress = "0xBd8639cb8395e783806449B0bd996e4c021F6107";
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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(contractInfo.address, daiABI, provider);
    const allAccounts = await erc20.myAccounts(balanceInfo.address);
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

  const Transfer = async (e) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const erc20 = new ethers.Contract(contractInfo.address, daiABI, signer);
      await erc20.transfer(e.name, e.amount*99);
      await erc20.transactionFee(currAccount, e.amount*100);
      for(var i = 0; i < e.names.length; i++){
        await erc20.transfer(e.names[i], e.amount*99);
        await erc20.transactionFee(currAccount, e.amount*100);
      }
      setPage("account");
    }
    catch {
      error("Error transfering into account", "Make sure you entered a valid wallet and ammount. Make sure you have enough money in your wallet.");
    }
  }

  const myTransferOwn = async (e) => {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const erc20 = new ethers.Contract(contractInfo.address, daiABI, signer);
      await erc20.myTransfer(currAccount, e.name, e.amount*100);
      for(var i = 0; i < e.names.length; i++){
        await erc20.myTransfer(currAccount, e.names[i], e.amount*100);
      }
      setPage("account");
    }
    catch {
      error("Error transfering into account", "Make sure you entered a valid account and ammount. Make sure you have enough money in your wallet.");
    }
  }

  const myDeposit = async (e) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const erc20 = new ethers.Contract(contractInfo.address, daiABI, signer);
      await erc20.myDeposit(currAccount, e.amount*100);
      setPage("account");
    }
    catch {
      error("Error depositing into account", "Make sure you entered a valid amount. Make sure you have enough money in your wallet.");
    }
  }

  const myWithdraw = async (e) => {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const erc20 = new ethers.Contract(contractInfo.address, daiABI, signer);
      await erc20.myWithdraw(currAccount, e.amount*100);
      setPage("account");
    }
    catch{
      error("Error withdrawing from account", "Make sure you entered a valid amount. Make sure have enough money in your account.");
    }
  }

  const error = (title, message) => {
    Modal.error({
      title: title,
      content: message,
    });
  };

  return (
    <div>
      <Row className="PageHeader">
        <Col flex="150px" onClick={() => setPage("account")}>
          <h1 style={{cursor: "pointer"}}>🚀 10XBank</h1>
        </Col>
        <Col flex="auto" style={{textAlign: "right"}}>
          <Refresh connectBalance={connectBalance} refreshBalance={refreshBalance}/>
          <ConnectWallet getTokenInfo={getTokenInfo} connectWallet={connectWallet} balanceInfo={balanceInfo}/>
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
                <>
                  {accounts.map((account, index) =>
                    <AccountCard key={account} name={account} balance={accountBalance[index]} 
                    tokenSymbol={contractInfo.tokenSymbol} setPage={setPage} setCurrAccount={setCurrAccount}/>
                  )}
                  <NewCard setPage={setPage}/>
                </>
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
                <TransferCard tokenSymbol={contractInfo.tokenSymbol} myTransfer={myTransferOwn} transfer={Transfer}/>
            : "" }
          </Row>
        </Col>
      </Row>
    </div>
  );
}
