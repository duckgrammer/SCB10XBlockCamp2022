import { Row, Col, Card, Button, } from 'antd';

const AccountCard = ({balance, tokenSymbol, setPage, getMyBalance}) => {
    return(
        <Card className="CardSolid" 
        actions={[
            <h3>Deposit</h3>,
            <h3>Withdraw</h3>,
            <h3 onClick={() => setPage("transfer")}>Transfer</h3>,
        ]}
        >
            <Row>
            <Col span={8}>Account Name:</Col>
            <Col span={16}>abcdefg</Col>
            </Row>
            <Row>
            <Col span={8}>
                <Button onClick={() => getMyBalance()} style={{marginRight: "10px"}}>Refresh</Button>
                Balance:
            </Col>
            <Col span={16}>{balance + " " + tokenSymbol}</Col>
            </Row>
        </Card>
    )
};

export default AccountCard;