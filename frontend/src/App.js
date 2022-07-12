import { useState, useEffect } from "react";
import { ethers } from "ethers";
import erc20abi from "./erc20ABI.json";
import 'antd/dist/antd.css';
import './index.css';
import './App.css';
import { Input, Button, Row, Col, Card, Form } from 'antd';

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
    getTokenInfo();
    if (contractInfo.address !== "-") {
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

  return (
    <div>
      <Row className="PageHeader">
        <Col span={12}><h1>🚀 10XBank</h1></Col>
        <Col span={12} style={{textAlign: "right"}}>
          <Button onClick={getMyBalance}>
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
                <Card className="CardSolid" 
                actions={[
                  <h3>Deposit</h3>,
                  <h3>Withdraw</h3>,
                  <h3>Transfer</h3>,
                ]}
                >
                  <Row>
                    <Col span={8}>Account Name:</Col>
                    <Col span={16}>abcdefg</Col>
                  </Row>
                  <Row>
                    <Col span={8}>Balance:</Col>
                    <Col span={16}>{balanceInfo.balance + " " + contractInfo.tokenSymbol}</Col>
                  </Row>
                </Card>
                <Card type="dashed" className="CreateAccount" onClick={() => setPage("create")}>
                  + Create Bank Account
                </Card> 
              </Col>
            : 
              page === "create" ? 
              <Card className="CardSolid">
                <Form
                  name="basic"
                  labelCol={{
                    span: 8,
                  }}
                  wrapperCol={{
                    span: 16,
                  }}
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={createAccount}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Account Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your account name!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    wrapperCol={{
                      offset: 8,
                      span: 16,
                    }}
                  >
                    <Button className="InputButton" type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </Card>  
            :
              page === "deposit" ? "Deposit" :
              page === "withdraw" ? "Withdraw" :
              page === "transfer" ? "Transfer" : "" }
          </Row>
        </Col>
      </Row>
    </div>
  );
}
