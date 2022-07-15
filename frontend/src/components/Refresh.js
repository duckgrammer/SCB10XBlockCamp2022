import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const Refresh = ({connectBalance, refreshBalance}) => {
    return(
        <Button shape="circle" 
            loading={connectBalance}
            onClick={() => refreshBalance()} 
            style={{marginRight: "10px"}}
            icon={<ReloadOutlined />}
            type="primary"
        />
    )
}

export default Refresh;