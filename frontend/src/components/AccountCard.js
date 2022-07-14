import { Row, Col, Card, Button, } from 'antd';
import NumberFormat from 'react-number-format';

const AccountCard = ({balance, tokenSymbol, setPage, name, setCurrAccount}) => {
    const onFunction = (action) => {
        setCurrAccount(name);
        setPage(action);
    }

    return(
        <Card className="CardSolid" 
        actions={[
            <h3 onClick={() => onFunction("deposit")}>Deposit</h3>,
            <h3 onClick={() => onFunction("withdraw")}>Withdraw</h3>,
            <h3 onClick={() => onFunction("transfer")}>Transfer</h3>
        ]}
        >
            <Row>
            <Col span={8}>Account Name:</Col>
            <Col span={16}>{name}</Col>
            </Row>
            <Row>
            <Col span={8}>
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