import { useState, useEffect } from "react";
import { ethers } from "ethers";
import erc20abi from "./erc20ABI.json";
import 'antd/dist/antd.min.css';
import './index.css';
import './App.css';
import { Button, Row, Col, Card } from 'antd';
import AccountCard from "./components/AccountCard";
import CreateCard from "./components/CreateCard";
import TransferCard from "./components/TransferCard";
import NewCard from "./components/NewCard";
import FXCard from "./components/FXCard";

export default function App() {
  const [page, setPage] = useState("account");
  const [account, setAccount] = useState([]);
  const [txs, setTxs] = useState([]);
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

  useEffect(() => {
    if (contractInfo.address !== "-") {
      getMyBalance();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(
        contractInfo.address,
        erc20abi,
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
    console.log("Get Token Info");
    const contractAddress = "0x819c9AB81857Bf54A8FCae941639B1b287Ed68A7";
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const erc20 = new ethers.Contract(contractAddress, erc20abi, provider);

    const tokenName = await erc20.name();
    const tokenSymbol = await erc20.symbol();
    const totalSupply = await erc20.totalSupply();

    setContractInfo({
      address: contractAddress,
      tokenName,
      tokenSymbol,
      totalSupply
    });
  };

  const getMyBalance = async () => {
    console.log("Get My Balance");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await erc20.balanceOf(signerAddress);

    setBalanceInfo({
      address: signerAddress,
      balance: String(balance)
    });
  };

  const createAccount = (e) => {
    console.log(e.name);
    setPage("account");
  }

  const transfer = async (e) => {
    console.log("transfer " + e);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);
    await erc20.transfer(e.name, e.amount);
    setPage("account");
    getMyBalance();
  }

  const withdraw = async (e) => {
    console.log("withdraw " + e);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);
    await erc20.withdraw(e.amount);
    setPage("account");
    getMyBalance();
  }

  const deposit = async (e) => {
    console.log("deposit " + e);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);
    await erc20.deposit(e.amount);
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
          <Button onClick={() => getTokenInfo()}>
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
                  <AccountCard balance={balanceInfo.balance} tokenSymbol={contractInfo.tokenSymbol} setPage={setPage} getMyBalance={getMyBalance}/>
                  <NewCard setPage={setPage}/>
                </Col>
            : 
              page === "create" ? 
                <CreateCard createAccount={createAccount}/>
            :
              page === "deposit" ? 
                <FXCard tokenSymbol={contractInfo.tokenSymbol} fx={deposit} text="deposit"/>
             :
              page === "withdraw" ? 
                <FXCard tokenSymbol={contractInfo.tokenSymbol} fx={withdraw} text="withdraw"/>
            :
              page === "transfer" ? 
                <TransferCard tokenSymbol={contractInfo.tokenSymbol} transfer={transfer}/>
            : "" }
          </Row>
        </Col>
      </Row>
    </div>
  );
}
