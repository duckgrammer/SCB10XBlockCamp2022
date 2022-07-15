import { Input, Button, Form } from 'antd';

const OwnAccount = ({myTransfer, tokenSymbol}) => {
    return(
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={myTransfer}
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
            label="Amount"
            name="amount"
            rules={[
                {
                required: true,
                message: 'Please input your amount!',
                },
            ]}
            >
                <Input addonAfter={tokenSymbol}/>                      
            </Form.Item>

            <Form.Item
            wrapperCol={{
                offset: 8,
                span: 16,
            }}
            >
            <Button className="InputButton" type="primary" htmlType="submit">
                Transfer
            </Button>
            </Form.Item>
        </Form>
    )
};

export default OwnAccount;