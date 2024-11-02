import { ethers } from "hardhat";

async function main() {
  // 获取合约工厂
  const BuyMyRoom = await ethers.getContractFactory("BuyMyRoom");
  
  // 部署合约
  const buyMyRoom = await BuyMyRoom.deploy();
  await buyMyRoom.deployed();
  
  // 输出合约地址
  console.log(`BuyMyRoom deployed to ${buyMyRoom.address}`);

  // 调用合约方法并输出结果
  const ercPoint = await buyMyRoom.ercPoint();
  console.log(`ERCPoint deployed to ${ercPoint}`);
}

// 调用主函数并处理错误
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
