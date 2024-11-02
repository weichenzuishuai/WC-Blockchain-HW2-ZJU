import { useState } from "react";
import { BMRContract } from "../utils/contracts";
import { Button, message, Select } from "antd";

//@ts-ignore
const CreateHouse = ({account, accounts}) => {

  const [toAccount, setToAccount] = useState<string>(''); // 转账目标地址

  const createHouse = async () => {
    try {
      const result = await BMRContract.methods.createHouse(toAccount).send({ from: account });
      console.log(result);
      message.success('Create House Success');
    } catch (error: any) {
      message.error(error.message);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>创建房屋</h1>
        <p style={{ textAlign: 'center', color: '#666' }}>注意：合约部署者(账户[0])才可以创建房屋</p>
        
        <div style={{ marginBottom: '20px' }}>
            <Select
                style={{ width: '100%' }}
                value={toAccount}
                onChange={(value: string) => setToAccount(value)}
                options={accounts.map((item: any) => ({ value: item }))}
                placeholder="选择账户"
            />
        </div>

        <Button 
            type="primary" 
            onClick={createHouse} 
            style={{ 
              width: '100%', 
              fontSize: '16px', 
              padding: '10px', 
              backgroundColor: '#2c1b0c', 
              borderColor: '#404040', 
              color: '#fff' 
          }}
        >
            创建房屋
        </Button>
    </div>
  );

}

export default CreateHouse;