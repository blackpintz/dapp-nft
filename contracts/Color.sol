//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Color is ERC721, ERC721Enumerable {
    string[] public colors;
    mapping(string => bool) _colorExists;
    constructor()
    public
    ERC721("Color", "COLOR") {}

    function _beforeTokenTransfer(address from, address to, uint amount)
    internal virtual override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function supportsInterface(bytes4 interfaceId)
    public view override(ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mint(string memory _color) public {
        require(!_colorExists[_color], "The token for that color hex is already created!");
        colors.push(_color);
        uint _id = colors.length;
        _mint(msg.sender, _id);
        _colorExists[_color] = true;
    }
}