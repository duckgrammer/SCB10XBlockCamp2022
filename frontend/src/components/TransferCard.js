import { Card } from 'antd';
import { useState } from "react";
import OwnAccount from './OwnAccount';
import OthersAccount from './OthersAccount';
import '../App.css';

const TransferCard = ({tokenSymbol, transfer, myTransfer}) => {
    const [activeTab, setActiveTab] = useState('OwnAccount');

    const tabList = [
        {
          key: 'OwnAccount',
          tab: 'Own Account',
        },
        {
          key: 'OthersAccount',
          tab: 'Others Account',
        },
    ];

    const contentList = {
        OwnAccount: <OwnAccount myTransfer={myTransfer} tokenSymbol={tokenSymbol}/> ,
        OthersAccount: <OthersAccount transfer={transfer} tokenSymbol={tokenSymbol}/>,
    };

    const onTabChange = (key) => {
        setActiveTab(key);
    };

    return(
        <>
            <Card className="CardSolid"
                tabList={tabList}
                activeTabKey={activeTab}
                onTabChange={(key) => {
                    onTabChange(key);
                }}
            >
                {contentList[activeTab]}
            </Card>
            <ul className="disclaimer">
                <li>1% fee, If you transfer to other account</li>
                <li>No fee, If you transfer to your account</li>
            </ul>
        </>
    )
};

export default TransferCard;