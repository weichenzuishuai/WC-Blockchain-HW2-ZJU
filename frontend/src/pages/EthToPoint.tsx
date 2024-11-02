import { Button, Card, Form, Input, message } from "antd";
import { useState } from "react";
import { web3, BMRContract, ERCContract } from '../utils/contracts';

// @ts-ignore
const EthToPoint = ({ account, setPoint }) => {

  const [inputPoint1, setInputPoint1] = useState<number>(0);
  const [inputPoint2, setInputPoint2] = useState<number>(0);

  const [curKey, setCurKey] = useState<string>('tab1');

  const getMyPoints = async () => {
    try {
      const result: number = await ERCContract.methods.getMyPoints().call({ from: account })
      setPoint(result.toString())
      console.log(result.toString())
    } catch (error: any) {
      message.error('获取积分失败，请检查网络连接或联系管理员')
    }
  }

  const buyPoints = async () => {
    try {
      await ERCContract.methods.EthToPoints().send({ from: account, value: web3.utils.toWei(inputPoint1.toString(), 'ether') });
      await getMyPoints();
      message.success('兑换成功');
    } catch (error) {
      message.error('兑换失败，请检查或稍后再试');
    }
  }
  const sellPoints = async () => {
    try {
      await ERCContract.methods.PointsToEth(inputPoint2).send({ from: account });
      await getMyPoints();
      message.success('出售成功');
    } catch (error) {
      message.error('出售失败，请检查或稍后再试');
    }
  }

  return (
    <>
      <h1 style={{ textAlign: 'center', margin: '20px 0', fontWeight: 'normal', color: '#333' }}>1 ETH = 1 POINT</h1>
      <Card
        style={{
          width: '50%',
          margin: 'auto',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
          <span
            onMouseEnter={(e) => (e.currentTarget.style.color = 'brown')}
            onMouseLeave={(e) => (e.currentTarget.style.color = curKey === 'tab1' ? 'brown' : 'inherit')}
            onClick={() => setCurKey('tab1')}
            style={{
              color: curKey === 'tab1' ? 'brown' : 'inherit',
              padding: '10px',
              cursor: 'pointer',
            }}
          >
            兑换积分
          </span>
          <span
            onMouseEnter={(e) => (e.currentTarget.style.color = 'brown')}
            onMouseLeave={(e) => (e.currentTarget.style.color = curKey === 'tab2' ? 'brown' : 'inherit')}
            onClick={() => setCurKey('tab2')}
            style={{
              color: curKey === 'tab2' ? 'brown' : 'inherit',
              padding: '10px',
              cursor: 'pointer',
            }}
          >
            出售积分
          </span>
        </div>
        <div style={{ borderBottom: '2px solid brown', marginBottom: '10px' }} />
        {curKey === 'tab1' ? (
          <Form labelCol={{ span: 7 }} style={{ padding: '20px' }}>
            <Form.Item label="要兑换的积分数量">
              <Input
                value={inputPoint1}
                onChange={(e) => setInputPoint1(Number(e.target.value))}
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
            <Form.Item label="所需要 eth 的数量">
              <Input value={inputPoint1} disabled style={{ borderRadius: '8px' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" style={{ float: 'right', borderRadius: '8px',backgroundColor: '#2c1b0c' }} onClick={buyPoints}>
                兑换
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form labelCol={{ span: 7 }} style={{ padding: '20px' }}>
            <Form.Item label="要卖出的积分数量">
              <Input
                value={inputPoint2}
                onChange={(e) => setInputPoint2(Number(e.target.value))}
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
            <Form.Item label="能得到 eth 的数量">
              <Input value={inputPoint2} disabled style={{ borderRadius: '8px' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" style={{ float: 'right', borderRadius: '8px',backgroundColor: '#2c1b0c' }} onClick={sellPoints}>
                卖出
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </>
  );
  
  
  
  
}

export default EthToPoint;