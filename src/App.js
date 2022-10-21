import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";
import Web3 from "web3";
import {ethers} from "ethers";
import { useState } from "react";

const rpcNetwork = {
    rpcUrl : 'https://rpc-mumbai.maticvigil.com/',
    chainId : 80001,
}

const magic = new Magic(String(process.env.REACT_APP_MAGIC_PRIVATE_KEY), {
    network : rpcNetwork,
    extensions : [new ConnectExtension()]
})

const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
const web3 = new Web3(magic.rpcProvider);

export default function App() {

  const [amountToBeTransfered, setAmountToBeTransfered] = useState(null);
  const [publicAddress, setPublicAddress] = useState(null);
  const [receiverPublicAddress, setReceiverPublicAddress] = useState(null)

  const sendTransaction = async () => {
    const txnParams = {
      from: publicAddress,
      to: receiverPublicAddress,
      value: ethers.utils.parseEther(`${amountToBeTransfered}`),
    };
    setAmountToBeTransfered(null);
    web3.eth
      .sendTransaction(txnParams)
      .on("transactionHash", (hash) => {
        console.log("the txn hash that was returned to the sdk:", hash);
      })
      .then((receipt) => {
        console.log("the txn receipt that was returned to the sdk:", receipt);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const money = (event) => {
    setAmountToBeTransfered(event.target.value)
  }

  const receipent = (event) => {
    setReceiverPublicAddress(event.target.value)
  }

  const login = async () => {
    provider.listAccounts().then((publicAddress) => { setPublicAddress(publicAddress?.[0]) })
      .catch((error) => {
        console.log(error);
      });
  };

  const showWallet = () => {
    magic.connect.showWallet().catch((e) => {
      console.log(e);
    });
  };

  const disconnect = async () => {
    await magic.connect.disconnect().catch((e) => {
      console.log(e);
    });
    setPublicAddress(null);
  };

  return (
    <div className="app">
      <h2>Dark Guild</h2>
      {!publicAddress && ( <button  onClick={login} > Sign In </button> )}

      {publicAddress && (
        <>
          <button onClick={showWallet} >
            Show Wallet
          </button>
          <input type="text" onChange={receipent} placeholder="Enter the receipent address"/>
          <h1>{amountToBeTransfered}</h1>
          <button onClick={sendTransaction}>
            Send Transaction 
          </button><input type="number" onChange={money}  placeholder="Enter the amount to be transferred"/>
          <button onClick={disconnect} >
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}
