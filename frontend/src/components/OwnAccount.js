import { Input, Button, Form } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

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

            <Form.List name="names" >
                {(fields, { add, remove }) => (
                <>
                    {fields.map((field, index) => (
                        <Form.Item
                            label={'Account Name ' + (index+2)}
                            required={false}
                            key={field.key}
                        >
                            <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                    {
                                    required: true,
                                    whitespace: true,
                                    message: "Please input passenger's name.",
                                    },
                                ]}
                                noStyle
                                >
                                    <Input style={{ width: '60%' }} />
                                </Form.Item>
                                {fields.length > 0 ? (
                                <MinusCircleOutlined
                                    style={{ padding: "10px" }}
                                    className="dynamic-delete-button"
                                    onClick={() => remove(field.name)}
                            /> ) : null}
                        </Form.Item>
                    ))}
                    <Form.Item label=" ">
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            style={{
                                width: '60%',
                            }}
                            icon={<PlusOutlined />}
                        >
                            Add field
                        </Button>
                    </Form.Item>
                </>
                )}
            </Form.List>
 
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