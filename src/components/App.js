import React, {Component} from 'react';
import Web3 from 'web3';
import Color from '../build/contracts/Color.json'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            contract: null,
            totalSupply: 0,
            colors: [],
            item: ''
        }
    }

    async componentDidMount() {
        await this.loadWeb3()
        await this.loadBlockChainData()
    }

    async loadWeb3() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider Metamask!')
        }
    }

    async loadBlockChainData() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})

        const networkId = await web3.eth.net.getId() //gets the current network id.
        const networkData = Color.networks[networkId]
        if(networkData) {
            const abi= Color.abi
            const address = networkData.address
            const contract = new web3.eth.Contract(abi, address)
            this.setState({contract})
            const totalSupply = await contract.methods.totalSupply().call()
            this.setState({totalSupply})
            for(let i = 1; i<=totalSupply; i++) {
                const color = await contract.methods.colors(i-1).call()
                this.setState({
                    colors: [...this.state.colors, color]
                })
            }
        } else {
            window.alert('Contract is not deployed to detected network!')
        }
        
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.state.contract.methods.mint(this.state.item).send({from: this.state.account})
        .on('receipt', (receipt) => {
            this.setState({
                colors: [...this.state.colors, this.state.item]
            })
            console.log(receipt)
        })
    }

    render() {
        return (
            <>
                <header>
                    <h1>Color Tokens!</h1>
                    <h3>Account: {this.state.account}</h3>
                </header>
                <main>
                    <section>
                        <h4>Issue Token</h4>
                        <form 
                        onSubmit={this.handleSubmit}
                        style={{paddingBottom: "15px"}}>
                            <input 
                            type="text"
                            placeholder='e.g. #FFFFFF'
                            value={this.state.item}
                            name="color"
                            onChange={(e) => {this.setState({item: e.target.value})}} 
                            />
                            <input 
                            type='submit'
                            value='MINT'
                            />
                        </form>
                    </section>
                    {this.state.colors.map((color, key) => (
                        <section key={key}>
                            <div style={{backgroundColor: color, width: "50px", height: "50px"}}></div>
                            <h4>{color}</h4>
                        </section>
                    ))}

                </main>
            </>
        )
    }
}

export default App;