import { Row, Col, Card, Button, } from 'antd';
import NumberFormat from 'react-number-format';
import { ReloadOutlined } from '@ant-design/icons';

const AccountCard = ({balance, tokenSymbol, setPage, getMyBalance, connectBalance}) => {
    return(
        <Card className="CardSolid" 
        actions={[
            <h3 onClick={() => setPage("deposit")}>Deposit</h3>,
            <h3 onClick={() => setPage("withdraw")}>Withdraw</h3>,
            <h3 onClick={() => setPage("transfer")}>Transfer</h3>
        ]}
        >
            <Row>
            <Col span={8}>Account Name:</Col>
            <Col span={16}>abcdefg</Col>
            </Row>
            <Row>
            <Col span={8}>
                <Button shape="circle" 
                loading={connectBalance}
                onClick={() => getMyBalance()} 
                style={{marginRight: "10px"}}
                icon={<ReloadOutlined />}
                type="primary"
                />
                Balance:
            </Col>
            <Col span={16}>
                <NumberFormat displayType={'text'} value={balance/100} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true}/>
                {" " + tokenSymbol}
            </Col>
            </Row>
        </Card>
    )
};

export default AccountCard;