import { Button } from 'antd';

const ConnectWallet = ({getTokenInfo, connectWallet, balanceInfo}) => {
    return(
        <Button onClick={() => getTokenInfo()} loading={connectWallet}>
            {balanceInfo.address === "-" ? "Connect Wallet" : balanceInfo.address}
        </Button>
    )
}

export default ConnectWallet;