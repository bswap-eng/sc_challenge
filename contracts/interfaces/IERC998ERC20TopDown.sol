// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

interface IERC998ERC20TopDown {
    event ReceivedERC20(
        address indexed _from,
        uint256 indexed _tokenId,
        address indexed _erc20Contract,
        uint256 _value
    );
    event TransferERC20(uint256 indexed _tokenId, address indexed _to, address indexed _erc20Contract, uint256 _value);

    function tokenFallback(
        address _from,
        uint256 _value,
        bytes memory _data
    ) external;

    function balanceOfERC20(uint256 _tokenId, address __erc20Contract) external view returns (uint256);

    function transferERC20(
        uint256 _tokenId,
        address _to,
        address _erc20Contract,
        uint256 _value
    ) external;

    function transferERC223(
        uint256 _tokenId,
        address _to,
        address _erc223Contract,
        uint256 _value,
        bytes memory _data
    ) external;

    function getERC20(
        address _from,
        uint256 _tokenId,
        address _erc20Contract,
        uint256 _value
    ) external;
}

interface IERC998ERC20TopDownEnumerable {
    function totalERC20Contracts(uint256 _tokenId) external view returns (uint256);

    function erc20ContractByIndex(uint256 _tokenId, uint256 _index) external view returns (address);
}

interface IERC20AndERC223 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success);

    function transfer(address to, uint256 value) external returns (bool success);

    function transfer(
        address to,
        uint256 value,
        bytes memory data
    ) external returns (bool success);

    function allowance(address _owner, address _spender) external view returns (uint256 remaining);
}
