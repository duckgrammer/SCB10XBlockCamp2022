import { Input, Button, Form, Row, Col } from 'antd';
import { useState } from "react";

const OthersAccount = ({transfer, tokenSymbol}) => {
    const [amount, setAmount] = useState(0);

    const transactionFee = (e) => {
        setAmount(e.target.value);
    }

    return(
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={transfer}
            autoComplete="off"
        >
            <Form.Item
            label="Wallet Address"
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
            label="Amount"
            name="amount"
            rules={[
                {
                required: true,
                message: 'Please input your amount!',
                },
            ]}
            >
                <Input onChange={transactionFee} addonAfter={tokenSymbol}/>                      
            </Form.Item>

            <Form.Item
            wrapperCol={{
                offset: 8,
                span: 16,
            }}
            >
            <Row>
                <Col flex="auto" className="footnote">
                    {amount > 0 ? "fee 1% = " + amount*0.01 + " " + tokenSymbol  + " | Recieve = " + amount*0.99 + " " + tokenSymbol : null}
                </Col>
                <Col>
                    <Button className="InputButton" type="primary" htmlType="submit">
                        Transfer
                    </Button>
                </Col>
            </Row>
            </Form.Item>
        </Form>
    )
};

export default OthersAccount;