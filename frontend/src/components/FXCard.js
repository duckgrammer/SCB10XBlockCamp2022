import { Button, Form, Input, Card } from 'antd';

const FXCard = ({tokenSymbol, fx, text}) => {
    return(
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
                onFinish={fx}
                autoComplete="off"
            >
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
                    {text}
                </Button>
                </Form.Item>
            </Form>
        </Card>
    )
};

export default FXCard;