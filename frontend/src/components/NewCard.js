import { Card } from 'antd';

const newCard = ({setPage}) => {
    return (
        <Card
            className="CreateAccount" 
            onClick={() => setPage("create")}
            hoverable
        >
            + Create Bank Account
        </Card> 
    )
};

export default newCard;