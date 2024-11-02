import { useState, useEffect } from 'react';
import { message, Select, theme } from 'antd';
import { Layout, Menu } from 'antd';
import { web3, BMRContract, ERCContract } from '../utils/contracts';  // 从 utils/contracts.js 中导入 web3 和合约实例
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import MyHouses from './MyHouse';
import ListedHouses from './ListedHouses';
import CreateHouse from './CreateHouse';
import EthToPoint from './EthToPoint';

// Ganache 网络配置
const GanacheTestChainId = '0x539';
const GanacheTestChainName = 'Ganache Test Chain';
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545';

const { Header, Content, Sider } = Layout;


function NavigationMenu() {
  const navigate = useNavigate();

  return (
    <Menu
      mode="inline"
      style={{ height: '100%', borderRight: 0 }}
    >
      <Menu.Item key="0" onClick={() => navigate('/myHouses')}>
        我的房屋
      </Menu.Item>
      <Menu.Item key="1" onClick={() => navigate('/listedHouses')}>
        购买房屋
      </Menu.Item>
      <Menu.Item key="2" onClick={() => navigate('/createHouse')}>
        创建房屋
      </Menu.Item>
      <Menu.Item key="3" onClick={() => navigate('/ethToPoints')}>
        积分兑换
      </Menu.Item>
    </Menu>
  );
}


const BMRPage = () => {
  const [account, setAccount] = useState<string>(''); // 当前连接的钱包地址
  const [accounts, setAccounts] = useState<string[]>([]); // 所有可用的账户
  const [point, setPoint] = useState<string>('0'); // 当前账户的积分

  const initCheckAccounts = async () => {
    // @ts-ignore
    const { ethereum } = window;
    if (Boolean(ethereum && ethereum.isMetaMask)) {
      const accounts = await web3.eth.getAccounts()
      if (accounts && accounts.length) {
        setAccount(accounts[0])
      }
    }
  }

  const connectWallet = async () => {
    // @ts-ignore
    const { ethereum } = window;
    if (!Boolean(ethereum && ethereum.isMetaMask)) {
      alert('MetaMask is not installed!');
      return
    }
    try {
      if (ethereum.chainId !== GanacheTestChainId) {
        const chain = {
          chainId: GanacheTestChainId, // Chain-ID
          chainName: GanacheTestChainName, // Chain-Name
          rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
        };
        try {
          await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: chain.chainId }] })
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await ethereum.request({
              method: 'wallet_addEthereumChain', params: [chain]
            });
          }
        }
      }
      await ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      setAccounts(accounts);
      setAccount(accounts[0] || 'Not able to get accounts');
    } catch (error: any) {
      alert(error.message)
    }
  }

  const getMyPoints = async () => {
    try {
      const result: number = await ERCContract.methods.getMyPoints().call({ from: account })
      setPoint(result.toString())
    } catch (error: any) {
      message.error('获取积分失败，请检查网络连接或联系管理员')
    }
  }

  useEffect(() => {
    initCheckAccounts()
    connectWallet()
  }, [])
  useEffect(() => {
    if (account) {
      getMyPoints()
    }
  }, [account])

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
      <Layout style={{ backgroundColor: '#f5f5f7', minHeight: '100vh' }}>
        <Header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', backgroundColor: '#2c1b0c' }}>
          <h1 style={{ fontSize: '24px', margin: 0 }}>去中心化房屋购买系统</h1>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff', borderRight: '1px solid #ddd' }}>
            <NavigationMenu />
          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content
              style={{
                padding: '24px',
                margin: 0,
                minHeight: 600,
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              {account && (
                <Routes>
                  <Route path="/" element={<MyHouses account={account} />} />
                  <Route path="/myHouses" element={<MyHouses account={account} />} />
                  <Route path="/listedHouses" element={<ListedHouses account={account} setPoint={setPoint} />} />
                  <Route path="/createHouse" element={<CreateHouse account={account} accounts={accounts} />} />
                  <Route path="/ethToPoints" element={<EthToPoint account={account} setPoint={setPoint} />} />
                </Routes>
              )}
            </Content>
          </Layout>
        </Layout>
        <Layout.Footer style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px 24px', background: '#2c1b0c', color: '#fff' }}>
          <span style={{ fontSize: '16px' }}>当前登录账户：</span>
          <Select
            style={{ width: 360, marginLeft: '20px' }}
            value={account}
            onChange={(value: string) => { setAccount(value) }}
            options={accounts.map((item) => ({ value: item }))}
          />
          <span style={{ marginLeft: '20px', fontSize: '16px' }}>积分: {point}</span>
        </Layout.Footer>
      </Layout>
    </Router>
  );
  
};

export default BMRPage;
