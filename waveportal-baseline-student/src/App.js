import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/MegaWavePortal.json'

import twitterLogo from './assets/twitter-logo.svg';
import openseaLogo from './assets/Opensea-Logo.svg';
import nftLogo from './assets/chaos.png';

// Constants
const TWITTER_HANDLE = 'web3blackguy';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_HANDLE = 'web3blackguy';
const OPENSEA_LINK = `https://opensea.io/${OPENSEA_HANDLE}`;
const NFT_MINT_LINK = 'https://nft-starter-repo-final.richardbankole.repl.co'
const CONTRACT_ADDRESS = '0xcDcB91296a20cCda566624A3901cdC2F99D584e7'
const CONTRACT_ABI = abi.abi

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("")
  const [waveReceived, handleWave] = useState("")
  const [allWaves, setAllWaves] = useState([])
  const [numOfWaves, getTotalWaves] = useState("")
  const [superInput, setSuperInput] = useState('Hey!');
  const [clicked, setSuperClicked] = useState('no')
  const [moneyClicked, setMoneyClicked] = useState('no')
  const [displayTable, tableToggle] = useState("hide")
  const [waveTable, setWaveTable] = useState({})

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have Metamask!")
        return
      } else {
        console.log("We have the ethereum object", ethereum)
      }


      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account)
        setCurrentAccount(account)
        getAllWaves()
      } else {
        console.log("No authorized account found!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectToWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!")
        return
      }


      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      console.log("Connected!", accounts[0])
      setCurrentAccount(accounts[0])
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");}
    } catch (error) {
      console.log(error);
    }
  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

        const waves = await wavePortalContract.getAllWaves()

        let ethUsdRate = await wavePortalContract.getEthUsdRate(1)

        // ethers.js automatically checks that the forward resolution matches.

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            sender: wave.sender,
            waveType: wave.waveType,
            message: wave.message,
            amountSentInWei: wave.amountSentInWei.toLocaleString(),
            amountSentInUsd: ((wave.amountSentInWei / 10**18) * ethUsdRate).toFixed(2),
            timestamp: new Date(wave.timestamp * 1000)
          })
        })

        setAllWaves(wavesCleaned);

        // wavePortalContract.on("NewWave", (
        // from,
        // receiver,
        // waveType,
        // message,
        // amountSentInWei,
        // timestamp
        // ) => {console.log(
        //   from,
        // receiver,
        // waveType,
        // message,
        // amountSentInWei,
        // timestamp
        // );

        // setAllWaves(prevState => [...prevState, {
        //   sender: wave.sender,
        //   waveType: wave.waveType,
        //   message: wave.message,
        //   amountSentInWei: wave.amountSentInWei,
        //   amountSentInUsd: ((wave.amountSentInWei / 10**18) * ethUsdRate).toFixed(2),
        //   timestamp: new Date(wave.timestamp * 1000)
        // }]);
        // });

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count:", count.toNumber());
        getTotalWaves(count.toLocaleString())
      } else {
        console.log("Ethereum object does not exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

        const waveTxn = await wavePortalContract.wave()
        console.log("Mining... ", waveTxn.hash)
        handleWave("sending")

        await waveTxn.wait()
        console.log("Mined... Txn hash: ", waveTxn.hash)
        handleWave("received")
        on()

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count:", count.toNumber());
        getTotalWaves(count.toLocaleString())
      } else {
        console.log("Ethereum object does not exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const superWave = async (message) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

        const waveTxn = await wavePortalContract.superWave(message)
        console.log("Mining... ", waveTxn.hash)
        handleWave("sendingSuper")

        await waveTxn.wait()
        console.log("Mined... Txn hash: ", waveTxn.hash)
        handleWave("received")
        on()

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count:", count.toNumber());
        getTotalWaves(count.toLocaleString())
        setSuperClicked('no')
      } else {
        console.log("Ethereum object does not exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const moneyWave = async (message, usdValue) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

        let ethUsdRate = await wavePortalContract.getEthUsdRate(1)
        let convertedAmount = (1 / ethUsdRate) * usdValue
        let ethToWei = convertedAmount * 10**18
        let val = ethToWei.toString()
        console.log("Converted amount: ", val)
        
        const waveTxn = await wavePortalContract.moneyWave(message, { value: val })
        console.log("Mining... ", waveTxn.hash)
        handleWave("sendingMoney")

        await waveTxn.wait()
        console.log("Mined... Txn hash: ", waveTxn.hash)
        handleWave("received")
        on()

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count:", count.toNumber());
        getTotalWaves(count.toLocaleString())
        setMoneyClicked('no')
      } else {
        console.log("Ethereum object does not exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const waveCount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

        let numOfWaves = await wavePortalContract.getTotalWaves();
        getTotalWaves(numOfWaves.toLocaleString())
        console.log("Retrieved total waves: ", numOfWaves.toLocaleString())
        setWaveTable(wavesTable)
      } else {
        console.log("Ethereum object does not exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  class SuperWaveInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write your Super Wave message.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log("Submitting: ", this.state.value)
    superWave(this.state.value);
    event.preventDefault();
  }

  render() {return (
      <>
      <PrizePreamble />     
      <div className="inputForm">
      <form onSubmit={this.handleSubmit}>
        <label>
          Write your message here:<br /><br />
          <textarea value={this.state.value} onChange={this.handleChange} className="inputBox"/>
        </label>
        <input type="submit" value="Send Super Wave" className="superWaveInput"/>
      </form>
      </div>
      </>
    )};
  }
  
  function on() {
    document.getElementById("overlay").style.display = "block";
  }

  function off() {
    document.getElementById("overlay").style.display = "none";
  }


  class PrizePreamble extends React.Component {
    render () {return (
      <div className="prize">
        <p className="bio">{moneyClicked === 'yes' && "A money wave - we love to see it!"} {clicked === 'yes' && "Nice! Why wave when you can Super Wave?"} {clicked === 'yes' ? <><br /><br /></> : moneyClicked === 'yes' ? <><br /><br /></> : <br />}In recognition of your {moneyClicked === 'yes' && "generosity"} {clicked === 'yes' && "bravery (and/or curiosity)"}, you have a {moneyClicked === 'yes' && <b>50% chance of winning <u>0.1 ETH</u> and 66% chance of winning <u>0.05 ETH</u> </b>} {clicked === 'yes' && <b>10% chance of winning <u>0.1 ETH</u> and 50% chance of winning <u>0.0025 ETH</u> </b>}when your wave is processed - good luck!</p>
      </div>
    )
  }}

  class MoneyWaveInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Please add your Money Wave message here",
      amount: 0.00
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    console.log("Submitting money wave: ", this.state.amount, "+", this.state.message)
    moneyWave(this.state.message, this.state.amount);
    event.preventDefault();
  }

  render() {
    return (
      <>
      <PrizePreamble />
      <div className="inputForm">
      <form onSubmit={this.handleSubmit}>
        <label>
          Write a message:
          <textarea
            className="inputBox"
            name="message"
            value={this.state.message}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Insert Amount ($):
          <input
            className="inputBox"
            name="amount"
            type="number"
            value={this.state.amount}
            onChange={this.handleInputChange} />
        </label>
        <input type="submit" value="Send Money Wave 💰" className="golden-btn-input"/>
      </form>
      </div>
      </>
    );
  }
}


class DisplayTable extends React.Component {
 render() {
    return (
        <table style={{ backgroundColor: "white", marginTop: "16px", padding: "8px" }}><thead>
        <tr>
          <th>ID</th>
          <th>Sender</th>
          <th>Wave Type</th>
          <th>Message</th>
          <th>Amount (USD)</th>
          <th>Amount (ETH)</th>
          <th>Time</th>
        </tr></thead>
        <tbody>
          {wavesTable}
        </tbody>
      </table>
  )}
  }




  const wavesTable = allWaves.map((wave, index) => { 
          console.log(wave.waveType, "-", index);
          return (
              <tr>  
                <td>{index + 1}</td>
                <td>{wave.sender}</td>
                <td>{wave.waveType === "super" && "Super Wave"}{wave.waveType === "money" && "Money Wave"}{wave.waveType === "standard" && "Wave"}</td>
                <td>{wave.message}</td>
                <td>{wave.amountSentInUsd !== "0.00" ? "$" + wave.amountSentInUsd : "N/A"}</td>
                <td>{(wave.amountSentInWei / 10**18).toFixed(6) !== "0.000000" ? (wave.amountSentInWei / 10**18).toFixed(6) + " ETH" : "N/A"}</td>
                <td>{wave.timestamp.toLocaleString()}</td>
              </tr>
          )
        })

  useEffect(() => {
    checkIfWalletIsConnected();
    waveCount();
  }, [])

  const toggleTable = () => {
    displayTable === "hide" ? tableToggle("show") : tableToggle("hide")
  }

  const toggleSuperInput = () => {
    clicked === "yes" ? setSuperClicked("no") : setSuperClicked("yes")
  }

  const toggleMoneyInput = () => {
    moneyClicked === "yes" ? setMoneyClicked("no") : setMoneyClicked("yes")
  }

  return (
    <div>
    {waveReceived === "received" && (<div id="overlay" onClick={off}>
          <div id="overlayText" className="overlayGreeting overlayGreetingText"><b>Thanks!</b></div>
          <div id="overlayText" className="overlayGreeting overlayGreetingText">
          <span><center><br /><br /><br />Click anywhere<br />to exit</center></span></div>
        </div>)}
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header animate__animated animate__fadeInDown">
          👋🏿 Hey there! <br />Welcome to rbank.eth's wonderland
        </div>

        <div className="bio animate__animated animate__fadeInLeft animate__delay-1s">
          I am Richard and I'm making <b>major</b> strides towards becoming a full stack Web3 developer - that's pretty cool right? <br /><br />Connect your Ethereum wallet and come say hi! 
          <span className="caveat"><br />(psst! A little birdy told me you get some ETH with every wave..</span> 😉<span className="caveat"><i>)</i></span>
        </div>

        {currentAccount && (
        <div className="connectedButton">
          <button className="waveButton" onClick={() => {
            wave();
          }}>
            {waveReceived === "sending" ? <span className="loading">Sending wave</span> : "Wave at Me 👋"}
          </button>
        <div className="divider"/>
          <button className="superWaveButton" onClick={() => {
            toggleSuperInput();
            {moneyClicked === 'yes' && toggleMoneyInput()}
          }}>
            {waveReceived === "sendingSuper" ? <span className="loading">Sending wave</span> : "Super Wave at Me 👋 ✍️"}
          </button>
        <div className="divider2"/>
        <button className="golden-btn" onClick={() => {
          toggleMoneyInput();
          {clicked === 'yes' && toggleSuperInput()}
        }}>
          {waveReceived === "sendingMoney" ? <span className="loading">💰 Sending wave</span> : "🤑👋 Money Wave at Me 👋🤑"}
        </button>
        </div>
        )}

        {!currentAccount && (
          <button className="waveButton" onClick={connectToWallet}>
            Connect Wallet 🔑
        </button>
        )}

        {clicked !== 'no' && (
          <SuperWaveInput />
          )}
        {moneyClicked !== 'no' && (
          <MoneyWaveInput />
          )}

        {currentAccount && (
          <p className="waveCount" onClick={waveCount}>
            <b>{numOfWaves} {numOfWaves === "1" ? "person has" : "people have"} said 'Hi' so far!</b><br /><br />{currentAccount && (
          <span className="waveTable" onClick={toggleTable}>
            Click me to see who!
          </span>
        )}
          </p>
        )}

        {displayTable === 'show' && (<DisplayTable />)}

        <div className="footer-container">
          <div className="footer-container-twit">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a
              className="footer-text-twit"
              href={TWITTER_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >{`built by @${TWITTER_HANDLE}`}</a><img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} /></div>

          <div className="footer-container-nft">
            <img alt="Opensea Logo" className="footer-logo" src={openseaLogo} />
            <a
              className="footer-text"
              href={OPENSEA_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >{"Check out my NFTs!"}</a>
            <img alt="Opensea Logo" className="footer-logo" src={openseaLogo} />
          </div>

          <div className="footer-container-nft">
            <img alt="Opensea Logo" className="footer-logo" src={nftLogo} />
            <a
              className="footer-text"
              href={NFT_MINT_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >{"..or mint one instead 😉"}</a>
            <img alt="Opensea Logo" className="footer-logo" src={nftLogo} />
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default App;
