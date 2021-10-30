const { assert } = require('chai');

const Color = artifacts.require('./Color.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Color', (accounts) => {

    let contract;

    before(async () => {
        contract = await Color.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = contract.address
            console.log(address)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, 0x0)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await contract.name()
            assert.equal(name, 'Color')
        })

        it('has a symbol', async () => {
            const symbol = await contract.symbol()
            assert.equal(symbol, 'COLOR')
        })
    })

    describe('minting', async () => {
        let result;
        it('creates a new token', async () => {
            result = await contract.mint("#EC058E")
            const totalSupply = await contract.totalSupply()
            assert.equal(totalSupply, 1)
            const event = result.logs[0].args
            assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event.to, accounts[0], 'to is correct')

            await contract.mint("#EC058E").should.be.rejected;
        })
    })

    describe('indexing', async () => {
        it('lists colors', async () => {
            // mint three tokens
            await contract.mint("#8a2be2")
            await contract.mint("#856088")
            await contract.mint("#551a8b")

            const totalSupply = await contract.totalSupply()

            let color;
            let result = []

            for (let i = 1; i<= totalSupply; i++) {
                color = await contract.colors(i-1)
                result.push(color)
            }

            let expected = ["#EC058E","#8a2be2", "#856088","#551a8b"]
            assert.equal(result.join(','), expected.join(','))
        })
    })
})