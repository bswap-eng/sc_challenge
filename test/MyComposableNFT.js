const { ethers } = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");

const { AddressZero, MaxUint256 } = ethers.constants;

const ADDRESS_ZERO = AddressZero;
const MAX_UINT_256 = MaxUint256;

const ether = amount => {
  const weiString = ethers.utils.parseEther(amount.toString());
  return BigNumber.from(weiString);
};

describe("MyComposableNFT", () => {
  let deployer;
  let minter1;
  let minter2;
  let minter3;

  before(async () => {
    [deployer, minter1, minter2, minter3] = await ethers.getSigners();

    MyComposableNFT = await ethers.getContractFactory("MyComposableNFT");
    myComposableNFT = await MyComposableNFT.deploy();

    MyERC20 = await ethers.getContractFactory("MyERC20");
    myERC20 = await MyERC20.deploy();

    await myComposableNFT.connect(minter1).mint(minter1.address, 0);
    // await myComposableNFT.connect(minter2).mint(minter2.address, 1);
    // await myComposableNFT.connect(minter3).mint(minter3.address, 2);

    await myERC20.connect(minter1).mint(minter1.address, ether(10));
    // await myERC20.connect(minter2).mint(minter2.address, ether(10));
    // await myERC20.connect(minter3).mint(minter3.address, ether(10));

    await myERC20.connect(minter1).approve(myComposableNFT.address, MAX_UINT_256);
    await myERC20.connect(minter2).approve(myComposableNFT.address, MAX_UINT_256);
    await myERC20.connect(minter3).approve(myComposableNFT.address, MAX_UINT_256);
  });

  describe("getERC20", async () => {
    it("minter1: should fail when get erc20 from minter2", async () => {
      await expect(
        myComposableNFT.connect(minter1).getERC20(minter2.address, 0, myERC20.address, ether(10)),
      ).to.be.revertedWith("Not allowed to getERC20");
    });

    it("minter1: should success when get erc20 from minter1", async () => {
      await myComposableNFT.connect(minter1).getERC20(minter1.address, 0, myERC20.address, ether(10));
      expect(await myComposableNFT.balanceOfERC20(0, myERC20.address)).to.equal(ether(10));
      expect(await myComposableNFT.totalERC20Contracts(0)).to.equal(BigNumber.from(1));
      expect(await myComposableNFT.erc20ContractByIndex(0, 0)).to.equal(myERC20.address);
    });
  });

  describe("transferERC20", async () => {
    it("should fail when minter2 transfer minter1's erc20", async () => {
      await expect(
        myComposableNFT.connect(minter2).transferERC20(0, minter2.address, myERC20.address, ether(5)),
      ).to.be.revertedWith("ERC721 transfer caller is not owner nor approved");
    });

    it("minter1 transfer erc20 to minter2", async () => {
      await myComposableNFT.connect(minter1).transferERC20(0, minter2.address, myERC20.address, ether(5));
      expect(await myERC20.balanceOf(minter2.address)).to.equal(ether(5));
    });
  });

  describe("NFT transfer", async () => {
    it("minter1 transfer nft#0 to minter3 with erc20 token", async () => {
      await myComposableNFT
        .connect(minter1)
        ["safeTransferFrom(address,address,uint256)"](minter1.address, minter3.address, 0);
      expect(await myComposableNFT.balanceOf(minter1.address)).to.equal(0);
      expect(await myComposableNFT.balanceOf(minter3.address)).to.equal(1);
      expect(await myComposableNFT.tokenOfOwnerByIndex(minter3.address, 0)).to.equal(0);
      expect(await myComposableNFT.balanceOfERC20(0, myERC20.address)).to.equal(ether(5));
    });
  });

  describe("removeERC20", async () => {
    it("minter3 transfer all erc20 in nft#0 to minter1, and remove erc20", async () => {
      await myComposableNFT.connect(minter3).transferERC20(0, minter1.address, myERC20.address, ether(5));
      expect(await myComposableNFT.totalERC20Contracts(0)).to.equal(BigNumber.from(0));
    });
  });
});
