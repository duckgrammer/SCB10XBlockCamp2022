import { Card } from 'antd';

const newCard = ({setPage}) => {
    return (
        <Card type="dashed" className="CreateAccount" onClick={() => setPage("create")}>
            + Create Bank Account
        </Card> 
    )
};

export default newCard;