// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721,ERC20
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


import "hardhat/console.sol";
import "./ERCPoint.sol";


contract BuyMyRoom is ERC721 {

    // use a event if you want
    // to represent time you can choose block.timestamp
    event HouseList(uint256 tokenId, uint256 price, address owner);
    event HouseDelist(uint256 tokenId, address owner);
    event HouseSell(uint256 tokenId, uint256 price, address seller, address buyer);

    // 房屋属性
    struct House {
        uint256 tokenId;                
        uint256 listedTimestamp;
        uint256 price;
        bool isListed;
        address owner;
    }

    address private deployer;
    uint256 private allocatedId = 0;
    mapping(uint256 => House) public houses;

    uint256 private feeRate = 2; // 手续费比例 2‰(较高比例帮助快速交易)

    ERCPoint public ercPoint;


    constructor() ERC721("BuyMyRoom", "BYMR") {
        // maybe you need a constructor
        deployer = msg.sender;
        ercPoint = new ERCPoint();
    }

    // 创建房屋
    function create_house(address owner) public returns(uint256) {
        require(deployer == msg.sender, "Invalid deployer");
        
        // 分配新的 ID
        uint256 newId = allocatedId ++;
        _safeMint(owner, newId);

         // 创建房屋并存储信息
        houses[newId] = House({
            tokenId: newId,
            listedTimestamp: 0,
            price: 0 ,
            owner: owner,
            isListed: false
            
        });

        return newId;
    }
    
    // 获取我的房屋列表
    function get_myHouses() public view returns(House[] memory) {
        uint count = 0;
    
        // 计算用户拥有的房屋数量
        for (uint i = 0; i < allocatedId; i++) {
            if (houses[i].owner == msg.sender) {
                count++;
            }
        }
    
        // 创建房屋数组
        House[] memory myhouses = new House[](count);
        uint counter = 0;
    
        // 收集用户拥有的房屋信息
        for (uint i = 0; i < allocatedId; i++) {
            if (houses[i].owner == msg.sender) {
                myhouses[counter++] = houses[i]; 
            }
        }
        return myhouses;
    }

    // 获取已上架房屋列表
    function get_Houses_onList() public view returns(House[] memory) {
        uint count = 0;
    
        // 计算已上架房屋的数量
        for (uint i = 0; i < allocatedId; i++) {
            if (houses[i].isListed) {
                count++;
            }
        }
    
        // 创建已上架房屋数组
        House[] memory houses_onlist = new House[](count);
        uint counter = 0;
    
        // 收集已上架房屋信息
        for (uint i = 0; i < allocatedId; i++) {
            if (houses[i].isListed) {
                houses_onlist[counter++] = houses[i]; // 直接引用
            }
        }
        return houses_onlist;
    }

    // 上架房屋
    function list_House(uint256 tokenId, uint256 price) public {
        require(houses[tokenId].owner == msg.sender, "You are not the owner of this house");
        houses[tokenId].price = price;
        houses[tokenId].isListed = true;
        houses[tokenId].listedTimestamp = block.timestamp;
        emit HouseList(tokenId, price, msg.sender);
    }

    // 下架房屋
    function delist_House(uint256 tokenId) public {
        require(houses[tokenId].owner == msg.sender, "You are not the owner of this house");
        houses[tokenId].price = 0;
        houses[tokenId].isListed = false;
        houses[tokenId].listedTimestamp = 0;
        emit HouseDelist(tokenId, msg.sender);
    }

    // 购买房屋
   function buy_House(uint256 tokenId) public payable{
    // 获取房屋价格和卖家地址
    uint256 price = houses[tokenId].price;
    address seller = houses[tokenId].owner;

    // 确保发送的以太币金额正确
    require(msg.value >= price * 1 ether, "Insufficient funds sent");

    // 计算手续费
    uint256 fee = (block.timestamp - houses[tokenId].listedTimestamp) * feeRate * price / 1000;
    // 确保手续费不超过价格
    if (fee > price) fee = price;

    uint256 amount = price - fee;

    // 转移房屋所有权
    _transfer(seller, msg.sender, tokenId);

    // 支付给卖家和开发者
    payable(seller).transfer(amount * 1 ether);
    payable(deployer).transfer(fee * 1 ether);

    // 更新房屋信息
    houses[tokenId].owner = msg.sender;
    houses[tokenId].isListed = false;
    houses[tokenId].listedTimestamp = 0;
    houses[tokenId].price = 0;

    // 发出销售事件
    emit HouseSell(tokenId, price, seller, msg.sender);
    }


    // 使用ERCPoint购买房屋
    function buy_HouseWithPoint(uint256 tokenId) public {
        uint256 price = houses[tokenId].price;
        address seller = houses[tokenId].owner;

        uint256 fee = (block.timestamp - houses[tokenId].listedTimestamp) * feeRate * price / 1000;
        if (fee > price) fee = price;
        uint256 amount = price - fee;

        // 所有权转移
        _transfer(seller, msg.sender, tokenId);
        // 支付
        ercPoint.transferFrom(msg.sender, seller, amount);
        ercPoint.transferFrom(msg.sender, deployer, fee);

        houses[tokenId].owner = msg.sender;
        houses[tokenId].isListed = false;
        houses[tokenId].listedTimestamp = 0;
        houses[tokenId].price = 0;

        emit HouseSell(tokenId, price, seller, msg.sender);
    }


 
}